import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { LeadApp } from "./types";

/**
 * Server-issued form token (red team 2026-10-30, RTS-3).
 *
 * GET /api/lead issues one when a page with a form loads; POST /api/lead
 * refuses a lead without a valid one (403 form_expired). It proves the post
 * follows a page load on this site, at least FORM_TOKEN_MIN_AGE_MS earlier
 * (no human fills a form in under 3 s) and at most FORM_TOKEN_MAX_AGE_MS
 * earlier (the form refreshes it while the page stays open).
 *
 *   v1.<issued-at ms>.<16 random bytes, base64url>.<HMAC-SHA-256, base64url>
 *
 * The HMAC covers the version, the site (zbm or zbc: AEGIS F2), the time and
 * the random part, under
 * a key derived from LEAD_FORM_SECRET (or, when that is unset,
 * LEAD_IP_HASH_SECRET) with a fixed label, so it is never the same key as
 * the IP hashing. The token holds no personal data: no address, no
 * identifier, nothing about the visitor. It is not stored anywhere.
 */

import { FORM_TOKEN_MAX_AGE_MS, FORM_TOKEN_MIN_AGE_MS } from "./form-token-wire";

export { FORM_TOKEN_HEADER, FORM_TOKEN_MAX_AGE_MS, FORM_TOKEN_MIN_AGE_MS } from "./form-token-wire";

/**
 * AEGIS F2: instances' clocks may differ by a few seconds. A token up to
 * this far "in the future", or this far past its maximum age, is treated as
 * skew, not as an invalid token.
 */
export const FORM_TOKEN_SKEW_MS = 5_000;

export type FormTokenProblem = "missing" | "malformed" | "bad_signature" | "future" | "expired";
export type FormTokenCheck =
  | { ok: true }
  /** Younger than the minimum age (or a few seconds ahead): the client waits `retryAfterMs` and sends again. */
  | { ok: false; problem: "too_new"; retryAfterMs: number }
  | { ok: false; problem: FormTokenProblem };

export type FormTokens = {
  issue(app: LeadApp, nowMs: number): string;
  verify(app: LeadApp, token: string | null | undefined, nowMs: number): FormTokenCheck;
};

/** The fake transport's secret: derived from the gate's per-run nonce, so the e2e gate can mint tokens. */
export const fakeFormTokenSecret = (nonce: string) => `zbest-fake-form-token:${nonce}`;

const b64url = (buf: Buffer) => buf.toString("base64url");

export function formTokens(secret: string): FormTokens {
  const key = createHmac("sha256", secret).update("zbest-lead-form-token-v1").digest();
  const sign = (app: LeadApp, issued: string, nonce: string) => createHmac("sha256", key).update(`v1|${app}|${issued}|${nonce}`).digest();

  return {
    issue(app, nowMs) {
      const issued = String(Math.floor(nowMs));
      const nonce = b64url(randomBytes(16));
      return `v1.${issued}.${nonce}.${b64url(sign(app, issued, nonce))}`;
    },
    verify(app, token, nowMs) {
      if (!token) return { ok: false, problem: "missing" };
      const match = /^v1\.(\d{13})\.([A-Za-z0-9_-]{22})\.([A-Za-z0-9_-]{43})$/.exec(token);
      if (!match) return { ok: false, problem: "malformed" };
      const [, issued, nonce, mac] = match as unknown as [string, string, string, string];
      const expected = sign(app, issued, nonce);
      const given = Buffer.from(mac, "base64url");
      if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, problem: "bad_signature" };
      const age = nowMs - Number(issued);
      if (age < -FORM_TOKEN_SKEW_MS) return { ok: false, problem: "future" };
      if (age < FORM_TOKEN_MIN_AGE_MS) return { ok: false, problem: "too_new", retryAfterMs: FORM_TOKEN_MIN_AGE_MS - age };
      if (age > FORM_TOKEN_MAX_AGE_MS + FORM_TOKEN_SKEW_MS) return { ok: false, problem: "expired" };
      return { ok: true };
    },
  };
}
