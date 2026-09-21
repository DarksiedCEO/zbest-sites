import { ButtonLink, LedgerRule, pageMetadata } from "@zbest/ui";
import { CtaRow, FaqList, LedgerList, Lead, PageHeader, PageSection, RuledList } from "@/components/page";
import { ReadinessCheck } from "@/components/readiness-check";
import { VISIBILITY_GAP_LIBRARY } from "@/content/visibility-gaps";
import { SITE } from "@/lib/site";

/**
 * Search Intelligence (Brief §A4) — BUILT, NEVER LINKED.
 *
 * Reachable by direct URL only until the reveal (§8 item 9). It is absent from
 * nav, footer, lib/site.ts ROUTES (so sitemap.xml), robots.txt, and every
 * internal link, and it is noindex. The Phase 3 and Phase 4 gates check each
 * of those; do not add a link to this page from anywhere, including from this
 * page to itself.
 *
 * Its FAQ is deliberately NOT in content/faq.ts, so the site-level FAQ page
 * cannot aggregate it by accident (§A4: no Search Intelligence questions there).
 *
 * Phase 5, founder decision 11 (Backend Spec v0.4 §12): the free check is the
 * AI Visibility Readiness Check — rule-based, one prioritized visibility gap, no
 * claim about what any engine says. Its Visibility Gap Library is published
 * below (§12.4, certified copy). The brief's "Free AI Visibility Check" and its
 * promise to show "whether and how your business currently shows up…" are
 * retired permanently, and the gate fails any page carrying them (§12.8, C3).
 * The check itself is not built yet (build step 2), so no button names it;
 * Talk to Us leads until it exists.
 */
export const metadata = pageMetadata(SITE, {
  title: "Search Intelligence",
  description:
    "Ranked isn’t the same as cited. AEO/GEO work across ChatGPT, Claude, Gemini, Perplexity, and Google’s AI Overviews.",
  path: "/search-intelligence",
  index: false,
  ogImage: "/search-intelligence/opengraph-image",
});

const TIERS = [
  { name: "Entry", price: "$2,000/mo" },
  { name: "Growth", price: "$4,500/mo" },
  { name: "Full Department", price: "$7,500/mo" },
];

const PRICING_ROWS: { label: string; cells: [string, string, string] }[] = [
  {
    label: "Engine coverage",
    cells: [
      "Core engines (ChatGPT, Google AI Overviews, Perplexity)",
      "Full coverage across all named platforms",
      "Full coverage, priority monitoring cadence",
    ],
  },
  {
    label: "Content & fixes",
    cells: [
      "Monitoring + foundational fixes",
      "Active ongoing content production against gaps",
      "Full production cadence, faster turnaround",
    ],
  },
  {
    label: "Competitor tracking",
    cells: ["A handful, manually set", "Full auto-expanding competitor set", "Same, deeper benchmarking"],
  },
  {
    label: "Revenue attribution",
    cells: ["Not included", "Included", "Included, higher-frequency reporting"],
  },
];

const FAQ_ITEMS = [
  {
    question: "What’s AEO/GEO/LLMO?",
    answer:
      "Answer Engine, Generative Engine, and Large Language Model Optimization — making sure AI systems can find, correctly understand, and cite your business when someone asks them a relevant question.",
  },
  {
    question: "How is this different from traditional SEO?",
    answer:
      "Traditional SEO gets you ranked on a results page. This gets you cited inside an AI’s actual answer — a newer discipline with its own measurement problems, which is why every number carries a confidence band instead of a bare figure.",
  },
  {
    question: "What’s a “confidence band,” and why does every number have one?",
    answer:
      "AI search volume and attribution data is directional, not exact — even the field’s own tools admit this. We’d rather tell you honestly how sure we are than hand you a precise-looking number that isn’t.",
  },
  {
    question: "How do you know AI visibility work is actually driving revenue?",
    answer:
      "We correlate upstream signals — a spike in AI conversation mentions, a new citation landing — against your actual conversion data in the days after, and flag what’s AI-attributable with a confidence score.",
  },
  {
    question: "Do you guarantee rankings or citations?",
    answer:
      "No — nobody honestly can; the field’s own citation-consistency numbers are unreliable run to run. What we guarantee is that every claim is evidenced and every fix is measurable.",
  },
  {
    question: "What happens when an AI says something wrong about my business?",
    answer:
      "We catch it and route the correction into content that fixes the actual source, so it compounds instead of piling up as a to-do list.",
  },
  {
    question: "What platforms do you cover?",
    answer:
      "ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, Grok, Google AI Overviews, Google AI Mode, plus traditional local and map search.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Three published tiers — Entry at $2,000/month, Growth at $4,500/month, Full Department at $7,500/month — scaling by engine coverage, content cadence, and whether revenue attribution is included. Above that, scope is custom.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.",
  },
  {
    question: "Is this a new offering?",
    answer:
      "Yes — early accounts are onboarded founder-led while the methodology proves itself in the field, the same way every other discipline on this site started.",
  },
];

