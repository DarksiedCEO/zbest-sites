import { CookieSettingsButton, LegalDocument as LegalDocumentView, pageMetadata } from "@zbest/ui";
import type { Metadata } from "next";
import {
  LEGAL_DOCUMENTS,
  LEGAL_EFFECTIVE_DATE,
  LEGAL_ISSUER,
  LEGAL_LAST_UPDATED,
  unfilledLegalPlaceholders,
  type LegalDocument,
} from "@/lib/legal";
import { SITE } from "@/lib/site";

/** Only the listed documents exist; any other /legal/* address is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  // In effect since Andre's Oct 30 2026 decision, so a production deploy must
  // never publish one with a fact still missing. Vercel sets VERCEL_ENV at
  // build time; preview and local builds render the gaps visibly marked.
  const missing = unfilledLegalPlaceholders();
  if (process.env.VERCEL_ENV === "production" && missing.length) {
    throw new Error(
      `ZBM legal documents still contain placeholders: ${missing.join(", ")}. Fill them in apps/zbm/lib/legal.ts before a production deploy.`,
    );
  }
  return Object.keys(LEGAL_DOCUMENTS).map((document) => ({ document }));
}

type Props = { params: Promise<{ document: LegalDocument }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { document } = await params;
  const doc = LEGAL_DOCUMENTS[document];
  // Kept noindex and out of sitemap.xml (lib/site.ts) — a founder choice to
  // revisit once the placeholders are filled.
  return pageMetadata(SITE, {
    title: doc.title,
    description: `${doc.title} for ${SITE.name}. ${doc.subtitle}`,
    path: `/legal/${document}`,
    index: false,
  });
}

export default async function LegalPage({ params }: Props) {
  const { document } = await params;
  return (
    <LegalDocumentView
      doc={LEGAL_DOCUMENTS[document]}
      site={SITE.name}
      issuer={LEGAL_ISSUER}
      effectiveDate={LEGAL_EFFECTIVE_DATE}
      lastUpdated={LEGAL_LAST_UPDATED}
    >
      {document === "cookie-policy" ? <CookieSettingsButton /> : null}
    </LegalDocumentView>
  );
}
