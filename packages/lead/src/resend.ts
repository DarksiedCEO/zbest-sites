import { DeliveryError, type LeadEmail, type LeadNotifier, type LookupResult } from "./types";

/**
 * Brief §6.2 notification: one email per new lead (or a digest) to the founder's inbox via
 * Resend's REST API (no SDK dependency). `Idempotency-Key` makes a retried
 * send for the same submission one email at Resend's end too.
 *
 * Only the HTTP status is ever surfaced in an error: Resend's response body
 * can echo the recipient address.
 */
export function resendNotifier(opts: {
  apiKey: string;
  from: string;
  to: string[];
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  /** Minimum gap between delivery lookups (default 550 ms). */
  lookupGapMs?: number;
}): LeadNotifier {
  const doFetch = opts.fetchImpl ?? fetch;
  // AEGIS r4 M2: delivery lookups are spaced to stay inside Resend's API rate limit.
  let lastLookup = 0;
  const lookupGapMs = opts.lookupGapMs ?? 550;
  return {
    async send(email: LeadEmail, idempotencyKey: string) {
      let response: Response;
      try {
        response = await doFetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${opts.apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify({
            from: opts.from,
            to: opts.to,
            subject: email.subject,
            text: email.text,
            ...(email.replyTo ? { reply_to: email.replyTo } : {}),
          }),
          signal: AbortSignal.timeout(opts.timeoutMs ?? 8000),
        });
      } catch {
        throw new DeliveryError("notify_unreachable");
      }
      if (!response.ok) throw new DeliveryError("notify_rejected", response.status);
      // AEGIS r4 M2: Resend's id for this email (also in a replayed response).
      try {
        const body = (await response.json()) as { id?: unknown };
        return typeof body?.id === "string" && /^[A-Za-z0-9-]{1,100}$/.test(body.id) ? { id: body.id } : {};
      } catch {
        return {};
      }
    },
    /**
     * AEGIS r4 M2: GET /emails/{id} → `last_event` (Resend's documented
     * values: sent, delivered, delivery_delayed, bounced, complained,
     * suppressed, failed, opened, clicked, queued, scheduled, canceled).
     * AEGIS r5 N2/N3: a failure says why — 401/403 "unauthorized" (the key
     * may only send: delivery checks need a Full access key), 404
     * "not_found", anything else "unavailable" with its status (0: no
     * answer). Only the event string is kept; the rest of the body (which
     * holds the message) is discarded.
     */
    async lastEvent(emailId: string): Promise<LookupResult> {
      if (!/^[A-Za-z0-9-]{1,100}$/.test(emailId)) return { error: "not_found", status: 0 };
      const wait = lastLookup + lookupGapMs - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      lastLookup = Date.now();
      try {
        const response = await doFetch(`https://api.resend.com/emails/${emailId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${opts.apiKey}` },
          signal: AbortSignal.timeout(opts.timeoutMs ?? 8000),
        });
        if (response.status === 401 || response.status === 403) return { error: "unauthorized", status: response.status };
        if (response.status === 404) return { error: "not_found", status: 404 };
        if (!response.ok) return { error: "unavailable", status: response.status };
        const body = (await response.json()) as { last_event?: unknown };
        return { event: typeof body?.last_event === "string" ? body.last_event.slice(0, 40) : "" };
      } catch {
        return { error: "unavailable", status: 0 };
      }
    },
  };
}
