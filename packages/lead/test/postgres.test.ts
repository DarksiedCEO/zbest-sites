import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { postgresStore } from "../src/postgres";
import { DeliveryError } from "../src/types";

/**
 * Integration test against a REAL Postgres, run only when
 * LEAD_TEST_POSTGRES_URL points at a disposable database (it creates and
 * truncates the leads table). Skipped otherwise — and the report says so.
 */
const url = process.env.LEAD_TEST_POSTGRES_URL;

describe.skipIf(!url)("postgres store (integration)", () => {
  let sql: postgres.Sql;

  beforeAll(async () => {
    sql = postgres(url!, { max: 1, onnotice: () => {} });
    await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8"));
    // The migration is idempotent: applying it twice is a no-op.
    await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8"));
    await sql`TRUNCATE leads`;
  });
  afterAll(async () => {
    await sql?.end();
  });

  it("inserts once per submission_id, with services[] and source as columns", async () => {
    const store = postgresStore(url!);
    const id = randomUUID();
    const record = {
      submission_id: id,
      app: "zbm" as const,
      form: "start",
      payload: { name: "Ada", services: ["out-of-home"], nested: { a: 1 } },
      services: ["out-of-home", "tv-streaming"],
      source: "bb-i405",
      ip_hash: "h".repeat(64),
      user_agent: "UA",
    };
    const results = await Promise.all([store.insert(record), store.insert(record), store.insert(record)]);
    expect(results.filter((r) => r.inserted)).toHaveLength(1);

    const rows = await sql`SELECT * FROM leads WHERE submission_id = ${id}`;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      app: "zbm",
      form: "start",
      services: ["out-of-home", "tv-streaming"],
      source: "bb-i405",
      notify_status: "pending",
      payload: { name: "Ada", services: ["out-of-home"], nested: { a: 1 } },
    });

    await store.setNotifyStatus("zbm", id, "sent");
    const [after] = await sql`SELECT notify_status, notified_at FROM leads WHERE submission_id = ${id}`;
    expect(after!.notify_status).toBe("sent");
    expect(after!.notified_at).toBeInstanceOf(Date);
  });

  it("the same submission_id in the other app is a different lead (key is per app)", async () => {
    const store = postgresStore(url!);
    const id = randomUUID();
    const base = { submission_id: id, form: "x", payload: {}, services: [], source: null, ip_hash: null, user_agent: null };
    expect((await store.insert({ ...base, app: "zbm" })).inserted).toBe(true);
    expect((await store.insert({ ...base, app: "zbc" })).inserted).toBe(true);
    expect((await store.insert({ ...base, app: "zbc" })).inserted).toBe(false);
  });

  it("the table rejects an unknown app, and the error surfaces as a SQLSTATE only", async () => {
    const store = postgresStore(url!);
    const error = await store
      .insert({
        submission_id: randomUUID(),
        app: "nope" as "zbm",
        form: "x",
        payload: { secret: "PII-VALUE" },
        services: [],
        source: null,
        ip_hash: null,
        user_agent: null,
      })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DeliveryError);
    expect((error as DeliveryError).detail).toBe("23514");
    expect(String((error as Error).message)).not.toContain("PII-VALUE");
  });

  it("an unreachable database is a DeliveryError, not a hang", async () => {
    const store = postgresStore("postgres://nobody:nothing@127.0.0.1:1/none");
    const error = await store
      .insert({
        submission_id: randomUUID(),
        app: "zbm",
        form: "x",
        payload: {},
        services: [],
        source: null,
        ip_hash: null,
        user_agent: null,
      })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DeliveryError);
  }, 15_000);
});
