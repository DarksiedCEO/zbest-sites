/* global process, console, crypto */
/**
 * Applies sql/NNN_*.sql in order (to POSTGRES_URL_NON_POOLING, else
 * DATABASE_URL_UNPOOLED, else POSTGRES_URL — see URL_VARS), each once, recorded in
 * schema_migrations (AEGIS L5). Then it proves the result is usable before
 * launch (AEGIS H1):
 *   1. the leads table has exactly the columns and types the app writes;
 *   2. it has the full UNIQUE (app, submission_id) the app's ON CONFLICT needs;
 *   3. a round-trip insert (twice: the repeat must be a no-op) + select,
 *      inside a savepoint that is rolled back;
 *   4. the service-area CHECK accepts exactly src/region.ts's SERVICE_AREAS:
 *      one rolled-back insert per served code must succeed, and each of a
 *      set of near-miss codes must be refused (AEGIS R-M1). This catches a
 *      database still on 004's 53 codes, a missing constraint, or drift.
 * All of it runs in ONE transaction under a transaction-scoped advisory lock,
 * so concurrent runs serialise and a failed run changes nothing.
 *
 * Run from a machine with the production env pulled, e.g.:
 *   vercel env pull .env.local && pnpm --filter @zbest/lead migrate
 *
 * The URL is parsed by the same code the app uses (src/pg-url.ts), so a URL
 * the app would refuse is refused here too. Prints file names and reason
 * codes only — never the URL, a host or a password.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import postgres from "postgres";

const here = import.meta.dirname;

/** Loads a TypeScript module without a build step (Node ≥ 22.6 strips types). */
async function loadTs(file) {
  try {
    return await import(pathToFileURL(path.join(here, "..", "src", file)).href);
  } catch {
    console.error(`Could not load src/${file} — run with Node 22.6+ (type stripping). Nothing was changed.`);
    process.exit(1);
  }
}
const loadParser = async () => (await loadTs("pg-url.ts")).parsePostgresUrl;

/** The codes the app accepts: the same list the forms and the zod schema use. */
const SERVICE_CODES = (await loadTs("region.ts")).SERVICE_AREAS.map((a) => a.value);
/**
 * Codes the CHECK must refuse: the declined option, ISO look-alikes for the
 * territories, other US-administered areas we do not serve, foreign codes,
 * case and whitespace variants, and the empty string.
 */
const REFUSED_CODES = ["outside", "US-PR", "US-GU", "US-VI", "US-AS", "US-MP", "UM", "US-UM", "CA", "GB", "us-ca", "vi", " US-CA", ""];

/** The columns 001 creates: what a pre-existing table must already have. */
const BASE = {
  id: "uuid",
  submission_id: "uuid",
  app: "text",
  form: "text",
  payload: "jsonb",
  payload_hash: "text",
  services: "ARRAY",
  source: "text",
  ip_hash: "text",
  user_agent: "text",
  notify_status: "text",
  notified_at: "timestamp with time zone",
  created_at: "timestamp with time zone",
};

/** After every migration: exactly what the app writes (004 adds the service area). */
const EXPECTED = { ...BASE, service_area: "text" };

/**
 * Which URL to migrate with (AEGIS r3 F3). A transaction-mode pooler
 * (PgBouncer — Neon's `-pooler` endpoint, which the Vercel integration puts
 * in POSTGRES_URL) can route consecutive statements to different backends, so
 * DDL and locks belong on the DIRECT connection: POSTGRES_URL_NON_POOLING
 * (Vercel–Neon / Vercel Postgres), then DATABASE_URL_UNPOOLED (Neon's own
 * integration), then POSTGRES_URL. Only the variable NAME is printed.
 */
