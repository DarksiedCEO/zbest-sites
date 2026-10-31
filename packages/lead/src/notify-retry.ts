import { resolveTransport, type Env, type TransportConfig } from "./config";
import { consoleLogger, type LeadLogger } from "./log";
import { deliverLead, expiredEmail, KEY_WINDOW_MS, sendDigests, DIGEST_ALERT_DEFAULT } from "./notify";
import { cronAuthorized, notifyRetryDays } from "./retention";
import { DeliveryError, type LeadApp } from "./types";

/**
 * Chaos red team CH-8; AEGIS F1, r2 M1–M3, L2: founder emails are retried.
 *
 * The leads table is the durable outbox. Each run of /api/cron/retry-notify:
 *   1. leads still 'pending'/'failed' and older than LEAD_NOTIFY_RETRY_DAYS
 *      (default 3) become 'expired_notify': never emailed one by one, counted
 *      once in a separate digest email (r2 M3);
 *   2. 'pending'/'failed' leads whose first attempt is over 23 h old become
 *      'delivery_unknown' (Resend keeps an idempotency key 24 h), so they go
 *      in the digest, flagged, instead of risking a second email (r2 M2);
 *   3. 'failed' leads, and 'pending' leads older than 5 minutes, are re-sent
 *      one by one with the SAME key and the SAME body (built from stored
 *      values), with backoff 15 min doubling to 24 h, 10 attempts max;
 *   4. every 'deferred' and 'delivery_unknown' lead goes out in digests of
 *      100 per email, as many as needed (r2 M1), each batch under a key
 *      recorded on its rows first, so a timed-out digest is re-sent under the
 *      same key, never duplicated (r2 L2).
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
const MAX_INDIVIDUAL_PER_RUN = 500;

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
    const days = notifyRetryDays(env);
    const ctx = { app, store, notifier, log, now: () => nowMs };

    // 1. Too old to retry: counted once, never emailed one by one (r2 M3).
    const expired = await outbox.expireOld(app, new Date(nowMs - days * 86_400_000));
    if (expired > 0) {
      log("warn", "notify_expired", { app, deleted: expired });
      const day = new Date(nowMs).toISOString().slice(0, 10);
      try {
        await notifier.send(expiredEmail(app, expired, days), `digest-expired-${app}-${day}-${expired}`);
      } catch (error) {
        // The count is in the log; the rows stay 'expired_notify' (their contents are in the database).
        log("error", "notify_digest_failed", { app, code: error instanceof DeliveryError ? error.code : "notify_failed" });
      }
    }

    // 2. Outcome unknown past Resend's key window: digest, flagged (r2 M2).
    await outbox.markUnknown(app, new Date(nowMs - KEY_WINDOW_MS));

    // 3. One-by-one retries, identical body and key.
    let sent = 0;
    let failed = 0;
    for (let handled = 0; handled < MAX_INDIVIDUAL_PER_RUN; ) {
      const due = await outbox.claimUnsent(app, {
        pendingBefore: new Date(nowMs - CRON_PENDING_GRACE_MS),
        createdAfter: new Date(nowMs - days * 86_400_000),
        maxAttempts: NOTIFY_MAX_ATTEMPTS,
        limit: BATCH,
      });
      if (!due.length) break;
      handled += due.length;
      for (const lead of due) {
        const ids = { app, form: lead.form, submission_id: lead.submission_id };
        const outcome = await deliverLead(ctx, lead, ids, (n) => new Date(nowMs + notifyBackoffMs(n)), lead.notify_attempts);
        if (outcome === "sent") sent += 1;
        else if (outcome === "failed") failed += 1;
      }
    }

    // 4. Every held lead, in as many digests as needed (r2 M1, L2).
    const raw = (env.LEAD_DIGEST_ALERT ?? "").trim();
    const alertAt = /^\d{1,7}$/.test(raw) ? Number(raw) : DIGEST_ALERT_DEFAULT;
    const digest = await sendDigests({ ...ctx, outbox }, alertAt);

    return json({ ok: true, sent, failed, digest: digest.sent, expired }, 200);
  } catch {
    log("error", "notify_retry_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
