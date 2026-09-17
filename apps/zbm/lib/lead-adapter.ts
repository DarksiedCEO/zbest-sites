import type { LeadForm, LeadResponse } from "./lead";

/**
 * Typed adapter in front of the lead route (Backend Spec §9: every API call
 * behind a typed adapter). Components call this and never `fetch` directly, so
 * when the stub becomes the real handler only this file and the route change.
 */
export type LeadResult =
  | { status: "accepted"; stub: boolean }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: "failed" };

export async function submitLead(input: {
  form: LeadForm;
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
