import { z } from "zod";
import { LEAD_FIELDS } from "@/lib/lead";
import { ACTIVE_RULE_SET } from "./rules";
import type { FreeAssessmentResult } from "./score";

/**
 * Free assessment wire contract — Backend Spec v0.3 §11.3 and §11.5.
 *
 * ONE SCHEMA, BOTH SIDES (§11.3). The form validates with ASSESSMENT_REQUEST
 * before it sends anything, and the stub validates the same object with the
 * same schema. There is no second, hand-written copy of these rules to drift.
 */

const questionIds = new Set<string>(ACTIVE_RULE_SET.questions.map((q) => q.id));

const ANSWER = z.object({
  question_id: z.string(),
  value: z.union([z.literal(0), z.literal(1), z.literal(2)]),
});

/**
 * §11.3 `AssessmentRequest`, plus the two §6.2 lead fields the stub already
 * uses: the `form` discriminator and the `company_url` honeypot.
 *
 * Every question answered exactly once; no unknown ids; no duplicates. Each
 * problem is reported against the question it concerns, so the form can put
 * the message beside the right statement.
 */
export const ASSESSMENT_REQUEST = z.object({
  form: z.literal("assessment"),
  submission_id: z.uuid(),
  rule_set_version: z.string().min(1),
  contact: LEAD_FIELDS.assessment,
  answers: z.array(ANSWER).superRefine((answers, ctx) => {
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

export type AssessmentRequest = z.infer<typeof ASSESSMENT_REQUEST>;

/**
 * Zod issues -> the §6.2 field-error map. Contact fields keep their own names
 * ("name", "website"); answers are keyed "answers.<question_id>".
 */
export function fieldErrors(issues: readonly z.core.$ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const [head, second] = issue.path;
    const key =
      head === "contact" ? String(second ?? "contact")
      : head === "answers" ? (typeof second === "string" ? `answers.${second}` : "answers")
      : String(head ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** What the stub returns for form "assessment". */
export type AssessmentResponse =
  | { ok: true; stub: true; submission_id: string; result: FreeAssessmentResult }
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "rule_set_superseded"; active_version: string } }
  | { ok: false; error: { code: "bad_request" } };

export type AssessmentSubmission =
  | { status: "scored"; result: FreeAssessmentResult }
  | { status: "invalid"; fields: Record<string, string> }
  | { status: "superseded" }
  | { status: "failed" };

/**
 * Typed adapter (Backend Spec §9). The form calls this and never `fetch`
 * directly. It validates with the shared schema first — an invalid request is
 * never sent — then posts to the no-delivery stub. When the backend implements
 * §11, only this function's URL and the stub change.
 */
export async function submitAssessment(request: AssessmentRequest): Promise<AssessmentSubmission> {
  const local = ASSESSMENT_REQUEST.safeParse(request);
  if (!local.success) return { status: "invalid", fields: fieldErrors(local.error.issues) };

  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local.data),
    });
  } catch {
    return { status: "failed" };
  }

  let body: AssessmentResponse;
  try {
    body = (await response.json()) as AssessmentResponse;
  } catch {
    return { status: "failed" };
  }

  if (body.ok) return { status: "scored", result: body.result };
  if (body.error.code === "validation") return { status: "invalid", fields: body.error.fields };
  if (body.error.code === "rule_set_superseded") return { status: "superseded" };
  return { status: "failed" };
}
