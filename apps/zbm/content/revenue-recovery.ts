import type { LedgerItem } from "@/components/page";

/**
 * Revenue Recovery — copy carried over from the live www.zbestmedia.com page
 * (Brief §A4: "extract it from the live site; do not rewrite").
 *
 * Source: docs/sources/live-zbestmedia-home-2026-09-16.txt, the rendered text
 * of the live page captured 2026-09-16. Every string below is verbatim from it;
 * line numbers are cited so each can be checked.
 *
 * FILTERED CARRY-OVER (founder decision, Phase 4). Carried: the definition, the
 * Method, the leak library, industry leak patterns, the Audit deliverable, the
 * traditional-agency comparison, and how engagements work. NOT carried:
 *   - the illustrative revenue diagnostic ($2.4M+, +327%, …)        live 29–53
 *   - "representative scenario" case cards (+143% leads, …)        live 75–126
 *   - the named founder section and quote                          live 596–610
 *   - every dollar price (Audit $997, $2,500–$10,000+) and Stripe  live 677–705
 *   - the self-assessment score, calculator, interactive quiz      live 419–559 (Phase 5)
 *   - Revenue Intelligence Center articles (blog stays unlinked)   live 212–235
 *   - every 60-second line (founder hold)                          live 25, 62, 669, 724…
 *   - unverified claims: "Proven System Real Results", "proven
 *     4-step system", "predictable", "Enterprise readiness"         live 21, 133, 18, 612
 */

/** live 135 */
export const DEFINITION =
  "Revenue Recovery is the process of identifying and fixing the marketing, website, advertising, conversion, follow-up, trust, and visibility issues that prevent a business from reaching its revenue potential.";

/** live 131, 136, 139–173 */
export const METHOD = {
  name: "The Z Best Revenue Recovery Method™",
  tagline: "A Disciplined, Measurable System — Not A Bag Of Tactics",
  steps: [
    {
      title: "Diagnose",
      body: "Find the leaks across traffic, conversion, trust, follow-up, analytics, and visibility.",
      facts: [
        { label: "Client receives", value: "Leak map, diagnostic findings, benchmark context" },
        { label: "Measured by", value: "Leak severity, missed opportunity, diagnostic priority" },
      ],
    },
    {
      title: "Rebuild",
      body: "Repair the highest-impact issues first: messaging, landing pages, tracking, offers, creative, and lead flow.",
      facts: [
        { label: "Client receives", value: "Prioritized action plan, revised offer and funnel direction" },
        { label: "Measured by", value: "Trust lift, conversion lift, friction removal" },
      ],
    },
    {
      title: "Optimize",
      body: "Improve campaigns, content, conversion paths, and follow-up systems using performance data.",
      facts: [
        { label: "Client receives", value: "Optimization roadmap and test sequence" },
        { label: "Measured by", value: "Lead quality, booking rate, ROI clarity" },
      ],
    },
    {
      title: "Scale",
      body: "Turn what works into predictable growth through paid media, content, automation, and proof.",
      facts: [
        { label: "Client receives", value: "Scale plan tied to what already converts" },
        { label: "Measured by", value: "Recovered revenue, cost efficiency, repeatable growth" },
      ],
    },
  ] satisfies LedgerItem[],
};

/** live 320–417 */
export const LEAK_LIBRARY = {
  title: "Revenue Leak Library",
  intro: "Make Revenue Recovery easy to understand before the audit even starts.",
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
  intro: "Typical leak patterns we often find during diagnostic reviews.",
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

/** live 455–513 */
export const AUDIT_DELIVERABLE = {
  label: "The Audit Deliverable",
  title: "See what you receive before you ever submit.",
  intro:
    "Executive summary, a prioritized leak report with an owner and priority against every action, an explicit confidence label, and the uncertainties we could not resolve — stated, not hidden. We report what we can evidence. We do not guess at dollar figures; we show the priority, confidence, and uncertainty behind each finding so you know what to fix first.",
  parts: [
    { title: "Executive Summary", body: "A concise view of the biggest revenue leaks, business impact, and what to fix first." },
    { title: "Leak Severity Matrix", body: "A structured read on which issues are critical, high, moderate, or low impact." },
    { title: "Priority Roadmap", body: "A practical recovery sequence that moves from diagnosis into rebuild and optimization." },
    { title: "Confidence & Uncertainty", body: "Every finding carries an explicit confidence label, and anything we could not verify from the evidence is listed as an open question rather than quietly dropped." },
    { title: "Written Report", body: "Delivered as a clear written report you can share with your team and act on immediately." },
  ] satisfies LedgerItem[],
};

/** live 638–654 */
export const COMPARISON = {
  traditional: {
    label: "Traditional Agency",
    title: "Tactics without a recovery system.",
    points: ["Runs ads", "Builds websites", "Sends reports", "Focuses on tactics", "May miss revenue leaks"],
  },
  recovery: {
    label: "Revenue Recovery Partner",
    title: "Fix the leaks, recover the revenue, then scale what works.",
    points: [
      "Finds leaks before more spend is wasted",
      "Prioritizes fixes that improve conversion",
      "Tracks recovery and makes the next move obvious",
      "Automates follow-up and turns wins into proof",
      "Improves conversion across traffic, trust, offer, and follow-up",
    ],
  },
};

/**
 * live 657–701, with every dollar figure removed (founder decision: no dollar
 * pricing on this page until current pricing is decided). Phase 1's live
 * description is held with the 60-second lines — it describes what the free
 * assessment returns. Phase 3 keeps its first sentence only; the second is the
 * dollar range.
 */
export const ENGAGEMENTS = {
  label: "How Engagements Work",
  title: "One path. Priced against recovered revenue — never hours.",
  intro:
    "Start free. Pay for the deep-dive Audit™ only when you want the full prioritized picture and a live strategy session. Implementation and the ongoing Program™ are scoped personally from your Leak Report — never sold off a menu.",
  phases: [
    { title: "Revenue Recovery Assessment™", body: "Phase 1 — Start free" },
    {
      title: "Revenue Recovery Audit™",
      body: "Phase 2 — Diagnose",
      detail:
        "The paid investigation: a reviewed evidence-grounded Assessment, a prioritized Revenue Leak Report with recommended fixes, an owner and priority against every action, an explicit confidence label, the uncertainties we could not resolve stated plainly, and a live strategy session with a human.",
    },
    {
      title: "Revenue Recovery Implementation",
      body: "Phase 3 — Recover",
      detail: "A fixed-scope project built from your Leak Report — every fix tied to the dollars it recovers.",
    },
    {
      title: "Revenue Recovery Program™",
      body: "Phase 4 — Compound",
      detail:
        "Ongoing optimization once the leaks are plugged: monitoring, recovery sprints, and reporting. Offered at implementation handoff — not sold off the shelf.",
    },
  ],
};
