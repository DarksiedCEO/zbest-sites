import { createHash } from "node:crypto";
import { leadEmail } from "./email";
import type { LeadLogger, LogFields } from "./log";
import { DeliveryError, type BatchKind, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type StoredLead } from "./types";

/**
 * Founder-email delivery, shared by the lead route and the retry cron
 * (CH-8; AEGIS F1, r2 M1–M3, L2).
 *
 * Every email is built ONLY from stored values (the stored created_at, never
 * a request clock), so the first attempt and every retry under the same
 * Resend idempotency key carry a byte-identical body (r2 M2). The body's
 * hash is stored with the first attempt:
 *   - a Resend 409 for that key with a matching body means it was already
 *     accepted, so the lead is marked sent;
 *   - Resend keeps a key 24 hours, so once the first attempt is over 23
 *     hours old with no confirmed outcome the lead is never re-sent alone: it
 *     becomes 'delivery_unknown' and goes in the digest, flagged.
 * Digest batches (AEGIS r3 H1) are IMMUTABLE. A batch is formed in one
 * transaction that fixes its leads, its key and the hash of its email body
 * on every row before the first send. A run takes a batch whole (every row
 * locked and leased together) or not at all; a failed or timed-out batch is
 * re-sent later with the same leads, the same body and the same key, never
 * re-sliced; and only the leads of the batch Resend accepted are marked
 * sent. A batch that can no longer be re-sent safely (past the key window,
 * or its rows changed, e.g. a lead was deleted on request) is dissolved and
 * its leads go in a new batch, flagged "may already have been emailed".
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
  if (now - mark.firstAttemptAt.getTime() > KEY_WINDOW_MS) {
    // Not re-sent alone after the key window: it would be a second email if the first one landed.
    await store.setNotifyStatus(app, record.submission_id, "delivery_unknown");
    log("warn", "notify_delivery_unknown", ids);
    return "delivery_unknown";
  }
  try {
    await notifier.send(email, `lead-${app}-${record.submission_id}`);
  } catch (error) {
    if (error instanceof DeliveryError && error.detail === 409) {
      if (mark.bodyHash === hash) {
        // Same key, same body: Resend already has it (or is processing it).
        await store.setNotifyStatus(app, record.submission_id, "sent");
        log("info", "notify_already_sent", ids);
        return "sent";
      }
      await store.setNotifyStatus(app, record.submission_id, "delivery_unknown");
      log("warn", "notify_delivery_unknown", { ...ids, code: "body_mismatch" });
      return "delivery_unknown";
    }
    const code = error instanceof DeliveryError ? error.code : "notify_failed";
    const status = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "notify_failed", { ...ids, code, status: status ?? "none" });
    await store.setNotifyStatus(app, record.submission_id, "failed", retryAt?.(attempts + 1));
    return "failed";
  }
  await store.setNotifyStatus(app, record.submission_id, "sent");
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
  const quarantined = sorted.filter((l) => l.quarantined).length;
  const parts = sorted.map((l) => {
    const { created_at: createdAt, ...rest } = l;
    const flags = [
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
      `${sorted.length} stored leads whose own email was held back: a site-wide email cap was reached, the lead was quarantined, its own email could not be sent within an hour, or an earlier email's outcome is unknown.`,
      ...(unknown ? [`${unknown} of them may already have been emailed.`] : []),
      ...(quarantined ? [`${quarantined} of them were quarantined (marked QUARANTINED below).`] : []),
      "A burst like this can be a flood: check before replying. Each lead follows, oldest first.",
      "",
      parts.join("\n\n==========\n\n"),
    ].join("\n"),
  };
}

/** The count email for leads too old to retry (r2 M3, r3 M3): a count and dates, never their contents. */
export function expiredEmail(app: LeadApp, leads: StoredLead[], days: number): LeadEmail {
  const sorted = byAge(leads);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  return {
    subject: `Lead email backlog — ${BRAND[app]} · ${sorted.length} older leads were never emailed`,
    text: [
      `${sorted.length} older leads, submitted between ${day(sorted[0]!.created_at)} and ${day(sorted[sorted.length - 1]!.created_at)}, never had their lead email delivered (they were more than ${days} days old when the retry job found them).`,
      "They are stored in the database. They are not emailed one by one; run `pnpm --filter @zbest/lead notify-backlog-report` to see the counts, and read them in the database.",
    ].join("\n"),
  };
}

