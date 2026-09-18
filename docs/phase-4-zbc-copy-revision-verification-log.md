# Phase 4, Z Best Clips copy revision — raw verification output

Unedited stdout/stderr of the gate run that produced commit `a411e72`. Regenerate with the
commands shown; nothing below the appendix heading is summarized.

Scope: the three gate conditions and the copy audit from the CONDITIONAL verdict on the ZBC
chunk at `c35ee1d`. `apps/zbm` was not touched. The founder ruling on the Media Kit "Founder"
row (remove it) was taken in the build window before any edit.

## Build, typecheck, gate, lint

Run from a wiped state so no result is a cache replay.

### `pnpm build`
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbc:build: cache miss, executing d97c346ef57e882e
@zbest/zbm:build: cache miss, executing fd6772ee1e7bf58a
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
@zbest/zbc:build: ✓ Running next.config.ts took 12ms
@zbest/zbc:build: 
@zbest/zbm:build: 
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build: ✓ Compiled successfully in 2.8s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build: ✓ Compiled successfully in 2.9s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbm:build:   Finished TypeScript in 1095ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Finished TypeScript in 1118ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (18/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 338ms
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
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 290ms
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
  Time:    6.321s 

```

### `pnpm typecheck`
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

e2e:typecheck: cache miss, executing 501f9ff966eecb8d
@zbest/ui:typecheck: cache miss, executing 0f571858f6885de2
@zbest/zbc:typecheck: cache miss, executing 727c305517e12a2e
@zbest/zbm:typecheck: cache miss, executing 850f0281d942d7d6
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 
@zbest/zbm:typecheck: 
@zbest/zbm:typecheck: > @zbest/zbm@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:typecheck: > tsc --noEmit
@zbest/zbm:typecheck: 
@zbest/ui:typecheck: 
@zbest/ui:typecheck: > @zbest/ui@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:typecheck: > tsc --noEmit
@zbest/ui:typecheck: 
@zbest/zbc:typecheck: 
@zbest/zbc:typecheck: > @zbest/zbc@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:typecheck: > tsc --noEmit
@zbest/zbc:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    924ms 

```

### `pnpm --filter e2e exec playwright test`
```

Running 258 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (231ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (208ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (226ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (119ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (161ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (231ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (117ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (174ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (208ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (173ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (174ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (169ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (148ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (102ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (80ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (95ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (95ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (102ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (177ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (266ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (33ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (241ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (42ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (273ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (234ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (157ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (169ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (153ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (150ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (119ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (290ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (109ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (112ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (110ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (152ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (289ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (35ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (228ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (39ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (255ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (221ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (219ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (120ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (95ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (224ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (159ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (184ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (195ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (171ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (177ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (228ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (117ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (97ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (99ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (98ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (104ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (101ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (97ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (97ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (101ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (110ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (107ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (93ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (102ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (273ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (85ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (291ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (35ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (89ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (352ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (361ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (170ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (111ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (95ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (130ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (44ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (30ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (206ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (220ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (146ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (164ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (223ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (117ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (107ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (101ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (94ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (91ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (93ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (94ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (94ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (111ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:214:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (101ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:227:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (117ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:242:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (117ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:260:3 › Home (§A4) › How we work carries no case study cards (106ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:267:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (504ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:287:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (64ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:294:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (97ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:306:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (92ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:345:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (83ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:359:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (101ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:369:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and the case-study question withdrawn Sep 17 (89ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:377:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (293ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:416:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (32ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:427:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (30ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:436:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (32ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:447:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (30ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:460:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (92ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:478:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (82ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:489:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (172ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:513:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (353ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:538:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (93ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:554:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (82ms)
  ✓  126 [desktop-1440] › tests/phase-4-zbm.spec.ts:563:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (79ms)
  ✓  127 [desktop-1440] › tests/phase-4-zbm.spec.ts:572:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (96ms)
  ✓  128 [desktop-1440] › tests/phase-4-zbm.spec.ts:593:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (92ms)
  ✓  129 [desktop-1440] › tests/phase-4-zbm.spec.ts:601:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (47ms)
  ✓  130 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (449ms)
  ✓  131 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (542ms)
  ✓  132 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (425ms)
  ✓  133 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (225ms)
  ✓  134 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (269ms)
  ✓  135 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  136 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (566ms)
  ✓  137 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (217ms)
  ✓  138 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (275ms)
  ✓  139 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  140 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (407ms)
  ✓  141 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (294ms)
  ✓  142 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (310ms)
  ✓  143 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (281ms)
  ✓  144 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (291ms)
  ✓  145 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (207ms)
  ✓  146 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (338ms)
  ✓  147 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (207ms)
  ✓  148 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (195ms)
  ✓  149 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (208ms)
  ✓  150 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (243ms)
  ✓  151 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (417ms)
  ✓  152 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (115ms)
  ✓  153 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (354ms)
  ✓  154 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (126ms)
  ✓  155 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (381ms)
  ✓  156 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (579ms)
  ✓  157 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (280ms)
  ✓  158 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (306ms)
  ✓  159 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (272ms)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (261ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (205ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (332ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (196ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (203ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (204ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (228ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (423ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (115ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (335ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (130ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (383ms)
  ✓  172 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (353ms)
  ✓  173 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (355ms)
  ✓  174 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (262ms)
  ✓  175 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (193ms)
  -  176 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  177 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (537ms)
  ✓  178 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (265ms)
  ✓  179 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓  180 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (270ms)
  ✓  181 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (381ms)
  ✓  182 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (312ms)
  ✓  183 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (311ms)
  ✓  184 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (307ms)
  ✓  185 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (260ms)
  ✓  186 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (205ms)
  ✓  187 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (192ms)
  ✓  188 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (188ms)
  ✓  189 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (194ms)
  ✓  190 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (191ms)
  ✓  191 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (193ms)
  ✓  192 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (188ms)
  ✓  193 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (187ms)
  ✓  194 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (193ms)
  ✓  195 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (118ms)
  ✓  196 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (210ms)
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (199ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (234ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (190ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (197ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (326ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (180ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (311ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (120ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (116ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (179ms)
  ✓  208 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (500ms)
  ✓  209 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (508ms)
  ✓  210 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (279ms)
  ✓  211 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (209ms)
  ✓  212 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (187ms)
  ✓  213 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (219ms)
  ✓  214 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (129ms)
  ✓  215 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (118ms)
  ✓  216 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (355ms)
  ✓  217 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (325ms)
  ✓  218 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (487ms)
  ✓  219 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (321ms)
  ✓  220 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (246ms)
  ✓  221 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (254ms)
  ✓  222 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓  223 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (367ms)
  ✓  224 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (224ms)
  ✓  225 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (204ms)
  ✓  226 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (206ms)
  ✓  227 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (190ms)
  ✓  228 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (189ms)
  ✓  229 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (184ms)
  ✓  230 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (185ms)
  ✓  231 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (187ms)
  ✓  232 [mobile-390] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (209ms)
  ✓  233 [mobile-390] › tests/phase-4-zbm.spec.ts:214:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (209ms)
  ✓  234 [mobile-390] › tests/phase-4-zbm.spec.ts:227:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (219ms)
  ✓  235 [mobile-390] › tests/phase-4-zbm.spec.ts:242:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (219ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:260:3 › Home (§A4) › How we work carries no case study cards (210ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:267:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (592ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:287:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (163ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:294:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (194ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:306:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (217ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:345:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (189ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:359:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (215ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:369:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and the case-study question withdrawn Sep 17 (193ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:377:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (389ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:416:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (122ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:427:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (114ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:436:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (119ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:447:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (112ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:460:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (184ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:478:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (178ms)
  ✓  251 [mobile-390] › tests/phase-4-zbm.spec.ts:489:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (238ms)
  ✓  252 [mobile-390] › tests/phase-4-zbm.spec.ts:513:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (526ms)
  ✓  253 [mobile-390] › tests/phase-4-zbm.spec.ts:538:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (188ms)
  ✓  254 [mobile-390] › tests/phase-4-zbm.spec.ts:554:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (180ms)
  ✓  255 [mobile-390] › tests/phase-4-zbm.spec.ts:563:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (181ms)
  ✓  256 [mobile-390] › tests/phase-4-zbm.spec.ts:572:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (190ms)
  ✓  257 [mobile-390] › tests/phase-4-zbm.spec.ts:593:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (189ms)
  ✓  258 [mobile-390] › tests/phase-4-zbm.spec.ts:601:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (132ms)

  1 skipped
  257 passed (1.2m)
```

### `pnpm lint`
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
e2e:lint: cache miss, executing 332a82ebc1aa48e2
@zbest/ui:lint: cache miss, executing a7535a17ff5ec719
@zbest/zbc:lint: cache miss, executing 211692a3aa349796
@zbest/zbm:lint: cache miss, executing dafd56901c3bd5d6
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
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    1.59s 

```

### `impeccable detect --json`
```
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbc/app
[]
```

## Repository state after commit
```
$ git rev-parse HEAD
a411e72d4bdad5f96bc25f5028bc0381dbdb7f4c
$ git status --porcelain
?? docs/phase-4-zbc-copy-revision-captures.zip
?? docs/phase-4-zbc-copy-revision-verification-log.md
(no output)
$ git ls-remote origin main
96193dbf0e450e1259105811b05768968e312054	refs/heads/main
```

## Captures

```
$ git diff --name-only c35ee1d..HEAD -- e2e/snapshots/
e2e/snapshots/phase-1/zbc-home-desktop-1440.png
e2e/snapshots/phase-1/zbc-home-mobile-390.png
e2e/snapshots/phase-1/zbm-home-desktop-1440.png
e2e/snapshots/phase-1/zbm-home-mobile-390.png
e2e/snapshots/phase-2/zbc-dev-system-desktop-1440.png
e2e/snapshots/phase-2/zbc-dev-system-mobile-390.png
e2e/snapshots/phase-2/zbm-dev-system-desktop-1440.png
e2e/snapshots/phase-2/zbm-dev-system-mobile-390.png
e2e/snapshots/phase-3/zbc-home-desktop-1440.png
e2e/snapshots/phase-3/zbc-home-mobile-390.png
e2e/snapshots/phase-3/zbc-og-default.png
e2e/snapshots/phase-3/zbm-home-desktop-1440.png
e2e/snapshots/phase-3/zbm-home-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-about-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-about-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-entertainment-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-entertainment-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-faq-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-faq-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-how-it-works-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-how-it-works-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-media-kit-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-media-kit-mobile-390.png
e2e/snapshots/phase-4-zbc/zbc-pricing-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-pricing-mobile-390.png
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
```

23 PNGs changed. 14 of the 18 Phase 4 ZBC captures moved; **Brands and Become a Clipper are
byte-identical** because neither page was edited. The others are consequences, declared:

- `phase-2/zbm-dev-system-*` — **a ZBM capture moved although `apps/zbm` was never touched.**
  Gate condition C3 removed the retired Est. row from `packages/ui/src/dev/system-gallery.tsx`,
  which is the shared design-system gallery both apps render at `/dev/system`. Unavoidable
  for C3; the alternative was leaving the retired fact in the shared package.
- `phase-1/zbc-home-*` and `phase-3/zbc-home-*` — the ZBC home h1 changed (M1).
- `phase-3/zbc-og-default.png` — `SITE.description` feeds the default OG image.

### Per-file digests
```
$ shasum -a 256 docs/phase-4-zbc-copy-revision-captures.zip e2e/snapshots/phase-4-zbc/*.png
5eef24710c871a848a7a2ad3db5da571077abde2a00265aeb6fd026a9bfa5e2d  docs/phase-4-zbc-copy-revision-captures.zip
614f2e34fda55fa63abcac06d08c7776de7164dec300bc780d247913f5763150  e2e/snapshots/phase-4-zbc/zbc-about-desktop-1440.png
d14a46cc577e2ab7df44f52076ae02a6694d59cfb9a68e51ec6d30f593473999  e2e/snapshots/phase-4-zbc/zbc-about-mobile-390.png
d6f459a90e8c8075b23f4fccf4a2f1e4e334f2ca72b96f1504a23ac6d61e16f0  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-desktop-1440.png
d3b32be8c0fb252b88ce358d45769da01417ca045d54cd70da56e4cd766a1149  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-mobile-390.png
ff3e525d877ff180938c6f60aed0a62974b159a9f81290f80e21ec852bea53d6  e2e/snapshots/phase-4-zbc/zbc-brands-desktop-1440.png
c05f1af693c1f56fca84655070832f989b3e3713d8b38b46db9a240e08ea8b7f  e2e/snapshots/phase-4-zbc/zbc-brands-mobile-390.png
1953440edb4099dec067855f5fd4b24404e118a65dfe57aeb858ab744e6da068  e2e/snapshots/phase-4-zbc/zbc-entertainment-desktop-1440.png
0baf9cc3ab39a94166577e3c77f6378753b66fa3d5e29d47a1f4b97cd4dd3cf3  e2e/snapshots/phase-4-zbc/zbc-entertainment-mobile-390.png
bce3e4a19f1ae670c81f2f518888891fe899430c0d394758c5ed50ef12dae63d  e2e/snapshots/phase-4-zbc/zbc-faq-desktop-1440.png
8a84c1a305766088feee9de84e71700bf6a1efcabe3b282fc9fef888e5d1ebc5  e2e/snapshots/phase-4-zbc/zbc-faq-mobile-390.png
de084d370ab79dfdf6c2fc9b2f0faa49fafb92cebcb109e1b233d0d5aa271dcc  e2e/snapshots/phase-4-zbc/zbc-how-it-works-desktop-1440.png
b27e1dde0adfb0293bfd9f29d1617a56bdb9b494182c030e4dfe07a778f14688  e2e/snapshots/phase-4-zbc/zbc-how-it-works-mobile-390.png
5961f2510d66cdcd2f175618b85b10e453571fa1fd88f4e988682c2a7867a7a2  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
370812631fa3433b843ddbfbd3399c490861b0ce3636aceb32b1d418819df0f9  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png
4e651de6bb0a3985d5cf258857282f3a62dc7354482c1e4a2950a1408145e102  e2e/snapshots/phase-4-zbc/zbc-media-kit-desktop-1440.png
3b9c1f77431125d7b5ca93153cb62f85460113959a9ac3e195462cad669aa289  e2e/snapshots/phase-4-zbc/zbc-media-kit-mobile-390.png
be4d2d233fa0e5950f008e1689e2a3464be5704a0019352cf279a05b3cc01a76  e2e/snapshots/phase-4-zbc/zbc-pricing-desktop-1440.png
5616a2b3eeaa249cf2ccd9cf176f5c35e1469ba799f0e354d74357feef749644  e2e/snapshots/phase-4-zbc/zbc-pricing-mobile-390.png
```

The bundle for `c35ee1d` (`docs/phase-4-zbc-verification-log.md`,
`docs/phase-4-zbc-captures.zip`, sha256 `4dcc97d1…`) is left in place unchanged.

## Mutation run — eleven mutations, one at a time

The audit asked for the original seven run individually rather than together, so the standard
matches the ZBM side. Four more were added, one per assertion this revision introduced, on the
same principle the ZBM pass established: a negative assertion that has never been shown to
fail is not evidence. Each was applied ALONE against the committed tree of `a411e72` and
reverted before the next. Every run exited 1.

| # | Mutation | Caught by | Assertion |
|---|---|---|---|
| M1 | real company name on Entertainment | site-wide page rules | `Error: real company name on the page` |
| M2 | clipper payout split on the client-facing Pricing page | site-wide page rules | `toHaveText` on the h1 / no-dollar rule |
| M3 | IllustrativeBadge dropped from the Brands example cards | three illustrative example cards | `toContainText` |
| M4 | Brands page carries the Entertainment focus | site-wide page rules | `toBe` on `data-page-focus` |
| M5 | honesty note reworded | keeps the honesty note word for word | `toHaveText` |
| M6 | dead press mailbox offered as a `mailto:` | Media Kit facts / press placeholder | `toBe` on the mailto count |
| M7 | `/how-it-works` redirect removed | `/how-it-works` redirects permanently to `/` | `toBe` on the status |
| M8 | founding year restored on the Media Kit | no founding-year claim survives | `Error: /media-kit names a founding year` |
| M9 | "Hundreds" restored on the home h1 | site-wide page rules | `toHaveText` on the h1 |
| M10 | pay-only-on-views restored on Pricing | nothing claims creators are paid only on views | `Error: /pricing still says "only when their clips get"` |
| M11 | agency positioning restored on About | ZBC does not position against agencies | `not.toContain` |

### Two mutations did not count on the first attempt, and were redone

Recorded because a mutation that fails for the wrong reason is not evidence of anything:

- **M3, first attempt, was a compile error rather than a caught mutant.** Deleting
  `<IllustrativeBadge />` outright left its import unused, the Next build failed, and
  Playwright reported `Process from config.webServer was not able to start` with zero test
  failures. Redone as a conditional that keeps the import used, so the page builds and the
  badge assertion is what fails.
- **M10, first attempt, never applied.** The target string occurs twice on the Pricing page
  (metadata description and the `<Lead>`); the script asserted one occurrence and aborted, so
  the run that followed was of an unmutated tree and its exit 0 meant nothing. Redone against
  both occurrences.

### Raw output

#### M1
```
=== M1 diff ===
 apps/zbc/app/entertainment/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (363ms)
  ✘   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (128ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (164ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (170ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (173ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (195ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (115ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (100ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (99ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (102ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (111ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (134ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (100ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (102ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (101ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (32ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (113ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (107ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (100ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (105ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (240ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (87ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (290ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (36ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (90ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (372ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (372ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (208ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (147ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (114ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (145ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (68ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (40ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (754ms)
  ✘  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (288ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (463ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (363ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (465ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (397ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (352ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (391ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (348ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (282ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (275ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (252ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (256ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (278ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (266ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (258ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (252ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (246ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (145ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (282ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (293ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (318ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (285ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (341ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (452ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (265ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (445ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (161ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (141ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (220ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (654ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (672ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (343ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (238ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (220ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (246ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (147ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (129ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 

    Error: real company name on the page

    expect(received).toBeNull()

    Received: "Netflix"

      133 |       // §9: no real company names — whole page, nav and footer included.
      134 |       const bodyText = await page.locator("body").innerText();
    > 135 |       expect(bodyText.match(BLOCKLIST_RE)?.[0] ?? null, "real company name on the page").toBeNull();
          |                                                                                          ^
      136 |
      137 |       // §9: client pricing bundled; clipper payout figures only on Become a Clipper.
      138 |       if (!("clipperFacing" in p)) {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:135:90

    Error Context: test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 

    Error: real company name on the page

    expect(received).toBeNull()

    Received: "Netflix"

      133 |       // §9: no real company names — whole page, nav and footer included.
      134 |       const bodyText = await page.locator("body").innerText();
    > 135 |       expect(bodyText.match(BLOCKLIST_RE)?.[0] ?? null, "real company name on the page").toBeNull();
          |                                                                                          ^
      136 |
      137 |       // §9: client pricing bundled; clipper payout figures only on Become a Clipper.
      138 |       if (!("clipperFacing" in p)) {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:135:90

    Error Context: test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--entertainment-90734--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 
  76 passed (31.1s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M2
```
=== M2 diff ===
 apps/zbc/app/pricing/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (400ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✘   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (5.1s)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (229ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (209ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (121ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (104ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (105ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (109ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (112ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (110ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (101ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (102ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (100ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (31ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (116ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (111ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (140ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (98ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (109ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (225ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (91ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (291ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (35ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (32ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (92ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (373ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (367ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (179ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (115ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (98ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (130ms)
  ✘  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (55ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (47ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (680ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (299ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (297ms)
  ✘  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (5.2s)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (486ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (331ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (306ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (265ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (219ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (205ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (223ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (197ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (208ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (197ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (193ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (192ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (118ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (220ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (218ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (246ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (188ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (218ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (337ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (187ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (329ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (125ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (120ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (190ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (532ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (545ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (289ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (216ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (195ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (225ms)
  ✘  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (144ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (187ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  getByRole('heading', { level: 1 })
    Expected: "How a campaign is priced."
    Received: "How a campaign is priced. Clippers earn $50–100 per post."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
      - waiting for getByRole('heading', { level: 1 })
        14 × locator resolved to <h1 class="type-display mt-4 max-w-5xl">How a campaign is priced. Clippers earn $50–100 p…</h1>
           - unexpected value "How a campaign is priced. Clippers earn $50–100 per post."


      116 |       expect(response?.status()).toBe(200);
      117 |
    > 118 |       await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
          |                                                             ^
      119 |       await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      120 |       await expect(page).toHaveTitle(p.title);
      121 |       await expect(page.getByRole("banner")).toBeVisible();
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:118:61

    Error Context: test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 

    Error: /pricing

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      518 |       const html = await (await page.request.get(`${ZBC_BASE_URL}${p.path}`)).text();
      519 |       const hasRates = /\$50–100|\$3–5/.test(html);
    > 520 |       expect(hasRates, `${p.path}`).toBe("clipperFacing" in p);
          |                                     ^
      521 |     }
      522 |   });
      523 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:520:37

    Error Context: test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  getByRole('heading', { level: 1 })
    Expected: "How a campaign is priced."
    Received: "How a campaign is priced. Clippers earn $50–100 per post."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
      - waiting for getByRole('heading', { level: 1 })
        14 × locator resolved to <h1 class="type-display mt-4 max-w-5xl">How a campaign is priced. Clippers earn $50–100 p…</h1>
           - unexpected value "How a campaign is priced. Clippers earn $50–100 per post."


      116 |       expect(response?.status()).toBe(200);
      117 |
    > 118 |       await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
          |                                                             ^
      119 |       await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      120 |       await expect(page).toHaveTitle(p.title);
      121 |       await expect(page.getByRole("banner")).toBeVisible();
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:118:61

    Error Context: test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 

    Error: /pricing

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      518 |       const html = await (await page.request.get(`${ZBC_BASE_URL}${p.path}`)).text();
      519 |       const hasRates = /\$50–100|\$3–5/.test(html);
    > 520 |       expect(hasRates, `${p.path}`).toBe("clipperFacing" in p);
          |                                     ^
      521 |     }
      522 |   });
      523 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:520:37

    Error Context: test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 
  74 passed (41.0s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M3
```
=== M3 diff ===
 apps/zbc/app/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (239ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (201ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (165ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (198ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (172ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (174ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (195ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (113ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (98ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (98ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (99ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (105ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (103ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (100ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (100ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (97ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (112ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (108ms)
  ✘  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (5.2s)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (99ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (105ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (223ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (87ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (291ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (40ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (89ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (379ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (360ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (176ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (114ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (96ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (128ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (47ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (31ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (650ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (284ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (269ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (371ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (314ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (268ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (304ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (268ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (203ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (194ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (190ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (192ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (196ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (193ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (194ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (200ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (124ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (226ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (209ms)
  ✘  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (5.3s)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (193ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (214ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (320ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (176ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (311ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (124ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (115ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (181ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (513ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (514ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (279ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (218ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (192ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (217ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (140ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (121ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('[data-example-card]').nth(1)
    Expected substring: "Illustrative example — not a client result"
    Received string:    "BrandsAuto dealership showroom seriesViews340,000Clips46PlatformsTikTok · Reels"
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('[data-example-card]').nth(1) with timeout 5000ms
      - waiting for locator('[data-example-card]').nth(1)
        14 × locator resolved to <li data-focus="brands" data-example-card="true">…</li>
           - unexpected value "BrandsAuto dealership showroom seriesViews340,000Clips46PlatformsTikTok · Reels"


      254 |       await expect(card.locator("[aria-label]").nth(1)).toHaveAttribute("aria-label", clips);
      255 |       await expect(card).toContainText(platforms);
    > 256 |       await expect(card).toContainText("Illustrative example — not a client result");
          |                          ^
      257 |       expect(await card.locator("> div").evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(accent);
      258 |     }
      259 |     // No unbadged figure anywhere else in the section.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:256:26

    Error Context: test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('[data-example-card]').nth(1)
    Expected substring: "Illustrative example — not a client result"
    Received string:    "BrandsAuto dealership showroom seriesViews340,000Clips46PlatformsTikTok · Reels"
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('[data-example-card]').nth(1) with timeout 5000ms
      - waiting for locator('[data-example-card]').nth(1)
        14 × locator resolved to <li data-focus="brands" data-example-card="true">…</li>
           - unexpected value "BrandsAuto dealership showroom seriesViews340,000Clips46PlatformsTikTok · Reels"


      254 |       await expect(card.locator("[aria-label]").nth(1)).toHaveAttribute("aria-label", clips);
      255 |       await expect(card).toContainText(platforms);
    > 256 |       await expect(card).toContainText("Illustrative example — not a client result");
          |                          ^
      257 |       expect(await card.locator("> div").evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(accent);
      258 |     }
      259 |     // No unbadged figure anywhere else in the section.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:256:26

    Error Context: test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-How-It-Works-§-379f3-and-exactly-the-§B4-figures-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 
    [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 
  76 passed (37.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M4
```
=== M4 diff ===
 apps/zbc/app/brands/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (168ms)
  ✘   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (130ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (192ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (207ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (171ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (177ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (161ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (122ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (105ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (98ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (100ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (104ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (104ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (99ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (96ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (98ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (113ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (107ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (130ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (100ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (105ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (222ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (84ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (290ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (36ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (33ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (90ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (355ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (353ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (175ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (112ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (96ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (127ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (45ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (649ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✘  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (221ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (379ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (383ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (308ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (271ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (221ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (191ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (189ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (193ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (196ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (193ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (189ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (192ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (115ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (212ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (222ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (272ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (192ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (199ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (319ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (178ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (314ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (121ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (117ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (184ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (523ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (530ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (296ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (213ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (188ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (219ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (131ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (115ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "brands"
    Received: "entertainment"

      143 |       const cta = page.locator("header [data-nav-cta]").first();
      144 |       const focus = "focus" in p ? p.focus : null;
    > 145 |       expect(await page.locator("main").getAttribute("data-page-focus")).toBe(focus);
          |                                                                          ^
      146 |       expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      147 |         focus === "brands" ? BRAND : ENT,
      148 |       );
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:145:74

    Error Context: test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "brands"
    Received: "entertainment"

      143 |       const cta = page.locator("header [data-nav-cta]").first();
      144 |       const focus = "focus" in p ? p.focus : null;
    > 145 |       expect(await page.locator("main").getAttribute("data-page-focus")).toBe(focus);
          |                                                                          ^
      146 |       expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      147 |         focus === "brands" ? BRAND : ENT,
      148 |       );
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:145:74

    Error Context: test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--brands-render-394a6--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 
  76 passed (27.2s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M5
```
=== M5 diff ===
 apps/zbc/app/launch-a-campaign/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (206ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (194ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (198ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (219ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (171ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (175ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (115ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (99ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (98ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (98ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (107ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (105ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (100ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (99ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (104ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (112ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (108ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (98ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (105ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (223ms)
  ✘  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.1s)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (265ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (42ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (33ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (91ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (360ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (356ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (173ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (117ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (97ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (112ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (49ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (648ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (299ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (265ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (366ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (314ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (301ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (268ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (212ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (189ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (189ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (193ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (194ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (196ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (196ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (193ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (194ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (114ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (211ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (202ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (241ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (192ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (198ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (360ms)
  ✘  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.2s)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (434ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (126ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (121ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (185ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (510ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (553ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (283ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (209ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (188ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (220ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (135ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (115ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
  76 passed (37.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M6
```
=== M6 diff ===
 apps/zbc/app/media-kit/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (233ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (183ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (178ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (217ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (170ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (173ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (161ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (113ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (99ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (98ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (97ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (104ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (104ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (96ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (96ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (95ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (112ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (108ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (129ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (93ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (106ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (228ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (109ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (295ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (41ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (37ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (101ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (359ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (370ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (174ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (113ms)
  ✘  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (112ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (147ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (55ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (643ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (276ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (263ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (367ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (317ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (299ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (205ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (188ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (188ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (196ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (196ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (194ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (188ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (186ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (114ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (208ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (212ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (239ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (199ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (207ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (320ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (179ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (316ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (117ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (120ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (185ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (527ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (519ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (280ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (209ms)
  ✘  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (205ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (305ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (139ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (119ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      494 |     await expect(press.locator("[data-fixture-note]")).toContainText("Placeholder");
      495 |     // The mailbox does not exist, so nothing may offer to send mail to it.
    > 496 |     expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
          |                                                              ^
      497 |     // Company voice: no founder name (§B4).
      498 |     expect(await mainText(page)).not.toMatch(/Zack/);
      499 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:496:62

    Error Context: test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      494 |     await expect(press.locator("[data-fixture-note]")).toContainText("Placeholder");
      495 |     // The mailbox does not exist, so nothing may offer to send mail to it.
    > 496 |     expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
          |                                                              ^
      497 |     // Company voice: no founder name (§B4).
      498 |     expect(await mainText(page)).not.toMatch(/Zack/);
      499 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:496:62

    Error Context: test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 
    [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 
  76 passed (27.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M7
```
=== M7 diff ===
 apps/zbc/next.config.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (195ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (214ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (217ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (170ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (174ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (116ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (98ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (99ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (97ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (105ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (104ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (97ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (98ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (96ms)
  ✘  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (48ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (130ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (109ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (142ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (96ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (108ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (223ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (84ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (290ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (41ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (33ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (90ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (358ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (356ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (171ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (113ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (96ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (156ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (52ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (31ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (630ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (272ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (284ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (366ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (317ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (270ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (298ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (197ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (191ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (188ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (187ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (192ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (192ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (185ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (191ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (189ms)
  ✘  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (134ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (312ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (216ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (247ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (194ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (199ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (319ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (178ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (313ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (123ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (117ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (177ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (510ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (539ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (293ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (211ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (191ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (220ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (135ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (119ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 308
    Received: 404

      202 |   test("/how-it-works redirects permanently to /", async ({ page }) => {
      203 |     const res = await page.request.get(`${ZBC_BASE_URL}/how-it-works`, { maxRedirects: 0 });
    > 204 |     expect(res.status()).toBe(308);
          |                          ^
      205 |     expect(res.headers()["location"]).toBe("/");
      206 |   });
      207 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:204:26

    Error Context: test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 308
    Received: 404

      202 |   test("/how-it-works redirects permanently to /", async ({ page }) => {
      203 |     const res = await page.request.get(`${ZBC_BASE_URL}/how-it-works`, { maxRedirects: 0 });
    > 204 |     expect(res.status()).toBe(308);
          |                          ^
      205 |     expect(res.headers()["location"]).toBe("/");
      206 |   });
      207 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:204:26

    Error Context: test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-How-It-Works-§-5478b-s-redirects-permanently-to--mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 
    [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 
  76 passed (27.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M8
```
=== M8 diff ===
 apps/zbc/app/media-kit/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (236ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (189ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (184ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (206ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (170ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (173ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (114ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (98ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (104ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (97ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (107ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (103ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (100ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (97ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (100ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (111ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (107ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (132ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (93ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (107ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (224ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (92ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (291ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (34ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (90ms)
  ✘  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (327ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (379ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (176ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (115ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (96ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (155ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (50ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (33ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (641ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (275ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (381ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (328ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (269ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (302ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (268ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (206ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (193ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (190ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (188ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (196ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (193ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (192ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (197ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (115ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (211ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (198ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (238ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (194ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (196ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (318ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (176ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (312ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (120ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (115ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (182ms)
  ✘  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (464ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (632ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (297ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (208ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (192ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (223ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (134ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (117ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery 

    Error: /media-kit names a founding year

    expect(received).not.toMatch(expected)

    Expected pattern: not /2011/
    Received string:      "MEDIA KIT
    
    Z Best Clips — press kit.
    
    BOILERPLATE
    
    SHORT
    
    Z Best Clips is a clipping and short-form distribution agency, by Z Best Media. It turns one piece of long-form content into dozens of short-form clips posted across TikTok, Instagram Reels, and YouTube Shorts by an independent creator network, with every post reviewed before it counts and nothing billed before the client approves it.
    
    LONG
    
    Z Best Clips is the creator-powered distribution arm of Z Best Media, a Los Angeles advertising agency founded in 2011. It runs two campaign models: rented distribution for entertainment — music, film, streaming, sports, podcasts — where clips post from the creator network’s own accounts to reach new audiences; and owned distribution for brands — auto dealerships, med spas, local businesses — where clips post to the client’s own accounts to build a compounding local following. Every submission is reviewed by a person before it counts, and clients pay only for approved posts with verified views.
    
    COMPANY FACTS
    
    PARENT
    Z Best Media, Los Angeles
    LAUNCHED
    2026
    MODELS
    Rented distribution (Entertainment) · Owned distribution (Brands)
    PLATFORMS
    TikTok · Instagram Reels · YouTube Shorts
    PAYOUT BASIS
    Per 1,000 verified views; brand campaigns add a guaranteed per-post fee
    
    BRAND ASSETS
    
    Assets available on request.
    
    PRESS CONTACT
    
    press@zbestclips.com
    
    Placeholder — this mailbox does not exist yet.
    
    WHAT WE CAN AND CAN’T SAY
    
    We’ll talk about the model, the review process, and how payouts work. We won’t share client names, campaign numbers, or creator identities without their written permission, and we don’t publish unverified results."

      435 |     for (const p of PAGES) {
      436 |       await visit(page, p);
    > 437 |       expect(await mainText(page), `${p.path} names a founding year`).not.toMatch(/2011/);
          |                                                                           ^
      438 |     }
      439 |     // The retired Est. row also lived in the shared @zbest/ui gallery, which both
      440 |     // apps render at /dev/system. Checked here because ZBC owns this revision.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:437:75

    Error Context: test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery 

    Error: /media-kit names a founding year

    expect(received).not.toMatch(expected)

    Expected pattern: not /2011/
    Received string:      "MEDIA KIT
    
    Z Best Clips — press kit.
    
    BOILERPLATE
    
    SHORT
    
    Z Best Clips is a clipping and short-form distribution agency, by Z Best Media. It turns one piece of long-form content into dozens of short-form clips posted across TikTok, Instagram Reels, and YouTube Shorts by an independent creator network, with every post reviewed before it counts and nothing billed before the client approves it.
    
    LONG
    
    Z Best Clips is the creator-powered distribution arm of Z Best Media, a Los Angeles advertising agency founded in 2011. It runs two campaign models: rented distribution for entertainment — music, film, streaming, sports, podcasts — where clips post from the creator network’s own accounts to reach new audiences; and owned distribution for brands — auto dealerships, med spas, local businesses — where clips post to the client’s own accounts to build a compounding local following. Every submission is reviewed by a person before it counts, and clients pay only for approved posts with verified views.
    
    COMPANY FACTS
    
    PARENT
    Z Best Media, Los Angeles
    LAUNCHED
    2026
    MODELS
    Rented distribution (Entertainment) · Owned distribution (Brands)
    PLATFORMS
    TikTok · Instagram Reels · YouTube Shorts
    PAYOUT BASIS
    Per 1,000 verified views; brand campaigns add a guaranteed per-post fee
    
    BRAND ASSETS
    
    Assets available on request.
    
    PRESS CONTACT
    
    press@zbestclips.com
    
    Placeholder — this mailbox does not exist yet.
    
    WHAT WE CAN AND CAN’T SAY
    
    We’ll talk about the model, the review process, and how payouts work. We won’t share client names, campaign numbers, or creator identities without their written permission, and we don’t publish unverified results."

      435 |     for (const p of PAGES) {
      436 |       await visit(page, p);
    > 437 |       expect(await mainText(page), `${p.path} names a founding year`).not.toMatch(/2011/);
          |                                                                           ^
      438 |     }
      439 |     // The retired Est. row also lived in the shared @zbest/ui gallery, which both
      440 |     // apps render at /dev/system. Checked here because ZBC owns this revision.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:437:75

    Error Context: test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--39564-e-or-the-shared-dev-gallery-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery 
    [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery 
  76 passed (27.2s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M9
```
=== M9 diff ===
 apps/zbc/app/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✘   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (5.1s)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (207ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (165ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (165ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (206ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (174ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (207ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (160ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (114ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (99ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (98ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (99ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (106ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (103ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (99ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (98ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (97ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (112ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (112ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (101ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (104ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (223ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (91ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (290ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (35ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (32ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (88ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (353ms)
  ✘  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (116ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (192ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (120ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (108ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (134ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (51ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (33ms)
  ✘  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (5.3s)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (369ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (366ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (314ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (264ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (295ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (261ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (214ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (189ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (187ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (189ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (192ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (214ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (188ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (191ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (187ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (113ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (212ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (200ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (237ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (194ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (198ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (331ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (178ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (311ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (118ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (114ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (180ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (537ms)
  ✘  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (202ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (378ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (219ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (191ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (219ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (136ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (116ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  getByRole('heading', { level: 1 })
    Expected: "One source. Dozens of clips. Real reach."
    Received: "One source. Hundreds of clips. Real reach."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
      - waiting for getByRole('heading', { level: 1 })
        14 × locator resolved to <h1 class="type-display mt-4 max-w-5xl">One source. Hundreds of clips. Real reach.</h1>
           - unexpected value "One source. Hundreds of clips. Real reach."


      116 |       expect(response?.status()).toBe(200);
      117 |
    > 118 |       await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
          |                                                             ^
      119 |       await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      120 |       await expect(page).toHaveTitle(p.title);
      121 |       await expect(page.getByRole("banner")).toBeVisible();
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:118:61

    Error Context: test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds 

    Error: / still claims hundreds

    expect(received).not.toMatch(expected)

    Expected pattern: not /[Hh]undreds of/
    Received string:      "HOW IT WORKS
    
    One source. Hundreds of clips. Real reach.
    
    You hand us one piece of long-form content — a song, a stream highlight, a showroom walkaround, a treatment-room story. Our clipper network cuts it into dozens of distinct short-form videos, each with a different hook, pace, and caption, then posts them across TikTok, Instagram Reels, and YouTube Shorts from real, independent accounts.
    
    LAUNCH A CAMPAIGN
    
    THE PROCESS
    
    STEP 01
    
    Set the Campaign
    Source material, platforms, guidelines, target reviewed and locked before launch. Brand safety and disclosure rules set up front.
    
    STEP 02
    
    Clippers Create and Post
    Independent creators turn source material into varied clips from their own accounts.
    
    STEP 03
    
    Every Submission Reviewed
    Nothing counts until a human reviews it against guidelines. Rule-breaking posts rejected and never billed.
    
    STEP 04
    
    Verified Reporting
    Approved posts, verified views, platform breakdown, visible while the campaign runs.
    
    STEP 01 — LEVERS
    
    Reward rate
    per 1,000 verified views
    Minimum payout threshold
    floor so only clips clearing real view counts enter review
    Maximum payout cap
    protects budget from one viral clip consuming the pool
    Optional flat fee bonus
    stacks on top, useful for launch campaigns with no track record yet
    
    ONE MODEL DOESN’T FIT EVERY CAMPAIGN
    
    RENTED DISTRIBUTION
    
    Entertainment
    
    Music, Film, Sports, Streamers, Podcasts
    
    Content posts through the clipper network’s own accounts. Goal: discovery, reaching strangers who’ve never heard of you. When the campaign ends, you keep the view totals and case study — the accounts and followers stay with the clippers.
    
    OWNED DISTRIBUTION
    
    Brands
    
    Auto Dealerships, Med Spas, Local Businesses
    
    Content posts to accounts the business controls. Goal: compounding local reach. When the campaign ends, the following, library, and audience relationship are yours to keep.
    
    WHAT’S INCLUDED
    
    Campaign guidelines and brand safety review
    
    Clipper network distribution
    
    Submission review on every post
    
    Only eligible views billed
    
    TikTok/Reels/Shorts coverage
    
    Verified reporting
    
    Dedicated campaign contact
    
    EXAMPLES
    
    ENTERTAINMENT
    
    Independent single release
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    TikTok · Reels · Shorts
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    
    BRANDS
    
    Auto dealership showroom series
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    TikTok · Reels
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    
    BRANDS
    
    Med spa treatment-room series
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    Reels · Shorts
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    LAUNCH A CAMPAIGN"

      446 |     for (const p of PAGES) {
      447 |       await visit(page, p);
    > 448 |       expect(await mainText(page), `${p.path} still claims hundreds`).not.toMatch(/[Hh]undreds of/);
          |                                                                           ^
      449 |     }
      450 |     await visit(page, byPath("/"));
      451 |     await expect(page.getByRole("heading", { level: 1 })).toHaveText("One source. Dozens of clips. Real reach.");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:448:75

    Error Context: test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  getByRole('heading', { level: 1 })
    Expected: "One source. Dozens of clips. Real reach."
    Received: "One source. Hundreds of clips. Real reach."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
      - waiting for getByRole('heading', { level: 1 })
        14 × locator resolved to <h1 class="type-display mt-4 max-w-5xl">One source. Hundreds of clips. Real reach.</h1>
           - unexpected value "One source. Hundreds of clips. Real reach."


      116 |       expect(response?.status()).toBe(200);
      117 |
    > 118 |       await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
          |                                                             ^
      119 |       await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      120 |       await expect(page).toHaveTitle(p.title);
      121 |       await expect(page.getByRole("banner")).toBeVisible();
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:118:61

    Error Context: test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--renders-carri-e697d--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds 

    Error: / still claims hundreds

    expect(received).not.toMatch(expected)

    Expected pattern: not /[Hh]undreds of/
    Received string:      "HOW IT WORKS
    
    One source. Hundreds of clips. Real reach.
    
    You hand us one piece of long-form content — a song, a stream highlight, a showroom walkaround, a treatment-room story. Our clipper network cuts it into dozens of distinct short-form videos, each with a different hook, pace, and caption, then posts them across TikTok, Instagram Reels, and YouTube Shorts from real, independent accounts.
    
    LAUNCH A CAMPAIGN
    
    THE PROCESS
    
    STEP 01
    
    Set the Campaign
    Source material, platforms, guidelines, target reviewed and locked before launch. Brand safety and disclosure rules set up front.
    
    STEP 02
    
    Clippers Create and Post
    Independent creators turn source material into varied clips from their own accounts.
    
    STEP 03
    
    Every Submission Reviewed
    Nothing counts until a human reviews it against guidelines. Rule-breaking posts rejected and never billed.
    
    STEP 04
    
    Verified Reporting
    Approved posts, verified views, platform breakdown, visible while the campaign runs.
    
    STEP 01 — LEVERS
    
    Reward rate
    per 1,000 verified views
    Minimum payout threshold
    floor so only clips clearing real view counts enter review
    Maximum payout cap
    protects budget from one viral clip consuming the pool
    Optional flat fee bonus
    stacks on top, useful for launch campaigns with no track record yet
    
    ONE MODEL DOESN’T FIT EVERY CAMPAIGN
    
    RENTED DISTRIBUTION
    
    Entertainment
    
    Music, Film, Sports, Streamers, Podcasts
    
    Content posts through the clipper network’s own accounts. Goal: discovery, reaching strangers who’ve never heard of you. When the campaign ends, you keep the view totals and case study — the accounts and followers stay with the clippers.
    
    OWNED DISTRIBUTION
    
    Brands
    
    Auto Dealerships, Med Spas, Local Businesses
    
    Content posts to accounts the business controls. Goal: compounding local reach. When the campaign ends, the following, library, and audience relationship are yours to keep.
    
    WHAT’S INCLUDED
    
    Campaign guidelines and brand safety review
    
    Clipper network distribution
    
    Submission review on every post
    
    Only eligible views billed
    
    TikTok/Reels/Shorts coverage
    
    Verified reporting
    
    Dedicated campaign contact
    
    EXAMPLES
    
    ENTERTAINMENT
    
    Independent single release
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    TikTok · Reels · Shorts
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    
    BRANDS
    
    Auto dealership showroom series
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    TikTok · Reels
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    
    BRANDS
    
    Med spa treatment-room series
    VIEWS
    0
    CLIPS
    0
    PLATFORMS
    Reels · Shorts
    ILLUSTRATIVE EXAMPLE — NOT A CLIENT RESULT
    LAUNCH A CAMPAIGN"

      446 |     for (const p of PAGES) {
      447 |       await visit(page, p);
    > 448 |       expect(await mainText(page), `${p.path} still claims hundreds`).not.toMatch(/[Hh]undreds of/);
          |                                                                           ^
      449 |     }
      450 |     await visit(page, byPath("/"));
      451 |     await expect(page.getByRole("heading", { level: 1 })).toHaveText("One source. Dozens of clips. Real reach.");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:448:75

    Error Context: test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--2b65c-s-everywhere-never-hundreds-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds 
  74 passed (37.1s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M10
```
=== M10 diff ===
 apps/zbc/app/pricing/page.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (179ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (205ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (220ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (248ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (205ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (174ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (162ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (127ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (102ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (99ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (97ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (109ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (107ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (97ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (101ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (102ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (113ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (110ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (135ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (93ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (106ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (224ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (85ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (290ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (37ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (92ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (362ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (359ms)
  ✘  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (104ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (130ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (100ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (134ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (57ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (33ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (643ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (276ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (372ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (276ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (302ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (205ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (195ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (192ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (190ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (200ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (192ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (190ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (192ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (119ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (213ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (198ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (239ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (200ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (207ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (319ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (178ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (327ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (119ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (123ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (184ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (509ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (530ms)
  ✘  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (196ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (296ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (203ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (220ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (145ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (116ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee 

    Error: /pricing still says "only when their clips get"

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not "only when their clips get"
    Received string:        "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — nothing is billed before you approve the post.
    
    LEVERS YOU CONTROL
    
    Campaign budget
    funded, nothing charged upfront
    Reward rate
    dollars per 1,000 views
    Minimum payout
    view threshold before review
    Maximum payout
    per-creator, per-video cap
    Flat fee bonus
    optional, useful for launch campaigns
    
    WHAT EVERY CAMPAIGN INCLUDES
    
    Campaign guidelines and brand safety review
    
    Submission review on every post
    
    Reporting on approved posts/verified views/platform breakdown
    
    Dedicated point of contact
    
    LAUNCH A CAMPAIGN"

      460 |       const text = await mainText(page);
      461 |       for (const gone of ["only when their clips get", "only pay for views", "only verified views billed"]) {
    > 462 |         expect(text, `${path} still says "${gone}"`).not.toContain(gone);
          |                                                          ^
      463 |       }
      464 |     }
      465 |     await visit(page, byPath("/pricing"));
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:462:58

    Error Context: test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee 

    Error: /pricing still says "only when their clips get"

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not "only when their clips get"
    Received string:        "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — nothing is billed before you approve the post.
    
    LEVERS YOU CONTROL
    
    Campaign budget
    funded, nothing charged upfront
    Reward rate
    dollars per 1,000 views
    Minimum payout
    view threshold before review
    Maximum payout
    per-creator, per-video cap
    Flat fee bonus
    optional, useful for launch campaigns
    
    WHAT EVERY CAMPAIGN INCLUDES
    
    Campaign guidelines and brand safety review
    
    Submission review on every post
    
    Reporting on approved posts/verified views/platform breakdown
    
    Dedicated point of contact
    
    LAUNCH A CAMPAIGN"

      460 |       const text = await mainText(page);
      461 |       for (const gone of ["only when their clips get", "only pay for views", "only verified views billed"]) {
    > 462 |         expect(text, `${path} still says "${gone}"`).not.toContain(gone);
          |                                                          ^
      463 |       }
      464 |     }
      465 |     await visit(page, byPath("/pricing"));
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:462:58

    Error Context: test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--a36c2-y-a-guaranteed-per-post-fee-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee 
    [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee 
  76 passed (27.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### M11
```
=== M11 diff ===
 apps/zbc/app/about/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match a411e72.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (168ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (194ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (166ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (184ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (221ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (167ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (181ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (164ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (120ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (103ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (104ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (104ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (111ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (108ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (99ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (101ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (99ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (111ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (108ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (98ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (101ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (223ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (86ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (289ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (35ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (31ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (85ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (356ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (358ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (173ms)
  ✘  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (101ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (110ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (139ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (55ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (38ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (638ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (287ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (266ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (367ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (301ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (201ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (189ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (189ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (186ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (194ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (193ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (190ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (191ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (186ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (115ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (212ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (199ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (240ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (198ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (198ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (326ms)
  ✓  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (176ms)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (319ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (118ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (115ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (181ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (514ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (517ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (301ms)
  ✘  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (191ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:485:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (276ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:503:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (220ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:516:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (137ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:524:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (117ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 

    Error: expect(received).not.toContain(expected) // indexOf

    Expected substring: not "marketing agency guessing at video"
    Received string:        "ABOUT
    
    We come from advertising. Now we’re building the next version of it.
    
    WHERE WE COME FROM
    
    Z Best Clips was founded by a software engineer with years of experience in high-end automotive sales — moving into luxury and exotic brands, and building new client relationships from zero at every step up. That same instinct — walk in, prove it, earn the next opportunity — is what built Z Best Media, and it’s what’s building Z Best Clips now.
    
    We’re not a marketing agency guessing at video. We’ve done the sales floor, the client relationships, and the advertising work — now we’re applying that same discipline to short-form content distribution.
    
    We’re building this in the open, one real campaign at a time. No inflated numbers, no manufactured urgency, no pretending we’ve been at this longer than we have.
    
    LAUNCH A CAMPAIGN
    BECOME A CLIPPER"

      475 |     await visit(page, byPath("/about"));
      476 |     const about = await mainText(page);
    > 477 |     expect(about).not.toContain("marketing agency guessing at video");
          |                       ^
      478 |     expect(about).toContain("We’ve done the sales floor");
      479 |     await visit(page, byPath("/faq"));
      480 |     expect(await mainText(page)).not.toContain("proven industry-wide mechanics");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:477:23

    Error Context: test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 

    Error: expect(received).not.toContain(expected) // indexOf

    Expected substring: not "marketing agency guessing at video"
    Received string:        "ABOUT
    
    We come from advertising. Now we’re building the next version of it.
    
    WHERE WE COME FROM
    
    Z Best Clips was founded by a software engineer with years of experience in high-end automotive sales — moving into luxury and exotic brands, and building new client relationships from zero at every step up. That same instinct — walk in, prove it, earn the next opportunity — is what built Z Best Media, and it’s what’s building Z Best Clips now.
    
    We’re not a marketing agency guessing at video. We’ve done the sales floor, the client relationships, and the advertising work — now we’re applying that same discipline to short-form content distribution.
    
    We’re building this in the open, one real campaign at a time. No inflated numbers, no manufactured urgency, no pretending we’ve been at this longer than we have.
    
    LAUNCH A CAMPAIGN
    BECOME A CLIPPER"

      475 |     await visit(page, byPath("/about"));
      476 |     const about = await mainText(page);
    > 477 |     expect(about).not.toContain("marketing agency guessing at video");
          |                       ^
      478 |     expect(about).toContain("We’ve done the sales floor");
      479 |     await visit(page, byPath("/faq"));
      480 |     expect(await mainText(page)).not.toContain("proven industry-wide mechanics");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:477:23

    Error Context: test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 
    [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 
  76 passed (27.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts
```

#### `zbc-mutate.py` — the mutation script, verbatim

```python
"""One ZBC mutation per invocation, applied to the committed tree of a411e72."""
import sys, pathlib
R = pathlib.Path("/Users/andrelove/WebstormProjects/zbest-sites")
def sub(rel, old, new, want=1):
    p = R / rel; s = p.read_text()
    n = s.count(old); assert n == want, f"{rel}: expected {want}, got {n}: {old[:90]}"
    p.write_text(s.replace(old, new)); 

# ---- the original seven, from the c35ee1d log ----
def M1():  # real company name on Entertainment
    sub("apps/zbc/app/entertainment/page.tsx", "we turn it into dozens of short-form clips",
        "we turn it into dozens of short-form clips for Netflix")
def M2():  # clipper payout split on the client-facing Pricing page
    sub("apps/zbc/app/pricing/page.tsx", "<PageHeader label=\"Pricing\" title=\"How a campaign is priced.\">",
        "<PageHeader label=\"Pricing\" title=\"How a campaign is priced. Clippers earn $50–100 per post.\">")
def M3():  # IllustrativeBadge dropped from the two Brands example cards
    # Conditional, not deleted: removing it outright leaves the import unused and
    # the build fails, which would be a compile error rather than a caught mutant.
    sub("apps/zbc/app/page.tsx", "                  <IllustrativeBadge />",
        "                  {ex.focus === \"entertainment\" ? <IllustrativeBadge /> : null}")
def M4():  # Brands page carries the Entertainment focus
    sub("apps/zbc/app/brands/page.tsx", '<main data-page-focus="brands">', '<main data-page-focus="entertainment">')
def M5():  # honesty note reworded away from the admission
    sub("apps/zbc/app/launch-a-campaign/page.tsx",
        "Z Best Clips is a new operation built on proven mechanics",
        "Z Best Clips is an established leader in short-form distribution")
def M6():  # non-existent press mailbox offered as a mailto
    sub("apps/zbc/app/media-kit/page.tsx", "          press@zbestclips.com\n",
        '          <a href="mailto:press@zbestclips.com">press@zbestclips.com</a>\n')
def M7():  # /how-it-works redirect removed
    sub("apps/zbc/next.config.ts",
        'return [{ source: "/how-it-works", destination: "/", permanent: true }];', "return [];")

# ---- four more, one per assertion this revision added ----
def M8():   # founding year restored
    sub("apps/zbc/app/media-kit/page.tsx", "advertising agency. It runs two campaign models",
        "advertising agency founded in 2011. It runs two campaign models")
def M9():   # "Hundreds" restored on the h1
    sub("apps/zbc/app/page.tsx", 'title="One source. Dozens of clips. Real reach."',
        'title="One source. Hundreds of clips. Real reach."')
def M10():  # pay-only-on-views restored on Pricing
    sub("apps/zbc/app/pricing/page.tsx", "pays creators for approved posts and verified views",
        "pays creators only when their clips get real, verified views", 2)
def M11():  # agency positioning restored on About
    sub("apps/zbc/app/about/page.tsx", "          We&rsquo;ve done the sales floor, the",
        "          We&rsquo;re not a marketing agency guessing at video. We&rsquo;ve done the sales floor, the")

globals()[sys.argv[1]](); print(f"{sys.argv[1]} applied")
```

### Tree restored, gate re-run
```
$ git checkout -- apps/ packages/ e2e/snapshots/
$ git status --porcelain
(no output)
$ # full gate from a wiped state:
build=0
typecheck=0
e2e=0
lint=0
DONE
$ git status --porcelain e2e/snapshots/
(no output — all 68 PNGs byte-identical to a411e72 after the mutation churn)
```

## Flagged, not changed

The Launch a Campaign honesty note still reads "Z Best Clips is a new operation built on
**proven** mechanics — the same clipping and distribution model driving results industry-wide."
That is the same unsupported "proven" the copy audit struck from the FAQ ("built on proven
industry-wide mechanics"), but it was not in the fix list, the note is brief-mandated (§B4) and
asserted word for word by the gate, and M5 exists to stop it drifting. Left for a ruling rather
than widened into unasked scope. If it should change, the gate assertion changes with it.

## Appended after the founder ruling on the honesty note — 28ef158

The item flagged above as "Flagged, not changed" was ruled on in the build window and is now
closed. It is recorded as ZBC founder decision 5 in `docs/TOOLING.md`; the paragraph that
recorded it as open has been replaced by that decision.

### The change

Was: "Z Best Clips is a new operation built on **proven** mechanics — the same clipping and
distribution model **driving results** industry-wide."

Now: "Z Best Clips is a new operation using an established model — the same clipping and
distribution mechanics already in use across the industry."

The rest of the paragraph is untouched. "Established" and "already in use" describe what
exists; "proven" and "driving results" asserted an outcome nobody here has measured. The new
wording also agrees with the FAQ answer shipped at `a411e72` ("The clipping model is
established across the industry"), which the old note contradicted two files away.

**This supersedes the §B4 wording deliberately.** The brief mandates that the note exists and
stays on Launch a Campaign, which it does. It does not freeze wording against a founder ruling
made after the brief was written. Recorded as such in TOOLING.md rather than left to look like
drift.

### Gate moved with it, and was proven to fail without it

The word-for-word assertion now holds the new text, and a negative check was added that fails
the note if "proven" or "driving results" returns. Two mutations, each applied alone against
the committed tree of `28ef158`:

| # | Mutation | Failing tests | Assertion |
|---|---|---|---|
| M5 | honesty note reworded away from the admission (the original mutation, retargeted) | `keeps the honesty note word for word` | `toHaveText` |
| M12 | the retired outcome claim restored verbatim | `keeps the honesty note word for word` AND `ZBC does not position against agencies, and drops the unsupported 'proven'` | `toHaveText`, and `Error: honesty note still says "proven"` |

M12 fails BOTH checks on BOTH viewports — four failures — so the old wording cannot return
through either the exact-text assertion or the word-level one.

```
#### M5
=== M5 diff ===
 apps/zbc/app/launch-a-campaign/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 28ef158.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (237ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (193ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (218ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (205ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (170ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (173ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (112ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (99ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (100ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (96ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (105ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (104ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (98ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (99ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (98ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (110ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (107ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (131ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (97ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (101ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (222ms)
  ✘  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.1s)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (268ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (39ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (38ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (90ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (359ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (361ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (177ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (145ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (94ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (129ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (47ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (30ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (650ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (285ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (268ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (276ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (370ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (314ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (264ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (302ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (204ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (187ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (187ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (186ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (195ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (195ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (189ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (185ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (190ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (113ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (210ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (210ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (227ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (188ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (196ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (314ms)
  ✘  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.2s)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (455ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (126ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (120ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (186ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (504ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (508ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (284ms)
  ✓  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (247ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (198ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (217ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (136ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (118ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is an established leader in short-form distribution — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
  76 passed (37.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts

#### M12
=== M12 diff ===
 apps/zbc/app/launch-a-campaign/page.tsx | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 28ef158.


Running 78 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (238ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (184ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (193ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (202ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (171ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (173ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (161ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (115ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (97ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (97ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (97ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (106ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (101ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (98ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (100ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (98ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (30ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (111ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (109ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (130ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓  24 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (101ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (103ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (221ms)
  ✘  27 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.1s)
  ✓  28 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (271ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (44ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (37ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (97ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (365ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (357ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (173ms)
  ✘  35 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (175ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (112ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (144ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (54ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (33ms)
  ✓  40 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (653ms)
  ✓  41 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓  42 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (276ms)
  ✓  43 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (275ms)
  ✓  44 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (365ms)
  ✓  45 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (316ms)
  ✓  46 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (271ms)
  ✓  47 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (299ms)
  ✓  48 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓  49 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (208ms)
  ✓  50 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (185ms)
  ✓  51 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (192ms)
  ✓  52 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (184ms)
  ✓  53 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (193ms)
  ✓  54 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (191ms)
  ✓  55 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (188ms)
  ✓  56 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (190ms)
  ✓  57 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (187ms)
  ✓  58 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (111ms)
  ✓  59 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (212ms)
  ✓  60 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (203ms)
  ✓  61 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (241ms)
  ✓  62 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  63 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (194ms)
  ✓  64 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (192ms)
  ✓  65 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (319ms)
  ✘  66 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (5.2s)
  ✓  67 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (430ms)
  ✓  68 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (125ms)
  ✓  69 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (115ms)
  ✓  70 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (186ms)
  ✓  71 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (521ms)
  ✓  72 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (513ms)
  ✓  73 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (283ms)
  ✘  74 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (269ms)
  ✓  75 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (280ms)
  ✓  76 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (224ms)
  ✓  77 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (140ms)
  ✓  78 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (122ms)


  1) [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 

    Error: honesty note still says "proven"

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not "proven"
    Received string:        "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."

      484 |     const note = await page.locator("[data-honesty-note]").innerText();
      485 |     for (const gone of ["proven", "driving results"]) {
    > 486 |       expect(note, `honesty note still says "${gone}"`).not.toContain(gone);
          |                                                             ^
      487 |     }
      488 |   });
      489 | });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:486:61

    Error Context: test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


      346 |   test("keeps the honesty note word for word", async ({ page }) => {
      347 |     await visit(page, byPath("/launch-a-campaign"));
    > 348 |     await expect(page.locator("[data-honesty-note]")).toHaveText(
          |                                                       ^
      349 |       "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
      350 |     );
      351 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:348:55

    Error Context: test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Launch-a-Campa-61eec--honesty-note-word-for-word-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 

    Error: honesty note still says "proven"

    expect(received).not.toContain(expected) // indexOf

    Expected substring: not "proven"
    Received string:        "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."

      484 |     const note = await page.locator("[data-honesty-note]").innerText();
      485 |     for (const gone of ["proven", "driving results"]) {
    > 486 |       expect(note, `honesty note still says "${gone}"`).not.toContain(gone);
          |                                                             ^
      487 |     }
      488 |   });
      489 | });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:486:61

    Error Context: test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Copy-revision--82f9a-ops-the-unsupported-proven--mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 
    [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' 
  74 passed (38.2s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts

```

### Captures and final state

```
$ git diff --name-only a411e72..HEAD -- e2e/snapshots/
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png

$ # full gate from a wiped state, after the mutations were reverted:
build=0
typecheck=0
e2e=0
lint=0
DONE
$ git status --porcelain
(no output — all 68 PNGs byte-identical to 28ef158)
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbc/app
[]
$ git rev-parse HEAD
28ef1588d53c3410094d2cfefe579efcefed0e34
```

Two captures moved for this ruling: Launch a Campaign at both viewports. Nothing else.

### Capture zip regenerated at 28ef158

```
$ shasum -a 256 docs/phase-4-zbc-copy-revision-captures.zip e2e/snapshots/phase-4-zbc/*.png
f453ce64edb0c29b8f187a470cca947ae8585ba357a14994a9af2dbe1e32a253  docs/phase-4-zbc-copy-revision-captures.zip
614f2e34fda55fa63abcac06d08c7776de7164dec300bc780d247913f5763150  e2e/snapshots/phase-4-zbc/zbc-about-desktop-1440.png
d14a46cc577e2ab7df44f52076ae02a6694d59cfb9a68e51ec6d30f593473999  e2e/snapshots/phase-4-zbc/zbc-about-mobile-390.png
d6f459a90e8c8075b23f4fccf4a2f1e4e334f2ca72b96f1504a23ac6d61e16f0  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-desktop-1440.png
d3b32be8c0fb252b88ce358d45769da01417ca045d54cd70da56e4cd766a1149  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-mobile-390.png
ff3e525d877ff180938c6f60aed0a62974b159a9f81290f80e21ec852bea53d6  e2e/snapshots/phase-4-zbc/zbc-brands-desktop-1440.png
c05f1af693c1f56fca84655070832f989b3e3713d8b38b46db9a240e08ea8b7f  e2e/snapshots/phase-4-zbc/zbc-brands-mobile-390.png
1953440edb4099dec067855f5fd4b24404e118a65dfe57aeb858ab744e6da068  e2e/snapshots/phase-4-zbc/zbc-entertainment-desktop-1440.png
0baf9cc3ab39a94166577e3c77f6378753b66fa3d5e29d47a1f4b97cd4dd3cf3  e2e/snapshots/phase-4-zbc/zbc-entertainment-mobile-390.png
bce3e4a19f1ae670c81f2f518888891fe899430c0d394758c5ed50ef12dae63d  e2e/snapshots/phase-4-zbc/zbc-faq-desktop-1440.png
8a84c1a305766088feee9de84e71700bf6a1efcabe3b282fc9fef888e5d1ebc5  e2e/snapshots/phase-4-zbc/zbc-faq-mobile-390.png
de084d370ab79dfdf6c2fc9b2f0faa49fafb92cebcb109e1b233d0d5aa271dcc  e2e/snapshots/phase-4-zbc/zbc-how-it-works-desktop-1440.png
b27e1dde0adfb0293bfd9f29d1617a56bdb9b494182c030e4dfe07a778f14688  e2e/snapshots/phase-4-zbc/zbc-how-it-works-mobile-390.png
d9ef0fe3d669ee33ae4fea805308813b442a52ebaf02e9d5220e6e48804cbca5  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
32d64dc75f139cda1d4c09ad09791cd1ebba222bc5c2c88e53e55b7cc4e21a59  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png
4e651de6bb0a3985d5cf258857282f3a62dc7354482c1e4a2950a1408145e102  e2e/snapshots/phase-4-zbc/zbc-media-kit-desktop-1440.png
3b9c1f77431125d7b5ca93153cb62f85460113959a9ac3e195462cad669aa289  e2e/snapshots/phase-4-zbc/zbc-media-kit-mobile-390.png
be4d2d233fa0e5950f008e1689e2a3464be5704a0019352cf279a05b3cc01a76  e2e/snapshots/phase-4-zbc/zbc-pricing-desktop-1440.png
5616a2b3eeaa249cf2ccd9cf176f5c35e1469ba799f0e354d74357feef749644  e2e/snapshots/phase-4-zbc/zbc-pricing-mobile-390.png
```

Superseded zip sha256 (do not bind): `5eef24710c871a848a7a2ad3db5da571077abde2a00265aeb6fd026a9bfa5e2d`

**No ZBC item is open after this ruling.**
