# Phase 4, Z Best Clips chunk (with audit F8 fix) — raw verification output

Unedited stdout/stderr, captured 2026-09-17T04:05:39Z on Darwin 25.6.0, Node v24.9.0, pnpm 9.15.0.
Regenerate with the commands shown; nothing here is summarized.

## Repository state

### `git status`
```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	docs/phase-4-zbc-verification-log.md

nothing added to commit but untracked files present (use "git add" to track)
```

### `git rev-parse HEAD`
```
c35ee1d82f2882e2669a1fe6ea4e0c3d0fa1d417
```

### `git ls-remote origin main`
```
c35ee1d82f2882e2669a1fe6ea4e0c3d0fa1d417	refs/heads/main
```

## Build, typecheck, gate, lint

Run from a wiped state (`.next`, `.turbo`, `playwright-report`, `test-results` removed) so no
result is a cache replay. Turbo prints `cache miss, executing` for every task below.

### `pnpm build`
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbc:build: cache miss, executing e7c35cf38dec3e4c
@zbest/zbm:build: cache miss, executing 2a33e5e09513ef11
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
@zbest/zbm:build: ✓ Running next.config.ts took 12ms
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbm:build: ✓ Compiled successfully in 7.1s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build: ✓ Compiled successfully in 7.2s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbc:build:   Finished TypeScript in 2.2s ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Finished TypeScript in 2.3s ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 333ms
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
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
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 434ms
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
  Time:    12.958s 

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
@zbest/zbc:typecheck: cache miss, executing 10e28ff59547942a
e2e:typecheck: cache miss, executing 97698606b7b4c7c5
@zbest/zbm:typecheck: cache miss, executing 270a0377cdbbb5f4
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
  Time:    1.038s 

```

### `pnpm --filter e2e exec playwright test`

All five suites: Phase 1 (4), Phase 2 (16), Phase 3 (74, one skips on mobile by design), Phase 4 ZBM (76), Phase 4 ZBC (70).

```
  ⚠  Gate running against a DIRTY tree — screenshots will not match c35ee1d.
