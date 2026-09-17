import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, PageHeader, PageSection } from "@/components/page";
import { NAV_CTA, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "About",
  description:
    "We come from advertising. Now we’re building the next version of it — one real campaign at a time.",
  path: "/about",
  ogImage: "/about/opengraph-image",
});

/**
 * About (Brief §B4). Copy verbatim.
 *
 * Company voice only, per the founder's explicit direction: no founder name,
 * no specific brand names, no sales figures, no athlete background, no broker
 * license. The gate checks the page for figures and names.
 */
export default function AboutPage() {
  return (
    <main>
      <PageHeader label="About" title="We come from advertising. Now we’re building the next version of it." />

      <PageSection id="story" label="Where we come from">
        <p className="type-body-lead text-text-primary">
          Z Best Clips was founded by a software engineer with years of experience in
          high-end automotive sales — moving into luxury and exotic brands, and building new
          client relationships from zero at every step up. That same instinct — walk in,
          prove it, earn the next opportunity — is what built Z Best Media, and it&rsquo;s
          what&rsquo;s building Z Best Clips now.
        </p>
        <p className="type-body-lead text-text-secondary">
          We&rsquo;re not a video editing shop that stumbled into marketing, and we&rsquo;re
          not a marketing agency guessing at video. We&rsquo;ve done the sales floor, the
          client relationships, and the advertising work — now we&rsquo;re applying that same
          discipline to short-form content distribution.
        </p>
        <p className="type-headline">
          We&rsquo;re building this in the open, one real campaign at a time. No inflated
          numbers, no manufactured urgency, no pretending we&rsquo;ve been at this longer than
          we have.
        </p>
        <CtaRow>
          <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
          <ButtonLink href="/become-a-clipper" variant="secondary">
            Become a Clipper
          </ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
