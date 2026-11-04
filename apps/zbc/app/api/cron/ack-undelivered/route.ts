import { handleAckUndelivered } from "@zbest/lead";

/**
 * AEGIS r6 R6-1(d): the founder acknowledges leads whose email could not be
 * delivered after every re-send (or could not be verified), after reading
 * them in the database. POST only, `Authorization: Bearer ${CRON_SECRET}`
 * required; records who and when, deletes nothing. Not a scheduled cron:
 * called by hand (docs/LEAD-ROUTE-DESIGN.md §8). Logic and tests:
 * packages/lead/src/ack.ts.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function POST(request: Request) {
  return handleAckUndelivered(request, { app: "zbc" });
}
