import { ButtonLink, HeroMedia, pageMetadata } from "@zbest/ui";
import { CtaRow, Lead, PageHeader, PageSection } from "@/components/page";
import { NAV_CTA, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Brands",
  description:
    "Your showroom floor, your treatment room, your storefront — turned into a compounding short-form presence that’s yours to keep. Owned distribution.",
  path: "/brands",
  ogImage: "/brands/opengraph-image",
});

/**
 * Brands — Focus Area page, accent --zbc-brand (Brief §B4). Copy verbatim.
 * data-page-focus on <main> recolors the whole document (§B1).
 *
 * FD-VISUAL-01 §10: the hero carries two vertical covers for brand-owned
 * accounts — a showroom (Quellmont Motors) and a treatment room (Maren Vale
 * Aesthetics), the two settings the lead names — each in a phone.
 */
export default function BrandsPage() {
  return (
    <main data-page-focus="brands">
      <PageHeader
        label="Brands"
        title="Build an audience that keeps showing up."
        aside={
          <div className="mx-auto grid max-w-[30rem] grid-cols-2 gap-4" data-hero-pair>
            <HeroMedia asset="quellmont-cover" frame="phone" chrome="clip" badge="compact" sizes="(min-width: 1024px) 220px, 45vw" />
            <HeroMedia asset="marenvale-room" frame="phone" chrome="clip" badge="compact" sizes="(min-width: 1024px) 220px, 45vw" />
          </div>
        }
      >
        <Lead>
          Your showroom floor, your treatment room, your storefront — turned into a real,
          growing short-form presence that the same local audience sees again and again. Not
          a single spike, a compounding channel that&rsquo;s yours to keep.
        </Lead>
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">
          Auto dealerships, med spas, and local or regional businesses that depend on repeat
          visibility to turn attention into booked appointments and showroom visits.
        </p>
      </PageSection>

      <PageSection label="How it works" title="Owned distribution.">
        <p className="type-body-lead text-text-primary">
          Content posts to your own accounts, so the following, content library, and audience
          relationship stay with your business after the campaign ends.
        </p>
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
