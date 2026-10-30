import { ButtonLink, Card, Counter, IllustrativeBadge, pageMetadata } from "@zbest/ui";
import { CtaRow, LedgerList, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { Timeline } from "@/components/timeline";
import { NAV_CTA, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  path: "/",
  description:
    "One piece of long-form content, cut into dozens of distinct short-form videos and posted across TikTok, Instagram Reels, and YouTube Shorts from real, independent accounts.",
});

/**
 * How It Works (Brief §B4) — served at "/" (founder decision, Phase 4);
 * /how-it-works redirects here. Copy verbatim.
 *
 * Mixed page: both models appear, so <main> carries NO data-page-focus; each
 * model card and example card is scoped with data-focus instead (§B1).
 */
const EXAMPLES = [
  { title: "Independent single release", focus: "entertainment", views: 1_240_000, clips: 84, platforms: "TikTok · Reels · Shorts" },
  { title: "Auto dealership showroom series", focus: "brands", views: 340_000, clips: 46, platforms: "TikTok · Reels" },
  { title: "Med spa treatment-room series", focus: "brands", views: 215_000, clips: 38, platforms: "Reels · Shorts" },
] as const;

export default function HowItWorksPage() {
  return (
    <main id="main">
      <PageHeader
        label="How It Works"
        title="One source. Dozens of clips. Real reach."
        aside={
          <div className="flex flex-col gap-stack lg:pt-24">
            <Lead>
              You hand us one piece of long-form content — a song, a stream highlight, a
              showroom walkaround, a treatment-room story. Our clipper network cuts it into
              dozens of distinct short-form videos, each with a different hook, pace, and
              caption, then posts them across TikTok, Instagram Reels, and YouTube Shorts
              from real, independent accounts.
            </Lead>
            <CtaRow>
              <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
            </CtaRow>
          </div>
        }
      />

      {/* Section 2 — The Process, on the timeline/scrubber device. */}
      <section id="process" className="mx-auto mt-section max-w-[90rem] scroll-mt-24 px-gutter lg:mt-section-lg lg:px-gutter-wide">
        <p className="type-label text-text-secondary">The Process</p>
        <div className="mt-stack">
          <Timeline
            steps={[
              {
                title: "Set the Campaign",
                body: "Source material, platforms, guidelines, target reviewed and locked before launch. Brand safety and disclosure rules set up front.",
              },
              {
                title: "Clippers Create and Post",
                body: "Independent creators turn source material into varied clips from their own accounts.",
              },
              {
                title: "Every Submission Reviewed",
                body: "Nothing counts until a human reviews it against guidelines. Rule-breaking posts rejected and never billed.",
              },
              {
                title: "Verified Reporting",
                body: "Approved posts, verified views, platform breakdown, visible while the campaign runs.",
              },
            ]}
          />
        </div>
        {/* Step 1's levers, set out as rows beneath the track rather than crammed into its column. */}
        <div className="mt-stack lg:ml-[calc(25%+0.5rem)]">
          <p className="type-label text-accent">Step 01 — Levers</p>
          <div className="mt-4">
            <LedgerList
              items={[
                { title: "Reward rate", body: "per 1,000 verified views" },
                { title: "Minimum payout threshold", body: "floor so only clips clearing real view counts enter review" },
                { title: "Maximum payout cap", body: "protects budget from one viral clip consuming the pool" },
                { title: "Optional flat fee bonus", body: "stacks on top, useful for launch campaigns with no track record yet" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Section 3 — two models, each in its own focus color. */}
      <PageSection id="models" label="One Model Doesn’t Fit Every Campaign">
        <div className="grid gap-5 md:grid-cols-2">
          <Card accent data-focus="entertainment" eyebrow="Rented Distribution" title="Entertainment">
            <p className="type-small text-text-secondary">Music, Film, Sports, Streamers, Podcasts</p>
            <p className="type-body mt-4 text-text-primary">
              Content posts through the clipper network&rsquo;s own accounts. Goal: discovery,
              reaching strangers who&rsquo;ve never heard of you. When the campaign ends, you
              keep the view totals and case study — the accounts and followers stay with the
              clippers.
            </p>
          </Card>
          <Card accent data-focus="brands" eyebrow="Owned Distribution" title="Brands">
            <p className="type-small text-text-secondary">Auto Dealerships, Med Spas, Local Businesses</p>
            <p className="type-body mt-4 text-text-primary">
              Content posts to accounts the business controls. Goal: compounding local reach.
              When the campaign ends, the following, library, and audience relationship are
              yours to keep.
            </p>
          </Card>
        </div>
      </PageSection>

      {/* Section 4 — What's included. */}
      <PageSection label="What’s Included">
        <RuledList
          items={[
            "Campaign guidelines and brand safety review",
            "Clipper network distribution",
            "Submission review on every post",
            "Nothing billed before you approve the post",
            "TikTok/Reels/Shorts coverage",
            "Verified reporting",
            "Dedicated campaign contact",
          ]}
        />
      </PageSection>

      {/*
        Illustrative example cards (§B4): three, each badged, counters tick once
        on viewport entry. Swap for real results as campaigns land.
      */}
      <section id="examples" className="mx-auto mt-section max-w-[90rem] scroll-mt-24 px-gutter lg:mt-section-lg lg:px-gutter-wide">
        <p className="type-label text-text-secondary">Examples</p>
        <ul className="mt-stack grid gap-5 lg:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <li key={ex.title} data-example-card data-focus={ex.focus}>
              <Card accent className="flex h-full flex-col" eyebrow={ex.focus === "entertainment" ? "Entertainment" : "Brands"} title={ex.title}>
                <dl className="mt-3 flex flex-col gap-3">
                  <div>
                    <dt className="type-label text-text-secondary">Views</dt>
                    <dd className="type-stat mt-1 text-[clamp(2.25rem,4vw,3.25rem)]">
                      <Counter value={ex.views} />
                    </dd>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <dt className="type-label text-text-secondary">Clips</dt>
                      <dd className="type-stat mt-1">
                        <Counter value={ex.clips} />
                      </dd>
                    </div>
                    <div>
                      <dt className="type-label text-text-secondary">Platforms</dt>
                      <dd className="type-mono mt-2">{ex.platforms}</dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-auto pt-6">
                  <IllustrativeBadge />
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-stack">
          <CtaRow>
            <ButtonLink href={NAV_CTA.href}>Launch a Campaign</ButtonLink>
          </CtaRow>
        </div>
      </section>
    </main>
  );
}
