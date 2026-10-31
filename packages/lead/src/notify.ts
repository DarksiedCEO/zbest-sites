import { createHash } from "node:crypto";
import { leadEmail } from "./email";
import type { LeadLogger, LogFields } from "./log";
import { DeliveryError, type BatchKind, type BatchSummary, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type StoredLead } from "./types";

/**
 * Founder-email delivery, shared by the lead route and the retry cron
 * (CH-8; AEGIS F1, r2 M1–M3, L2).
 *
 * Every email is built ONLY from stored values (the stored created_at, never
 * a request clock), so the first attempt and every retry under the same
 * Resend idempotency key carry a byte-identical body (r2 M2). The body's
 * hash is stored with the first attempt:
 *   - a Resend 409 is NEVER taken as accepted (AEGIS r4 L2): it can mean the
 *     key is still in flight, and an in-flight request can still fail. The
 *     lead stays unsent, flagged outcome-unknown, with an error-level alert;
 *     the next retry gets Resend's replay of the original response (with its
 *     email id) if it was accepted;
 *   - Resend keeps a key 24 hours, so once the first attempt is over 23
 *     hours old with an unknown outcome the lead is never re-sent alone: it
 *     becomes 'delivery_unknown' and goes in the digest, flagged. A lead whose
 *     attempts all failed definitely goes in the digest unflagged (r4 L6).
 * Every accepted send stores Resend's email id; the cron later reads that
 * email's last_event and puts a lead whose email was not delivered back in
 * the digest, flagged (AEGIS r4 M2, checkDeliveries).
 * Digest batches (AEGIS r3 H1) are IMMUTABLE. A batch is formed in one
 * transaction that fixes its leads, its key and the hash of its email body
 * on every row before the first send. A run takes a batch whole (every row
 * locked and leased together) or not at all; a failed or timed-out batch is
 * re-sent later with the same leads, the same body and the same key, never
 * re-sliced; and only the leads of the batch Resend accepted are marked
 * sent. A batch that can no longer be re-sent safely (past the key window,
 * or its rows changed, e.g. a lead was deleted on request) is dissolved and
 * its leads go in a new batch — flagged "may already have been emailed" only
 * if a send of it may have been accepted (r4 L6).
 */

/** Resend keeps an idempotency key for 24 h; past this an unconfirmed attempt is not re-sent alone. */
export const KEY_WINDOW_MS = 23 * 3_600_000;
/** Leads per digest email (r2 M1: one run sends them all, in as many emails as needed). */
export const DIGEST_CHUNK = 100;
/** Bounds one cron run: at most this many digest emails. */
export const DIGEST_MAX_EMAILS_PER_RUN = 50;
/** Digest backlog over this logs an error-level alert. */
export const DIGEST_ALERT_DEFAULT = 500;

const BRAND: Record<LeadApp, string> = { zbm: "Z Best Media", zbc: "Z Best Clips" };
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const emailHash = (email: LeadEmail) => sha256(JSON.stringify([email.subject, email.text, email.replyTo ?? null]));

export type Delivery = "sent" | "failed" | "delivery_unknown";

type Ctx = { app: LeadApp; store: LeadStore; notifier: LeadNotifier; log: LeadLogger; now?: () => number };

/** Resend's id from a send result, if it gave one. */
const idOf = (result: void | { id?: string }) => (result && typeof result.id === "string" && result.id ? result.id : undefined);
/** No HTTP answer at all (timeout, network): the email may or may not have been accepted. */
const unknownOutcome = (error: unknown) => !(error instanceof DeliveryError) || typeof error.detail !== "number";

/**
 * One lead's email. Records the outcome on the row: 'sent', 'failed' (with
 * `retryAt` when the cron schedules the next try) or 'delivery_unknown'.
 */