/** Every key is new: the kind, the leads and the moment the batch was formed. */
const batchKey = (kind: BatchKind, app: LeadApp, leads: StoredLead[], formedAt: number) =>
  `${kind}-${app}-${sha256(`${formedAt}|${leads.map((l) => l.submission_id).sort().join(",")}`).slice(0, 32)}`;

/** Leads per count email for expired leads: the body is only a count. */
export const EXPIRED_CHUNK = 10_000;

/**
 * Sends every batch of this kind that is due (AEGIS r2 M1, r3 H1/M3): first
 * existing batches (whole, same body, same key), then new ones of
 * DIGEST_CHUNK leads, bounded per run. Returns how many leads Resend accepted.
 */
export async function sendBatches(
  ctx: Ctx & { outbox: NotifyOutbox },
  kind: BatchKind,
  opts: { alertAt?: number; days?: number } = {},
): Promise<{ sent: number; failedEmails: number }> {
  const { app, outbox, notifier, log } = ctx;
  const now = () => (ctx.now ?? Date.now)();
  const days = opts.days ?? 3;
  const build = (leads: StoredLead[]) => (kind === "digest" ? digestEmail(app, leads) : expiredEmail(app, leads, days));
  const seal = (leads: StoredLead[]) => ({ key: batchKey(kind, app, leads, now()), hash: emailHash(build(leads)) });
  let sent = 0;
  let failedEmails = 0;
  let emails = 0;
  for (let steps = 0; emails < DIGEST_MAX_EMAILS_PER_RUN && steps < DIGEST_MAX_EMAILS_PER_RUN * 3; steps++) {
    const batch =
      (await outbox.claimBatch(app, kind)) ?? (await outbox.formBatch(app, kind, kind === "digest" ? DIGEST_CHUNK : EXPIRED_CHUNK, seal));
    if (!batch) break;
    const { key, leads } = batch;
    const formedAt = leads[0]?.notify_batch_at?.getTime() ?? 0;
    const email = build(leads);
    if (now() - formedAt > KEY_WINDOW_MS || leads.some((l) => l.notify_batch_hash !== emailHash(email))) {
      // Cannot be re-sent safely under this key: its leads go in a new batch, flagged.
      log("warn", "notify_batch_dissolved", { app, code: now() - formedAt > KEY_WINDOW_MS ? "key_window" : "body_changed", deleted: leads.length });
      await outbox.clearBatch(app, kind, key);
      continue;
    }
    emails += 1;
    try {
      await notifier.send(email, key);
    } catch (error) {
      if (!(error instanceof DeliveryError && error.detail === 409)) {
        failedEmails += 1;
        // The batch keeps its leads, key, body hash and lease: the next run
        // re-sends exactly this email under exactly this key.
        log("error", "notify_digest_failed", { app, code: error instanceof DeliveryError ? error.code : "notify_failed" });
        break; // provider trouble: stop; the lease spaces the retries
      }
      // 409 for this key: every send under it carried this exact body (its
      // hash is fixed on the rows and checked above), and a run holds the
      // batch's lease for the whole send, so Resend already accepted it.
    }
    const marked = await outbox.markBatchSent(app, kind, key, leads.map((l) => l.submission_id));
    sent += marked;
    log("info", "notify_digest_sent", { app, notify: kind === "digest" ? "sent" : "expired_reported", deleted: marked });
  }
  if (kind === "digest" && sent > (opts.alertAt ?? DIGEST_ALERT_DEFAULT)) log("error", "digest_backlog_high", { app, deleted: sent });
  return { sent, failedEmails };
}
