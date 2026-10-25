import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parsePostgresUrl } from "../src/pg-url";
import { postgresStore } from "../src/postgres";
import { payloadHash } from "../src/hash";
import { DeliveryError } from "../src/types";

/**
 * Integration test against a REAL Postgres, run only when
 * LEAD_TEST_POSTGRES_URL points at a disposable database (it creates and
 * truncates the leads table). Skipped otherwise — and the report says so.
 */
const url = process.env.LEAD_TEST_POSTGRES_URL;
/** A Neon-shaped URL (TLS required, SCRAM, channel_binding, percent-encoded password) for the same server, if provided. */
const neonShaped = process.env.LEAD_TEST_POSTGRES_NEON_URL;

const opts = (raw: string) => {
  const parsed = parsePostgresUrl(raw);
  if (!parsed.ok) throw new Error(`test URL refused: ${parsed.reason}`);
  return parsed.options;
};

describe.skipIf(!url)("postgres store (integration)", () => {
  let sql: postgres.Sql;

  beforeAll(async () => {
    sql = postgres(url!, { max: 1, onnotice: () => {} });
    await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8"));
    // The migration is idempotent: applying it twice is a no-op.
    await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8"));
    await sql`TRUNCATE leads`;
    // The Neon-shaped test below connects as a separate, TLS-only SCRAM role.
    await sql.unsafe(
      "DO $$ BEGIN IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'leadscram') THEN GRANT ALL ON leads TO leadscram; END IF; END $$",
    );
  });
  afterAll(async () => {
    await sql?.end();
  });

  it("inserts once per submission_id, with services[] and source as columns", async () => {
    const store = postgresStore(opts(url!));
    const id = randomUUID();
    const record = {
      submission_id: id,
      app: "zbm" as const,
      form: "start",
      payload: { name: "Ada", services: ["out-of-home"], nested: { a: 1 } },
      payload_hash: payloadHash({ name: "Ada" }),
      services: ["out-of-home", "tv-streaming"],
      source: "bb-i405",
      ip_hash: "h".repeat(64),
      user_agent: "UA",
    };
    const results = await Promise.all([store.insert(record), store.insert(record), store.insert(record)]);
    expect(results.filter((r) => r.inserted)).toHaveLength(1);
    expect(results.filter((r) => !r.inserted && r.samePayload)).toHaveLength(2);
    // Same id, changed content: reported as a conflict, never stored over the first.
    expect(await store.insert({ ...record, payload: { name: "Edited" }, payload_hash: payloadHash({ name: "Edited" }) })).toEqual({
      inserted: false,
      samePayload: false,
    });

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
    const store = postgresStore(opts(url!));
    const id = randomUUID();
    const base = { submission_id: id, form: "x", payload: {}, payload_hash: "h1", services: [], source: null, ip_hash: null, user_agent: null };
    expect((await store.insert({ ...base, app: "zbm" })).inserted).toBe(true);
    expect((await store.insert({ ...base, app: "zbc" })).inserted).toBe(true);
    expect((await store.insert({ ...base, app: "zbc" })).inserted).toBe(false);
  });

  it("the table rejects an unknown app, and the error surfaces as a SQLSTATE only", async () => {
    const store = postgresStore(opts(url!));
    const error = await store
      .insert({
        submission_id: randomUUID(),
        app: "nope" as "zbm",
        form: "x",
        payload: { secret: "PII-VALUE" },
        payload_hash: "h",
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
    const store = postgresStore(opts("postgres://nobody:nothing@127.0.0.1:1/none"));
    const error = await store
      .insert({
        submission_id: randomUUID(),
        app: "zbm",
        form: "x",
        payload: {},
        payload_hash: "h",
        services: [],
        source: null,
        ip_hash: null,
        user_agent: null,
      })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(DeliveryError);
  }, 15_000);
});

describe.skipIf(!neonShaped)("postgres store with a Neon-shaped URL (TLS + SCRAM + channel_binding)", () => {
  it("parses the vendor URL and stores over TLS; channel_binding no longer breaks the connection", async () => {
    const parsed = parsePostgresUrl(neonShaped!);
    expect(parsed.ok && parsed.options.ssl).toBe("require");
    const store = postgresStore(opts(neonShaped!));
    const id = randomUUID();
    const result = await store.insert({
      submission_id: id,
      app: "zbc",
      form: "clipper",
      payload: { name: "TLS" },
      payload_hash: "h",
      services: [],
      source: null,
      ip_hash: null,
      user_agent: null,
    });
    expect(result).toEqual({ inserted: true });
    const sql = postgres(url!, { max: 1, onnotice: () => {} });
    const [row] = await sql`SELECT form FROM leads WHERE app = 'zbc' AND submission_id = ${id}`;
    await sql.end();
    expect(row?.form).toBe("clipper");
  });

  it("the raw URL, as the driver alone would take it, is what used to fail (42704)", async () => {
    // Regression proof for AEGIS H1: hand the driver the URL directly.
    const sql = postgres(neonShaped!, { max: 1, onnotice: () => {}, connect_timeout: 5 });
    const error = await sql`SELECT 1`.catch((e: unknown) => e);
    await sql.end();
    expect((error as { code?: string }).code).toBe("42704");
  });
});

/**
 * The migration runner (AEGIS L5 and the H1 pre-launch check), run as a real
 * process against a throwaway database created on the test server.
 */
describe.skipIf(!url)("migrate script (integration)", () => {
  const admin = () => postgres(url!, { max: 1, onnotice: () => {} });
  const dbUrl = (name: string) => {
    const u = new URL(url!);
    u.pathname = `/${name}`;
    return u.toString();
  };
  const run = (postgresUrl: string) =>
    spawnSync(process.execPath, [path.join(import.meta.dirname, "..", "scripts", "migrate.mjs")], {
      env: { PATH: process.env.PATH, POSTGRES_URL: postgresUrl },
      encoding: "utf8",
    });

  it("applies once, records the version, verifies columns and round-trips; a second run skips", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_test");
    await sql.unsafe("CREATE DATABASE leads_migrate_test");
    await sql.end();
    const target = dbUrl("leads_migrate_test");

    const first = run(target);
    expect(first.status, first.stderr).toBe(0);
    expect(first.stdout).toContain("applied 001_leads.sql");
    expect(first.stdout).toContain("schema ok; round-trip insert ok (rolled back)");

    const second = run(target);
    expect(second.status, second.stderr).toBe(0);
    expect(second.stdout).toContain("skip 001_leads.sql (already applied)");

    const db = postgres(target, { max: 1, onnotice: () => {} });
    expect(await db`SELECT version FROM schema_migrations`).toEqual([{ version: "001" }]);
    expect(await db`SELECT count(*)::int AS n FROM leads`).toEqual([{ n: 0 }]);
    await db.end();
  });

  it("an incompatible pre-existing leads table is caught, not trusted", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_old");
    await sql.unsafe("CREATE DATABASE leads_migrate_old");
    await sql.end();
    const target = dbUrl("leads_migrate_old");
    const db = postgres(target, { max: 1, onnotice: () => {} });
    // An older table that IF NOT EXISTS would silently keep: no payload_hash, text submission_id.
    await db.unsafe("CREATE TABLE leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission_id text, app text, form text, payload jsonb)");
    await db.end();
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/leads table does not match the app: .*submission_id.*payload_hash|migration failed/);
  });

  it("refuses a URL the app would refuse, printing the reason and not the URL", () => {
    const result = run("postgres://u:TopSecretPw@h.example/db?options=-c%20x");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("POSTGRES_URL refused (unknown-param-options)");
    expect(result.stderr + result.stdout).not.toContain("TopSecretPw");
  });
});
