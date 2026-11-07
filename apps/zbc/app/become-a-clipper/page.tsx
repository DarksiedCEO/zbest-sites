import { ProcessDiagram } from "@zbest/ui";
import { ButtonLink, StoryImage, Card, HeroMedia, pageMetadata } from "@zbest/ui";
import { CtaRow, FixtureNote, LedgerList, PageHeader, PageSection } from "@/components/page";
import { NotAccepting } from "@/components/not-accepting";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Become a Clipper",
  description:
    "Turn footage into income. No experience required, no follower minimum. Paid on approved posts and verified views, with rates disclosed per campaign.",
  path: "/become-a-clipper",
  ogImage: "/become-a-clipper/opengraph-image",
});

/**
 * Become a Clipper (Brief §B4). Copy verbatim.
 *
 * The ONLY page carrying clipper payout figures (§9: clipper-facing pricing is
 * transparent here and never crosses onto buyer-facing pages).
 *
 * "Browse Active Campaigns": until a real campaign exists it leads to the
 * waitlist section. Red team RTS-1: while ZBC's Privacy Policy is unpublished
 * that section collects nothing — a not-accepting message and an email
 * address instead of the §6.1 form (components/not-accepting.tsx).
 *
 * FD-VISUAL-01 §10: the hero carries the clipper's side of the work — a phone
 * on a desk with a vertical-video edit on its timeline. Clipper-side only; no
 * buyer pricing (§5).
 */
export default function BecomeAClipperPage() {
  return (
    <main id="main">
      <PageHeader
        label="Become a Clipper"
        title="Turn footage into income. No experience required, no follower minimum."
        aside={
          <HeroMedia
            asset="zbc-clipper-phone"
            frame="plate"
            className="mx-auto w-full max-w-[26rem]"
            sizes="(min-width: 1024px) 416px, calc(100vw - 2.5rem)"
          />
        }
      >
        <div className="flex flex-col gap-4">
          <CtaRow>
            <ButtonLink href="#waitlist">Browse Active Campaigns</ButtonLink>
          </CtaRow>
          <FixtureNote>
            No campaigns are open yet.
          </FixtureNote>
        </div>
      </PageHeader>

      <PageSection id="how-it-works" media={<ProcessDiagram title="Clipper workflow" steps={["Join a campaign", "Get source material", "Cut and post", "Submit for review", "Approved payouts"]} />} label="How it works">
        <LedgerList
          numbered
          items={[
            { title: "Join a campaign" },
            { title: "Get the source material", body: "approved footage, clear brief" },
            { title: "Cut and post", body: "your hook, your account" },
            { title: "Submit for review" },
            { title: "Get paid on approved posts and verified views" },
          ]}
        />
      </PageSection>

      <PageSection id="payouts" media={<StoryImage asset="zbc-clipper-paid" />} label="Payouts" title="Two kinds of campaigns, two kinds of payout.">
        <div className="grid gap-5 md:grid-cols-2">
          <Card accent data-focus="entertainment" eyebrow="Your account" title="Entertainment campaigns">
            <p className="type-body text-text-primary">
              Run through your own account. Paid per 1,000 verified views at the disclosed
              rate. Every clip builds a following that&rsquo;s yours to keep.
            </p>
          </Card>
          <Card accent data-focus="brands" eyebrow="The client’s account" title="Brand campaigns">
            <p className="type-body text-text-primary">
              Post to the client&rsquo;s account instead of yours. Because there&rsquo;s no
              audience upside, pay is structured differently: a flat fee for every approved
              post, plus a performance bonus on top — a set rate per 1,000 verified views.
            </p>
          </Card>
        </div>
        <p data-starting-rates className="type-body-lead italic text-text-secondary">
          Starting rates we expect for the first campaigns (opening range):{" "}
          <span className="type-mono not-italic text-text-primary">$50–100</span> flat fee per
          approved post,{" "}
          <span className="type-mono not-italic text-text-primary">$3–5</span> per 1,000 verified
          views bonus. Rates are set per campaign when campaigns open, and each campaign states
          its rates before you join it — this is not a promise of earnings. Disclosed per
          campaign, not buried in fine print.
        </p>
      </PageSection>

      {/* RTS-6, AEGIS F5: the FTC disclosure rule — in the clip itself, plus the platform label and #ad. */}
      <PageSection id="disclosure" label="Disclosing paid posts" title="Every paid clip says it’s paid.">
        <p data-disclosure-rule className="type-body-lead max-w-prose text-text-primary">
          A clip you post for a campaign is a paid endorsement, so it has to say so in the clip
          itself — on screen, and out loud too if you speak in it — for example &ldquo;Ad&rdquo; or
          &ldquo;Paid partnership with&rdquo; and the brand&rsquo;s name. On top of that, turn on
          the platform&rsquo;s paid-partnership label (&ldquo;Paid partnership&rdquo; on TikTok
          and Instagram, &ldquo;Includes paid promotion&rdquo; on YouTube) and put #ad near the
          start of the caption. The platform label alone isn&rsquo;t enough. This is what the
          FTC&rsquo;s Endorsement Guides (16 CFR Part 255) and its guidance for social media
          influencers call for, and every campaign brief will repeat it.
        </p>
      </PageSection>

      <PageSection
        id="waitlist"
        label="Browse Active Campaigns"
        title="The first campaigns aren’t open yet."
      >
        <div className="max-w-2xl">
          <NotAccepting>We’ll publish how to join, and the terms clippers work under, before the first campaign opens.</NotAccepting>
        </div>
      </PageSection>
    </main>
  );
}
