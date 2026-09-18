import { SCALE, type AnswerValue, type LeakCategory, type RuleSet } from "./rules";

/**
 * §11.4 — the rule. Pure and synchronous: no clock, no randomness, no I/O, no
 * model. The same answers under the same rule set always return the same
 * outcome, which is what lets §11.2's rules_hash make "deterministic" checkable.
 *
 *   1. Score each category as the value given for its question.
 *   2. If every score is 0, return insufficient_signal — never invent a category.
 *   3. Otherwise the highest score wins; ties go to the earlier category in
 *      priority_order.
 */

export type Answer = { question_id: string; value: AnswerValue };

export type Because = {
  question_id: string;
  statement: string;
  value: 1 | 2;
  value_label: "Somewhat true" | "Very true";
};

/** §11.5 `FreeAssessmentResult`, less the fields only the server can stamp. */
export type Outcome =
  | {
      status: "leak_identified";
      category: LeakCategory;
      rationale: string;
      remediation: string;
      because: Because;
      tie_broken_by_priority: boolean;
    }
  | {
      status: "insufficient_signal";
      category: null;
      rationale: null;
      remediation: null;
      because: null;
      tie_broken_by_priority: false;
    };

/** §11.5, complete: what the stub returns and the result view renders. */
export type FreeAssessmentResult = Outcome & {
  tier: "free";
  submission_id: string;
  rule_set_version: string;
  rule_set_hash: string;
  produced_at: string;
};

export function assess(answers: readonly Answer[], rules: RuleSet): Outcome {
  const given = new Map(answers.map((a) => [a.question_id, a.value]));

  // Walk categories in priority order, so the first category reaching the top
  // score is also the tie-break winner.
  const scored = rules.priority_order.map((category) => {
    const question = rules.questions.find((q) => q.category === category);
    if (!question) throw new Error(`Rule set has no question for ${category}.`);
    return { category, question, score: given.get(question.id) ?? 0 };
  });

  const top = Math.max(...scored.map((s) => s.score));
  if (top === 0) {
    return {
      status: "insufficient_signal",
      category: null,
      rationale: null,
      remediation: null,
      because: null,
      tie_broken_by_priority: false,
    };
  }

  const leaders = scored.filter((s) => s.score === top);
  const winner = leaders[0]!;
  const value = winner.score as 1 | 2;
  const label = SCALE.find((step) => step.value === value)!.label as Because["value_label"];

  return {
    status: "leak_identified",
    category: winner.category,
    // Copied verbatim from the rule set, which derives them from the Leak Library.
    rationale: rules.copy[winner.category].rationale,
    remediation: rules.copy[winner.category].remediation,
    because: {
      question_id: winner.question.id,
      statement: winner.question.statement,
      value,
      value_label: label,
    },
    tie_broken_by_priority: leaders.length > 1,
  };
}
