import type { LedgerItem } from "@/components/page";

/**
 * Revenue Recovery — copy carried over from the live www.zbestmedia.com page
 * (Brief §A4: "extract it from the live site; do not rewrite").
 *
 * Source: docs/sources/live-zbestmedia-home-2026-09-16.txt, the rendered text
 * of the live page captured 2026-09-16. Line numbers are cited so each string
 * can be checked against it — see REVISED below for the ones that are now
 * founder rewrites rather than carry-over.
 *
 * FILTERED CARRY-OVER (founder decision, Phase 4). Carried: the definition, the
 * leak library, industry leak patterns, the Audit deliverable, and how
 * engagements work. NOT carried:
 *   - the illustrative revenue diagnostic ($2.4M+, +327%, …)        live 29–53
 *   - "representative scenario" case cards (+143% leads, …)        live 75–126
 *   - the named founder section and quote                          live 596–610
 *   - every dollar price (Audit $997, $2,500–$10,000+) and Stripe  live 677–705
 *   - the self-assessment score, calculator, interactive quiz      live 419–559 (Phase 5)
 *   - Revenue Intelligence Center articles (blog stays unlinked)   live 212–235
 *   - every 60-second line (founder hold)                          live 25, 62, 669, 724…
 *   - unverified claims: "Proven System Real Results", "proven
 *     4-step system", "predictable", "Enterprise readiness"         live 21, 133, 18, 612
 *
 * REVISED Sep 17 (founder rulings, copy audit at 1fc360f). The strings below
 * are no longer a verbatim carry-over. They are founder rewrites and diverge
 * deliberately from both the live page and §A4's "extract it from the live
 * site; do not rewrite" — recorded here so it does not read as drift:
 *   - REMOVED the Z Best Revenue Recovery Method™ (Diagnose · Rebuild ·
 *     Optimize · Scale) and its tagline. One process on the site, not two:
 *     Home's Assess / Audit / Fix / Scale. No replacement section.
 *   - REMOVED the Traditional Agency / Revenue Recovery Partner comparison.
 *     ZBM is an advertising agency and does not position against one.
 *   - REWRITTEN so nothing promises what the Audit deliverable does not: the
 *     engagements headline (was "Priced against recovered revenue — never
 *     hours"), the Phase 3 Implementation body (was "every fix tied to the
 *     dollars it recovers"), and the leak library intro.
 */

/** live 135 */
export const DEFINITION =
  "Revenue Recovery is the process of identifying and fixing the marketing, website, advertising, conversion, follow-up, trust, and visibility issues that prevent a business from reaching its revenue potential.";

/** live 320–417 */
export const LEAK_LIBRARY = {
  title: "Revenue Leak Library",
  // SOW source of truth (scratchpad/legal/zbm-sow-revenue-recovery-v1.md §1.5): a general guide only.
  intro: "Eight common ways revenue leaks — a general guide, not a list of what the paid analysis checks.",
  leaks: [
    ["Traffic Leak", "Your business is not getting enough qualified visitors from search, ads, referrals, or social channels.", "Low qualified traffic or weak lead volume.", "Improve acquisition channels, targeting, offers, and visibility."],
    ["Conversion Leak", "Visitors arrive, but too few take the next step.", "High visits with low form fills, calls, or bookings.", "Tighten the CTA, simplify the path, and remove hesitation points."],
    ["Trust Leak", "The business does not establish enough authority fast enough.", "People browse but do not commit.", "Move proof, reviews, guarantees, and authority higher in the journey."],
    ["Offer Leak", "The offer is present, but the value is not clear or compelling.", "Traffic clicks through but does not convert.", "Clarify the promise, sharpen the outcome, and reduce ambiguity."],
    ["Follow-Up Leak", "Leads come in, but they are not contacted quickly or consistently enough.", "Booked calls and close rates lag behind lead volume.", "Automate follow-up, improve response speed, and tighten handoff rules."],
    ["Tracking Leak", "You cannot clearly see which campaigns, pages, or sources generate revenue.", "Spend decisions are based on guesswork.", "Improve attribution, event tracking, and reporting clarity."],
    ["Creative Leak", "Ads or visual assets get attention but do not create strong buying intent.", "Clicks without meaningful downstream results.", "Align creative with the offer, audience, and landing experience."],
    ["Visibility Leak", "The business is harder to find or harder to trust across search, maps, and answer engines.", "Low discovery, weak branded demand, or limited qualified reach.", "Strengthen local visibility, content signals, and entity consistency."],
  ].map(([title, body, symptom, fix]) => ({
    title: title!,
    body,
    facts: [
      { label: "Symptom", value: symptom },
      { label: "Fix direction", value: fix },
    ],
  })) satisfies LedgerItem[],
};

