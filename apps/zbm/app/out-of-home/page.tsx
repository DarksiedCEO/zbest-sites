import { ButtonLink, pageMetadata } from "@zbest/ui";
import { Cite, CtaRow, FaqList, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { OUT_OF_HOME_FAQ } from "@/content/faq";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Out-of-Home",
  description:
    "Billboards, transit displays, and physical placements, planned across Lamar, Clear Channel, OUTFRONT, and regional operators.",
  path: "/out-of-home",
  ogImage: "/out-of-home/opengraph-image",
});

/**
 * Out-of-Home (Brief §A4). Copy verbatim, except "Why it still works", where
 * the build note governs: cite each figure inline to its source, and drop any
 * figure whose source cannot be located. Verified 2026-09-16:
 *
 *   KEPT  $9.46B, 19th consecutive quarter, digital over a third (36.3%) —
 *         OAAA release, Mar 17 2026.
 *   KEPT  Kantar five-year study: OOH outperforms digital and CTV on ad
 *         awareness, brand favorability and purchase intent — Clear Channel
 *         Outdoor release, Jul 8 2025.
 *   DROPPED  "OAAA/Harris Poll research found 61% of consumers view OOH ads
 *         more favorably than any other advertising medium." No OAAA or Harris
 *         Poll primary source for it was found. The nearest traceable figure is
 *         a different study (OAAA/Morning Consult, 2023), measures favorable
 *         views of billboards rather than a ranking against other media, and
 *         could not be confirmed in that study's own document.
 */
export default function OutOfHomePage() {
  return (
    <main>
      <PageHeader label="Out-of-Home" title="Presence you can’t scroll past.">
        <Lead>
          Billboards, transit displays, and physical placements that put your brand in
          front of people as they move through their day — no ad blocker, no skip
          button, no algorithm deciding whether it&rsquo;s shown.
        </Lead>
        <Lead>
          We&rsquo;re not tied to one operator&rsquo;s inventory. We plan across
          Lamar, Clear Channel, OUTFRONT, and regional operators to find the strongest fit
          for your market and budget.
        </Lead>
        <CtaRow>
          <ButtonLink href="/contact">Talk to Us</ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection id="why-it-works" label="Why it still works">
        <p className="type-body-lead text-text-primary">
          U.S. Out-of-Home revenue hit{" "}
          <span className="type-mono">$9.46 billion</span> in 2025, its nineteenth
          consecutive quarter of growth, with digital placements now driving over a
          third of that spend.
          <Cite href="https://oaaa.org/news/out-of-home-advertising-revenue-reaches-record-9-46-billion/">
            OAAA, Mar 2026
          </Cite>
        </p>
        <p className="type-body-lead text-text-primary">
          A five-year Kantar/Clear Channel study found OOH consistently outperforms
          digital and CTV on ad awareness, brand favorability, and purchase intent.
          <Cite href="https://clearchanneloutdoor.com/company-news/new-kantar-study-shows-out-of-home-advertising-outperforms-key-channels-and-addresses-gaps-in-modern-marketing-strategies/">
            Clear Channel Outdoor &amp; Kantar, Jul 2025
          </Cite>
        </p>
      </PageSection>

      <PageSection label="What’s included">
        <RuledList
          items={[
            "Placement strategy — billboards, transit, other formats selected for where your audience lives, works, travels",
            "Static and digital placements — traditional bulletins and posters alongside digital billboards and programmatic-eligible screens",
            "Cross-operator sourcing — the right board, not the operator we happen to know",
            "Creative built for the format — simple messaging, bold visuals, one clear call to action",
            "Campaign timing guidance — static needs 8–12 weeks to build frequency; digital allows shorter test rotations",
          ]}
        />
      </PageSection>

      <PageSection label="Pricing">
        <p className="type-body-lead text-text-primary">
          Scoped individually by market, location, placement type, duration.
        </p>
      </PageSection>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">
          Home services, med spas, legal and professional services, automotive,
          multi-location brands.
        </p>
        <CtaRow>
          <ButtonLink href="/contact">Talk to Us</ButtonLink>
        </CtaRow>
      </PageSection>

      <PageSection id="faq" label="FAQ">
        <FaqList items={OUT_OF_HOME_FAQ} />
      </PageSection>
    </main>
  );
}
