import { resolveTransport, type Env, type TransportConfig } from "./config";
import { consoleLogger, type LeadLogger } from "./log";
import { checkDeliveries, deliverLead, KEY_WINDOW_MS, sendBatches, DIGEST_ALERT_DEFAULT } from "./notify";
import { cronAuthorized, notifyRetryDays } from "./retention";
import { DeliveryError, type LeadApp } from "./types";

/**
 * Chaos red team CH-8; AEGIS F1, r2 M1–M3, L2: founder emails are retried.
 *
 * The leads table is the durable outbox. Each run of /api/cron/retry-notify:
 *   1. leads still 'pending'/'failed' and older than LEAD_NOTIFY_RETRY_DAYS
 *      (default 3) become 'expired_notify': never emailed one by one, but
 *      counted in a count email, sent as an immutable batch like a digest
 *      and retried under the same key until Resend accepts it; until then
 *      /api/health is degraded (notify_expired), then they are
 *      'expired_reported' (r2 M3, r3 M3);
 *   2. 'pending'/'failed' leads whose first attempt is over 23 h old and
 *      whose outcome is unknown become 'delivery_unknown' (Resend keeps an
 *      idempotency key 24 h), so they go in the digest, flagged, instead of
 *      risking a second email (r2 M2; definite failures are not flagged, r4 L6);
 *   3. 'pending'/'failed' leads older than LEAD_NOTIFY_INDIVIDUAL_HOURS
 *      (default 1) go to the digest instead of being emailed one by one, so
 *      the first runs after a deploy or an outage send a few digests, not
 *      hundreds of single emails (r3 L3);
 *   4. younger 'failed' leads, and 'pending' leads older than 5 minutes, are
 *      re-sent one by one with the SAME key and the SAME body (built from
 *      stored values), with backoff 15 min doubling, 10 attempts max;
 *   5. every 'deferred' and 'delivery_unknown' lead goes out in digests of
 *      100 per email, as many as needed (r2 M1). Each batch is immutable:
 *      formed and fixed (leads, key, body hash) before its first send, taken
 *      whole by one run, re-sent unchanged after a failure, and only its own
 *      leads are marked sent when Resend accepts it (r3 H1);
 *   6. last, within 20 s: delivery of recently sent emails is checked with
 *      Resend (r4 M2, r5 N2–N6, r6, notify.ts checkDeliveries). Not delivered
 *      → re-sent in a later digest, flagged, after 1 h, 6 h, 24 h, 72 h; then
 *      'abandoned' (health leads_undelivered until acknowledged) and re-queued
 *      whenever a later email is confirmed delivered.
 *
 * The whole run stays within RUN_BUDGET_MS (50 s; maxDuration is 60 s), and
 * keeps at least CHECK_RESERVE_MS (8 s) for delivery lookups: sends stop at
 * 34 s; work not started in time waits for the next run (AEGIS r6 R6-4, r7 R7-5).
 *
 * Schedule (vercel.json): daily, because Vercel Hobby runs a cron job at
 * most once a day and rejects a deployment with a more frequent schedule. The
 * schedule is one line in vercel.json; Vercel Pro (hourly or every 15
 * minutes) is required before the public cutover, so a held lead waits
 * minutes, not a day (docs/LEAD-ROUTE-DESIGN.md).
 *
 * Fail closed exactly like the purge: CRON_SECRET (>= 16 chars) and the
 * `Authorization: Bearer <CRON_SECRET>` header Vercel sends. Logs carry ids
 * and counts only.
 */

/** A 'pending' row younger than this may still be in its first request; a resubmit leaves it alone. */
export const NOTIFY_PENDING_GRACE_MS = 60_000;
/** The cron leaves 'pending' rows alone for longer: a request is long over by then. */
export const CRON_PENDING_GRACE_MS = 5 * 60_000;
export const NOTIFY_MAX_ATTEMPTS = 10;
const BATCH = 50;
/** Bounds the one-by-one retries in a run (r3 L3); the hourly email cap keeps the real number far lower. */
const MAX_INDIVIDUAL_PER_RUN = 50;
/** AEGIS r6 R6-4: a run's time budget, inside the cron routes' maxDuration (60 s). */
export const RUN_BUDGET_MS = 50_000;
/** AEGIS r7 R7-5: time each run keeps for delivery lookups, even under a send backlog. */
export const CHECK_RESERVE_MS = 8_000;
/** Leads older than this are not retried one by one: they go in the digest (r3 L3). */
export const DEFAULT_NOTIFY_INDIVIDUAL_HOURS = 1;
export function notifyIndividualHours(env: Env): number {
  const raw = (env.LEAD_NOTIFY_INDIVIDUAL_HOURS ?? "").trim();
  return /^\d{1,2}$/.test(raw) && Number(raw) >= 1 && Number(raw) <= 22 ? Number(raw) : DEFAULT_NOTIFY_INDIVIDUAL_HOURS;
}

/** Wait before the next try after `attempts` failures: 15 min doubling, capped at 24 h. */
export const notifyBackoffMs = (attempts: number) =>
  Math.min(15 * 60_000 * 2 ** Math.max(0, attempts - 1), 24 * 3_600_000);

