import { LEAD_ENVELOPE, LEAD_FIELDS, type LeadResponse } from "@/lib/lead";

/**
 * Lead route handler — STUB (Brief §6.2; founder direction for Phase 4,
 * carried over to Z Best Clips: "posts to a marked stub, no delivery").
 *
 * Deliberately the same logic as apps/zbm's handler, with this app's forms.
 * When Phase 5 makes both real, extract the shared body then.
 *
 * What it does now: validates the envelope and the form's fields with zod,
 * returns the §6.2 field-level error envelope on failure, silently accepts a
 * filled honeypot, and acknowledges a valid submission.
 *
 * What it deliberately does NOT do yet — all Phase 5 (§3.5):
 *   - no Vercel Postgres row (the leads table, submission_id upsert)
 *   - no Resend email
 *   - no per-IP rate limit
 * Nothing is stored, sent or logged. Every response says so: `stub: true` in
 * the body and the X-Zbest-Lead-Stub header, and the form shows it to the
 * visitor. When the real handler lands, both markers are removed with it.
 */
const STUB_HEADERS = { "X-Zbest-Lead-Stub": "no-delivery" };

const reply = (body: LeadResponse, status: number) =>
  Response.json(body, { status, headers: STUB_HEADERS });

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return reply({ ok: false, error: { code: "bad_request" } }, 400);
  }

  const envelope = LEAD_ENVELOPE.safeParse(json);
  if (!envelope.success) {
    return reply({ ok: false, error: { code: "bad_request" } }, 400);
  }
  const { form, submission_id, fields, company_url } = envelope.data;

  // Honeypot: answer exactly like a success so a bot learns nothing.
  if (company_url) {
    return reply({ ok: true, stub: true, submission_id }, 200);
  }

  const parsed = LEAD_FIELDS[form].safeParse(fields);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return reply({ ok: false, error: { code: "validation", fields: errors } }, 422);
  }

  return reply({ ok: true, stub: true, submission_id }, 200);
}
