import { ButtonLink, pageMetadata } from "@zbest/ui";
import { CtaRow, LedgerList, PageHeader, PageSection } from "@/components/page";
import { LeadForm } from "@/components/lead-form";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Launch a Campaign",
  description:
    "Tell us what you have. We’ll tell you what it can become. A real conversation, a scoped campaign, a plan you approve, then verified reporting.",
  path: "/launch-a-campaign",
  ogImage: "/launch-a-campaign/opengraph-image",
});

/**
 * Launch a Campaign (Brief §B4). Copy verbatim. The footer's "Contact" lands
 * here too (§B3).
 *
 * The honesty note must stay on this page (§B4, root PRODUCT.md) — the gate
 * asserts it word for word. The form posts to the no-delivery stub.
 */
export default function LaunchACampaignPage() {
  return (
    <main>
      <PageHeader label="Launch a Campaign" title="Tell us what you have. We’ll tell you what it can become." />

      <PageSection id="what-happens" label="What happens when you reach out">
        <LedgerList
          numbered
          items={[
            { title: "A real conversation", body: "what you’re promoting, who you’re trying to reach, what success looks like" },
            { title: "We scope the campaign around your goal", body: "Entertainment or Brands, rented or owned distribution, budget and target" },
            { title: "You approve the plan", body: "guidelines, platforms, target locked before any clip is cut" },
            { title: "We launch and report", body: "verified views, approved posts, platform breakdown, visible while the campaign runs" },
          ]}
        />
      </PageSection>

      <PageSection id="honesty" label="Honesty note">
        <blockquote data-honesty-note className="border-l-2 border-accent pl-6">
          <p className="type-body-lead italic text-text-primary">
            Z Best Clips is a new operation built on proven mechanics — the same clipping and
            distribution model driving results industry-wide. We&rsquo;re building our own
            case studies now, one campaign at a time, and we&rsquo;d rather be straight with
            you about that than pretend otherwise.
          </p>
        </blockquote>
      </PageSection>

      <PageSection id="start" label="Two ways to start">
        <div className="grid gap-stack md:grid-cols-2 md:gap-x-10">
          <div>
            <p className="type-title">&ldquo;I have something to promote right now&rdquo;</p>
            <div className="mt-4">
              <CtaRow>
                <ButtonLink href="#campaign-form">Use the form below</ButtonLink>
              </CtaRow>
            </div>
          </div>
          <div>
            <p className="type-title">&ldquo;I&rsquo;m not sure yet&rdquo;</p>
            <div className="mt-4">
              <CtaRow>
                <ButtonLink href="/" variant="secondary">
                  See How It Works
                </ButtonLink>
              </CtaRow>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection id="campaign-form" label="Launch a Campaign">
        <div className="max-w-2xl">
          <LeadForm form="campaign" submitLabel="Launch a Campaign" />
        </div>
      </PageSection>
    </main>
  );
}
