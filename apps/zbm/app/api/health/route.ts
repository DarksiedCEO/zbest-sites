import { handleHealth } from "@zbest/lead";

/**
 * Health for uptime monitors: 200 when the daily lead-retention purge is
 * healthy, 503 when degraded (CRON_SECRET missing, retention settings out of
 * bounds, no successful run yet, or the last one over 48 hours ago), and also
 * when a lead's founder email has not gone out for longer than
 * LEAD_NOTIFY_ALERT_MINUTES (default 60; chaos red team CH-8). The
 * Privacy Policy's deletion promise depends on that purge, so it must never
 * stop silently; every degraded check is also logged at error level.
 * Statuses only, no values. Logic and tests: packages/lead/src/retention.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return handleHealth(request, { app: "zbm" });
}
