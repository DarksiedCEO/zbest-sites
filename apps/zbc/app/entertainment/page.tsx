import { ButtonLink, HeroMedia, pageMetadata } from "@zbest/ui";
import { CtaRow, Lead, PageHeader, PageSection } from "@/components/page";
import { NAV_CTA, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Entertainment",
  description:
    "Music, film, television, streaming content, sports — turned into dozens of short-form clips built to travel. Rented distribution through the clipper network’s own accounts.",
  path: "/entertainment",
  ogImage: "/entertainment/opengraph-image",
});

/**
 * Entertainment — Focus Area page, accent --zbc-ent (Brief §B4). Copy verbatim.
 * data-page-focus on <main> recolors the whole document (§B1).
 *
 * §B4 note: no specific real companies, leagues or studios — categories only.
 * The Phase 4 gate enforces this with a blocklist on every ZBC page.
 *
 * FD-VISUAL-01 §10: the hero carries an Ivo Solace vertical clip in a phone,
 * coral-graded with the page (§3.3). No handle is drawn over the clip, so
 * nothing covers the creative's own type.
 */
export default function EntertainmentPage() {
  return (
    <main data-page-focus="entertainment">
      <PageHeader
        label="Entertainment"
        title="Get discovered by people who’ve never heard of you."
        aside={
          <HeroMedia
            asset="ivosolace-stage"
            frame="phone"
            chrome="clip"
            className="mx-auto w-full max-w-[17rem]"
            sizes="272px"
          />
        }
      >
        <Lead>
          Music, film, television, streaming content, sports — and the artists, creators,
          teams, and organizations behind them. Whether it&rsquo;s a release, a game, a
          match, a season, or a series, if there&rsquo;s long-form content and an audience
          worth reaching, we turn it into dozens of short-form clips built to travel.
        </Lead>
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">
          Independent artists and labels, filmmakers, streamers and podcasters, sports teams
          and leagues, streaming platforms and studios — anyone with a moment worth putting
          in front of people who haven&rsquo;t found it yet.
        </p>
      </PageSection>

      <PageSection label="How it works" title="Rented distribution.">
        <p className="type-body-lead text-text-primary">
          Your content runs on our clipper network&rsquo;s own accounts, opening audiences
          and algorithmic reach no single account could reach alone.
        </p>
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
