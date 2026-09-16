---
name: Z Best Media & Z Best Clips
description: Two sibling brands on one design system — editorial, ledger-driven, evidence-first.
colors:
  zbm-base: "#0E0F12"
  zbm-panel: "#16181D"
  zbm-accent: "#C99A4B"
  zbm-accent-2: "#4C8C88"
  zbc-base: "#0B0D10"
  zbc-ent: "#FF6B5B"
  zbc-brand: "#4C8CFF"
  zbc-panel: "#13151A"
  text-primary: "#EDEBE6"
  text-secondary: "#8B8F98"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
  kinetic:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
---

# Design System: Z Best Media & Z Best Clips

> **Authority.** This root file is the only place tokens live. `apps/zbm/DESIGN.md`
> and `apps/zbc/DESIGN.md` name which brand scope applies and the page-level
> vernacular; they define no new tokens and override nothing here. If a value is
> needed that is not at root, **add it at root.**
>
> Every value below is transcribed from `docs/ZBM-ZBC-Build-Brief-v2.md` §A1, §B1
> and §2.2, which are **locked**. Do not re-ideate them. The one exception is
> `zbc-panel`, marked DERIVED below.
>
> The implementation of these tokens is `packages/ui/src/styles/tokens.css`.

## Overview

**Creative North Star: "The audited ledger"**

Two sibling brands, one standard. Z Best Media is an advertising agency whose entire
claim is that its work can be audited — so the interface is built from the furniture
of a financial audit: hairline rules that behave as literal ledger lines between data
rows, tabular numerals that align down a column, and editorial typography with real
scale contrast rather than decoration. Every visual choice should read as *"we show
you evidence,"* not as generic SaaS.

Z Best Clips is the creator-distribution arm, and reads as a sibling rather than a
clone: it keeps IBM Plex Mono, the shared text colors and the ledger rule, and swaps
the headline face for something kinetic. Its vernacular is literal to what a clipping
campaign actually is — video timelines, scrubbers, view-count tickers. Its layout is
more asymmetric and dynamic than ZBM's.

Restraint is the load-bearing decision on both sites. Each page gets exactly **one**
signature motion moment and is otherwise still. The two lead techniques are a
scroll-scrubbed hero and monumental editorial typography; everything else holds
position.

**Key Characteristics:**
- Editorial typography with real scale contrast — not uniform SaaS sizing
- Hairline dividers used as literal ledger rules between data rows
- Tabular numerals everywhere a number appears
- Asymmetric grids that resolve cleanly on mobile
- One signature motion moment per page, restraint everywhere else
- Mobile-first: every page is built at 390 and then widened

## Colors

Both brands sit on a near-black base with a single warm or cool accent doing narrow,
deliberate work. Nothing here is a gradient.

### Z Best Media (Brief §A1)

- **Base** (`#0E0F12`): page base.
- **Panel** (`#16181D`): panel / card surface.
- **Accent — muted brass / ledger gold** (`#C99A4B`): primary accent.
- **Accent 2 — desaturated teal** (`#4C8C88`): secondary accent, data and charts.

### Z Best Clips (Brief §B1)

- **Base** (`#0B0D10`): page base — a sibling of ZBM's `#0E0F12`, deliberately a
  distinct value rather than the same black.
- **Entertainment accent — warm, energetic** (`#FF6B5B`).
- **Brands accent — cool, trustworthy** (`#4C8CFF`).
- **Panel** (`#13151A`): **DERIVED, NOT FROM THE BRIEF.** §B1 specifies no panel
  surface for ZBC, but `Card` is a shared primitive (§1.2) and needs one under both
  brands. Holds the same base-to-panel step as ZBM. **Confirm or replace in Phase 2;
  do not treat as locked.**

### Neutral (shared by both brands — Brief §A1, §B1)

- **Text primary** (`#EDEBE6`).
- **Text secondary** (`#8B8F98`).

### Named Rules

**The Functional Color Rule.** On Z Best Clips, Entertainment and Brands are
structurally different services — rented versus owned distribution — so their
color-coding is functional, not decorative. The distinction must carry through page
accent, nav dropdown, CTA color and card edge. Never use one accent because it
looks better in a composition.

**The Evidence Rule.** No outcome number ships without a source. If a number
describes a result and is not verified, it carries the `IllustrativeBadge` or it
does not ship at all.

## Typography

**Display Font (ZBM):** Fraunces — headlines
**Display Font (ZBC):** Bricolage Grotesque — headlines; kinetic, distinctive
**Body Font (both):** IBM Plex Sans
**Label/Mono Font (both):** IBM Plex Mono — all numbers and stats

**Character:** Fraunces gives ZBM an editorial, set-in-print seriousness that suits a
company selling auditability. Bricolage Grotesque gives ZBC motion and edge without
leaving the family. IBM Plex Mono on every number in both products is the deliberate
sibling link between the two brands — it is the single clearest signal that these are
one company.

