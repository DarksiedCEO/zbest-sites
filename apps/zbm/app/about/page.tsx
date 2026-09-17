import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, Lead, PageHeader, PageSection } from "@/components/page";
import { ASSESSMENT_HREF, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "About",
  description:
    "Z Best Media runs across four disciplines to one standard: find what’s actually working, prove it with real numbers, then scale it.",
  path: "/about",
  ogImage: "/about/opengraph-image",
});

/** About (Brief §A4). Copy verbatim. */
export default function AboutPage() {
  return (
    <main>
      <PageHeader label="About" title="A media company built on evidence, not promises.">
        <Lead>
          Z Best Media runs across four disciplines — digital advertising, revenue
          recovery, out-of-home, and creator-powered content through Z Best Clips. What
          ties them together isn&rsquo;t the channel, it&rsquo;s the approach: find
          what&rsquo;s actually working, prove it with real numbers, then scale it. No
          fake urgency, no manufactured scarcity, no unverified proof — a standard held
          on every page of this site.
        </Lead>
      </PageHeader>

      <PageSection label="How we got here">
        <p className="type-body-lead text-text-primary">
          We started with traditional advertising and out-of-home. Revenue recovery came
          from watching too many businesses run good campaigns into broken funnels. Z Best
          Clips came from recognizing that the same evidence-first discipline belongs in
          short-form content, not just paid media.
        </p>
        <p className="type-headline">One team, one standard, applied everywhere we work.</p>
        <CtaRow>
          <ButtonLink href={ASSESSMENT_HREF}>Get an Assessment</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Talk to Us
          </ButtonLink>
        </CtaRow>
      </PageSection>
    </main>
  );
}
