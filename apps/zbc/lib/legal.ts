import type { LegalPart } from "@zbest/ui";

/**
 * Z Best Clips legal pages: outlines until launch.
 *
 * Founder decision, Oct 30 2026: no review-status or draft wording on either
 * site. Until Z Best Clips accepts clients and publishes its terms, each page
 * shows the notice below, the topics its document will cover, and nothing that
 * reads as a policy, a promise or a term. Pages stay noindex (lib/site.ts).
 *
 * The Terms are one page in two parts because the footer carries a single
 * "Terms of Service" entry (§B3), while clippers and clients get separate terms.
 */
export const ZBC_LEGAL_NOTICE =
  "Z Best Clips is not yet accepting clients. These terms will be published before launch.";
export const ZBC_LEGAL_PENDING = "Published before Z Best Clips launches.";
/**
 * Neutral until ZBC's contracting entity is confirmed (AEGIS r2 N5): no
 * bracketed token on a public page. The production guard in
 * app/legal/[document]/page.tsx refuses any [UPPER CASE] token in these pages.
 */
export const ZBC_LEGAL_ISSUER = "Z Best Clips";

export const LEGAL_DOCUMENTS = {
  "privacy-policy": {
    title: "Privacy Policy",
    parts: [
      {
        sections: [
          "Information collected from clippers",
          "Connected social media accounts",
          "Information collected from clients",
          "Submission authenticity and fraud-detection signals",
          "California privacy rights (CCPA/CPRA)",
          "Age requirement and minors' data",
        ],
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    parts: [
      {
        heading: "Part A — Clippers",
        sections: [
          "Independent contractor status",
          "Payout mechanics",
          "Submission review and fraud detection",
          "Appeals",
          "Content licensing",
          "Related accounts",
          "Age requirement",
          "Governing law and dispute resolution",
        ],
      },
      {
        heading: "Part B — Brand & Entertainment Clients",
        sections: [
          "Campaign funding",
          "Billable views",
          "Refunds and credits",
          "Client content and warranties",
          "Content ownership after a campaign",
          "Rented and owned distribution",
        ],
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    parts: [
      {
        sections: [
          "Categories of cookies",
          "Campaign attribution tracking",
          "Your choices",
        ],
      },
    ],
  },
} satisfies Record<string, { title: string; parts: LegalPart[] }>;

export type LegalDocument = keyof typeof LEGAL_DOCUMENTS;
