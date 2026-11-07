# Design System: Z Best Clips

> **This file defines no tokens.** The root `DESIGN.md` is the only place tokens
> live. This file names which brand scope applies and the page-level vernacular.
> If a value is needed that is not at root, **add it at root** — do not add it here.

## Overview

**Brand scope: `[data-brand="zbc"]`** — see root `DESIGN.md` → Colors → Z Best Clips
for the token values, and `packages/ui/src/styles/tokens.css` for the implementation.

**Headline face:** Bricolage Grotesque — kinetic, distinctive. **Body:** IBM Plex
Sans. **Numbers:** IBM Plex Mono, shared with Z Best Media as the deliberate sibling
link. Loaded via `@zbest/ui/fonts/zbc`, which excludes Fraunces so this app never
self-hosts the sibling brand's display face.

**Endorsement line**, in the wordmark lockup and the footer: *Z Best Clips, by Z Best
Media*, linking to the ZBM site.

## The accent system: Entertainment vs Brands

This is the one structural difference from Z Best Media and the reason ZBC has two
accents rather than one. Entertainment and Brands are **structurally different
services** — rented versus owned distribution — so the color-coding is functional,
not decorative.

`[data-focus="entertainment"]` and `[data-focus="brands"]` swap `--accent` and
`--accent-2` within their scope. Page default is Entertainment. The distinction must
carry through **all four** of: page accent, nav dropdown, CTA color, and card edge —
a page that only recolors its heading has not implemented this.

Token values for both accents are at root. Never pick one because it composes better.

**Two scopes, implemented in Phase 3** (`packages/ui/src/styles/tokens.css`,
`packages/ui/src/focus.ts`):

- **Page scope — `data-page-focus` on a page's `<main>`.** Recolors the whole document
  through `:has()`, including the nav CTA, consent banner and footer that live in the
  root layout outside `<main>`. Server-rendered, no script, no flash. The Entertainment
  and Brands pages (Phase 4) set this and nothing else.
- **Subtree scope — `data-focus` on an element.** Recolors that element and its
  descendants only, and wins over the page scope inside it. Dropdown entries and mixed
  pages (How It Works shows both models) use this.

Pages with neither keep the Entertainment default. Specimens of both scopes, unlinked
and noindex, are at `/dev/system/focus/entertainment` and `/dev/system/focus/brands`.

## Page-level vernacular: the timeline / the scrubber

Literal to what a clipping campaign actually is — video timelines, scrubbers,
view-count tickers:

- **How It Works uses a horizontal timeline/scrubber device** as its structural
  divider. This is justified because that content is genuinely sequential — it is not
  a decorative flourish, and it does not get reused on pages whose content is not.
  At 390 the scrubber becomes a **vertical timeline.**
- **Layout is more asymmetric and dynamic than ZBM's**, while keeping the shared
  ledger rule and the shared numeric face.
- **The showpiece** [FD-VISUAL-01 §5] on How It Works is "One source, dozens of
  clips": a source frame splits into vertical clips, and the step timeline is driven
  by a scroll scrubber. The view-counters still tick up once per campaign example.

## Layout

Mobile-first: build at 390, then widen. The type and spacing scales are Phase 2 work
and are recorded at root once built.

## Do's and Don'ts

The §2.2 anti-references at root apply in full. App-specific additions:

### Do:
- **Do** carry the Entertainment/Brands distinction through page accent, nav
  dropdown, CTA color and card edge.
- **Do** attach the `IllustrativeBadge` to all three How It Works example cards —
  "Illustrative example — not a client result."
- **Do** build the footer so columns can be added without layout changes; Services,
  Campaigns and Platforms columns arrive in batches post-launch.

### Don't:
- **Don't** name real companies, leagues or studios anywhere. Category language only.
- **Don't** show clipper payout splits on the client-facing Pricing page.
- **Don't** remove the honesty note from Launch a Campaign.
- **Don't** reuse the scrubber device on pages whose content is not sequential.