export async function deliverLead(
  ctx: Ctx,
  lead: LeadRecord & { created_at: Date },
  ids: LogFields,
  retryAt?: (attempts: number) => Date,
  attempts = 0,
): Promise<Delivery> {
  const { app, store, notifier, log } = ctx;
  const now = (ctx.now ?? Date.now)();
  const { created_at: createdAt, ...record } = lead;
  const email = leadEmail(record, createdAt);
  const hash = emailHash(email);
  const mark = await store.markAttempt(app, record.submission_id, hash);
  const wasUnknown = "notify_outcome_unknown" in lead && (lead as StoredLead).notify_outcome_unknown;
  if (now - mark.firstAttemptAt.getTime() > KEY_WINDOW_MS) {
    // Not re-sent alone after the key window. Flagged in the digest only if
    // an earlier attempt may have landed (r4 L6).
    const status = wasUnknown ? "delivery_unknown" : "deferred";
    await store.setNotifyStatus(app, record.submission_id, status);
    log("warn", "notify_delivery_unknown", { ...ids, notify: status });
    return wasUnknown ? "delivery_unknown" : "failed";
  }
  let result: void | { id?: string };
  try {
    result = await notifier.send(email, `lead-${app}-${record.submission_id}`);
  } catch (error) {
    if (error instanceof DeliveryError && error.detail === 409) {
      if (mark.bodyHash === hash) {
        // AEGIS r4 L2: same key, same body, but a 409 is not proof of
        // acceptance (the key may be in flight). Retried later; the replay of
        // an accepted original then returns its id.
        await store.setNotifyStatus(app, record.submission_id, "failed", retryAt?.(attempts + 1), { outcomeUnknown: true });
        log("error", "notify_conflict_pending", ids);
        return "failed";
      }
      await store.setNotifyStatus(app, record.submission_id, "delivery_unknown", undefined, { outcomeUnknown: true });
      log("warn", "notify_delivery_unknown", { ...ids, code: "body_mismatch" });
      return "delivery_unknown";
    }
    const code = error instanceof DeliveryError ? error.code : "notify_failed";
    const status = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "notify_failed", { ...ids, code, status: status ?? "none" });
    await store.setNotifyStatus(app, record.submission_id, "failed", retryAt?.(attempts + 1), { outcomeUnknown: unknownOutcome(error) });
    return "failed";
  }
  const emailId = idOf(result);
  await store.setNotifyStatus(app, record.submission_id, "sent", undefined, emailId ? { emailId } : {});
  return "sent";
}

/** Oldest first, ties by id: the one order every batch email is built in. */
const byAge = (leads: StoredLead[]) =>
  [...leads].sort((a, b) => a.created_at.getTime() - b.created_at.getTime() || (a.submission_id < b.submission_id ? -1 : 1));

/**
 * One digest email for these leads, built only from their stored values
 * (payload, stored created_at, status at batching, quarantine flag), which do
 * not change while the batch exists: same leads → same body.
 */
export function digestEmail(app: LeadApp, leads: StoredLead[]): LeadEmail {
  const sorted = byAge(leads);
  const unknown = sorted.filter((l) => l.notify_status === "delivery_unknown").length;
  const undelivered = sorted.filter((l) => l.notify_delivery === "undelivered" || l.notify_delivery === "unconfirmed").length;
  const quarantined = sorted.filter((l) => l.quarantined).length;
  const parts = sorted.map((l) => {
    const { created_at: createdAt, ...rest } = l;
    const flags = [
      l.notify_delivery === "undelivered"
        ? "An earlier email with this lead was not delivered (Resend reported it bounced, complained, suppressed or failed). It is sent again here."
        : "",
      l.notify_delivery === "unconfirmed"
        ? "An earlier email with this lead was accepted but its delivery was never confirmed. It is sent again here; it may be a duplicate."
        : "",
      l.notify_status === "delivery_unknown" ? "This lead may already have been emailed: an earlier email's outcome is unknown." : "",
      l.quarantined
        ? "QUARANTINED: stored while its network, or the site as a whole, was sending an unusual number of leads. Its full text follows; check before replying."
        : "",
    ].filter(Boolean);
    return [...flags, leadEmail(rest, createdAt).text].join("\n");
  });
  return {
    subject: `New leads — ${BRAND[app]} · ${sorted.length} leads held for the digest`,
    text: [
      `${sorted.length} stored leads whose own email was held back: a site-wide email cap was reached, the lead was quarantined, its own email could not be sent within an hour, an earlier email was not delivered, or an earlier email's outcome is unknown.`,
      ...(unknown ? [`${unknown} of them may already have been emailed.`] : []),
      ...(undelivered ? [`${undelivered} of them are re-sent because an earlier email was not delivered or not confirmed.`] : []),
      ...(quarantined ? [`${quarantined} of them were quarantined (marked QUARANTINED below).`] : []),
      "A burst like this can be a flood: check before replying. Each lead follows, oldest first.",
      "",
      parts.join("\n\n==========\n\n"),
    ].join("\n"),
  };
}

