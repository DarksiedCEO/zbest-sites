import { failureOf, type LeadErrorBody, type LeadFailure } from "@zbest/ui/lead/contract";
import { REGION, REGION_FIELD_NAME } from "@zbest/lead/region";
import { z } from "zod";
import { LEAD_FIELDS } from "@/lib/lead";
import { ACTIVE_RULE_SET } from "./rules";
import type { VisibilityReadinessResult } from "./score";

// No eval feature-check under the CSP (packages/ui/src/security-headers.ts).
z.config({ jitless: true });

/**
 * AI Visibility Readiness Check wire contract — Backend Spec v0.4 §12.7.
 *
 * ONE SCHEMA, BOTH SIDES (§12.2, inherited from §11.3). The form validates with
 * READINESS_REQUEST before it sends anything, and the route validates the same
 * object with the same schema. There is no second, hand-written copy of these
 * rules to drift.
 */

const questionIds = new Set<string>(ACTIVE_RULE_SET.questions.map((q) => q.id));

const ANSWER = z.object({
  question_id: z.string(),
  value: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

/**
 * §12.7 `ReadinessRequest`, plus the two §6.2 lead fields the lead route already
 * uses: the `form` discriminator and the `company_url` honeypot.
 *
 * The contact block is §11.3's four fields — §12.7: "The contact fields are the
 * same four as §11.3; no new ones" — so it reuses that certified schema rather
 * than restating it. That is a shared FIELD schema, not a rule set; §12.2's
 * separation is about the rule sets, and neither taxonomy is touched here.
 *
 * Every question answered exactly once; no unknown ids; no duplicates. Each
 * problem is reported against the question it concerns, so the form can put the
 * message beside the right statement.
 */
export const READINESS_REQUEST = z.object({
  form: z.literal("readiness"),
  submission_id: z.uuid(),
  rule_set_version: z.string().min(1),
  contact: LEAD_FIELDS.assessment,
  /**
   * Service area (founder decisions 2026-10-30): the business's US state or
   * territory, `{ state }`. A sibling of `contact`, which keeps the spec's
   * four contact fields unchanged. Added to the certified request by the
   * spec amendment of 2026-10-30 (docs/backend-interface-spec-v0.4.md §12.7,
   * docs/SPEC-AMENDMENT-2026-10-30-service-area.md); pending backend acceptance.
   */
  region: REGION,
  answers: z.array(ANSWER).max(32, { error: "Too many answers.", abort: true }).superRefine((answers, ctx) => {
    const seen = new Set<string>();
    for (const answer of answers) {
      if (!questionIds.has(answer.question_id)) {
        ctx.addIssue({ code: "custom", path: [answer.question_id], message: "Unknown question." });
      } else if (seen.has(answer.question_id)) {
        ctx.addIssue({ code: "custom", path: [answer.question_id], message: "Answer each question once." });
      }
      seen.add(answer.question_id);
    }
    for (const id of questionIds) {
      if (!seen.has(id)) ctx.addIssue({ code: "custom", path: [id], message: "Choose an answer." });
    }
  }),
  company_url: z.string().optional(),
});

export type ReadinessRequest = z.infer<typeof READINESS_REQUEST>;

/**
 * Zod issues -> the §6.2 field-error map. Contact fields keep their own names
 * ("name", "website"); answers are keyed "answers.<question_id>".
 */
export function readinessFieldErrors(issues: readonly z.core.$ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const [head, second] = issue.path;
    const key =
      head === "contact" ? String(second ?? head)
      // A region error is shown under the "State or territory" select, whose field is `state`.
      : head === "region" ? String(second ?? REGION_FIELD_NAME)
      : head === "answers" ? (typeof second === "string" ? `answers.${second}` : "answers")
      : String(head ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** What the lead route returns for this form: the stored lead's result, or why not. */
export type ReadinessResponse =
  | { ok: true; submission_id: string; result: VisibilityReadinessResult }
  | { ok: false; error: { code: "rule_set_superseded"; active_version: string } }
  | LeadErrorBody;

export type ReadinessSubmission =
  | { status: "checked"; result: VisibilityReadinessResult }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: "superseded" }
  | { status: "failed"; reason: LeadFailure };

/**
 * Typed adapter (Backend Spec §9, §12.9). The form calls this and never `fetch`
 * directly. It validates with the shared schema first — an invalid request is
 * never sent — then posts to the lead route, which stores the lead before it
 * answers. When the backend implements §12, only this function's URL changes.
 */
export async function submitReadiness(request: z.input<typeof READINESS_REQUEST>): Promise<ReadinessSubmission> {
  const local = READINESS_REQUEST.safeParse(request);
  if (!local.success) return { status: "invalid", fields: readinessFieldErrors(local.error.issues) };

  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local.data),
    });
  } catch {
    return { status: "failed", reason: "failed" };
  }

  let body: ReadinessResponse;
  try {
    body = (await response.json()) as ReadinessResponse;
  } catch {
    return { status: "failed", reason: "failed" };
  }

  if (body.ok === true && response.ok) return { status: "checked", result: body.result };
  if (body.ok !== false) return { status: "failed", reason: "failed" };
  if (body.error.code === "validation") return { status: "invalid", fields: body.error.fields };
  if (body.error.code === "rule_set_superseded") return { status: "superseded" };
  return { status: "failed", reason: failureOf(body) };
}
