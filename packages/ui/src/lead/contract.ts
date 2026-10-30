import { REGION_COPY } from "@zbest/lead/region";

/**
 * Lead route wire contract (Brief §6.2), shared by both apps' route handlers,
 * the typed adapters and the forms. Each app owns its own form names and zod
 * field schemas; only the envelope and the error codes are shared.
 *
 * The route is real now (docs/LEAD-ROUTE-DESIGN.md): a success means the lead
 * was stored. Every failure says nothing was saved, and says why in terms the
 * visitor can act on.
 */
export type LeadErrorBody =
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "bad_request" } }
  | { ok: false; error: { code: "unsupported_media_type" } }
  | { ok: false; error: { code: "forbidden_origin" } }
  | { ok: false; error: { code: "payload_too_large" } }
  | { ok: false; error: { code: "rate_limited"; retry_after_s: number } }
  | { ok: false; error: { code: "not_configured" } }
  | { ok: false; error: { code: "conflict" } }
  /** Outside the service area (50 US states, DC, PR, GU): nothing stored or sent. */
  | { ok: false; error: { code: "region_unavailable" } }
  | { ok: false; error: { code: "unavailable" } };

export type LeadResponse = { ok: true; submission_id: string } | LeadErrorBody;

/** Why a submission was not saved, as the form tells the visitor. */
export type LeadFailure = "failed" | "rate_limited" | "not_configured" | "unavailable" | "conflict" | "region_unavailable";

export type LeadResult =
  | { status: "accepted" }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: LeadFailure };

/**
 * One honest sentence per failure. Each claims only what is known: "nothing
 * was saved" only where the server said so; an unknown outcome says it is
 * unknown (AEGIS L3). A retry is always safe — it reuses the submission id.
 */
export const FAILURE_COPY: Record<LeadFailure, string> = {
  failed: "We couldn’t confirm that went through — please try again.",
  conflict:
    "We already have an earlier version of this from you. Send again to submit these changes as a new message.",
  unavailable: "We couldn’t save that just now, so nothing was sent. Please try again in a few minutes.",
  not_configured: "This form isn’t accepting submissions yet, so nothing was saved or sent.",
  rate_limited: "Too many attempts from your connection. Nothing was saved — please wait a few minutes and try again.",
  region_unavailable: REGION_COPY.refused,
};

/**
 * Maps a non-validation error body (or garbage) to the failure the form shows.
 * 400/403/413/415 are not reachable from the real forms; they read as "failed".
 */
export function failureOf(body: unknown): LeadFailure {
  const code = (body as { error?: { code?: unknown } } | null)?.error?.code;
  return code === "rate_limited" ||
    code === "not_configured" ||
    code === "unavailable" ||
    code === "conflict" ||
    code === "region_unavailable"
    ? code
    : "failed";
}

/**
 * The honeypot's HTML input name (AEGIS L4). Deliberately non-semantic so no
 * browser or password manager has a reason to autofill it; it is sent to the
 * route under the wire key `company_url`, which the app contracts define.
 */
export const HONEYPOT_FIELD = "zbx_hp_7f3";

/**
 * Typed adapter in front of /api/lead (Backend Spec §9: every API call behind
 * a typed adapter). The form calls this and never `fetch` directly.
 */
export async function submitLead(input: {
  form: string;
  submissionId: string;
  fields: Record<string, string>;
  honeypot: string;
}): Promise<LeadResult> {
  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: input.form,
        submission_id: input.submissionId,
        fields: input.fields,
        ...(input.honeypot ? { company_url: input.honeypot } : {}),
      }),
    });
  } catch {
    return { status: "failed" };
  }

  let body: LeadResponse;
  try {
    body = (await response.json()) as LeadResponse;
  } catch {
    return { status: "failed" };
  }

  if (body.ok === true && response.ok) return { status: "accepted" };
  if (body.ok === false && body.error.code === "validation") return { status: "invalid", fields: body.error.fields };
  return { status: failureOf(body) };
}