/** The count email for leads too old to retry (r2 M3, r3 M3): a count and dates, never their contents (r4 L3). */
export function expiredEmail(app: LeadApp, summary: BatchSummary, days: number): LeadEmail {
  const day = (d: Date) => d.toISOString().slice(0, 10);
  return {
    subject: `Lead email backlog — ${BRAND[app]} · ${summary.count} older leads were never emailed`,
    text: [
      `${summary.count} older leads, submitted between ${day(summary.oldest)} and ${day(summary.newest)}, never had their lead email delivered (they were more than ${days} days old when the retry job found them).`,
      "They are stored in the database until normal deletion. They are not emailed one by one; run `pnpm --filter @zbest/lead notify-backlog-report` to see the counts, and read them in the database.",
    ].join("\n"),
  };
}

/** Leads per count email for expired leads: the body is only a count. */
export const EXPIRED_CHUNK = 10_000;

/**
 * Sends every batch of this kind that is due (AEGIS r2 M1, r3 H1/M3, r4
 * L2/L6): first existing batches (whole, same body, same key), then new ones
 * of DIGEST_CHUNK leads, bounded per run. Returns how many leads Resend accepted.
 */
export async function sendBatches(
  ctx: Ctx & { outbox: NotifyOutbox },
  kind: BatchKind,
  opts: { alertAt?: number; days?: number } = {},
): Promise<{ sent: number; failedEmails: number }> {
  const { app, outbox, notifier, log } = ctx;
  const now = () => (ctx.now ?? Date.now)();
  const days = opts.days ?? 3;
  const build = (b: { leads: StoredLead[]; summary: BatchSummary }) => (kind === "digest" ? digestEmail(app, b.leads) : expiredEmail(app, b.summary, days));
  let sent = 0;
  let failedEmails = 0;
  let emails = 0;
  for (let steps = 0; emails < DIGEST_MAX_EMAILS_PER_RUN && steps < DIGEST_MAX_EMAILS_PER_RUN * 3; steps++) {
    const batch =
      (await outbox.claimBatch(app, kind)) ??
      (await outbox.formBatch(app, kind, kind === "digest" ? DIGEST_CHUNK : EXPIRED_CHUNK, (b) => emailHash(build(b))));
    if (!batch) break;
    const { key, leads, summary } = batch;
    const formedAt = summary.formedAt?.getTime() ?? 0;
    const email = build(batch);
    const tooOld = now() - formedAt > KEY_WINDOW_MS;
    if (tooOld || summary.hash !== emailHash(email) || (kind === "digest" && leads.some((l) => l.notify_batch_hash !== summary.hash))) {
      // Cannot be re-sent safely under this key: its leads go in a new batch
      // (flagged only if a send of it may have been accepted: r4 L6).
      log("warn", "notify_batch_dissolved", { app, code: tooOld ? "key_window" : "body_changed", deleted: summary.count });
      await outbox.clearBatch(app, kind, key);
      continue;
    }
    emails += 1;
    let result: void | { id?: string };
    try {
      result = await notifier.send(email, key);
    } catch (error) {
      if (error instanceof DeliveryError && error.detail === 409) {
        // AEGIS r4 L2: not proof of acceptance (the key may be in flight, and
        // an in-flight request can still fail). The batch stays as it is,
        // leased; the next run's send gets Resend's replay if it was accepted.
        await outbox.markBatchUnknown(app, key);
        log("error", "notify_conflict_pending", { app, notify: kind, deleted: summary.count });
        continue;
      }
      failedEmails += 1;
      // The batch keeps its leads, key, body hash and lease: the next run
      // re-sends exactly this email under exactly this key.
      if (unknownOutcome(error)) await outbox.markBatchUnknown(app, key);
      log("error", "notify_digest_failed", { app, code: error instanceof DeliveryError ? error.code : "notify_failed" });
      break; // provider trouble: stop; the lease spaces the retries
    }
    const marked = await outbox.markBatchSent(app, kind, key, leads.map((l) => l.submission_id), idOf(result));
    sent += marked;
    log("info", "notify_digest_sent", { app, notify: kind === "digest" ? "sent" : "expired_reported", deleted: marked });
  }
  if (kind === "digest" && sent > (opts.alertAt ?? DIGEST_ALERT_DEFAULT)) log("error", "digest_backlog_high", { app, deleted: sent });
  return { sent, failedEmails };
}

