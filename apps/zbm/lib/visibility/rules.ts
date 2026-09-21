import { VISIBILITY_GAP_LIBRARY } from "@/content/visibility-gaps";

/**
 * The AI Visibility Readiness Check's active rule set — Backend Spec v0.4 §12.3.
 *
 * FIXTURE until the backend implements §12. It lives in the frontend only so
 * the check can run end to end on the no-delivery stub; the real rule set will
 * be served by the backend, versioned and hashed the same way (§12.9).
 *
 * Founder decision 11 (docs/TOOLING.md): a deterministic, rule-based readiness
 * check returning one prioritized visibility gap — no engine queries, no AI
 * drafting, no dollar figure, and no claim about what any engine says (§12.1).
 *
 * SEPARATE FROM §11 BY CONSTRUCTION. §12.2: "neither rule set reads the other."
 * This module imports nothing from lib/assessment — not the scale, not the
 * scoring, not the types — so the two taxonomies cannot be crossed by an
 * import. The vocabulary is "gap", never "leak" (§12.1).
 */

/** §12.3 `VisibilityGapCategory` — founder-approved 2026-09-18. */
export const VISIBILITY_GAP_CATEGORIES = [
  "business_profile",
  "entity_consistency",
  "reviews",
  "crawlability",
  "structured_data",
  "answer_content",
  "brand_citations",
  "local_listings",
] as const;
export type VisibilityGapCategory = (typeof VISIBILITY_GAP_CATEGORIES)[number];

/**
 * §12.2 and gate condition C2: the copy is DERIVED, not authored.
 *
 * Every category's display name, rationale and remediation is read out of the
 * published Visibility Gap Library — certified site copy (§12.4) — and nothing
 * here writes a different string. To change what a result says, change the
 * library through a spec revision, never a rule set. The gate asserts the
 * result strings equal the library character for character, for all eight.
 */
function deriveCopy() {
  const copy = {} as Record<VisibilityGapCategory, { name: string; rationale: string; remediation: string }>;
  for (const gap of VISIBILITY_GAP_LIBRARY.gaps) {
    const key = gap.key as VisibilityGapCategory;
    if (!VISIBILITY_GAP_CATEGORIES.includes(key)) {
      throw new Error(`Visibility Gap Library entry "${gap.name}" does not map onto the eight categories.`);
    }
    copy[key] = { name: gap.name, rationale: gap.description, remediation: gap.fix };
  }
  const missing = VISIBILITY_GAP_CATEGORIES.filter((category) => !copy[category]);
  if (missing.length > 0 || VISIBILITY_GAP_LIBRARY.gaps.length !== VISIBILITY_GAP_CATEGORIES.length) {
    throw new Error(`Visibility Gap Library must define exactly the eight categories; missing: ${missing.join(", ")}`);
  }
  return copy;
}

/**
 * §12.2 — `likert_3`, the same three labels as §11, scored 0, 1, 2.
 *
 * Declared here rather than imported from lib/assessment: §12.2 inherits the
 * SHAPE of the scale, but the rule sets must not read each other. The gate
 * asserts the labels match the spec text, not §11's module.
 */
export const SCALE = [
  { value: 0, label: "Not true" },
  { value: 1, label: "Somewhat true" },
  { value: 2, label: "Very true" },
] as const;
export type AnswerValue = (typeof SCALE)[number]["value"];

/**
 * §12.5 — the eight questions, verbatim, founder-approved 2026-09-18.
 *
 * One per category, and §12.3 requires each question's `id` to equal its
 * category. Crawlability and Structured Data are framed as whether the owner
 * has checked or added something, which they know, rather than as the technical
 * state of their site, which they would be guessing at (§12.5).
 */
export const QUESTIONS = [
  {
    id: "business_profile",
    category: "business_profile",
    statement: "Our business profile on maps and in search is incomplete, or hasn’t been updated in months.",
  },
  {
    id: "entity_consistency",
    category: "entity_consistency",
    statement: "Our business name, address or phone number isn’t written the same way everywhere.",
  },
  {
    id: "reviews",
    category: "reviews",
    statement: "We have few recent reviews, or we don’t respond to the ones we get.",
  },
  {
    id: "crawlability",
    category: "crawlability",
    statement: "We haven’t checked whether search engines and AI crawlers can reach our key pages.",
  },
  {
    id: "structured_data",
    category: "structured_data",
    statement: "We haven’t added structured data (schema markup) to our website.",
  },
  {
    id: "answer_content",
    category: "answer_content",
    statement: "Our website doesn’t directly answer the questions customers ask us most.",
  },
  {
    id: "brand_citations",
    category: "brand_citations",
    statement: "Few other websites mention or link to our business.",
  },
  {
    id: "local_listings",
    category: "local_listings",
    statement: "We’re missing from directories and map apps beyond our business profile on maps and in search.",
  },
] as const satisfies readonly { id: string; category: VisibilityGapCategory; statement: string }[];

/**
 * §12.6 — the tie-break order, founder-approved 2026-09-18 as proposed.
 *
 * Its principle is its own, not §11's: highest leverage and cheapest to fix
 * first. A business profile is free and fast to complete and underpins most of
 * the rest; earning citations and listings takes the longest.
 */
export const PRIORITY_ORDER = [
  "business_profile",
  "entity_consistency",
  "reviews",
  "crawlability",
  "structured_data",
  "answer_content",
  "brand_citations",
  "local_listings",
] as const satisfies readonly VisibilityGapCategory[];

/** §12.3 `VisibilityGapRuleSet`, as the fixture the stub scores against. */
export const ACTIVE_RULE_SET = {
  version: "fixture-2026-09-20.1",
  status: "active",
  taxonomy: VISIBILITY_GAP_CATEGORIES,
  questions: QUESTIONS,
  scale: SCALE,
  priority_order: PRIORITY_ORDER,
  copy: deriveCopy(),
} as const;

export type VisibilityRuleSet = typeof ACTIVE_RULE_SET;
