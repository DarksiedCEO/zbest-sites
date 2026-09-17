# Product

<!-- impeccable:product-schema 1 -->

> Z Best Media — app-specific product truth. Shared truth (positioning, brand
> commitments, evidence on hand, integrity standards, backend and legal constraints)
> lives in the root `PRODUCT.md` and is not repeated here.

## Platform

web

## Users

Business owners and operators buying advertising — home services (HVAC, roofing,
restoration), med spas, legal and professional services, automotive, and
multi-location brands.

They arrive in one of two situations: running no campaigns at all and needing traffic,
or already spending and underperforming without knowing why. The second is the more
valuable arrival and the one Revenue Recovery is written for — they are not short on
traffic, they are losing traffic they already paid for, at the phone, the form, or
the follow-up.

## Product Purpose

An advertising agency running four disciplines to one standard. The site must read
agency-first: Revenue Recovery is the discipline that drives early revenue and gets
the featured section, but the page must not read as a single-service shop.

## Operating Context

Production domain **zbestmedia.com**, canonical host **www.zbestmedia.com** (founder
decision at Phase 1 close) — governs Phase 3 canonical URLs, `sitemap.xml` and OG
metadata. No DNS or Vercel changes in any build phase.


The buyer's entry point is the free assessment, which precedes any paid engagement.
**What the assessment returns, and how fast, is undecided** (founder hold, Phase 4): the brief's
"one quantified leak in about 60 seconds" is not published anywhere on the site until the
Phase 5 decision is made. Assessment CTAs are labeled fixtures and lead to the request form at
`/revenue-recovery#assessment`. The
commercial ladder the pages must support is: Assess (free) → Audit (paid, full
diagnostic, every finding carries a number) → Fix (conversion repaired before more
spend) → Scale (digital, out-of-home, clips).

## Capabilities and Constraints

**Pages (Brief §A4), built in this order in Phase 4:**

| Route | Linked? | Note |
|---|---|---|
| Home | yes | Agency-first, five sections |
| Digital Advertising | yes | Certifications block **not rendered** until earned |
| Revenue Recovery | yes | Copy carries over from the live site — **extract, do not rewrite** |
| Out-of-Home | yes | Three industry figures need inline sources or they are dropped |
| About | yes | |
| Contact | yes | |
| FAQ | footer | Aggregates Digital Advertising, Revenue Recovery, Out-of-Home — **no Search Intelligence questions** |
| Search Intelligence | **NO** | Built, styled, correct — and undiscoverable. See below. |
| /work | **NO** | Route may exist unlinked until one named client exists |
| Blog (Revenue Intelligence Center) | **NO** | Route built, unlinked until the first post exists |

**Search Intelligence is the load-bearing constraint on this app.** It must exist and
must NOT be linked from primary nav, footer, `sitemap.xml`, or any internal link
anywhere on the site, and it carries `<meta name="robots" content="noindex">`. It
stays reachable by direct URL only. This is a deliberate business decision — the
department behind it is being built to compete at full scale, and surfacing a smaller
version now would anchor the market's first impression. Treat it exactly like a
staging page. The launch checklist greps for links to it.

**Navigation (§A2):** Digital Advertising · Revenue Recovery · Out-of-Home ·
Z Best Clips · About · Contact. Short top-level menu, depth one layer down. **Work is
removed** until one named client exists.

**Footer (§A3):** Services / Company / Resources / Legal. Blog joins Resources with
the first post; Work joins Company with the first named client.

**Forms:** Contact (Name · Business · What are you looking to solve? · Best way to
reach you) and Get an Assessment (Name · Business · Website · Best way to reach you).

## Evidence on Hand

App-specific absences beyond the root record:

- The hero stat block shows **non-outcome facts only** — Est. 2011 · Los Angeles;
  Disciplines 4; Platforms bought across; Standard: Audit first. Evidence. Then
  scale. No illustrative outcome numbers in the hero. When a real recovered-revenue
  figure exists it replaces the top row and the counter ticks it once.
- The free leak assessment runs on a **labeled fixture** until the live tool's input
  schema is extracted.
- Search Intelligence's free AI Visibility Check is likewise UI-on-fixtures, labeled.

## Product Principles

1. **Agency-first, not Revenue-Recovery-only.** Four disciplines, one standard.
2. **Digital Advertising and Revenue Recovery are two halves of one philosophy** —
   one brings traffic, the other stops it leaking. They are never sold as competing
   options.
3. **Search Intelligence is invisible by default.** Any change touching nav, footer,
   sitemap or internal links must be checked against that.