const URL_VARS = ["POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED", "POSTGRES_URL"];
const urlVar = URL_VARS.find((name) => (process.env[name] ?? "").trim() !== "");
if (!urlVar) {
  console.error(`None of ${URL_VARS.join(", ")} is set. Nothing was changed.`);
  process.exit(1);
}
const parsePostgresUrl = await loadParser();
const parsed = parsePostgresUrl(process.env[urlVar]);
if (!parsed.ok) {
  console.error(`${urlVar} refused (${parsed.reason}). Nothing was changed.`);
  process.exit(1);
}
console.log(`using ${urlVar}`);
if (urlVar === "POSTGRES_URL" && /-pooler\./.test(parsed.options.host)) {
  console.warn("warning: POSTGRES_URL looks like a pooled endpoint; set POSTGRES_URL_NON_POOLING to migrate on the direct connection.");
}

const o = parsed.options;
const sql = postgres({
  host: o.host,
  port: o.port,
  database: o.database,
  username: o.username,
  password: o.password,
  ssl: o.ssl,
  connect_timeout: o.connect_timeout ?? 10,
  max: 1,
  prepare: false,
  onnotice: () => {},
  // Same startup parameters as the app (AEGIS r3 F6).
  connection: {
    application_name: "zbest-lead-migrate",
    ...(o.startup_options ? { options: o.startup_options } : {}),
  },
});

const fail = (what, error) => {
  console.error(`${what} (SQLSTATE ${typeof error?.code === "string" ? error.code : "unknown"})`);
  process.exitCode = 1;
};

/**
 * Transaction-scoped advisory lock (AEGIS r3 F3): taken inside the one
 * transaction that does everything, so it lives on that transaction's single
 * backend even through a pooler, serialises concurrent runs, and is released
 * by COMMIT or ROLLBACK — it cannot leak.
 */
const LOCK_KEY = 815_204_771; // arbitrary, fixed: "zbest-lead migrate"

class CheckFailed extends Error {}

/** Columns and types: exactly what the app writes. Throws CheckFailed naming the mismatches. */
async function checkColumns(tx, expected = EXPECTED) {
  const columns = await tx`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'leads'`;
  const actual = Object.fromEntries(columns.map((c) => [c.column_name, c.data_type]));
  const wrong = Object.entries(expected).filter(([name, type]) => actual[name] !== type).map(([name]) => name);
  if (wrong.length) throw new CheckFailed(`leads table does not match the app: ${wrong.join(", ")}. Fix the schema before launch.`);
}

const ROLLBACK_OK = "ROLLBACK_OK";

