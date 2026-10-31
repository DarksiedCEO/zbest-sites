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
 * address or the connection string. It runs its SELECTs in a READ ONLY
 * transaction and changes nothing. Since AEGIS r6 it also lists, by
 * submission id and date only, every lead whose email was not delivered after
 * every re-send ('abandoned') or could not be verified, and whether the
 * founder has acknowledged it.
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
const pageArg = process.argv.find((a) => /^--page=\d{1,6}$/.test(a));
const page = pageArg ? Math.max(1, Number(pageArg.slice(7))) : 1;
const PAGE_SIZE = 200;
const hours = whole("LEAD_NOTIFY_INDIVIDUAL_HOURS", 1, 1, 22);
const days = whole("LEAD_NOTIFY_RETRY_DAYS", 3, 1, 30);
try {
  const [rows, split, undelivered] = await sql.begin("read only", async (tx) => {
    const have = new Set(
      (await tx`SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'leads'`).map((c) => c.column_name),
    );
    // Before migrations 009–011 the delivery columns do not exist yet: the report still runs.
    const delivery = have.has("notify_delivery") && have.has("notify_abandoned_at") && have.has("notify_ack_at");
    return [
      await tx`
        SELECT app, notify_status, ${delivery ? tx`coalesce(notify_delivery, '-')` : tx`'-'`} AS delivery, count(*)::int AS n,
               to_char(min(created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS oldest,
               to_char(max(created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS newest
        FROM leads GROUP BY 1, 2, 3 ORDER BY 1, 2, 3`,
      await tx`
        SELECT app,
               count(*) FILTER (WHERE created_at >= now() - make_interval(hours => ${hours}::int))::int AS individual,
               count(*) FILTER (WHERE created_at < now() - make_interval(hours => ${hours}::int)
                                AND created_at > now() - make_interval(days => ${days}::int))::int AS digest,
               count(*) FILTER (WHERE created_at <= now() - make_interval(days => ${days}::int))::int AS expired
        FROM leads WHERE notify_status IN ('pending', 'failed') GROUP BY 1 ORDER BY 1`,
      // AEGIS r6 R6-1(c): every lead whose email could not be delivered after
      // every re-send, or could not be verified — ids and dates only.
      // AEGIS r7 R7-2: exact counts (count(*), never a page), the cutoff to
      // acknowledge through (the database's own clock, read in this same
      // snapshot), and the list one page at a time.
      delivery
        ? {
            counts: (await tx`
              SELECT count(*)::int AS total, count(*) FILTER (WHERE notify_ack_at IS NULL)::int AS open,
                     to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS through
              FROM leads WHERE notify_abandoned_at IS NOT NULL OR notify_unverifiable_at IS NOT NULL`)[0],
            rows: await tx`
              SELECT app, submission_id::text AS id, notify_status, coalesce(notify_delivery, '-') AS delivery,
                     to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI') AS created,
                     to_char(greatest(notify_abandoned_at, notify_unverifiable_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI') AS since,
                     CASE WHEN notify_abandoned_at IS NOT NULL THEN 'abandoned' ELSE 'unverifiable' END AS kind,
                     notify_ack_at IS NOT NULL AS acked
              FROM leads
              WHERE notify_abandoned_at IS NOT NULL OR notify_unverifiable_at IS NOT NULL
              ORDER BY notify_ack_at IS NOT NULL, app, created_at, submission_id
              LIMIT ${PAGE_SIZE}::int OFFSET ${(page - 1) * PAGE_SIZE}::int`,
          }
        : null,
    ];
  });
  console.log(`using ${urlVar} (read only)`);
  console.log("app  notify_status      delivery        rows  oldest      newest");
  for (const r of rows) console.log(`${r.app.padEnd(4)} ${String(r.notify_status).padEnd(18)} ${String(r.delivery).padEnd(13)} ${String(r.n).padStart(6)}  ${r.oldest}  ${r.newest}`);
  console.log("(delivery 'abandoned': not delivered after every re-send; 'unverifiable': accepted but could not be checked. A 'sent' row with either is NOT known to have reached the inbox.)");
  const unsent = rows.filter((r) => r.notify_status === "pending" || r.notify_status === "failed").reduce((s, r) => s + r.n, 0);
  console.log(`\npending + failed: ${unsent}. What the next retry-cron run does with them:`);
  console.log(`app  retried individually (< ${hours} h)  sent in digests (< ${days} d)  reported as a count (older)`);
  for (const r of split) console.log(`${r.app.padEnd(4)} ${String(r.individual).padStart(28)}  ${String(r.digest).padStart(24)}  ${String(r.expired).padStart(27)}`);
  if (undelivered === null) {
    console.log("\nundelivered leads: run migrations 009–012 first (columns missing).");
  } else {
    const { total, open, through } = undelivered.counts;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    console.log(`\nleads whose email was not delivered or could not be verified: ${total} (${open} not acknowledged).`);
    console.log(`acknowledge through: ${through}`);
    console.log("Read each in the database (by submission id), then acknowledge exactly these: POST /api/cron/ack-undelivered with {\"through\":\"<the time above>\"} or {\"ids\":[…]} (docs/LEAD-ROUTE-DESIGN.md §8). A lead abandoned later is not covered.");
    console.log(`page ${page} of ${pages} (${PAGE_SIZE} per page; --page=N for another)`);
    console.log("app  submission_id                         kind          since             submitted         status/delivery          acknowledged");
    for (const r of undelivered.rows) {
      console.log(`${r.app.padEnd(4)} ${r.id}  ${r.kind.padEnd(12)}  ${String(r.since).padEnd(16)}  ${String(r.created).padEnd(16)}  ${`${r.notify_status}/${r.delivery}`.padEnd(23)}  ${r.acked ? "yes" : "not acknowledged"}`);
    }
  }
} catch (error) {
  console.error(`report failed (SQLSTATE ${typeof error?.code === "string" ? error.code : "unknown"})`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
