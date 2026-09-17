# Phase 4, Z Best Media copy revision — raw verification output

Unedited stdout/stderr of the gate run that produced commit `a5ce48e`, captured on
Darwin 25.6.0. Regenerate with the commands shown; nothing below the appendix heading is
summarized.

Scope: marketing copy and CTA routing only, from the independent copy audit at `1fc360f`.
No layout, token or component changes. The founder rulings applied are listed in
`docs/TOOLING.md`, Phase 4 ZBM chunk, founder decisions 7-9.

## Repository state at the time of the gate run

The gate ran against the working tree that became `a5ce48e`, so `git status` below is dirty
and `HEAD` is still the previous commit. This is disclosed, not hidden; post-commit state is
recorded further down and the tree was not touched between the two.

### Pre-gate state
```
=== date/env ===
2026-09-17T22:43:05Z
Darwin 25.6.0
v24.9.0
9.15.0
=== git status ===
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   apps/zbm/app/about/page.tsx
	modified:   apps/zbm/app/digital-advertising/page.tsx
	modified:   apps/zbm/app/out-of-home/page.tsx
	modified:   apps/zbm/app/page.tsx
	modified:   apps/zbm/app/revenue-recovery/page.tsx
	modified:   apps/zbm/app/search-intelligence/page.tsx
	modified:   apps/zbm/content/faq.ts
	modified:   apps/zbm/content/revenue-recovery.ts
	modified:   docs/TOOLING.md
	modified:   e2e/snapshots/phase-1/zbm-home-desktop-1440.png
	modified:   e2e/snapshots/phase-1/zbm-home-mobile-390.png
	modified:   e2e/snapshots/phase-3/zbm-home-desktop-1440.png
	modified:   e2e/snapshots/phase-3/zbm-home-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-about-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-about-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-digital-advertising-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-digital-advertising-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-home-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-out-of-home-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-out-of-home-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
	modified:   e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png
	modified:   e2e/tests/phase-4-zbm.spec.ts

no changes added to commit (use "git add" and/or "git commit -a")
=== git rev-parse HEAD ===
faafe3793b2b27708742dac4a3c1406d11876496
=== git ls-remote origin main ===
faafe3793b2b27708742dac4a3c1406d11876496	refs/heads/main
```

## Build, typecheck, gate, lint

Run from a wiped state (`.next`, `.turbo`, `playwright-report`, `test-results` removed)
so no result is a cache replay.

