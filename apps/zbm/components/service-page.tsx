import { ButtonLink, pageMetadata } from "@zbest/ui";
import type { Metadata } from "next";
import { CtaRow, FaqList, Lead, LedgerList, PageHeader, PageSection, RuledList } from "@/components/page";
import { pageService, serviceBySlug, startHref } from "@/content/services";
import { SITE } from "@/lib/site";

/** Metadata for a catalog-rendered service page (content/services.ts). */
export function serviceMetadata(slug: string): Metadata {
  const service = pageService(slug);
  return pageMetadata(SITE, {
    title: service.name,
    description: service.page.metaDescription,
    path: service.href,
    ogImage: `${service.href}/opengraph-image`,
  });
}

/**
 * One service page, rendered from the catalog in the same section order the
 * Brief's own service pages use (§A4 Digital Advertising / Out-of-Home):
 * hero → what's included → how it fits → pricing → who this is for → FAQ.
 *
 * Every primary CTA goes to the universal intake with this service
 * pre-selected, so a campaign link and an on-page click land in the same place.
 */
export function ServicePage({ slug }: { slug: string }) {
  const service = pageService(slug);
  const { page } = service;
  const start = startHref(service.slug);

  const fits = page.fits.map(({ slug: sibling, body }) => {
    const other = serviceBySlug(sibling);
    if (!other) throw new Error(`Service "${slug}" fits with unknown service "${sibling}"`);
    return { title: other.name, href: other.href, external: other.external, body };
  });

  return (
    <main id="main" data-service={service.slug}>
      <PageHeader label={service.name} title={page.heroTitle}>
        {page.lead.map((paragraph) => (
          <Lead key={paragraph}>{paragraph}</Lead>
        ))}
        <CtaRow>
          <ButtonLink href={start}>Start a Project</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to Us
          </ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection label="What’s included">
        <RuledList items={page.included} />
      </PageSection>

      <PageSection label="How it fits with the rest of what we do">
        <LedgerList items={fits} />
      </PageSection>

      <PageSection label="Pricing">
        <p className="type-body-lead text-text-primary">{page.pricing}</p>
      </PageSection>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">{page.whoFor}</p>
        <CtaRow>
          <ButtonLink href={start}>Start a Project</ButtonLink>
        </CtaRow>
      </PageSection>

      <PageSection id="faq" label="FAQ">
        <FaqList items={page.faq} />
      </PageSection>
    </main>
  );
}
