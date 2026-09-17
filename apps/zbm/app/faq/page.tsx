import { pageMetadata } from "@zbest/ui";
import { FaqList, PageHeader, PageSection } from "@/components/page";
import { DIGITAL_ADVERTISING_FAQ, OUT_OF_HOME_FAQ, REVENUE_RECOVERY_FAQ } from "@/content/faq";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "FAQ",
  description:
    "Questions about Digital Advertising, Revenue Recovery, and Out-of-Home at Z Best Media.",
  path: "/faq",
  ogImage: "/faq/opengraph-image",
});

/**
 * Site-level FAQ (Brief §A4): aggregates the Digital Advertising, Revenue
 * Recovery and Out-of-Home blocks, grouped by discipline, from the same source
 * the service pages render — so the two can never disagree. No Search
 * Intelligence questions. Built in this chunk after Contact (founder
 * correction: its omission from the §3.4 list was an error).
 */
export default function FaqPage() {
  return (
    <main>
      <PageHeader label="FAQ" title="Frequently asked questions" />

      {[
        { id: "digital-advertising", label: "Digital Advertising", href: "/digital-advertising", items: DIGITAL_ADVERTISING_FAQ },
        { id: "revenue-recovery", label: "Revenue Recovery", href: "/revenue-recovery", items: REVENUE_RECOVERY_FAQ },
        { id: "out-of-home", label: "Out-of-Home", href: "/out-of-home", items: OUT_OF_HOME_FAQ },
      ].map((group) => (
        <PageSection key={group.id} id={group.id} label="Discipline" title={group.label}>
          <FaqList items={group.items} />
        </PageSection>
      ))}
    </main>
  );
}
