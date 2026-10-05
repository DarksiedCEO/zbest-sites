import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, Lead, LedgerList, PageHeader, PageSection, RuledList } from "@/components/page";
import { SERVICE_GROUPS, SERVICES } from "@/content/services";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Services",
  description:
    "Everything Z Best Media does: digital, TV, radio, out-of-home, social, creative, influencer, websites, revenue recovery, and Z Best Clips.",
  path: "/services",
  ogImage: "/services/opengraph-image",
});

/**
 * Services hub (amendment Oct 4, 2026). Every service, grouped, each linking to
 * its page — the one page a broad campaign can send anyone to.
 *
 * "Who we serve" names industries only — no client names, no logos, no
 * results (Brief §9; Sep 17 rulings).
 */
export default function ServicesPage() {
  return (
    <main>
      <PageHeader label="Services" title="Everything you need to be seen, remembered, and paid.">
        <Lead>
          Z Best Media is a full-service advertising agency. Billboards or broadcast,
          a social calendar or a commercial, a new website or a revenue leak — one team
          plans it, makes it, runs it, and shows you what it did.
        </Lead>
        <CtaRow>
          <ButtonLink href="/start">Start a Project</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to Us
          </ButtonLink>
        </CtaRow>
      </PageHeader>

      {SERVICE_GROUPS.map((group) => (
        <PageSection
          key={group.id}
          id={group.id}
          label={group.label}
          title={group.title}
          intro={<Lead>{group.intro}</Lead>}
        >
          <LedgerList
            items={SERVICES.filter((s) => s.group === group.id).map((s) => ({
              title: s.name,
              href: s.href,
              external: s.external,
              body: s.summary,
            }))}
          />
        </PageSection>
      ))}

      <PageSection id="who-we-work-with" label="Who we serve" title="Any business with something to sell.">
        <RuledList
          items={[
            "Home services — HVAC, roofing, plumbing, restoration",
            "Med spas, clinics, and wellness",
            "Legal and professional services",
            "Auto dealers and automotive services",
            "Restaurants, hospitality, venues, and events",
            "Retail and e-commerce brands",
            "Music, film, and entertainment releases",
            "Creators, streamers, and personal brands",
            "Multi-location and regional brands",
          ]}
        />
      </PageSection>

      <PageSection id="how-it-works" label="How every project runs" title="Same standard, whatever you buy.">
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Tell us", "What you need, or just what’s going on."],
            ["Plan & quote", "A written plan: what we’ll do, what it costs, how we’ll measure it."],
            ["Agree", "Nothing starts until you approve it in writing."],
            ["Run", "We make it, get it placed, and manage it."],
            ["Report", "What it did, in real numbers, with the confidence stated."],
          ].map(([step, body], i) => (
            <li key={step} className="flex flex-col border-t border-text-secondary/35 pt-4">
              <p className="type-mono text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="type-title mt-2">{step}</h3>
              <p className="type-body mt-2 pb-stack text-text-secondary">{body}</p>
            </li>
          ))}
        </ol>
        <CtaRow>
          <ButtonLink href="/start">Start a Project</ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
