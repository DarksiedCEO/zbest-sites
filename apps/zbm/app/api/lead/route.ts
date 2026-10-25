import { handleLead, type ParsedLead } from "@zbest/lead";
import { ASSESSMENT_REQUEST, fieldErrors } from "@/lib/assessment/contract";
import { RULE_SET_HASH } from "@/lib/assessment/hash";
import { ACTIVE_RULE_SET } from "@/lib/assessment/rules";
import { assess } from "@/lib/assessment/score";
import { LEAD_ENVELOPE, LEAD_FIELDS } from "@/lib/lead";
import { READINESS_REQUEST, readinessFieldErrors } from "@/lib/visibility/contract";
import { VISIBILITY_RULES_HASH } from "@/lib/visibility/hash";
import { ACTIVE_RULE_SET as VISIBILITY_RULE_SET } from "@/lib/visibility/rules";
import { checkReadiness } from "@/lib/visibility/score";

/**
 * Lead route handler (Brief §6.2; docs/LEAD-ROUTE-DESIGN.md).
 *
 * This file only VALIDATES: it turns a request body into a ParsedLead with
 * this app's zod schemas. Where a lead goes — rate limit, store, founder
 * email, idempotency, fail-closed config — is the shared @zbest/lead pipeline,
 * the same one Z Best Clips uses.
 *
 * Forms:
 *   - contact / start: §6.1 fields on the §6.2 envelope.
 *     /start carries services[] and the campaign `source` tag, which the
 *     pipeline stores as their own columns.
 *   - assessment: Spec §11.3 AssessmentRequest, scored on the FIXTURE rule set
 *     (§11.5 FreeAssessmentResult). §11.3: submitting "records the lead exactly
 *     as the current lead route does" — so the result is returned only once
 *     the lead is stored.
 *   - readiness: Spec §12.7 ReadinessRequest, the separate §12 fixture rule set
 *     and a VisibilityReadinessResult with its `check` discriminator.
 * Scoring is deterministic and uses no model. Nothing queries an AI engine.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const badRequest: ParsedLead = { kind: "bad_request" };

/** A request missing its envelope is malformed, not a form to correct. */
const structural = (issues: readonly { path: readonly PropertyKey[] }[]) =>
  issues.some((i) => i.path[0] === "form" || i.path[0] === "submission_id");

/** §11.3 request -> §11.5 result, or the typed error that explains why not. */
function parseAssessment(json: unknown): ParsedLead {
  const request = ASSESSMENT_REQUEST.safeParse(json);
  if (!request.success) {
    if (structural(request.error.issues)) return badRequest;
    return { kind: "reject", status: 422, body: { ok: false, error: { code: "validation", fields: fieldErrors(request.error.issues) } } };
  }
  const { submission_id, rule_set_version, answers, contact, company_url } = request.data;

  // §11.3: never score against rules the respondent was not shown.
  if (rule_set_version !== ACTIVE_RULE_SET.version) {
    return {
      kind: "reject",
      status: 409,
      body: { ok: false, error: { code: "rule_set_superseded", active_version: ACTIVE_RULE_SET.version } },
    };
  }

  const result = {
    ...assess(answers, ACTIVE_RULE_SET),
    tier: "free" as const,
    submission_id,
    rule_set_version: ACTIVE_RULE_SET.version,
    rule_set_hash: RULE_SET_HASH,
    produced_at: new Date().toISOString(),
  };
  const body = { ok: true, submission_id, result };
  // Honeypot: indistinguishable from a real success; nothing is stored or sent.
  if (company_url) return { kind: "honeypot", form: "assessment", body };
  return {
    kind: "lead",
    form: "assessment",
    submission_id,
    payload: {
      contact,
      answers,
      result: { status: result.status, category: result.category, rule_set_version: result.rule_set_version, rule_set_hash: result.rule_set_hash },
    },
    body,
  };
}

/** §12.7 request -> §12.7 result, or the typed error that explains why not. */
function parseReadiness(json: unknown): ParsedLead {
  const request = READINESS_REQUEST.safeParse(json);
  if (!request.success) {
    if (structural(request.error.issues)) return badRequest;
    return { kind: "reject", status: 422, body: { ok: false, error: { code: "validation", fields: readinessFieldErrors(request.error.issues) } } };
  }
  const { submission_id, rule_set_version, answers, contact, company_url } = request.data;

  // §12.2, inherited from §11.3: never score against rules the respondent was not shown.
  if (rule_set_version !== VISIBILITY_RULE_SET.version) {
    return {
      kind: "reject",
      status: 409,
      body: { ok: false, error: { code: "rule_set_superseded", active_version: VISIBILITY_RULE_SET.version } },
    };
  }

  const result = {
    ...checkReadiness(answers, VISIBILITY_RULE_SET),
    tier: "free" as const,
    check: "ai_visibility_readiness" as const,
    submission_id,
    rule_set_version: VISIBILITY_RULE_SET.version,
    rule_set_hash: VISIBILITY_RULES_HASH,
    produced_at: new Date().toISOString(),
  };
  const body = { ok: true, submission_id, result };
  if (company_url) return { kind: "honeypot", form: "readiness", body };
  return {
    kind: "lead",
    form: "readiness",
    submission_id,
    payload: {
      contact,
      answers,
      result: {
        check: result.check,
        status: result.status,
        category: result.category,
        rule_set_version: result.rule_set_version,
        rule_set_hash: result.rule_set_hash,
      },
    },
    body,
  };
}

/** §6.1 forms on the §6.2 envelope. */
function parseEnvelope(json: unknown): ParsedLead {
  const envelope = LEAD_ENVELOPE.safeParse(json);
  if (!envelope.success) return badRequest;
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

  const data = parsed.data as Record<string, unknown>;
  return {
    kind: "lead",
    form,
    submission_id,
    payload: data,
    services: Array.isArray(data.services) ? (data.services as string[]) : [],
    source: typeof data.source === "string" && data.source ? data.source : null,
    body,
  };
}

function parse(json: unknown): ParsedLead {
  const form = json && typeof json === "object" ? (json as { form?: unknown }).form : undefined;
  if (form === "assessment") return parseAssessment(json);
  if (form === "readiness") return parseReadiness(json);
  return parseEnvelope(json);
}

export function POST(request: Request) {
  return handleLead(request, { app: "zbm", parse });
}
