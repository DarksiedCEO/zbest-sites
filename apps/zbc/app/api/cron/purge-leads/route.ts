import { handlePurge } from "@zbest/lead";

/**
 * Daily lead-retention purge, called by Vercel Cron (vercel.json). Deletes
 * this app's leads older than LEAD_RETENTION_DAYS (default 730, by
 * submission date) and blanks user agents older than LEAD_UA_RETENTION_DAYS
 * (default 90). Requires `Authorization: Bearer ${CRON_SECRET}`, which
 * Vercel sends; without CRON_SECRET it refuses to run (fail closed). Logs
 * counts only. Logic and tests: packages/lead/src/retention.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// AEGIS r5 N6: an explicit limit, valid on every Vercel plan with or without
// Fluid compute (docs/LEAD-ROUTE-DESIGN.md §8). The retry cron time-boxes its
// delivery check to 20 s, well inside it.
export const maxDuration = 60;

export function GET(request: Request) {
  return handlePurge(request, { app: "zbc" });
}