export type NotifyRetryOptions = {
  app: LeadApp;
  env?: Env;
  logger?: LeadLogger;
  now?: () => Date;
  /** Test seam; production resolves the transport from env. */
  transport?: TransportConfig;
  /** Test seam: the delivery check's time budget (default DELIVERY_CHECK_BUDGET_MS, 20 s). */
  deliveryBudgetMs?: number;
  /** Test seam: the whole run's time budget (default RUN_BUDGET_MS, 50 s). */
  runBudgetMs?: number;
};

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handleNotifyRetry(request: Request, opts: NotifyRetryOptions): Promise<Response> {
  const log = opts.logger ?? consoleLogger;
  const env = opts.env ?? process.env;
  const app = opts.app;
  try {
    const secret = (env.CRON_SECRET ?? "").trim();
    if (secret.length < 16) {
      log("error", "notify_retry_not_configured", { app, missing: "CRON_SECRET:min-16-chars" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    if (!cronAuthorized(request.headers.get("authorization"), secret)) {
      log("warn", "notify_retry_unauthorized", { app });
      return json({ ok: false, error: { code: "unauthorized" } }, 401);
    }
    const config = opts.transport ?? resolveTransport(env);
    if (!config.ok) {
      log("error", "notify_retry_not_configured", { app, missing: config.missing.join(",") });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    const { notifier, outbox, store } = config.transport;
    if (!notifier) return json({ ok: true, sent: 0, failed: 0, digest: 0, expired: 0, notify: "disabled" }, 200);
    if (!outbox) {
      log("error", "notify_retry_not_configured", { app, missing: "outbox" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    const nowMs = (opts.now ?? (() => new Date()))().getTime();
    // AEGIS r6 R6-4, r7 R7-5: the whole run fits inside maxDuration (60 s),
    // and every run keeps time for delivery lookups. No send starts after
    // budget − reserve − one send's timeout (34 s of 50 s), so even a send
    // backlog leaves the check its reserve (8 s, or 16% of a smaller budget).
    const runStart = Date.now();
    const budget = opts.runBudgetMs ?? RUN_BUDGET_MS;
    const slice = Math.min(CHECK_RESERVE_MS, budget * 0.16);
    const sendUntil = runStart + budget - 2 * slice;
    let outOfTime = false;
    const days = notifyRetryDays(env);
    const ctx = { app, store, notifier, log, now: () => nowMs };

    // 1. Too old to retry: counted in a count email, retried until accepted (r2 M3, r3 M3).
    const expired = await outbox.expireOld(app, new Date(nowMs - days * 86_400_000));
    if (expired > 0) log("warn", "notify_expired", { app, deleted: expired });
    outOfTime = (await sendBatches({ ...ctx, outbox }, "expired", { days, until: sendUntil })).outOfTime === true || outOfTime;

    // 2. Outcome unknown past Resend's key window: digest, flagged (r2 M2).
    await outbox.markUnknown(app, new Date(nowMs - KEY_WINDOW_MS));

    // 3. Over an hour old: digest, not one email each (r3 L3).
    const moved = await outbox.moveToDigest(app, new Date(nowMs - notifyIndividualHours(env) * 3_600_000));
    if (moved > 0) log("warn", "notify_moved_to_digest", { app, deleted: moved });

    // 4. One-by-one retries of young leads, identical body and key.
    let sent = 0;
    let failed = 0;
    for (let handled = 0; handled < MAX_INDIVIDUAL_PER_RUN; ) {
      const due = await outbox.claimUnsent(app, {
        pendingBefore: new Date(nowMs - CRON_PENDING_GRACE_MS),
        createdAfter: new Date(nowMs - notifyIndividualHours(env) * 3_600_000),
        maxAttempts: NOTIFY_MAX_ATTEMPTS,
        limit: Math.min(BATCH, MAX_INDIVIDUAL_PER_RUN - handled),
      });
      if (!due.length || Date.now() >= sendUntil) {
        outOfTime ||= due.length > 0;
        break;
      }
      handled += due.length;
      for (const lead of due) {
        // Out of time: the rest keep their lease and go next run.
        if (Date.now() >= sendUntil) {
          outOfTime = true;
          break;
        }
        const ids = { app, form: lead.form, submission_id: lead.submission_id };
        const outcome = await deliverLead(ctx, lead, ids, (n) => new Date(nowMs + notifyBackoffMs(n)), lead.notify_attempts);
        if (outcome === "sent") sent += 1;
        else if (outcome === "failed") failed += 1;
      }
    }

    // 5. Every held lead, in immutable digests (r2 M1, r3 H1).
    const raw = (env.LEAD_DIGEST_ALERT ?? "").trim();
    const alertAt = /^\d{1,7}$/.test(raw) ? Number(raw) : DIGEST_ALERT_DEFAULT;
    const digest = await sendBatches({ ...ctx, outbox }, "digest", { alertAt, until: sendUntil });
    outOfTime ||= digest.outOfTime === true;

    // 6. Last, time-boxed (r5 N6): delivery of sent emails (r4 M2, r5 N2–N4).
    // A lead whose email was not delivered is re-sent in a later digest,
    // after 1 h, 6 h, 24 h, 72 h; then abandoned and re-queued on a confirmed delivery.
    // The check runs at least `slice` (its reserve), however late the sends
    // ended, and never past the budget.
    const checkUntil = Math.min(runStart + budget, Math.max(runStart + budget * 0.84, Date.now() + slice));
    const checks = await checkDeliveries({ ...ctx, outbox }, opts.deliveryBudgetMs, checkUntil);
    if (outOfTime || checks.outOfTime) log("warn", "notify_run_budget_reached", { app });

    return json({ ok: true, sent, failed, digest: digest.sent, expired }, 200);
  } catch (error) {
    // A code and SQLSTATE only (storeError strips everything else), so a failing run says why.
    const detail = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "notify_retry_failed", { app, code: error instanceof DeliveryError ? error.code : "internal", sqlstate: detail ?? "unknown" });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