Running 240 tests using 1 worker
  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (1.4s)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (301ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (302ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (219ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (284ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.6s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (323ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (166ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (252ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.6s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (274ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (190ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (165ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (172ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (181ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (157ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (108ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (132ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (141ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (140ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (207ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (338ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (41ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (304ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (68ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (301ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (251ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (180ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (215ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (189ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (185ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (147ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (370ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (126ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (130ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (129ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (208ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (377ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (44ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (419ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (57ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (300ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (265ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (268ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (157ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (132ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (250ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (214ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (221ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (251ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (221ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (220ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (182ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (157ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (189ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (181ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (220ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (221ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (165ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (165ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (245ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (45ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (187ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (141ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (180ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (124ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (132ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (309ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (122ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (324ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (47ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (45ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (194ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (157ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (148ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (77ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (44ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (262ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (258ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (382ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (222ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (214ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (267ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (181ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (159ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (144ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (141ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (140ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (143ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (153ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (160ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (148ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:213:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (169ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:228:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (177ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:246:3 › Home (§A4) › How we work carries no case study cards (155ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:253:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (538ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:273:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (127ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:280:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (155ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:291:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the Method, leak library, patterns, deliverable, comparison and engagements (126ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:311:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (123ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:325:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (147ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:335:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and keeps the other seven (136ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:342:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (453ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:381:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (49ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:392:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (46ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:401:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (51ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:412:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (47ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:425:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (141ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:443:3 › About and Contact (§A4) › About carries the brief's standard and both CTAs (120ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:454:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (239ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:478:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (140ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:490:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (138ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:498:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (83ms)
  ✓  121 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (2.9s)
  ✓  122 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (801ms)
  ✓  123 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (670ms)
  ✓  124 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (353ms)
  ✓  125 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (401ms)
  ✓  126 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.8s)
  ✓  127 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (654ms)
  ✓  128 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (275ms)
  ✓  129 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (348ms)
  ✓  130 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  131 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (558ms)
  ✓  132 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (385ms)
  ✓  133 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (412ms)
  ✓  134 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (398ms)
  ✓  135 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (346ms)
  ✓  136 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (1.1s)
  ✓  137 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (423ms)
  ✓  138 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (241ms)
  ✓  139 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (244ms)
  ✓  140 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (219ms)
  ✓  141 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (288ms)
  ✓  142 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (571ms)
  ✓  143 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (137ms)
  ✓  144 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (471ms)
  ✓  145 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (408ms)
  ✓  146 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (433ms)
  ✓  147 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (692ms)
  ✓  148 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (396ms)
  ✓  149 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (396ms)
  ✓  150 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (578ms)
  ✓  151 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (380ms)
  ✓  152 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (298ms)
  ✓  153 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (474ms)
  ✓  154 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (319ms)
  ✓  155 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (312ms)
  ✓  156 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (303ms)
  ✓  157 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (321ms)
  ✓  158 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (673ms)
  ✓  159 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (166ms)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (489ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (148ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (452ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (396ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (421ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (300ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (228ms)
  -  167 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  168 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (602ms)
  ✓  169 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (310ms)
  ✓  170 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (298ms)
  ✓  171 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (312ms)
  ✓  172 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (408ms)
  ✓  173 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (421ms)
  ✓  174 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (359ms)
  ✓  175 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (395ms)
  ✓  176 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (353ms)
  ✓  177 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (265ms)
  ✓  178 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (252ms)
  ✓  179 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (246ms)
  ✓  180 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (247ms)
  ✓  181 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (253ms)
  ✓  182 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (254ms)
  ✓  183 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (260ms)
  ✓  184 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (259ms)
  ✓  185 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (470ms)
  ✓  186 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (138ms)
  ✓  187 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (256ms)
  ✓  188 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (260ms)
  ✓  189 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (333ms)
  ✓  190 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  191 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (310ms)
  ✓  192 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (341ms)
  ✓  193 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (495ms)
  ✓  194 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (273ms)
  ✓  195 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (475ms)
  ✓  196 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (165ms)
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (163ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (259ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (264ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (309ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (172ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (149ms)
  ✓  203 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › / › renders, carries its metadata, holds the site rules, and is captured (458ms)
  ✓  204 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (421ms)
  ✓  205 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (698ms)
  ✓  206 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (415ms)
  ✓  207 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /about › renders, carries its metadata, holds the site rules, and is captured (321ms)
  ✓  208 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (305ms)
  ✓  209 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (347ms)
  ✓  210 [mobile-390] › tests/phase-4-zbm.spec.ts:90:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (426ms)
  ✓  211 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › / — every same-site link resolves (341ms)
  ✓  212 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /digital-advertising — every same-site link resolves (301ms)
  ✓  213 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /revenue-recovery — every same-site link resolves (299ms)
  ✓  214 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /out-of-home — every same-site link resolves (236ms)
  ✓  215 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /about — every same-site link resolves (237ms)
  ✓  216 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /contact — every same-site link resolves (222ms)
  ✓  217 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /faq — every same-site link resolves (230ms)
  ✓  218 [mobile-390] › tests/phase-4-zbm.spec.ts:168:3 › /search-intelligence — every same-site link resolves (241ms)
  ✓  219 [mobile-390] › tests/phase-4-zbm.spec.ts:195:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (236ms)
  ✓  220 [mobile-390] › tests/phase-4-zbm.spec.ts:213:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (263ms)
  ✓  221 [mobile-390] › tests/phase-4-zbm.spec.ts:228:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, a held CTA and its fixture label (282ms)
  ✓  222 [mobile-390] › tests/phase-4-zbm.spec.ts:246:3 › Home (§A4) › How we work carries no case study cards (253ms)
  ✓  223 [mobile-390] › tests/phase-4-zbm.spec.ts:253:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (695ms)
  ✓  224 [mobile-390] › tests/phase-4-zbm.spec.ts:273:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (192ms)
  ✓  225 [mobile-390] › tests/phase-4-zbm.spec.ts:280:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (233ms)
  ✓  226 [mobile-390] › tests/phase-4-zbm.spec.ts:291:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the Method, leak library, patterns, deliverable, comparison and engagements (229ms)
  ✓  227 [mobile-390] › tests/phase-4-zbm.spec.ts:311:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (233ms)
  ✓  228 [mobile-390] › tests/phase-4-zbm.spec.ts:325:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (266ms)
  ✓  229 [mobile-390] › tests/phase-4-zbm.spec.ts:335:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ omits the held 60-second answer and keeps the other seven (306ms)
  ✓  230 [mobile-390] › tests/phase-4-zbm.spec.ts:342:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (653ms)
  ✓  231 [mobile-390] › tests/phase-4-zbm.spec.ts:381:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (132ms)
  ✓  232 [mobile-390] › tests/phase-4-zbm.spec.ts:392:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (129ms)
  ✓  233 [mobile-390] › tests/phase-4-zbm.spec.ts:401:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (178ms)
  ✓  234 [mobile-390] › tests/phase-4-zbm.spec.ts:412:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (131ms)
  ✓  235 [mobile-390] › tests/phase-4-zbm.spec.ts:425:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (229ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:443:3 › About and Contact (§A4) › About carries the brief's standard and both CTAs (204ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:454:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (306ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:478:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (228ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:490:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (221ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:498:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (172ms)
  1 skipped
  239 passed (1.5m)
```

### `pnpm lint` — run AFTER the gate, deliberately

Same order as the Phase 2 log: lint once failed after Playwright wrote its report assets.

```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
@zbest/ui:lint: cache miss, executing e52bd9d9dbf323a9
e2e:lint: cache miss, executing 586d3a24457dc4df
@zbest/zbc:lint: cache miss, executing f9ab4110a43d3c92
@zbest/zbm:lint: cache miss, executing 5494a5fc3e031670
@zbest/zbm:lint: 
@zbest/zbm:lint: > @zbest/zbm@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:lint: > eslint .
@zbest/zbm:lint: 
@zbest/zbc:lint: 
@zbest/zbc:lint: > @zbest/zbc@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:lint: > eslint .
@zbest/zbc:lint: 
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 
@zbest/ui:lint: 
@zbest/ui:lint: > @zbest/ui@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:lint: > eslint .
@zbest/ui:lint: 
@zbest/config:lint: 
@zbest/config:lint: > @zbest/config@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/config
@zbest/config:lint: > eslint .
@zbest/config:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    6.929s 

```

### `impeccable detect --json`

Impeccable's mechanical design detector (Brief §2). Empty array = no findings.

```
$ ~/.claude/skills/impeccable/scripts/impeccable detect --json packages/ui/src apps/zbm/app apps/zbc/app
[]
```

## Served Phase 4 artifacts

Fetched from `next start` on the build above (loopback ports 3100/3101, not the gate ports).

### Z Best Clips
```
$ curl -s http://127.0.0.1:3101/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://zbestclips.com</loc>
</url>
<url>
<loc>https://zbestclips.com/entertainment</loc>
</url>
<url>
<loc>https://zbestclips.com/brands</loc>
</url>
<url>
<loc>https://zbestclips.com/pricing</loc>
</url>
<url>
<loc>https://zbestclips.com/become-a-clipper</loc>
</url>
<url>
<loc>https://zbestclips.com/launch-a-campaign</loc>
</url>
<url>
<loc>https://zbestclips.com/about</loc>
</url>
<url>
<loc>https://zbestclips.com/media-kit</loc>
</url>
<url>
<loc>https://zbestclips.com/faq</loc>
</url>
</urlset>

$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://127.0.0.1:3101<path>
/                    200 
/how-it-works        308 http://127.0.0.1:3101/
/entertainment       200 
/brands              200 
/pricing             200 
/become-a-clipper    200 
/launch-a-campaign   200 
/about               200 
/media-kit           200 
/faq                 200 
$ for each page: curl -s <page> | grep -oE '(Netflix|Hulu|HBO|Disney|Warner|Paramount|Universal|Sony|Amazon|Apple|Spotify|Twitch|Whop|NFL|NBA|MLB|NHL|ESPN|Toyota|Honda|Ford|BMW|Mercedes|Tesla|Botox|Lamar|Clear Channel|OUTFRONT|Google|Meta|Facebook)' | sort | uniq -c   # real company names
(no output = none found)
$ for each page: curl -s <page> | grep -cE "\$50–100|\$3–5"   # clipper starting rates, count of matching lines
/                    0
/entertainment       0
/brands              0
/pricing             0
/become-a-clipper    1
/launch-a-campaign   0
/about               0
/media-kit           0
/faq                 0
$ for each page: curl -s <page> | grep -cE "\$[0-9]"   # any dollar figure, count of matching lines
/                    1
/entertainment       1
/brands              1
/pricing             1
/become-a-clipper    1
/launch-a-campaign   1
/about               1
/media-kit           1
/faq                 1
$ curl -s http://127.0.0.1:3101/ | grep -o "Illustrative example — not a client result" | wc -l   # HTML + RSC payload, 3 cards
       6
$ for u in /entertainment /brands; do curl -s $u | grep -oE "data-page-focus=\"[a-z]+\""; done
data-page-focus="entertainment"
data-page-focus="brands"
$ curl -s http://127.0.0.1:3101/media-kit | grep -c "mailto:"
0
$ curl -s -i -X POST http://127.0.0.1:3101/api/lead -H "Content-Type: application/json" -d <campaign, focus "sports">
HTTP/1.1 422 Unprocessable Entity
x-zbest-lead-stub: no-delivery
{"ok":false,"error":{"code":"validation","fields":{"focus":"Choose Entertainment or Brands."}}}

```

### Z Best Media — audit F8
```
$ curl -s http://127.0.0.1:3100/revenue-recovery | grep -o "Free. No payment, no obligation." | wc -l   # HTML + RSC payload
       2
```

## Phase 4 ZBC screenshot artifacts

```
e2e/snapshots/phase-4-zbc/zbc-about-desktop-1440.png
  PNG image data, 1440 x 1795
e2e/snapshots/phase-4-zbc/zbc-about-mobile-390.png
  PNG image data, 1170 x 6120
e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-desktop-1440.png
  PNG image data, 1440 x 2908
e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-mobile-390.png
  PNG image data, 1170 x 10671
e2e/snapshots/phase-4-zbc/zbc-brands-desktop-1440.png
  PNG image data, 1440 x 1524
e2e/snapshots/phase-4-zbc/zbc-brands-mobile-390.png
  PNG image data, 1170 x 5706
e2e/snapshots/phase-4-zbc/zbc-entertainment-desktop-1440.png
  PNG image data, 1440 x 1680
e2e/snapshots/phase-4-zbc/zbc-entertainment-mobile-390.png
  PNG image data, 1170 x 5865
e2e/snapshots/phase-4-zbc/zbc-faq-desktop-1440.png
  PNG image data, 1440 x 1627
e2e/snapshots/phase-4-zbc/zbc-faq-mobile-390.png
  PNG image data, 1170 x 5286
e2e/snapshots/phase-4-zbc/zbc-how-it-works-desktop-1440.png
  PNG image data, 1440 x 3396
e2e/snapshots/phase-4-zbc/zbc-how-it-works-mobile-390.png
  PNG image data, 1170 x 15456
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
  PNG image data, 1440 x 3079
e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png
  PNG image data, 1170 x 10725
e2e/snapshots/phase-4-zbc/zbc-media-kit-desktop-1440.png
  PNG image data, 1440 x 2534
e2e/snapshots/phase-4-zbc/zbc-media-kit-mobile-390.png
  PNG image data, 1170 x 9681
e2e/snapshots/phase-4-zbc/zbc-pricing-desktop-1440.png
  PNG image data, 1440 x 1926
e2e/snapshots/phase-4-zbc/zbc-pricing-mobile-390.png
  PNG image data, 1170 x 6624
```

Snapshot status after the gate run above, across all five suites:

```
$ git status --porcelain e2e/snapshots/
(no output = all screenshots byte-identical to the committed blobs)
```

Captures are byte-reproducible: SHA-256 of all 68 PNGs recorded after commit, compared after this wiped-state run.

```
$ shasum -a 256 e2e/snapshots/phase-*/*.png | diff <recorded-at-commit> -
(no diff — 68 of 68 identical)
```

## Appended after capture

Everything above this heading is the unedited capture. The items below are appended, not substituted.

### An earlier attempt at this log was discarded

The first generation of this log had an invalid "Served" section: the script was written through an
unquoted shell heredoc, so `$u` expanded to nothing and every per-page curl requested `/` (all rows
200, `/how-it-works` included, and every rate count 0). It was not committed. The script was fixed and
the whole log regenerated from a wiped state; the capture above is that second run.

### Reading the "any dollar figure" rows

Every page shows 1 matching line. Each page's HTML is only a few long lines, and the React Server
Components payload embedded in it contains references such as `"$1"` and `"$Le"`, which `\$[0-9]` matches.
That row does not detect page copy. Checked on /pricing after capture:

```
$ curl -s /pricing | grep -oE '.{30}\$[0-9].{20}' | head -3
"$undefined\",4624],[[\"$\",\"$1\",\"c\",{\"children
,\"$Le\",null,{}]
8:[\"$\",\"$1\",\"c\",{\"children
$undefined\"}]]}]
9:[\"$\",\"$1\",\"c\",{\"children
$ curl -s /pricing | <strip scripts and tags> | grep -oE '\$[0-9][^ ]*'
(no output)
```

The authoritative check is the gate's, which reads rendered <main> text on every client-facing page
(`dollar figure on a client-facing page`), and the rate-specific rows above, which match only
/become-a-clipper.

### Capture zip

```
$ (cd e2e/snapshots/phase-4-zbc && ls *.png | sort | zip -X -q ../../../docs/phase-4-zbc-captures.zip -@)
$ unzip -l docs/phase-4-zbc-captures.zip
Archive:  docs/phase-4-zbc-captures.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   241120  09-16-2026 21:06   zbc-about-desktop-1440.png
   615560  09-16-2026 21:07   zbc-about-mobile-390.png
   291971  09-16-2026 21:06   zbc-become-a-clipper-desktop-1440.png
   890220  09-16-2026 21:07   zbc-become-a-clipper-mobile-390.png
   152007  09-16-2026 21:06   zbc-brands-desktop-1440.png
   458417  09-16-2026 21:07   zbc-brands-mobile-390.png
   177675  09-16-2026 21:06   zbc-entertainment-desktop-1440.png
   486538  09-16-2026 21:07   zbc-entertainment-mobile-390.png
   148154  09-16-2026 21:06   zbc-faq-desktop-1440.png
   428882  09-16-2026 21:07   zbc-faq-mobile-390.png
   346707  09-16-2026 21:06   zbc-how-it-works-desktop-1440.png
  1313292  09-16-2026 21:07   zbc-how-it-works-mobile-390.png
   233169  09-16-2026 21:06   zbc-launch-a-campaign-desktop-1440.png
   786315  09-16-2026 21:07   zbc-launch-a-campaign-mobile-390.png
   240347  09-16-2026 21:06   zbc-media-kit-desktop-1440.png
   824662  09-16-2026 21:07   zbc-media-kit-mobile-390.png
   151292  09-16-2026 21:06   zbc-pricing-desktop-1440.png
   489515  09-16-2026 21:07   zbc-pricing-mobile-390.png
---------                     -------
  8275843                     18 files
$ shasum -a 256 docs/phase-4-zbc-captures.zip e2e/snapshots/phase-4-zbc/*.png
4dcc97d14aa9a081b67180864113ea8c85bac579131fc7f6f36fbd968ad056f9  docs/phase-4-zbc-captures.zip
7447cc9fb077c27dbc0684181573de03a37f707d6a4abcd017af7e3d2d48886e  e2e/snapshots/phase-4-zbc/zbc-about-desktop-1440.png
3db4013560d395285c41eb24719df79148ab5916bed771c60f23f2fe2ce0c32f  e2e/snapshots/phase-4-zbc/zbc-about-mobile-390.png
d6f459a90e8c8075b23f4fccf4a2f1e4e334f2ca72b96f1504a23ac6d61e16f0  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-desktop-1440.png
d3b32be8c0fb252b88ce358d45769da01417ca045d54cd70da56e4cd766a1149  e2e/snapshots/phase-4-zbc/zbc-become-a-clipper-mobile-390.png
ff3e525d877ff180938c6f60aed0a62974b159a9f81290f80e21ec852bea53d6  e2e/snapshots/phase-4-zbc/zbc-brands-desktop-1440.png
c05f1af693c1f56fca84655070832f989b3e3713d8b38b46db9a240e08ea8b7f  e2e/snapshots/phase-4-zbc/zbc-brands-mobile-390.png
bdb162615bbb38b527a4c9e3f05d6fe068f2d35613f7d14f42247ed20d5b8520  e2e/snapshots/phase-4-zbc/zbc-entertainment-desktop-1440.png
57e4270a0948ccf07f0b6ce68cc8f601605b20fc8a09787b4b6845093b369458  e2e/snapshots/phase-4-zbc/zbc-entertainment-mobile-390.png
d987232e0dd1c6c2c42490f9a02124057679463cea52b06035c8ef923634c8eb  e2e/snapshots/phase-4-zbc/zbc-faq-desktop-1440.png
2a318369c75444ef6fa67aab354ed693076786a70c28035a5614da8e77dbb35a  e2e/snapshots/phase-4-zbc/zbc-faq-mobile-390.png
1fe8eea51f904b83c5d9c92ce1831e2adab543929fdc7d81d36a3f8952d3dd7c  e2e/snapshots/phase-4-zbc/zbc-how-it-works-desktop-1440.png
955471d44c9cee1629b528c475f854af870e537db0faa91070244a6883e95853  e2e/snapshots/phase-4-zbc/zbc-how-it-works-mobile-390.png
a4e87625773f08e7071fdb1228eab35b294733e0b7d158efde587d34e5aea2e0  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-desktop-1440.png
a10377a27b02d9b37b28af1afa4d909e78beec57ecf6b4ea74ca95ee0ad12fde  e2e/snapshots/phase-4-zbc/zbc-launch-a-campaign-mobile-390.png
c96ba81916f75c667d6483999603f5f12d3c9de0f76cf40864ab341735a034e7  e2e/snapshots/phase-4-zbc/zbc-media-kit-desktop-1440.png
316125faa4a628d341f1b931d296201e4d482bd5fdd9d09f6a26d945d9ba30fb  e2e/snapshots/phase-4-zbc/zbc-media-kit-mobile-390.png
e24fc1cf66d592db434d0aef71c47b24c803fb84d1dbdaf7a48cfd70b5b5fad7  e2e/snapshots/phase-4-zbc/zbc-pricing-desktop-1440.png
a20b0fa3c152d0ccd20fe164a97f1a0933ea2626a82c449fcb08b2cd46557cf1  e2e/snapshots/phase-4-zbc/zbc-pricing-mobile-390.png
```

### Mutation run — raw output

Run BEFORE commit c35ee1d, against the working tree that became it, with the seven mutations below
applied on top; files restored from backups afterwards and typecheck re-run clean (0 errors). Capture
tests that still passed under mutation wrote screenshots of the mutated pages; the full gate run before
commit regenerated every capture from restored source, and the hash comparison above binds the
committed captures. Output below is unedited; the run exited 1.

```
M1 real company name on Entertainment  apps/zbc/app/entertainment/page.tsx
M2 clipper payout split on client Pricing page  apps/zbc/app/pricing/page.tsx
M3 IllustrativeBadge dropped from the two Brands example cards  apps/zbc/app/page.tsx
M4 Brands page carries the Entertainment focus  apps/zbc/app/brands/page.tsx
M5 honesty note reworded  apps/zbc/app/launch-a-campaign/page.tsx
M6 non-existent press mailbox offered as a mailto link  apps/zbc/app/media-kit/page.tsx
M7 /how-it-works redirect removed  apps/zbc/next.config.ts
```

```

  ⚠  Gate running against a DIRTY tree — screenshots will not match 9342192.


Running 70 tests using 1 worker

[1/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured
[2/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured
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


[3/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured
  2) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 

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


[4/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured
  3) [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 

    Error: dollar figure on a client-facing page

    expect(received).not.toMatch(expected)

    Expected pattern: not /\$\s?\d/
    Received string:      "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — and you only pay after you approve the post.
    
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
    
    Clippers earn $50–100 guaranteed flat fee per approved post
    
    LAUNCH A CAMPAIGN"

      137 |       // §9: client pricing bundled; clipper payout figures only on Become a Clipper.
      138 |       if (!("clipperFacing" in p)) {
    > 139 |         expect(await mainText(page), "dollar figure on a client-facing page").not.toMatch(/\$\s?\d/);
          |                                                                                   ^
      140 |       }
      141 |
      142 |       // §B1: focus pages recolor the document; everything else keeps the default.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:139:83

    Error Context: test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[5/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured
[6/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured
[7/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured
[8/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured
[9/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured
[10/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves
[11/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves
[12/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves
[13/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves
[14/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves
[15/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves
[16/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves
[17/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves
[18/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves
[19/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to /
  4) [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 

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


[20/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390
[21/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors
[22/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures
  5) [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 

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


[23/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion
[24/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split
  6) [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /guaranteed flat fee|per approved post|performance bonus|split/i
    Received string:      "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — and you only pay after you approve the post.
    
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
    
    Clippers earn $50–100 guaranteed flat fee per approved post
    
    LAUNCH A CAMPAIGN"

      283 |     ]);
      284 |     const text = await mainText(page);
    > 285 |     expect(text).not.toMatch(/guaranteed flat fee|per approved post|performance bonus|split/i);
          |                      ^
      286 |   });
      287 | });
      288 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:285:22

    Error Context: test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[25/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates
[26/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub
[27/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word
  7) [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is a new operation built on industry-leading mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is a new operation built on industry-leading mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


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


[28/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub
[29/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values
[30/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub
[31/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs
[32/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder
  8) [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      443 |     await expect(press.locator("[data-fixture-note]")).toContainText("Placeholder");
      444 |     // The mailbox does not exist, so nothing may offer to send mail to it.
    > 445 |     expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
          |                                                              ^
      446 |     // Company voice: no founder name (§B4).
      447 |     expect(await mainText(page)).not.toMatch(/Zack/);
      448 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:445:62

    Error Context: test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[33/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates
[34/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else
  9) [desktop-1440] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 

    Error: /pricing

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      467 |       const html = await (await page.request.get(`${ZBC_BASE_URL}${p.path}`)).text();
      468 |       const hasRates = /\$50–100|\$3–5/.test(html);
    > 469 |       expect(hasRates, `${p.path}`).toBe("clipperFacing" in p);
          |                                     ^
      470 |     }
      471 |   });
      472 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:469:37

    Error Context: test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[35/70] [desktop-1440] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL
[36/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured
[37/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured
  10) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 

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


[38/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured
  11) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 

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


[39/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured
  12) [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 

    Error: dollar figure on a client-facing page

    expect(received).not.toMatch(expected)

    Expected pattern: not /\$\s?\d/
    Received string:      "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — and you only pay after you approve the post.
    
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
    
    Clippers earn $50–100 guaranteed flat fee per approved post
    
    LAUNCH A CAMPAIGN"

      137 |       // §9: client pricing bundled; clipper payout figures only on Become a Clipper.
      138 |       if (!("clipperFacing" in p)) {
    > 139 |         expect(await mainText(page), "dollar figure on a client-facing page").not.toMatch(/\$\s?\d/);
          |                                                                                   ^
      140 |       }
      141 |
      142 |       // §B1: focus pages recolor the document; everything else keeps the default.
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:139:83

    Error Context: test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc--pricing-rende-19448--site-rules-and-is-captured-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[40/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured
[41/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured
[42/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured
[43/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured
[44/70] [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured
[45/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves
[46/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves
[47/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves
[48/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves
[49/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves
[50/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves
[51/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves
[52/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves
[53/70] [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves
[54/70] [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to /
  13) [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 

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


[55/70] [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390
[56/70] [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors
[57/70] [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures
  14) [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 

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


[58/70] [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion
[59/70] [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split
  15) [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /guaranteed flat fee|per approved post|performance bonus|split/i
    Received string:      "PRICING
    
    How a campaign is priced.
    
    You’re not paying for hours or a retainer. You’re funding a pool that pays creators only when their clips get real, verified views — and you only pay after you approve the post.
    
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
    
    Clippers earn $50–100 guaranteed flat fee per approved post
    
    LAUNCH A CAMPAIGN"

      283 |     ]);
      284 |     const text = await mainText(page);
    > 285 |     expect(text).not.toMatch(/guaranteed flat fee|per approved post|performance bonus|split/i);
          |                      ^
      286 |   });
      287 | });
      288 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:285:22

    Error Context: test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Pricing-§B4-fi-12250-and-no-clipper-payout-split-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[60/70] [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates
[61/70] [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub
[62/70] [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word
  16) [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('[data-honesty-note]')
    Expected: "Z Best Clips is a new operation built on proven mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Received: "Z Best Clips is a new operation built on industry-leading mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('[data-honesty-note]') with timeout 5000ms
      - waiting for locator('[data-honesty-note]')
        14 × locator resolved to <blockquote data-honesty-note="true" class="border-l-2 border-accent pl-6">…</blockquote>
           - unexpected value "Z Best Clips is a new operation built on industry-leading mechanics — the same clipping and distribution model driving results industry-wide. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise."


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


[63/70] [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub
[64/70] [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values
[65/70] [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub
[66/70] [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs
[67/70] [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder
  17) [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 0
    Received: 1

      443 |     await expect(press.locator("[data-fixture-note]")).toContainText("Placeholder");
      444 |     // The mailbox does not exist, so nothing may offer to send mail to it.
    > 445 |     expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
          |                                                              ^
      446 |     // Company voice: no founder name (§B4).
      447 |     expect(await mainText(page)).not.toMatch(/Zack/);
      448 |   });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:445:62

    Error Context: test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Media-Kit-§B4--4e0e1-abeled-non-link-placeholder-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[68/70] [mobile-390] › tests/phase-4-zbc.spec.ts:452:3 › FAQ (§B4) › all ten questions, operable, and no payout rates
[69/70] [mobile-390] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else
  18) [mobile-390] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 

    Error: /pricing

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      467 |       const html = await (await page.request.get(`${ZBC_BASE_URL}${p.path}`)).text();
      468 |       const hasRates = /\$50–100|\$3–5/.test(html);
    > 469 |       expect(hasRates, `${p.path}`).toBe("clipperFacing" in p);
          |                                     ^
      470 |     }
      471 |   });
      472 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-4-zbc.spec.ts:469:37

    Error Context: test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-4-zbc-Site-wide-ZBC--68e79--a-Clipper-and-nowhere-else-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[70/70] [mobile-390] › tests/phase-4-zbc.spec.ts:473:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL
  18 failed
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 
    [desktop-1440] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured 
    [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / 
    [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures 
    [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split 
    [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word 
    [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder 
    [mobile-390] › tests/phase-4-zbc.spec.ts:465:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else 
  52 passed (1.2m)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-4-zbc.spec.ts --reporter=line
```

### Note on the dirty-tree warning

Printed because this log file was untracked while being written, as in earlier logs. No source,
config or test file differed from c35ee1d, and all 68 screenshots matched the hashes recorded at commit.

### Node

Node v24.9.0, same shell as the Phase 3 and Phase 4 ZBM logs. Node 20 equivalence remains unverified.
