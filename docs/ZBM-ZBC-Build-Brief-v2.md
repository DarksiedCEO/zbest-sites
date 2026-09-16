# Z Best Media & Z Best Clips — Build Brief v2

Locked reference for the frontend build — supersedes v1 (Sep 7, 2026)

September 13, 2026

# 0. Status and what changed from v1

**Status: LOCKED for implementation.** This document replaces the Sep 7 build brief. Everything below is final. The job from here is implementation in the phase order in Section 3, with Playwright verification and an AEGIS audit gate between phases.

**What v2 resolves that v1 left open** (decided Sep 13, 2026):

| Item | v1 state | v2 decision |
|---|---|---|
| Stack, repo, deploy | Not stated | Next.js on Vercel. One new monorepo, two apps, one shared UI package. Two Vercel projects, two domains. (§1) |
| ZBM homepage | “Retain current live hero” | Agency-first homepage, five sections. Revenue Recovery is the lead discipline, not the identity. (§A4 Home) |
| Frontend scope | Ambiguous | Marketing sites only. Dashboards (SEO client dashboard, ZBC campaign dashboard) are a later phase. (§1.3) |
| Work page (ZBM) | In nav, no copy | Removed from nav and footer until one named client exists. Route may exist unlinked. (§A2) |
| Blog / Revenue Intelligence Center | In footer, no content | Route built, not linked until the first post exists. (§A3) |
| 13 ZBC SEO landing pages | In footer, no copy | Not at launch. Footer collapses to Company / Resources / Legal. Written in batches post-launch. (§B3) |
| Media Kit (ZBC) | Direction only | Copy supplied. (§B4) |
| Form destinations | Not stated | One Next.js route handler → email via Resend + row in Vercel Postgres. No CRM at launch. (§6) |
| Interactive tools | Phase 4, undefined data source | Fixtures at launch, labeled; backend-driven later. (§6.3) |
| Logo / favicon | Missing | Typographic wordmark (Fraunces) at launch. Legacy flaming-Z / horse marks retired. (§7) |
| Illustrative card numbers | Not supplied | Supplied, labeled. (§B4 How It Works) |
| Cookie consent banner | Not in phase list | Phase 2 scaffolding. (§3) |
| Tool install commands | Not supplied | Supplied, source-checked Sep 13. (§2) |

Everything not listed here carries over from v1 unchanged.

# 1. Architecture, repo, deploy, scope

## 1.1 Stack

- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Hosting:** Vercel. Two Vercel projects, one per app, both deploying from the same repo.

- **Domains:** Z Best Media on its existing domain; Z Best Clips on **zbestclips.com** (own domain, not a ZBM subdomain — decided Sep 7).
- **Current live site:** the existing Vite/React SPA (Vercel project zbestmedia-ui) stays live and untouched until V2 replaces it by canary migration. Do not modify it. Do not delete it.

- **Fonts:** self-hosted via next/font (Fraunces, IBM Plex Sans, IBM Plex Mono, Bricolage Grotesque). No third-party font CDN calls at runtime.

## 1.2 Repository layout

One **new** monorepo (pnpm workspaces + Turborepo). This is *not* the ZBM V2 registry monorepo — that repo is governance YAML and a Python validator under a certification standard; the marketing sites do not belong under those CI gates yet. Link the two later once the registry has a live CI run.

```
zbest-sites/
  apps/
    zbm/            # Z Best Media — Next.js app
    zbc/            # Z Best Clips — Next.js app
  packages/
    ui/             # shared design system: tokens, fonts, primitives, sibling components
    config/         # shared eslint / tsconfig / tailwind preset
  e2e/              # Playwright — screenshot suites per app, desktop + mobile
  turbo.json
  pnpm-workspace.yaml
```

**Why one package for UI:** the two sites deliberately share IBM Plex Mono, the text colors, the ledger-rule divider, and the counter component. One source of truth or the design system drifts within a month.

**packages/ui owns:** color tokens for both brands (as CSS variables, brand-scoped), type scale, spacing scale, motion primitives (Motion.dev wrappers), LedgerRule, Counter, StatBlock, Nav, Footer, Card, FAQ, CookieConsent, IllustrativeBadge.

## 1.3 Scope of this build

**In scope:** the two public marketing sites, all pages listed in Parts A and B, forms, the cookie consent banner, legal page shells, Phase 4 interactive pieces on fixtures.

**Out of scope (later phases, do not build now):**

- SEO/AEO/GEO/LLMO client dashboard (has its own handoff spec; depends on backend DTOs that don’t exist yet and copy pending research).
- Z Best Clips campaign dashboard / clipper submission flow (depends on Backend Interface Spec v0.2, which is DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION).

- Any authentication, accounts, or logged-in surface.
- Any real payment, payout, or publication mechanics.

If a task appears to require any of the above, stop and flag it. Do not build against guessed DTOs.

# 2. Tool stack, roles, and installation

Six tools, one job each. Do not let them overlap.

| Tool | Role | Where it runs |
|---|---|---|
| **Motion.dev** | Animation/interaction primitives | npm package in packages/ui |
| **React Bits** | Pre-built animated components (backgrounds, text reveals) | npm / copy-paste into packages/ui |
| **Playwright** | QA — screenshot every phase, desktop + mobile, before proceeding | npm package in e2e/ |
| **Impeccable** | Anti-slop design enforcement (audit, polish, critique, animate) | Claude Code skill |
| **Taste Skill** | Design taste layer — typography, color, spacing, motion critique | Claude Code skill |
| **21st MCP** (formerly Magic MCP) | Component generation constrained to the locked design system | Claude Code MCP |

**AEGIS** is the audit gate between phases, not a pass at the end.

## 2.1 Install commands (source-checked Sep 13, 2026 — re-check before running, these tools move fast)

Run from the repo root after the monorepo exists.

**Impeccable**

```
npx impeccable install            # detects Claude Code, installs the skill + hooks
# then inside Claude Code:
/impeccable init                  # scans the repo, writes PRODUCT.md and DESIGN.md
```

