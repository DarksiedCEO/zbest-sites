import { resolveTransport, type Env, type TransportConfig } from "./config";
import { leadEmail } from "./email";
import { consoleLogger, type LeadLogger } from "./log";
import { cronAuthorized } from "./retention";
import { DeliveryError, type LeadApp } from "./types";

/**
 * Chaos red team 2026-10-30 CH-8: founder emails are retried.
 *
 * Every lead whose email did not go out stays in the leads table with
 * notify_status 'pending' (the request died between the insert and the
 * email) or 'failed' (the provider refused or was unreachable). That table
 * is the durable outbox. This cron handler, at /api/cron/retry-notify,
 * re-sends due rows with the SAME Resend idempotency key the first attempt
 * used (`lead-<app>-<submission_id>`), so a first attempt that actually
 * reached Resend is not delivered twice within Resend's idempotency window.
 *
 * Schedule (vercel.json): daily, because Vercel Hobby runs cron jobs at most
 * once a day and rejects a deployment with a more frequent schedule. On Pro,
 * set it hourly or every 15 minutes; the backoff below is written for that.
 * The visitor's own resubmit also re-sends (pipeline.ts), and /api/health
 * goes degraded when an unsent lead is older than LEAD_NOTIFY_ALERT_MINUTES.
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
    if (!notifier) return json({ ok: true, sent: 0, failed: 0, notify: "disabled" }, 200);
    if (!outbox) {
      log("error", "notify_retry_not_configured", { app, missing: "outbox" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }

    const now = (opts.now ?? (() => new Date()))();
    const due = await outbox.claimUnsent(app, {
      pendingBefore: new Date(now.getTime() - CRON_PENDING_GRACE_MS),
      maxAttempts: NOTIFY_MAX_ATTEMPTS,
      limit: BATCH,
    });
    let sent = 0;
    let failed = 0;
    for (const row of due) {
      const ids = { app, form: row.form, submission_id: row.submission_id };
      const { created_at: createdAt, notify_attempts: attempts, ...record } = row;
      try {
        await notifier.send(leadEmail(record, createdAt), `lead-${app}-${row.submission_id}`);
        await store.setNotifyStatus(app, row.submission_id, "sent");
        sent += 1;
        log("info", "notify_retried", { ...ids, notify: "sent" });
      } catch (error) {
        failed += 1;
        const code = error instanceof DeliveryError ? error.code : "notify_failed";
        log("error", "notify_retry_failed", { ...ids, code, status: attempts + 1 });
        try {
          await store.setNotifyStatus(app, row.submission_id, "failed", new Date(now.getTime() + notifyBackoffMs(attempts + 1)));
        } catch {
          // The 10-minute lease still keeps the next run from hammering it.
        }
      }
    }
    return json({ ok: true, sent, failed }, 200);
  } catch {
    log("error", "notify_retry_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