/** live 238–317 */
export const INDUSTRY_PATTERNS = {
  title: "Industry Leak Patterns",
  intro: "Leak patterns common in each industry — general guidance, not findings from our analysis.",
  patterns: [
    ["Home Services", "Follow-Up Leak", "Leads arrive, but call handling and handoff are inconsistent.", "Speed-to-contact, trust signals, and clearer next-step offers."],
    ["HVAC", "Offer Leak", "Seasonal demand exists, but the landing experience does not convert urgency into booked jobs.", "Sharper offer framing, financing clarity, and booking-first conversion paths."],
    ["Roofing", "Trust Leak", "Traffic lands, but proof, differentiation, and authority do not show up fast enough.", "Proof placement, trust assets, and inspection-driven CTAs."],
    ["Restoration", "Conversion Leak", "Urgent intent is present, but the page creates hesitation instead of immediate action.", "Emergency-first messaging, simplified contact flow, and friction removal."],
    ["Professional Services", "Messaging Leak", "The business sounds capable, but the value proposition is too abstract to move buyers.", "Clearer positioning, stronger proof, and a more direct offer."],
    ["eCommerce", "Tracking Leak", "Spend is active, but attribution and funnel visibility are too weak to identify profitable growth.", "Measurement clarity, creative diagnostics, and checkout-path optimization."],
  ].map(([title, pattern, risk, focus]) => ({
    title: title!,
    facts: [
      { label: "Common audit pattern", value: pattern },
      { label: "Typical risk area", value: risk },
      { label: "Sample recovery focus", value: focus },
    ],
  })) satisfies LedgerItem[],
};

/**
 * Red team RTS-5 (2026-10-30): what the backend checks automatically TODAY.
 * Must match the Revenue Recovery Analysis SOW (§1.2, §1.5, §1.7, §3.2, §10),
 * which is the source of truth: one automated check, rule-based (no AI
 * model), planned checks reported as NOT COVERED, no manual store review
 * beyond the order data, explanations and recommendations written by a
 * person who reviews the whole report.
 * Source of truth: DarksiedCEO/zbm-zbc main,
 * services/detection-py/src/store_connector/translate.py AGENT_COVERAGE —
 * on a connected Shopify store only discount-misuse-v1 runs; every other
 * agent reports "not covered" (no data source is connected). Titles are the
 * report's own (src/rr_report.py AGENT_TITLES). Move a check to `live` only
 * when AGENT_COVERAGE marks it covered.
 */
export const AUTOMATED_CHECKS = {
  label: "What we check automatically today",
  intro:
    "When you give us read-only access to your Shopify store, one check runs on your own order records: discount-code stacking, calculated by our software with fixed, written rules — not an AI model. The other checks are planned; until they exist, the report lists them as NOT COVERED, with the reason. We don’t review your store manually beyond the order data.",
  live: [
    {
      title: "Stacked discount codes",
      body: "Orders where more than one discount code was applied, and how far the stacked discount went past what the single most valuable code would have given on its own.",
    },
  ],
  coming: [
    "Affiliate commission on coupon-driven orders",
    "Abandoned carts without a recovery flow",
    "Subscription renewals never triggered",
    "Orders invisible to server-side attribution",
    "Cross-channel attribution gaps",
    "Platform integration gaps",
    "Contract pricing drift",
  ],
};

