import { ProcessDiagram } from "@zbest/ui";
import { DiagnosticIllustration, type DiagnosticKind } from "@/components/diagnostic-illustration";
import Link from "next/link";
import { ButtonLink, LedgerRule, pageMetadata, StoryImage, type StoryAssetId } from "@zbest/ui";
import {
  Body,
  CtaRow,
  FaqList,
  LedgerList,
  Lead,
  Note,
  PageHeader,
  PageSection,
} from "@/components/page";
import { AssessmentForm } from "@/components/assessment-form";
import { LeakLedger } from "@/components/leak-ledger";
import { REVENUE_RECOVERY_FAQ } from "@/content/faq";
import {
  AUDIT_DELIVERABLE,
  DEFINITION,
  ENGAGEMENTS,
  INDUSTRY_PATTERNS,
  LEAK_LIBRARY,
  WHERE_REVENUE_LEAKS,
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
 * The leak library through How Engagements Work: carried over from the live
 * page, filtered, then revised Sep 17 by founder ruling — the Method and the
 * traditional-agency comparison are removed, so this page has no "Why us"
 * section and one process, not two (see content/revenue-recovery.ts for what
 * was left out, what was rewritten, and why).
 * FAQ: §A4. "How does the process start?" was held in Phase 4 for its
 * 60-second answer; Phase 5 restored it, rewritten around founder decision 10.
 * FD-VISUAL-01 §10 (rollout batch 4): the hero carries the six leaks as a
 * code-drawn sample leak report (components/leak-ledger.tsx) — no numbers.
 * The §5 scroll-marked leak report with its traffic line stays post-launch.
 * Assessment: the free assessment itself runs in #assessment (Backend Spec
 * v0.3 §11) — see components/assessment-form.tsx.
 */
export default function RevenueRecoveryPage() {
  return (
    <main>
      <PageHeader
        label="Revenue Recovery"
        title="Find out where your revenue is going."
        aside={
          <StoryImage asset="rr-missed-call" hero />
        }
      >
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

      <PageSection label="Where revenue leaks" media={<LeakLedger leaks={WHERE_REVENUE_LEAKS} />}>
        <ol className="space-y-8">
          {WHERE_REVENUE_LEAKS.map((title, i) => {
            // Keyed by leak, not position: each image must show the leak it sits
            // under (RTS-5: no image of a leak the paid analysis doesn't check).
            const images: Partial<Record<string, StoryAssetId>> = {
              "Follow-up that dies after one touch": "rr-no-follow-up",
              "Ad traffic landing on the wrong page": "rr-wrong-page",
            };
            const image = images[title];
            return <li key={title} className="border-t border-text-secondary/30 pt-5">
              <h3 className="type-title mb-4"><span className="type-mono text-accent mr-3">{String(i + 1).padStart(2, "0")}</span>{title}</h3>
              {image ? <StoryImage asset={image} /> : null}
            </li>;
          })}
        </ol>
      </PageSection>

      <PageSection id="leak-library" label={LEAK_LIBRARY.title} intro={<Lead>{LEAK_LIBRARY.intro}</Lead>}>
        <LedgerList items={LEAK_LIBRARY.leaks.map((item, i) => ({ ...item, media: <DiagnosticIllustration kind={(["traffic", "conversion", "reviews", "offer", "followup", "tracking", "creative", "listings"] as DiagnosticKind[])[i]!} /> }))} />
      </PageSection>

      <PageSection label={INDUSTRY_PATTERNS.title} intro={<Lead>{INDUSTRY_PATTERNS.intro}</Lead>}>
        <LedgerList items={INDUSTRY_PATTERNS.patterns.map((item, i) => ({ ...item, media: <DiagnosticIllustration kind={(["followup", "offer", "reviews", "conversion", "answers", "tracking"] as DiagnosticKind[])[i]!} /> }))} />
      </PageSection>

      <PageSection
        media={<StoryImage asset="rr-leak-report" />}
        id="audit"
        band
        label={AUDIT_DELIVERABLE.label}
        title={AUDIT_DELIVERABLE.title}
        intro={<Lead>{AUDIT_DELIVERABLE.intro}</Lead>}
      >
        <LedgerList items={AUDIT_DELIVERABLE.parts} />
      </PageSection>

      <PageSection media={<ProcessDiagram title="Engagement phases" steps={["Assessment", "Audit", "Implementation", "Program"]} />} label={ENGAGEMENTS.label} title={ENGAGEMENTS.title} intro={<Lead>{ENGAGEMENTS.intro}</Lead>}>
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

      <PageSection id="faq" label="FAQ" media={<DiagnosticIllustration kind="answers" />}>
        <FaqList items={REVENUE_RECOVERY_FAQ} />
      </PageSection>

      {/*
        Every "Get an Assessment" CTA on the site lands here (founder decision, Phase 4).
        Phase 5: the assessment runs here — Backend Spec v0.3 §11, founder decision 10.
        One prioritized leak, rule-based, no dollar figure. Title changed from
        "Request your free assessment.", which stopped being true once the
        assessment ran on the page instead of being requested.
      */}
      <PageSection
        id="assessment" media={<ProcessDiagram title="Assessment" steps={["Your answers", "One prioritized leak", "Follow-up"]} />}
        label="Get an Assessment"
        title="Get your free assessment."
        intro={
          <Note>
            Free. We save your answers and contact details so we can follow up with you. See
            our{" "}
            <Link href="/legal/privacy-policy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </Note>
        }
      >
        <div className="max-w-3xl">
          <AssessmentForm illustrations={{ tracking: <DiagnosticIllustration kind="tracking" /> }} />
        </div>
      </PageSection>
    </main>
  );
}
