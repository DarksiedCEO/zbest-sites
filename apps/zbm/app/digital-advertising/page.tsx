import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, FaqList, LedgerList, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { DIGITAL_ADVERTISING_FAQ } from "@/content/faq";
import { ASSESSMENT_HREF, SITE, ZBC_ORIGIN } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Digital Advertising",
  description:
    "Paid social, search, and platform campaigns built to feed a funnel that actually converts. Flat management fee, month-to-month.",
  path: "/digital-advertising",
  ogImage: "/digital-advertising/opengraph-image",
});

/** Digital Advertising (Brief §A4). Copy verbatim. */
export default function DigitalAdvertisingPage() {
  return (
    <main>
      <PageHeader
        label="Digital Advertising"
        title="The traffic engine, built to feed a funnel that actually converts."
      >
        <Lead>
          Digital Advertising is where the media runs — paid social, search, and
          platform campaigns that put your business in front of the right audience.
          It&rsquo;s not a separate philosophy from Revenue Recovery, it&rsquo;s the
          other half of the same one:{" "}
          <strong className="font-semibold text-text-primary">
            Digital Advertising drives the traffic. Revenue Recovery makes sure that
            traffic doesn&rsquo;t leak out the bottom.
          </strong>{" "}
          Running ads into a broken funnel wastes spend regardless of how well the
          campaign itself is built — which is exactly why the two disciplines work
          together here instead of being sold as competing options.
        </Lead>
        <CtaRow>
          <ButtonLink href={ASSESSMENT_HREF}>Get an Assessment</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to Us
          </ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection label="What’s included">
        <RuledList
          items={[
            "Platform strategy and media buying — paid social, search, and platform-specific campaigns built around where your actual customers are, not a one-size template",
            "Creative that earns attention, not just fills a slot — targeting without compelling creative wastes the targeting; every campaign is built to be worth watching, not just well-aimed",
            "Audience targeting — built around who actually converts for your business, refined as real campaign data comes in",
            "Performance tracking and reporting — visibility into what’s actually working, not just impressions and clicks",
          ]}
        />
      </PageSection>

      {/*
        "Certified, not just claimed" — Google Partner, Meta Business Partner,
        TikTok Marketing Partner — is NOT RENDERED until all three are earned
        (§A4, §9: hidden means not rendered, not display:none). There is
        deliberately no component, flag or markup for it in this file.
      */}

      <PageSection label="How it fits with the rest of what we do">
        <LedgerList
          items={[
            { title: "Digital Advertising", body: "brings the traffic" },
            { title: "Revenue Recovery", href: "/revenue-recovery", body: "fixes what happens once that traffic lands" },
            {
              title: "Z Best Clips",
              href: ZBC_ORIGIN,
              external: true,
              body: "extends reach further through creator-powered short-form distribution",
            },
            { title: "Out-of-Home", href: "/out-of-home", body: "builds broader brand presence outside the feed entirely" },
          ]}
        />
      </PageSection>

      <PageSection label="Pricing">
        <p className="type-body-lead text-text-primary">
          Campaigns typically start around{" "}
          <span className="type-mono text-[1.08em]">$1,500–$2,500/month</span> for a
          single-platform campaign, scaling based on platform count and ad spend — flat
          management fee, not a percentage of spend. Month-to-month, no long-term
          lock-in — though ad platforms typically need 4–6 weeks to gather enough data
          to optimize meaningfully.
        </p>
      </PageSection>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">
          Businesses that need real traffic driving to a site or funnel — first
          campaign ever, or existing spend underperforming.
        </p>
        <CtaRow>
          <ButtonLink href={ASSESSMENT_HREF}>Get an Assessment</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to Us
          </ButtonLink>
        </CtaRow>
      </PageSection>

      <PageSection id="faq" label="FAQ">
        <FaqList items={DIGITAL_ADVERTISING_FAQ} />
      </PageSection>
    </main>
  );
}