### `pnpm build`
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbm:build: cache miss, executing c8be413eeb826261
@zbest/zbc:build: cache miss, executing e7c35cf38dec3e4c
@zbest/zbm:build: 
@zbest/zbm:build: > @zbest/zbm@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:build: > next build
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build: > @zbest/zbc@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:build: > next build
@zbest/zbc:build: 
@zbest/zbm:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbc:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbm:build: ✓ Running next.config.ts took 12ms
@zbest/zbc:build: ✓ Running next.config.ts took 19ms
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build: ✓ Compiled successfully in 2.4s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build: ✓ Compiled successfully in 2.6s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbm:build:   Finished TypeScript in 1110ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Finished TypeScript in 1212ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (18/25) 
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 436ms
@zbest/zbm:build:   Finalizing page optimization ...
@zbest/zbm:build: 
@zbest/zbm:build: Route (app)
@zbest/zbm:build: ┌ ○ /
@zbest/zbm:build: ├ ○ /_not-found
@zbest/zbm:build: ├ ○ /about
@zbest/zbm:build: ├ ○ /about/opengraph-image
@zbest/zbm:build: ├ ƒ /api/lead
@zbest/zbm:build: ├ ○ /contact
@zbest/zbm:build: ├ ○ /contact/opengraph-image
@zbest/zbm:build: ├ ○ /dev/system
@zbest/zbm:build: ├ ○ /digital-advertising
@zbest/zbm:build: ├ ○ /digital-advertising/opengraph-image
@zbest/zbm:build: ├ ○ /faq
@zbest/zbm:build: ├ ○ /faq/opengraph-image
@zbest/zbm:build: ├   /legal/[document]
@zbest/zbm:build: │ ├ ● /legal/privacy-policy
@zbest/zbm:build: │ ├ ● /legal/terms-of-service
@zbest/zbm:build: │ └ ● /legal/cookie-policy
@zbest/zbm:build: ├ ○ /opengraph-image
@zbest/zbm:build: ├ ○ /out-of-home
@zbest/zbm:build: ├ ○ /out-of-home/opengraph-image
@zbest/zbm:build: ├ ○ /revenue-recovery
@zbest/zbm:build: ├ ○ /revenue-recovery/opengraph-image
@zbest/zbm:build: ├ ○ /robots.txt
@zbest/zbm:build: ├ ○ /search-intelligence
@zbest/zbm:build: ├ ○ /search-intelligence/opengraph-image
@zbest/zbm:build: └ ○ /sitemap.xml
@zbest/zbm:build: 
@zbest/zbm:build: 
@zbest/zbm:build: ○  (Static)   prerendered as static content
@zbest/zbm:build: ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
@zbest/zbm:build: ƒ  (Dynamic)  server-rendered on demand
@zbest/zbm:build: 
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 281ms
@zbest/zbc:build:   Finalizing page optimization ...
@zbest/zbc:build: 
@zbest/zbc:build: Route (app)
@zbest/zbc:build: ┌ ○ /
@zbest/zbc:build: ├ ○ /_not-found
@zbest/zbc:build: ├ ○ /about
@zbest/zbc:build: ├ ○ /about/opengraph-image
@zbest/zbc:build: ├ ƒ /api/lead
@zbest/zbc:build: ├ ○ /become-a-clipper
@zbest/zbc:build: ├ ○ /become-a-clipper/opengraph-image
@zbest/zbc:build: ├ ○ /brands
@zbest/zbc:build: ├ ○ /brands/opengraph-image
@zbest/zbc:build: ├ ○ /dev/system
@zbest/zbc:build: ├   /dev/system/focus/[focus]
@zbest/zbc:build: │ ├ ● /dev/system/focus/entertainment
@zbest/zbc:build: │ └ ● /dev/system/focus/brands
@zbest/zbc:build: ├ ○ /entertainment
@zbest/zbc:build: ├ ○ /entertainment/opengraph-image
@zbest/zbc:build: ├ ○ /faq
@zbest/zbc:build: ├ ○ /faq/opengraph-image
@zbest/zbc:build: ├ ○ /launch-a-campaign
@zbest/zbc:build: ├ ○ /launch-a-campaign/opengraph-image
@zbest/zbc:build: ├   /legal/[document]
@zbest/zbc:build: │ ├ ● /legal/privacy-policy
@zbest/zbc:build: │ ├ ● /legal/terms-of-service
@zbest/zbc:build: │ └ ● /legal/cookie-policy
@zbest/zbc:build: ├ ○ /media-kit
@zbest/zbc:build: ├ ○ /media-kit/opengraph-image
@zbest/zbc:build: ├ ○ /opengraph-image
@zbest/zbc:build: ├ ○ /pricing
@zbest/zbc:build: ├ ○ /pricing/opengraph-image
@zbest/zbc:build: ├ ○ /robots.txt
@zbest/zbc:build: └ ○ /sitemap.xml
@zbest/zbc:build: 
@zbest/zbc:build: 
@zbest/zbc:build: ○  (Static)   prerendered as static content
@zbest/zbc:build: ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
@zbest/zbc:build: ƒ  (Dynamic)  server-rendered on demand
@zbest/zbc:build: 

 Tasks:    2 successful, 2 total
