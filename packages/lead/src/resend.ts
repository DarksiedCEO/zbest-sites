import { DeliveryError, type LeadEmail, type LeadNotifier } from "./types";

/**
 * Brief §6.2 notification: one email per new lead to the founder's inbox via
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
}): LeadNotifier {
  const doFetch = opts.fetchImpl ?? fetch;
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
    },
  };
}
