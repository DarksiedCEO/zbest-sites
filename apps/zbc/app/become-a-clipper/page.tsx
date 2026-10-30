import { ButtonLink, Card, pageMetadata } from "@zbest/ui";
import { CtaRow, FixtureNote, LedgerList, PageHeader, PageSection } from "@/components/page";
import { LeadForm } from "@/components/lead-form";
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
 * "Browse Active Campaigns": until a real campaign exists it opens the clipper
 * waitlist form (§6.1) with the label §B4 supplies. Labeled as a fixture, and
 * the form posts to the §6.2 lead route.
 */
export default function BecomeAClipperPage() {
  return (
    <main>
      <PageHeader
        label="Become a Clipper"
        title="Turn footage into income. No experience required, no follower minimum."
      >
        <div className="flex flex-col gap-4">
          <CtaRow>
            <ButtonLink href="#waitlist">Browse Active Campaigns</ButtonLink>
          </CtaRow>
          <FixtureNote>
            No campaigns are open yet — this opens the clipper waitlist.
          </FixtureNote>
        </div>
      </PageHeader>

      <PageSection id="how-it-works" label="How it works">
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

      <PageSection id="payouts" label="Payouts" title="Two kinds of campaigns, two kinds of payout.">
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
              audience upside, pay is structured differently: a guaranteed flat fee for every
              approved post, plus a performance bonus on top — a set rate per 1,000 verified
              views.
            </p>
          </Card>
        </div>
        <p data-starting-rates className="type-body-lead italic text-text-secondary">
          Starting rates (opening range):{" "}
          <span className="type-mono not-italic text-text-primary">$50–100</span> guaranteed
          flat fee per approved post,{" "}
          <span className="type-mono not-italic text-text-primary">$3–5</span> per 1,000 views
          bonus — subject to adjustment as real campaigns establish what&rsquo;s sustainable.
          Disclosed per campaign, not buried in fine print.
        </p>
      </PageSection>

      <PageSection
        id="waitlist"
        label="Browse Active Campaigns"
        title="Join the clipper list — we’ll notify you when the first campaigns open."
      >
        <div className="max-w-2xl">
          <LeadForm form="clipper" submitLabel="Join the clipper list" />
        </div>
      </PageSection>
    </main>
  );
}
