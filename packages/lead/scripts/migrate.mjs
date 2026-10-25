/* global process, console, crypto */
/**
 * Applies sql/NNN_*.sql in order to POSTGRES_URL, each once, recorded in
 * schema_migrations (AEGIS L5). Then it proves the result is usable before
 * launch (AEGIS H1):
 *   1. the leads table has exactly the columns and types the app writes;
 *   2. a round-trip insert + select inside a transaction that is rolled back.
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

/** Loads the TypeScript parser without a build step (Node ≥ 22.6 strips types). */
async function loadParser() {
  try {
    return (await import(pathToFileURL(path.join(here, "..", "src", "pg-url.ts")).href)).parsePostgresUrl;
  } catch {
    console.error("Could not load src/pg-url.ts — run with Node 22.6+ (type stripping). Nothing was changed.");
    process.exit(1);
  }
}

const EXPECTED = {
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

const raw = process.env.POSTGRES_URL;
if (!raw) {
  console.error("POSTGRES_URL is not set. Nothing was changed.");
  process.exit(1);
}
const parsePostgresUrl = await loadParser();
const parsed = parsePostgresUrl(raw);
if (!parsed.ok) {
  console.error(`POSTGRES_URL refused (${parsed.reason}). Nothing was changed.`);
  process.exit(1);
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
});

const fail = (what, error) => {
  console.error(`${what} (SQLSTATE ${typeof error?.code === "string" ? error.code : "unknown"})`);
  process.exitCode = 1;
};

try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`;
  const done = new Set((await sql`SELECT version FROM schema_migrations`).map((r) => r.version));
  const dir = path.join(here, "..", "sql");
  for (const file of readdirSync(dir).filter((f) => /^\d{3}_.+\.sql$/.test(f)).sort()) {
    const version = file.slice(0, 3);
    if (done.has(version)) {
      console.log(`skip ${file} (already applied)`);
      continue;
    }
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(path.join(dir, file), "utf8"));
      await tx`INSERT INTO schema_migrations (version) VALUES (${version})`;
    });
    console.log(`applied ${file}`);
  }

  const columns = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name = 'leads'`;
  const actual = Object.fromEntries(columns.map((c) => [c.column_name, c.data_type]));
  const wrong = Object.entries(EXPECTED).filter(([name, type]) => actual[name] !== type).map(([name]) => name);
  if (wrong.length) {
    console.error(`leads table does not match the app: ${wrong.join(", ")}. Fix the schema before launch.`);
    process.exitCode = 1;
  } else {
    await sql
      .begin(async (tx) => {
        const id = crypto.randomUUID();
        await tx`INSERT INTO leads (submission_id, app, form, payload, payload_hash)
                 VALUES (${id}::uuid, 'zbm', 'migrate-check', '{}'::jsonb, 'x')`;
        const [row] = await tx`SELECT form FROM leads WHERE app = 'zbm' AND submission_id = ${id}::uuid`;
        if (row?.form !== "migrate-check") throw Object.assign(new Error("round trip"), { code: "ROUNDTRIP" });
        throw Object.assign(new Error("rollback"), { code: "ROLLBACK_OK" });
      })
      .catch((error) => {
        if (error?.code !== "ROLLBACK_OK") throw error;
      });
    console.log("schema ok; round-trip insert ok (rolled back)");
  }
} catch (error) {
  fail("migration failed", error);
} finally {
  await sql.end();
}
