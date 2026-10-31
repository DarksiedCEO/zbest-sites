import { ButtonLink, LedgerRule, pageMetadata, ServicePreview, StatBlock } from "@zbest/ui";
import Link from "next/link";
import { HomeReel } from "@/components/home-reel";
import { CtaRow, LedgerList, Lead, Note, PageSection } from "@/components/page";
import { SERVICE_IMAGE } from "@/content/service-media";
import { SERVICES } from "@/content/services";
import { ASSESSMENT_HREF, SITE } from "@/lib/site";

export const metadata = pageMetadata(SITE, { path: "/" });

/**
 * Home — agency-first, five sections (Brief §A4 Home, locked Sep 13). Copy is
 * verbatim from the brief with one founder hold, marked below.
 *
 * Revenue Recovery gets the featured section, but the page leads with the
 * agency and everything it sells; it must not read as a single-service shop.
 *
 * AMENDED Oct 4, 2026 (docs/BRIEF-AMENDMENT-2026-10-04-full-service.md): the
 * hero subhead, the primary CTA ("Start a Project"), the services row of the
 * stat block, Section 2 (every service, from content/services.ts), the Scale
 * step and the closing CTA now cover the full-service catalog.
 */

export default function HomePage() {
  return (
    <main>
      {/*
        Section 1 — Hero, and the page's showpiece (FD-VISUAL-01 §5 "The reel"):
        the claim holds left while concept work assembles right. Claim first at 390.
      */}
      <header>
        <HomeReel
          hero={
            <>
              <h1 className="type-display max-w-[11ch] lg:text-[clamp(3.5rem,5.6vw,5.5rem)]">
                Advertising you can audit.
              </h1>
              <p className="type-body-lead mt-stack text-text-secondary">
                Digital, TV, radio, out-of-home, social, creative, websites, revenue
                recovery, and creator-powered content — run to one standard: find
                what&rsquo;s actually working, prove it with real numbers, then scale it.
              </p>
              <div className="mt-stack">
                <CtaRow>
                  <ButtonLink href="/start">Start a Project</ButtonLink>
                  <ButtonLink href="#what-we-do" variant="secondary">
                    See What We Do
                  </ButtonLink>
                </CtaRow>
              </div>
            </>
          }
        />

        {/*
          Non-outcome facts only until a verified recovered-revenue figure
          exists (§A4, §6.3). When one does, it becomes the top row and the
          Counter ticks it up once — the Counter is deliberately not used here.

          Founder ruling Sep 17: §A4's "Est. | 2011 · Los Angeles" row is
          removed and "Platforms bought across" is now "Platforms we plan
          across" — neither the founding year nor the media buys are
          literally true. Deliberate divergence from §A4:267/270, not drift.

          Founder copy ruling Oct 30, 2026: the "Services | 10" row is removed.

          FD-VISUAL-01: the reel took the hero's right column, so the stat
          block now closes the hero beneath it, under the reel's column.
        */}
        <div className="mx-auto mt-stack max-w-[90rem] px-gutter lg:grid lg:grid-cols-12 lg:gap-x-10 lg:px-gutter-wide">
          <StatBlock
            className="lg:col-span-7 lg:col-start-6"
            rows={[
              {
                label: "Platforms we plan across",
                value: "Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT",
              },
              { label: "Standard", value: "Audit first. Evidence. Then scale." },
            ]}
          />
        </div>
      </header>

      {/*
        Section 2 — Every service, each linking to its page (amended Oct 4, 2026).
        FD-VISUAL-01 §4.2: each row previews its lead image — beside the list on
        desktop (hover or focus), inline in the row on mobile.
      */}
      <section id="what-we-do" className="mx-auto mt-section max-w-[90rem] scroll-mt-24 px-gutter lg:mt-section-lg lg:px-gutter-wide">
        <LedgerRule emphasis />
        <div className="pt-stack">
          <p className="type-label text-text-secondary">What we do</p>
          <h2 className="type-headline mt-3">One team. Every way to be seen.</h2>
        </div>
        <div className="mt-stack">
          <ServicePreview
            items={SERVICES.map((s) => ({
              title: s.name,
              href: s.href,
              external: s.external,
              body: s.summary,
              asset: SERVICE_IMAGE[s.slug],
            }))}
          />
        </div>
        <div className="mt-stack">
          <CtaRow>
            <ButtonLink href="/services" variant="secondary">
              All Services
            </ButtonLink>
          </CtaRow>
        </div>
      </section>

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
            Founder decision 10 (docs/TOOLING.md): the free assessment returns one
            prioritized leak. §A4's "one quantified leak, in about 60 seconds" is
            retired permanently, not held. The promise sits in the line under the
            button rather than in the label, so the button stays short at 390.
          */}
          <CtaRow>
            <ButtonLink href={ASSESSMENT_HREF}>Get your free assessment</ButtonLink>
          </CtaRow>
          <p className="type-body text-text-secondary">
            One prioritized leak — the one we’d fix first — and what fixing it looks like.
          </p>
          <Note>
            Free. We save your answers and contact details so we can follow up with you. See
            our{" "}
            <Link href="/legal/privacy-policy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </Note>
        </div>
      </PageSection>

      {/* Section 4 — How we work. No case study cards until real ones exist. */}
      <PageSection id="how-we-work" label="How we work" title="Audit first. Evidence. Then scale.">
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Assess", "A free look at where you’re likely losing revenue."],
            ["Audit", "A paid, full diagnostic. Every finding comes with a priority and a confidence label."],
            ["Fix", "Conversion repaired before a dollar more goes into spend."],
            ["Scale", "Once it’s proven, we run the media: digital, TV, radio, out-of-home, social, clips."],
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
            <ButtonLink href="/start">Start a Project</ButtonLink>
            <ButtonLink href={ASSESSMENT_HREF} variant="secondary">
              Get an Assessment
            </ButtonLink>
          </CtaRow>
        </div>
      </section>
    </main>
  );
}
