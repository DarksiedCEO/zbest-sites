import { randomUUID } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { lookup } from "node:dns/promises";
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

/**
 * Harness connections go through the same parser as the product (AEGIS r2
 * N8), so LEAD_TEST_POSTGRES_URL may itself be vendor-shaped.
 */
const connect = (raw: string, extra: postgres.Options<Record<string, never>> = {}) => {
  const o = opts(raw);
  return postgres({
    host: o.host,
    port: o.port,
    database: o.database,
    username: o.username,
    password: o.password,
    ssl: o.ssl,
    max: 1,
    onnotice: () => {},
    ...extra,
  });
};

describe.skipIf(!url)("postgres store (integration)", () => {
  let sql: postgres.Sql;

  beforeAll(async () => {
    sql = connect(url!);
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
    const sql = connect(url!);
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
  const admin = () => connect(url!);
  const dbUrl = (name: string) => {
    const u = new URL(url!);
    u.pathname = `/${name}`;
    return u.toString();
  };
  const runEnv = (env: Record<string, string>) =>
    spawnSync(process.execPath, [path.join(import.meta.dirname, "..", "scripts", "migrate.mjs")], {
      env: { PATH: process.env.PATH, ...env },
      encoding: "utf8",
    });
  const run = (postgresUrl: string) => runEnv({ POSTGRES_URL: postgresUrl });

  it("applies once, records the version, verifies columns and round-trips; a second run skips", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_test");
    await sql.unsafe("CREATE DATABASE leads_migrate_test");
    await sql.end();
    const target = dbUrl("leads_migrate_test");

    const first = run(target);
    expect(first.status, first.stderr).toBe(0);
    expect(first.stdout).toContain("applied 001_leads.sql");
    expect(first.stdout).toContain("schema ok; unique key ok; round-trip insert ok (rolled back)");

    const second = run(target);
    expect(second.status, second.stderr).toBe(0);
    expect(second.stdout).toContain("skip 001_leads.sql (already applied)");

    const db = connect(target);
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
    const db = connect(target);
    // An older table that IF NOT EXISTS would silently keep: no payload_hash, text submission_id.
    await db.unsafe("CREATE TABLE leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), submission_id text, app text, form text, payload jsonb)");
    await db.end();
    const result = run(target);
    expect(result.status).not.toBe(0);
    // The column check itself must catch it — not a later failure masking it.
    expect(result.stderr).toMatch(/leads table does not match the app: .*submission_id.*payload_hash/);
  });

  /** A fresh database holding exactly the 001 schema, altered by `sqlText`, with 001 recorded as applied. */
  const prepared = async (name: string, sqlText: string) => {
    const sql = admin();
    await sql.unsafe(`DROP DATABASE IF EXISTS ${name}`);
    await sql.unsafe(`CREATE DATABASE ${name}`);
    await sql.end();
    const target = dbUrl(name);
    const db = connect(target);
    await db.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8"));
    await db.unsafe("CREATE TABLE schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    await db.unsafe("INSERT INTO schema_migrations (version) VALUES ('001')");
    await db.unsafe(sqlText);
    await db.end();
    return target;
  };

  it("N5: a partially compatible table (one column missing) fails the column check by name", async () => {
    const target = await prepared("leads_migrate_partial", "ALTER TABLE leads DROP COLUMN notify_status");
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("leads table does not match the app: notify_status");
  });

  it("N9: a table without UNIQUE (app, submission_id) is caught before launch", async () => {
    const target = await prepared("leads_migrate_nounique", "ALTER TABLE leads DROP CONSTRAINT leads_app_submission_id_key");
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("leads table lacks UNIQUE (app, submission_id)");
  });

  it("N5: the round trip catches a table that does not store what the app writes", async () => {
    // Columns and key are right, but a trigger rewrites rows: only a read-back can see it.
    const target = await prepared(
      "leads_migrate_trigger",
      `CREATE FUNCTION mangle() RETURNS trigger AS $$ BEGIN NEW.form := 'mangled'; RETURN NEW; END $$ LANGUAGE plpgsql;
       CREATE TRIGGER mangle BEFORE INSERT ON leads FOR EACH ROW EXECUTE FUNCTION mangle();`,
    );
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("round-trip check failed: the row does not read back as written");
  });

  it("N5: the round trip catches a repeat insert that is not a no-op", async () => {
    // A trigger that re-keys every row defeats ON CONFLICT: only the repeat check sees it first.
    const target = await prepared(
      "leads_migrate_rekey",
      `CREATE FUNCTION rekey() RETURNS trigger AS $$ BEGIN NEW.submission_id := gen_random_uuid(); RETURN NEW; END $$ LANGUAGE plpgsql;
       CREATE TRIGGER rekey BEFORE INSERT ON leads FOR EACH ROW EXECUTE FUNCTION rekey();`,
    );
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("round-trip check failed: a repeat insert stored a second row");
  });

  it("N9: a run waits while another holds the migration lock, then proceeds", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_lock");
    await sql.unsafe("CREATE DATABASE leads_migrate_lock");
    await sql.end();
    const target = dbUrl("leads_migrate_lock");
    const holder = connect(target);
    await holder`SELECT pg_advisory_lock(815204771)`; // the runner's LOCK_KEY
    const child = spawn(process.execPath, [path.join(import.meta.dirname, "..", "scripts", "migrate.mjs")], {
      env: { PATH: process.env.PATH, POSTGRES_URL: target },
    });
    let out = "";
    let exited: number | null | undefined;
    child.stdout.on("data", (d) => (out += String(d)));
    child.on("close", (code) => (exited = code));
    await new Promise((r) => setTimeout(r, 1500));
    expect(exited, "the runner must wait for the lock").toBeUndefined();
    expect(out).not.toContain("applied");
    await holder`SELECT pg_advisory_unlock(815204771)`;
    await holder.end();
    await new Promise<void>((r) => (exited !== undefined ? r() : child.on("close", () => r())));
    expect(exited).toBe(0);
    expect(out).toContain("applied 001_leads.sql");
  }, 20_000);

  it("N9: concurrent runs serialise on the advisory lock — one applies, the other skips", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_race");
    await sql.unsafe("CREATE DATABASE leads_migrate_race");
    await sql.end();
    const target = dbUrl("leads_migrate_race");
    const spawnRun = () =>
      new Promise<{ code: number | null; out: string }>((resolve) => {
        const child = spawn(process.execPath, [path.join(import.meta.dirname, "..", "scripts", "migrate.mjs")], {
          env: { PATH: process.env.PATH, POSTGRES_URL: target },
        });
        let out = "";
        child.stdout.on("data", (d) => (out += String(d)));
        child.stderr.on("data", (d) => (out += String(d)));
        child.on("close", (code) => resolve({ code, out }));
      });
    const results = await Promise.all([spawnRun(), spawnRun(), spawnRun()]);
    for (const r of results) expect(r.code, r.out).toBe(0);
    expect(results.filter((r) => r.out.includes("applied 001_leads.sql"))).toHaveLength(1);
    expect(results.filter((r) => r.out.includes("skip 001_leads.sql"))).toHaveLength(2);
  }, 30_000);

  it("r3 F5: a PARTIAL unique index on (app, submission_id) is not the key the app needs", async () => {
    const target = await prepared(
      "leads_migrate_partial_unique",
      `ALTER TABLE leads DROP CONSTRAINT leads_app_submission_id_key;
       CREATE UNIQUE INDEX leads_partial_key ON leads (app, submission_id) WHERE app = 'zbm';`,
    );
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("leads table lacks UNIQUE (app, submission_id)");
  });

  it("r3 F5: a NON-unique index on (app, submission_id) is not the key the app needs", async () => {
    const target = await prepared(
      "leads_migrate_nonunique",
      `ALTER TABLE leads DROP CONSTRAINT leads_app_submission_id_key;
       CREATE INDEX leads_plain_idx ON leads (app, submission_id);`,
    );
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("leads table lacks UNIQUE (app, submission_id)");
  });

  it("F3: prefers POSTGRES_URL_NON_POOLING, then DATABASE_URL_UNPOOLED, then POSTGRES_URL (names printed, never URLs)", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_pref");
    await sql.unsafe("CREATE DATABASE leads_migrate_pref");
    await sql.end();
    const good = dbUrl("leads_migrate_pref");
    // A URL the parser refuses: if it were chosen, the run would fail.
    const refused = "postgres://u:PrefSecret@h.example/db?bogus=1";

    const nonPooling = runEnv({ POSTGRES_URL: refused, DATABASE_URL_UNPOOLED: refused, POSTGRES_URL_NON_POOLING: good });
    expect(nonPooling.status, nonPooling.stderr).toBe(0);
    expect(nonPooling.stdout).toContain("using POSTGRES_URL_NON_POOLING");

    const unpooled = runEnv({ POSTGRES_URL: refused, DATABASE_URL_UNPOOLED: good });
    expect(unpooled.status, unpooled.stderr).toBe(0);
    expect(unpooled.stdout).toContain("using DATABASE_URL_UNPOOLED");

    const plain = runEnv({ POSTGRES_URL: good });
    expect(plain.status, plain.stderr).toBe(0);
    expect(plain.stdout).toContain("using POSTGRES_URL");

    const refusedRun = runEnv({ POSTGRES_URL_NON_POOLING: refused, POSTGRES_URL: good });
    expect(refusedRun.status).toBe(1);
    expect(refusedRun.stderr).toContain("POSTGRES_URL_NON_POOLING refused (unknown-param-bogus)");
    for (const r of [nonPooling, unpooled, plain, refusedRun]) expect(r.stdout + r.stderr).not.toContain("PrefSecret");
  });

  it("F3: warns when the only URL is a pooled (-pooler) endpoint", () => {
    const result = runEnv({ POSTGRES_URL: "postgres://u:pw@ep-x-pooler.invalid/db?connect_timeout=2" });
    expect(result.stderr + result.stdout).toContain("POSTGRES_URL looks like a pooled endpoint");
    expect(result.status).not.toBe(0); // .invalid never resolves
  });

  it("F3: one transaction — a failed check rolls back every step, including the migration itself", async () => {
    const sql = admin();
    await sql.unsafe("DROP DATABASE IF EXISTS leads_migrate_atomic");
    await sql.unsafe("CREATE DATABASE leads_migrate_atomic");
    await sql.end();
    const target = dbUrl("leads_migrate_atomic");
    const db = connect(target);
    // A compatible pre-existing table with a row-mangling trigger, and no
    // schema_migrations: 001 applies, then the round trip fails.
    await db.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", "001_leads.sql"), "utf8").replace(/CREATE INDEX[^;]*;/g, ""));
    await db.unsafe(`CREATE FUNCTION mangle() RETURNS trigger AS $$ BEGIN NEW.form := 'mangled'; RETURN NEW; END $$ LANGUAGE plpgsql;
      CREATE TRIGGER mangle BEFORE INSERT ON leads FOR EACH ROW EXECUTE FUNCTION mangle();`);
    const result = run(target);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("round-trip check failed");
    expect(result.stderr).toContain("Nothing was changed (the whole run was rolled back).");
    const [state] = await db`
      SELECT to_regclass('schema_migrations') IS NULL AS no_versions,
             to_regclass('leads_app_created_idx') IS NULL AS no_index`;
    await db.end();
    expect(state).toEqual({ no_versions: true, no_index: true });
  });

  it("refuses a URL the app would refuse, printing the reason and not the URL", () => {
    const result = run("postgres://u:TopSecretPw@h.example/db?search_path=x");
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("POSTGRES_URL refused (unknown-param-search_path)");
    expect(result.stderr + result.stdout).not.toContain("TopSecretPw");
  });
});

