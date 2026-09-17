import type { LegalPart } from "@zbest/ui";

/**
 * Z Best Clips legal page shells — outline only (Brief §5).
 *
 * Section headings are the scope items of ZBM-ZBC-Legal-Document-Brief.md
 * Part Two, named as topics. No language from that brief is reproduced: it
 * states that none of it may be published before attorney review.
 *
 * The Terms are one page in two parts because the footer carries a single
 * "Terms of Service" entry (§B3) while the Legal Brief scopes separate terms
 * for clippers and for clients. Whether they ship as one document or two is the
 * attorney's call; this shell does not decide it.
 */
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
