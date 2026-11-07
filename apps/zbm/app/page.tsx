import { ButtonLink, HeroMedia, LedgerRule, MediaFrame, pageMetadata, Showpiece, StoryImage, type AssetId } from "@zbest/ui";
import { bigShoulders } from "@zbest/ui/fonts/zbm-home";
import Link from "next/link";
import type { ReactNode } from "react";
import { BizPicker, HomeLine, SearchQuery } from "@/components/home-line";
import { CtaRow, LedgerList, Note } from "@/components/page";
import { BUSINESSES, STORIES, type BizId, type BizStory } from "@/content/home-line";
import { WHERE_REVENUE_LEAKS } from "@/content/revenue-recovery";
import { SERVICES } from "@/content/services";
import { ASSESSMENT_HREF, SITE } from "@/lib/site";
import "./home-line.css";

export const metadata = pageMetadata(SITE, { path: "/" });

/**
 * Home: "Audit + Line" (founder direction 2026-11-07, homepage only).
 *
 * One amber line is one customer. The visitor picks a kind of business and
 * follows that customer through every service's own stop, from the poster on
 * the drive to the booking. The line breaks at the leak and Revenue Recovery
 * stitches it back. Prototype: ~/WebstormProjects/zbm-wow-concepts/b-the-line.
 *
 * The live audit of the visitor's own site (the "Audit" half) is NOT built here.
 * It waits on founder approval of docs/proposals/spec-13-site-audit-DRAFT.md
 * (CLAUDE.md: no API built against a guessed contract).
 *
 * Kept from the certified home (Phase 4 ZBM at 831ad39 and later rulings):
 *   - H1 "Advertising you can audit." and "Start a Project" leading the hero.
 *   - Every service links to its page; Z Best Clips says "dozens", never "hundreds".
 *   - The six leaks, the decision-10 assessment CTA, its promise line and its
 *     privacy note, verbatim.
 *   - How we work: Assess, Audit, Fix, Scale, verbatim, with its story image.
 *   - No founding year, no outcome figures, no counter.
 * Retired with the old layout (founder to ratify in the PR): the hero stat
 * block ("Platforms we plan across", "Standard") and the reel showpiece.
 */

const svc = (slug: string) => {
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
};

/** Shown only while the matching business is picked (CSS: [data-biz] + [data-for]). */
function For({ biz, children, className = "" }: { biz: readonly BizId[]; children: ReactNode; className?: string }) {
  return (
    <div data-for={biz.join(" ")} className={className}>
      {children}
    </div>
  );
}

/** One story line, rendered for every business; CSS shows the picked one. */
function Story({ k }: { k: keyof BizStory }) {
  return (
    <>
      {BUSINESSES.map((b) => (
        <span key={b.id} data-for={b.id}>
          {STORIES[b.id][k]}
        </span>
      ))}
    </>
  );
}