/**
 * live 455–513, REWRITTEN Oct 30 2026 to the Revenue Recovery Analysis SOW
 * §3 (the source of truth): its Report holds exactly these parts. The old
 * Executive Summary / Leak Severity Matrix / Priority Roadmap are not SOW
 * deliverables and are gone.
 */
export const AUDIT_DELIVERABLE = {
  label: "The Report",
  title: "See what you receive before you ever submit.",
  intro:
    "One written report, sent to you as a file by email or secure link, from read-only access to your Shopify orders. The stacked-discount figures are calculated by our software with fixed, written rules — not an AI model. A person at Z Best Media writes the explanations and recommendations and reviews the whole report before it reaches you. We never change anything in your store, and we never read your customers’ names, emails, phone numbers or addresses.",
  parts: [
    { title: "What was read", body: "The period measured, how many orders were read and analysed, and every reason an order was left out, with counts." },
    { title: "Checks run and not covered", body: "Which checks ran, and which are NOT COVERED and why — a check that did not run is never shown as a clean result." },
    { title: "Findings, each with its evidence class", body: "Every figure is labelled OBSERVED (exact arithmetic on your recorded orders) or ESTIMATED (true only if a stated assumption holds), with its cause and method. No overall score and no grand total." },
    { title: "Assumptions, stated", body: "For stacked discounts: the excess counts as lost revenue only if you intend at most one discount code per order. Your store’s own settings allowed each stacked order." },
    { title: "Yearly projection, labelled as an estimate", body: "Where at least 14 days were measured: the period’s figure extended to a year, labelled ESTIMATED with low confidence, with its basis written out." },
    { title: "Recommendations, written by a person", body: "What you might change, written by a person at Z Best Media from the findings. What to change in your store is your decision." },
    { title: "Walkthrough call", body: "On request within 30 days of delivery, one video call of up to 60 minutes to walk you through the report." },
  ] satisfies LedgerItem[],
};

/**
 * live 657–701, with every dollar figure removed (founder decision: no dollar
 * pricing on this page until current pricing is decided). Phase 1's live
 * description is held with the 60-second lines — it describes what the free
 * assessment returns — and replaced by "Free. No payment, no obligation."
 * (audit F8: the card had no body). Phase 3 keeps its first sentence only; the second is the
 * dollar range.
 */
export const ENGAGEMENTS = {
  label: "How Engagements Work",
  title: "One path. Start free, pay only for the deep dive.",
  intro:
    "Start free. Pay for the Audit™ — the Revenue Recovery Analysis of your Shopify orders — when you want the measured picture, with a walkthrough call on request. Implementation and the ongoing Program™ are scoped personally from your report — never sold off a menu.",
  phases: [
    {
      title: "Revenue Recovery Assessment™",
      body: "Phase 1 — Start free",
      // Audit F8 fix (founder direction): exactly this. It said nothing about
      // what the assessment returns because that was undecided; founder
      // decision 10 (Phase 5) has since settled it — one prioritized leak. The
      // founder's F8 wording is kept as written; whether this card should now
      // name what the assessment returns is his call, not a copy fix.
      detail: "Free. No payment, no obligation.",
    },
    {
      title: "Revenue Recovery Audit™",
      body: "Phase 2 — Diagnose",
      detail:
        "The paid analysis: read-only access to your Shopify orders, discount-code stacking measured with fixed, written rules, every figure labelled OBSERVED or ESTIMATED with its assumptions, recommendations written by a person, and a walkthrough call on request.",
    },
    {
      title: "Revenue Recovery Implementation",
      body: "Phase 3 — Recover",
      detail: "A fixed-scope project built from your report — every fix tied to the leak it closes.",
    },
    {
      title: "Revenue Recovery Program™",
      body: "Phase 4 — Compound",
      detail:
        "Ongoing optimization once the leaks are plugged: monitoring, recovery sprints, and reporting. Offered at implementation handoff — not sold off the shelf.",
    },
  ],
};
