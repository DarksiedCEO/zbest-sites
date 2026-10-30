/* global process, console */
/**
 * "Delete my data" runbook tool (security sweep M4, privacy sweep F5,
 * 2026-10-30). There is deliberately NO public endpoint: a person asks by
 * email, Andre (or someone he names) verifies them, then runs this.
 *
 * RUNBOOK
 *   1. Verify the requester controls the contact they name (reply from that
 *      address, or call that number). Do not act on an unverified request.
 *   2. Pull production env to a local, untracked file and dry-run:
 *        vercel env pull .env.local
 *        node --env-file=.env.local packages/lead/scripts/delete-lead.mjs --match "person@example.com"
 *      It lists matching rows by id, app, form and date only (no PII).
 *      Matching is a case-insensitive substring search of everything the
 *      visitor typed (payload), so try every contact they gave (email,
 *      phone in the formats they would type it, business name).
 *   3. Check the list is theirs, then delete exactly those rows:
 *        node --env-file=.env.local packages/lead/scripts/delete-lead.mjs --match "person@example.com" --confirm
 *      Add --app zbm or --app zbc to limit it to one site.
 *   4. Delete the matching "New lead" notification emails in the founder
 *      mailbox (Google Workspace), and empty them from Trash.
 *   5. Resend keeps sent-message content for its own retention period; it
 *      cannot be deleted from here (UNVERIFIED whether its API allows it).
 *   6. Record the request (date, what was deleted, date answered) in the
 *      privacy-requests log, and reply to the person within 30 days.
 *   7. Delete .env.local.
 *
 * Connects with the DIRECT URL first, like migrate.mjs (POSTGRES_URL_NON_POOLING,
 * DATABASE_URL_UNPOOLED, POSTGRES_URL), parsed by the app's own src/pg-url.ts.
 * The match string is a bound parameter with LIKE wildcards escaped, never SQL
 * text. Prints row ids and counts only, never the URL or any field value.
 */
import { parseArgs } from "node:util";
import path from "node:path";
import { pathToFileURL } from "node:url";
import postgres from "postgres";

const { values } = parseArgs({
  options: {
    match: { type: "string" },
    app: { type: "string" },
    confirm: { type: "boolean", default: false },
  },
});
const match = (values.match ?? "").trim();
if (match.length < 5) {
  console.error('Usage: delete-lead.mjs --match "<email, phone or other contact; at least 5 characters>" [--app zbm|zbc] [--confirm]');
  process.exit(2);
}
if (values.app !== undefined && values.app !== "zbm" && values.app !== "zbc") {
  console.error("--app must be zbm or zbc.");
  process.exit(2);
}

const URL_VARS = ["POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED", "POSTGRES_URL"];
const urlVar = URL_VARS.find((name) => (process.env[name] ?? "").trim() !== "");
if (!urlVar) {
  console.error(`None of ${URL_VARS.join(", ")} is set. Nothing was changed.`);
  process.exit(1);
}
const { parsePostgresUrl } = await import(pathToFileURL(path.join(import.meta.dirname, "..", "src", "pg-url.ts")).href);
const parsed = parsePostgresUrl(process.env[urlVar]);
if (!parsed.ok) {
  console.error(`${urlVar} refused (${parsed.reason}). Nothing was changed.`);
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
  max: 1,
  prepare: false,
  onnotice: () => {},
  connection: { application_name: "zbest-lead-delete", ...(o.startup_options ? { options: o.startup_options } : {}) },
});

/** Escapes LIKE wildcards so the visitor's text matches literally. */
const likeLiteral = (s) => `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

try {
  const pattern = likeLiteral(match);
  const app = values.app ?? null;
  const rows = await sql`
    SELECT id::text, app, form, created_at
    FROM leads
    WHERE payload::text ILIKE ${pattern} ESCAPE '\\'
      AND (${app}::text IS NULL OR app = ${app}::text)
    ORDER BY created_at`;
  console.log(`${rows.length} matching row(s):`);
  for (const r of rows) console.log(`  ${r.id}  ${r.app}  ${r.form}  ${r.created_at.toISOString()}`);
  if (!values.confirm) {
    console.log(rows.length ? "Dry run: nothing deleted. Re-run with --confirm to delete exactly these rows." : "Nothing to delete.");
  } else if (rows.length) {
    const ids = rows.map((r) => r.id);
    const deleted = await sql.begin(
      (tx) => tx`DELETE FROM leads WHERE id IN ${tx(ids)}`,
    );
    console.log(`Deleted ${deleted.count} row(s).`);
  }
} catch (error) {
  console.error(`failed; nothing was changed (SQLSTATE ${typeof error?.code === "string" ? error.code : "unknown"})`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