Cached:    0 cached, 2 total
  Time:    6.032s 

```

### `pnpm typecheck`
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

@zbest/ui:typecheck: cache miss, executing 3261a0beabae47bf
e2e:typecheck: cache miss, executing 816cff2327c06e00
@zbest/zbm:typecheck: cache miss, executing 6c8889bfa9d101e1
@zbest/zbc:typecheck: cache miss, executing 10e28ff59547942a
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 
@zbest/ui:typecheck: 
@zbest/ui:typecheck: > @zbest/ui@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:typecheck: > tsc --noEmit
@zbest/ui:typecheck: 
@zbest/zbm:typecheck: 
@zbest/zbm:typecheck: > @zbest/zbm@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:typecheck: > tsc --noEmit
@zbest/zbm:typecheck: 
@zbest/zbc:typecheck: 
@zbest/zbc:typecheck: > @zbest/zbc@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:typecheck: > tsc --noEmit
@zbest/zbc:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.02s 

```

### `pnpm --filter e2e exec playwright test`
```

  ⚠  Gate running against a DIRTY tree — screenshots will not match faafe37.


Running 250 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (235ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (211ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (241ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (130ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (183ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (258ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (126ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (181ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (240ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (178ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (181ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (170ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (150ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (110ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (81ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (113ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (104ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (103ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (186ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (286ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (33ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (261ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (40ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (293ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (213ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (158ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (175ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (157ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (154ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (123ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (292ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (112ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (114ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (112ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (152ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (310ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (32ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (237ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (41ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (277ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (242ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (224ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (129ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (96ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (231ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (202ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (163ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (172ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (179ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (160ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (116ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (111ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (102ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (103ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (106ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (110ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (103ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (101ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (100ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (34ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (113ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (113ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (136ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (102ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (109ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (275ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (97ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (291ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (36ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (32ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (102ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (102ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (132ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (44ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (246ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (229ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (297ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (183ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (168ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (236ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (127ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (111ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (111ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (93ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (94ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (93ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (107ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (100ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (122ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:214:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (118ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:227:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (122ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:242:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (125ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:260:3 › Home (§A4) › How we work carries no case study cards (122ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:267:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (516ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:287:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (65ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:294:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (101ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:306:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (99ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:345:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (87ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:359:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (103ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:369:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and the case-study question withdrawn Sep 17 (102ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:377:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (293ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:416:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (32ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:427:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (31ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:436:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (33ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:447:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (31ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:460:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (94ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:478:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (80ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:489:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (177ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:513:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (365ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:538:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (95ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:551:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (85ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (83ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:569:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (102ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:590:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (100ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:598:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (51ms)
  ✓  126 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (475ms)
  ✓  127 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (575ms)
  ✓  128 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (446ms)
  ✓  129 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (235ms)
  ✓  130 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (295ms)
  ✓  131 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  132 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (562ms)
  ✓  133 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (232ms)
  ✓  134 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (288ms)
  ✓  135 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  136 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (431ms)
  ✓  137 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (306ms)
  ✓  138 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (319ms)
  ✓  139 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (316ms)
  ✓  140 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (296ms)
  ✓  141 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (219ms)
  ✓  142 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (350ms)
  ✓  143 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (221ms)
  ✓  144 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (199ms)
  ✓  145 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (208ms)
  ✓  146 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (279ms)
  ✓  147 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (446ms)
  ✓  148 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (120ms)
  ✓  149 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (384ms)
  ✓  150 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (128ms)
  ✓  151 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (399ms)
  ✓  152 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (593ms)
  ✓  153 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (321ms)
  ✓  154 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (346ms)
  ✓  155 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (313ms)
  ✓  156 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (296ms)
  ✓  157 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (215ms)
  ✓  158 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (378ms)
  ✓  159 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (203ms)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (207ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (212ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (256ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (444ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (126ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (378ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (127ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (373ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (364ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (362ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (269ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (213ms)
  -  172 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  173 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (564ms)
  ✓  174 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓  175 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (270ms)
  ✓  176 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (290ms)
  ✓  177 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (381ms)
  ✓  178 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (319ms)
  ✓  179 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (295ms)
  ✓  180 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (313ms)
  ✓  181 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓  182 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (212ms)
  ✓  183 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (196ms)
  ✓  184 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (197ms)
  ✓  185 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (213ms)
  ✓  186 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (204ms)
  ✓  187 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (205ms)
  ✓  188 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (197ms)
  ✓  189 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (195ms)
  ✓  190 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (199ms)
  ✓  191 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (121ms)
  ✓  192 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (220ms)
  ✓  193 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (214ms)
  ✓  194 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (248ms)
  ✓  195 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  196 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (196ms)
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (234ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (345ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (201ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (346ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (133ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (126ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (185ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (193ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (231ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (137ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (122ms)
  ✓  208 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (366ms)
  ✓  209 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (342ms)
  ✓  210 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (506ms)
  ✓  211 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (325ms)
  ✓  212 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓  213 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓  214 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (291ms)
  ✓  215 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (388ms)
  ✓  216 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (237ms)
  ✓  217 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (215ms)
  ✓  218 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (221ms)
  ✓  219 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (194ms)
  ✓  220 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (190ms)
  ✓  221 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (196ms)
  ✓  222 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (189ms)
  ✓  223 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (198ms)
  ✓  224 [mobile-390] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (231ms)
  ✓  225 [mobile-390] › tests/phase-4-zbm.spec.ts:214:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (220ms)
  ✓  226 [mobile-390] › tests/phase-4-zbm.spec.ts:227:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (231ms)
  ✓  227 [mobile-390] › tests/phase-4-zbm.spec.ts:242:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (234ms)
  ✓  228 [mobile-390] › tests/phase-4-zbm.spec.ts:260:3 › Home (§A4) › How we work carries no case study cards (227ms)
  ✓  229 [mobile-390] › tests/phase-4-zbm.spec.ts:267:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (516ms)
  ✓  230 [mobile-390] › tests/phase-4-zbm.spec.ts:287:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (169ms)
  ✓  231 [mobile-390] › tests/phase-4-zbm.spec.ts:294:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (207ms)
  ✓  232 [mobile-390] › tests/phase-4-zbm.spec.ts:306:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (199ms)
  ✓  233 [mobile-390] › tests/phase-4-zbm.spec.ts:345:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (193ms)
  ✓  234 [mobile-390] › tests/phase-4-zbm.spec.ts:359:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (226ms)
  ✓  235 [mobile-390] › tests/phase-4-zbm.spec.ts:369:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and the case-study question withdrawn Sep 17 (203ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:377:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (376ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:416:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (124ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:427:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (123ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:436:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (127ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:447:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (118ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:460:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (192ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:478:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (186ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:489:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (246ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:513:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (589ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:538:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (196ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:551:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (188ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (188ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:569:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (205ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:590:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (195ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:598:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (146ms)

  1 skipped
  249 passed (1.2m)
```

