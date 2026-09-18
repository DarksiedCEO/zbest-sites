# Phase 5, free-assessment chunk — raw verification output

Unedited stdout/stderr, regenerable with the commands shown. Nothing below the appendix
heading is summarized.

**Scope.** The free Revenue Recovery assessment only — Backend Spec v0.3 §11, founder
decision 10 — on fixtures behind the typed adapter, posting to the no-delivery stub, with no
real endpoint. Brief §6.3 lists three other Phase 5 items; two are NOT in this chunk (the
Search Intelligence AI Visibility Check and ZBC's "Browse Active Campaigns" CTA), and the
recovered-revenue counter stays unwired by the brief's own rule. This is not all of Phase 5.

**Bind to `51328e9`.** Code commit `3814c4a`; `51328e9` corrects a stale test name and a stale
comment, with no behaviour, copy or capture change. Diffs in the bundle are ranged from
`92cbf36`, the certified contract.

## Gate — run 1, FAILED, kept

The first wiped-state run after the mutation pass failed one test. It is recorded here, not
replaced by the rerun below. Root cause is in the appendix.

### `pnpm build` (run 1)
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbc:build: cache miss, executing 3bf916a1a400ac70
@zbest/zbm:build: cache miss, executing f9251f868802f6a1
@zbest/zbc:build: 
@zbest/zbc:build: > @zbest/zbc@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:build: > next build
@zbest/zbc:build: 
@zbest/zbm:build: 
@zbest/zbm:build: > @zbest/zbm@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:build: > next build
@zbest/zbm:build: 
@zbest/zbm:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbc:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbc:build: ✓ Running next.config.ts took 13ms
@zbest/zbm:build: ✓ Running next.config.ts took 13ms
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbm:build: ✓ Compiled successfully in 2.8s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build: ✓ Compiled successfully in 2.9s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbc:build:   Finished TypeScript in 1266ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Finished TypeScript in 1465ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 302ms
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
@zbest/zbm:build:   Generating static pages using 13 workers (18/25) 
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 369ms
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

 Tasks:    2 successful, 2 total
Cached:    0 cached, 2 total
  Time:    7.066s 

```

### `pnpm typecheck` (run 1)
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

e2e:typecheck: cache miss, executing 03ea8a86d7d40aad
@zbest/ui:typecheck: cache miss, executing 0f571858f6885de2
@zbest/zbc:typecheck: cache miss, executing ecea9f10f4d4a13f
@zbest/zbm:typecheck: cache miss, executing 5d62620437dbfc98
@zbest/ui:typecheck: 
@zbest/ui:typecheck: > @zbest/ui@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:typecheck: > tsc --noEmit
@zbest/ui:typecheck: 
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 
@zbest/zbc:typecheck: 
@zbest/zbc:typecheck: > @zbest/zbc@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:typecheck: > tsc --noEmit
@zbest/zbc:typecheck: 
@zbest/zbm:typecheck: 
@zbest/zbm:typecheck: > @zbest/zbm@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:typecheck: > tsc --noEmit
@zbest/zbm:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.116s 

```

### `pnpm --filter e2e exec playwright test` (run 1)
```

  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 286 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (396ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (244ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (271ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (169ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (216ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (266ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (132ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (185ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (256ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (181ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (183ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (176ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (159ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (151ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (90ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (122ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (124ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (108ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (194ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (326ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (37ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (335ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (48ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (279ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (231ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (165ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (174ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (191ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (179ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (125ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (297ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (114ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (116ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (114ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (154ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (321ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (35ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (250ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (44ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (278ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (242ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (244ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (133ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (107ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (253ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (202ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (209ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (216ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (209ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (124ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (105ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (105ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (108ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (109ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (109ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (113ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (106ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (104ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (32ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (124ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (117ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (140ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (104ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (123ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (313ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (96ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (327ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (41ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (36ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (109ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (386ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (385ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (185ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (158ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (110ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (134ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (49ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (34ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (240ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (230ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (406ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (201ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (244ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (143ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (193ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (135ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (113ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (105ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (97ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (104ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (123ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (105ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (144ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (144ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (112ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (402ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (86ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (111ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (122ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (116ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (139ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (151ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (567ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (37ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (34ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (33ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (114ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (96ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (197ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (396ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (97ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (96ms)
  ✓  126 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (88ms)
  ✓  127 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (105ms)
  ✓  128 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (94ms)
  ✓  129 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (50ms)
  ✓  130 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (48ms)
  ✓  131 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (33ms)
  ✓  132 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (44ms)
  ✓  133 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (35ms)
  ✓  134 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (33ms)
  ✓  135 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓  136 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓  137 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (31ms)
  ✓  138 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓  139 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (320ms)
  ✓  140 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (221ms)
  ✓  141 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (548ms)
  ✓  142 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (484ms)
  ✓  143 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✓  144 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (701ms)
  ✓  145 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (592ms)
  ✓  146 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (482ms)
  ✓  147 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (272ms)
  ✓  148 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (305ms)
  ✓  149 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.6s)
  ✓  150 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (589ms)
  ✓  151 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (247ms)
  ✓  152 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (305ms)
  ✘  153 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  154 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (589ms)
  ✓  155 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (344ms)
  ✓  156 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (348ms)
  ✓  157 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (319ms)
  ✓  158 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (316ms)
  ✓  159 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (238ms)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (389ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (231ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (213ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (219ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (279ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (480ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (130ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (391ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (138ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (405ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (634ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (333ms)
  ✓  172 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (367ms)
  ✓  173 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (322ms)
  ✓  174 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (299ms)
  ✓  175 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (223ms)
  ✓  176 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (351ms)
  ✓  177 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (226ms)
  ✓  178 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (221ms)
  ✓  179 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (211ms)
  ✓  180 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (270ms)
  ✓  181 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (472ms)
  ✓  182 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (131ms)
  ✓  183 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (377ms)
  ✓  184 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (146ms)
  ✓  185 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (392ms)
  ✓  186 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (395ms)
  ✓  187 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (396ms)
  ✓  188 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (274ms)
  ✓  189 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (221ms)
  -  190 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  191 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (601ms)
  ✓  192 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (298ms)
  ✓  193 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (294ms)
  ✓  194 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (319ms)
  ✓  195 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (408ms)
  ✓  196 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (353ms)
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (297ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (343ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (308ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (238ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (216ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (235ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (208ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (224ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (211ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (210ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (210ms)
  ✓  208 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (205ms)
  ✓  209 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (128ms)
  ✓  210 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (235ms)
  ✓  211 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (231ms)
  ✓  212 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (287ms)
  ✓  213 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  214 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (204ms)
  ✓  215 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (226ms)
  ✓  216 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (344ms)
  ✓  217 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (199ms)
  ✓  218 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (343ms)
  ✓  219 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (135ms)
  ✓  220 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (126ms)
  ✓  221 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (200ms)
  ✓  222 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (560ms)
  ✓  223 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (568ms)
  ✓  224 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (320ms)
  ✓  225 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (276ms)
  ✓  226 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (211ms)
  ✓  227 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (228ms)
  ✓  228 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (145ms)
  ✓  229 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (130ms)
  ✓  230 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (409ms)
  ✓  231 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (366ms)
  ✓  232 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (623ms)
  ✓  233 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (332ms)
  ✓  234 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓  235 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (286ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (315ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (414ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (249ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (229ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (237ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (211ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (199ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (205ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (210ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (234ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (223ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (254ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (255ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (228ms)
  ✓  251 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (612ms)
  ✓  252 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (183ms)
  ✓  253 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (225ms)
  ✓  254 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (233ms)
  ✓  255 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (222ms)
  ✓  256 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (247ms)
  ✓  257 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (288ms)
  ✓  258 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (676ms)
  ✓  259 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (131ms)
  ✓  260 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (136ms)
  ✓  261 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (133ms)
  ✓  262 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (135ms)
  ✓  263 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (214ms)
  ✓  264 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (193ms)
  ✓  265 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (276ms)
  ✓  266 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (587ms)
  ✓  267 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (203ms)
  ✓  268 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓  269 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (202ms)
  ✓  270 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (215ms)
  ✓  271 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (208ms)
  ✓  272 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (148ms)
  ✓  273 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (146ms)
  ✓  274 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (129ms)
  ✓  275 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (145ms)
  ✓  276 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (131ms)
  ✓  277 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (127ms)
  ✓  278 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (138ms)
  ✓  279 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (137ms)
  ✓  280 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (127ms)
  ✓  281 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (133ms)
  ✓  282 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (507ms)
  ✓  283 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (339ms)
  ✓  284 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (704ms)
  ✓  285 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (582ms)
  ✓  286 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (672ms)


  1) [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "1,240,000"
    Received: "0"

      218 |       await page.goto(`${app.baseUrl}/dev/system`, { waitUntil: "domcontentloaded" });
      219 |       const reduced = page.locator("#counter .type-stat").first();
    > 220 |       expect(await reduced.textContent()).toBe("1,240,000");
          |                                           ^
      221 |
      222 |       // aria-label sits on the Counter's own element, not the type wrapper:
      223 |       // assistive tech must never be read a number mid-count, so the final
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-2.spec.ts:220:43

    Error Context: test-results/phase-2-Z-Best-Clips-—-des-e50de-ed-motion-disables-the-tick-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-2-Z-Best-Clips-—-des-e50de-ed-motion-disables-the-tick-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-2-Z-Best-Clips-—-des-e50de-ed-motion-disables-the-tick-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  1 failed
    [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick 
  1 skipped
  284 passed (1.4m)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test
```

### `pnpm lint` (run 1)
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
@zbest/ui:lint: cache miss, executing a7535a17ff5ec719
e2e:lint: cache miss, executing d39dee20dea4dbe0
@zbest/zbc:lint: cache miss, executing 98cb0571a22c1da9
@zbest/zbm:lint: cache miss, executing a088b55b255da6a7
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 
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
@zbest/zbc:lint: 
@zbest/zbc:lint: > @zbest/zbc@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:lint: > eslint .
@zbest/zbc:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    1.876s 

```

### exit codes (run 1)
```
build=0
typecheck=0
e2e=1
lint=0
DONE
```

## Gate — run 2, clean

Same tree, wiped state again. Its pre-gate `git status` shows two modified files: the stale
test name and stale comment, uncommitted at the time and committed afterwards as `51328e9`.
So run 2 is the tree of `51328e9`.

### repository state (run 2)
```
=== date/env ===
2026-09-18T13:55:17Z
Darwin 25.6.0
v24.9.0
9.15.0
=== git status ===
On branch main
Your branch is ahead of 'origin/main' by 2 commits.
  (use "git push" to publish your local commits)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   apps/zbm/content/revenue-recovery.ts
	modified:   e2e/tests/phase-4-zbm.spec.ts

no changes added to commit (use "git add" and/or "git commit -a")
=== git rev-parse HEAD ===
3814c4a0ac4df6e2fc227bfb5483e260673fbd40
=== git ls-remote origin main ===
92cbf365eee27ba73cff275a44711c12bfd3d6e3	refs/heads/main
```

### `pnpm build` (run 2)
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbm:build: cache miss, executing f9251f868802f6a1
@zbest/zbc:build: cache miss, executing 3bf916a1a400ac70
@zbest/zbc:build: 
@zbest/zbc:build: > @zbest/zbc@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:build: > next build
@zbest/zbc:build: 
@zbest/zbm:build: 
@zbest/zbm:build: > @zbest/zbm@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:build: > next build
@zbest/zbm:build: 
@zbest/zbc:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbm:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbc:build: ✓ Running next.config.ts took 13ms
@zbest/zbm:build: ✓ Running next.config.ts took 13ms
@zbest/zbc:build: 
@zbest/zbm:build: 
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbc:build: ✓ Compiled successfully in 2.5s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbm:build: ✓ Compiled successfully in 2.7s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build:   Finished TypeScript in 1188ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Finished TypeScript in 1314ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 329ms
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
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (18/25) 
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 364ms
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

 Tasks:    2 successful, 2 total
Cached:    0 cached, 2 total
  Time:    6.441s 

```

### `pnpm typecheck` (run 2)
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

@zbest/zbc:typecheck: cache miss, executing ecea9f10f4d4a13f
e2e:typecheck: cache miss, executing 03ea8a86d7d40aad
@zbest/zbm:typecheck: cache miss, executing 5d62620437dbfc98
@zbest/ui:typecheck: cache miss, executing 0f571858f6885de2
@zbest/zbm:typecheck: 
@zbest/zbm:typecheck: > @zbest/zbm@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:typecheck: > tsc --noEmit
@zbest/zbm:typecheck: 
@zbest/zbc:typecheck: 
@zbest/zbc:typecheck: > @zbest/zbc@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:typecheck: > tsc --noEmit
@zbest/zbc:typecheck: 
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 
@zbest/ui:typecheck: 
@zbest/ui:typecheck: > @zbest/ui@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:typecheck: > tsc --noEmit
@zbest/ui:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.044s 

```

### `pnpm --filter e2e exec playwright test` (run 2)
```

  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 286 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (372ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (228ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (251ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (150ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (202ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (247ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (130ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (188ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (257ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (177ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (180ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (173ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (172ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (119ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (84ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (125ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (126ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (128ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (191ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (330ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (35ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (327ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (44ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (290ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (217ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (164ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (174ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (157ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (189ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (122ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (294ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (112ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (114ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (113ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (151ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (320ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (36ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (243ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (44ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (273ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (242ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (242ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (129ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (100ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (182ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (216ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (181ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (212ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (202ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (119ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (107ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (107ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (100ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (111ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (115ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (112ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (103ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (112ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (31ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (121ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (117ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (145ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (96ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (111ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (277ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (98ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (293ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (37ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (34ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (94ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (397ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (389ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (190ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (154ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (102ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (132ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (48ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (237ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (230ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (392ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (209ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (242ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (139ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (123ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (130ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (103ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (103ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (99ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (102ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (117ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (122ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (104ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (143ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (146ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (115ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (495ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (67ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (111ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (128ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (116ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (129ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (170ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (572ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (33ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (33ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (37ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (31ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (94ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (94ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (195ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (435ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (103ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (96ms)
  ✓  126 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (92ms)
  ✓  127 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (107ms)
  ✓  128 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (95ms)
  ✓  129 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (49ms)
  ✓  130 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (48ms)
  ✓  131 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✓  132 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (43ms)
  ✓  133 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (33ms)
  ✓  134 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (33ms)
  ✓  135 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓  136 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓  137 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (34ms)
  ✓  138 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (33ms)
  ✓  139 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (339ms)
  ✓  140 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (230ms)
  ✓  141 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (555ms)
  ✓  142 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (509ms)
  ✓  143 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (584ms)
  ✓  144 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (691ms)
  ✓  145 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (607ms)
  ✓  146 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (528ms)
  ✓  147 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (252ms)
  ✓  148 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (303ms)
  ✓  149 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.6s)
  ✓  150 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (578ms)
  ✓  151 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (237ms)
  ✓  152 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (312ms)
  ✓  153 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.6s)
  ✓  154 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (448ms)
  ✓  155 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (348ms)
  ✓  156 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (347ms)
  ✓  157 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (340ms)
  ✓  158 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (322ms)
  ✓  159 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (221ms)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (392ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (207ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (213ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (229ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (274ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (474ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (131ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (396ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (150ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (413ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (648ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (338ms)
  ✓  172 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (368ms)
  ✓  173 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (325ms)
  ✓  174 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (315ms)
  ✓  175 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (235ms)
  ✓  176 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (347ms)
  ✓  177 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (211ms)
  ✓  178 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (234ms)
  ✓  179 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (229ms)
  ✓  180 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (270ms)
  ✓  181 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (486ms)
  ✓  182 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (131ms)
  ✓  183 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (376ms)
  ✓  184 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (142ms)
  ✓  185 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (403ms)
  ✓  186 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (390ms)
  ✓  187 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (389ms)
  ✓  188 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (277ms)
  ✓  189 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (224ms)
  -  190 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  191 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (606ms)
  ✓  192 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (297ms)
  ✓  193 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (298ms)
  ✓  194 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (306ms)
  ✓  195 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (403ms)
  ✓  196 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (349ms)
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (303ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (329ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (294ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (230ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (208ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (205ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (202ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (224ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (215ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (209ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (220ms)
  ✓  208 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (215ms)
  ✓  209 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (132ms)
  ✓  210 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (234ms)
  ✓  211 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (224ms)
  ✓  212 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (262ms)
  ✓  213 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.5s)
  ✓  214 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (199ms)
  ✓  215 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (242ms)
  ✓  216 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (325ms)
  ✓  217 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (198ms)
  ✓  218 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (344ms)
  ✓  219 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (136ms)
  ✓  220 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (133ms)
  ✓  221 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (201ms)
  ✓  222 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (558ms)
  ✓  223 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (585ms)
  ✓  224 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (305ms)
  ✓  225 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (273ms)
  ✓  226 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (210ms)
  ✓  227 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (232ms)
  ✓  228 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (144ms)
  ✓  229 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (126ms)
  ✓  230 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (411ms)
  ✓  231 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (368ms)
  ✓  232 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (629ms)
  ✓  233 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (352ms)
  ✓  234 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓  235 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (324ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (411ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (248ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (225ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (242ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (206ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (203ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (207ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (211ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (235ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (231ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (249ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (256ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (233ms)
  ✓  251 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (630ms)
  ✓  252 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (179ms)
  ✓  253 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (221ms)
  ✓  254 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (240ms)
  ✓  255 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (215ms)
  ✓  256 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (247ms)
  ✓  257 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (292ms)
  ✓  258 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (713ms)
  ✓  259 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (134ms)
  ✓  260 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (138ms)
  ✓  261 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (134ms)
  ✓  262 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (130ms)
  ✓  263 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (208ms)
  ✓  264 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (192ms)
  ✓  265 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (269ms)
  ✓  266 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (571ms)
  ✓  267 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (212ms)
  ✓  268 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (194ms)
  ✓  269 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (200ms)
  ✓  270 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (221ms)
  ✓  271 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (207ms)
  ✓  272 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (150ms)
  ✓  273 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (148ms)
  ✓  274 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (131ms)
  ✓  275 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (139ms)
  ✓  276 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (135ms)
  ✓  277 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (138ms)
  ✓  278 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (138ms)
  ✓  279 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (139ms)
  ✓  280 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (125ms)
  ✓  281 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (129ms)
  ✓  282 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (510ms)
  ✓  283 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (346ms)
  ✓  284 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (698ms)
  ✓  285 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (605ms)
  ✓  286 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (669ms)

  1 skipped
  285 passed (1.4m)
```

### `pnpm lint` (run 2)
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/ui:lint: cache miss, executing a7535a17ff5ec719
@zbest/zbc:lint: cache miss, executing 98cb0571a22c1da9
e2e:lint: cache miss, executing d39dee20dea4dbe0
@zbest/zbm:lint: cache miss, executing a088b55b255da6a7
@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
@zbest/zbm:lint: 
@zbest/zbm:lint: > @zbest/zbm@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:lint: > eslint .
@zbest/zbm:lint: 
@zbest/config:lint: 
@zbest/config:lint: > @zbest/config@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/config
@zbest/config:lint: > eslint .
@zbest/config:lint: 
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 
@zbest/ui:lint: 
@zbest/ui:lint: > @zbest/ui@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:lint: > eslint .
@zbest/ui:lint: 
@zbest/zbc:lint: 
@zbest/zbc:lint: > @zbest/zbc@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:lint: > eslint .
@zbest/zbc:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    1.923s 

```

### exit codes (run 2)
```
build=0
typecheck=0
e2e=0
lint=0
DONE
```

### `impeccable detect --json`
```
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbm/components apps/zbc/app
[]
```

## Captures

```
$ git diff --name-status 92cbf36..51328e9 -- e2e/snapshots/
M	e2e/snapshots/phase-1/zbm-home-desktop-1440.png
M	e2e/snapshots/phase-1/zbm-home-mobile-390.png
M	e2e/snapshots/phase-3/zbm-home-desktop-1440.png
M	e2e/snapshots/phase-3/zbm-home-mobile-390.png
M	e2e/snapshots/phase-4-zbm/zbm-faq-desktop-1440.png
M	e2e/snapshots/phase-4-zbm/zbm-faq-mobile-390.png
M	e2e/snapshots/phase-4-zbm/zbm-home-desktop-1440.png
M	e2e/snapshots/phase-4-zbm/zbm-home-mobile-390.png
M	e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
M	e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
A	e2e/snapshots/phase-5/zbm-assessment-form-desktop-1440.png
A	e2e/snapshots/phase-5/zbm-assessment-form-mobile-390.png
A	e2e/snapshots/phase-5/zbm-assessment-insufficient-desktop-1440.png
A	e2e/snapshots/phase-5/zbm-assessment-insufficient-mobile-390.png
A	e2e/snapshots/phase-5/zbm-assessment-result-desktop-1440.png
A	e2e/snapshots/phase-5/zbm-assessment-result-mobile-390.png

$ git diff --name-only 92cbf36..51328e9 -- apps/zbc packages/ui
[empty output]
```

Six new captures under `e2e/snapshots/phase-5/`, the assessment section in three states at
both viewports. Ten existing captures moved by design: ZBM Home in phase-1, phase-3 and
phase-4-zbm (the CTA copy), plus Revenue Recovery (the assessment) and FAQ (the restored
question). The second command above lists ZBC and shared-package changes in this lane; its
output is what shows whether any exist.

### Zip, and its contents checked against the committed blobs
```
$ unzip -l docs/phase-5-assessment-captures.zip
Archive:  docs/phase-5-assessment-captures.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   132981  09-18-2026 06:56   zbm-assessment-form-desktop-1440.png
   668656  09-18-2026 06:56   zbm-assessment-form-mobile-390.png
    61217  09-18-2026 06:56   zbm-assessment-insufficient-desktop-1440.png
   232668  09-18-2026 06:56   zbm-assessment-insufficient-mobile-390.png
    70022  09-18-2026 06:56   zbm-assessment-result-desktop-1440.png
   272627  09-18-2026 06:56   zbm-assessment-result-mobile-390.png
---------                     -------
  1438171                     6 files
$ shasum -a 256 docs/phase-5-assessment-captures.zip e2e/snapshots/phase-5/*.png
a0cff020423e9eb99e39af3f523aab1834e062edf4da52b8cfb5aa50b09b2b91  docs/phase-5-assessment-captures.zip
7e2e76b7dbccf10be943ee76464c83cc9bcc69b763e50017c57f2e15f84bc5c0  e2e/snapshots/phase-5/zbm-assessment-form-desktop-1440.png
a404c6b71cc51f374645fdea222467a60e2777846d1702ba116fe4cde99b07f2  e2e/snapshots/phase-5/zbm-assessment-form-mobile-390.png
d742aa2de0e0a756a5bc7d22ff7db23f73673c1d3c442c82fc87cc82c9d5b2d9  e2e/snapshots/phase-5/zbm-assessment-insufficient-desktop-1440.png
d790cfd5a00fc6a11895ac2837855753986f86149f51dd17bba147e93138c808  e2e/snapshots/phase-5/zbm-assessment-insufficient-mobile-390.png
f76e78b891f6e8d046b5d1612b3454c2ac0523d9af35af00f2d09bb74c17b1fe  e2e/snapshots/phase-5/zbm-assessment-result-desktop-1440.png
42aaf49378b67722e65159e6cd34da153076257703c1ad4bd8cfd5a89fb3cbbb  e2e/snapshots/phase-5/zbm-assessment-result-mobile-390.png
```

## Mutation run — twelve mutations, each applied alone

Each mutation was applied alone to the committed tree of `3814c4a`, followed by
`playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts`, then reverted before the
next. The runner records build failures separately (`webServerFailed`), so a mutation that
breaks the build cannot be counted as caught.

### First pass, as the runner recorded it
```
M1 applied
M1 exit=1 failed=2 webServerFailed=0
M2 applied
M2 exit=1 failed=2 webServerFailed=0
M3 applied
M3 exit=1 failed=4 webServerFailed=0
M4 applied
M4 exit=1 failed=4 webServerFailed=0
M5 applied
M5 exit=1 failed=2 webServerFailed=0
M6 applied
M6 exit=1 failed=4 webServerFailed=0
M7 applied
M7 exit=1 failed=2 webServerFailed=0
M8 applied
M8 exit=1 failed=2 webServerFailed=0
M9 applied
M9 exit=1 failed=0 webServerFailed=1
M10 applied
M10 exit=1 failed=2 webServerFailed=0
M11 applied
M11 exit=1 failed=4 webServerFailed=0
M12 applied
M12 exit=1 failed=4 webServerFailed=0
restored, modified files: 0
DONE
```

**M9 did not count on the first pass.** It shows `failed=0 webServerFailed=1`: deleting
`<NextSteps />` left the function unused and failed the build, so no test ran. That is a
compile error, not a caught mutant, which is the same false start as ZBC M3. M9 was rewritten
to compile, keeping the function but no longer routing `insufficient_signal`, which is the
regression the test exists for, and re-run alone. Its raw output below is the redo.

| # | Mutation | Caught by | Assertion that fired |
|---|---|---|---|
| M1 | C2: a remediation authored into the rule set instead of derived | C2: every category's rationale and remediation equal the published Leak Library, character for character (151ms); C2: every category's rationale and remediation equal the published Leak Library, character for character (55ms) | `Error: offer remediation` |
| M2 | the approved priority order changed (conversion <-> offer) | the approved priority order decides every tie, all the way down (151ms); the approved priority order decides every tie, all the way down (51ms) | `Error: with conversion, offer, trust, tracking, creative, visibility, traffic tied` |
| M3 | all zeros returns a category instead of insufficient_signal | all answers 'Not true' is insufficient_signal — no category is invented (147ms); all answers 'Not true' is insufficient_signal — no category is invented (50ms); insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.5s); insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.6s) | `Error: expect(received).toMatchObject(expected)` |
| M4 | priority consulted before score: first non-zero wins, not the highest | a leak: the leak, the because template, the fix, and both next steps (5.5s); a leak: the leak, the because template, the fix, and both next steps (5.6s); the highest score wins before priority is consulted (147ms); the highest score wins before priority is consulted (48ms) | `Error: expect(received).toMatchObject(expected)` |
| M5 | client stops validating: an invalid request reaches the stub | validates with the shared schema before sending — nothing reaches the stub (307ms); validates with the shared schema before sending — nothing reaches the stub (373ms) | `Error: expect(received).toBe(expected) // Object.is equality` |
| M6 | the shared schema stops requiring every question | the stub rejects every malformed answer set, field by field, and stays a stub (153ms); the stub rejects every malformed answer set, field by field, and stays a stub (51ms); validates with the shared schema before sending — nothing reaches the stub (5.2s); validates with the shared schema before sending — nothing reaches the stub (5.4s) | `Error: a missing answer` |
| M7 | a superseded rule-set version is scored instead of refused | a superseded rule-set version is refused with a typed error, never scored (151ms); a superseded rule-set version is refused with a typed error, never scored (47ms) | `Error: expect(received).toBe(expected) // Object.is equality` |
| M8 | a dollar estimate appears on the free result | no free result carries a dollar figure, a currency or an estimate (148ms); no free result carries a dollar figure, a currency or an estimate (48ms) | `Error: expect(received).not.toMatch(expected)` |
| M9 | insufficient_signal stops routing to the Audit and Talk to Us | insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.5s); insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.6s) | `Error: expect(locator).toHaveAttribute(expected) failed` |
| M10 | the because template shows the raw score instead of the label | a leak: the leak, the because template, the fix, and both next steps (5.5s); a leak: the leak, the because template, the fix, and both next steps (5.6s) | `Error: expect(locator).toHaveText(expected) failed` |
| M11 | the retired wording returns on Home | featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.2s); featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.3s); renders, carries its metadata, holds the site rules, and is captured (207ms); renders, carries its metadata, holds the site rules, and is captured (378ms) | `Error: expect(received).not.toMatch(expected)` |
| M12 | the decision-10 wording leaves Home | featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.2s); featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.3s); renders, carries its metadata, holds the site rules, and is captured (197ms); renders, carries its metadata, holds the site rules, and is captured (381ms) | `Error: decision-10 wording` |

Each test name appears twice in the table because it failed on both viewports, each run with
its own timing. The M11 and M12 rows show the Home test under its old name, "…a held CTA…",
because the mutations ran at `3814c4a`, before `51328e9` renamed it. The raw output is correct
for the tree it ran against and is left as recorded.

All twelve are caught by assertions, M9 counting only its redo. Every one fails on both
viewports. M11 and M12 are the decision-10 checks in `phase-4-zbm.spec.ts`: M11 puts
"60 seconds" back and trips the permanent-retirement check; M12 removes "one prioritized
leak" and trips the new positive assertion.

### Raw output

#### M1
```
=== M1 diff ===
 apps/zbm/lib/assessment/rules.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (400ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (189ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (183ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (243ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (137ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (115ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (127ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (107ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (99ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (100ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (101ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (99ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (118ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (106ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (126ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (148ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (108ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (388ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (63ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (105ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (120ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (109ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (130ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (192ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (565ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (35ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (35ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (111ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (81ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (195ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (392ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (100ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (89ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (82ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (104ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (92ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (55ms)
  ✘   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (55ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (48ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (50ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (39ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (35ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (40ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (35ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (31ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (319ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (220ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (583ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (486ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (546ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (502ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (367ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (626ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (354ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (288ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (323ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (402ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (252ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (224ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (235ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (207ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (199ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (204ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (217ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (231ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (227ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (250ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (254ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (239ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (523ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (177ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (225ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (234ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (223ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (247ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (278ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (690ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (125ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (129ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (132ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (126ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (205ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (198ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (288ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (582ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (208ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (198ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (193ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (215ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (206ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (175ms)
  ✘  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (151ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (198ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (152ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (133ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (132ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (132ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (133ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (127ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (523ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (359ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (688ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (573ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (695ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 

    Error: offer remediation

    expect(received).toBe(expected) // Object.is equality

    Expected: "Clarify the promise, sharpen the outcome, and reduce ambiguity."
    Received: "Clarify the offer."

      142 |       expect(result.category, category).toBe(category);
      143 |       expect(result.rationale, `${category} rationale`).toBe(library[category]!.body);
    > 144 |       expect(result.remediation, `${category} remediation`).toBe(library[category]!.fix);
          |                                                             ^
      145 |     }
      146 |   });
      147 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:144:61

    Error Context: test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 

    Error: offer remediation

    expect(received).toBe(expected) // Object.is equality

    Expected: "Clarify the promise, sharpen the outcome, and reduce ambiguity."
    Received: "Clarify the offer."

      142 |       expect(result.category, category).toBe(category);
      143 |       expect(result.rationale, `${category} rationale`).toBe(library[category]!.body);
    > 144 |       expect(result.remediation, `${category} remediation`).toBe(library[category]!.fix);
          |                                                             ^
      145 |     }
      146 |   });
      147 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:144:61

    Error Context: test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 
    [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 
  112 passed (34.8s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M2
```
=== M2 diff ===
 apps/zbm/lib/assessment/rules.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (282ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (407ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (186ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (240ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (143ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (115ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (128ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (104ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (105ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (99ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (102ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (99ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (116ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (108ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (137ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (144ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (106ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (390ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (62ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (105ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (119ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (111ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (131ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (170ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (565ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (33ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (31ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (111ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (80ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (195ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (415ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (95ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (86ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (94ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (123ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (92ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (54ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (49ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✘   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (51ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (50ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (41ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (39ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (43ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (321ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (218ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (554ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (485ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (579ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (512ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (378ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (625ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (338ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (286ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (416ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (249ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (226ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (237ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (204ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (209ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (206ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (207ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (233ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (225ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (250ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (259ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (226ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (617ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (177ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (220ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (235ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (227ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (243ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (279ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (698ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (128ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (131ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (133ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (127ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (207ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (195ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (266ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (574ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (206ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (195ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (209ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (205ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (147ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (142ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (130ms)
  ✘  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (151ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (202ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (142ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (137ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (142ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (131ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (128ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (532ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (378ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (711ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (588ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (676ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 

    Error: with conversion, offer, trust, tracking, creative, visibility, traffic tied

    expect(received).toBe(expected) // Object.is equality

    Expected: "conversion"
    Received: "offer"

      163 |     for (const [index, expected] of PRIORITY.entries()) {
      164 |       const result = await score(page, answers);
    > 165 |       expect(result.category, `with ${PRIORITY.slice(index).join(", ")} tied`).toBe(expected);
          |                                                                                ^
      166 |       expect(result.tie_broken_by_priority).toBe(index < PRIORITY.length - 1);
      167 |       answers[expected] = 0;
      168 |     }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:165:80

    Error Context: test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 

    Error: with conversion, offer, trust, tracking, creative, visibility, traffic tied

    expect(received).toBe(expected) // Object.is equality

    Expected: "conversion"
    Received: "offer"

      163 |     for (const [index, expected] of PRIORITY.entries()) {
      164 |       const result = await score(page, answers);
    > 165 |       expect(result.category, `with ${PRIORITY.slice(index).join(", ")} tied`).toBe(expected);
          |                                                                                ^
      166 |       expect(result.tie_broken_by_priority).toBe(index < PRIORITY.length - 1);
      167 |       answers[expected] = 0;
      168 |     }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:165:80

    Error Context: test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 
    [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 
  112 passed (35.0s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M3
```
=== M3 diff ===
 apps/zbm/lib/assessment/score.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (258ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (402ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (190ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (239ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (142ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (110ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (127ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (106ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (103ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (100ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (102ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (102ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (119ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (102ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (135ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (146ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (112ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (389ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (63ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (110ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (118ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (113ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (126ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (192ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (586ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (46ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (41ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (67ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (35ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (110ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (95ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (199ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (420ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (120ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (87ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (86ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (102ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (99ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (53ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (49ms)
  ✘   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (50ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (66ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (37ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (35ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (40ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (40ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (36ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (340ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (216ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (569ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (483ms)
  ✘   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.5s)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (519ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (370ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (624ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (345ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (285ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (323ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (411ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (249ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (230ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (238ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (207ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (205ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (203ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (203ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (211ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (246ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (238ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (260ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (263ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (229ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (622ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (176ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (219ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (237ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (221ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (243ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (282ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (688ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (127ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (127ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (128ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (127ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (205ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (193ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (276ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (559ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (206ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (195ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (198ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (219ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (207ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (147ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (141ms)
  ✘  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (147ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (222ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (137ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (134ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (134ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (140ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (129ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (535ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (367ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (721ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (603ms)
  ✘  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.6s)


  1) [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 

    Error: expect(received).toMatchObject(expected)

    - Expected  -  6
    + Received  + 11

      Object {
    -   "because": null,
    -   "category": null,
    -   "rationale": null,
    -   "remediation": null,
    -   "status": "insufficient_signal",
    -   "tie_broken_by_priority": false,
    +   "because": Object {
    +     "question_id": "follow_up",
    +     "statement": "When a lead comes in, we don't always respond fast or follow up consistently.",
    +     "value": 0,
    +     "value_label": "Not true",
    +   },
    +   "category": "follow_up",
    +   "rationale": "Leads come in, but they are not contacted quickly or consistently enough.",
    +   "remediation": "Automate follow-up, improve response speed, and tighten handoff rules.",
    +   "status": "leak_identified",
    +   "tie_broken_by_priority": true,
        "tier": "free",
      }

      148 |   test("all answers 'Not true' is insufficient_signal — no category is invented", async ({ page }) => {
      149 |     const result = await score(page, all(0));
    > 150 |     expect(result).toMatchObject({
          |                    ^
      151 |       tier: "free",
      152 |       status: "insufficient_signal",
      153 |       category: null,
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:150:20

    Error Context: test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#assessment').locator('[data-assessment-result="insufficient_signal"]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#assessment').locator('[data-assessment-result="insufficient_signal"]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="insufficient_signal"]')


      313 |
      314 |     const result = section.locator('[data-assessment-result="insufficient_signal"]');
    > 315 |     await expect(result).toBeVisible();
          |                          ^
      316 |     await expect(result.getByRole("heading", { level: 3 })).toHaveText("No prioritized leak from these answers.");
      317 |     await expect(result.locator("[data-assessment-category]")).toHaveCount(0);
      318 |     await expect(result).toContainText("we won’t invent one");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:315:26

    Error Context: test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 

    Error: expect(received).toMatchObject(expected)

    - Expected  -  6
    + Received  + 11

      Object {
    -   "because": null,
    -   "category": null,
    -   "rationale": null,
    -   "remediation": null,
    -   "status": "insufficient_signal",
    -   "tie_broken_by_priority": false,
    +   "because": Object {
    +     "question_id": "follow_up",
    +     "statement": "When a lead comes in, we don't always respond fast or follow up consistently.",
    +     "value": 0,
    +     "value_label": "Not true",
    +   },
    +   "category": "follow_up",
    +   "rationale": "Leads come in, but they are not contacted quickly or consistently enough.",
    +   "remediation": "Automate follow-up, improve response speed, and tighten handoff rules.",
    +   "status": "leak_identified",
    +   "tie_broken_by_priority": true,
        "tier": "free",
      }

      148 |   test("all answers 'Not true' is insufficient_signal — no category is invented", async ({ page }) => {
      149 |     const result = await score(page, all(0));
    > 150 |     expect(result).toMatchObject({
          |                    ^
      151 |       tier: "free",
      152 |       status: "insufficient_signal",
      153 |       category: null,
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:150:20

    Error Context: test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#assessment').locator('[data-assessment-result="insufficient_signal"]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#assessment').locator('[data-assessment-result="insufficient_signal"]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="insufficient_signal"]')


      313 |
      314 |     const result = section.locator('[data-assessment-result="insufficient_signal"]');
    > 315 |     await expect(result).toBeVisible();
          |                          ^
      316 |     await expect(result.getByRole("heading", { level: 3 })).toHaveText("No prioritized leak from these answers.");
      317 |     await expect(result.locator("[data-assessment-category]")).toHaveCount(0);
      318 |     await expect(result).toContainText("we won’t invent one");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:315:26

    Error Context: test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 
    [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 
    [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 
    [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 
  110 passed (45.0s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M4
```
=== M4 diff ===
 apps/zbm/lib/assessment/score.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (225ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (397ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (212ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (190ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (242ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (140ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (114ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (125ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (100ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (103ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (95ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (101ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (104ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (117ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (109ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (136ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (144ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (112ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (402ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (82ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (105ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (120ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (111ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (131ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (196ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (643ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (45ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (33ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (33ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (99ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (93ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (176ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (407ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (98ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (83ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (86ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (98ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (92ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (53ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (47ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (35ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (47ms)
  ✘   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (48ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (51ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (40ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (49ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (33ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (337ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (217ms)
  ✘   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (5.5s)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (502ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (565ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (515ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (370ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (629ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (353ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (283ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (323ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (410ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (252ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (237ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (238ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (222ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (227ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (206ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (207ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (231ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (224ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (254ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (260ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (222ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (522ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (177ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (219ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (235ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (221ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (252ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (290ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (698ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (129ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (126ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (128ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (130ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (204ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (211ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (265ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (575ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (204ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (201ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (187ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (214ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (202ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (151ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (140ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (125ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (146ms)
  ✘  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (147ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (201ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (148ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (142ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (134ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (127ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (527ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (380ms)
  ✘  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (5.6s)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (697ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (684ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 

    Error: expect(received).toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
    -   "category": "traffic",
    -   "tie_broken_by_priority": false,
    +   "category": "follow_up",
    +   "tie_broken_by_priority": true,
      }

      172 |     // Traffic is last in the order but alone at the top score.
      173 |     const lone = await score(page, { ...all(1), traffic: 2 });
    > 174 |     expect(lone).toMatchObject({ category: "traffic", tie_broken_by_priority: false });
          |                  ^
      175 |     expect(lone.because).toMatchObject({ question_id: "traffic", value: 2, value_label: "Very true" });
      176 |     // Everything 'Somewhat true': the order picks, and says it did.
      177 |     const flat = await score(page, all(1));
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:174:18

    Error Context: test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]')
    Expected: 0
    Received: 1
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]')
        14 × locator resolved to 1 element
           - unexpected value "1"


      287 |     await expect(result.locator("blockquote")).toHaveText(QUESTIONS[1]![1]);
      288 |     await expect(result.locator("[data-assessment-remediation]")).toHaveText(library.conversion!.fix);
    > 289 |     await expect(result.locator("[data-assessment-tie]")).toHaveCount(0);
          |                                                           ^
      290 |     await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
      291 |     await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
      292 |     expect(await result.innerText()).not.toMatch(/\$/);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:289:59

    Error Context: test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 

    Error: expect(received).toMatchObject(expected)

    - Expected  - 2
    + Received  + 2

      Object {
    -   "category": "traffic",
    -   "tie_broken_by_priority": false,
    +   "category": "follow_up",
    +   "tie_broken_by_priority": true,
      }

      172 |     // Traffic is last in the order but alone at the top score.
      173 |     const lone = await score(page, { ...all(1), traffic: 2 });
    > 174 |     expect(lone).toMatchObject({ category: "traffic", tie_broken_by_priority: false });
          |                  ^
      175 |     expect(lone.because).toMatchObject({ question_id: "traffic", value: 2, value_label: "Very true" });
      176 |     // Everything 'Somewhat true': the order picks, and says it did.
      177 |     const flat = await score(page, all(1));
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:174:18

    Error Context: test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]')
    Expected: 0
    Received: 1
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-tie]')
        14 × locator resolved to 1 element
           - unexpected value "1"


      287 |     await expect(result.locator("blockquote")).toHaveText(QUESTIONS[1]![1]);
      288 |     await expect(result.locator("[data-assessment-remediation]")).toHaveText(library.conversion!.fix);
    > 289 |     await expect(result.locator("[data-assessment-tie]")).toHaveCount(0);
          |                                                           ^
      290 |     await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
      291 |     await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
      292 |     expect(await result.innerText()).not.toMatch(/\$/);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:289:59

    Error Context: test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 
    [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 
    [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 
    [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 
  110 passed (45.8s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M5
```
=== M5 diff ===
 apps/zbm/lib/assessment/contract.ts | 3 +--
 1 file changed, 1 insertion(+), 2 deletions(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (233ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (401ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (241ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (135ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (120ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (125ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (105ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (102ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (96ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (102ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (101ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (116ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (110ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (140ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (151ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (138ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (398ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (62ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (110ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (121ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (117ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (170ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (630ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (95ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (82ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (194ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (396ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (95ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (85ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (84ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (101ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (94ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (58ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (44ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (46ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (33ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (33ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (34ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (38ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (31ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (321ms)
  ✘   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (307ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (566ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (491ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (512ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (368ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (625ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (345ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (275ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (285ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (316ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (415ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (254ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (227ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (239ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (205ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (199ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (199ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (201ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (210ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (235ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (220ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (255ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (251ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (231ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (519ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (176ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (218ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (236ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (224ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (248ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (283ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (726ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (133ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (134ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (134ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (126ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (207ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (195ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (273ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (574ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (206ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (193ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (196ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (214ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (207ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (147ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (143ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (126ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (139ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (128ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (129ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (132ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (135ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (130ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (125ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (488ms)
  ✘  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (373ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (804ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (583ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (686ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      264 |     await expect(section.getByText("Some answers need attention.")).toBeVisible();
      265 |     await expect(section.getByText("Choose an answer.")).toHaveCount(7);
    > 266 |     expect(sent).toBe(0);
          |                  ^
      267 |   });
      268 |
      269 |   test("a leak: the leak, the because template, the fix, and both next steps", async ({ page }, testInfo) => {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:266:18

    Error Context: test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      264 |     await expect(section.getByText("Some answers need attention.")).toBeVisible();
      265 |     await expect(section.getByText("Choose an answer.")).toHaveCount(7);
    > 266 |     expect(sent).toBe(0);
          |                  ^
      267 |   });
      268 |
      269 |   test("a leak: the leak, the because template, the fix, and both next steps", async ({ page }, testInfo) => {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:266:18

    Error Context: test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 
    [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 
  112 passed (34.9s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M6
```
=== M6 diff ===
 apps/zbm/lib/assessment/contract.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (417ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (239ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (161ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (119ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (130ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (101ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (102ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (109ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (99ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (101ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (122ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (111ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (137ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (156ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (111ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (391ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (61ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (104ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (121ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (110ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (177ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (564ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (93ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (86ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (190ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (405ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (104ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (88ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (83ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (102ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (96ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (54ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (46ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (31ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (44ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (34ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (35ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (35ms)
  ✘   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (51ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (49ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (35ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (339ms)
  ✘   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (5.2s)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (559ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (489ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (581ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (505ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (369ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (627ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (339ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (286ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (316ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (410ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (250ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (225ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (232ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (205ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (196ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (197ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (205ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (205ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (244ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (223ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (250ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (258ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (227ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (612ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (179ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (226ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (231ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (222ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (252ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (286ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (703ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (132ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (128ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (133ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (127ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (209ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (193ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (268ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (577ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (204ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (195ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (214ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (205ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (146ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (148ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (128ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (139ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (130ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (131ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (138ms)
  ✘  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (153ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (200ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (139ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (527ms)
  ✘  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (5.4s)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (808ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (564ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (685ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub 

    Error: a missing answer

    expect(received).toBe(expected) // Object.is equality

    Expected: 422
    Received: 200

      207 |     for (const [label, data, field, message] of cases) {
      208 |       const res = await post(page, data);
    > 209 |       expect(res.status(), label).toBe(422);
          |                                   ^
      210 |       expect(res.headers()["x-zbest-lead-stub"], label).toBe("no-delivery");
      211 |       const body = await res.json();
      212 |       expect(body.error.code, label).toBe("validation");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:209:35

    Error Context: test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#assessment').getByText('Some answers need attention.')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#assessment').getByText('Some answers need attention.') with timeout 5000ms
      - waiting for locator('#assessment').getByText('Some answers need attention.')


      262 |     await choose(section, { follow_up: "Very true" });
      263 |     await section.getByRole("button", { name: "Get an Assessment" }).click();
    > 264 |     await expect(section.getByText("Some answers need attention.")).toBeVisible();
          |                                                                     ^
      265 |     await expect(section.getByText("Choose an answer.")).toHaveCount(7);
      266 |     expect(sent).toBe(0);
      267 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:264:69

    Error Context: test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub 

    Error: a missing answer

    expect(received).toBe(expected) // Object.is equality

    Expected: 422
    Received: 200

      207 |     for (const [label, data, field, message] of cases) {
      208 |       const res = await post(page, data);
    > 209 |       expect(res.status(), label).toBe(422);
          |                                   ^
      210 |       expect(res.headers()["x-zbest-lead-stub"], label).toBe("no-delivery");
      211 |       const body = await res.json();
      212 |       expect(body.error.code, label).toBe("validation");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:209:35

    Error Context: test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--c3731-d-by-field-and-stays-a-stub-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 

    Error: expect(locator).toBeVisible() failed

    Locator: locator('#assessment').getByText('Some answers need attention.')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" locator('#assessment').getByText('Some answers need attention.') with timeout 5000ms
      - waiting for locator('#assessment').getByText('Some answers need attention.')


      262 |     await choose(section, { follow_up: "Very true" });
      263 |     await section.getByRole("button", { name: "Get an Assessment" }).click();
    > 264 |     await expect(section.getByText("Some answers need attention.")).toBeVisible();
          |                                                                     ^
      265 |     await expect(section.getByText("Choose an answer.")).toHaveCount(7);
      266 |     expect(sent).toBe(0);
      267 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:264:69

    Error Context: test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--2d9ce--—-nothing-reaches-the-stub-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub 
    [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 
    [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub 
    [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub 
  110 passed (45.8s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M7
```
=== M7 diff ===
 apps/zbm/app/api/lead/route.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (265ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (234ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (400ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (215ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (191ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (261ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (145ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (126ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (126ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (104ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (104ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (105ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (100ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (99ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (123ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (104ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (123ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (143ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (116ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (488ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (62ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (102ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (119ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (112ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (128ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (194ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (580ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (36ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (31ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (101ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (92ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (191ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (385ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (99ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (87ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (87ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (103ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (96ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (54ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (50ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (36ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (48ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (36ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (33ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (37ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✘   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (47ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (48ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (337ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (222ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (566ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (485ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (546ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (504ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (371ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (629ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (346ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (294ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (289ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (316ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (405ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (251ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (235ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (234ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (206ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (195ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (208ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (202ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (210ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (254ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (230ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (259ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (266ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (234ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (648ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (185ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (235ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (242ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (234ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (252ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (295ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (709ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (141ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (130ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (137ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (130ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (215ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (200ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (275ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (612ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (212ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (205ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (198ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (216ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (209ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (153ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (146ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (134ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (146ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (131ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (135ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (139ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (140ms)
  ✘  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (151ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (215ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (569ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (387ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (747ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (602ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (759ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 409
    Received: 200

      219 |   test("a superseded rule-set version is refused with a typed error, never scored", async ({ page }) => {
      220 |     const res = await post(page, request(all(2), { rule_set_version: "fixture-2026-01-01.0" }));
    > 221 |     expect(res.status()).toBe(409);
          |                          ^
      222 |     expect(await res.json()).toEqual({
      223 |       ok: false,
      224 |       error: { code: "rule_set_superseded", active_version: RULE_SET_VERSION },
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:221:26

    Error Context: test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 409
    Received: 200

      219 |   test("a superseded rule-set version is refused with a typed error, never scored", async ({ page }) => {
      220 |     const res = await post(page, request(all(2), { rule_set_version: "fixture-2026-01-01.0" }));
    > 221 |     expect(res.status()).toBe(409);
          |                          ^
      222 |     expect(await res.json()).toEqual({
      223 |       ok: false,
      224 |       error: { code: "rule_set_superseded", active_version: RULE_SET_VERSION },
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:221:26

    Error Context: test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 
    [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 
  112 passed (35.5s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M8
```
=== M8 diff ===
 apps/zbm/app/api/lead/route.ts | 1 +
 1 file changed, 1 insertion(+)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (256ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (412ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (210ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (194ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (189ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (205ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (247ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (150ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (130ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (132ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (112ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (112ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (108ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (109ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (108ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (126ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (117ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (143ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (164ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (120ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (394ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (65ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (111ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (119ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (119ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (175ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (582ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (35ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (37ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (36ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (158ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (91ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (196ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (410ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (104ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (94ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (87ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (122ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (100ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (54ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (47ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (46ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (38ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (35ms)
  ✘   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (48ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (58ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (37ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (33ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (337ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (219ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (553ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (489ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (529ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (372ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (615ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (337ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (290ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (319ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (408ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (249ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (228ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (238ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (211ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (201ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (210ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (207ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (213ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (240ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (229ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (253ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (256ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (233ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (514ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (178ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (219ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (240ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (222ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (243ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (285ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (702ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (133ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (127ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (135ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (126ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (204ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (200ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (281ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (616ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (210ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (194ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (198ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (205ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (206ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (145ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (142ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (125ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (140ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (127ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (131ms)
  ✘  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (148ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (216ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (142ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (135ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (534ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (378ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (735ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (579ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (686ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /\$/
    Received string:      "{\"status\":\"insufficient_signal\",\"category\":null,\"rationale\":null,\"remediation\":null,\"because\":null,\"tie_broken_by_priority\":false,\"tier\":\"free\",\"estimated_monthly_loss\":\"$1,200\",\"submission_id\":\"edbb34f7-3c3f-4d59-b579-71be746842f8\",\"rule_set_version\":\"fixture-2026-09-18.1\",\"rule_set_hash\":\"d773f5f5e410d1752851e9a7cc0e3ca691689eeb9d039923996ce945f556f20e\",\"produced_at\":\"2026-09-18T13:48:28.894Z\"}"

      191 |     for (const answers of [all(0), all(2), only("tracking", 1)]) {
      192 |       const result = await score(page, answers);
    > 193 |       expect(JSON.stringify(result)).not.toMatch(/\$/);
          |                                          ^
      194 |       expect(keys(result).filter((k) => /currency|amount|price|minor_units|estimate|dollar/i.test(k))).toEqual([]);
      195 |     }
      196 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:193:42

    Error Context: test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /\$/
    Received string:      "{\"status\":\"insufficient_signal\",\"category\":null,\"rationale\":null,\"remediation\":null,\"because\":null,\"tie_broken_by_priority\":false,\"tier\":\"free\",\"estimated_monthly_loss\":\"$1,200\",\"submission_id\":\"bb1a0801-3de4-4dcb-9fb7-4805df3c5284\",\"rule_set_version\":\"fixture-2026-09-18.1\",\"rule_set_hash\":\"d773f5f5e410d1752851e9a7cc0e3ca691689eeb9d039923996ce945f556f20e\",\"produced_at\":\"2026-09-18T13:48:44.727Z\"}"

      191 |     for (const answers of [all(0), all(2), only("tracking", 1)]) {
      192 |       const result = await score(page, answers);
    > 193 |       expect(JSON.stringify(result)).not.toMatch(/\$/);
          |                                          ^
      194 |       expect(keys(result).filter((k) => /currency|amount|price|minor_units|estimate|dollar/i.test(k))).toEqual([]);
      195 |     }
      196 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:193:42

    Error Context: test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 
    [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 
  112 passed (35.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M9
```
=== M9 (redo) diff ===
 apps/zbm/components/assessment-form.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (264ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (233ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (417ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (190ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (246ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (144ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (121ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (134ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (101ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (100ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (104ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (102ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (104ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (117ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (115ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (139ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (143ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (112ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (395ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (109ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (110ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (118ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (113ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (129ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (154ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (581ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (38ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (36ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (38ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (34ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (105ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (85ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (193ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (424ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (101ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (84ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (84ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (129ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (94ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (56ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (52ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (43ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (43ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (37ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (33ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (33ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (31ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (319ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (217ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (557ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (462ms)
  ✘   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.5s)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (520ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (378ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (638ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (343ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (289ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (291ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (333ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (416ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (250ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (230ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (269ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (210ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (210ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (203ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (211ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (218ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (247ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (229ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (263ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (269ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (230ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (532ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (177ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (225ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (239ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (227ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (249ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (285ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (726ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (133ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (131ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (136ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (131ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (211ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (196ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (269ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (591ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (226ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (208ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (206ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (222ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (230ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (156ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (148ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (130ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (143ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (135ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (136ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (135ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (139ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (124ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (128ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (517ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (353ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (722ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (608ms)
  ✘  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (5.6s)


  1) [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' })
    Expected: "/revenue-recovery#audit"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveAttribute" locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' }) with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' })


      317 |     await expect(result.locator("[data-assessment-category]")).toHaveCount(0);
      318 |     await expect(result).toContainText("we won’t invent one");
    > 319 |     await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
          |                                                                                   ^
      320 |     await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
      321 |     await capture(section, "insufficient", testInfo.project.name);
      322 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:319:83

    Error Context: test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 

    Error: expect(locator).toHaveAttribute(expected) failed

    Locator: locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' })
    Expected: "/revenue-recovery#audit"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toHaveAttribute" locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' }) with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="insufficient_signal"]').getByRole('link', { name: 'See what the Audit covers' })


      317 |     await expect(result.locator("[data-assessment-category]")).toHaveCount(0);
      318 |     await expect(result).toContainText("we won’t invent one");
    > 319 |     await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
          |                                                                                   ^
      320 |     await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
      321 |     await capture(section, "insufficient", testInfo.project.name);
      322 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:319:83

    Error Context: test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f2112-to-the-Audit-and-Talk-to-Us-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 
    [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us 
  112 passed (44.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M10
```
=== M10 diff ===
 apps/zbm/components/assessment-form.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (261ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (223ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (414ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (230ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (191ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (243ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (140ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (123ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (128ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (104ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (100ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (102ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (110ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (121ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (111ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (140ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (141ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (112ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (495ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (105ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (101ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (118ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (110ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (130ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (171ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (582ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (105ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (109ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (193ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (398ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (94ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (85ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (88ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (113ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (93ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (56ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (47ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (34ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (43ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (35ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (34ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (31ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (318ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (216ms)
  ✘   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (5.5s)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (481ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (565ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (520ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (379ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (622ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (345ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (292ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (289ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (417ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (254ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (234ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (239ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (208ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (201ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (201ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (208ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (246ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (226ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (251ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (257ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (231ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (525ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (182ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (219ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (231ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (226ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (245ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (279ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (696ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (131ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (129ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (129ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (132ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (206ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (196ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (268ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (567ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (209ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (195ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (195ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (209ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (204ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (148ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (143ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (125ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (142ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (128ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (129ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (136ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (139ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (129ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (485ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (344ms)
  ✘  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (5.6s)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (714ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (699ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]')
    Expected: "Because you said this is very true for you:"
    Received: "Because you said this is 2 for you:"
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]')
        14 × locator resolved to <p data-assessment-because="true" class="type-body mt-2 text-text-primary">Because you said this is 2 for you:</p>
           - unexpected value "Because you said this is 2 for you:"


      284 |     await expect(result.getByRole("heading", { level: 3 })).toHaveText(library.conversion!.name);
      285 |     await expect(result.locator("[data-assessment-rationale]")).toHaveText(library.conversion!.body);
    > 286 |     await expect(result.locator("[data-assessment-because]")).toHaveText("Because you said this is very true for you:");
          |                                                               ^
      287 |     await expect(result.locator("blockquote")).toHaveText(QUESTIONS[1]![1]);
      288 |     await expect(result.locator("[data-assessment-remediation]")).toHaveText(library.conversion!.fix);
      289 |     await expect(result.locator("[data-assessment-tie]")).toHaveCount(0);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:286:63

    Error Context: test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]')
    Expected: "Because you said this is very true for you:"
    Received: "Because you said this is 2 for you:"
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]') with timeout 5000ms
      - waiting for locator('#assessment').locator('[data-assessment-result="leak_identified"]').locator('[data-assessment-because]')
        14 × locator resolved to <p data-assessment-because="true" class="type-body mt-2 text-text-primary">Because you said this is 2 for you:</p>
           - unexpected value "Because you said this is 2 for you:"


      284 |     await expect(result.getByRole("heading", { level: 3 })).toHaveText(library.conversion!.name);
      285 |     await expect(result.locator("[data-assessment-rationale]")).toHaveText(library.conversion!.body);
    > 286 |     await expect(result.locator("[data-assessment-because]")).toHaveText("Because you said this is very true for you:");
          |                                                               ^
      287 |     await expect(result.locator("blockquote")).toHaveText(QUESTIONS[1]![1]);
      288 |     await expect(result.locator("[data-assessment-remediation]")).toHaveText(library.conversion!.fix);
      289 |     await expect(result.locator("[data-assessment-tie]")).toHaveCount(0);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:286:63

    Error Context: test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--0cc52-the-fix-and-both-next-steps-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 
    [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps 
  112 passed (45.9s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M11
```
=== M11 diff ===
 apps/zbm/app/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✘    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (207ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (264ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (397ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (244ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (142ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (117ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (132ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (100ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (100ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (97ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (105ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (100ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (116ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (112ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (138ms)
  ✘   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.2s)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (126ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (392ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (67ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (108ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (121ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (114ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (131ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (154ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (583ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (41ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (100ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (82ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (195ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (407ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (94ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (83ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (83ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (108ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (93ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (58ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (46ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (43ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (36ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (35ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (38ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (31ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (316ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (219ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (536ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (485ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (547ms)
  ✘   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (378ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (466ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (627ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (340ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (286ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (316ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (407ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (257ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (228ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (241ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (203ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (203ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (206ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (206ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (212ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (234ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (223ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (252ms)
  ✘   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.3s)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (325ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (646ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (182ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (221ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (232ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (225ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (242ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (274ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (708ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (134ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (125ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (133ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (126ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (208ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (197ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (272ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (566ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (205ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (195ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (197ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (208ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (206ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (148ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (146ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (130ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (138ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (130ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (130ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (129ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (135ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (129ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (125ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (500ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (349ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (696ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (565ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (675ms)


  1) [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /60[- ]?sec/i
    Received string:      "Advertising you can audit.
    
    Digital advertising, out-of-home, revenue recovery, and creator-powered content — run to one standard: find what’s actually working, prove it with real numbers, then scale it.
    
    GET AN ASSESSMENT
    SEE WHAT WE DO
    DISCIPLINES
    4
    PLATFORMS WE PLAN ACROSS
    Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT
    STANDARD
    Audit first. Evidence. Then scale.
    
    WHAT WE DO
    
    One team. Four ways to be seen.
    Digital Advertising →
    Paid social, search, and platform campaigns that bring the traffic.
    Revenue Recovery →
    The audit that finds where that traffic leaks — and fixes it before you spend more.
    Out-of-Home →
    Billboards, transit, and physical placements. Presence you can’t scroll past.
    Z Best Clips ↗
    Creator-powered short-form distribution. One source, hundreds of clips, real reach.
    
    REVENUE RECOVERY
    
    Find out where your revenue is going.
    
    Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.
    
    01
    Missed and unreturned calls
    02
    Forms that break on mobile
    03
    Follow-up that dies after one touch
    04
    Pages that load too slowly to convert
    05
    Ad traffic landing on the wrong page
    06
    No retargeting on the people who almost bought
    GET YOUR FREE ASSESSMENT
    
    One prioritized leak, in about 60 seconds — and what fixing it looks like.
    
    Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent.
    
    HOW WE WORK
    
    Audit first. Evidence. Then scale.
    
    01
    
    Assess
    
    A free look at where you’re likely losing revenue.
    
    02
    
    Audit
    
    A paid, full diagnostic. Every finding comes with a priority and a confidence label.
    
    03
    
    Fix
    
    Conversion repaired before a dollar more goes into spend.
    
    04
    
    Scale
    
    Once it’s proven, we run the media: digital, out-of-home, clips.
    
    Tell us what’s actually going on.
    GET AN ASSESSMENT
    TALK TO US"

      125 |         expect(text, "decision-10 wording").toMatch(/one prioritized leak/i);
      126 |       }
    > 127 |       expect(text).not.toMatch(/60[- ]?sec/i);
          |                        ^
      128 |       expect(text).not.toMatch(/one quantified leak/i);
      129 |
      130 |       // No horizontal scroll at this viewport.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:127:24

    Error Context: test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('#revenue-recovery')
    Expected substring: "One prioritized leak — the one we’d fix first — and what fixing it looks like."
    Received string:    "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentOne prioritized leak, in about 60 seconds — and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('#revenue-recovery') with timeout 5000ms
      - waiting for locator('#revenue-recovery')
        14 × locator resolved to <section id="revenue-recovery" class="scroll-mt-24 mt-section bg-panel py-section lg:mt-section-lg lg:py-section-lg">…</section>
           - unexpected value "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentOne prioritized leak, in about 60 seconds — and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."


      263 |     const cta = section.getByRole("link", { name: "Get your free assessment" });
      264 |     await expect(cta).toHaveAttribute("href", "/revenue-recovery#assessment");
    > 265 |     await expect(section).toContainText("One prioritized leak — the one we’d fix first — and what fixing it looks like.");
          |                           ^
      266 |     await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
      267 |   });
      268 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:265:27

    Error Context: test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /60[- ]?sec/i
    Received string:      "Advertising you can audit.
    
    Digital advertising, out-of-home, revenue recovery, and creator-powered content — run to one standard: find what’s actually working, prove it with real numbers, then scale it.
    
    GET AN ASSESSMENT
    SEE WHAT WE DO
    DISCIPLINES
    4
    PLATFORMS WE PLAN ACROSS
    Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT
    STANDARD
    Audit first. Evidence. Then scale.
    
    WHAT WE DO
    
    One team. Four ways to be seen.
    Digital Advertising →
    Paid social, search, and platform campaigns that bring the traffic.
    Revenue Recovery →
    The audit that finds where that traffic leaks — and fixes it before you spend more.
    Out-of-Home →
    Billboards, transit, and physical placements. Presence you can’t scroll past.
    Z Best Clips ↗
    Creator-powered short-form distribution. One source, hundreds of clips, real reach.
    
    REVENUE RECOVERY
    
    Find out where your revenue is going.
    
    Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.
    
    01
    Missed and unreturned calls
    02
    Forms that break on mobile
    03
    Follow-up that dies after one touch
    04
    Pages that load too slowly to convert
    05
    Ad traffic landing on the wrong page
    06
    No retargeting on the people who almost bought
    GET YOUR FREE ASSESSMENT
    
    One prioritized leak, in about 60 seconds — and what fixing it looks like.
    
    Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent.
    
    HOW WE WORK
    
    Audit first. Evidence. Then scale.
    
    01
    
    Assess
    
    A free look at where you’re likely losing revenue.
    
    02
    
    Audit
    
    A paid, full diagnostic. Every finding comes with a priority and a confidence label.
    
    03
    
    Fix
    
    Conversion repaired before a dollar more goes into spend.
    
    04
    
    Scale
    
    Once it’s proven, we run the media: digital, out-of-home, clips.
    
    Tell us what’s actually going on.
    GET AN ASSESSMENT
    TALK TO US"

      125 |         expect(text, "decision-10 wording").toMatch(/one prioritized leak/i);
      126 |       }
    > 127 |       expect(text).not.toMatch(/60[- ]?sec/i);
          |                        ^
      128 |       expect(text).not.toMatch(/one quantified leak/i);
      129 |
      130 |       // No horizontal scroll at this viewport.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:127:24

    Error Context: test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('#revenue-recovery')
    Expected substring: "One prioritized leak — the one we’d fix first — and what fixing it looks like."
    Received string:    "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentOne prioritized leak, in about 60 seconds — and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('#revenue-recovery') with timeout 5000ms
      - waiting for locator('#revenue-recovery')
        14 × locator resolved to <section id="revenue-recovery" class="scroll-mt-24 mt-section bg-panel py-section lg:mt-section-lg lg:py-section-lg">…</section>
           - unexpected value "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentOne prioritized leak, in about 60 seconds — and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."


      263 |     const cta = section.getByRole("link", { name: "Get your free assessment" });
      264 |     await expect(cta).toHaveAttribute("href", "/revenue-recovery#assessment");
    > 265 |     await expect(section).toContainText("One prioritized leak — the one we’d fix first — and what fixing it looks like.");
          |                           ^
      266 |     await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
      267 |   });
      268 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:265:27

    Error Context: test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 
    [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 
  110 passed (45.6s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### M12
```
=== M12 diff ===
 apps/zbm/app/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match 3814c4a.


Running 114 tests using 1 worker

  ✘    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (242ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (401ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (186ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (193ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (265ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (147ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (120ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (136ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (108ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (101ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (101ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (106ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (116ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (104ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (139ms)
  ✘   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.2s)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (129ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (392ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (68ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (105ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (123ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (109ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (133ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (194ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (564ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (38ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (37ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (99ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (90ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (197ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (398ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (100ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (84ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (83ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (102ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (101ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (58ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (45ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (33ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (42ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (34ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (34ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (42ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (31ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (317ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (217ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (548ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (488ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✘   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (381ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (472ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (636ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (345ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (284ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (319ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (416ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (257ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (226ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (244ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (219ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (204ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (204ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (202ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (207ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (242ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (228ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (251ms)
  ✘   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (5.3s)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (322ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (653ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (185ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (218ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (236ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (266ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (253ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (280ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (692ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (134ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (126ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (130ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (129ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (210ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (195ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (268ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (567ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (207ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (198ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (219ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (210ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (148ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:137:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (151ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:148:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (127ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:161:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (141ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:171:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (134ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:182:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (133ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:190:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (128ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:200:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (141ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:219:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (128ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:228:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (128ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:234:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (506ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:255:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (346ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:269:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (678ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:296:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (575ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:308:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (673ms)


  1) [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: decision-10 wording

    expect(received).toMatch(expected)

    Expected pattern: /one prioritized leak/i
    Received string:  "Advertising you can audit.·
    Digital advertising, out-of-home, revenue recovery, and creator-powered content — run to one standard: find what’s actually working, prove it with real numbers, then scale it.·
    GET AN ASSESSMENT
    SEE WHAT WE DO
    DISCIPLINES
    4
    PLATFORMS WE PLAN ACROSS
    Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT
    STANDARD
    Audit first. Evidence. Then scale.·
    WHAT WE DO·
    One team. Four ways to be seen.
    Digital Advertising →
    Paid social, search, and platform campaigns that bring the traffic.
    Revenue Recovery →
    The audit that finds where that traffic leaks — and fixes it before you spend more.
    Out-of-Home →
    Billboards, transit, and physical placements. Presence you can’t scroll past.
    Z Best Clips ↗
    Creator-powered short-form distribution. One source, hundreds of clips, real reach.·
    REVENUE RECOVERY·
    Find out where your revenue is going.·
    Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.·
    01
    Missed and unreturned calls
    02
    Forms that break on mobile
    03
    Follow-up that dies after one touch
    04
    Pages that load too slowly to convert
    05
    Ad traffic landing on the wrong page
    06
    No retargeting on the people who almost bought
    GET YOUR FREE ASSESSMENT·
    The one leak we’d fix first, and what fixing it looks like.·
    Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent.·
    HOW WE WORK·
    Audit first. Evidence. Then scale.·
    01·
    Assess·
    A free look at where you’re likely losing revenue.·
    02·
    Audit·
    A paid, full diagnostic. Every finding comes with a priority and a confidence label.·
    03·
    Fix·
    Conversion repaired before a dollar more goes into spend.·
    04·
    Scale·
    Once it’s proven, we run the media: digital, out-of-home, clips.·
    Tell us what’s actually going on.
    GET AN ASSESSMENT
    TALK TO US"

      123 |       const text = await mainText(page);
      124 |       if (p.path === "/" || p.path === "/revenue-recovery") {
    > 125 |         expect(text, "decision-10 wording").toMatch(/one prioritized leak/i);
          |                                             ^
      126 |       }
      127 |       expect(text).not.toMatch(/60[- ]?sec/i);
      128 |       expect(text).not.toMatch(/one quantified leak/i);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:125:45

    Error Context: test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('#revenue-recovery')
    Expected substring: "One prioritized leak — the one we’d fix first — and what fixing it looks like."
    Received string:    "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentThe one leak we’d fix first, and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('#revenue-recovery') with timeout 5000ms
      - waiting for locator('#revenue-recovery')
        14 × locator resolved to <section id="revenue-recovery" class="scroll-mt-24 mt-section bg-panel py-section lg:mt-section-lg lg:py-section-lg">…</section>
           - unexpected value "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentThe one leak we’d fix first, and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."


      263 |     const cta = section.getByRole("link", { name: "Get your free assessment" });
      264 |     await expect(cta).toHaveAttribute("href", "/revenue-recovery#assessment");
    > 265 |     await expect(section).toContainText("One prioritized leak — the one we’d fix first — and what fixing it looks like.");
          |                           ^
      266 |     await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
      267 |   });
      268 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:265:27

    Error Context: test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 

    Error: decision-10 wording

    expect(received).toMatch(expected)

    Expected pattern: /one prioritized leak/i
    Received string:  "Advertising you can audit.·
    Digital advertising, out-of-home, revenue recovery, and creator-powered content — run to one standard: find what’s actually working, prove it with real numbers, then scale it.·
    GET AN ASSESSMENT
    SEE WHAT WE DO
    DISCIPLINES
    4
    PLATFORMS WE PLAN ACROSS
    Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT
    STANDARD
    Audit first. Evidence. Then scale.·
    WHAT WE DO·
    One team. Four ways to be seen.
    Digital Advertising →
    Paid social, search, and platform campaigns that bring the traffic.
    Revenue Recovery →
    The audit that finds where that traffic leaks — and fixes it before you spend more.
    Out-of-Home →
    Billboards, transit, and physical placements. Presence you can’t scroll past.
    Z Best Clips ↗
    Creator-powered short-form distribution. One source, hundreds of clips, real reach.·
    REVENUE RECOVERY·
    Find out where your revenue is going.·
    Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.·
    01
    Missed and unreturned calls
    02
    Forms that break on mobile
    03
    Follow-up that dies after one touch
    04
    Pages that load too slowly to convert
    05
    Ad traffic landing on the wrong page
    06
    No retargeting on the people who almost bought
    GET YOUR FREE ASSESSMENT·
    The one leak we’d fix first, and what fixing it looks like.·
    Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent.·
    HOW WE WORK·
    Audit first. Evidence. Then scale.·
    01·
    Assess·
    A free look at where you’re likely losing revenue.·
    02·
    Audit·
    A paid, full diagnostic. Every finding comes with a priority and a confidence label.·
    03·
    Fix·
    Conversion repaired before a dollar more goes into spend.·
    04·
    Scale·
    Once it’s proven, we run the media: digital, out-of-home, clips.·
    Tell us what’s actually going on.
    GET AN ASSESSMENT
    TALK TO US"

      123 |       const text = await mainText(page);
      124 |       if (p.path === "/" || p.path === "/revenue-recovery") {
    > 125 |         expect(text, "decision-10 wording").toMatch(/one prioritized leak/i);
          |                                             ^
      126 |       }
      127 |       expect(text).not.toMatch(/60[- ]?sec/i);
      128 |       expect(text).not.toMatch(/one quantified leak/i);
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:125:45

    Error Context: test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm--renders-carri-23999--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 

    Error: expect(locator).toContainText(expected) failed

    Locator: locator('#revenue-recovery')
    Expected substring: "One prioritized leak — the one we’d fix first — and what fixing it looks like."
    Received string:    "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentThe one leak we’d fix first, and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."
    Timeout: 5000ms

    Call log:
      - Expect "toContainText" locator('#revenue-recovery') with timeout 5000ms
      - waiting for locator('#revenue-recovery')
        14 × locator resolved to <section id="revenue-recovery" class="scroll-mt-24 mt-section bg-panel py-section lg:mt-section-lg lg:py-section-lg">…</section>
           - unexpected value "Revenue RecoveryFind out where your revenue is going.Most businesses aren’t short on traffic. They’re losing the traffic they already paid for — at the phone, the form, the follow-up. We audit first, show you the leak with real numbers, fix it, then scale what’s proven.01Missed and unreturned calls02Forms that break on mobile03Follow-up that dies after one touch04Pages that load too slowly to convert05Ad traffic landing on the wrong page06No retargeting on the people who almost boughtGet your free assessmentThe one leak we’d fix first, and what fixing it looks like.Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent."


      263 |     const cta = section.getByRole("link", { name: "Get your free assessment" });
      264 |     await expect(cta).toHaveAttribute("href", "/revenue-recovery#assessment");
    > 265 |     await expect(section).toContainText("One prioritized leak — the one we’d fix first — and what fixing it looks like.");
          |                           ^
      266 |     await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
      267 |   });
      268 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbm.spec.ts:265:27

    Error Context: test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbm-Home-§A4-featu-2fbeb-d-CTA-and-its-fixture-label-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 
    [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label 
  110 passed (45.8s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### `p5-mutate.py`, verbatim

```python
"""One Phase 5 mutation per invocation, applied to the committed tree of 3814c4a."""
import sys, pathlib
R = pathlib.Path("/Users/andrelove/WebstormProjects/zbest-sites")
def sub(rel, old, new):
    p = R / rel; s = p.read_text()
    n = s.count(old); assert n == 1, f"{rel}: expected 1, got {n}: {old[:90]}"
    p.write_text(s.replace(old, new))

RULES, SCORE, CONTRACT, ROUTE = ("apps/zbm/lib/assessment/rules.ts", "apps/zbm/lib/assessment/score.ts",
                                 "apps/zbm/lib/assessment/contract.ts", "apps/zbm/app/api/lead/route.ts")
FORM, HOME = "apps/zbm/components/assessment-form.tsx", "apps/zbm/app/page.tsx"

def M1():  # C2: a remediation authored into the rule set instead of derived
    sub(RULES, "copy[key] = { name: leak.title, rationale: leak.body, remediation: fix };",
               'copy[key] = { name: leak.title, rationale: leak.body, remediation: key === "offer" ? "Clarify the offer." : fix };')
def M2():  # the approved priority order changed (conversion <-> offer)
    sub(RULES, '''export const PRIORITY_ORDER = [
  "follow_up",
  "conversion",
  "offer",''', '''export const PRIORITY_ORDER = [
  "follow_up",
  "offer",
  "conversion",''')
def M3():  # all zeros returns a category instead of insufficient_signal
    sub(SCORE, "if (top === 0) {", "if (top < 0) {")
def M4():  # priority consulted before score: first non-zero wins, not the highest
    sub(SCORE, "const leaders = scored.filter((s) => s.score === top);",
               "const leaders = scored.filter((s) => s.score > 0);")
def M5():  # client stops validating: an invalid request reaches the stub
    sub(CONTRACT, '''  const local = ASSESSMENT_REQUEST.safeParse(request);
  if (!local.success) return { status: "invalid", fields: fieldErrors(local.error.issues) };
''', '''  const local = { data: request };
''')
def M6():  # the shared schema stops requiring every question
    sub(CONTRACT, '''      if (!seen.has(id)) ctx.addIssue({ code: "custom", path: [id], message: "Choose an answer." });''',
                  '''      void id;''')
def M7():  # a superseded rule-set version is scored instead of refused
    sub(ROUTE, "  if (rule_set_version !== ACTIVE_RULE_SET.version) {", "  if (rule_set_version === \"never\") {")
def M8():  # a dollar estimate appears on the free result
    sub(ROUTE, "    tier: \"free\" as const,", "    tier: \"free\" as const,\n    estimated_monthly_loss: \"$1,200\",")
def M9():  # insufficient_signal stops routing to the Audit and Talk to Us
    # Conditional, not deleted: deleting <NextSteps /> leaves the function unused
    # and fails the BUILD, which is a compile error, not a caught mutant.
    sub(FORM, "      <NextSteps />\n    </div>",
              '      {result.status === "leak_identified" ? <NextSteps /> : null}\n    </div>')
def M10(): # the because template shows the raw score instead of the label
    sub(FORM, "Because you said this is {result.because.value_label.toLowerCase()} for you:",
              "Because you said this is {result.because.value} for you:")
def M11(): # the retired wording returns on Home
    sub(HOME, "One prioritized leak — the one we’d fix first — and what fixing it looks like.",
              "One prioritized leak, in about 60 seconds — and what fixing it looks like.")
def M12(): # the decision-10 wording leaves Home
    sub(HOME, "One prioritized leak — the one we’d fix first — and what fixing it looks like.",
              "The one leak we’d fix first, and what fixing it looks like.")

globals()[sys.argv[1]](); print(f"{sys.argv[1]} applied")
```

## Appended — disclosures

Everything above this heading is unedited capture. The items below are appended.

### 1. Gate run 1 failed on a Phase 2 race, which is also a latent §9 defect. Not fixed here.

`phase-2.spec.ts:220`, the ZBC design-system counter under reduced motion, on mobile-390:
expected `1,240,000`, received `0`. The same test passed in the gate at `3814c4a` and in every
gate before it. Phase 5 changed no file under `apps/zbc` or `packages/ui` (see Captures above).

Root cause, from the code: `packages/ui/src/components/counter.tsx` initialises its display
to `format(0)`, and under reduced motion a `useEffect` sets the final value after hydration.
The test reads `textContent()` once, straight after `domcontentloaded`, with no wait for
hydration. On a slow hydration, as on the emulated phone late in a long run, it reads the
pre-hydration `0`.

This is more than a flaky test. The server always renders `0`. A reduced-motion visitor on
slow JavaScript sees `0` until hydration finishes; a visitor with JavaScript off sees `0` for
good. Brief §9 requires content to stay fully readable with motion off. There is no visitor
impact today, because the counter appears only on the unlinked `/dev/system` galleries and the
ZBM hero counter is deliberately unwired (§6.3). The defect is in a shared component certified
in Phase 2.

Proposed, not applied, because it changes certified Phase 2 work: render the final value on
the server and animate from zero on the client only when motion is allowed and the counter is
in view. Then assert the final value in the SERVER HTML (`response.text()`) rather than the
hydrated DOM. That is strictly stronger than the current check, and it removes the race
without an auto-wait. An auto-wait would weaken the test, because a counter that ticked would
eventually reach the final value and pass as well.

The gate was re-run as it was, not until it happened to pass: run 2 is the first rerun, and
both runs are above.

### 2. A layout defect found by viewing a capture, not by any test

In the first capture, the assessment form's Name, Business and Website inputs sat beside their
labels, at different widths. Cause: the inputs carry `.type-body` for its font, and
`.type-body` sets `max-width: 68ch`, a paragraph measure, which caps inputs at about 653px. With
the label inline, a 768px column fits both on one line. Fixed in the assessment form with
`max-w-none` and a block label, and confirmed in the re-captured PNGs.

**The shared contact form has the same cap and was not changed.** It renders correctly only
because its column is 672px, narrower than label plus capped input. Widening that column
would expose the bug. Changing the shared form moves certified ZBM and ZBC captures, so it is
flagged, not touched. There is also a gate gap: no test asserts form layout, so this defect
would have passed the gate.

### 3. The Phase 4 holds were replaced, and the retirement was kept

The instruction was to replace the holds at `phase-4-zbm.spec.ts:116-120` with positive
assertions. The positive assertion is added ("one prioritized leak" on Home and Revenue
Recovery). The two negative checks were also kept, reframed from "held pending the decision"
to "retired permanently", because decision 10 retires that wording permanently and only a
standing check enforces that. M11 and M12 show that both checks fire. Removing the negatives is
two lines if the founder or auditor prefers.

### 4. Copy changed beyond the RR FAQ and Home CTA, because it became false

The Revenue Recovery section title changed from "Request your free assessment." to "Get your
free assessment.", and both fixture notes (RR and Home) that said "the automated assessment is
not live yet" were rewritten. Once the assessment runs on the page, each of them stated
something untrue.

### 5. Every new customer-facing string, checked against source

For the copy gate. Each line is checked against the source file, and FOUND or MISSING is
printed by the check, not written by hand. The eight questions and the scale labels are not
listed because they are founder-approved in v0.3.

```
FOUND   [form  ] Stub — this form scores your answers on fixture rules but is not connected yet. Nothing is stored or sent.
FOUND   [form  ] How true is each of these for your business?
FOUND   [form  ] Some answers need attention.
FOUND   [form  ] These questions changed while you were answering. Reload the page to see the current ones — nothing was saved.
FOUND   [form  ] Scoring…
FOUND   [form  ] Stub — not delivered
FOUND   [form  ] Scored on fixture rules. This form is not connected yet, so nothing was stored or sent and no one will contact you from it.
FOUND   [form  ] Your prioritized leak
FOUND   [form  ] Why this one
FOUND   [form  ] Because you said this is {result.because.value_label.toLowerCase()} for you:
FOUND   [form  ] Several leaks scored the same for you. This is the one we’d fix first.
FOUND   [form  ] What fixing it looks like
FOUND   [form  ] No prioritized leak from these answers.
FOUND   [form  ] None of these came up as true for your business, so there’s no leak to point to — and we won’t invent one.
FOUND   [form  ] If something still isn’t working, the Audit is the full diagnostic. Or just talk to us.
FOUND   [form  ] See what the Audit covers
FOUND   [schema] Choose an answer.
FOUND   [schema] Unknown question.
FOUND   [schema] Answer each question once.
FOUND   [rr    ] title="Get your free assessment."
FOUND   [rr    ] Fixture — eight questions return one prioritized leak, scored on fixture rules. Nothing you enter is stored or sent.
FOUND   [home  ] Get your free assessment
FOUND   [home  ] One prioritized leak — the one we’d fix first — and what fixing it looks like.
FOUND   [home  ] Fixture — the assessment is scored on fixture rules. Nothing you enter is stored or sent.
FOUND   [faq   ] How does the process start?
FOUND   [faq   ] With the free assessment. Eight questions about your business return one prioritized leak — the one we’d fix first — and what fixing it looks like. It doesn’t put a dollar figure on it, because from eight answers that would be a guess.

26 of 26 found in source
```

### 6. Straight apostrophes in the approved questions; curly everywhere else on the site

v0.3 §11.3 writes the eight questions with straight apostrophes (U+0027), and the rule set
reproduces them verbatim. Site copy uses curly apostrophes (U+2019), for example "What’s the
commitment length?", and so does the result view this chunk added. Converting the questions
on render would put text on screen that differs from the rule set, and the "because" quote must
match the rule set exactly. Keeping them consistent means changing the approved text in v0.3.
That is the founder's call.

### 7. The RR Phase 1 engagement card still says only "Free. No payment, no obligation."

That is the founder's exact wording from the audit F8 fix, written while what the assessment
returns was undecided. It is still true, so it is left as written. Its code comment, which
called the question undecided, was corrected in `51328e9`. Whether the card should now name the
result ("one prioritized leak") is the founder's call.

### 8. The honeypot on the assessment path

A filled `company_url` is scored like any other request and returns the same success shape.
Because the stub stores and sends nothing either way, a bot learns nothing and nothing happens.
The contact path keeps its Phase 4 short-circuit.

### 9. Not in this chunk

Brief §6.3 lists these under Phase 5. They are not built here and are not claimed:
- the Search Intelligence free AI Visibility Check (UI on fixtures, behind the unlinked page)
- ZBC "Browse Active Campaigns" pointing to the clipper waitlist

## Appended after certification at `87c9ee9` — the curly amendment, and a correction

The auditor certified this chunk at `87c9ee9`. Everything above this heading is that record and
is unchanged. What follows covers `fa34b40`.

### Correction: ZBC "Browse Active Campaigns" was never outstanding

This log (Scope, and disclosure 9), the MANIFEST at `87c9ee9`, and the header of
`phase-5.spec.ts` all said ZBC's "Browse Active Campaigns" CTA was a Phase 5 item not built in
this chunk. It was built and certified in Phase 4 ZBC. The claim was made without checking the
ZBC code, and the founder chose it as the next item on the strength of it. The evidence:

```
$ grep -n 'Browse Active Campaigns' apps/zbc/app/become-a-clipper/page.tsx
20: * "Browse Active Campaigns": until a real campaign exists it opens the clipper
33:            <ButtonLink href="#waitlist">Browse Active Campaigns</ButtonLink>
83:        label="Browse Active Campaigns"

$ grep -n 'Browse Active Campaigns opens the labeled waitlist form' e2e/tests/phase-4-zbc.spec.ts
307:  test("Browse Active Campaigns opens the labeled waitlist form, which posts to the stub", async ({ page }) => {

$ sed -n '632p' docs/ZBM-ZBC-Build-Brief-v2.md
**CTA:** Browse Active Campaigns → until a real campaign exists, this opens the clipper waitlist form (§6.1) with the label “Join the clipper list — we’ll notify you when the first campaigns open.”
```

So the only Phase 5 build item left is the Search Intelligence AI Visibility Check. No spec
defines its result shape, and CLAUDE.md forbids building against guessed DTOs. The spec header
is corrected in `fa34b40`.

### The amendment — founder ruling, 2026-09-18

Curly apostrophes in the six approved questions that contain one, across the spec, `rules.ts`
and `phase-5.spec.ts`. The wording is unchanged. Under v0.3 §11.2 a changed question is a new
rule-set version, so the fixture moves `.1` -> `.2` with a new hash.

```
$ git show --stat --format='%h %s' fa34b40
fa34b40 Curly apostrophes in the assessment questions; rule set to fixture-2026-09-18.2

 apps/zbm/lib/assessment/rules.ts                   |  17 +++++++-----
 docs/TOOLING.md                                    |  30 +++++++++++++++++++++
 docs/backend-interface-spec-v0.3.md                |  14 +++++-----
 .../zbm-revenue-recovery-desktop-1440.png          | Bin 1002940 -> 1003599 bytes
 .../zbm-revenue-recovery-mobile-390.png            | Bin 3451427 -> 3452488 bytes
 .../phase-5/zbm-assessment-form-desktop-1440.png   | Bin 132981 -> 133634 bytes
 .../phase-5/zbm-assessment-form-mobile-390.png     | Bin 668656 -> 669969 bytes
 e2e/tests/phase-5.spec.ts                          |  22 ++++++++-------
 8 files changed, 60 insertions(+), 23 deletions(-)

$ git diff fa34b40^ fa34b40 -- apps/zbm/lib/assessment/rules.ts | grep -E '^[-+][^-+]'
-  { id: "follow_up", category: "follow_up", statement: "When a lead comes in, we don't always respond fast or follow up consistently." },
+  { id: "follow_up", category: "follow_up", statement: "When a lead comes in, we don’t always respond fast or follow up consistently." },
-  { id: "offer", category: "offer", statement: "People aren't sure what they get from us, or why it's worth it." },
-  { id: "trust", category: "trust", statement: "We don't have enough reviews, proof, or credentials in front of visitors." },
-  { id: "tracking", category: "tracking", statement: "We can't tell which ads, pages, or channels actually bring in revenue." },
+  { id: "offer", category: "offer", statement: "People aren’t sure what they get from us, or why it’s worth it." },
+  { id: "trust", category: "trust", statement: "We don’t have enough reviews, proof, or credentials in front of visitors." },
+  { id: "tracking", category: "tracking", statement: "We can’t tell which ads, pages, or channels actually bring in revenue." },
-  { id: "visibility", category: "visibility", statement: "We're hard to find in search results, map listings, or AI search." },
-  { id: "traffic", category: "traffic", statement: "We don't get enough qualified visitors or inquiries in the first place." },
+  { id: "visibility", category: "visibility", statement: "We’re hard to find in search results, map listings, or AI search." },
+  { id: "traffic", category: "traffic", statement: "We don’t get enough qualified visitors or inquiries in the first place." },
-  version: "fixture-2026-09-18.1",
+  // .2: the six questions with apostrophes changed to curly (founder ruling,
+  // 2026-09-18). A question changed, so per §11.2 this is a new version with a
+  // new hash; .1 is not edited in place.
+  version: "fixture-2026-09-18.2",
```

### Gate at `fa34b40` — raw counts

Run against the working tree that became `fa34b40`, from a wiped state.

```
build=0
typecheck=0
e2e=0
lint=0
DONE
  1 skipped
  285 passed (1.4m)
$ grep -H '^ Tasks:' gate-01-build.txt gate-02-typecheck.txt gate-04-lint.txt
gate-01-build.txt: Tasks:    2 successful, 2 total
gate-02-typecheck.txt: Tasks:    4 successful, 4 total
gate-04-lint.txt: Tasks:    5 successful, 5 total
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbm/components apps/zbc/app
[]

$ git diff --name-status fa34b40^ fa34b40 -- e2e/snapshots/
M	e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-desktop-1440.png
M	e2e/snapshots/phase-4-zbm/zbm-revenue-recovery-mobile-390.png
M	e2e/snapshots/phase-5/zbm-assessment-form-desktop-1440.png
M	e2e/snapshots/phase-5/zbm-assessment-form-mobile-390.png
```

Four captures moved: the Phase 5 form at both viewports, and the Revenue Recovery full page in
the Phase 4 suite at both. The auditor's line said to re-run the Phase 5 spec only. That would
have left the two Phase 4 captures stale.

### Mutations for the amendment — each alone, against `fa34b40`

| # | Mutation | Result |
|---|---|---|
| MC1 | one question reverted to a straight apostrophe | 2 failed, 0 build failures — `Error: follow_up` |
| MC2 | the curly change made in place, without the §11.2 version bump | 14 failed, 0 build failures — `Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}` |

**Gap, not closed here:** MC2 catches the version and the test disagreeing, not a version that
was never bumped. If a question changed and the test's transcribed copy was updated too, both
still on `.2`, the gate would pass. Pinning the expected `rules_hash` for each version in the
spec would enforce §11.2 mechanically. Not added unasked.

#### MC1
```
=== MC1 diff ===
 apps/zbm/lib/assessment/rules.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match fa34b40.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (393ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (240ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (418ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (218ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (192ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (244ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (144ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (127ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (135ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (104ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (103ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (105ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (105ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (100ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (122ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (116ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (141ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (141ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (120ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (401ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (67ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (109ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (121ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (114ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (130ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (197ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (581ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (36ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (34ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (33ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (104ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (82ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (194ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (432ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (103ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (88ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (85ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (121ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (98ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (53ms)
  ✓   44 [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (51ms)
  ✓   45 [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (34ms)
  ✓   46 [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (47ms)
  ✓   47 [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (34ms)
  ✓   48 [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (36ms)
  ✓   49 [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (42ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (40ms)
  ✓   51 [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (32ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✘   53 [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (5.2s)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (261ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (553ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (486ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (549ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (518ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (369ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (639ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (343ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (287ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (287ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (315ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (409ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (260ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (228ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (257ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (215ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (209ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (203ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (215ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (220ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (239ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (226ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (257ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (275ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (239ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (632ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (195ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (223ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (233ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (225ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (251ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (286ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (704ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (130ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (127ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (129ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (133ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (210ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (199ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (279ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (605ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (213ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (195ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (210ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (208ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (147ms)
  ✓  101 [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (143ms)
  ✓  102 [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (132ms)
  ✓  103 [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (144ms)
  ✓  104 [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (126ms)
  ✓  105 [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (139ms)
  ✓  106 [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (134ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (137ms)
  ✓  108 [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (128ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✘  110 [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (5.3s)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (478ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (717ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (588ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (697ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale 

    Error: follow_up

    expect(locator).toHaveAttribute(expected) failed

    Locator: locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true })
    Expected: "follow_up"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - follow_up locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true }) with timeout 5000ms
      - waiting for locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true })


      246 |     for (const [id, statement] of QUESTIONS) {
      247 |       const group = section.getByRole("group", { name: statement, exact: true });
    > 248 |       await expect(group, id).toHaveAttribute("data-assessment-question", id);
          |                               ^
      249 |       for (const label of SCALE) {
      250 |         await expect(group.getByRole("radio", { name: label, exact: true }), `${id}: ${label}`).toBeVisible();
      251 |       }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:248:31

    Error Context: test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale 

    Error: follow_up

    expect(locator).toHaveAttribute(expected) failed

    Locator: locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true })
    Expected: "follow_up"
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - follow_up locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true }) with timeout 5000ms
      - waiting for locator('#assessment').getByRole('group', { name: 'When a lead comes in, we don’t always respond fast or follow up consistently.', exact: true })


      246 |     for (const [id, statement] of QUESTIONS) {
      247 |       const group = section.getByRole("group", { name: statement, exact: true });
    > 248 |       await expect(group, id).toHaveAttribute("data-assessment-question", id);
          |                               ^
      249 |       for (const label of SCALE) {
      250 |         await expect(group.getByRole("radio", { name: label, exact: true }), `${id}: ${label}`).toBeVisible();
      251 |       }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:248:31

    Error Context: test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--1c032--each-on-the-approved-scale-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale 
    [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale 
  112 passed (46.2s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### MC2
```
=== MC2 diff ===
 apps/zbm/lib/assessment/rules.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match fa34b40.


Running 114 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓    2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓    3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (411ms)
  ✓    4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (222ms)
  ✓    5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✓    6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓    7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (224ms)
  ✓    8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (252ms)
  ✓    9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (155ms)
  ✓   10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (127ms)
  ✓   11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (137ms)
  ✓   12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (119ms)
  ✓   13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (109ms)
  ✓   14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (112ms)
  ✓   15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (109ms)
  ✓   16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (111ms)
  ✓   17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (145ms)
  ✓   18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (120ms)
  ✓   19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (145ms)
  ✓   20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (148ms)
  ✓   21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (136ms)
  ✓   22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (402ms)
  ✓   23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (66ms)
  ✓   24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (106ms)
  ✓   25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (122ms)
  ✓   26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (125ms)
  ✓   27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (133ms)
  ✓   28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (201ms)
  ✓   29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (589ms)
  ✓   30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (45ms)
  ✓   31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (42ms)
  ✓   32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (44ms)
  ✓   33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (34ms)
  ✓   34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (105ms)
  ✓   35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (94ms)
  ✓   36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (203ms)
  ✓   37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (451ms)
  ✓   38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (109ms)
  ✓   39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (94ms)
  ✓   40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (90ms)
  ✓   41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (135ms)
  ✓   42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (105ms)
  ✓   43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (60ms)
  ✘   44 [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (51ms)
  ✘   45 [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (75ms)
  ✘   46 [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (75ms)
  ✘   47 [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (71ms)
  ✘   48 [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (73ms)
  ✘   49 [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (76ms)
  ✓   50 [desktop-1440] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (64ms)
  ✘   51 [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (62ms)
  ✓   52 [desktop-1440] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (50ms)
  ✓   53 [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (386ms)
  ✓   54 [desktop-1440] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (244ms)
  ✓   55 [desktop-1440] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (558ms)
  ✓   56 [desktop-1440] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (496ms)
  ✓   57 [desktop-1440] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✓   58 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (532ms)
  ✓   59 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (375ms)
  ✓   60 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (647ms)
  ✓   61 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (361ms)
  ✓   62 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓   63 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (341ms)
  ✓   64 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (330ms)
  ✓   65 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (417ms)
  ✓   66 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (259ms)
  ✓   67 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (237ms)
  ✓   68 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (238ms)
  ✓   69 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (232ms)
  ✓   70 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (211ms)
  ✓   71 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (206ms)
  ✓   72 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (205ms)
  ✓   73 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (208ms)
  ✓   74 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (239ms)
  ✓   75 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (233ms)
  ✓   76 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (254ms)
  ✓   77 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (276ms)
  ✓   78 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (231ms)
  ✓   79 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (552ms)
  ✓   80 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (176ms)
  ✓   81 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (242ms)
  ✓   82 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (245ms)
  ✓   83 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (240ms)
  ✓   84 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (271ms)
  ✓   85 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (296ms)
  ✓   86 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (838ms)
  ✓   87 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (138ms)
  ✓   88 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (138ms)
  ✓   89 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (139ms)
  ✓   90 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (128ms)
  ✓   91 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (232ms)
  ✓   92 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (199ms)
  ✓   93 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (298ms)
  ✓   94 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (595ms)
  ✓   95 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (228ms)
  ✓   96 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (204ms)
  ✓   97 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (199ms)
  ✓   98 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (213ms)
  ✓   99 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (221ms)
  ✓  100 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (178ms)
  ✘  101 [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (159ms)
  ✘  102 [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (227ms)
  ✘  103 [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (234ms)
  ✘  104 [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (229ms)
  ✘  105 [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (238ms)
  ✘  106 [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (237ms)
  ✓  107 [mobile-390] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (223ms)
  ✘  108 [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (168ms)
  ✓  109 [mobile-390] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (207ms)
  ✓  110 [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (609ms)
  ✓  111 [mobile-390] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (389ms)
  ✓  112 [mobile-390] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (732ms)
  ✓  113 [mobile-390] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (599ms)
  ✓  114 [mobile-390] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (785ms)


  1) [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:143:22

    Error Context: test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:151:20

    Error Context: test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:166:22

    Error Context: test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:175:18

    Error Context: test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  5) [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:186:21

    Error Context: test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  6) [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:194:22

    Error Context: test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  7) [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "error": Object {
    -     "active_version": "fixture-2026-09-18.2",
    +     "active_version": "fixture-2026-09-18.1",
          "code": "rule_set_superseded",
        },
        "ok": false,
      }

      222 |     const res = await post(page, request(all(2), { rule_set_version: "fixture-2026-01-01.0" }));
      223 |     expect(res.status()).toBe(409);
    > 224 |     expect(await res.json()).toEqual({
          |                              ^
      225 |       ok: false,
      226 |       error: { code: "rule_set_superseded", active_version: RULE_SET_VERSION },
      227 |     });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:224:30

    Error Context: test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  8) [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:143:22

    Error Context: test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--43e17-ary-character-for-character-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  9) [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:151:20

    Error Context: test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--45c14-l-—-no-category-is-invented-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  10) [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:166:22

    Error Context: test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--f6eda--every-tie-all-the-way-down-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  11) [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:175:18

    Error Context: test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--ff723-efore-priority-is-consulted-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  12) [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:186:21

    Error Context: test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--83d69--and-the-same-rule-set-hash-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  13) [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 

    Error: {"ok":false,"error":{"code":"rule_set_superseded","active_version":"fixture-2026-09-18.1"}}

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 409

      92 | async function score(page: Page, answers: Answers) {
      93 |   const res = await post(page, request(answers));
    > 94 |   expect(res.status(), await res.text()).toBe(200);
         |                                          ^
      95 |   return (await res.json()).result;
      96 | }
      97 |
        at score (/Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:94:42)
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:194:22

    Error Context: test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--06080-e-a-currency-or-an-estimate-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  14) [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "error": Object {
    -     "active_version": "fixture-2026-09-18.2",
    +     "active_version": "fixture-2026-09-18.1",
          "code": "rule_set_superseded",
        },
        "ok": false,
      }

      222 |     const res = await post(page, request(all(2), { rule_set_version: "fixture-2026-01-01.0" }));
      223 |     expect(res.status()).toBe(409);
    > 224 |     expect(await res.json()).toEqual({
          |                              ^
      225 |       ok: false,
      226 |       error: { code: "rule_set_superseded", active_version: RULE_SET_VERSION },
      227 |     });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5.spec.ts:224:30

    Error Context: test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-Free-assessment-—--33012--a-typed-error-never-scored-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  14 failed
    [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 
    [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 
    [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 
    [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 
    [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash 
    [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 
    [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 
    [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character 
    [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented 
    [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down 
    [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted 
    [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash 
    [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate 
    [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored 
  100 passed (43.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5.spec.ts tests/phase-4-zbm.spec.ts
```

#### `curly-mutate.py`, verbatim
```python
"""Mutations for fa34b40, one per invocation."""
import sys, pathlib
R = pathlib.Path("/Users/andrelove/WebstormProjects/zbest-sites"); RULES = R / "apps/zbm/lib/assessment/rules.ts"
def sub(old, new):
    s = RULES.read_text(); assert s.count(old) == 1, old[:60]; RULES.write_text(s.replace(old, new))
def MC1():  # one question reverted to a straight apostrophe
    sub("When a lead comes in, we don’t always respond fast", "When a lead comes in, we don't always respond fast")
def MC2():  # the curly change made in place, without the §11.2 version bump
    sub('version: "fixture-2026-09-18.2",', 'version: "fixture-2026-09-18.1",')
globals()[sys.argv[1]](); print(sys.argv[1], "applied")
```

### Capture zip regenerated

```
superseded (c884b4e, 87c9ee9 bundle): a0cff020423e9eb99e39af3f523aab1834e062edf4da52b8cfb5aa50b09b2b91
current    (fa34b40)                 : 5c6b416fe547e6e2121f6aaeba63aa374bc174c50258db5025eef6f2416b412c
$ shasum -a 256 e2e/snapshots/phase-5/*.png
92375d4d6d6976016bbae171bd5d2f7a62e32953999a3e27dbc79aac3dc0ec54  e2e/snapshots/phase-5/zbm-assessment-form-desktop-1440.png
146a50d592a4fb1ec95b9c23abaedab720083c68d199b4ba7dcb3321cb20bb32  e2e/snapshots/phase-5/zbm-assessment-form-mobile-390.png
d742aa2de0e0a756a5bc7d22ff7db23f73673c1d3c442c82fc87cc82c9d5b2d9  e2e/snapshots/phase-5/zbm-assessment-insufficient-desktop-1440.png
d790cfd5a00fc6a11895ac2837855753986f86149f51dd17bba147e93138c808  e2e/snapshots/phase-5/zbm-assessment-insufficient-mobile-390.png
f76e78b891f6e8d046b5d1612b3454c2ac0523d9af35af00f2d09bb74c17b1fe  e2e/snapshots/phase-5/zbm-assessment-result-desktop-1440.png
42aaf49378b67722e65159e6cd34da153076257703c1ad4bd8cfd5a89fb3cbbb  e2e/snapshots/phase-5/zbm-assessment-result-mobile-390.png
```
