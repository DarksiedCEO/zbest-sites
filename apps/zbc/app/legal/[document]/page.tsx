import { CookieSettingsButton, LegalShell, legalPlaceholders, pageMetadata } from "@zbest/ui";
import type { Metadata } from "next";
import { LEGAL_DOCUMENTS, ZBC_LEGAL_ISSUER, ZBC_LEGAL_NOTICE, ZBC_LEGAL_PENDING, type LegalDocument } from "@/lib/legal";
import { SITE } from "@/lib/site";

/** Only the three documents exist; any other /legal/* address is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  // Same rule as ZBM (AEGIS r2 N5): no production build ships a bracketed
  // [UPPER CASE] token on a ZBC legal page. Exempt: a Vercel preview and the
  // e2e gate (ZBEST_ALLOW_LEGAL_PLACEHOLDERS=1).
  const strings = [
    ZBC_LEGAL_NOTICE,
    ZBC_LEGAL_PENDING,
    ZBC_LEGAL_ISSUER,
    ...Object.values(LEGAL_DOCUMENTS).flatMap((d) => [d.title, ...d.parts.flatMap((p) => ["heading" in p ? p.heading : "", ...p.sections])]),
  ];
  const missing = legalPlaceholders(strings);
  const exempt = process.env.VERCEL_ENV === "preview" || process.env.ZBEST_ALLOW_LEGAL_PLACEHOLDERS === "1";
  if (process.env.NODE_ENV === "production" && !exempt && missing.length) {
    throw new Error(`ZBC legal pages contain placeholders: ${missing.join(", ")}. Fill them in apps/zbc/lib/legal.ts before a production build.`);
  }
  return Object.keys(LEGAL_DOCUMENTS).map((document) => ({ document }));
}

type Props = { params: Promise<{ document: LegalDocument }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { document } = await params;
  // Outlines until launch: noindex and kept out of sitemap.xml (lib/site.ts).
  return pageMetadata(SITE, {
    title: LEGAL_DOCUMENTS[document].title,
    description: `${LEGAL_DOCUMENTS[document].title} for ${SITE.name}. ${ZBC_LEGAL_NOTICE}`,
    path: `/legal/${document}`,
    index: false,
  });
}

export default async function LegalPage({ params }: Props) {
  const { document } = await params;
  const doc = LEGAL_DOCUMENTS[document];
  return (
    <LegalShell
      title={doc.title}
      site={SITE.name}
      parts={doc.parts}
      notice={ZBC_LEGAL_NOTICE}
      pendingText={ZBC_LEGAL_PENDING}
      issuerText={ZBC_LEGAL_ISSUER}
    >
      {document === "cookie-policy" ? <CookieSettingsButton /> : null}
    </LegalShell>
  );
}