### `pnpm lint` — run AFTER the gate, deliberately
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
@zbest/zbm:lint: cache miss, executing 6fa43b2b0ffe6f71
@zbest/zbc:lint: cache miss, executing f9ab4110a43d3c92
@zbest/ui:lint: cache miss, executing e52bd9d9dbf323a9
e2e:lint: cache miss, executing b4882abc21b6b85e
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 
@zbest/zbc:lint: 
@zbest/zbc:lint: > @zbest/zbc@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:lint: > eslint .
@zbest/zbc:lint: 
@zbest/config:lint: 
@zbest/config:lint: > @zbest/config@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/config
@zbest/config:lint: > eslint .
@zbest/config:lint: 
@zbest/ui:lint: 
@zbest/ui:lint: > @zbest/ui@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:lint: > eslint .
@zbest/ui:lint: 
@zbest/zbm:lint: 
@zbest/zbm:lint: > @zbest/zbm@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:lint: > eslint .
@zbest/zbm:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    1.249s 

```

### `impeccable detect --json`
```
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbc/app
[]
```

## Post-commit state
```
=== post-commit git status ===
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/phase-4-zbm-copy-revision-captures.zip

nothing added to commit but untracked files present (use "git add" to track)
=== HEAD ===
a5ce48eff7cdf8893962b970272f24ddd4c1db4c
=== ls-remote ===
a5ce48eff7cdf8893962b970272f24ddd4c1db4c	refs/heads/main
=== changed vs 1fc360f ===
 apps/zbm/app/about/page.tsx                        |   9 +-
 apps/zbm/app/digital-advertising/page.tsx          |  21 ++--
 apps/zbm/app/out-of-home/page.tsx                  |  18 +--
 apps/zbm/app/page.tsx                              |  18 +--
 apps/zbm/app/revenue-recovery/page.tsx             |  38 +-----
 apps/zbm/app/search-intelligence/page.tsx          |   2 +-
 apps/zbm/content/faq.ts                            |  37 +++---
 apps/zbm/content/revenue-recovery.ts               |  89 ++++----------
 docs/TOOLING.md                                    |  23 ++++
 e2e/snapshots/phase-1/zbm-home-desktop-1440.png    | Bin 345360 -> 345709 bytes
 e2e/snapshots/phase-1/zbm-home-mobile-390.png      | Bin 1144506 -> 1142140 bytes
 e2e/snapshots/phase-3/zbm-home-desktop-1440.png    | Bin 345360 -> 345709 bytes
 e2e/snapshots/phase-3/zbm-home-mobile-390.png      | Bin 1144506 -> 1142140 bytes
 .../phase-4-zbm/zbm-about-desktop-1440.png         | Bin 190958 -> 198448 bytes
 e2e/snapshots/phase-4-zbm/zbm-about-mobile-390.png | Bin 514548 -> 522119 bytes
 .../zbm-digital-advertising-desktop-1440.png       | Bin 368683 -> 349415 bytes
 .../zbm-digital-advertising-mobile-390.png         | Bin 1142232 -> 1082814 bytes
 e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png | Bin 275150 -> 254093 bytes
 e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png   | Bin 823751 -> 761698 bytes
 .../phase-4-zbm/zbm-home-desktop-1440.png          | Bin 358694 -> 359272 bytes
 e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png  | Bin 1132271 -> 1123859 bytes
 .../phase-4-zbm/zbm-out-of-home-desktop-1440.png   | Bin 315305 -> 310663 bytes
 .../phase-4-zbm/zbm-out-of-home-mobile-390.png     | Bin 1026766 -> 1007527 bytes
 .../zbm-revenue-recovery-desktop-1440.png          | Bin 1112301 -> 904366 bytes
 .../zbm-revenue-recovery-mobile-390.png            | Bin 3646503 -> 2928537 bytes
 .../zbm-search-intelligence-desktop-1440.png       | Bin 488904 -> 481813 bytes
 .../zbm-search-intelligence-mobile-390.png         | Bin 1666953 -> 1647010 bytes
 e2e/tests/phase-4-zbm.spec.ts                      | 132 ++++++++++++++++++---
 28 files changed, 215 insertions(+), 172 deletions(-)
