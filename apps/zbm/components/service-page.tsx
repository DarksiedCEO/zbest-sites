import { ButtonLink, HeroMedia, MediaFrame, StoryImage, type StoryAssetId, pageMetadata } from "@zbest/ui";
import type { Metadata } from "next";
import { CtaRow, FaqList, Lead, LedgerList, PageHeader, PageSection, RuledList } from "@/components/page";
import { SERVICE_HERO } from "@/content/service-media";
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
 * FD-VISUAL-01 §10: once its rollout batch lands, the hero carries the
 * service's lead image beside the claim (below it at 390), in the frame where
 * that work runs (content/service-media.ts).
 *
 * Every primary CTA goes to the universal intake with this service
 * pre-selected, so a campaign link and an on-page click land in the same place.
 */
export function ServicePage({ slug }: { slug: string }) {
  const service = pageService(slug);
  const { page } = service;
  const start = startHref(service.slug);
  const hero = SERVICE_HERO[service.slug];

  // `fits`: images for "How it fits…", each at its native canvas (story-pass).
  const story: Partial<Record<string, { problem?: StoryAssetId; work: StoryAssetId; result?: StoryAssetId; fits?: StoryAssetId[] }>> = {
    "tv-streaming": { problem: "tv-problem-wrong-room", work: "tv-work-set", result: "tv-result-watching" },
    "radio-audio": { problem: "radio-problem-commute", work: "radio-work-studio", result: "radio-result-car" },
    "social-media": { problem: "social-problem-dead-page", work: "social-work-calendar", result: "social-result-engaged" },
    "creative-production": { work: "creative-work-storyboard", result: "creative-work-shoot" },
    "influencer-marketing": { work: "influencer-work-filming", result: "influencer-work-brief" },
    // Founder decision 2026-11-07: the broken-form and slow-page scenes moved
    // here from Revenue Recovery, whose copy (RTS-5) names only what its
    // paid analysis checks. These are problems a new site fixes.
    websites: { problem: "web-problem-old-site", work: "web-work-wireframes", fits: ["rr-broken-form", "rr-slow-page"] },
  };
  const images = story[slug];
  const fits = page.fits.map(({ slug: sibling, body }) => {
    const other = serviceBySlug(sibling);
    if (!other) throw new Error(`Service "${slug}" fits with unknown service "${sibling}"`);
    return { title: other.name, href: other.href, external: other.external, body };
  });

  return (
    <main data-service={service.slug}>
      <PageHeader
        label={service.name}
        title={page.heroTitle}
        aside={images?.problem ? <StoryImage asset={images.problem} hero /> : hero ? <ServiceHeroMedia hero={hero} /> : undefined}
      >
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

      <PageSection label="What’s included" media={images ? <StoryImage asset={images.work} /> : undefined}>
        <RuledList items={page.included} />
      </PageSection>

      <PageSection
        label="How it fits with the rest of what we do"
        media={
          images?.result ? (
            <StoryImage asset={images.result} />
          ) : images?.fits ? (
            <div className="grid gap-stack">
              {images.fits.map((asset) => (
                <StoryImage key={asset} asset={asset} />
              ))}
            </div>
          ) : undefined
        }
      >
        <LedgerList items={fits} />
      </PageSection>

      <PageSection label="Pricing">
        <p className="type-body-lead text-text-primary">{page.pricing}</p>
      </PageSection>

      <PageSection label="Who this is for" media={hero ? <ServiceSampleMedia hero={hero} /> : undefined}>
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

function ServiceHeroMedia({ hero: { narrow, ...frame } }: { hero: NonNullable<(typeof SERVICE_HERO)[string]> }) {
  return (
    <HeroMedia
      {...frame}
      className={narrow ? "mx-auto w-full max-w-[20rem]" : undefined}
      sizes={narrow ? "320px" : "(min-width: 1440px) 520px, (min-width: 1024px) 36vw, calc(100vw - 2.5rem)"}
    />
  );
}

function ServiceSampleMedia({ hero: { narrow, ...frame } }: { hero: NonNullable<(typeof SERVICE_HERO)[string]> }) {
  return <MediaFrame {...frame} className={narrow ? "w-full max-w-[20rem]" : undefined}
    sizes={narrow ? "320px" : "(min-width: 1024px) 30vw, calc(100vw - 2.5rem)"} />;
}
