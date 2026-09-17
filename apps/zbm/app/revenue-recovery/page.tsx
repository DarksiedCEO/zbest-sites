import { ButtonLink, LedgerRule, pageMetadata } from "@zbest/ui";
import {
  Body,
  CtaRow,
  FaqList,
  FixtureNote,
  LedgerList,
  Lead,
  PageHeader,
  PageSection,
} from "@/components/page";
import { LeadForm } from "@/components/lead-form";
import { REVENUE_RECOVERY_FAQ } from "@/content/faq";
import {
  AUDIT_DELIVERABLE,
  COMPARISON,
  DEFINITION,
  ENGAGEMENTS,
  INDUSTRY_PATTERNS,
  LEAK_LIBRARY,
  METHOD,
} from "@/content/revenue-recovery";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, {
  title: "Revenue Recovery",
  description:
    "An audit-first approach that finds where your existing traffic and campaigns are losing conversions, fixes those leaks, then scales what’s proven to work.",
  path: "/revenue-recovery",
  ogImage: "/revenue-recovery/opengraph-image",
});

/**
 * Revenue Recovery (Brief §A4).
 *
 * Header and leak taxonomy: the brief's own Revenue Recovery copy (Home §3),
 * added because §A4 says to add the taxonomy if the live page lacks it — the
 * live page has a leak LIBRARY but not this taxonomy.
 * Everything from the Method to How Engagements Work: carried over verbatim
 * from the live page, filtered (see content/revenue-recovery.ts for what was
 * left out and why).
 * FAQ: §A4, with the founder-held 60-second answer omitted.
 */
export default function RevenueRecoveryPage() {
  return (
    <main>
      <PageHeader label="Revenue Recovery" title="Find out where your revenue is going.">
        <Lead>
          Most businesses aren&rsquo;t short on traffic. They&rsquo;re losing the traffic
          they already paid for — at the phone, the form, the follow-up. We audit first,
          show you the leak with real numbers, fix it, then scale what&rsquo;s proven.
        </Lead>
        <Body>{DEFINITION}</Body>
        <div className="flex flex-col gap-4">
          <CtaRow>
            <ButtonLink href="#assessment">Get an Assessment</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Talk to Us
            </ButtonLink>
          </CtaRow>
        </div>
      </PageHeader>

      <PageSection label="Where revenue leaks">
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
      </PageSection>

      <PageSection id="method" label="The Method" title={METHOD.name} intro={<Lead>{METHOD.tagline}</Lead>}>
        <LedgerList numbered items={METHOD.steps} />
      </PageSection>

      <PageSection id="leak-library" label={LEAK_LIBRARY.title} intro={<Lead>{LEAK_LIBRARY.intro}</Lead>}>
        <LedgerList items={LEAK_LIBRARY.leaks} />
      </PageSection>

      <PageSection label={INDUSTRY_PATTERNS.title} intro={<Lead>{INDUSTRY_PATTERNS.intro}</Lead>}>
        <LedgerList items={INDUSTRY_PATTERNS.patterns} />
      </PageSection>

      <PageSection
        id="audit"
        band
        label={AUDIT_DELIVERABLE.label}
        title={AUDIT_DELIVERABLE.title}
        intro={<Lead>{AUDIT_DELIVERABLE.intro}</Lead>}
      >
        <LedgerList items={AUDIT_DELIVERABLE.parts} />
      </PageSection>

      <PageSection label="Why us">
        <div className="grid gap-stack md:grid-cols-2 md:gap-x-10">
          {[COMPARISON.traditional, COMPARISON.recovery].map((side, i) => (
            <div key={side.label}>
              <p className={`type-label ${i === 1 ? "text-accent" : "text-text-secondary"}`}>{side.label}</p>
              <h3 className="type-title mt-2">{side.title}</h3>
              <ul className="mt-5">
                {side.points.map((point, j) => (
                  <li key={point}>
                    <LedgerRule emphasis={j === 0} />
                    <p className={`type-body py-3 ${i === 1 ? "text-text-primary" : "text-text-secondary"}`}>
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
              <LedgerRule emphasis />
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection label={ENGAGEMENTS.label} title={ENGAGEMENTS.title} intro={<Lead>{ENGAGEMENTS.intro}</Lead>}>
        <ol className="grid gap-x-8 sm:grid-cols-2">
          {ENGAGEMENTS.phases.map((phase) => (
            <li key={phase.title} className="flex flex-col">
              <LedgerRule emphasis />
              <p className="type-label mt-4 text-accent">{phase.body}</p>
              <h3 className="type-title mt-2">{phase.title}</h3>
              {phase.detail ? (
                <p className="type-body mt-2 text-text-secondary">{phase.detail}</p>
              ) : null}
              <div className="pb-stack" />
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="faq" label="FAQ">
        <FaqList items={REVENUE_RECOVERY_FAQ} />
      </PageSection>

      {/* Every "Get an Assessment" CTA on the site lands here (founder decision, Phase 4). */}
      <PageSection
        id="assessment"
        label="Get an Assessment"
        title="Tell us what’s actually going on."
        intro={
          <FixtureNote>
            Fixture — the automated assessment is not live yet. This form requests an
            assessment instead.
          </FixtureNote>
        }
      >
        <div className="max-w-2xl">
          <LeadForm form="assessment" submitLabel="Get an Assessment" />
        </div>
      </PageSection>
    </main>
  );
}
