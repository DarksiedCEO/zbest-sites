/* global process, console */
/**
 * Applies sql/*.sql in name order to POSTGRES_URL. Idempotent (every
 * statement is IF NOT EXISTS). Run from a machine with the production env
 * pulled, e.g.:  vercel env pull .env.local && pnpm --filter @zbest/lead migrate
 * Prints file names only — never the URL.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL is not set. Nothing was changed.");
  process.exit(1);
}

const dir = path.join(import.meta.dirname, "..", "sql");
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
try {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await sql.unsafe(readFileSync(path.join(dir, file), "utf8"));
    console.log(`applied ${file}`);
  }
} catch (error) {
  console.error(`migration failed (SQLSTATE ${error?.code ?? "unknown"})`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