/**
 * TLS verification and Neon's `options=endpoint` pass-through (AEGIS r2 N2,
 * N3), against the TLS-only SCRAM role. Needs LEAD_TEST_POSTGRES_NEON_URL;
 * the verify-full cases also need the server's CA in NODE_EXTRA_CA_CERTS and
 * a hosts entry `lead-wrong-host.test → 127.0.0.1` (a name NOT in the
 * certificate), and are skipped without them.
 */
/**
 * Whether THIS server's CA is trusted, detected by trying it — not by the
 * presence of NODE_EXTRA_CA_CERTS, which a sandbox may set to its own bundle
 * (AEGIS r4). The probe is a verify-full connection to localhost.
 */
async function probeCaTrusted(): Promise<boolean> {
  if (!neonShaped) return false;
  const u = new URL(neonShaped);
  u.hostname = "localhost";
  u.search = "?sslmode=verify-full";
  const sql = connect(u.toString(), { connect_timeout: 5 });
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    // ONLY "the chain is not trusted here" means the CA is absent (AEGIS r5
    // N2). Anything else — a hostname failure, a TLS regression, a refused
    // connection — is a real failure and must not turn into a quiet skip.
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string" && UNTRUSTED_CERT_CODES.has(code)) return false;
    throw error;
  } finally {
    await sql.end({ timeout: 1 });
  }
}
const UNTRUSTED_CERT_CODES = new Set([
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
]);
const caLoaded = await probeCaTrusted();
/** CI and the Mac gate set this: a CA that should be trusted but is not is a failure, not a skip. */
const expectVerifyFull = process.env.LEAD_TEST_EXPECT_VERIFY_FULL === "1";
/** The hostname-mismatch case needs a name that resolves here but is not in the cert. */
const wrongHostResolves = await lookup("lead-wrong-host.test").then(
  () => true,
  () => false,
);
describe.skipIf(!neonShaped)("TLS modes and startup options (integration)", () => {
  const withHost = (host: string, query: string) => {
    const u = new URL(neonShaped!);
    u.hostname = host;
    u.search = query;
    return u.toString();
  };
  const tryInsert = async (raw: string) => {
    const store = postgresStore(opts(raw));
    return store
      .insert({
        submission_id: randomUUID(),
        app: "zbm",
        form: "tls-check",
        payload: {},
        payload_hash: "h",
        services: [],
        source: null,
        ip_hash: null,
        user_agent: null,
      })
      .then(
        (r) => ({ ok: true as const, r }),
        (e: unknown) => ({ ok: false as const, code: (e as DeliveryError).detail }),
      );
  };

  it.skipIf(!expectVerifyFull)("LEAD_TEST_EXPECT_VERIFY_FULL=1: the server's CA is trusted, so verify-full runs", () => {
    expect(caLoaded, "verify-full probe failed with an untrusted-chain code: is NODE_EXTRA_CA_CERTS set to this server's CA?").toBe(true);
  });

  it("sslmode=require connects to a self-signed server (encryption without verification, as libpq)", async () => {
    expect((await tryInsert(withHost("localhost", "?sslmode=require"))).ok).toBe(true);
  });

  it.skipIf(caLoaded)("sslmode=verify-full refuses a certificate it cannot verify", async () => {
    const result = await tryInsert(withHost("localhost", "?sslmode=verify-full"));
    expect(result.ok).toBe(false);
  });

  it.skipIf(!caLoaded)("sslmode=verify-full connects when the chain and hostname verify", async () => {
    expect(await tryInsert(withHost("localhost", "?sslmode=verify-full&channel_binding=require"))).toMatchObject({ ok: true });
  });

  it.skipIf(!caLoaded || !wrongHostResolves)("sslmode=verify-full refuses a hostname the certificate does not name", async () => {
    // "unknown": a TLS error carries no SQLSTATE, and the store logs only codes it recognises.
    expect(await tryInsert(withHost("lead-wrong-host.test", "?sslmode=verify-full"))).toEqual({ ok: false, code: "ERR_TLS_CERT_ALTNAME_INVALID" });
  });

  it("options=endpoint=<id> reaches the server as the startup `options` parameter", async () => {
    // Neon's proxy consumes it; stock Postgres parses it as command-line
    // options and rejects the syntax (42601) — which proves it was forwarded.
    expect(await tryInsert(withHost("localhost", "?sslmode=require&options=endpoint%3Dep-test-123"))).toEqual({ ok: false, code: "42601" });
  });
});