/** A stop heading that links to the service page. */
function ServiceHeading({ slug, id, size = "" }: { slug: string; id: string; size?: string }) {
  const s = svc(slug);
  return (
    <h2 className={`hl-svc ${size}`} id={id}>
      <Link href={s.href} {...(s.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
        {s.name}
      </Link>
    </h2>
  );
}

function Summary({ slug }: { slug: string }) {
  const s = svc(slug);
  return (
    <p className="hl-we">
      {s.summary}{" "}
      <Link href={s.href} className="hl-more" {...(s.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
        More on {s.name}
        <span aria-hidden="true">{s.external ? " ↗" : " →"}</span>
      </Link>
    </p>
  );
}

const WIDE = "(min-width: 1280px) 640px, (min-width: 900px) 50vw, calc(100vw - 5rem)";
const NARROW = "(min-width: 900px) 380px, calc(100vw - 5rem)";

function Concept({ asset, sizes = WIDE, frame = "plate" }: { asset: AssetId; sizes?: string; frame?: "plate" | "poster" | "billboard" }) {
  return <MediaFrame asset={asset} frame={frame} sizes={sizes} badge="full" />;
}

function Node({ n, side, hollow = false }: { n?: number; side: "l" | "r"; hollow?: boolean }) {
  return (
    <span className={`hl-node hl-node-${side}${hollow ? " is-hollow" : ""}`} data-node aria-hidden="true">
      {n ?? ""}
    </span>
  );
}

export default function HomePage() {
  return (
    <main className={`hl ${bigShoulders.variable}`} data-home-line>
      <Showpiece name="zbm-home-line" label="One customer, from the first ad they notice to the booking">
        <HomeLine>
          {/* Hero. The line starts here. */}
          <header className="hl-stop hl-hero l" data-stop>
            <div className="hl-wrap">
              <Node side="l" />
              <div className="hl-inner hl-hero-grid">
                <div className="hl-stack">
                  <h1 className="hl-h1">Advertising you can audit.</h1>
                  <p className="hl-sub">This line is one of your customers. Pick your business and follow them from the first ad they notice to the moment they book.</p>
                  <CtaRow>
                    <ButtonLink href="/start">Start a Project</ButtonLink>
                  </CtaRow>
                  <BizPicker options={BUSINESSES} />
                </div>
                {/* Swap for founder's 2026 5D photo when it exists. */}
                <HeroMedia asset="radio-problem-commute" frame="plate" sizes="(min-width: 1280px) 620px, (min-width: 900px) 48vw, calc(100vw - 5rem)" />
              </div>
            </div>
          </header>

          {/* 1. Out-of-Home: billboard scale */}
          <section className="hl-stop l hl-ooh" data-stop aria-labelledby="hl-h-ooh">
            <div className="hl-wrap">
              <Node n={1} side="l" />
              <div className="hl-inner hl-split">
                <div className="hl-stack">
                  <ServiceHeading slug="out-of-home" id="hl-h-ooh" />
                  <p className="hl-moment"><Story k="ooh" /></p>
                  <Summary slug="out-of-home" />
                </div>
                <div className="hl-grow">
                  <For biz={["auto"]}><Concept asset="quellmont-cover" sizes={NARROW} frame="poster" /></For>
                  <For biz={["medspa"]}><Concept asset="marenvale-room" sizes={NARROW} frame="poster" /></For>
                  <For biz={["law"]}><Concept asset="ironhold-billboard" frame="billboard" /></For>
                  <For biz={["restaurant"]}><Concept asset="saltgrove-transit" sizes={NARROW} frame="poster" /></For>
                  <For biz={["artist"]}><Concept asset="ivosolace-stage" sizes={NARROW} frame="poster" /></For>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Radio & Audio: the words are the picture */}
          <section className="hl-stop r hl-radio" data-stop aria-labelledby="hl-h-radio">
            <div className="hl-wrap">
              <Node n={2} side="r" />
              <div className="hl-inner hl-split">
                <div className="hl-stack">
                  <ServiceHeading slug="radio-audio" id="hl-h-radio" size="is-sm" />
                  <p className="hl-heard"><Story k="heard" /></p>
                  <div className="hl-wave" aria-hidden="true">
                    {Array.from({ length: 56 }, (_, i) => (
                      <i key={i} style={{ ["--h" as string]: 22 + Math.round(78 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43))), ["--d" as string]: ((i * 37) % 100) / 100 }} />
                    ))}
                  </div>
                  <p className="hl-moment"><Story k="radio" /></p>
                  <Summary slug="radio-audio" />
                </div>
                <div>
                  <For biz={["auto", "medspa", "law"]}><StoryImage asset="radio-result-car" /></For>
                  <For biz={["restaurant"]}><Concept asset="saltgrove-radio" /></For>
                  <For biz={["artist"]}><StoryImage asset="radio-work-studio" /></For>
                </div>
              </div>
            </div>
          </section>

          {/* 3. TV & Streaming: the screen */}
          <section className="hl-stop l hl-tv" data-stop aria-labelledby="hl-h-tv">
            <div className="hl-wrap">
              <Node n={3} side="l" />
              <div className="hl-inner">
                <div className="hl-row">
                  <ServiceHeading slug="tv-streaming" id="hl-h-tv" />
                  <div className="hl-stack">
                    <p className="hl-moment"><Story k="tv" /></p>
                    <Summary slug="tv-streaming" />
                  </div>
                </div>
                <div className="hl-screen">
                  <For biz={["auto"]}><Concept asset="quellmont-tv-keys" /></For>
                  <For biz={["medspa", "law", "restaurant", "artist"]}><StoryImage asset="tv-result-watching" /></For>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Social Media: the feed */}
          <section className="hl-stop r hl-social" data-stop aria-labelledby="hl-h-social">
            <div className="hl-wrap">
              <Node n={4} side="r" />
              <div className="hl-inner hl-split is-media-first">
                <div>
                  <For biz={["auto"]}><Concept asset="quellmont-feed-sticker" sizes={NARROW} /></For>
                  <For biz={["medspa"]}><Concept asset="marenvale-social" sizes={NARROW} /></For>
                  <For biz={["law"]}><StoryImage asset="social-work-calendar" /></For>
                  <For biz={["restaurant", "artist"]}><StoryImage asset="social-result-engaged" /></For>
                </div>
                <div className="hl-stack">
                  <ServiceHeading slug="social-media" id="hl-h-social" />
                  <p className="hl-moment"><Story k="social" /></p>
                  <Summary slug="social-media" />
                </div>
              </div>
            </div>
          </section>

          {/* 5. Creators, and Z Best Clips beside them */}
          <section className="hl-stop l hl-creator" data-stop aria-labelledby="hl-h-creator">
            <div className="hl-wrap">
              <Node n={5} side="l" />
              <div className="hl-inner">
                <div className="hl-pair-heads">
                  <div className="hl-stack">
                    <ServiceHeading slug="influencer-marketing" id="hl-h-creator" size="is-md" />
                    <p className="hl-moment"><Story k="creator" /></p>
                    <Summary slug="influencer-marketing" />
                  </div>
                  <div className="hl-stack">
                    <h3 className="hl-svc is-sm">
                      <Link href={svc("z-best-clips").href} rel="noopener noreferrer" target="_blank">Z Best Clips</Link>
                    </h3>
                    <p className="hl-label">Our sister brand</p>
                    <p className="hl-we"><Story k="clip" /></p>
                    <Summary slug="z-best-clips" />
                  </div>
                </div>
                <div className="hl-pair">
                  <div>
                    <For biz={["auto", "restaurant", "artist"]}><StoryImage asset="influencer-work-filming" /></For>
                    <For biz={["medspa"]}><Concept asset="marenvale-influencer" sizes={NARROW} /></For>
                    <For biz={["law"]}><StoryImage asset="influencer-work-brief" /></For>
                  </div>
                  <div className="hl-pair-b">
                    <Concept asset="zbc-clipper-phone" sizes={NARROW} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Creative & Production: backstage */}
          <section className="hl-stop r hl-creative" data-stop aria-labelledby="hl-h-creative">
            <div className="hl-band">
              <div className="hl-wrap">
                <Node n={6} side="r" />
                <div className="hl-inner hl-split">
                  <div className="hl-stack">
                    <ServiceHeading slug="creative-production" id="hl-h-creative" size="is-md" />
                    <p className="hl-moment">Every poster, spot, post and clip this customer saw was written, shot and cut by one team.</p>
                    <Summary slug="creative-production" />
                  </div>
                  <div className="hl-strip">
                    <For biz={["auto", "medspa", "law", "artist"]}><StoryImage asset="creative-work-storyboard" /></For>
                    <For biz={["restaurant"]}><Concept asset="saltgrove-brand-system" /></For>
                    <StoryImage asset="creative-work-shoot" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Digital Advertising: the search */}
          <section className="hl-stop l hl-digital" data-stop aria-labelledby="hl-h-digital">
            <div className="hl-wrap">
              <Node n={7} side="l" />
              <div className="hl-inner">
                <ServiceHeading slug="digital-advertising" id="hl-h-digital" />
                <SearchQuery queries={Object.fromEntries(BUSINESSES.map((b) => [b.id, STORIES[b.id].query])) as Record<BizId, string>} />
                <div className="hl-split">
                  <div className="hl-stack">
                    <p className="hl-moment"><Story k="search" /></p>
                    <Summary slug="digital-advertising" />
                  </div>
                  <StoryImage asset="da-work-campaign" />
                </div>
              </div>
            </div>
          </section>

          {/* 8. Websites & Landing Pages: the page */}
          <section className="hl-stop r hl-web" data-stop aria-labelledby="hl-h-web">
            <div className="hl-wrap">
              <Node n={8} side="r" />
              <div className="hl-inner">
                <div className="hl-row">
                  <ServiceHeading slug="websites" id="hl-h-web" />
                  <p className="hl-moment"><Story k="web" /></p>
                </div>
                <div className="hl-grow hl-web-media">
                  <For biz={["auto", "law", "restaurant", "artist"]}><StoryImage asset="web-work-wireframes" /></For>
                  <For biz={["medspa"]}><Concept asset="marenvale-website" /></For>
                </div>
                <Summary slug="websites" />
              </div>
            </div>
          </section>

          {/* 9. The leak: the line breaks here */}
          <section className="hl-stop l hl-leak" data-stop data-leak aria-labelledby="hl-h-leak">
            <div className="hl-wrap">
              <Node n={9} side="l" />
              <div className="hl-inner hl-split">
                <div className="hl-stack">
                  <p className="hl-tag">Where it broke <b><Story k="leakKind" /></b></p>
                  <h2 className="hl-leak-h" id="hl-h-leak"><Story k="leakTitle" /></h2>
                  <p className="hl-moment"><Story k="leak" /></p>
                  <p className="hl-we">Every stop before this one worked. The customer was ready. The ads did their job. The money was lost after the click.</p>
                </div>
                <div data-leak-figure>
                  <For biz={["auto"]}><StoryImage asset="rr-no-follow-up" /></For>
                  <For biz={["medspa"]}><StoryImage asset="rr-broken-form" /></For>
                  <For biz={["law", "restaurant"]}><StoryImage asset="rr-missed-call" /></For>
                  <For biz={["artist"]}><StoryImage asset="rr-slow-page" /></For>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Revenue Recovery: the stitch. Carries the decision-10 assessment CTA. */}
          <section id="revenue-recovery" className="hl-stop r hl-rr" data-stop data-stitch aria-labelledby="hl-h-rr">
            <div className="hl-wrap">
              <Node n={10} side="r" />
              <div className="hl-inner hl-split">
                <div className="hl-stack">
                  <ServiceHeading slug="revenue-recovery" id="hl-h-rr" />
                  <p className="hl-moment">{svc("revenue-recovery").summary}</p>
                  <StoryImage asset="rr-leak-report" />
                  <LedgerList numbered items={WHERE_REVENUE_LEAKS.map((title) => ({ title }))} />
                </div>
                <div className="hl-stack hl-rr-side">
                  <article className="hl-finding" aria-labelledby="hl-h-finding">
                    <h3 id="hl-h-finding">Example finding</h3>
                    <p className="hl-f"><Story k="finding" /></p>
                    <dl>
                      <dt>Priority</dt><dd>High</dd>
                      <dt>Confidence</dt><dd><Story k="confidence" /></dd>
                      <dt>Fix</dt><dd><Story k="fix" /></dd>
                    </dl>
                  </article>
                  <p className="hl-we">Every finding carries a priority and a confidence label, so you know what we tested and what we only suspect.</p>
                  {/*
                    Founder decision 10 (docs/TOOLING.md): the free assessment returns one
                    prioritized leak. Copy verbatim from the certified home.
                  */}
                  <div className="flex flex-col gap-4">
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
                </div>
              </div>
            </div>
          </section>

          {/* 11. Booked */}
          <section className="hl-stop r hl-booked" data-stop aria-labelledby="hl-h-booked">
            <div className="hl-wrap">
              <Node n={11} side="r" />
              <div className="hl-inner hl-split">
                <div className="hl-stack">
                  <h2 className="hl-booked-h" id="hl-h-booked">Booked.</h2>
                  <p className="hl-moment"><Story k="booked" /></p>
                </div>
                <StoryImage asset="da-result-lead" />
              </div>
            </div>
          </section>

          {/* How we work: one process, verbatim from the certified home. */}
          <section id="how-we-work" className="hl-stop l hl-how" data-stop aria-labelledby="hl-h-how">
            <div className="hl-wrap">
              <Node side="l" hollow />
              <div className="hl-inner">
                <p className="type-label text-text-secondary">How we work</p>
                <h2 className="hl-svc is-sm" id="hl-h-how">Audit first. Evidence. Then scale.</h2>
                <div className="hl-how-grid">
                  <StoryImage asset="home-how-we-work" />
                  <ol className="hl-how-steps">
                    {[
                      ["Assess", "A free look at where you’re likely losing revenue."],
                      ["Audit", "A paid, full diagnostic. Every finding comes with a priority and a confidence label."],
                      ["Fix", "Conversion repaired before a dollar more goes into spend."],
                      ["Scale", "Once it’s proven, we run the media: digital, TV, radio, out-of-home, social, clips."],
                    ].map(([step, body]) => (
                      <li key={step} className="flex flex-col">
                        <LedgerRule emphasis />
                        <h3 className="type-title mt-3">{step}</h3>
                        <p className="type-body mt-2 text-text-secondary">{body}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="hl-we hl-founder">
                  Z Best Media is a full-service advertising agency in Los Angeles. Our founder worked at CBS Outdoor (now OUTFRONT Media) from 2012 to 2015.
                </p>
              </div>
            </div>
          </section>

          {/* Close: the line runs into the button. */}
          <section className="hl-stop l hl-close" data-stop aria-labelledby="hl-h-close">
            <div className="hl-wrap">
              <Node side="l" hollow />
              <div className="hl-inner">
                <h2 className="hl-close-h" id="hl-h-close">Tell us what&rsquo;s actually going on.</h2>
                <div className="hl-close-ctas">
                  <span data-line-end>
                    <ButtonLink href="/start">Start a Project</ButtonLink>
                  </span>
                  <ButtonLink href={ASSESSMENT_HREF} variant="secondary">
                    Get an Assessment
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        </HomeLine>
      </Showpiece>
    </main>
  );
}

