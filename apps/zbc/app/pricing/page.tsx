import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, LedgerList, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { NAV_CTA, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Pricing",
  description:
    "You fund a pool that pays creators for approved posts and verified views — nothing is billed before you approve the post.",
  path: "/pricing",
  ogImage: "/pricing/opengraph-image",
});

/**
 * Pricing (Brief §B4). Copy verbatim.
 *
 * Build note, enforced: client-facing pricing stays bundled. The clipper-side
 * payout split is NOT disclosed here — it lives on Become a Clipper only (§9:
 * buyer-facing and clipper-facing pricing never cross-contaminate). The gate
 * fails any client-facing page carrying a dollar figure.
 */
export default function PricingPage() {
  return (
    <main>
      <PageHeader label="Pricing" title="How a campaign is priced.">
        <Lead>
          You&rsquo;re not paying for hours or a retainer. You&rsquo;re funding a pool that
          pays creators for approved posts and verified views — nothing is billed before you
          approve the post.
        </Lead>
      </PageHeader>

      <PageSection id="levers" label="Levers you control">
        <LedgerList
          items={[
            { title: "Campaign budget", body: "funded, nothing charged upfront" },
            { title: "Reward rate", body: "dollars per 1,000 views" },
            { title: "Minimum payout", body: "view threshold before review" },
            { title: "Maximum payout", body: "per-creator, per-video cap" },
            { title: "Flat fee bonus", body: "optional, useful for launch campaigns" },
          ]}
        />
      </PageSection>

      <PageSection label="What every campaign includes">
        <RuledList
          items={[
            "Campaign guidelines and brand safety review",
            "Submission review on every post",
            "Reporting on approved posts/verified views/platform breakdown",
            "Dedicated point of contact",
          ]}
        />
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
