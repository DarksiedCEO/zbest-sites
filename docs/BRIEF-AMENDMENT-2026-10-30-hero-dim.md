# Brief amendment: the hero no longer dims (Oct 30, 2026)

**Status:** applied on branch `a11y-wcag22aa` (commit `6b3e532`). Founder-approved. It is not merged to `main`.
**Amends:** how `ZBM-ZBC-Build-Brief-v2.md` §A1's "scroll-scrubbed hero" (a lead technique, decided Aug 26) is built. It does not amend §9: the hero stays fully static under `prefers-reduced-motion`.

## Decision
**Founder decision, Oct 30 2026, 16:04:** approved removing the hero's dim for contrast. The scroll-scrubbed drift stays.

This session did not witness the approval. The coordinator relayed it.

## What changed
| | Before | Now |
|---|---|---|
| Hero motion as the page scrolls (`ScrollScrub`, `packages/ui`) | Content drifts up **and dims**: opacity goes from 1 to 0.3 over the hero's exit | Content drifts up. Opacity stays at 1. |
| Reduced motion | Static | Static (unchanged) |

The Brief's text never said "dim". §A1 says "scroll-scrubbed hero". The dim was how the original component (`scroll-scrub.tsx`) built that technique, and it shipped that way. Drift alone is still scroll-scrubbed: it moves with the scroll position, never plays on its own, and never replays. So §A1's technique is kept. This note records the change from what was built and shown.

## Why: WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA
Body text must keep at least a 4.5:1 contrast ratio while a person can read it. The Oct 30 WCAG 2.2 AA audit (finding M3) measured the hero's lead paragraph while it was still fully on screen:

- **4.18:1** at opacity 0.8;
- **2.48:1** at opacity 0.53.

Holding 4.5:1 on both page backgrounds needs opacity of at least 0.85. A fade that stops at 0.85 is too small to see, so the fade was removed instead of being reduced.

## How it is held
`e2e/tests/a11y.spec.ts` runs the test "1.4.3 hero text keeps its contrast mid-scroll (motion on)" on every PR. It scrolls the homepage hero to 150, 300 and 450 px and checks two things at each point:

- every ancestor of the hero copy has opacity 1;
- the hero passes axe `color-contrast`.

Reintroducing a dim fails the required `e2e` check. Any future dim would need a new founder decision, and it would still have to keep the text at 4.5:1.