```

## Phase 4 ZBM screenshot artifacts

```
e2e/snapshots/phase-4-zbm/zbm-about-desktop-1440.png
  PNG image data, 1440 x 1559, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-about-mobile-390.png
  PNG image data, 1170 x 5262, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-contact-desktop-1440.png
  PNG image data, 1440 x 1969, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-contact-mobile-390.png
  PNG image data, 1170 x 6138, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-digital-advertising-desktop-1440.png
  PNG image data, 1440 x 3135, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-digital-advertising-mobile-390.png
  PNG image data, 1170 x 11562, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png
  PNG image data, 1440 x 2373, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png
  PNG image data, 1170 x 8442, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-home-desktop-1440.png
  PNG image data, 1440 x 3231, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png
  PNG image data, 1170 x 13656, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-out-of-home-desktop-1440.png
  PNG image data, 1440 x 3129, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-out-of-home-mobile-390.png
  PNG image data, 1170 x 11064, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
  PNG image data, 1440 x 7396, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
  PNG image data, 1170 x 30147, 8-bit/color RGBA, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
  PNG image data, 1440 x 4295, 8-bit/color RGB, non-interlaced
e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png
  PNG image data, 1170 x 17535, 8-bit/color RGBA, non-interlaced
```

Snapshot status after the gate run above, across all four suites:

```
$ git status --porcelain e2e/snapshots/
(no output = every screenshot is byte-identical to the committed blob)
```

Which captures changed in this revision, and which deliberately did not:

```
$ git diff --name-only faafe37..HEAD -- e2e/snapshots/
e2e/snapshots/phase-1/zbm-home-desktop-1440.png
e2e/snapshots/phase-1/zbm-home-mobile-390.png
e2e/snapshots/phase-3/zbm-home-desktop-1440.png
e2e/snapshots/phase-3/zbm-home-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-about-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-about-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-digital-advertising-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-digital-advertising-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-home-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-out-of-home-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-out-of-home-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png

