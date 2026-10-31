import { createHash } from "node:crypto";
import { resolveTransport, type Env, type TransportConfig } from "./config";
import { leadEmail } from "./email";
import { consoleLogger, type LeadLogger } from "./log";
import { cronAuthorized } from "./retention";
import { DeliveryError, type LeadApp, type LeadEmail, type UnsentLead } from "./types";

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
/** Deferred leads per digest email (AEGIS F1); more wait for the next run. */
const DIGEST_MAX = 100;

const BRAND: Record<LeadApp, string> = { zbm: "Z Best Media", zbc: "Z Best Clips" };

/**
 * AEGIS F1: ONE email for every lead stored past the site-wide email cap.
 * Each lead appears as its own normal notification body (quoted, neutralised
 * visitor text: email.ts), separated by a rule. The idempotency key is
 * derived from the ids, so a retried digest is not delivered twice.
 */
export function digestEmail(app: LeadApp, leads: UnsentLead[]): { email: LeadEmail; key: string } {
  const ids = leads.map((l) => l.submission_id).sort();
  const key = `digest-${app}-${createHash("sha256").update(ids.join(",")).digest("hex").slice(0, 32)}`;
  const parts = leads.map(({ created_at: createdAt, notify_attempts: _a, ...lead }) => leadEmail(lead, createdAt).text);
  return {
    key,
    email: {
      subject: `New leads — ${BRAND[app]} · ${leads.length} leads held by the site-wide email cap`,
      text: [
        `${leads.length} leads arrived while the site-wide cap on lead emails (LEAD_GLOBAL_LIMIT_PER_MINUTE) was reached.`,
        "All of them are stored. Each is below, in the order received. A burst like this can be a flood: check before replying.",
        "",
        parts.join("\n\n==========\n\n"),
      ].join("\n"),
    },
  };
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
    if (!notifier) return json({ ok: true, sent: 0, failed: 0, digest: 0, notify: "disabled" }, 200);
    if (!outbox) {
      log("error", "notify_retry_not_configured", { app, missing: "outbox" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }

    const now = (opts.now ?? (() => new Date()))();

    // AEGIS F1: deferred leads go out as one digest.
    let digest = 0;
    const deferred = await outbox.claimDeferred(app, DIGEST_MAX);
    if (deferred.length) {
      const { email, key } = digestEmail(app, deferred);
      try {
        await notifier.send(email, key);
        for (const lead of deferred) await store.setNotifyStatus(app, lead.submission_id, "sent");
        digest = deferred.length;
        log("info", "notify_digest_sent", { app, notify: "sent", deleted: deferred.length });
      } catch (error) {
        // Stay 'deferred' (the 10-minute lease spaces the retries); health stays degraded.
        const code = error instanceof DeliveryError ? error.code : "notify_failed";
        log("error", "notify_digest_failed", { app, code });
      }
    }

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
    return json({ ok: true, sent, failed, digest }, 200);
  } catch {
    log("error", "notify_retry_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
