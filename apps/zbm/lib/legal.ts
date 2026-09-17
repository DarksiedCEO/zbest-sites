import type { LegalPart } from "@zbest/ui";

/**
 * Z Best Media legal page shells — outline only (Brief §5).
 *
 * Section headings are the scope items of ZBM-ZBC-Legal-Document-Brief.md
 * Part One, named as topics. No language from that brief is reproduced: it
 * states that none of it may be published before attorney review.
 */
export const LEGAL_DOCUMENTS = {
  "privacy-policy": {
    title: "Privacy Policy",
    parts: [
      {
        sections: [
          "Information you give us directly",
          "Information collected automatically",
          "Service providers and data sharing",
          "California privacy rights (CCPA/CPRA)",
          "Retention and deletion requests",
        ],
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    parts: [
      {
        sections: [
          "Scope of services",
          "Fees and payment",
          "Ownership of creative and campaign assets",
          "Limitation of liability",
          "Cancellation and termination",
          "Governing law and dispute resolution",
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
          "Third-party advertising cookies",
          "Your choices",
        ],
      },
    ],
  },
} satisfies Record<string, { title: string; parts: LegalPart[] }>;

export type LegalDocument = keyof typeof LEGAL_DOCUMENTS;