$ git diff --name-only faafe37..HEAD -- e2e/snapshots/phase-4-zbm/ | wc -l
      14
```

14 of the 16 Phase 4 ZBM PNGs changed — every ZBM page except Contact, which is
byte-identical because the nav and footer carry no assessment CTA and its own copy was
not touched. The ZBM home page is also captured by the phase-1 and phase-3 suites, so
four more PNGs change there, 18 in total.

### Capture zip

```
$ (cd e2e/snapshots/phase-4-zbm && ls *.png | sort | zip -X -q ../../../docs/phase-4-zbm-copy-revision-captures.zip -@)
$ unzip -l docs/phase-4-zbm-copy-revision-captures.zip
Archive:  docs/phase-4-zbm-copy-revision-captures.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   198448  09-17-2026 15:43   zbm-about-desktop-1440.png
   522119  09-17-2026 15:44   zbm-about-mobile-390.png
   158901  09-17-2026 15:43   zbm-contact-desktop-1440.png
   427451  09-17-2026 15:44   zbm-contact-mobile-390.png
   349415  09-17-2026 15:43   zbm-digital-advertising-desktop-1440.png
  1082814  09-17-2026 15:44   zbm-digital-advertising-mobile-390.png
   254093  09-17-2026 15:43   zbm-faq-desktop-1440.png
   761698  09-17-2026 15:44   zbm-faq-mobile-390.png
   359272  09-17-2026 15:43   zbm-home-desktop-1440.png
  1123859  09-17-2026 15:44   zbm-home-mobile-390.png
   310663  09-17-2026 15:43   zbm-out-of-home-desktop-1440.png
  1007527  09-17-2026 15:44   zbm-out-of-home-mobile-390.png
   904366  09-17-2026 15:43   zbm-revenue-recovery-desktop-1440.png
  2928537  09-17-2026 15:44   zbm-revenue-recovery-mobile-390.png
   481813  09-17-2026 15:43   zbm-search-intelligence-desktop-1440.png
  1647010  09-17-2026 15:44   zbm-search-intelligence-mobile-390.png
---------                     -------
 12517986                     16 files
