# Product

<!-- impeccable:product-schema 1 -->

> Shared product truth for both sites. Audience, purpose and page inventory are
> per-app: see `apps/zbm/PRODUCT.md` and `apps/zbc/PRODUCT.md`.
>
> Every fact here is taken from `docs/ZBM-ZBC-Build-Brief-v2.md`, which is **locked
> for implementation**. Nothing here was inferred beyond it.

## Platform

web

## Stack

Answered by the existing codebase: Next.js 16 (App Router) + TypeScript + Tailwind
CSS 4, in a pnpm/Turborepo monorepo — two apps (`apps/zbm`, `apps/zbc`), one shared
design system (`packages/ui`), deployed as two Vercel projects on two domains.
Versions recorded in `docs/TOOLING.md`.

## Users

Two distinct audiences, one per app, plus a third the business depends on:

- **ZBM — business owners and operators** buying advertising: home services (HVAC,
  roofing, restoration), med spas, legal and professional services, automotive, and
  multi-location brands. They arrive either running no campaigns at all, or running
  spend that is underperforming and they cannot say why.
- **ZBC — clients funding campaigns:** independent artists and labels, filmmakers,
  streamers, podcasters, sports organizations (Entertainment); auto dealerships, med
  spas and local businesses (Brands).
- **ZBC — clippers:** independent creators who cut and post short-form content. No
  follower minimum, no experience required. They are a supply-side audience with
  their own pages and their own, deliberately more transparent, pricing language.

## Product Purpose

Z Best Media is an advertising agency running four disciplines — Digital Advertising,
Revenue Recovery, Out-of-Home, and creator-powered content through Z Best Clips — to
one standard: find what is actually working, prove it with real numbers, then scale
it. Revenue Recovery is the discipline that drives early revenue and gets the
featured section, but the company is not a single-service shop and the site must not
read as one.

Z Best Clips turns one piece of long-form content into dozens of short-form clips,
posted across TikTok, Instagram Reels and YouTube Shorts by an independent creator
network, with every submission reviewed by a person and only verified views billed.

This build's success condition is narrow and stated: two public marketing sites that
can carry the company's own integrity standard on every page.

## Positioning

**Advertising you can audit.** The claim a neighboring agency could not truthfully
copy is the order of operations: audit first, evidence the leak with real numbers,
fix conversion, and only then scale spend. A traditional agency runs ads and reports
impressions. Digital Advertising drives the traffic; Revenue Recovery makes sure that
traffic does not leak out the bottom.

On the ZBC side the differentiator is the review gate: nothing counts until a human
reviews it against guidelines, and rule-breaking posts are rejected and never billed.

## Operating Context

- Established 2011, Los Angeles. Z Best Clips launched 2026.
- Buys across Google, Meta, TikTok, and the OOH operators Lamar, Clear Channel and
  OUTFRONT — not tied to one operator's inventory.
- The existing live Vite/React SPA (Vercel project `zbestmedia-ui`) stays live and
  **untouched** until V2 replaces it by canary migration. Do not modify or delete it.
- A separate backend is being built independently. `docs/backend-interface-spec-v0.2.md`
  is **DRAFT**, not an approved contract.

## Capabilities and Constraints

**In scope:** the two public marketing sites, all pages in Brief Parts A and B,
forms, the cookie consent banner, legal page shells, and the Phase 4/5 interactive
pieces running on fixtures.

**Out of scope — do not build:** the SEO/AEO/GEO/LLMO client dashboard; the ZBC
campaign dashboard and clipper submission flow; any authentication, accounts or
logged-in surface; any real payment, payout or publication mechanics. If a task
appears to require any of these, stop and flag it.

**Backend constraint (Spec §9, governing):** all API calls behind a typed adapter;
fixtures clearly labeled; enums never hard-coded into components; no real
publication, funding or payout. Nothing in the marketing sites imports backend entity
shapes. Do not build against guessed DTOs.

**Forms** post to one Next.js route handler per app (`app/api/lead/route.ts`),
server-only: zod validation, a row in Vercel Postgres, an email via Resend, honeypot
plus per-IP rate limit, and a client-generated `submission_id` the handler upserts on
so a double-click cannot create two leads. If the email send fails the row is still
written and the user still sees success; if the DB write fails, return an error and
do not claim success. No CRM at launch. Secrets live only in Vercel env vars.

**Legal:** Terms, Privacy and Cookie Policy for both entities require attorney review
before publishing. Page shells are built now and every one carries a visible banner:
*"Draft — pending attorney review. Not yet in effect."*

