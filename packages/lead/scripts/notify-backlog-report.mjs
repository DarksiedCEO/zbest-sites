/* global process, console */
/**
 * READ-ONLY report for AEGIS r2 M3 / r3 L3: run BEFORE applying migrations
 * 007 and 008 (and any time after) to see which leads have no founder email on
 * record, and what the next retry-cron run will do with them.
 *
 *   POSTGRES_URL_NON_POOLING=... pnpm --filter @zbest/lead notify-backlog-report
 *
 * Prints, per app and notify_status, the row count and the oldest and newest
 * submission dates, then the unsent (pending + failed) leads split the way the
 * cron treats them: under LEAD_NOTIFY_INDIVIDUAL_HOURS (1) old, retried one by
 * one; up to LEAD_NOTIFY_RETRY_DAYS (3), sent in digests; older, reported as a
 * count. Counts and dates only: never a payload, a name, an email
 * address or the connection string. It runs two SELECTs in a READ ONLY
 * transaction and changes nothing.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import postgres from "postgres";

const URL_VARS = ["POSTGRES_URL_NON_POOLING", "DATABASE_URL_UNPOOLED", "POSTGRES_URL"];
const urlVar = URL_VARS.find((name) => (process.env[name] ?? "").trim() !== "");
if (!urlVar) {
  console.error(`None of ${URL_VARS.join(", ")} is set.`);
  process.exit(1);
}
const { parsePostgresUrl } = await import(pathToFileURL(path.join(import.meta.dirname, "..", "src", "pg-url.ts")).href);
const parsed = parsePostgresUrl(process.env[urlVar]);
if (!parsed.ok) {
  console.error(`${urlVar} refused (${parsed.reason}).`);
  process.exit(1);
}
const o = parsed.options;
const sql = postgres({
  host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl,
  connect_timeout: o.connect_timeout ?? 10, max: 1, prepare: false, onnotice: () => {},
  connection: { application_name: "zbest-lead-backlog-report", ...(o.startup_options ? { options: o.startup_options } : {}) },
});
const whole = (name, fallback, min, max) => {
  const raw = (process.env[name] ?? "").trim();
  return /^\d{1,3}$/.test(raw) && Number(raw) >= min && Number(raw) <= max ? Number(raw) : fallback;
};
// The same bounds as src/notify-retry.ts and src/retention.ts.
const hours = whole("LEAD_NOTIFY_INDIVIDUAL_HOURS", 1, 1, 22);
const days = whole("LEAD_NOTIFY_RETRY_DAYS", 3, 1, 30);
try {
  const [rows, split] = await sql.begin("read only", async (tx) => [
    await tx`
      SELECT app, notify_status, count(*)::int AS n,
             to_char(min(created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS oldest,
             to_char(max(created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS newest
      FROM leads GROUP BY 1, 2 ORDER BY 1, 2`,
    await tx`
      SELECT app,
             count(*) FILTER (WHERE created_at >= now() - make_interval(hours => ${hours}::int))::int AS individual,
             count(*) FILTER (WHERE created_at < now() - make_interval(hours => ${hours}::int)
                              AND created_at > now() - make_interval(days => ${days}::int))::int AS digest,
             count(*) FILTER (WHERE created_at <= now() - make_interval(days => ${days}::int))::int AS expired
      FROM leads WHERE notify_status IN ('pending', 'failed') GROUP BY 1 ORDER BY 1`,
  ]);
  console.log(`using ${urlVar} (read only)`);
  console.log("app  notify_status        rows  oldest      newest");
  for (const r of rows) console.log(`${r.app.padEnd(4)} ${String(r.notify_status).padEnd(18)} ${String(r.n).padStart(6)}  ${r.oldest}  ${r.newest}`);
  const unsent = rows.filter((r) => r.notify_status === "pending" || r.notify_status === "failed").reduce((s, r) => s + r.n, 0);
  console.log(`\npending + failed: ${unsent}. What the next retry-cron run does with them:`);
  console.log(`app  retried individually (< ${hours} h)  sent in digests (< ${days} d)  reported as a count (older)`);
  for (const r of split) console.log(`${r.app.padEnd(4)} ${String(r.individual).padStart(28)}  ${String(r.digest).padStart(24)}  ${String(r.expired).padStart(27)}`);
} catch (error) {
  console.error(`report failed (SQLSTATE ${typeof error?.code === "string" ? error.code : "unknown"})`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
