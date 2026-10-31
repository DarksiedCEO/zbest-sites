import { createHash } from "node:crypto";
import { leadEmail } from "./email";
import type { LeadLogger, LogFields } from "./log";
import { DeliveryError, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type StoredLead } from "./types";

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
 * Digest batches get a key derived from their ids, recorded on the rows
 * BEFORE the send; a batch whose send timed out is re-sent under the same key
 * with the same body (built from the same stored rows), never folded into a
 * second, overlapping digest (r2 L2).
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

/** One digest email for these leads, built only from their stored values. Same leads → same body. */
export function digestEmail(app: LeadApp, leads: StoredLead[]): LeadEmail {
  const sorted = [...leads].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime() || (a.submission_id < b.submission_id ? -1 : 1),
  );
  const unknown = sorted.filter((l) => l.notify_status === "delivery_unknown").length;
  const quarantined = sorted.filter((l) => l.quarantined).length;
  const parts = sorted.map((l) => {
    const { created_at: createdAt, ...rest } = l;
    const flags = [
      l.notify_status === "delivery_unknown" ? "This lead may already have been emailed: its first email's outcome is unknown." : "",
      l.quarantined ? "Quarantined: stored past the daily limit, its text cut to 2 KB." : "",
    ].filter(Boolean);
    return [...flags, leadEmail(rest, createdAt).text].join("\n");
  });
  return {
    subject: `New leads — ${BRAND[app]} · ${sorted.length} leads held for the digest`,
    text: [
      `${sorted.length} stored leads whose own email was held back: a site-wide email cap was reached, or the lead was quarantined, or an earlier email's outcome is unknown.`,
      ...(unknown ? [`${unknown} of them may already have been emailed.`] : []),
      ...(quarantined ? [`${quarantined} of them were quarantined.`] : []),
      "A burst like this can be a flood: check before replying. Each lead follows, oldest first.",
      "",
      parts.join("\n\n==========\n\n"),
    ].join("\n"),
  };
}

export const digestKey = (app: LeadApp, leads: StoredLead[]) =>
  `digest-${app}-${sha256(leads.map((l) => l.submission_id).sort().join(",")).slice(0, 32)}`;

/**
 * Sends every lead waiting for a digest (r2 M1), 100 per email, in as many
 * emails as needed (bounded per run). Returns how many leads were sent.
 */
export async function sendDigests(ctx: Ctx & { outbox: NotifyOutbox }, alertAt = DIGEST_ALERT_DEFAULT): Promise<{ sent: number; failedEmails: number }> {
  const { app, outbox, notifier, log } = ctx;
  let sent = 0;
  let failedEmails = 0;
  let emails = 0;
  const sendBatch = async (key: string, leads: StoredLead[]) => {
    emails += 1;
    try {
      await notifier.send(digestEmail(app, leads), key);
    } catch (error) {
      if (!(error instanceof DeliveryError && error.detail === 409)) {
        failedEmails += 1;
        // Rows keep their batch key and lease: the next run re-sends this batch under the same key.
        log("error", "notify_digest_failed", { app, code: error instanceof DeliveryError ? error.code : "notify_failed" });
        return;
      }
      // 409 for a batch key: the body is rebuilt from the same stored rows, so it is the batch already accepted.
    }
    await outbox.markBatchSent(app, key);
    sent += leads.length;
    log("info", "notify_digest_sent", { app, notify: "sent", deleted: leads.length });
  };
  while (emails < DIGEST_MAX_EMAILS_PER_RUN) {
    const claimed = await outbox.claimDigest(app, DIGEST_CHUNK * 10);
    if (!claimed.length) break;
    const batches = new Map<string, StoredLead[]>();
    const fresh: StoredLead[] = [];
    for (const lead of claimed) {
      if (lead.notify_batch) batches.set(lead.notify_batch, [...(batches.get(lead.notify_batch) ?? []), lead]);
      else fresh.push(lead);
    }
    for (const [key, leads] of batches) {
      const batchAt = leads[0]!.notify_batch_at?.getTime() ?? 0;
      if ((ctx.now ?? Date.now)() - batchAt > KEY_WINDOW_MS) {
        // Past the key window the batch cannot be re-sent safely under its key: its leads go in a new batch, flagged.
        await outbox.clearBatch(app, key);
        continue;
      }
      if (emails >= DIGEST_MAX_EMAILS_PER_RUN) break;
      await sendBatch(key, leads);
    }
    for (let i = 0; i < fresh.length && emails < DIGEST_MAX_EMAILS_PER_RUN; i += DIGEST_CHUNK) {
      const chunk = fresh.slice(i, i + DIGEST_CHUNK);
      const key = digestKey(app, chunk);
      await outbox.assignBatch(app, chunk.map((l) => l.submission_id), key);
      await sendBatch(key, chunk.map((l) => ({ ...l, notify_batch: key })));
    }
    if (failedEmails) break; // provider trouble: stop, the leases space the retries
  }
  if (sent > alertAt) log("error", "digest_backlog_high", { app, deleted: sent });
  return { sent, failedEmails };
}

/** The once-per-run line for leads too old to retry (r2 M3): a count, never their contents. */
export function expiredEmail(app: LeadApp, count: number, days: number): LeadEmail {
  return {
    subject: `Lead email backlog — ${BRAND[app]} · ${count} older leads were never emailed`,
    text: [
      `${count} older leads (submitted more than ${days} days ago) never had their lead email delivered.`,
      "They are stored in the database. They are not emailed one by one; run `pnpm --filter @zbest/lead notify-backlog-report` to see the counts, and read them in the database.",
    ].join("\n"),
  };
}
