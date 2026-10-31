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

/**
 * "deferred" (AEGIS F1): past an email cap or quarantined; sent in a digest.
 * "delivery_unknown" (AEGIS r2 M2): the first attempt's outcome is unknown
 * and Resend's 24 h idempotency window has (nearly) passed, so it goes in the
 * digest, flagged, instead of being re-sent alone. "expired_notify" (r2 M3):
 * too old to retry; counted in a count email, and /api/health stays degraded
 * until that email is accepted, when it becomes "expired_reported" (r3 M3).
 */
export type NotifyStatus = "pending" | "sent" | "failed" | "disabled" | "deferred" | "delivery_unknown" | "expired_notify" | "expired_reported";

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
  /** SHA-256 of the batch email body, fixed when the batch was formed (AEGIS r3 H1). */
  notify_batch_hash: string | null;
  quarantined: boolean;
};
/** Kept for readability at call sites: an unsent lead is a stored lead. */
export type UnsentLead = StoredLead;

export interface LeadStore {
  /**
   * Upsert on (app, submission_id). `deadline` (epoch ms, AEGIS r2 L3): the
   * store stops waiting after it. A statement already sent may still commit
   * afterwards (AEGIS r3 L1), so the visitor is told the lead may have
   * reached us, and the retry cron emails it if it did.
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
  /** Flags a lead quarantined. Its stored text is never changed (AEGIS r3 M1). */
  quarantine(app: LeadApp, submissionId: string): Promise<void>;
}

/** Which batches: lead digests, or the count email for expired leads (AEGIS r3 M3). */
export type BatchKind = "digest" | "expired";
/** A formed batch: its key and every one of its leads. */
export type Batch = { key: string; leads: StoredLead[] };

/**
 * The durable notification outbox (CH-8, AEGIS F1, r2 M1–M3, L2, r3 H1/M3/L3).
 */
export interface NotifyOutbox {
  /** 'failed' rows and stale 'pending' rows created after `createdAfter`, leased. */
  claimUnsent(app: LeadApp, opts: { pendingBefore: Date; createdAfter: Date; maxAttempts: number; limit: number }): Promise<StoredLead[]>;
  /** 'pending'/'failed' rows created before `createdBefore` become 'expired_notify'; returns how many. */
  expireOld(app: LeadApp, createdBefore: Date): Promise<number>;
  /** 'pending'/'failed' rows whose first attempt was before `firstAttemptBefore` become 'delivery_unknown'; returns how many. */
  markUnknown(app: LeadApp, firstAttemptBefore: Date): Promise<number>;
  /**
   * AEGIS r3 L3: 'pending'/'failed' rows created before `createdBefore` go to
   * the digest — 'deferred' if never attempted, else 'delivery_unknown'.
   */
  moveToDigest(app: LeadApp, createdBefore: Date): Promise<number>;
  /**
   * AEGIS r3 H1: claims ONE existing batch of this kind, whole: every row with
   * its key is locked and leased in one transaction, or none is (another run
   * holds it). Null when no batch is due.
   */
  claimBatch(app: LeadApp, kind: BatchKind): Promise<Batch | null>;
  /**
   * Forms a new batch from up to `limit` unbatched rows of this kind, oldest
   * first, and fixes it in the same transaction: `seal` gives its key and the
   * hash of its email body, written to every row before any send. Null when
   * there is nothing to batch.
   */
  formBatch(app: LeadApp, kind: BatchKind, limit: number, seal: (leads: StoredLead[]) => { key: string; hash: string }): Promise<Batch | null>;
  /**
   * The batch Resend accepted: exactly these leads (and only while they are
   * still in batch `key`) become 'sent' ('expired_reported' for an expired batch).
   */
  markBatchSent(app: LeadApp, kind: BatchKind, key: string, submissionIds: string[]): Promise<number>;
  /**
   * Dissolves a batch that can no longer be re-sent under its key (past the
   * key window, or its rows changed). Digest leads become 'delivery_unknown'
   * (the old email may have landed) and go in a new batch, flagged.
   */
  clearBatch(app: LeadApp, kind: BatchKind, key: string): Promise<void>;
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
