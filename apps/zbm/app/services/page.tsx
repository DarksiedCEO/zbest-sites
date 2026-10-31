import { ButtonLink, MediaFrame, pageMetadata, ServicePreview } from "@zbest/ui";
import { CtaRow, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { SERVICE_IMAGE } from "@/content/service-media";
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
 * FD-VISUAL-01 §10: each act ("Get seen / remembered / paid") lists its
 * services as image-previewing rows (§4.2 service-row preview), from the same
 * lead images as Home (content/service-media.ts). The §5 "three acts"
 * full-bleed compositions are post-launch; the hero carries a small version
 * of them: one tile per act, three different brands (ACT_TILE_SERVICE).
 *
 * "Who we serve" names industries only — no client names, no logos, no
 * results (Brief §9; Sep 17 rulings).
 */
/**
 * The hero's act tiles: one lead image per act, three different concept
 * brands, so no headline repeats side by side (independent review of #13,
 * 2026-10-31). Each is that act's own service image.
 */
const ACT_TILE_SERVICE: Record<string, string> = {
  media: "digital-advertising", // Quellmont Motors
  content: "creative-production", // Saltgrove Hospitality
  conversion: "websites", // Maren Vale Aesthetics
};
const ACT_TILES = SERVICE_GROUPS.flatMap((group) => {
  const service = SERVICES.find((s) => s.slug === ACT_TILE_SERVICE[group.id] && s.group === group.id);
  const image = service ? SERVICE_IMAGE[service.slug] : undefined;
  return service && image ? [{ act: group.title, service: service.name, asset: image }] : [];
});
if (ACT_TILES.length !== SERVICE_GROUPS.length) throw new Error("Services hub: every act needs a hero tile from its own services");

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        label="Services"
        title="Everything you need to be seen, remembered, and paid."
        aside={
          <ul className="grid grid-cols-3 gap-3" data-hero-acts>
            {ACT_TILES.map((tile) => (
              <li key={tile.act}>
                <MediaFrame
                  asset={tile.asset}
                  frame="plate"
                  aspect="1 / 1"
                  priority
                  badge="compact"
                  caption={`${tile.act.replace(/\.$/, "")} · ${tile.service}`}
                  sizes="(min-width: 1024px) 170px, 30vw"
                />
              </li>
            ))}
          </ul>
        }
      >
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
          <ServicePreview
            items={SERVICES.filter((s) => s.group === group.id).map((s) => ({
              title: s.name,
              href: s.href,
              external: s.external,
              body: s.summary,
              asset: SERVICE_IMAGE[s.slug],
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
