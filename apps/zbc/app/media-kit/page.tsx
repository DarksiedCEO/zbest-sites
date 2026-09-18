import { pageMetadata, StatBlock } from "@zbest/ui";
import { FixtureNote, Lead, PageHeader, PageSection } from "@/components/page";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Media Kit",
  description:
    "Z Best Clips press kit: boilerplate, company facts, brand assets, and press contact.",
  path: "/media-kit",
  ogImage: "/media-kit/opengraph-image",
});

/**
 * Media Kit (Brief §B4, locked Sep 13). Copy verbatim.
 *
 * Brand assets: the download pack waits for the final wordmark, so the page
 * reads "Assets available on request." exactly as §B4 says.
 * Press contact: press@zbestclips.com does not exist yet (§B4 build note). It
 * is shown as plain text, not a mailto link, and labeled a placeholder
 * (carry-over approved by the founder, Phase 4). Create the alias or replace it
 * before launch.
 */
export default function MediaKitPage() {
  return (
    <main>
      <PageHeader label="Media Kit" title="Z Best Clips — press kit." />

      <PageSection id="boilerplate" label="Boilerplate">
        <div className="flex flex-col gap-3">
          <p className="type-label text-text-secondary">Short</p>
          <Lead>
            Z Best Clips is a clipping and short-form distribution agency, by Z Best Media. It
            turns one piece of long-form content into dozens of short-form clips posted across
            TikTok, Instagram Reels, and YouTube Shorts by an independent creator network, with
            every post reviewed before it counts and nothing billed before the client approves it.
          </Lead>
        </div>
        <div className="flex flex-col gap-3">
          <p className="type-label text-text-secondary">Long</p>
          <Lead>
            Z Best Clips is the creator-powered distribution arm of Z Best Media, a Los Angeles
            advertising agency. It runs two campaign models: rented distribution
            for entertainment — music, film, streaming, sports, podcasts — where clips post from
            the creator network&rsquo;s own accounts to reach new audiences; and owned
            distribution for brands — auto dealerships, med spas, local businesses — where clips
            post to the client&rsquo;s own accounts to build a compounding local following.
            Every submission is reviewed by a person before it counts, and clients pay only for
            approved posts with verified views.
          </Lead>
        </div>
      </PageSection>

      <PageSection id="facts" label="Company facts">
        <StatBlock
          rows={[
            { label: "Parent", value: "Z Best Media, Los Angeles" },
            { label: "Launched", value: "2026" },
            { label: "Models", value: "Rented distribution (Entertainment) · Owned distribution (Brands)" },
            { label: "Platforms", value: "TikTok · Instagram Reels · YouTube Shorts" },
            { label: "Payout basis", value: "Per 1,000 verified views; brand campaigns add a guaranteed per-post fee" },
          ]}
        />
      </PageSection>

      <PageSection id="assets" label="Brand assets">
        <p className="type-body-lead text-text-primary">Assets available on request.</p>
      </PageSection>

      <PageSection id="press" label="Press contact">
        <p className="type-mono text-text-primary" data-placeholder>
          press@zbestclips.com
        </p>
        <FixtureNote>Placeholder — this mailbox does not exist yet.</FixtureNote>
      </PageSection>

      <PageSection id="policy" label="What we can and can’t say">
        <p className="type-body-lead text-text-primary">
          We&rsquo;ll talk about the model, the review process, and how payouts work. We
          won&rsquo;t share client names, campaign numbers, or creator identities without
          their written permission, and we don&rsquo;t publish unverified results.
        </p>
      </PageSection>
    </main>
  );
}
