import type { FaqItem } from "@zbest/ui";

/**
 * Discipline FAQ blocks (Brief §A4). Each service page renders its own block;
 * the site-level FAQ page aggregates all three, grouped by discipline. No
 * Search Intelligence questions appear on the FAQ page (§A4).
 *
 * REVISED Sep 17 (founder rulings, copy audit at 1fc360f) — no longer verbatim
 * from §A4, and the divergence is intentional, not drift:
 *   - REMOVED "How many accounts does my strategist manage?" (Digital
 *     Advertising) and "Are your case studies real?" (Revenue Recovery, until
 *     a real case study exists).
 *   - REPLACED "How is this different from a traditional advertising agency?"
 *     with "Why audit before running ads?" — ZBM is an advertising agency and
 *     does not position against one.
 *   - REWRITTEN "How is pricing structured?", which promised pricing tied to
 *     recovered revenue; the Audit deliverable makes no dollar promise.
 *   - REWRITTEN "Do you only sell your own inventory?" — plan, not buy.
 */

export const DIGITAL_ADVERTISING_FAQ: FaqItem[] = [
  {
    question: "What does Digital Advertising cost?",
    answer:
      "Campaigns typically start around $1,500–$2,500/month for a single-platform campaign, scaling based on platform count and ad spend — priced as a flat management fee, not a percentage of your spend.",
  },
  {
    question: "Is this a flat fee or a percentage of ad spend?",
    answer:
      "Flat fee. A percentage-of-spend model creates an incentive to grow your budget rather than your results.",
  },
  {
    question: "What’s the commitment length?",
    answer:
      "Month-to-month. We recommend planning for at least 4–6 weeks before evaluating results, but you’re never locked into a long-term contract.",
  },
  {
    question: "What platforms do you run campaigns on?",
    answer:
      "Google Ads, Meta (Facebook and Instagram), and other platforms matched to where your audience actually is.",
  },
];

export const REVENUE_RECOVERY_FAQ: FaqItem[] = [
  {
    question: "What is Revenue Recovery?",
    answer:
      "An audit-first approach that finds where your existing traffic and campaigns are losing conversions, fixes those leaks, then scales what’s proven to work.",
  },
  /*
   * FOUNDER HOLD (Phase 4): "How does the process start?" — "A free 60-second
   * assessment identifies likely leak points before you commit to anything
   * paid." It promises what the assessment returns and how fast, which is the
   * undecided Phase 5 question. Omitted until that decision is made.
   */
  {
    question: "What happens after the free assessment?",
    answer:
      "If there’s enough signal, the next step is a paid audit — a full diagnostic of where revenue is actually being lost.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Phased. Start free, pay for the audit, and anything after that is scoped from your Leak Report.",
  },
  {
    question: "Why audit before running ads?",
    answer:
      "Because ads multiply whatever the funnel already does. If the phone, the form, or the follow-up is losing people, more traffic loses more people. Audit first, fix what’s leaking, then spend.",
  },
  {
    question: "What counts as a “leak”?",
    answer:
      "Any point where traffic arrives but doesn’t convert — identified in the assessment and audit, not assumed.",
  },
  {
    question: "What industries does Revenue Recovery work for?",
    answer:
      "Home services (HVAC, roofing, restoration), med spas, legal, and professional services.",
  },
];

export const OUT_OF_HOME_FAQ: FaqItem[] = [
  {
    question: "How is Out-of-Home pricing determined?",
    answer: "Season, market, location, and campaign duration all factor in.",
  },
  {
    question: "How long should a campaign run?",
    answer:
      "Static: 8–12 weeks for real frequency. Digital OOH: shorter test rotations before longer commitment.",
  },
  {
    question: "Do you only sell your own inventory?",
    answer: "No — we plan across Lamar, Clear Channel, OUTFRONT, and regional operators.",
  },
  {
    question: "Do you offer digital billboards, or only static?",
    answer: "Both — digital drives over a third of industry spend.",
  },
  {
    question: "What makes effective Out-of-Home creative?",
    answer:
      "Simple, bold messaging, one clear call to action — seconds to register with someone in motion.",
  },
  {
    question: "What industries perform well with Out-of-Home?",
    answer:
      "Home services, healthcare/med spas, automotive, legal/professional services, multi-location brands.",
  },
  {
    question: "Can Out-of-Home work alongside Digital Advertising or Z Best Clips?",
    answer:
      "Yes. Most plans pair it with digital or clips so the board and the feed say the same thing.",
  },
];
