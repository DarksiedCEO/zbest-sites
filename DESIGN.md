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
> and §2.2, which are **locked**. Do not re-ideate them. The single amendment is
> `zbc-panel`, approved by the founder at Phase 1 close and marked as such below.
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
- **Panel** (`#13151A`): panel / card surface. **§B1 amendment, approved by the
  founder at Phase 1 close.** §B1 as written specifies no panel surface for ZBC, but
  `Card` is a shared primitive (§1.2) and needs one under both brands. Holds the same
  base-to-panel step as ZBM.

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

Built in Phase 2 as semantic classes in `packages/ui/src/styles/type.css`. Reach for
the **role**, not a size — `text-4xl` picks a number, `.type-display` picks a role and
keeps the contrast. Every value is mobile-first: the clamp minimum is the 390 value.

| Class | Size | Line height | Purpose |
|---|---|---|---|
| `.type-display` | `clamp(2.75rem, 7.5vw, 6.25rem)` | 0.95 | Monumental editorial display — one per page |
| `.type-headline` | `clamp(1.875rem, 4vw, 3rem)` | 1.05 | Section headline |
| `.type-title` | `clamp(1.25rem, 1.8vw, 1.5rem)` | 1.2 | Card and row titles |
| `.type-body-lead` | `clamp(1.0625rem, 1.35vw, 1.25rem)` | 1.55 | Lead paragraph, max 62ch |
| `.type-body` | `1rem` | 1.65 | Body copy, max 68ch |
| `.type-small` | `0.875rem` | 1.55 | Captions and notes |
| `.type-label` | `0.75rem` | 1.2 | Mono, uppercase, `0.08em` tracking |
| `.type-stat` | `clamp(1.5rem, 2.6vw, 2.125rem)` | 1.1 | Mono figures, tabular |
| `.type-mono` | `0.9375rem` | 1.5 | Mono inline values |

The display-to-title ratio is deliberately over 2×; the Phase 2 gate asserts it,
because a gentle ramp is what makes a page read as generic SaaS.

### Variable-font axes — set in Phase 2, with the type scale

`next/font` loads only the `wght` axis by default, which is why Bricolage Grotesque
currently renders as a fairly neutral grotesque rather than the "kinetic,
distinctive" face §B1 calls for. Founder decision at Phase 1 close — apply these to
the **headline** face when the type scale lands, not before:

| Axis | Value |
|---|---|
| `wght` | 700–800 |
| `opsz` | 96 |
| `wdth` | 100 |

Fraunces' own optional axes (`SOFT`, `WONK`, `opsz`) are not decided; leave them at
their defaults unless the type scale work shows a reason.

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

**Spacing rhythm** (Phase 2, in `packages/config/tailwind/preset.css`). Named so a
page cannot quietly invent a seventh vertical gap. Tailwind's numeric scale stays
available for component-level work.

| Token | Value | Use |
|---|---|---|
| `--spacing-gutter` | `1.5rem` | Side gutter at 390 |
| `--spacing-gutter-wide` | `4rem` | Side gutter at 1440 |
| `--spacing-section` | `4.5rem` | Between sections, mobile |
| `--spacing-section-lg` | `7.5rem` | Between sections, desktop |
| `--spacing-stack` | `2.5rem` | Between blocks inside a section |
| `--spacing-ledger` | `1.125rem` | Ledger row padding |

**Name spacing keys carefully.** Tailwind v4 emits a utility per key across several
namespaces, including `inline-<key>`. A key named `block` therefore emits
`.inline-block { inline-size: … }`, which silently shadows the display utility — see
`docs/TOOLING.md` for what that cost.

**Motion tokens:** `--ease-ledger` `cubic-bezier(0.22, 0.61, 0.36, 1)`,
`--duration-tick` `1100ms`, `--duration-reveal` `420ms`. There is deliberately no
hover-transition token; hover effects on everything is an anti-reference (§2.2).

## Elevation & Depth

No shadow vocabulary. Depth is carried by the base/panel value step and by hairline
rules, not by drop shadows — a ledger is flat. Cards are distinguished by surface
value and a single-pixel edge, never by lift.

## Shapes

Form language is **Phase 2** work (§3.2). The governing constraint is already fixed:
a hairline rule is the primary structural device on both sites, and it reads as a
ruled line in a ledger, not as a decorative separator.

## Components

Owned by `packages/ui` (§1.2) and built in Phase 2 (§3.2): `LedgerRule`, `Counter`,
`StatBlock`, `Nav`, `Footer`, `Card`, `FAQ`, `CookieConsent`, `IllustrativeBadge`.
All of them render together on the unlinked, noindex `/dev/system` route in both
apps — the §3.2 gallery option.

Behavior locked by the brief and implemented:

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
