import { handleLead, type ParsedLead } from "@zbest/lead";
import { LEAD_ENVELOPE, LEAD_FIELDS } from "@/lib/lead";

/**
 * Lead route handler (Brief §6.2; docs/LEAD-ROUTE-DESIGN.md), Z Best Clips.
 *
 * This file only VALIDATES, with this app's §6.1 schemas (campaign, clipper).
 * Where a lead goes — rate limit, store, founder email, idempotency,
 * fail-closed config — is the shared @zbest/lead pipeline, the same one Z Best
 * Media uses. Rows carry app = 'zbc', so ZBC leads stay separable (ZBC is its
 * own entity).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parse(json: unknown): ParsedLead {
  const envelope = LEAD_ENVELOPE.safeParse(json);
  if (!envelope.success) return { kind: "bad_request" };
  const { form, submission_id, fields, company_url } = envelope.data;
  const body = { ok: true, submission_id };

  // Honeypot: answer exactly like a success so a bot learns nothing.
  if (company_url) return { kind: "honeypot", form, body };

  const parsed = LEAD_FIELDS[form].safeParse(fields);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { kind: "reject", status: 422, body: { ok: false, error: { code: "validation", fields: errors } } };
  }

  return { kind: "lead", form, submission_id, payload: parsed.data as Record<string, unknown>, body };
}

export function POST(request: Request) {
  return handleLead(request, { app: "zbc", parse });
}
