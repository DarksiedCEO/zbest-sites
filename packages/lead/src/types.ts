/**
 * The lead delivery adapter's ports (Brief §6.2; Backend Spec §9: every
 * external call behind a typed adapter). Route handlers depend on these
 * interfaces only; which implementation sits behind them is decided by env in
 * config.ts, so tests swap in fakes without touching a handler.
 */

export type LeadApp = "zbm" | "zbc";

/** One row of the §6.2 leads table, as the store receives it. */
export type LeadRecord = {
  submission_id: string;
  app: LeadApp;
  form: string;
  /** What the visitor submitted, already validated by the app's schema. */
  payload: Record<string, unknown>;
  /** SHA-256 of the canonical payload: tells a retry from a changed resubmission. */
  payload_hash: string;
  /**
   * SHA-256 of the NORMALISED content (form, region, payload; case, spacing
   * and Unicode form ignored): the same message sent again under a new
   * submission_id within DEDUPE_WINDOW_HOURS is one lead (RTS-3).
   */
  content_hash: string;
  /** FULL-SERVICE-DESIGN §4.1: a column, not only inside the payload. */
  services: string[];
  /** Campaign tag from ?src= / ?utm_campaign=, lowercase, or null. */
  source: string | null;
  /** Self-declared US state or territory (US-CA, US-DC, PR, GU, VI, AS, MP); always a served one. A column, so leads filter by market. */
  service_area: string;
  user_agent: string | null;
};

/** "deferred" (AEGIS F1): stored past the site-wide email cap; sent in the next digest. */
/**
 * "deferred" (AEGIS F1): past an email cap or quarantined; sent in a digest.
 * "delivery_unknown" (AEGIS r2 M2): the first attempt's outcome is unknown
 * and Resend's 24 h idempotency window has (nearly) passed, so it goes in the
 * digest, flagged, instead of being re-sent alone. "expired_notify" (r2 M3):
 * too old to retry; counted once in a digest line, then left alone.
 */
export type NotifyStatus = "pending" | "sent" | "failed" | "disabled" | "deferred" | "delivery_unknown" | "expired_notify";

/**
 * `inserted: false` means (app, submission_id) already existed. With the same
 * payload it is a double-click or a retry — one lead, not two. With a
 * different payload it is a conflicting resubmission, which the pipeline
 * refuses (409) rather than silently dropping the edit (AEGIS L2).
 */
export type InsertResult =
  /** createdAt (AEGIS r2 M2): the stored time, which every email for this lead is built from. */
  | { inserted: true; createdAt: Date }
  /**
   * stored (CH-8, r2 M2): the stored row, so a resubmit of a lead whose
   * email never went out can send it — built from stored values only.
   */
  | { inserted: false; samePayload: boolean; stored?: StoredLead }
  /** The same normalised content from this app within DEDUPE_WINDOW_HOURS: nothing new stored (RTS-3). */
  /** `original` (AEGIS F3): the stored copy, so an unsent email can still go out. */
  | { inserted: false; duplicateOf: "content"; original?: StoredLead };

/** How long an identical normalised submission counts as the same lead. */
export const DEDUPE_WINDOW_HOURS = 24;

/** A stored lead with its notification state (CH-8 outbox; AEGIS r2 M2/L2). */
export type StoredLead = LeadRecord & {
  created_at: Date;
  notify_status: NotifyStatus;
  notify_attempts: number;
  /** When the first email attempt was made (Resend keeps an idempotency key 24 h). */
  notify_first_attempt_at: Date | null;
  /** SHA-256 of the email body first sent under this lead's key. */
  notify_body_hash: string | null;
  /** The digest batch key this lead was put in, if any, and when. */
  notify_batch: string | null;
  notify_batch_at: Date | null;
  quarantined: boolean;
};
/** Kept for readability at call sites: an unsent lead is a stored lead. */
export type UnsentLead = StoredLead;

export interface LeadStore {
  /**
   * Upsert on (app, submission_id). `deadline` (epoch ms, AEGIS r2 L3): the
   * store gives up — and never commits — after it, so a visitor told "nothing
   * was saved" is never wrong.
   */
  insert(record: LeadRecord, opts?: { deadline?: number }): Promise<InsertResult>;
  /**
   * Records the email outcome. "failed" also counts an attempt; `retryAt`
   * (set by the retry cron) is when the next retry may happen (CH-8).
   */
  setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus, retryAt?: Date): Promise<void>;
  /**
   * Before an email attempt (AEGIS r2 M2): records the first attempt time
   * and body hash if not yet set, and returns what is stored.
   */
  markAttempt(app: LeadApp, submissionId: string, bodyHash: string): Promise<{ firstAttemptAt: Date; bodyHash: string }>;
  /** AEGIS r2 H1: flags a lead quarantined and replaces its payload with the truncated one. */
  quarantine(app: LeadApp, submissionId: string, payload: Record<string, unknown>): Promise<void>;
}

/**
 * The durable notification outbox (CH-8, AEGIS F1, r2 M1–M3, L2).
 */
export interface NotifyOutbox {
  /** 'failed' rows and stale 'pending' rows created after `createdAfter`, leased. */
  claimUnsent(app: LeadApp, opts: { pendingBefore: Date; createdAfter: Date; maxAttempts: number; limit: number }): Promise<StoredLead[]>;
  /** 'pending'/'failed' rows created before `createdBefore` become 'expired_notify'; returns how many. */
  expireOld(app: LeadApp, createdBefore: Date): Promise<number>;
  /** 'pending'/'failed' rows whose first attempt was before `firstAttemptBefore` become 'delivery_unknown'; returns how many. */
  markUnknown(app: LeadApp, firstAttemptBefore: Date): Promise<number>;
  /** 'deferred' and 'delivery_unknown' rows due for a digest, leased. */
  claimDigest(app: LeadApp, limit: number): Promise<StoredLead[]>;
  /** Puts these leads in digest batch `key` (and records the batch's first attempt). */
  assignBatch(app: LeadApp, submissionIds: string[], key: string): Promise<void>;
  /** Every lead in batch `key` is sent (one statement). */
  markBatchSent(app: LeadApp, key: string): Promise<void>;
  /** Clears the batch of leads whose batch attempt is too old to re-send under its key. */
  clearBatch(app: LeadApp, key: string): Promise<void>;
}

export type LeadEmail = {
  subject: string;
  text: string;
  /** Set when the visitor gave an email address, so a reply goes to them. */
  replyTo?: string;
};

export interface LeadNotifier {
  /** Resolves when the provider accepted the message; throws otherwise. */
  send(email: LeadEmail, idempotencyKey: string): Promise<void>;
}

export type RateDecision = { allowed: true } | { allowed: false; retryAfterSec: number };

export interface RateLimiter {
  hit(key: string): Promise<RateDecision>;
}

/** Errors whose details are safe to log: a code, never a provider body. */
export class DeliveryError extends Error {
  constructor(
    readonly code: string,
    readonly detail?: string | number,
  ) {
    super(code);
    this.name = "DeliveryError";
  }
}