### Hierarchy

Not yet established. The type scale is **Phase 2** work (§3.2) and is recorded here
once built. Do not invent sizes before then.

### Named Rules

**The Tabular Rule.** `font-variant-numeric: tabular-nums` is required on every
number — this is ledger alignment, not a preference. It is applied to the mono face
itself in `tokens.css` rather than left to call sites.

**The Sibling Rule.** IBM Plex Mono is shared across both brands on purpose. Never
substitute a different numeric face on one site.

## Layout

**Z Best Media:** left-aligned and grid-driven. Hairline dividers act as literal
ledger rules between data rows. The hero is asymmetric — claim left, stat block right
— and stacks claim-then-stats on mobile.

**Z Best Clips:** more asymmetric and dynamic than ZBM. *How It Works* uses a
horizontal timeline/scrubber device as its structural divider, justified because that
content is genuinely sequential. On mobile the scrubber becomes a vertical timeline.

**Mobile-first is literal here.** Build every page at 390 first, then widen. Both
viewports are screenshotted at 1440 and 390 before a phase can close (§3, §9).

The spacing scale is **Phase 2** work (§3.2).

## Elevation & Depth

No shadow vocabulary. Depth is carried by the base/panel value step and by hairline
rules, not by drop shadows — a ledger is flat. Cards are distinguished by surface
value and a single-pixel edge, never by lift.

## Shapes

Form language is **Phase 2** work (§3.2). The governing constraint is already fixed:
a hairline rule is the primary structural device on both sites, and it reads as a
ruled line in a ledger, not as a decorative separator.

## Components

Owned by `packages/ui` (§1.2) and built in **Phase 2** (§3.2), not before:
`LedgerRule`, `Counter`, `StatBlock`, `Nav`, `Footer`, `Card`, `FAQ`,
`CookieConsent`, `IllustrativeBadge`.

Behavior already locked by the brief:

- **Counter** — ticks up **once** on viewport entry. Not on hover, not on a loop.
  Fully disabled under `prefers-reduced-motion`.
- **Nav** — sticky, short top-level menu, dropdown depth of exactly one layer.
- **FAQ** — an accessible accordion, keyboard operable.
- **CookieConsent** — must allow rejecting non-essential cookies (CCPA/CPRA
  posture) and links to the Cookie Policy shell.
- **IllustrativeBadge** — attached to every unverified number, everywhere it
  appears. This is a stated integrity standard, not a suggestion.

### Signature motion

**Z Best Media:** one moment only — a counter that ticks up once when scrolled into
view. **Z Best Clips:** an animated view-counter ticking up once per campaign
example, restrained to one moment per section.

`prefers-reduced-motion` disables every counter tick and the scroll-scrubbed hero.
Content must be fully readable with motion off.

## Do's and Don'ts

### Do:
- **Do** use editorial typography with real scale contrast.
- **Do** use ledger rules as structure.
- **Do** use tabular numerals on every number.
- **Do** use asymmetric grids that resolve on mobile.
- **Do** allow one signature motion moment per page — and restraint everywhere else.
- **Do** keep Entertainment and Brands visually distinct throughout ZBC.
- **Do** label illustrative content with `IllustrativeBadge` wherever it appears.

### Don't:

*Transcribed verbatim from Brief §2.2 anti-references. These are prohibitions, not
preferences.*

- **Don't** build Inter-on-dark SaaS.
- **Don't** use purple-to-blue gradients.
- **Don't** nest cards inside cards.
- **Don't** put rounded icon tiles above every heading.
- **Don't** fade-and-slide-up on every section.
- **Don't** put hover effects on everything.
- **Don't** build a hero with a floating dashboard mockup.
- **Don't** add "Trusted by" logo rows — there are none yet.
- **Don't** use custom cursors.
- **Don't** use 3D tilt cards.

Additional prohibitions from §7 and §9:

- **Don't** use stock photography. No imagery is required at launch; the design
  system carries the pages.
- **Don't** reintroduce the legacy flaming-Z masthead or the horse mark. Both are
  retired.
- **Don't** name real companies, leagues or studios anywhere on Z Best Clips —
  category language only. The launch checklist greps for a blocklist.
- **Don't** put clipper-side payout splits on buyer-facing pages, or bundled
  client pricing on clipper-facing pages. The two must never cross-contaminate.
- **Don't** render the Digital Advertising certifications block until earned.
  Hidden means **not rendered**, not `display:none`.
- **Don't** link Search Intelligence from nav, footer, `sitemap.xml`, or any
  internal link. It stays `noindex` and direct-URL-only until the §8 reveal.
- **Don't** fill the "How we work" section with representative case studies. Until
  real ones exist it carries no case study cards at all.
