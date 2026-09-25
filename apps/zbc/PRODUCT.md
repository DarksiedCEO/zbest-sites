# Product

<!-- impeccable:product-schema 1 -->

> Z Best Clips — app-specific product truth. Shared truth (positioning, brand
> commitments, evidence on hand, integrity standards, backend and legal constraints)
> lives in the root `PRODUCT.md` and is not repeated here.

## Platform

web

## Users

Two audiences with opposed interests, both first-class on this site:

- **Demand side — clients funding campaigns.** *Entertainment:* independent artists
  and labels, filmmakers, streamers, podcasters, sports teams and leagues, studios
  and streaming platforms. *Brands:* auto dealerships, med spas, and local or
  regional businesses that depend on repeat visibility.
- **Supply side — clippers.** Independent creators who cut and post short-form
  content. No experience required, no follower minimum; selection is on content
  quality and guideline adherence.

The two audiences get deliberately different pricing language, and it must never
cross-contaminate: **bundled and clean for clients, transparent and itemized for
clippers.**

## Product Purpose

One source, a stream of clips, real reach. A client hands over one piece of long-form
content; the clipper network cuts it into dozens of distinct short-form videos, each
with a different hook, pace and caption, posted across TikTok, Instagram Reels and
YouTube Shorts from real independent accounts. Every submission is reviewed by a
person before it counts, and only approved posts with verified views are billed.

## Positioning

Two campaign models that are **structurally different services**, not tiers:

- **Entertainment — rented distribution.** Content posts through the clipper
  network's own accounts. Goal: discovery among strangers. When the campaign ends the
  client keeps the view totals and the case study; the accounts and followers stay
  with the clippers.
- **Brands — owned distribution.** Content posts to accounts the business controls.
  Goal: compounding local reach. When the campaign ends the following, library and
  audience relationship are the client's to keep.

This distinction is the reason the two are color-coded throughout the site.

## Operating Context

A campaign is a funded pool, not a retainer: the client funds a budget and creators
are paid only when clips earn real, verified views, after the client approves the
post. The levers a client controls are reward rate (per 1,000 verified views),
minimum payout threshold, maximum payout cap, and an optional flat fee bonus.

Clipper payout differs by model — Entertainment pays per 1,000 verified views;
Brands, having no audience upside for the creator, pays a guaranteed flat fee per
approved post plus a per-1,000-view performance bonus.

## Capabilities and Constraints

**Pages (Brief §B4), built in this order in Phase 4:** How It Works → Entertainment →
Brands → Pricing → Become a Clipper → Launch a Campaign → About → Media Kit → FAQ.

**Navigation (§B2):** Focus Areas (dropdown: Entertainment · Brands) · How It Works ·
Pricing · Become a Clipper · **Launch a Campaign** (primary CTA, button-styled).
Work/Results is deferred as a nav item until real campaign results exist.

**Footer (§B3):** Company / Resources / Legal at launch, with the endorsement line
*Z Best Clips, by Z Best Media* under the wordmark, linking to the ZBM site. **Build
the footer component so columns can be added without layout changes** — a Services
column, a Campaigns column and a Platforms column are written in batches post-launch
after keyword research. The 13 SEO landing pages are **not at launch.**

**Forms:** Launch a Campaign (Name · Organization · What are you promoting? ·
Entertainment / Brands · Budget range optional · Best way to reach you) and Become a
Clipper waitlist (Name · Email · Primary platform · Profile link optional).

**Hard content constraints:**
- **No real company, league or studio names anywhere on this site** — category
  language only, for trademark reasons. Real named partners only once an actual
  relationship exists. The launch checklist greps a blocklist.
- **Do not disclose the clipper-side payout split on the client-facing Pricing
  page.** Transparency lives on the clipper-facing pages instead.
- **Company voice only** — no founder name, no specific brand names, no sales
  figures, no athlete background, no broker license.

## Evidence on Hand

- **No real campaigns and no real results.** The three How It Works example cards are
  illustrative — Independent single release (1,240,000 views / 84 clips), Auto
  dealership showroom series (340,000 / 46), Med spa treatment-room series
  (215,000 / 38) — and **each carries the `IllustrativeBadge`** reading "Illustrative
  example — not a client result." Swap for real results as campaigns land.
- **"Browse Active Campaigns" has nothing to browse.** Until a real campaign exists
  it opens the clipper waitlist form, labeled "Join the clipper list — we'll notify
  you when the first campaigns open."
- **Clipper rates are an opening range, explicitly provisional:** $50–100 guaranteed
  flat fee per approved post, $3–5 per 1,000 views bonus, subject to adjustment as
  real campaigns establish what is sustainable.
- **Brand asset download pack does not exist yet.** The Media Kit page reads "Assets
  available on request" until the wordmark is final.

## Product Principles

1. **Entertainment and Brands are different services, so they must look different.**
   Color-coding is functional, not decorative.
2. **Client pricing bundled, clipper pricing transparent — never the reverse.**
3. **Say it is new.** The honesty note on Launch a Campaign stays on the page; the
   site does not pretend to a track record it does not have.
4. **Nothing counts until a person reviews it.** The review gate is the product's
   actual differentiator and should read as such, not as fine print.

## Routing decision (Phase 4)

Z Best Clips has no separate Home page in Brief §B4. `/` serves How It Works (founder decision,
Phase 4); `/how-it-works` redirects to `/` permanently, and the nav's How It Works entry links to
`/`.
