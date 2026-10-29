import { SCALE, type AnswerValue, type VisibilityGapCategory, type VisibilityRuleSet } from "./rules";

/**
 * §12.6 — the rule. It is §11.4 exactly, applied to §12's taxonomy, and it is
 * implemented here rather than imported so the two rule sets stay independent
 * (§12.2: "neither rule set reads the other").
 *
 * Pure and synchronous: no clock, no randomness, no I/O, no model. The same
 * answers under the same rule set always return the same outcome, which is what
 * lets §12.3's rules_hash make "deterministic" checkable.
 *
 *   1. Score each category as the value given for its question.
 *   2. If every score is 0, return insufficient_signal — never invent a gap.
 *   3. Otherwise the highest score wins; ties go to the earlier category in
 *      priority_order.
 */

export type ReadinessAnswer = { question_id: string; value: AnswerValue };

export type ReadinessBecause = {
  question_id: string;
  statement: string;
  value: 1 | 2;
  value_label: "Somewhat true" | "Very true";
};

/** §12.7 `VisibilityReadinessResult`, less the fields only the server can stamp. */
export type ReadinessOutcome =
  | {
      status: "gap_identified";
      category: VisibilityGapCategory;
      rationale: string;
      remediation: string;
      because: ReadinessBecause;
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

/**
 * §12.7, complete: what the lead route returns and the result view renders.
 *
 * `check` is the discriminator §12.7 requires, "so a result is never mistaken
 * for §11's". By construction this type carries no currency, amount or estimate
 * field, and no field that states what any engine says (§12.1, §12.7).
 */
export type VisibilityReadinessResult = ReadinessOutcome & {
  tier: "free";
  check: "ai_visibility_readiness";
  submission_id: string;
  rule_set_version: string;
  rule_set_hash: string;
  produced_at: string;
};

export function checkReadiness(
  answers: readonly ReadinessAnswer[],
  rules: VisibilityRuleSet,
): ReadinessOutcome {
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
  const label = SCALE.find((step) => step.value === value)!.label as ReadinessBecause["value_label"];

  return {
    status: "gap_identified",
    category: winner.category,
    // Copied verbatim from the rule set, which derives them from the library.
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
