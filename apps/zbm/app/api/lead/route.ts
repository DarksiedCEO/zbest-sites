import { ASSESSMENT_REQUEST, fieldErrors, type AssessmentResponse } from "@/lib/assessment/contract";
import { RULE_SET_HASH } from "@/lib/assessment/hash";
import { ACTIVE_RULE_SET } from "@/lib/assessment/rules";
import { assess } from "@/lib/assessment/score";
import { LEAD_ENVELOPE, LEAD_FIELDS, type LeadResponse } from "@/lib/lead";
import {
  READINESS_REQUEST,
  readinessFieldErrors,
  type ReadinessResponse,
} from "@/lib/visibility/contract";
import { VISIBILITY_RULES_HASH } from "@/lib/visibility/hash";
import { ACTIVE_RULE_SET as VISIBILITY_RULE_SET } from "@/lib/visibility/rules";
import { checkReadiness } from "@/lib/visibility/score";

/**
 * Lead route handler — STUB (Brief §6.2; founder direction for Phase 4:
 * "posts to a marked stub, no delivery").
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
 *
 * PHASE 5 — the free assessment (Backend Spec v0.3 §11, founder decision 10).
 * form "assessment" now carries the §11.3 AssessmentRequest shape and is
 * scored here against the FIXTURE rule set, returning a §11.5
 * FreeAssessmentResult. Still a stub in every other respect: nothing is stored,
 * sent or logged, and the same markers apply. Scoring is deterministic and uses
 * no model, so running it in the stub fakes nothing about the result — only
 * delivery and persistence are missing. form "contact" is unchanged.
 *
 * PHASE 5, STEP 2 — the AI Visibility Readiness Check (Backend Spec v0.4 §12,
 * founder decision 11). form "readiness" carries the §12.7 ReadinessRequest
 * shape and is scored against the SEPARATE §12 fixture rule set, returning a
 * §12.7 VisibilityReadinessResult. It shares this route and its stub markers
 * with the other two forms and nothing else: a different rule set, a different
 * taxonomy, a different result type, and a `check` discriminator so a result is
 * never mistaken for §11's. Still no engine is queried and no model runs.
 */
const STUB_HEADERS = { "X-Zbest-Lead-Stub": "no-delivery" };

const reply = (body: LeadResponse | AssessmentResponse | ReadinessResponse, status: number) =>
  Response.json(body, { status, headers: STUB_HEADERS });

/** §11.3 request -> §11.5 result, or the typed error that explains why not. */
function handleAssessment(json: unknown) {
  const request = ASSESSMENT_REQUEST.safeParse(json);
  if (!request.success) {
    const issues = request.error.issues;
    // A request missing its envelope is malformed, not a form to correct.
    const structural = issues.some((i) => i.path[0] === "form" || i.path[0] === "submission_id");
    if (structural) return reply({ ok: false, error: { code: "bad_request" } }, 400);
    return reply({ ok: false, error: { code: "validation", fields: fieldErrors(issues) } }, 422);
  }
  const { submission_id, rule_set_version, answers, company_url } = request.data;

  // §11.3: never score against rules the respondent was not shown.
  if (rule_set_version !== ACTIVE_RULE_SET.version) {
    return reply(
      { ok: false, error: { code: "rule_set_superseded", active_version: ACTIVE_RULE_SET.version } },
      409,
    );
  }

  const outcome = assess(answers, ACTIVE_RULE_SET);
  const result = {
    ...outcome,
    tier: "free" as const,
    submission_id,
    rule_set_version: ACTIVE_RULE_SET.version,
    rule_set_hash: RULE_SET_HASH,
    produced_at: new Date().toISOString(),
  };
  // Honeypot: indistinguishable from a real success, and nothing happens either way.
  void company_url;
  return reply({ ok: true, stub: true, submission_id, result }, 200);
}

/** §12.7 request -> §12.7 result, or the typed error that explains why not. */
function handleReadiness(json: unknown) {
  const request = READINESS_REQUEST.safeParse(json);
  if (!request.success) {
    const issues = request.error.issues;
    // A request missing its envelope is malformed, not a form to correct.
    const structural = issues.some((i) => i.path[0] === "form" || i.path[0] === "submission_id");
    if (structural) return reply({ ok: false, error: { code: "bad_request" } }, 400);
    return reply({ ok: false, error: { code: "validation", fields: readinessFieldErrors(issues) } }, 422);
  }
  const { submission_id, rule_set_version, answers, company_url } = request.data;

  // §12.2, inherited from §11.3: never score against rules the respondent was
  // not shown.
  if (rule_set_version !== VISIBILITY_RULE_SET.version) {
    return reply(
      { ok: false, error: { code: "rule_set_superseded", active_version: VISIBILITY_RULE_SET.version } },
      409,
    );
  }

  const outcome = checkReadiness(answers, VISIBILITY_RULE_SET);
  const result = {
    ...outcome,
    tier: "free" as const,
    check: "ai_visibility_readiness" as const,
    submission_id,
    rule_set_version: VISIBILITY_RULE_SET.version,
    rule_set_hash: VISIBILITY_RULES_HASH,
    produced_at: new Date().toISOString(),
  };
  // Honeypot: indistinguishable from a real success, and nothing happens either way.
  void company_url;
  return reply({ ok: true, stub: true, submission_id, result }, 200);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return reply({ ok: false, error: { code: "bad_request" } }, 400);
  }

  if (json && typeof json === "object" && (json as { form?: unknown }).form === "assessment") {
    return handleAssessment(json);
  }

  if (json && typeof json === "object" && (json as { form?: unknown }).form === "readiness") {
    return handleReadiness(json);
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
