import { ButtonLink, LedgerRule, pageMetadata, ScrollScrub, StatBlock } from "@zbest/ui";
import { CtaRow, FixtureNote, LedgerList, Lead, PageSection } from "@/components/page";
import { ASSESSMENT_HREF, SITE, ZBC_ORIGIN } from "@/lib/site";

export const metadata = pageMetadata(SITE, { path: "/" });

/**
 * Home — agency-first, five sections (Brief §A4 Home, locked Sep 13). Copy is
 * verbatim from the brief with one founder hold, marked below.
 *
 * Revenue Recovery gets the featured section, but the page leads with the
 * agency and its four disciplines; it must not read as a single-service shop.
 */
export default function HomePage() {
  return (
    <main>
      {/* Section 1 — Hero: claim left, stat block right; claim-then-stats at 390. */}
      <header className="mx-auto max-w-[90rem] px-gutter pt-section lg:px-gutter-wide lg:pt-section-lg">
        <div className="grid gap-stack lg:grid-cols-12 lg:gap-x-10">
          <ScrollScrub className="lg:col-span-7">
            <h1 className="type-display max-w-[11ch]">Advertising you can audit.</h1>
            <p className="type-body-lead mt-stack text-text-secondary">
              Digital advertising, out-of-home, revenue recovery, and creator-powered
              content — run to one standard: find what&rsquo;s actually working, prove
              it with real numbers, then scale it.
            </p>
            <div className="mt-stack">
              <CtaRow>
                <ButtonLink href={ASSESSMENT_HREF}>Get an Assessment</ButtonLink>
                <ButtonLink href="#what-we-do" variant="secondary">
                  See What We Do
                </ButtonLink>
              </CtaRow>
            </div>
          </ScrollScrub>

          {/*
            Non-outcome facts only until a verified recovered-revenue figure
            exists (§A4, §6.3). When one does, it replaces the top row and the
            Counter ticks it up once — the Counter is deliberately not used here.
          */}
          <div className="lg:col-span-5 lg:pt-4">
            <StatBlock
              rows={[
                { label: "Est.", value: "2011 · Los Angeles" },
                { label: "Disciplines", value: "4" },
                {
                  label: "Platforms bought across",
                  value: "Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT",
                },
                { label: "Standard", value: "Audit first. Evidence. Then scale." },
              ]}
            />
          </div>
        </div>
      </header>

      {/* Section 2 — Four disciplines, each linking to its page. */}
      <PageSection id="what-we-do" label="What we do" title="One team. Four ways to be seen.">
        <LedgerList
          items={[
            {
              title: "Digital Advertising",
              href: "/digital-advertising",
              body: "Paid social, search, and platform campaigns that bring the traffic.",
            },
            {
              title: "Revenue Recovery",
              href: "/revenue-recovery",
              body: "The audit that finds where that traffic leaks — and fixes it before you spend more.",
            },
            {
              title: "Out-of-Home",
              href: "/out-of-home",
              body: "Billboards, transit, and physical placements. Presence you can’t scroll past.",
            },
            {
              title: "Z Best Clips",
              href: ZBC_ORIGIN,
              external: true,
              body: "Creator-powered short-form distribution. One source, hundreds of clips, real reach.",
            },
          ]}
        />
      </PageSection>

      {/* Section 3 — Revenue Recovery, featured. */}
      <PageSection
        id="revenue-recovery"
        band
        label="Revenue Recovery"
        title="Find out where your revenue is going."
        intro={
          <Lead>
            Most businesses aren&rsquo;t short on traffic. They&rsquo;re losing the
            traffic they already paid for — at the phone, the form, the follow-up. We
            audit first, show you the leak with real numbers, fix it, then scale
            what&rsquo;s proven.
          </Lead>
        }
      >
        <LedgerList
          numbered
          items={[
            { title: "Missed and unreturned calls" },
            { title: "Forms that break on mobile" },
            { title: "Follow-up that dies after one touch" },
            { title: "Pages that load too slowly to convert" },
            { title: "Ad traffic landing on the wrong page" },
            { title: "No retargeting on the people who almost bought" },
          ]}
        />
        <div className="flex flex-col gap-4">
          {/*
            FOUNDER HOLD (Phase 4): §A4's CTA reads "Get your free assessment —
            one quantified leak, in about 60 seconds." That promises what the
            assessment returns, which is the undecided Phase 5 question, so the
            label is "Get a free assessment" until that decision is made.
          */}
          <CtaRow>
            <ButtonLink href={ASSESSMENT_HREF}>Get a free assessment</ButtonLink>
          </CtaRow>
          <FixtureNote>
            Fixture — the automated assessment is not live yet. This opens the
            assessment request form.
          </FixtureNote>
        </div>
      </PageSection>

      {/* Section 4 — How we work. No case study cards until real ones exist. */}
      <PageSection id="how-we-work" label="How we work" title="Audit first. Evidence. Then scale.">
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Assess", "a free look at where you’re likely losing revenue."],
            ["Audit", "a paid, full diagnostic. Every finding comes with a number."],
            ["Fix", "conversion repaired before a dollar more goes into spend."],
            ["Scale", "once it’s proven, we run the media: digital, out-of-home, clips."],
          ].map(([step, body], i) => (
            <li key={step} className="flex flex-col">
              <LedgerRule emphasis />
              <p className="type-mono mt-4 text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="type-title mt-2">{step}</h3>
              <p className="type-body mt-2 pb-stack text-text-secondary">{body}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      {/* Section 5 — Closing CTA. */}
      <section className="mx-auto max-w-[90rem] px-gutter lg:px-gutter-wide mt-section lg:mt-section-lg">
        <LedgerRule emphasis />
        <div className="flex flex-col gap-stack pt-section lg:flex-row lg:items-end lg:justify-between">
          <h2 className="type-display max-w-[14ch]">Tell us what&rsquo;s actually going on.</h2>
          <CtaRow>
            <ButtonLink href={ASSESSMENT_HREF}>Get an Assessment</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Talk to Us
            </ButtonLink>
          </CtaRow>
        </div>
      </section>
    </main>
  );
}
