import { LEAK_LIBRARY } from "@/content/revenue-recovery";

/**
 * The free assessment's active rule set — Backend Spec v0.3 §11.2.
 *
 * FIXTURE until the backend implements §11. It lives in the frontend only so
 * Phase 5 can run end to end on the no-delivery stub; the real rule set will be
 * served by the backend, versioned and hashed the same way.
 *
 * Founder decision 10 (docs/TOOLING.md): the free tier returns one prioritized
 * leak, rule-based, with no dollar figure and no AI drafting.
 */

/** §11.2 — the eight categories, in the Leak Library's own spelling and order. */
export const LEAK_CATEGORIES = [
  "traffic",
  "conversion",
  "trust",
  "offer",
  "follow_up",
  "tracking",
  "creative",
  "visibility",
] as const;
export type LeakCategory = (typeof LEAK_CATEGORIES)[number];

/** "Follow-Up Leak" -> "follow_up". The key is derived from the published title. */
const keyOf = (title: string) =>
  title.replace(/ Leak$/, "").toLowerCase().replace(/-/g, "_") as LeakCategory;

/**
 * §11.2 and gate condition C2: the copy is DERIVED, not authored.
 *
 * Every category's display name, rationale and remediation is read out of the
 * published Revenue Leak Library — certified site copy — and nothing here writes
 * a different string. To change what a result says, edit the Leak Library.
 * The Phase 5 gate asserts the result strings equal the library character for
 * character, for all eight categories.
 */
function deriveCopy() {
  const copy = {} as Record<LeakCategory, { name: string; rationale: string; remediation: string }>;
  for (const leak of LEAK_LIBRARY.leaks) {
    const key = keyOf(leak.title);
    const fix = leak.facts.find((fact) => fact.label === "Fix direction")?.value;
    if (!LEAK_CATEGORIES.includes(key) || !leak.body || !fix) {
      throw new Error(`Leak Library entry "${leak.title}" does not map onto the eight categories.`);
    }
    copy[key] = { name: leak.title, rationale: leak.body, remediation: fix };
  }
  const missing = LEAK_CATEGORIES.filter((category) => !copy[category]);
  if (missing.length > 0 || LEAK_LIBRARY.leaks.length !== LEAK_CATEGORIES.length) {
    throw new Error(`Leak Library must define exactly the eight categories; missing: ${missing.join(", ")}`);
  }
  return copy;
}

/** §11.2 — `likert_3`. Wording approved by the founder, 2026-09-18. */
export const SCALE = [
  { value: 0, label: "Not true" },
  { value: 1, label: "Somewhat true" },
  { value: 2, label: "Very true" },
] as const;
export type AnswerValue = (typeof SCALE)[number]["value"];

/**
 * §11.3 — the eight questions, verbatim, founder-approved 2026-09-18.
 * One per category, each written about the cause the business can observe.
 * Shown in this order.
 */
export const QUESTIONS = [
  { id: "follow_up", category: "follow_up", statement: "When a lead comes in, we don’t always respond fast or follow up consistently." },
  { id: "conversion", category: "conversion", statement: "Our site or booking process makes it hard for people to take the next step." },
  { id: "offer", category: "offer", statement: "People aren’t sure what they get from us, or why it’s worth it." },
  { id: "trust", category: "trust", statement: "We don’t have enough reviews, proof, or credentials in front of visitors." },
  { id: "tracking", category: "tracking", statement: "We can’t tell which ads, pages, or channels actually bring in revenue." },
  { id: "creative", category: "creative", statement: "Our ads get attention or clicks, but not many real buyers." },
  { id: "visibility", category: "visibility", statement: "We’re hard to find in search results, map listings, or AI search." },
  { id: "traffic", category: "traffic", statement: "We don’t get enough qualified visitors or inquiries in the first place." },
] as const satisfies readonly { id: string; category: LeakCategory; statement: string }[];

/** §11.4 — the tie-break order, founder-approved 2026-09-18 as proposed. */
export const PRIORITY_ORDER = [
  "follow_up",
  "conversion",
  "offer",
  "trust",
  "tracking",
  "creative",
  "visibility",
  "traffic",
] as const satisfies readonly LeakCategory[];

/** §11.2 `AssessmentRuleSet`, as the fixture the stub scores against. */
export const ACTIVE_RULE_SET = {
  // .2: the six questions with apostrophes changed to curly (founder ruling,
  // 2026-09-18). A question changed, so per §11.2 this is a new version with a
  // new hash; .1 is not edited in place.
  version: "fixture-2026-09-18.2",
  status: "active",
  taxonomy: LEAK_CATEGORIES,
  questions: QUESTIONS,
  scale: SCALE,
  priority_order: PRIORITY_ORDER,
  copy: deriveCopy(),
} as const;

export type RuleSet = typeof ACTIVE_RULE_SET;