**Domains (founder decision at Phase 1 close):**
- Z Best Media production domain is **zbestmedia.com**, canonical host
  **www.zbestmedia.com**. Non-canonical hosts redirect to the canonical one. This
  governs Phase 3 sitemap entries, canonical URLs and OG metadata.
- Z Best Clips is **zbestclips.com** — its own domain, not a ZBM subdomain (§1.1).
- **No DNS or Vercel changes in any build phase.** The domain is recorded here so
  Phase 3 can generate correct URLs; wiring it up is not build work. This sits
  alongside the standing rule that the existing `zbestmedia-ui` Vercel project is not
  to be modified or deleted.

**Undecided / not yet supplied:**
- The live Revenue Recovery leak-assessment tool's input schema — must be extracted
  from the live site before the real tool can be ported (Backend Spec §10).
- `press@zbestclips.com` does not exist yet; create the alias before launch or
  replace it with the founder's address.

## Brand Commitments

- **Name and endorsement:** *Z Best Clips, by Z Best Media* — appears in the ZBC
  wordmark lockup and footer, and links to the ZBM site.
- **Logo:** typographic wordmark only at launch — Fraunces for ZBM, Bricolage
  Grotesque for ZBC, endorsement line in IBM Plex Sans, rendered as SVG in
  `packages/ui/brand/`. The legacy flaming-Z masthead and horse mark are **retired
  and must not appear.** A drawn mark is a separate design job.
- **Voice — ZBC is company voice only**, per the founder's explicit direction: no
  founder name, no specific brand names, no sales figures, no athlete background, no
  broker license.
- **Stated standard, binding on copy:** no fake urgency, no manufactured scarcity, no
  unverified proof. The About page asserts this standard is held on every page of the
  site, which makes it a product commitment rather than a tone preference.
- **Honesty note that must stay on the ZBC Launch a Campaign page:** Z Best Clips is
  a new operation building its own case studies now, and says so rather than
  pretending otherwise.

## Evidence on Hand

Deliberately thin, and future work **must not fabricate past it**:

- **No named clients.** The `/work` route may exist but stays unlinked until one
  exists.
- **No case studies.** The homepage "How we work" section carries no case study cards
  at all until real ones exist — it is explicitly not to be filled with
  "representative" cases.
- **No verified recovered-revenue figure.** The ZBM hero stat block therefore shows
  non-outcome facts only, and the Counter component is built but not wired to a claim
  until a real number exists.
- **No real campaigns.** ZBC's "Browse Active Campaigns" CTA points at the clipper
  waitlist form. The three How It Works example cards are illustrative and each
  carries the `IllustrativeBadge`.
- **No platform certifications yet.** Google Partner, Meta Business Partner and
  TikTok Marketing Partner are in progress; the block stays unrendered until earned.
- **No blog posts.** The route is built but unlinked until the first post exists.
- **Three OOH figures** (OAAA, Kantar/Clear Channel, Harris Poll) carried over from
  brief v1 and **not re-verified in v2** — cite the sources inline, or drop the
  figure rather than publish it unsourced.

## Product Principles

1. **Audit first, evidence, then scale.** This is the company's stated order of
   operations and the site's own structure should demonstrate it, not just describe it.
2. **An unverified number is labeled or it does not ship.** The `IllustrativeBadge`
   is an integrity standard, not a component preference.
3. **Absence is stated, never filled.** No named clients, no case studies, no
   verified outcome figure — pages are designed to read well empty rather than padded
   with representative content.
4. **The two brands are siblings, not clones.** They deliberately share IBM Plex
   Mono, the text colors and the ledger rule; one source of truth or the design
   system drifts within a month.
5. **Buyer-facing and creator-facing pricing never cross-contaminate.** Bundled for
   clients, transparent for clippers.

## Accessibility & Inclusion

- **Lighthouse ≥ 90 on Performance, Accessibility and SEO, at both viewports**, is a
  launch gate (§3.6).
- **`prefers-reduced-motion` disables every counter tick and the scroll-scrubbed
  hero, and renders every showpiece as a composed static frame** [FD-VISUAL-01 §4.5]. Content must be fully readable with motion off — this is a correctness
  requirement, not a progressive enhancement.
- The FAQ accordion must be a genuinely accessible accordion (keyboard operable,
  correct roles and state).
- Cookie consent must allow rejecting non-essential cookies, per CCPA/CPRA posture
  for a California-operating business.
