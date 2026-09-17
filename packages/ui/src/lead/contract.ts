/**
 * Lead route wire contract (Brief §6.2), shared by both apps' route handlers,
 * the typed adapter, and the form. Each app owns its own form names and zod
 * field schemas; only the envelope shape is shared.
 */
export type LeadResponse =
  | { ok: true; stub: true; submission_id: string }
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "bad_request" } };

export type LeadResult =
  | { status: "accepted"; stub: boolean }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: "failed" };

/**
 * Typed adapter in front of /api/lead (Backend Spec §9: every API call behind
 * a typed adapter). The form calls this and never `fetch` directly, so when
 * the stub becomes the real handler only this file and the route change.
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

  if (body.ok) return { status: "accepted", stub: body.stub };
  if (body.error.code === "validation") return { status: "invalid", fields: body.error.fields };
  return { status: "failed" };
}