Alternative: /plugin marketplace add pbakaus/impeccable inside Claude Code. Source: github.com/pbakaus/impeccable README.

**After /impeccable init:** open the generated DESIGN.md and paste in the tokens from §A1 and §B1 verbatim, plus the anti-references in §2.2. Impeccable routes its decisions from that file; without it, output drifts generic.

**Taste Skill**

The brief’s “Taste Skill (Design & Taste merged skill)” is taken to mean Leonxlnx/taste-skill, install name design-taste-frontend (v2). If a different skill was intended, substitute it here.

```
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Source: github.com/Leonxlnx/taste-skill README. Note its stated scope: landing pages, portfolios, redesigns — not dashboards. That matches this build exactly.

**21st MCP**

```
npx @21st-dev/cli@latest init --client claude
# API key: generate a fresh one at 21st.dev/mcp (old Magic keys were reset)
# key goes in the API_KEY_21ST environment variable
```

Alternative inside Claude Code: claude plugin marketplace add 21st-dev/magic-mcp then /plugin install 21st. Source: github.com/21st-dev/magic-mcp README. The 21st server is a plain HTTP MCP at https://21st.dev/api/mcp with header x-api-key.

**Motion.dev / React Bits / Playwright**

```
pnpm --filter @zbest/ui add motion
pnpm --filter @zbest/ui add react-bits          # or copy individual components from reactbits.dev
pnpm --filter e2e add -D @playwright/test && pnpm --filter e2e exec playwright install
```

**Verify before Phase 1 starts:** claude mcp list shows 21st; /impeccable and the taste skill both respond inside Claude Code; pnpm --filter e2e exec playwright test --list runs. Record the versions installed in docs/TOOLING.md. Do not start Phase 1 until all three skills respond.

## 2.2 Anti-references (paste into DESIGN.md)

Not this: Inter-on-dark SaaS; purple-to-blue gradients; cards nested in cards; rounded icon tiles above every heading; fade-and-slide-up on every section; hover effects on everything; hero with a floating dashboard mockup; “Trusted by” logo rows (there are none yet); custom cursors; 3D tilt cards.

Yes this: editorial typography with real scale contrast; ledger rules as structure; tabular numerals; asymmetric grids that resolve on mobile; one signature motion moment per page; restraint everywhere else.

# 3. Build phase order

Do not attempt this as one pass. Each phase: **build → Playwright screenshots (desktop 1440 + mobile 390) → AEGIS audit against this brief → proceed.** A phase is not complete without the screenshot artifacts committed under e2e/snapshots/<phase>/.

1. **Monorepo + tooling.** Workspace, both apps booting, packages/ui scaffolded, fonts loading, all six tools verified (§2.1). Deliverable: two blank pages rendering the correct base color and one line of Fraunces / Bricolage.
1. **Design system.** Tokens as CSS variables (brand-scoped), type scale, spacing, motion primitives, and the reusable pieces: LedgerRule, Counter (ticks once on viewport entry, respects prefers-reduced-motion), StatBlock, Nav (sticky, short menu, dropdown depth one layer down), Footer, Card, FAQ (accessible accordion), CookieConsent (reject-non-essential, CCPA/CPRA posture), IllustrativeBadge. Storybook or a /dev/system route to see them all. **Cookie consent banner is built here**, with placeholder policy text behind it.

1. **Shared scaffolding.** Both apps: nav, footer, legal page shells with clearly-marked placeholder text (§5), 404, sitemap/robots (respecting the Search Intelligence exclusion, §A4), metadata/OG defaults, the Entertainment/Brands color-coded system for ZBC.
1. **Page-by-page build.** Order: ZBM Home → Digital Advertising → Revenue Recovery → Out-of-Home → About → Contact → Search Intelligence (unlinked) → ZBC How It Works → Entertainment → Brands → Pricing → Become a Clipper → Launch a Campaign → About → Media Kit → FAQ. Screenshot each page at both viewports before starting the next.

1. **Interactive pieces last.** The recovered-revenue counter (ZBM), the view-count tickers (ZBC), the Contact / Launch / Clipper forms wired to the route handler (§6), and the two assessment tools on fixtures (§6.3).
1. **Launch checklist.** Lighthouse ≥ 90 on Performance/Accessibility/SEO both viewports; every illustrative element carries its badge; no real company names on ZBC (grep for them); Search Intelligence absent from nav, footer, sitemap, and internal links; certifications block hidden; legal pages show placeholder banners; forms deliver email end-to-end from the preview deployment.

# 4. Backend coordination

A separate backend is being built independently (ChatGPT). Backend Interface Spec v0.2 exists and is DRAFT_FOR_BACKEND_AND_FRONTEND_RECONCILIATION. Its Section 9 governs the frontend: typed adapter behind every API call, fixtures clearly labeled, enums never hard-coded into components, no real publication/funding/payout.

For this build the only backend touchpoints are the form route handler (§6) and, later, the two assessment tools. Nothing in the marketing sites should import backend entity shapes. If integration work on a dashboard is requested before a written, reconciled contract exists, flag it and stop.

# 5. Legal documents

Terms of Service, Privacy Policy, and Cookie Policy for both entities are scoped in ZBM-ZBC-Legal-Document-Brief.docx and require attorney review before publishing. Build the page shells now with a visible banner: **“Draft — pending attorney review. Not yet in effect.”** Do not present placeholder legal text as final. The cookie consent banner (Phase 2) links to the Cookie Policy shell.

# 6. Forms, data handling, and interactive tools

## 6.1 Forms in scope

| Form | App | Fields |
|---|---|---|
| Contact | ZBM | Name · Business · What are you looking to solve? · Best way to reach you |
| Get an Assessment | ZBM | Name · Business · Website · Best way to reach you |
| Launch a Campaign | ZBC | Name · Organization · What are you promoting? · Entertainment / Brands · Budget range (optional) · Best way to reach you |
| Become a Clipper (waitlist) | ZBC | Name · Email · Primary platform · Profile link (optional) |

## 6.2 Destination (single mechanism, both apps)

- One Next.js route handler per app (app/api/lead/route.ts), server-only.
- Validation with zod; reject on failure with a field-level error envelope.

- On success: (1) insert a row in **Vercel Postgres** (leads table: id, app, form, payload JSONB, created_at, ip_hash, user_agent), (2) send an email via **Resend** to the founder’s inbox with the payload.
- Spam control: honeypot field + rate limit per IP (Vercel KV or in-memory token bucket at the edge). No CAPTCHA at launch.

- Idempotency: client generates a submission_id (UUID) sent with the request; handler upserts on it so a double-click doesn’t create two leads.
- Secrets (RESEND_API_KEY, POSTGRES_URL) live in Vercel environment variables only. Never in the repo.

- No CRM at launch. When one is chosen, it hangs off the same handler.
- Failure mode: if the email send fails, the DB row is still written and the user still sees success; the failure is logged. If the DB write fails, return an error and do not claim success.

## 6.3 Interactive tools (Phase 5, fixtures at launch)

- **ZBM free leak assessment** (automated, on-page, returns one quantified leak — decided Aug 26). The current live tool’s input schema must be extracted before this is built; Backend Spec §10 lists it as open. Until then: build the UI against a fixture result and label it.
- **ZBM recovered-revenue counter (hero stat block):** there is no verified recovered-revenue figure yet. Until one exists, the hero stat block shows non-outcome facts (see §A4 Home). The counter component is built and tested in Phase 2 but not wired to a claim until a real number exists.

- **Search Intelligence free AI Visibility Check:** UI on fixtures, labeled, behind the unlinked page.
- **ZBC “Browse Active Campaigns”** CTA points to the clipper waitlist form until a real campaign exists.

# 7. Assets

- **Logo / favicon:** typographic wordmark set in Fraunces for Z Best Media; Bricolage Grotesque for Z Best Clips, with the endorsement line “by Z Best Media” in IBM Plex Sans. Rendered as SVG in packages/ui/brand/. The legacy flaming-Z masthead and horse mark are retired and must not appear. A drawn mark is a separate design job that does not block this build.
- **Photography / imagery:** none required at launch. The design system carries the pages. Do not use stock photography. Abstract ledger/instrument SVG illustrations may be generated in code if a section needs weight.

- **OG images:** generated per page with next/og from the page title on the brand base color.
- **Illustrative numbers:** supplied in §B4 How It Works. Anywhere else a number is needed and no real one exists, it carries the IllustrativeBadge.

# PART A — Z BEST MEDIA

## A1. Design tokens

**Color**

| Token | Value | Use |
|---|---|---|
| --zbm-base | #0E0F12 | page base |
| --zbm-panel | #16181D | panel / card surface |
| --zbm-accent | #C99A4B | primary accent — muted brass / ledger gold |
| --zbm-accent-2 | #4C8C88 | secondary accent — desaturated teal, data / charts |
| --text-primary | #EDEBE6 | primary text (shared with ZBC) |
| --text-secondary | #8B8F98 | secondary text (shared with ZBC) |

**Type:** Fraunces (headlines) · IBM Plex Sans (body) · IBM Plex Mono (all numbers and stats — font-variant-numeric: tabular-nums required, ledger alignment).

**Layout:** left-aligned, grid-driven. Hairline dividers act as literal ledger rules between data rows. Asymmetric hero — claim left, stat block right; stacks claim-then-stats on mobile.

**Signature motion:** one moment only — a counter that ticks up once when scrolled into view. No scattered hover effects, no fade-and-slide-up on every section. Scroll-scrubbed hero and monumental editorial typography are the two lead techniques (decided Aug 26); everything else is still.

**Mobile-first.** Build every page at 390 first, then widen.

**Vernacular:** financial audit, ledgers, measurement instruments. Every visual choice should read as “we show you evidence,” not generic SaaS.

## A2. Navigation

Digital Advertising · Revenue Recovery · Out-of-Home · Z Best Clips · About · Contact

Short top-level menu; depth one layer down (decided Sep 7). **Work is removed** until one named client exists (decided Sep 13; consistent with the Aug 26 finding that the portfolio is too thin). The /work route may exist unlinked.

## A3. Footer

| Services | Company | Resources | Legal |
|---|---|---|---|
| Digital Advertising | About | FAQ | Privacy Policy |
| Revenue Recovery | Contact |  | Terms of Service |
| Out-of-Home |  |  | Cookie Settings |
| Z Best Clips (→ zbestclips.com) |  |  |  |

Blog (Revenue Intelligence Center) is added to Resources when the first post exists. Work is added to Company when the first named client exists.

## A4. Page copy

### Home — agency-first (locked Sep 13)

Z Best Media is an advertising agency. Revenue Recovery is the discipline that drives early revenue, and it gets the featured section — but the page must not read as a single-service shop.

**Section 1 — Hero (claim left, stat block right)**

Headline: *Advertising you can audit.*

Subhead: Digital advertising, out-of-home, revenue recovery, and creator-powered content — run to one standard: find what’s actually working, prove it with real numbers, then scale it.

CTAs: Get an Assessment · See What We Do (anchor to Section 2)

Stat block (IBM Plex Mono, ledger rules between rows). Until a verified recovered-revenue figure exists, show non-outcome facts only — no illustrative outcome numbers in the hero:

| Est. | 2011 · Los Angeles |
|---|---|
| Disciplines | 4 |
| Platforms bought across | Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT |
| Standard | Audit first. Evidence. Then scale. |

When a real recovered-revenue number exists, it replaces the top row and the counter ticks it up once.

**Section 2 — Four disciplines (ledger rows, each links to its page)**

*One team. Four ways to be seen.*

| **Digital Advertising** | Paid social, search, and platform campaigns that bring the traffic. |
|---|---|
| **Revenue Recovery** | The audit that finds where that traffic leaks — and fixes it before you spend more. |
| **Out-of-Home** | Billboards, transit, and physical placements. Presence you can’t scroll past. |
| **Z Best Clips** | Creator-powered short-form distribution. One source, hundreds of clips, real reach. |

**Section 3 — Revenue Recovery, featured**

Headline: *Find out where your revenue is going.*

Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.

Leak taxonomy (ledger rows): Missed and unreturned calls · Forms that break on mobile · Follow-up that dies after one touch · Pages that load too slowly to convert · Ad traffic landing on the wrong page · No retargeting on the people who almost bought.

CTA: Get your free assessment — one quantified leak, in about 60 seconds. (Phase 5; fixture until the tool is ported. Labeled.)

**Section 4 — How we work**

*Audit first. Evidence. Then scale.*

1. **Assess** — a free look at where you’re likely losing revenue.
1. **Audit** — a paid, full diagnostic. Every finding comes with a number.

1. **Fix** — conversion repaired before a dollar more goes into spend.
1. **Scale** — once it’s proven, we run the media: digital, out-of-home, clips.

Case studies appear here when real ones exist; until then this section carries no case study cards at all. Do not fill it with “representative” cases.

**Section 5 — Closing CTA**

*Tell us what’s actually going on.*

Get an Assessment · Talk to Us

### Digital Advertising

**Hero:** *The traffic engine, built to feed a funnel that actually converts.*

Digital Advertising is where the media runs — paid social, search, and platform campaigns that put your business in front of the right audience. It’s not a separate philosophy from Revenue Recovery, it’s the other half of the same one: **Digital Advertising drives the traffic. Revenue Recovery makes sure that traffic doesn’t leak out the bottom.** Running ads into a broken funnel wastes spend regardless of how well the campaign itself is built — which is exactly why the two disciplines work together here instead of being sold as competing options.

**What’s included:**

- Platform strategy and media buying — paid social, search, and platform-specific campaigns built around where your actual customers are, not a one-size template
- Creative that earns attention, not just fills a slot — targeting without compelling creative wastes the targeting; every campaign is built to be worth watching, not just well-aimed

- Audience targeting — built around who actually converts for your business, refined as real campaign data comes in
- Performance tracking and reporting — visibility into what’s actually working, not just impressions and clicks

**Certified, not just claimed** *(hidden until earned — Google Partner, Meta Business Partner, TikTok Marketing Partner in progress)*: Platform certifications are third-party verified, not our own claim — proof of platform expertise that doesn’t depend on taking our word for it.

**How it fits with the rest of what we do:**

- Digital Advertising brings the traffic
- Revenue Recovery fixes what happens once that traffic lands

- Z Best Clips extends reach further through creator-powered short-form distribution
- Out-of-Home builds broader brand presence outside the feed entirely

**Pricing:** Campaigns typically start around $1,500–$2,500/month for a single-platform campaign, scaling based on platform count and ad spend — flat management fee, not a percentage of spend. Month-to-month, no long-term lock-in — though ad platforms typically need 4–6 weeks to gather enough data to optimize meaningfully.

**Who this is for:** Businesses that need real traffic driving to a site or funnel — first campaign ever, or existing spend underperforming.

**CTAs:** Get an Assessment · Talk to Us

**FAQ:**

- **What does Digital Advertising cost?** Campaigns typically start around $1,500–$2,500/month for a single-platform campaign, scaling based on platform count and ad spend — priced as a flat management fee, not a percentage of your spend.
- **Is this a flat fee or a percentage of ad spend?** Flat fee. A percentage-of-spend model creates an incentive to grow your budget rather than your results.

- **What’s the commitment length?** Month-to-month. We recommend planning for at least 4–6 weeks before evaluating results, but you’re never locked into a long-term contract.
- **What platforms do you run campaigns on?** Google Ads, Meta (Facebook and Instagram), and other platforms matched to where your audience actually is.

- **How many accounts does my strategist manage?** Yours is the only one that matters here — real, dedicated attention, not one account among a dozen-plus.

### Revenue Recovery

The current live page’s content carries over (extract it from the live site; do not rewrite). Add the homepage Section 3 leak taxonomy as a section if the live page lacks it. FAQ to add:

- **What is Revenue Recovery?** An audit-first approach that finds where your existing traffic and campaigns are losing conversions, fixes those leaks, then scales what’s proven to work.
- **How does the process start?** A free 60-second assessment identifies likely leak points before you commit to anything paid.

- **What happens after the free assessment?** If there’s enough signal, the next step is a paid audit — a full diagnostic of where revenue is actually being lost.
- **How is pricing structured?** Phased and tied to recovered revenue, not a flat retainer disconnected from results.

- **How is this different from a traditional advertising agency?** A traditional agency runs ads and reports impressions. We audit first, evidence what’s broken, fix conversion before scaling spend.
- **What counts as a “leak”?** Any point where traffic arrives but doesn’t convert — identified with the interactive leak assessment, not assumed.

- **Are your case studies real?** Case studies are clearly labeled as representative or illustrative unless marked as verified client results.
- **What industries does Revenue Recovery work for?** Home services (HVAC, roofing, restoration), med spas, legal, and professional services.

### Out-of-Home

**Hero:** *Presence you can’t scroll past.*

Billboards, transit displays, and physical placements that put your brand in front of people as they move through their day — no ad blocker, no skip button, no algorithm deciding whether it’s shown.

We’re not tied to one operator’s inventory. We plan and buy across Lamar, Clear Channel, OUTFRONT, and regional operators to find the strongest fit for your market and budget.

**Why it still works:** U.S. Out-of-Home revenue hit $9.46 billion in 2025, its nineteenth consecutive quarter of growth, with digital placements now driving over a third of that spend. A five-year Kantar/Clear Channel study found OOH consistently outperforms digital and CTV on ad awareness, brand favorability, and purchase intent. OAAA/Harris Poll research found 61% of consumers view OOH ads more favorably than any other advertising medium. *(Build note: these three figures were supplied in v1 and are not re-verified in v2. Cite the OAAA, Kantar, and Harris sources inline on the page; if a source can’t be located, drop the figure rather than publish it unsourced.)*

**What’s included:**

- Placement strategy — billboards, transit, other formats selected for where your audience lives, works, travels
- Static and digital placements — traditional bulletins and posters alongside digital billboards and programmatic-eligible screens

- Cross-operator sourcing — evaluated across the market broadly
- Creative built for the format — simple messaging, bold visuals, one clear call to action

- Campaign timing guidance — static needs 8–12 weeks to build frequency; digital allows shorter test rotations

**Pricing:** Scoped individually by market, location, placement type, duration.

**Who this is for:** Home services, med spas, legal and professional services, automotive, multi-location brands.

**CTAs:** Get an Assessment · Talk to Us

**FAQ:**

- **How is Out-of-Home pricing determined?** Season, market, location, and campaign duration all factor in.
- **How long should a campaign run?** Static: 8–12 weeks for real frequency. Digital OOH: shorter test rotations before longer commitment.

- **Do you only sell your own inventory?** No — plan and buy across Lamar, Clear Channel, OUTFRONT, and regional operators.
- **Do you offer digital billboards, or only static?** Both — digital drives over a third of industry spend.

- **What makes effective Out-of-Home creative?** Simple, bold messaging, one clear call to action — seconds to register with someone in motion.
- **What industries perform well with Out-of-Home?** Home services, healthcare/med spas, automotive, legal/professional services, multi-location brands.

- **Can Out-of-Home work alongside Digital Advertising or Z Best Clips?** Yes.

### Search Intelligence — build the page, do NOT link it

**CRITICAL BUILD NOTE:** This page must exist on the site but must NOT be linked from primary nav, footer, sitemap.xml, or internal links anywhere else on the site. Add <meta name="robots" content="noindex"> for now. It stays reachable only by direct URL. This is a deliberate business decision — the department behind this page is being built to compete with Moz, Yext, Ahrefs, and Semrush at full scale, and surfacing a smaller version now would anchor the market’s first impression to something modest right before a much bigger reveal. Treat this exactly like a staging page: real, built, styled, correct — just not discoverable yet. The launch checklist (§3 step 6) greps for links to it.

**Hero:** *Ranked isn’t the same as cited.*

Google’s answer boxes, ChatGPT, Claude, Gemini, and Perplexity are increasingly answering your customers’ questions directly — with zero clicks to anyone’s website. If you’re not the source an AI cites, you don’t exist to that customer, no matter how well you rank on a results page nobody scrolls anymore.

**What’s included:**

- Continuous backlink crawl with authority and toxicity scored together — one ledger with a keep/watch/disavow flag
- AI crawler access management — sitemap and llms.txt treated as one job, verified so they never contradict each other

- Coverage across ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, Grok, and Google’s AI Overviews and AI Mode
- Conversation-chain tracking, not just first-prompt visibility

- Exact citation tracing, plus a Mentioned-Not-Cited flag most tools don’t track as its own category
- Competitor visibility that expands itself automatically as new competitors show up in your AI answers

- Every finding paired with the fix — a caught hallucination or content gap goes straight into a production queue, not a dashboard you have to staff yourself
- Revenue attribution with an honest confidence band — most tools in this category admit they can’t tie AI visibility to revenue at all

**Not a dashboard you operate. A department that does the work.** Most tools in this category are self-serve — you pay by the prompt, the seat, or the engine, and your own team turns findings into fixes. Search Intelligence is managed end to end: we find it and we fix it. That’s why pricing is scoped to outcome, not metered by usage.

**How pricing works:** Full-service AEO/GEO work, not a self-serve monitoring tool. Below $2,000/month in this category is almost always rebranded SEO.

|  | Entry — $2,000/mo | Growth — $4,500/mo | Full Department — $7,500/mo |
|---|---|---|---|
| Engine coverage | Core engines (ChatGPT, Google AI Overviews, Perplexity) | Full coverage across all named platforms | Full coverage, priority monitoring cadence |
| Content & fixes | Monitoring + foundational fixes | Active ongoing content production against gaps | Full production cadence, faster turnaround |
| Competitor tracking | A handful, manually set | Full auto-expanding competitor set | Same, deeper benchmarking |
| Revenue attribution | Not included | Included | Included, higher-frequency reporting |

Above $7,500/month, scope is custom — contact us for a proposal.

**Free AI Visibility Check:** See whether and how your business currently shows up when someone asks ChatGPT, Gemini, or Perplexity a question relevant to it. No payment, no obligation.

**Who this is for:** Businesses that need to be found — and represented accurately — in AI-generated answers, not just a traditional results page.

**CTAs:** Get Your Free Visibility Check · Talk to Us

**FAQ:**

- **What’s AEO/GEO/LLMO?** Answer Engine, Generative Engine, and Large Language Model Optimization — making sure AI systems can find, correctly understand, and cite your business when someone asks them a relevant question.
- **How is this different from traditional SEO?** Traditional SEO gets you ranked on a results page. This gets you cited inside an AI’s actual answer — a newer discipline with its own measurement problems, which is why every number carries a confidence band instead of a bare figure.

- **What’s a “confidence band,” and why does every number have one?** AI search volume and attribution data is directional, not exact — even the field’s own tools admit this. We’d rather tell you honestly how sure we are than hand you a precise-looking number that isn’t.
- **How do you know AI visibility work is actually driving revenue?** We correlate upstream signals — a spike in AI conversation mentions, a new citation landing — against your actual conversion data in the days after, and flag what’s AI-attributable with a confidence score.

- **Do you guarantee rankings or citations?** No — nobody honestly can; the field’s own citation-consistency numbers are unreliable run to run. What we guarantee is that every claim is evidenced and every fix is measurable.
- **What happens when an AI says something wrong about my business?** We catch it and route the correction into content that fixes the actual source, so it compounds instead of piling up as a to-do list.

- **What platforms do you cover?** ChatGPT, Claude, Gemini, Perplexity, Copilot, Meta AI, Grok, Google AI Overviews, Google AI Mode, plus traditional local and map search.
- **How is pricing structured?** Three published tiers — Entry at $2,000/month, Growth at $4,500/month, Full Department at $7,500/month — scaling by engine coverage, content cadence, and whether revenue attribution is included. Above that, scope is custom.

- **Do you offer a free trial?** Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live.
- **Is this a new offering?** Yes — early accounts are onboarded founder-led while the methodology proves itself in the field, the same way every other discipline on this site started.

### About

*A media company built on evidence, not promises.*

Z Best Media runs across four disciplines — digital advertising, revenue recovery, out-of-home, and creator-powered content through Z Best Clips. What ties them together isn’t the channel, it’s the approach: find what’s actually working, prove it with real numbers, then scale it. No fake urgency, no manufactured scarcity, no unverified proof — a standard held on every page of this site.

We started with traditional advertising and out-of-home. Revenue recovery came from watching too many businesses run good campaigns into broken funnels. Z Best Clips came from recognizing that the same evidence-first discipline belongs in short-form content, not just paid media.

One team, one standard, applied everywhere we work.

**CTAs:** Get an Assessment · Talk to Us

### Contact

*Tell us what’s actually going on. We’ll tell you honestly whether we’re the right fit.*

Whether it’s a revenue leak, a media buy, a billboard campaign, or a content strategy — start with what’s actually happening, not what you think the solution should be.

**Form fields:** Name · Business · What are you looking to solve? · Best way to reach you (→ §6)

### FAQ (site-level page)

Aggregates the FAQ blocks from Digital Advertising, Revenue Recovery, and Out-of-Home, grouped by discipline. No Search Intelligence questions on this page.

# PART B — Z BEST CLIPS

## B1. Design tokens

**Color**

| Token | Value | Use |
|---|---|---|
| --zbc-base | #0B0D10 | page base — sibling of ZBM’s #0E0F12, distinct value |
| --zbc-ent | #FF6B5B | Entertainment accent — warm, energetic |
| --zbc-brand | #4C8CFF | Brands accent — cool, trustworthy |
| --text-primary | #EDEBE6 | shared with ZBM |
| --text-secondary | #8B8F98 | shared with ZBM |

Color-coding is functional, not decorative — Entertainment and Brands are structurally different services (rented vs. owned distribution) and must read as visually distinct throughout: page accent, nav dropdown, CTA color, card edge.

**Type:** Bricolage Grotesque (headlines — kinetic, distinctive) · IBM Plex Sans (body) · IBM Plex Mono (view-counts and stats — shared with Z Best Media as the deliberate sibling link).

**Layout:** more asymmetric and dynamic than Z Best Media. How It Works uses a horizontal timeline/scrubber device as the structural divider — justified because that content is sequential. On mobile the scrubber becomes a vertical timeline.

**Signature motion:** an animated view-counter ticking up once per campaign example, restrained to one moment per section.

**Vernacular:** video timelines, scrubbers, view-count tickers — literal to what a clipping campaign is.

**Endorsement line** (wordmark lockup and footer): *Z Best Clips, by Z Best Media.*

## B2. Navigation

Focus Areas (dropdown: Entertainment · Brands) · How It Works · Pricing · Become a Clipper · **Launch a Campaign** (primary CTA, button-styled)

Work/Results deferred as a nav item until real campaign results exist (decided Sep 7).

## B3. Footer (launch configuration)

| Company | Resources | Legal |
|---|---|---|
| About | FAQ | Privacy Policy |
| Media Kit |  | Terms of Service |
| Become a Clipper |  | Cookie Settings |
| Launch a Campaign |  |  |
| Contact (→ Launch a Campaign form) |  |  |

Endorsement line under the wordmark: *Z Best Clips, by Z Best Media* (links to the ZBM site).

**Post-launch, written in batches after keyword research:** the Services column (Clipping & Editing Services, Clipping Campaigns, Video Clipping Service, Short-Form Editing, Clipping Agency Pricing), Campaigns column (Music, Film, Sports, Auto Dealership, Med Spa Clipping Campaigns), and Platforms column (TikTok, Instagram Reels, YouTube Shorts, Podcast Clipping Agency). Build the footer component so columns can be added without layout changes. Blog joins Resources with the first post.

**Shortlist for later (not now):** Bounty Clipping (open/unmanaged submission model), Case Studies as a standalone page (waits for real results).

## B4. Page copy

### How It Works

**Section 1 — The Model**

*One source. Hundreds of clips. Real reach.*

You hand us one piece of long-form content — a song, a stream highlight, a showroom walkaround, a treatment-room story. Our clipper network cuts it into dozens of distinct short-form videos, each with a different hook, pace, and caption, then posts them across TikTok, Instagram Reels, and YouTube Shorts from real, independent accounts.

**Section 2 — The Process** (timeline/scrubber device)

1. **Set the Campaign** — Source material, platforms, guidelines, target reviewed and locked before launch. Levers: **Reward rate** (per 1,000 verified views) · **Minimum payout threshold** (floor so only clips clearing real view counts enter review) · **Maximum payout cap** (protects budget from one viral clip consuming the pool) · **Optional flat fee bonus** (stacks on top, useful for launch campaigns with no track record yet). Brand safety and disclosure rules set up front.
1. **Clippers Create and Post** — Independent creators turn source material into varied clips from their own accounts.

1. **Every Submission Reviewed** — Nothing counts until a human reviews it against guidelines. Rule-breaking posts rejected and never billed.
1. **Verified Reporting** — Approved posts, verified views, platform breakdown, visible while the campaign runs.

**Section 3 — One Model Doesn’t Fit Every Campaign**

- **Entertainment (Music, Film, Sports, Streamers, Podcasts) — Rented Distribution.** Content posts through the clipper network’s own accounts. Goal: discovery, reaching strangers who’ve never heard of you. When the campaign ends, you keep the view totals and case study — the accounts and followers stay with the clippers.
- **Brands (Auto Dealerships, Med Spas, Local Businesses) — Owned Distribution.** Content posts to accounts the business controls. Goal: compounding local reach. When the campaign ends, the following, library, and audience relationship are yours to keep.

**Section 4 — What’s Included:** Campaign guidelines and brand safety review, clipper network distribution, submission review on every post, only eligible views billed, TikTok/Reels/Shorts coverage, verified reporting, dedicated campaign contact.

**Illustrative example cards** — three cards, each carrying the IllustrativeBadge (“Illustrative example — not a client result”). Counters tick once on viewport entry. Swap for real results as campaigns land.

| Card | Accent | Views | Clips | Platforms |
|---|---|---|---|---|
| Independent single release | Entertainment | 1,240,000 | 84 | TikTok · Reels · Shorts |
| Auto dealership showroom series | Brands | 340,000 | 46 | TikTok · Reels |
| Med spa treatment-room series | Brands | 215,000 | 38 | Reels · Shorts |

**CTA:** Launch a Campaign

### Entertainment (Focus Area page — accent --zbc-ent)

**Hero:** *Get discovered by people who’ve never heard of you.*

Music, film, television, streaming content, sports — and the artists, creators, teams, and organizations behind them. Whether it’s a release, a game, a match, a season, or a series, if there’s long-form content and an audience worth reaching, we turn it into hundreds of short-form clips built to travel.

**Who this is for:** Independent artists and labels, filmmakers, streamers and podcasters, sports teams and leagues, streaming platforms and studios — anyone with a moment worth putting in front of people who haven’t found it yet.

**How it works:** Rented distribution. Your content runs on our clipper network’s own accounts, opening audiences and algorithmic reach no single account could reach alone.

**Note:** Do not name specific real companies/leagues/studios (trademark risk) — describe categories only. Use real named partners only once an actual relationship exists.

**CTA:** Launch a Campaign

### Brands (Focus Area page — accent --zbc-brand)

**Hero:** *Build an audience that keeps showing up.*

Your showroom floor, your treatment room, your storefront — turned into a real, growing short-form presence that the same local audience sees again and again. Not a single spike, a compounding channel that’s yours to keep.

**Who this is for:** Auto dealerships, med spas, and local or regional businesses that depend on repeat visibility to turn attention into booked appointments and showroom visits.

**How it works:** Owned distribution. Content posts to your own accounts, so the following, content library, and audience relationship stay with your business after the campaign ends.

**CTA:** Launch a Campaign

### Pricing

*How a campaign is priced.* You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — and you only pay after you approve the post.

**Levers you control:** Campaign budget (funded, nothing charged upfront) · Reward rate (dollars per 1,000 views) · Minimum payout (view threshold before review) · Maximum payout (per-creator, per-video cap) · Flat fee bonus (optional, useful for launch campaigns).

**What every campaign includes:** Campaign guidelines and brand safety review, submission review on every post, reporting on approved posts/verified views/platform breakdown, dedicated point of contact.

**Build note:** Client-facing pricing stays bundled (one clean number). Do **not** disclose the clipper-side payout split on this page. Transparency lives on the clipper-facing pages instead.

**CTA:** Launch a Campaign

### Become a Clipper

*Turn footage into income. No experience required, no follower minimum.*

**How it works:**

1. Join a campaign
1. Get the source material (approved footage, clear brief)

1. Cut and post (your hook, your account)
1. Submit for review

1. Get paid on verified views

**Two kinds of campaigns, two kinds of payout:**

- **Entertainment campaigns** — run through your own account. Paid per 1,000 verified views at the disclosed rate. Every clip builds a following that’s yours to keep.
- **Brand campaigns** — post to the client’s account instead of yours. Because there’s no audience upside, pay is structured differently: a guaranteed flat fee for every approved post, plus a performance bonus on top — a set rate per 1,000 verified views.

*Starting rates (opening range): $50–100 guaranteed flat fee per approved post, $3–5 per 1,000 views bonus — subject to adjustment as real campaigns establish what’s sustainable. Disclosed per campaign, not buried in fine print.*

**CTA:** Browse Active Campaigns → until a real campaign exists, this opens the clipper waitlist form (§6.1) with the label “Join the clipper list — we’ll notify you when the first campaigns open.”

### Launch a Campaign

*Tell us what you have. We’ll tell you what it can become.*

**What happens when you reach out:**

1. A real conversation — what you’re promoting, who you’re trying to reach, what success looks like
1. We scope the campaign around your goal — Entertainment or Brands, rented or owned distribution, budget and target

1. You approve the plan — guidelines, platforms, target locked before any clip is cut
1. We launch and report — verified views, approved posts, platform breakdown, visible while the campaign runs

**Two ways to start:** “I have something to promote right now” → the form on this page (§6.1) · “I’m not sure yet” → See How It Works

**Honesty note (keep this on the page):** *Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.*

### About

*We come from advertising. Now we’re building the next version of it.*

Z Best Clips was founded by a software engineer with years of experience in high-end automotive sales — moving into luxury and exotic brands, and building new client relationships from zero at every step up. That same instinct — walk in, prove it, earn the next opportunity — is what built Z Best Media, and it’s what’s building Z Best Clips now.

We’re not a video editing shop that stumbled into marketing, and we’re not a marketing agency guessing at video. We’ve done the sales floor, the client relationships, and the advertising work — now we’re applying that same discipline to short-form content distribution.

We’re building this in the open, one real campaign at a time. No inflated numbers, no manufactured urgency, no pretending we’ve been at this longer than we have.

**Note:** No founder name, no specific brand names, no sales figures, no athlete background, no broker license mentioned — company voice only, per founder’s explicit direction.

**CTAs:** Launch a Campaign · Become a Clipper

### Media Kit (new — locked Sep 13)

*Z Best Clips — press kit.*

**Boilerplate (short):** Z Best Clips is a clipping and short-form distribution agency, by Z Best Media. It turns one piece of long-form content into dozens of short-form clips posted across TikTok, Instagram Reels, and YouTube Shorts by an independent creator network, with every post reviewed and only verified views billed.

**Boilerplate (long):** Z Best Clips is the creator-powered distribution arm of Z Best Media, a Los Angeles advertising agency founded in 2011. It runs two campaign models: rented distribution for entertainment — music, film, streaming, sports, podcasts — where clips post from the creator network’s own accounts to reach new audiences; and owned distribution for brands — auto dealerships, med spas, local businesses — where clips post to the client’s own accounts to build a compounding local following. Every submission is reviewed by a person before it counts, and clients pay only for approved posts with verified views.

**Company facts (ledger rows):**

| Parent | Z Best Media, est. 2011, Los Angeles |
|---|---|
| Launched | 2026 |
| Founder | A software engineer with a background in high-end automotive sales (company voice — no name) |
| Models | Rented distribution (Entertainment) · Owned distribution (Brands) |
| Platforms | TikTok · Instagram Reels · YouTube Shorts |
| Payout basis | Per 1,000 verified views; brand campaigns add a guaranteed per-post fee |

**Brand assets:** wordmark (SVG, PNG on dark and light), Entertainment and Brands accent swatches, the endorsement lockup. Download pack available once the wordmark is final; until then the page reads “Assets available on request.”

**Press contact:** press@zbestclips.com (placeholder until the mailbox exists — build note: create the alias before launch or replace with the founder’s address).

**What we can and can’t say:** We’ll talk about the model, the review process, and how payouts work. We won’t share client names, campaign numbers, or creator identities without their written permission, and we don’t publish unverified results.

### FAQ

- **What is a clipping campaign?** Turns one piece of long-form content into dozens of short-form clips, posted across TikTok, Reels, and Shorts by our creator network.
- **How much does a campaign cost?** Set by target reach and budget, scoped individually before launch. No separate line-item fees.

- **What’s the difference between Entertainment and Brands campaigns?** Entertainment = rented distribution (our network’s accounts, new-audience discovery). Brands = owned distribution (client’s own account, compounding local reach).
- **Do I only pay for views that actually happen?** Yes — every submission reviewed before it counts.

- **How fast can a campaign launch?** Typically within a few days of the scoping call.
- **Is Z Best Clips a new company?** Yes — built on proven industry-wide mechanics, building our own case studies now.

- **How do clippers get paid?** Entertainment: per 1,000 verified views. Brands: guaranteed flat fee + performance bonus.
- **Do I need a large following to become a clipper?** No — based on content quality and guideline adherence, not follower count.

- **What platforms do you post to?** TikTok, Instagram Reels, YouTube Shorts.
- **Who is Z Best Clips for?** Independent artists/labels, filmmakers, streamers, podcasters, sports organizations, auto dealerships, med spas.

# 8. Post-launch queue (not this build)

In order:

1. Wordmark → drawn mark (separate design job).
1. Extract the live leak-assessment tool’s input schema → port the tool → replace the fixture (Phase 5 follow-up).

1. First named client → Work page goes live in nav and footer.
1. Keyword research → ZBC SEO landing pages in batches (Campaigns column first — they map to outreach verticals).

1. First blog post → Blog link in both footers.
1. Attorney-reviewed legal text → replace placeholders, remove banners.

1. Certifications earned → unhide the block on Digital Advertising.
1. Backend contract reconciled → dashboards (SEO client dashboard, ZBC campaign dashboard) as their own phased build.

1. Search Intelligence reveal → link the page, remove noindex, add to sitemap.

# 9. Cross-cutting rules for the build team

- **Illustrative content must stay clearly labeled as illustrative** everywhere it appears via the IllustrativeBadge component — this is a stated integrity standard, not a suggestion. Swap for real data only once real campaigns exist.
- **No real company names** (Netflix, NFL, specific studios, etc.) anywhere on Z Best Clips — category language only. The launch checklist greps for a blocklist.

- **Client-facing pricing (bundled) and clipper-facing pricing (transparent) must never cross-contaminate** — no clipper payout splits on buyer-facing pages.
- **Certifications section (Digital Advertising) stays hidden** until Google Partner, Meta Business Partner, and TikTok Marketing Partner are earned. Hidden means not rendered, not display:none.

- **Search Intelligence stays unlinked and noindex** until the reveal.
- **No outcome numbers without a source.** If a number describes a result and isn’t verified, it carries the badge or it doesn’t ship.

- **prefers-reduced-motion** disables every counter tick and the scroll-scrubbed hero; content must be fully readable with motion off.
- **Playwright screenshots at 1440 and 390** for every page before a phase is marked complete, committed under e2e/snapshots/.

- **AEGIS audits each phase against this document**, not against the previous phase’s output. A phase that fails is repaired, not restarted.

# Appendix — Claude Code kickoff prompt

Paste this as the first message of the build session, with this document and the Backend Interface Spec v0.2 in the working directory.

You are building the Z Best Media and Z Best Clips marketing sites from BUILD-BRIEF-v2.md. It is locked; do not re-ideate copy, tokens, nav, or scope. Start with Phase 1 (§3): create the monorepo exactly as laid out in §1.2, get both apps booting with fonts loading, and verify all six tools per §2.1 — report each tool’s installed version and whether it responded. Do not proceed to Phase 2 until Phase 1 screenshots exist under e2e/snapshots/phase-1/ at 1440 and 390. After each phase, stop and give me: what was built, what was verified (with the screenshot paths), what failed, and what could not be tested. Never label anything “done” or “production-ready” without evidence. If anything in the brief is ambiguous, state your assumption and continue; if it would change the result materially, stop and ask. Do not touch the existing zbestmedia-ui Vercel project.
