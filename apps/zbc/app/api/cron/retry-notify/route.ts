import { handleNotifyRetry } from "@zbest/lead";

/**
 * Founder-email retry (chaos red team CH-8), called by Vercel Cron
 * (vercel.json). Re-sends leads whose email is 'failed', or still 'pending'
 * five minutes after submission, with the same idempotency key, and records
 * each outcome with backoff. Requires `Authorization: Bearer ${CRON_SECRET}`,
 * which Vercel sends; without CRON_SECRET it refuses to run (fail closed).
 * Daily on Vercel Hobby (cron jobs run at most once a day there); on Pro the
 * schedule can be hourly or every 15 minutes. Logic and tests:
 * packages/lead/src/notify-retry.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// AEGIS r5 N6: an explicit limit, valid on every Vercel plan with or without
// Fluid compute (docs/LEAD-ROUTE-DESIGN.md §8). The retry cron time-boxes its
// delivery check to 20 s, well inside it.
export const maxDuration = 60;

export function GET(request: Request) {
  return handleNotifyRetry(request, { app: "zbc" });
}