try {
  // ONE transaction: lock, apply, check, round-trip. Any failure rolls back
  // every step, so a run is all-or-nothing.
  const report = await sql.begin(async (tx) => {
    const lines = [];
    await tx`SELECT pg_advisory_xact_lock(${LOCK_KEY})`;
    await tx`CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;
    const done = new Set((await tx`SELECT version FROM schema_migrations`).map((r) => r.version));
    const dir = path.join(here, "..", "sql");
    // A leads table that predates our migrations would be kept by IF NOT
    // EXISTS; check it BEFORE applying anything, so the report names the
    // mismatch instead of a later DDL error masking it (AEGIS r2 N5).
    const [existing] = await tx`SELECT to_regclass('leads') IS NOT NULL AS present`;
    if (!done.has("001") && existing?.present) await checkColumns(tx, BASE);
    // The file-name regex is what makes the first three characters a version.
    for (const file of readdirSync(dir).filter((f) => /^\d{3}_.+\.sql$/.test(f)).sort()) {
      const version = file.slice(0, 3);
      if (done.has(version)) {
        lines.push(`skip ${file} (already applied)`);
        continue;
      }
      await tx.unsafe(readFileSync(path.join(dir, file), "utf8"));
      await tx`INSERT INTO schema_migrations (version) VALUES (${version})`;
      lines.push(`applied ${file}`);
    }

    // 1. Columns and types: exactly what the app writes.
    await checkColumns(tx);

    // 2. The idempotency key the app's ON CONFLICT names (AEGIS r2 N9): a full
    //    (non-partial) unique index on exactly (app, submission_id).
    const [unique] = await tx`
      SELECT 1 AS ok
      FROM pg_index i
      JOIN pg_class c ON c.oid = i.indrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = 'leads' AND n.nspname = current_schema()
        AND i.indisunique AND i.indpred IS NULL
        AND (SELECT array_agg(a.attname::text ORDER BY a.attname)
             FROM unnest(i.indkey) AS k(attnum)
             JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = k.attnum) = ARRAY['app', 'submission_id']`;
    if (!unique) throw new CheckFailed("leads table lacks UNIQUE (app, submission_id). Fix the schema before launch.");

    // 2b. The retention purge ledger (sql/003_purge_runs.sql) that /api/health reads.
    const [ledger] = await tx`SELECT to_regclass('lead_purge_runs') IS NOT NULL AS present`;
    if (!ledger?.present) throw new CheckFailed("lead_purge_runs table is missing. Fix the schema before launch.");

    // 3. Round trip with the app's own statement shape, inside a savepoint
    //    that is rolled back: the row reads back as written, defaults apply,
    //    and a repeat is a no-op.
    await tx
      .savepoint(async (sp) => {
        const id = crypto.randomUUID();
        const insert = () => sp`
          INSERT INTO leads (submission_id, app, form, payload, payload_hash)
          VALUES (${id}::uuid, 'zbm', 'migrate-check', '{"k":"v"}'::jsonb, 'migrate-hash')
          ON CONFLICT (app, submission_id) DO NOTHING
          RETURNING id`;
        if ((await insert()).length !== 1) throw new CheckFailed("round-trip check failed: first insert stored nothing");
        if ((await insert()).length !== 0) throw new CheckFailed("round-trip check failed: a repeat insert stored a second row");
        const [row] = await sp`
          SELECT form, payload, payload_hash, services, notify_status
          FROM leads WHERE app = 'zbm' AND submission_id = ${id}::uuid`;
        const readsBack =
          row?.form === "migrate-check" &&
          row?.payload?.k === "v" &&
          row?.payload_hash === "migrate-hash" &&
          Array.isArray(row?.services) && row.services.length === 0 &&
          row?.notify_status === "pending";
        if (!readsBack) throw new CheckFailed("round-trip check failed: the row does not read back as written");
        throw Object.assign(new Error("rollback"), { code: ROLLBACK_OK });
      })
      .catch((error) => {
        if (error?.code !== ROLLBACK_OK) throw error;
      });
    lines.push("schema ok; unique key ok; round-trip insert ok (rolled back)");

    // 4. The service-area CHECK is exactly the app's set (AEGIS R-M1).
    const tryArea = (code) =>
      tx
        .savepoint(async (sp) => {
          await sp`
            INSERT INTO leads (submission_id, app, form, payload, payload_hash, service_area)
            VALUES (${crypto.randomUUID()}::uuid, 'zbm', 'migrate-check', '{}'::jsonb, 'migrate-hash', ${code})`;
          throw Object.assign(new Error("rollback"), { code: ROLLBACK_OK });
        })
        .then(
          () => "stored",
          (error) => {
            if (error?.code === ROLLBACK_OK) return "accepted";
            if (error?.code === "23514") return "refused";
            throw error;
          },
        );
    const missing = [];
    for (const code of SERVICE_CODES) if ((await tryArea(code)) !== "accepted") missing.push(code);
    const leaked = [];
    for (const code of REFUSED_CODES) if ((await tryArea(code)) !== "refused") leaked.push(JSON.stringify(code));
    if (missing.length || leaked.length) {
      throw new CheckFailed(
        `leads_service_area_check does not match the app's ${SERVICE_CODES.length} service areas` +
          (missing.length ? `; refuses: ${missing.join(", ")}` : "") +
          (leaked.length ? `; accepts: ${leaked.join(", ")}` : "") +
          ". Fix the schema before launch.",
      );
    }
    lines.push(`service area check ok (${SERVICE_CODES.length} codes accepted, ${REFUSED_CODES.length} near-misses refused; rolled back)`);
    return lines;
  });
  for (const line of report) console.log(line);
} catch (error) {
  if (error instanceof CheckFailed) {
    console.error(error.message);
    console.error("Nothing was changed (the whole run was rolled back).");
    process.exitCode = 1;
  } else {
    fail("migration failed; nothing was changed", error);
  }
} finally {
  await sql.end();
}