export default function SearchIntelligencePage() {
  return (
    <main>
      <PageHeader label="Search Intelligence" title="Ranked isn’t the same as cited.">
        <Lead>
          Google&rsquo;s answer boxes, ChatGPT, Claude, Gemini, and Perplexity are
          increasingly answering your customers&rsquo; questions directly — with zero
          clicks to anyone&rsquo;s website. If you&rsquo;re not the source an AI cites,
          you don&rsquo;t exist to that customer, no matter how well you rank on a results
          page nobody scrolls anymore.
        </Lead>
        <CtaRow>
          <ButtonLink href="/contact">Talk to Us</ButtonLink>
        </CtaRow>
      </PageHeader>

      <PageSection label="What’s included">
        <RuledList
          items={[
            "Continuous backlink crawl with authority and toxicity scored together — one ledger with a keep/watch/disavow flag",
            "AI crawler access management — sitemap and llms.txt treated as one job, verified so they never contradict each other",
            "Coverage across ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, Grok, and Google’s AI Overviews and AI Mode",
            "Conversation-chain tracking, not just first-prompt visibility",
            "Exact citation tracing, plus a Mentioned-Not-Cited flag most tools don’t track as its own category",
            "Competitor visibility that expands itself automatically as new competitors show up in your AI answers",
            "Every finding paired with the fix — a caught hallucination or content gap goes straight into a production queue, not a dashboard you have to staff yourself",
            "Revenue attribution with an honest confidence band",
          ]}
        />
      </PageSection>

      <PageSection label="Managed, not metered" title="Not a dashboard you operate. A department that does the work.">
        <p className="type-body-lead text-text-secondary">
          Most tools in this category are self-serve — you pay by the prompt, the seat, or
          the engine, and your own team turns findings into fixes. Search Intelligence is
          managed end to end: we find it and we fix it. That&rsquo;s why pricing is scoped
          to outcome, not metered by usage.
        </p>
      </PageSection>

      <PageSection
        id="pricing"
        label="How pricing works"
        intro={
          <p className="type-body-lead text-text-secondary">
            Full-service AEO/GEO work, not a self-serve monitoring tool. Below $2,000/month
            in this category is almost always rebranded SEO.
          </p>
        }
      >
        {/* Desktop: a real table, tiers across. */}
        <div className="hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-text-secondary/45">
                <th scope="col" className="type-label w-[22%] py-ledger pr-4 font-normal text-text-secondary">
                  <span className="sr-only">Feature</span>
                </th>
                {TIERS.map((t) => (
                  <th key={t.name} scope="col" className="py-ledger pr-4 align-bottom font-normal">
                    <span className="type-title block">{t.name}</span>
                    <span className="type-mono block text-accent">{t.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICING_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-text-secondary/20 last:border-text-secondary/45">
                  <th scope="row" className="type-label py-ledger pr-4 align-top font-normal text-text-secondary">
                    {row.label}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="type-small py-ledger pr-4 align-top text-text-primary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 390: one ledger per tier, so no table scrolls sideways. */}
        <div className="flex flex-col gap-stack md:hidden">
          {TIERS.map((t, i) => (
            <div key={t.name}>
              <LedgerRule emphasis />
              <p className="type-title mt-4">{t.name}</p>
              <p className="type-mono text-accent">{t.price}</p>
              <dl className="mt-3">
                {PRICING_ROWS.map((row) => (
                  <div key={row.label} className="border-t border-text-secondary/20 py-3">
                    <dt className="type-label text-text-secondary">{row.label}</dt>
                    <dd className="type-small mt-1 text-text-primary">{row.cells[i]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="type-body text-text-secondary">
          Above $7,500/month, scope is custom — contact us for a proposal.
        </p>
      </PageSection>

      {/*
        §12.4: the Visibility Gap Library, certified copy. Replaces the retired
        "Free AI Visibility Check" section and its promise (§12.1, §12.8 C3).
      */}
      <PageSection
        id="visibility-gaps"
        label={VISIBILITY_GAP_LIBRARY.title}
        intro={<Lead>{VISIBILITY_GAP_LIBRARY.intro}</Lead>}
      >
        <LedgerList
          items={VISIBILITY_GAP_LIBRARY.gaps.map((gap) => ({
            title: gap.name,
            body: gap.description,
            facts: [{ label: "Fix direction", value: gap.fix }],
          }))}
        />
      </PageSection>

      {/*
        §12: the AI Visibility Readiness Check (build step 2). It sits directly
        under the library it derives from, so a respondent reads what the eight
        gaps are before rating themselves against them.

        §12.1 governs every word here: this is a readiness check on signals the
        respondent reports, never a measurement of what an engine says. The
        retired promise and the retired name cannot return — the C3 gate fails
        any rendered page carrying them.
      */}
      <PageSection
        id="readiness-check"
        label="AI Visibility Readiness Check"
        title="Eight questions. One prioritized gap to fix first."
        intro={
          <Lead>
            Rate eight readiness signals. The check returns one prioritized gap, based on what you
            tell us — never on what any AI engine says.
          </Lead>
        }
      >
        <ReadinessCheck />
      </PageSection>

      <PageSection label="Who this is for">
        <p className="type-body-lead text-text-primary">
          Businesses that need to be found — and represented accurately — in AI-generated
          answers, not just a traditional results page.
        </p>
        <CtaRow>
          <ButtonLink href="/contact">Talk to Us</ButtonLink>
        </CtaRow>
      </PageSection>

      <PageSection id="faq" label="FAQ">
        <FaqList items={FAQ_ITEMS} />
      </PageSection>
    </main>
  );
}