$ shasum -a 256 docs/phase-4-zbm-copy-revision-captures.zip e2e/snapshots/phase-4-zbm/*.png
8e8cb146ced7ed5cc91f2c80b0f208d214d77d6a01b818f0ee96c24f0a64fd00  docs/phase-4-zbm-copy-revision-captures.zip
a8785f0f8d3ccd565e90c8c79958a3a965df61f35694e012d83ac29c95a94819  e2e/snapshots/phase-4-zbm/zbm-about-desktop-1440.png
13f2321e040812a2861646f379fdde5816c1421ae63cde9365db7b3bed745573  e2e/snapshots/phase-4-zbm/zbm-about-mobile-390.png
3edb0ffef0c356a1f5fb6c4a8f0bcf6ce93e6bb3ed28f0fe3f585318f840c985  e2e/snapshots/phase-4-zbm/zbm-contact-desktop-1440.png
d3cf139d49a08d6a3e8505c5b66b0d083e99df275068756e5c295559f6d16550  e2e/snapshots/phase-4-zbm/zbm-contact-mobile-390.png
d1958a78bbc2b0dc958d5c3a3e1224c6655c27f6b7e85841bc9c358319d5b1bf  e2e/snapshots/phase-4-zbm/zbm-digital-advertising-desktop-1440.png
3a35d3559cadd9808211e440fe9bbe1668581f478806ac872932cec866aca13a  e2e/snapshots/phase-4-zbm/zbm-digital-advertising-mobile-390.png
2cf9737e39239958ce1d5e11e5c9b852071289b9162b94052b104ad636a535b6  e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png
da95ea0b9470c99798ed96f4cb9b9d750e2c903f9d8f76bbdd8e604e1ac5dd2a  e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png
eb8869da43fd4404406e6fe7a717d5b300f86942a748578c8c2519bf597f1428  e2e/snapshots/phase-4-zbm/zbm-home-desktop-1440.png
62d9a827aed9499b671e7420c3a014f59348c15b13deb570750e23e3920ce692  e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png
f0d983220c627b546adc0c23ce786c3b2b7f560a94892292beb7bb0085dd1d14  e2e/snapshots/phase-4-zbm/zbm-out-of-home-desktop-1440.png
ab5bfa0a7f8c49554193d3bd8a18e70e16f7b569f095ad2fd41c60db5f536b02  e2e/snapshots/phase-4-zbm/zbm-out-of-home-mobile-390.png
d992794418b1bea2bcafd0a58f7ff96a72fd2288730b422bdb5e4a5a925c2571  e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
4df60c42a954475c498a1452ee43113ed8c3f6210aba605c9a1899d757703e32  e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
ad991f3a3b77c4fed2cd6c822902986e11cdc2274455245c3d37717a2fe399b5  e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
cdca7500d64b369919711f9308c6ec9a17f317f1a4ea4b0cab957908f81513e9  e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png
```

The previous bundle (`docs/phase-4-zbm-captures.zip`, `docs/phase-4-zbm-verification-log.md`,
sha256 `0a361f7b…`) is left in place unchanged so the evidence for `364abb8` is not destroyed.

## Appended after capture

Everything above this heading is the unedited capture. The items below are appended, not
substituted.

### The fourteen changes, and where each one landed

| # | Ruling | Evidence |
|---|---|---|
| 1 | ZBM is an agency, not positioned against one | `COMPARISON` deleted from `apps/zbm/content/revenue-recovery.ts`; `"Why us"` section deleted from `apps/zbm/app/revenue-recovery/page.tsx`; FAQ question replaced in `apps/zbm/content/faq.ts:55` |
| 2 | One process, not two | `METHOD` deleted from `content/revenue-recovery.ts`; `#method` section deleted from the page; no replacement added |
| 3 | No number promises the deliverable does not make | Home step 02 `app/page.tsx:139`; RR Implementation body `content/revenue-recovery.ts`; engagements headline `content/revenue-recovery.ts`; pricing FAQ `content/faq.ts:52` |
| 4 | Founding year and media buys are not literally true | `Est.` row removed and label changed `app/page.tsx:50-52`; OOH hero, FAQ answer and meta description in `app/out-of-home/page.tsx` and `content/faq.ts:83` |
| 5 | About h1 | `app/about/page.tsx` — "An advertising agency built on evidence, not promises." |
| 6 | Digital Advertising hero pairing sentence | `app/digital-advertising/page.tsx` |
| 7 | CTA routing | assessment primary on `/` and `/revenue-recovery` only; Talk to Us primary on `/digital-advertising`, `/out-of-home`, `/about`; `ASSESSMENT_HREF` import dropped from those three; RR form section title now "Request your free assessment." |
| 8 | "Are your case studies real?" withdrawn | `content/faq.ts` |
| 9 | "How many accounts does my strategist manage?" withdrawn | `content/faq.ts` |
| 10 | Leak Library intro | `content/revenue-recovery.ts:46` |
| 11 | OOH cross-operator line | `app/out-of-home/page.tsx` |
| 12 | Home How-we-work bodies capitalized | `app/page.tsx:138-141` |
| 13 | Search Intelligence attribution line | `app/search-intelligence/page.tsx` — page stays unlinked, noindex, absent from sitemap (asserted by the gate) |
| 14 | Record | `docs/TOOLING.md`, Phase 4 ZBM founder decisions 7, 8, 9 |

### Revenue Recovery section count

**Six sections**, as intended: the hero, then Where revenue leaks, the Revenue Leak Library,
Industry Leak Patterns, the Audit Deliverable, and How Engagements Work. The FAQ accordion and
the assessment form sit below them and are not counted as content sections. Was eight before
this revision; the Method and "Why us" are the two that went.

Counted mechanically, `PageSection` elements in the file go from nine to seven:

```
$ grep -c "<PageSection" apps/zbm/app/revenue-recovery/page.tsx
7
$ git show faafe37:apps/zbm/app/revenue-recovery/page.tsx | grep -c "<PageSection"
9
```

### Disclosures

1. **The first gate run failed and is not the run recorded above.** Four tests failed
   (`Revenue Recovery FAQ` and `FAQ (§A4)`, both viewports) because the new expected FAQ count
   was written as 5 when the correct count is 6 — the traditional-agency question was
   *replaced*, not removed, so only one question left that block. The spec was corrected and
   the entire gate re-run from a wiped state; the output above is that second run. The error
   was in the test expectation, not in the shipped copy, and the gate caught it.
2. **No mutation run this round.** The Phase 4 ZBM and ZBC chunks each carried one; this
   revision does not. The negative assertions added to `phase-4-zbm.spec.ts` (the ten-item
   "gone" list, the FAQ withdrawals, the no-assessment-link checks) were verified only by
   passing against the revised tree, not by deliberately reintroducing the removed copy.
3. **The two founder facts behind change 4 cannot be verified from this repository.** There is
   no invoice, platform account, insertion order or any other artifact here that bears on
   whether ZBM bought media on those six platforms or was founded in 2011. Both claims
   originated in the locked brief (§A4:267 and :270, and :670/:674 for the ZBC boilerplate)
   and are recorded in `PRODUCT.md:66-68`. The change was made on the founder's explicit
   instruction of 2026-09-17 that neither is literally true. That instruction is the only
   evidence for it.
4. **Z Best Clips still asserts both facts and was deliberately not touched:**
   `apps/zbc/app/media-kit/page.tsx:42` ("an advertising agency founded in 2011") and `:56`
   ("Parent — Z Best Media, est. 2011, Los Angeles"). The shared design-system gallery repeats
   the retired stat row at `packages/ui/src/dev/system-gallery.tsx:172`. Three open items,
   recorded in `docs/TOOLING.md` decision 9.
5. **`PRODUCT.md` and the locked brief still carry the old wording.** They are records of what
   the brief said, so they were left intact rather than edited; the divergence is recorded in
   `docs/TOOLING.md` so it does not read as drift.
6. **Legal pages, the backend contract and Phase 5 are untouched.** No ZBC file changed. The
   held-line checks ("60 sec", "one quantified leak") are unchanged and still enforced.
