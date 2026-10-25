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
  /** FULL-SERVICE-DESIGN §4.1: a column, not only inside the payload. */
  services: string[];
  /** Campaign tag from ?src= / ?utm_campaign=, lowercase, or null. */
  source: string | null;
  /** HMAC of the client IP. The raw IP is never stored. */
  ip_hash: string | null;
  user_agent: string | null;
};

export type NotifyStatus = "pending" | "sent" | "failed" | "disabled";

export interface LeadStore {
  /**
   * Upsert on (app, submission_id). `inserted: false` means it already existed:
   * a double-click or a retry, which is one lead, not two.
   */
  insert(record: LeadRecord): Promise<{ inserted: boolean }>;
  setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus): Promise<void>;
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