/** Resend `last_event` values (resend.com/docs/dashboard/emails/manage-emails). */
const DELIVERED_EVENTS = new Set(["delivered", "opened", "clicked"]);
const UNDELIVERED_EVENTS = new Set(["bounced", "complained", "suppressed", "failed", "canceled"]);
const PENDING_EVENTS = new Set(["sent", "queued", "scheduled", "delivery_delayed"]);
/** Emails checked per run; the Resend client spaces the requests. */
export const DELIVERY_CHECKS_PER_RUN = 20;
/** How long after sending an email is checked; still unconfirmed after this, it is re-sent, flagged. */
export const DELIVERY_CHECK_WINDOW_MS = 48 * 3_600_000;

/**
 * AEGIS r4 M2: the delivery signal, without a public webhook. For recently
 * sent emails not yet confirmed, reads Resend's last_event:
 *   - delivered / opened / clicked: final, never checked again;
 *   - bounced / complained / suppressed / failed / canceled: not delivered —
 *     its leads go back in the next digest, flagged, /api/health reports
 *     delivery_failed for 24 h, and an error is logged;
 *   - sent / queued / scheduled / delivery_delayed, or any value not in
 *     Resend's documented list: checked again next run (an unknown value is
 *     logged), never taken as delivered;
 *   - still not final DELIVERY_CHECK_WINDOW_MS after sending: 'unconfirmed',
 *     re-sent flagged as a possible duplicate, health degraded.
 * Bounded to DELIVERY_CHECKS_PER_RUN emails; stops at the first unreadable answer.
 */
export async function checkDeliveries(ctx: Ctx & { outbox: NotifyOutbox }): Promise<{ checked: number; undelivered: number }> {
  const { app, outbox, notifier, log } = ctx;
  if (!notifier.lastEvent) return { checked: 0, undelivered: 0 };
  const now = (ctx.now ?? Date.now)();
  let undelivered = 0;
  const stale = await outbox.expireDeliveryChecks(app, new Date(now - DELIVERY_CHECK_WINDOW_MS));
  if (stale > 0) {
    undelivered += stale;
    log("error", "notify_not_delivered", { app, code: "unconfirmed", deleted: stale });
  }
  const ids = await outbox.deliveriesToCheck(app, new Date(now - DELIVERY_CHECK_WINDOW_MS), DELIVERY_CHECKS_PER_RUN);
  let checked = 0;
  for (const id of ids) {
    const event = await notifier.lastEvent(id);
    if (event === null) break; // provider unreadable now: try next run
    checked += 1;
    if (DELIVERED_EVENTS.has(event)) await outbox.recordDelivery(app, id, "delivered");
    else if (UNDELIVERED_EVENTS.has(event)) {
      const n = await outbox.recordDelivery(app, id, "undelivered");
      undelivered += n;
      log("error", "notify_not_delivered", { app, code: event, deleted: n });
    } else if (!PENDING_EVENTS.has(event)) log("warn", "notify_delivery_event_unknown", { app, code: event.slice(0, 40) });
  }
  return { checked, undelivered };
}
