# Phase 5, AI Visibility Readiness Check — build steps 1 and 3 — raw verification output

Unedited stdout/stderr. Commands in the appended sections are printed with printf, so each is
shown exactly as it ran. Nothing below the appendix heading is summarized.

**Scope.** Backend Spec v0.4 §12, founder decision 11. The founder ran build steps 1 and 3 as
one lane, so the Search Intelligence page never shows the new library beside the retired
promise:
- step 1 publishes the Visibility Gap Library, exactly as certified in §12.4, and repoints
  CLAUDE.md to v0.4;
- step 3 removes the four retired strings (§12.8, C3), rewrites the false FAQ line, and adds
  the C3 gate.

**Step 2 — the rule set, form and result — is not in this lane.**

**Evidence subject: `b67f62f`, gated AT the commit.** The pre-gate state below shows HEAD at
`b67f62f` with a clean tree. The gate ran twice at that commit — before and after the mutation
run — and both runs are recorded. Mutations ran against the same commit.

## Gate at `b67f62f` — run 1, before the mutations

### state
```
=== date/env ===
2026-09-18T18:15:29Z
Darwin 25.6.0
v24.9.0
9.15.0
=== git status ===
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
=== git rev-parse HEAD ===
b67f62ffa73470464a3e7953bd4a2e13f5a888d7
=== git ls-remote origin main ===
2758bfb1bab1c377df77c4185bc20bfaadead871	refs/heads/main
```

### 01-build (run 1)
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbm:build: cache miss, executing b0b4dd8874b99a1c
@zbest/zbc:build: cache miss, executing 3bf916a1a400ac70
@zbest/zbm:build: 
@zbest/zbm:build: > @zbest/zbm@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:build: > next build
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build: > @zbest/zbc@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:build: > next build
@zbest/zbc:build: 
@zbest/zbc:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbm:build: ▲ Next.js 16.3.5 (Turbopack)
@zbest/zbc:build: ✓ Running next.config.ts took 13ms
@zbest/zbm:build: ✓ Running next.config.ts took 13ms
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbm:build: ✓ Compiled successfully in 2.7s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build: ✓ Compiled successfully in 2.9s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbm:build:   Finished TypeScript in 1285ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Finished TypeScript in 1278ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 280ms
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
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 416ms
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
  Time:    6.794s 

```

### 02-typecheck (run 1)
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

@zbest/zbm:typecheck: cache miss, executing efa028d47a45f977
e2e:typecheck: cache miss, executing 99a087bed48c84a2
@zbest/ui:typecheck: cache miss, executing 0f571858f6885de2
@zbest/zbc:typecheck: cache miss, executing ecea9f10f4d4a13f
@zbest/zbm:typecheck: 
@zbest/zbm:typecheck: > @zbest/zbm@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:typecheck: > tsc --noEmit
@zbest/zbm:typecheck: 
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 
@zbest/zbc:typecheck: 
@zbest/zbc:typecheck: > @zbest/zbc@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:typecheck: > tsc --noEmit
@zbest/zbc:typecheck: 
@zbest/ui:typecheck: 
@zbest/ui:typecheck: > @zbest/ui@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:typecheck: > tsc --noEmit
@zbest/ui:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.069s 

```

### 03-e2e (run 1)
```

Running 298 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (270ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (227ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (255ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (147ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (186ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (248ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (124ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (179ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (265ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (178ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (179ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (173ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (171ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (119ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (85ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (122ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (117ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (118ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (196ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (315ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (40ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (302ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (46ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (278ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (223ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (161ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (179ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (157ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (186ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (123ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (292ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (118ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (115ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (119ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (170ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (325ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (35ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (245ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (42ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (276ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (247ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (240ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (128ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (104ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (221ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (169ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (196ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (207ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (205ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (216ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (208ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (202ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (116ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (106ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (110ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (110ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (113ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (110ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (105ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (104ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (103ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (35ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (120ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (113ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (138ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (95ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (118ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (279ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (97ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (312ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (39ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (34ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (97ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (386ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (383ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (181ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (165ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (104ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (130ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (49ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (35ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (226ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (391ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (185ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (198ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (270ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (143ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (111ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (141ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (86ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (112ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (98ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (110ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (123ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (112ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (132ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (151ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (114ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (501ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (66ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (107ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (119ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (114ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (166ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (570ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (34ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (31ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (101ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (89ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (196ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (405ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (98ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (93ms)
  ✓  126 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (91ms)
  ✓  127 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (118ms)
  ✓  128 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (97ms)
  ✓  129 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (50ms)
  ✓  130 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (264ms)
  ✓  131 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (91ms)
  ✓  132 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (478ms)
  ✓  133 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  134 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (134ms)
  ✓  135 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (97ms)
  ✓  136 [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (53ms)
  ✓  137 [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (32ms)
  ✓  138 [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (44ms)
  ✓  139 [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (40ms)
  ✓  140 [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (38ms)
  ✓  141 [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (39ms)
  ✓  142 [desktop-1440] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (39ms)
  ✓  143 [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (31ms)
  ✓  144 [desktop-1440] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓  145 [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (318ms)
  ✓  146 [desktop-1440] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (216ms)
  ✓  147 [desktop-1440] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (548ms)
  ✓  148 [desktop-1440] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (486ms)
  ✓  149 [desktop-1440] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (548ms)
  ✓  150 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (514ms)
  ✓  151 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (602ms)
  ✓  152 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (474ms)
  ✓  153 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (237ms)
  ✓  154 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (309ms)
  ✓  155 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  156 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (596ms)
  ✓  157 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (245ms)
  ✓  158 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (313ms)
  ✓  159 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.7s)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (468ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (349ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (351ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (323ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (325ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (237ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (383ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (225ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (212ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (218ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (281ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (475ms)
  ✓  172 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (129ms)
  ✓  173 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (390ms)
  ✓  174 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (144ms)
  ✓  175 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (391ms)
  ✓  176 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (656ms)
  ✓  177 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (336ms)
  ✓  178 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (370ms)
  ✓  179 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (322ms)
  ✓  180 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (309ms)
  ✓  181 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (229ms)
  ✓  182 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (347ms)
  ✓  183 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (219ms)
  ✓  184 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (231ms)
  ✓  185 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (210ms)
  ✓  186 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (257ms)
  ✓  187 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (481ms)
  ✓  188 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (131ms)
  ✓  189 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (376ms)
  ✓  190 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (138ms)
  ✓  191 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (378ms)
  ✓  192 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (375ms)
  ✓  193 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (423ms)
  ✓  194 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (285ms)
  ✓  195 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (227ms)
  -  196 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (609ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (298ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (299ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (304ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (404ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (364ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (290ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (330ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (303ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (237ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (230ms)
  ✓  208 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (212ms)
  ✓  209 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (210ms)
  ✓  210 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (221ms)
  ✓  211 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (233ms)
  ✓  212 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (209ms)
  ✓  213 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (208ms)
  ✓  214 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (212ms)
  ✓  215 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (129ms)
  ✓  216 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (235ms)
  ✓  217 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (223ms)
  ✓  218 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (268ms)
  ✓  219 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  220 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (199ms)
  ✓  221 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (228ms)
  ✓  222 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (340ms)
  ✓  223 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (197ms)
  ✓  224 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (329ms)
  ✓  225 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (135ms)
  ✓  226 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (135ms)
  ✓  227 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (204ms)
  ✓  228 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (567ms)
  ✓  229 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (575ms)
  ✓  230 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (305ms)
  ✓  231 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (280ms)
  ✓  232 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (208ms)
  ✓  233 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (235ms)
  ✓  234 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (138ms)
  ✓  235 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (130ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (418ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (368ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (624ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (346ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (278ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (293ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (319ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (459ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (249ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (225ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (246ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (209ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (203ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (205ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (207ms)
  ✓  251 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (221ms)
  ✓  252 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (237ms)
  ✓  253 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (231ms)
  ✓  254 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (261ms)
  ✓  255 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (273ms)
  ✓  256 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (236ms)
  ✓  257 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (637ms)
  ✓  258 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (174ms)
  ✓  259 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (236ms)
  ✓  260 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (238ms)
  ✓  261 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (225ms)
  ✓  262 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (253ms)
  ✓  263 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (293ms)
  ✓  264 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (693ms)
  ✓  265 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (139ms)
  ✓  266 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (135ms)
  ✓  267 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (138ms)
  ✓  268 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (130ms)
  ✓  269 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (213ms)
  ✓  270 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (205ms)
  ✓  271 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (278ms)
  ✓  272 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (612ms)
  ✓  273 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (216ms)
  ✓  274 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (200ms)
  ✓  275 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (210ms)
  ✓  276 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (223ms)
  ✓  277 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (218ms)
  ✓  278 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (155ms)
  ✓  279 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (388ms)
  ✓  280 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (203ms)
  ✓  281 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (670ms)
  ✓  282 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  283 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (242ms)
  ✓  284 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (213ms)
  ✓  285 [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (146ms)
  ✓  286 [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (129ms)
  ✓  287 [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (141ms)
  ✓  288 [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (133ms)
  ✓  289 [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (132ms)
  ✓  290 [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (131ms)
  ✓  291 [mobile-390] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (143ms)
  ✓  292 [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (129ms)
  ✓  293 [mobile-390] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✓  294 [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (507ms)
  ✓  295 [mobile-390] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (343ms)
  ✓  296 [mobile-390] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (751ms)
  ✓  297 [mobile-390] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (578ms)
  ✓  298 [mobile-390] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (677ms)

  1 skipped
  297 passed (1.4m)
```

### 04-lint (run 1)
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/ui:lint: cache miss, executing a7535a17ff5ec719
@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
e2e:lint: cache miss, executing fa8968879e1b343f
@zbest/zbm:lint: cache miss, executing 13d2510ab667471b
@zbest/zbc:lint: cache miss, executing 98cb0571a22c1da9
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
@zbest/zbc:lint: 
@zbest/zbc:lint: > @zbest/zbc@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbc
@zbest/zbc:lint: > eslint .
@zbest/zbc:lint: 
@zbest/zbm:lint: 
@zbest/zbm:lint: > @zbest/zbm@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/apps/zbm
@zbest/zbm:lint: > eslint .
@zbest/zbm:lint: 

 Tasks:    5 successful, 5 total
Cached:    0 cached, 5 total
  Time:    1.763s 

```

### exit codes (run 1)
```
build=0
typecheck=0
e2e=0
lint=0
DONE
```

## Gate at `b67f62f` — run 2, after the mutations were reverted

### state
```
=== date/env ===
2026-09-18T18:22:04Z
Darwin 25.6.0
v24.9.0
9.15.0
=== git status ===
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
=== git rev-parse HEAD ===
b67f62ffa73470464a3e7953bd4a2e13f5a888d7
=== git ls-remote origin main ===
2758bfb1bab1c377df77c4185bc20bfaadead871	refs/heads/main
```

### 01-build (run 2)
```

> zbest-sites@0.1.0 build /Users/andrelove/WebstormProjects/zbest-sites
> turbo run build

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running build in 5 packages
   • Remote caching disabled

@zbest/zbc:build: cache miss, executing 3bf916a1a400ac70
@zbest/zbm:build: cache miss, executing b0b4dd8874b99a1c
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
@zbest/zbc:build: ✓ Running next.config.ts took 12ms
@zbest/zbm:build: ✓ Running next.config.ts took 12ms
@zbest/zbm:build: 
@zbest/zbc:build: 
@zbest/zbc:build:   Creating an optimized production build ...
@zbest/zbm:build:   Creating an optimized production build ...
@zbest/zbc:build: ✓ Compiled successfully in 2.9s
@zbest/zbc:build:   Running TypeScript ...
@zbest/zbm:build: ✓ Compiled successfully in 2.9s
@zbest/zbm:build:   Running TypeScript ...
@zbest/zbc:build:   Finished TypeScript in 1198ms ...
@zbest/zbc:build:   Collecting page data using 13 workers ...
@zbest/zbm:build:   Finished TypeScript in 1282ms ...
@zbest/zbm:build:   Collecting page data using 13 workers ...
@zbest/zbc:build:   Generating static pages using 13 workers (0/29) ...
@zbest/zbm:build:   Generating static pages using 13 workers (0/25) ...
@zbest/zbc:build:   Generating static pages using 13 workers (7/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (14/29) 
@zbest/zbc:build:   Generating static pages using 13 workers (21/29) 
@zbest/zbm:build:   Generating static pages using 13 workers (6/25) 
@zbest/zbc:build: ✓ Generating static pages using 13 workers (29/29) in 323ms
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
@zbest/zbm:build:   Generating static pages using 13 workers (12/25) 
@zbest/zbm:build:   Generating static pages using 13 workers (18/25) 
@zbest/zbm:build: ✓ Generating static pages using 13 workers (25/25) in 357ms
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
  Time:    6.74s 

```

### 02-typecheck (run 2)
```

> zbest-sites@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites
> turbo run typecheck

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running typecheck in 5 packages
   • Remote caching disabled

@zbest/ui:typecheck: cache miss, executing 0f571858f6885de2
@zbest/zbc:typecheck: cache miss, executing ecea9f10f4d4a13f
e2e:typecheck: cache miss, executing 99a087bed48c84a2
@zbest/zbm:typecheck: cache miss, executing efa028d47a45f977
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
e2e:typecheck: 
e2e:typecheck: > e2e@0.1.0 typecheck /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:typecheck: > tsc --noEmit
e2e:typecheck: 

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    1.042s 

```

### 03-e2e (run 2)
```

Running 298 tests using 1 worker

  ✓    1 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (385ms)
  ✓    2 [desktop-1440] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (235ms)
  ✓    3 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (244ms)
  ✓    4 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (158ms)
  ✓    5 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (206ms)
  ✓    6 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓    7 [desktop-1440] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (247ms)
  ✓    8 [desktop-1440] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (129ms)
  ✓    9 [desktop-1440] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (181ms)
  ✓   10 [desktop-1440] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.5s)
  ✓   11 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (263ms)
  ✓   12 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (177ms)
  ✓   13 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (177ms)
  ✓   14 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (173ms)
  ✓   15 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (171ms)
  ✓   16 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (121ms)
  ✓   17 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (88ms)
  ✓   18 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (120ms)
  ✓   19 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (116ms)
  ✓   20 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (118ms)
  ✓   21 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (183ms)
  ✓   22 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (318ms)
  ✓   23 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (36ms)
  ✓   24 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (309ms)
  ✓   25 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (49ms)
  ✓   26 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (292ms)
  ✓   27 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (247ms)
  ✓   28 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (163ms)
  ✓   29 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (174ms)
  ✓   30 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (156ms)
  ✓   31 [desktop-1440] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (191ms)
  ✓   32 [desktop-1440] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (121ms)
  ✓   33 [desktop-1440] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (309ms)
  ✓   34 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (113ms)
  ✓   35 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (114ms)
  ✓   36 [desktop-1440] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (119ms)
  ✓   37 [desktop-1440] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (153ms)
  ✓   38 [desktop-1440] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (316ms)
  ✓   39 [desktop-1440] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (33ms)
  ✓   40 [desktop-1440] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (242ms)
  ✓   41 [desktop-1440] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (47ms)
  ✓   42 [desktop-1440] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (257ms)
  ✓   43 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (243ms)
  ✓   44 [desktop-1440] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (244ms)
  ✓   45 [desktop-1440] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (140ms)
  ✓   46 [desktop-1440] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (100ms)
  ✓   47 [desktop-1440] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens (1ms)
  ✓   48 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (252ms)
  ✓   49 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (167ms)
  ✓   50 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   51 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (206ms)
  ✓   52 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (214ms)
  ✓   53 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   54 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓   55 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (218ms)
  ✓   56 [desktop-1440] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (200ms)
  ✓   57 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (116ms)
  ✓   58 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (115ms)
  ✓   59 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (112ms)
  ✓   60 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (102ms)
  ✓   61 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (109ms)
  ✓   62 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (117ms)
  ✓   63 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (104ms)
  ✓   64 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (109ms)
  ✓   65 [desktop-1440] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (101ms)
  ✓   66 [desktop-1440] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (31ms)
  ✓   67 [desktop-1440] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (125ms)
  ✓   68 [desktop-1440] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (116ms)
  ✓   69 [desktop-1440] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (141ms)
  ✓   70 [desktop-1440] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.4s)
  ✓   71 [desktop-1440] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (99ms)
  ✓   72 [desktop-1440] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (113ms)
  ✓   73 [desktop-1440] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (226ms)
  ✓   74 [desktop-1440] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (97ms)
  ✓   75 [desktop-1440] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (297ms)
  ✓   76 [desktop-1440] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (42ms)
  ✓   77 [desktop-1440] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (39ms)
  ✓   78 [desktop-1440] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (105ms)
  ✓   79 [desktop-1440] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (394ms)
  ✓   80 [desktop-1440] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (412ms)
  ✓   81 [desktop-1440] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (192ms)
  ✓   82 [desktop-1440] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (164ms)
  ✓   83 [desktop-1440] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (109ms)
  ✓   84 [desktop-1440] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (132ms)
  ✓   85 [desktop-1440] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (55ms)
  ✓   86 [desktop-1440] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (32ms)
  ✓   87 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (251ms)
  ✓   88 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (231ms)
  ✓   89 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (406ms)
  ✓   90 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (212ms)
  ✓   91 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (198ms)
  ✓   92 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (186ms)
  ✓   93 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   94 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓   95 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (150ms)
  ✓   96 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (130ms)
  ✓   97 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (135ms)
  ✓   98 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (110ms)
  ✓   99 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (102ms)
  ✓  100 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (113ms)
  ✓  101 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (108ms)
  ✓  102 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (111ms)
  ✓  103 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (121ms)
  ✓  104 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (119ms)
  ✓  105 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (155ms)
  ✓  106 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (155ms)
  ✓  107 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (124ms)
  ✓  108 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (497ms)
  ✓  109 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (65ms)
  ✓  110 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (114ms)
  ✓  111 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (125ms)
  ✓  112 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (115ms)
  ✓  113 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (133ms)
  ✓  114 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (171ms)
  ✓  115 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (582ms)
  ✓  116 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓  117 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (35ms)
  ✓  118 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓  119 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓  120 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (102ms)
  ✓  121 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (92ms)
  ✓  122 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (190ms)
  ✓  123 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (402ms)
  ✓  124 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (101ms)
  ✓  125 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (85ms)
  ✓  126 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (94ms)
  ✓  127 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (103ms)
  ✓  128 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (98ms)
  ✓  129 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (51ms)
  ✓  130 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (268ms)
  ✓  131 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (88ms)
  ✓  132 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (471ms)
  ✓  133 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  134 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (136ms)
  ✓  135 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (101ms)
  ✓  136 [desktop-1440] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (46ms)
  ✓  137 [desktop-1440] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (33ms)
  ✓  138 [desktop-1440] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (42ms)
  ✓  139 [desktop-1440] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (38ms)
  ✓  140 [desktop-1440] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (37ms)
  ✓  141 [desktop-1440] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (36ms)
  ✓  142 [desktop-1440] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (41ms)
  ✓  143 [desktop-1440] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (34ms)
  ✓  144 [desktop-1440] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (32ms)
  ✓  145 [desktop-1440] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (320ms)
  ✓  146 [desktop-1440] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (219ms)
  ✓  147 [desktop-1440] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (549ms)
  ✓  148 [desktop-1440] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (489ms)
  ✓  149 [desktop-1440] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (547ms)
  ✓  150 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Media › boots on the correct base color with its headline face (519ms)
  ✓  151 [mobile-390] › tests/phase-1.spec.ts:48:5 › Z Best Clips › boots on the correct base color with its headline face (601ms)
  ✓  152 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Media — design system › renders every Phase 2 piece (479ms)
  ✓  153 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Media — design system › FAQ accordion is operable and announces state (251ms)
  ✓  154 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Media — design system › cookie consent can reject non-essential and stays dismissed (593ms)
  ✓  155 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Media — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.8s)
  ✓  156 [mobile-390] › tests/phase-2.spec.ts:45:5 › Z Best Clips — design system › renders every Phase 2 piece (716ms)
  ✓  157 [mobile-390] › tests/phase-2.spec.ts:147:5 › Z Best Clips — design system › FAQ accordion is operable and announces state (304ms)
  ✓  158 [mobile-390] › tests/phase-2.spec.ts:171:5 › Z Best Clips — design system › cookie consent can reject non-essential and stays dismissed (386ms)
  ✓  159 [mobile-390] › tests/phase-2.spec.ts:195:5 › Z Best Clips — design system › counter ticks once, and prefers-reduced-motion disables the tick (1.8s)
  ✓  160 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › / — nav, footer and no forbidden links (577ms)
  ✓  161 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (451ms)
  ✓  162 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (480ms)
  ✓  163 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (500ms)
  ✓  164 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Media — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (405ms)
  ✓  165 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Media — shared scaffolding › nav stays pinned to the top while the page scrolls (325ms)
  ✓  166 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Media — shared scaffolding › menus close on navigation, Escape and outside click (557ms)
  ✓  167 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (353ms)
  ✓  168 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (312ms)
  ✓  169 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Media — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (325ms)
  ✓  170 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Media — shared scaffolding › 404 returns 404, is noindex, and offers a way home (396ms)
  ✓  171 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Media — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (726ms)
  ✓  172 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Media — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (177ms)
  ✓  173 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Media — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (616ms)
  ✓  174 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Media — shared scaffolding › OG image renders on the brand base color at 1200×630 (183ms)
  ✓  175 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Media — shared scaffolding › Cookie Settings reopens a consent choice already made (566ms)
  ✓  176 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › / — nav, footer and no forbidden links (855ms)
  ✓  177 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — nav, footer and no forbidden links (493ms)
  ✓  178 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — nav, footer and no forbidden links (519ms)
  ✓  179 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — nav, footer and no forbidden links (463ms)
  ✓  180 [mobile-390] › tests/phase-3.spec.ts:116:7 › Z Best Clips — shared scaffolding › /this-page-does-not-exist — nav, footer and no forbidden links (425ms)
  ✓  181 [mobile-390] › tests/phase-3.spec.ts:195:5 › Z Best Clips — shared scaffolding › nav stays pinned to the top while the page scrolls (336ms)
  ✓  182 [mobile-390] › tests/phase-3.spec.ts:205:5 › Z Best Clips — shared scaffolding › menus close on navigation, Escape and outside click (494ms)
  ✓  183 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/privacy-policy — shell carries the §5 banner and placeholders only (295ms)
  ✓  184 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/terms-of-service — shell carries the §5 banner and placeholders only (302ms)
  ✓  185 [mobile-390] › tests/phase-3.spec.ts:261:7 › Z Best Clips — shared scaffolding › /legal/cookie-policy — shell carries the §5 banner and placeholders only (291ms)
  ✓  186 [mobile-390] › tests/phase-3.spec.ts:303:5 › Z Best Clips — shared scaffolding › 404 returns 404, is noindex, and offers a way home (329ms)
  ✓  187 [mobile-390] › tests/phase-3.spec.ts:318:5 › Z Best Clips — shared scaffolding › sitemap.xml lists only built, indexable pages on the canonical host (698ms)
  ✓  188 [mobile-390] › tests/phase-3.spec.ts:347:5 › Z Best Clips — shared scaffolding › robots.txt allows crawling, points at the sitemap, names no hidden route (171ms)
  ✓  189 [mobile-390] › tests/phase-3.spec.ts:360:5 › Z Best Clips — shared scaffolding › metadata defaults: canonical, Open Graph and Twitter on the canonical host (542ms)
  ✓  190 [mobile-390] › tests/phase-3.spec.ts:387:5 › Z Best Clips — shared scaffolding › OG image renders on the brand base color at 1200×630 (216ms)
  ✓  191 [mobile-390] › tests/phase-3.spec.ts:415:5 › Z Best Clips — shared scaffolding › Cookie Settings reopens a consent choice already made (472ms)
  ✓  192 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › entertainment page focus carries through page accent, nav, CTA, card edge and banner (548ms)
  ✓  193 [mobile-390] › tests/phase-3.spec.ts:451:5 › Z Best Clips — Entertainment/Brands color-coded system › brands page focus carries through page accent, nav, CTA, card edge and banner (528ms)
  ✓  194 [mobile-390] › tests/phase-3.spec.ts:491:3 › Z Best Clips — Entertainment/Brands color-coded system › a page without a focus keeps the documented default and does not inherit one (343ms)
  ✓  195 [mobile-390] › tests/phase-3.spec.ts:504:3 › Z Best Clips — Entertainment/Brands color-coded system › Z Best Media ignores data-page-focus (268ms)
  -  196 [mobile-390] › tests/phase-3.spec.ts:516:1 › OG literals match the brand tokens
  ✓  197 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › / › renders, carries its metadata, holds the site rules, and is captured (730ms)
  ✓  198 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /entertainment › renders, carries its metadata, holds the site rules, and is captured (377ms)
  ✓  199 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /brands › renders, carries its metadata, holds the site rules, and is captured (361ms)
  ✓  200 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /pricing › renders, carries its metadata, holds the site rules, and is captured (356ms)
  ✓  201 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /become-a-clipper › renders, carries its metadata, holds the site rules, and is captured (473ms)
  ✓  202 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /launch-a-campaign › renders, carries its metadata, holds the site rules, and is captured (412ms)
  ✓  203 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /about › renders, carries its metadata, holds the site rules, and is captured (370ms)
  ✓  204 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /media-kit › renders, carries its metadata, holds the site rules, and is captured (398ms)
  ✓  205 [mobile-390] › tests/phase-4-zbc.spec.ts:111:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (349ms)
  ✓  206 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › / — every same-site link resolves (263ms)
  ✓  207 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /entertainment — every same-site link resolves (250ms)
  ✓  208 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /brands — every same-site link resolves (242ms)
  ✓  209 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /pricing — every same-site link resolves (229ms)
  ✓  210 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /become-a-clipper — every same-site link resolves (228ms)
  ✓  211 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /launch-a-campaign — every same-site link resolves (236ms)
  ✓  212 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /about — every same-site link resolves (220ms)
  ✓  213 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /media-kit — every same-site link resolves (227ms)
  ✓  214 [mobile-390] › tests/phase-4-zbc.spec.ts:185:3 › /faq — every same-site link resolves (228ms)
  ✓  215 [mobile-390] › tests/phase-4-zbc.spec.ts:202:3 › How It Works (§B4, served at /) › /how-it-works redirects permanently to / (131ms)
  ✓  216 [mobile-390] › tests/phase-4-zbc.spec.ts:208:3 › How It Works (§B4, served at /) › the process runs on the timeline: horizontal at 1440, vertical at 390 (262ms)
  ✓  217 [mobile-390] › tests/phase-4-zbc.spec.ts:231:3 › How It Works (§B4, served at /) › the two models carry their own focus colors (245ms)
  ✓  218 [mobile-390] › tests/phase-4-zbc.spec.ts:239:3 › How It Works (§B4, served at /) › three illustrative example cards: badged, accented, and exactly the §B4 figures (289ms)
  ✓  219 [mobile-390] › tests/phase-4-zbc.spec.ts:263:3 › How It Works (§B4, served at /) › view counters tick once on entry, and not at all with reduced motion (1.6s)
  ✓  220 [mobile-390] › tests/phase-4-zbc.spec.ts:275:3 › Pricing (§B4) › five client levers, bundled, and no clipper payout split (217ms)
  ✓  221 [mobile-390] › tests/phase-4-zbc.spec.ts:290:3 › Become a Clipper (§B4) › five steps, both payout models in their focus colors, and the disclosed starting rates (250ms)
  ✓  222 [mobile-390] › tests/phase-4-zbc.spec.ts:307:3 › Become a Clipper (§B4) › Browse Active Campaigns opens the labeled waitlist form, which posts to the stub (404ms)
  ✓  223 [mobile-390] › tests/phase-4-zbc.spec.ts:346:3 › Launch a Campaign (§B4) › keeps the honesty note word for word (196ms)
  ✓  224 [mobile-390] › tests/phase-4-zbc.spec.ts:353:3 › Launch a Campaign (§B4) › four steps, both ways to start, and a form with the §6.1 fields posting to the stub (367ms)
  ✓  225 [mobile-390] › tests/phase-4-zbc.spec.ts:389:3 › Lead route stub (§6.2, ZBC) › rejects ZBM's form names and unknown focus or platform values (136ms)
  ✓  226 [mobile-390] › tests/phase-4-zbc.spec.ts:407:3 › Lead route stub (§6.2, ZBC) › valid submissions and a filled honeypot are acknowledged as a stub (129ms)
  ✓  227 [mobile-390] › tests/phase-4-zbc.spec.ts:421:3 › About (§B4) › company voice only: no name, no figures, both CTAs (206ms)
  ✓  228 [mobile-390] › tests/phase-4-zbc.spec.ts:434:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › no founding-year claim survives on any ZBC page or the shared dev gallery (616ms)
  ✓  229 [mobile-390] › tests/phase-4-zbc.spec.ts:445:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › clip volume says dozens everywhere, never hundreds (606ms)
  ✓  230 [mobile-390] › tests/phase-4-zbc.spec.ts:457:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee (316ms)
  ✓  231 [mobile-390] › tests/phase-4-zbc.spec.ts:474:3 › Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17) › ZBC does not position against agencies, and drops the unsupported 'proven' (283ms)
  ✓  232 [mobile-390] › tests/phase-4-zbc.spec.ts:492:3 › Media Kit (§B4) › facts as ledger rows, assets on request, press address a labeled non-link placeholder (225ms)
  ✓  233 [mobile-390] › tests/phase-4-zbc.spec.ts:510:3 › FAQ (§B4) › all ten questions, operable, and no payout rates (240ms)
  ✓  234 [mobile-390] › tests/phase-4-zbc.spec.ts:523:3 › Site-wide (ZBC chunk) › clipper payout rates appear on Become a Clipper and nowhere else (143ms)
  ✓  235 [mobile-390] › tests/phase-4-zbc.spec.ts:531:3 › Site-wide (ZBC chunk) › sitemap lists exactly the nine built public pages; /how-it-works is not a second URL (133ms)
  ✓  236 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (412ms)
  ✓  237 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (369ms)
  ✓  238 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (621ms)
  ✓  239 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (345ms)
  ✓  240 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓  241 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (295ms)
  ✓  242 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (321ms)
  ✓  243 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (457ms)
  ✓  244 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (270ms)
  ✓  245 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (242ms)
  ✓  246 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (255ms)
  ✓  247 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (230ms)
  ✓  248 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (213ms)
  ✓  249 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (226ms)
  ✓  250 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (215ms)
  ✓  251 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (227ms)
  ✓  252 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (237ms)
  ✓  253 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (232ms)
  ✓  254 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (264ms)
  ✓  255 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (280ms)
  ✓  256 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (235ms)
  ✓  257 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (505ms)
  ✓  258 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (183ms)
  ✓  259 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (233ms)
  ✓  260 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (240ms)
  ✓  261 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (227ms)
  ✓  262 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (251ms)
  ✓  263 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (289ms)
  ✓  264 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (714ms)
  ✓  265 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (124ms)
  ✓  266 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (128ms)
  ✓  267 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (134ms)
  ✓  268 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (125ms)
  ✓  269 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (226ms)
  ✓  270 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (211ms)
  ✓  271 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (293ms)
  ✓  272 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (621ms)
  ✓  273 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (232ms)
  ✓  274 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (214ms)
  ✓  275 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (207ms)
  ✓  276 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (224ms)
  ✓  277 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (217ms)
  ✓  278 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (151ms)
  ✓  279 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (415ms)
  ✓  280 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (201ms)
  ✓  281 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (666ms)
  ✓  282 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  283 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (251ms)
  ✓  284 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (216ms)
  ✓  285 [mobile-390] › tests/phase-5.spec.ts:139:3 › Free assessment — the rule (§11.4) and its copy (C2) › C2: every category's rationale and remediation equal the published Leak Library, character for character (149ms)
  ✓  286 [mobile-390] › tests/phase-5.spec.ts:150:3 › Free assessment — the rule (§11.4) and its copy (C2) › all answers 'Not true' is insufficient_signal — no category is invented (130ms)
  ✓  287 [mobile-390] › tests/phase-5.spec.ts:163:3 › Free assessment — the rule (§11.4) and its copy (C2) › the approved priority order decides every tie, all the way down (151ms)
  ✓  288 [mobile-390] › tests/phase-5.spec.ts:173:3 › Free assessment — the rule (§11.4) and its copy (C2) › the highest score wins before priority is consulted (141ms)
  ✓  289 [mobile-390] › tests/phase-5.spec.ts:184:3 › Free assessment — the rule (§11.4) and its copy (C2) › deterministic: the same answers return the same outcome and the same rule-set hash (130ms)
  ✓  290 [mobile-390] › tests/phase-5.spec.ts:192:3 › Free assessment — the rule (§11.4) and its copy (C2) › no free result carries a dollar figure, a currency or an estimate (132ms)
  ✓  291 [mobile-390] › tests/phase-5.spec.ts:202:3 › Free assessment — one schema, both sides (§11.3) › the stub rejects every malformed answer set, field by field, and stays a stub (133ms)
  ✓  292 [mobile-390] › tests/phase-5.spec.ts:221:3 › Free assessment — one schema, both sides (§11.3) › a superseded rule-set version is refused with a typed error, never scored (130ms)
  ✓  293 [mobile-390] › tests/phase-5.spec.ts:230:3 › Free assessment — one schema, both sides (§11.3) › a request without its envelope is malformed, not a form to correct (130ms)
  ✓  294 [mobile-390] › tests/phase-5.spec.ts:236:3 › Free assessment — the form and its result (§11.3, §11.5) › renders the eight approved questions, in order, each on the approved scale (515ms)
  ✓  295 [mobile-390] › tests/phase-5.spec.ts:257:3 › Free assessment — the form and its result (§11.3, §11.5) › validates with the shared schema before sending — nothing reaches the stub (382ms)
  ✓  296 [mobile-390] › tests/phase-5.spec.ts:271:3 › Free assessment — the form and its result (§11.3, §11.5) › a leak: the leak, the because template, the fix, and both next steps (740ms)
  ✓  297 [mobile-390] › tests/phase-5.spec.ts:298:3 › Free assessment — the form and its result (§11.3, §11.5) › a tie says the order decided it (591ms)
  ✓  298 [mobile-390] › tests/phase-5.spec.ts:310:3 › Free assessment — the form and its result (§11.3, §11.5) › insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us (692ms)

  1 skipped
  297 passed (1.5m)
```

### 04-lint (run 2)
```

> zbest-sites@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites
> turbo run lint

• turbo 2.10.13

   • Packages in scope: @zbest/config, @zbest/ui, @zbest/zbc, @zbest/zbm, e2e
   • Running lint in 5 packages
   • Remote caching disabled

@zbest/zbc:lint: cache miss, executing 98cb0571a22c1da9
@zbest/config:lint: cache miss, executing 13d37fa40ab8ef33
e2e:lint: cache miss, executing fa8968879e1b343f
@zbest/zbm:lint: cache miss, executing 13d2510ab667471b
@zbest/ui:lint: cache miss, executing a7535a17ff5ec719
@zbest/ui:lint: 
@zbest/ui:lint: > @zbest/ui@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/ui
@zbest/ui:lint: > eslint .
@zbest/ui:lint: 
@zbest/config:lint: 
@zbest/config:lint: > @zbest/config@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/packages/config
@zbest/config:lint: > eslint .
@zbest/config:lint: 
e2e:lint: 
e2e:lint: > e2e@0.1.0 lint /Users/andrelove/WebstormProjects/zbest-sites/e2e
e2e:lint: > eslint .
e2e:lint: 
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
  Time:    2.048s 

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
$ git diff --name-status 2758bfb..b67f62f -- e2e/snapshots/
M	e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
M	e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png
A	e2e/snapshots/phase-5/zbm-visibility-gaps-desktop-1440.png
A	e2e/snapshots/phase-5/zbm-visibility-gaps-mobile-390.png

$ git status --porcelain e2e/snapshots/
[empty output]
```

Two new element captures of the library, and the Search Intelligence full page in the Phase 4
suite at both viewports. No other capture moved. After both gate runs the snapshot tree is clean,
so every capture reproduced byte-identical at the commit.

### Zip, checked against the committed blobs
```
$ unzip -l docs/phase-5-visibility-captures.zip
Archive:  docs/phase-5-visibility-captures.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
   189794  09-18-2026 11:22   zbm-visibility-gaps-desktop-1440.png
   634683  09-18-2026 11:23   zbm-visibility-gaps-mobile-390.png
   645973  09-18-2026 11:22   zbm-search-intelligence-desktop-1440.png
  2188631  09-18-2026 11:23   zbm-search-intelligence-mobile-390.png
---------                     -------
  3659081                     4 files
$ shasum -a 256 docs/phase-5-visibility-captures.zip
bc9f6876716944313875e7fc792578d970c04a0365c45486bac5ccd6c50ae05a  docs/phase-5-visibility-captures.zip
$ T=$(mktemp -d); unzip -q docs/phase-5-visibility-captures.zip -d $T; for f in $T/*.png; do n=$(basename $f); p=$(git ls-files e2e/snapshots | grep "/$n$"); [ "$(shasum -a 256 $f | cut -d' ' -f1)" = "$(git show b67f62f:$p | shasum -a 256 | cut -d' ' -f1)" ] && echo "equal    $p" || echo "DIFFERS  $p"; done; rm -rf $T
equal    e2e/snapshots/phase-4-zbm/zbm-search-intelligence-desktop-1440.png
equal    e2e/snapshots/phase-4-zbm/zbm-search-intelligence-mobile-390.png
equal    e2e/snapshots/phase-5/zbm-visibility-gaps-desktop-1440.png
equal    e2e/snapshots/phase-5/zbm-visibility-gaps-mobile-390.png
```

## Mutations — six, each applied alone against `b67f62f`, then reverted

```
VM1 applied
VM1 exit=1 failed=2 webServerFailed=0
VM2 applied
VM2 exit=1 failed=4 webServerFailed=0
VM3 applied
VM3 exit=1 failed=4 webServerFailed=0
VM4 applied
VM4 exit=1 failed=2 webServerFailed=0
VM5 applied
VM5 exit=1 failed=4 webServerFailed=0
VM6 applied
VM6 exit=1 failed=4 webServerFailed=0
restored, modified files: 0
DONE
```

| # | Mutation | Caught by | Assertion |
|---|---|---|---|
| VM1 | a library fix hand-edited away from the certified §12.4 text | renders all eight gaps exactly as the certified spec states them, in order | `Error: brand_citations fix` |
| VM2 | a retired CTA label returns on the hero button | no ZBM page carries a retired string, hidden FAQ panels included; no button names a check that does not exist yet;  Talk to Us leads | `Error: /search-intelligence carries a retired string` |
| VM3 | the false FAQ line returns, INSIDE a collapsed (hidden) FAQ answer | no ZBM page carries a retired string, hidden FAQ panels included; the free-trial FAQ answer is rewritten to what is true today | `Error: /search-intelligence carries a retired string` |
| VM4 | the retired promise returns as visible copy | no ZBM page carries a retired string, hidden FAQ panels included | `Error: /search-intelligence carries a retired string` |
| VM5 | "leak" enters the library | renders all eight gaps exactly as the certified spec states them, in order; says 'gap', never 'leak', and uses curly apostrophes only (§12.1) | `Error: expect(locator).toHaveText(expected) failed` |
| VM6 | a straight apostrophe enters the library | renders all eight gaps exactly as the certified spec states them, in order; says 'gap', never 'leak', and uses curly apostrophes only (§12.1) | `Error: structured_data description` |

**VM3 is the one that matters most.** It puts the false "available now" line back inside a

COLLAPSED FAQ answer, which stays in the DOM but `hidden`. The C3 test catches it (`/search-intelligence

carries a retired string`) because it reads `textContent`, not `innerText`. A check on innerText would

have passed VM3.


#### VM1
```
=== VM1 diff ===
 apps/zbm/content/visibility-gaps.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (284ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (235ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (411ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (212ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (189ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (199ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (273ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (155ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (113ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (127ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (110ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (102ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (104ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (106ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (122ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (110ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (153ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (146ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (116ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (391ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (67ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (104ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (117ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (112ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (133ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (171ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (568ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (35ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (33ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (33ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (100ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (86ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (194ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (429ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (93ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (90ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (87ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (102ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (109ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (57ms)
  ✘  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.2s)
  ✓  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (117ms)
  ✓  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (508ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (159ms)
  ✓  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (107ms)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (510ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (377ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (632ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (349ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (293ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (320ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (467ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (259ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (235ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (247ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (207ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (207ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (211ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (206ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (222ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (235ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (231ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (251ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (265ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (231ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (627ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (176ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (223ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (239ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (226ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (250ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (285ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (713ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (130ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (126ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (130ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (134ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (207ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (197ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (294ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (607ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (221ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (205ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (234ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (230ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (215ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (152ms)
  ✘  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.3s)
  ✓  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (284ms)
  ✓  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (680ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (1ms)
  ✓  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (256ms)
  ✓  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (214ms)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: brand_citations fix

    expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('li').nth(6).locator('dd')
    Expected: "Earn mentions on credible local and industry websites."
    Received: "Earn more mentions online."
    Timeout:  5000ms

    Call log:
      - brand_citations fix locator('#visibility-gaps').locator('li').nth(6).locator('dd') with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('li').nth(6).locator('dd')
        14 × locator resolved to <dd class="type-small text-text-primary">Earn more mentions online.</dd>
           - unexpected value "Earn more mentions online."


      79 |       await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
      80 |       await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
    > 81 |       await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
         |                                                         ^
      82 |     }
      83 |
      84 |     await mkdir(SNAPSHOT_DIR, { recursive: true });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:81:57

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: brand_citations fix

    expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('li').nth(6).locator('dd')
    Expected: "Earn mentions on credible local and industry websites."
    Received: "Earn more mentions online."
    Timeout:  5000ms

    Call log:
      - brand_citations fix locator('#visibility-gaps').locator('li').nth(6).locator('dd') with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('li').nth(6).locator('dd')
        14 × locator resolved to <dd class="type-small text-text-primary">Earn more mentions online.</dd>
           - unexpected value "Earn more mentions online."


      79 |       await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
      80 |       await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
    > 81 |       await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
         |                                                         ^
      82 |     }
      83 |
      84 |     await mkdir(SNAPSHOT_DIR, { recursive: true });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:81:57

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
    [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
  96 passed (41.4s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### VM2
```
=== VM2 diff ===
 apps/zbm/app/search-intelligence/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (264ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (237ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (403ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (211ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (192ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (190ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (269ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (144ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (125ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (129ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (109ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (104ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (106ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (110ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (106ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (131ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (121ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (144ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (145ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (115ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (514ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (70ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (105ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (122ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (118ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (195ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (582ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (34ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (36ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (35ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (120ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (89ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (192ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (417ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (98ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (89ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (87ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (120ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (108ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (54ms)
  ✓  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (269ms)
  ✓  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (87ms)
  ✘  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (448ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (3ms)
  ✓  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (171ms)
  ✘  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (5.1s)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (511ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (382ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (633ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (340ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (281ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (291ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (321ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (465ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (253ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (231ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (250ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (211ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (207ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (218ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (208ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (219ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (235ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (229ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (256ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (267ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (233ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (644ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (169ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (227ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (234ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (225ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (249ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (288ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (716ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (130ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (132ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (130ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (128ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (210ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (201ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (279ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (584ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (206ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (207ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (202ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (221ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (221ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (151ms)
  ✓  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (397ms)
  ✓  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (201ms)
  ✘  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (568ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (2ms)
  ✓  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (347ms)
  ✘  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (5.2s)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "Free Visibility Check"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('main').getByRole('link', { name: /visibility (readiness )?check/i })
    Expected: 0
    Received: 1
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('main').getByRole('link', { name: /visibility (readiness )?check/i }) with timeout 5000ms
      - waiting for locator('main').getByRole('link', { name: /visibility (readiness )?check/i })
        14 × locator resolved to 1 element
           - unexpected value "1"


      138 |   test("no button names a check that does not exist yet; Talk to Us leads", async ({ page }) => {
      139 |     await visit(page, "/search-intelligence");
    > 140 |     await expect(page.locator("main").getByRole("link", { name: /visibility (readiness )?check/i })).toHaveCount(0);
          |                                                                                                      ^
      141 |     const heroLink = page.locator("main header").getByRole("link").first();
      142 |     await expect(heroLink).toHaveText("Talk to Us");
      143 |     await expect(heroLink).toHaveAttribute("href", "/contact");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:140:102

    Error Context: test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "Free Visibility Check"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('main').getByRole('link', { name: /visibility (readiness )?check/i })
    Expected: 0
    Received: 1
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('main').getByRole('link', { name: /visibility (readiness )?check/i }) with timeout 5000ms
      - waiting for locator('main').getByRole('link', { name: /visibility (readiness )?check/i })
        14 × locator resolved to 1 element
           - unexpected value "1"


      138 |   test("no button names a check that does not exist yet; Talk to Us leads", async ({ page }) => {
      139 |     await visit(page, "/search-intelligence");
    > 140 |     await expect(page.locator("main").getByRole("link", { name: /visibility (readiness )?check/i })).toHaveCount(0);
          |                                                                                                      ^
      141 |     const heroLink = page.locator("main header").getByRole("link").first();
      142 |     await expect(heroLink).toHaveText("Talk to Us");
      143 |     await expect(heroLink).toHaveAttribute("href", "/contact");
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:140:102

    Error Context: test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-74ebb--exist-yet-Talk-to-Us-leads-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
    [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads 
    [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
    [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads 
  94 passed (41.7s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### VM3
```
=== VM3 diff ===
 apps/zbm/app/search-intelligence/page.tsx | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (277ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (236ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (407ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (216ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (194ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (187ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (290ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (144ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (135ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (126ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (105ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (106ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (106ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (106ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (105ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (123ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (120ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (142ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (150ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (113ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (396ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (68ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (106ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (122ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (111ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (133ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (188ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (552ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (37ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (33ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (38ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (99ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (91ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (196ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (419ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (111ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (89ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (90ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (117ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (98ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (55ms)
  ✓  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (271ms)
  ✓  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (88ms)
  ✘  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (414ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (2ms)
  ✘  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (5.2s)
  ✓  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (118ms)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (513ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (377ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (627ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (356ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (300ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (291ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (327ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (462ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (256ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (240ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (244ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (206ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (204ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (201ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (207ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (221ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (248ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (227ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (252ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (270ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (232ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (619ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (178ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (221ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (236ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (223ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (255ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (279ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (763ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (137ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (132ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (136ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (133ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (213ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (201ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (268ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (599ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (222ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (195ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (205ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (210ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (225ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (152ms)
  ✓  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (393ms)
  ✓  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (205ms)
  ✘  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (592ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (3ms)
  ✘  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (5.4s)
  ✓  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (294ms)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "free AI Visibility Check"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#_R_1atbsnnb_-panel-8')
    Expected: "Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live."
    Received: "Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#_R_1atbsnnb_-panel-8') with timeout 5000ms
      - waiting for locator('#_R_1atbsnnb_-panel-8')
        14 × locator resolved to <div role="region" class="pb-ledger" id="_R_1atbsnnb_-panel-8" aria-labelledby="_R_1atbsnnb_-button-8">…</div>
           - unexpected value "Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live."


      133 |     await question.click();
      134 |     const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);
    > 135 |     await expect(panel).toHaveText("Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.");
          |                         ^
      136 |   });
      137 |
      138 |   test("no button names a check that does not exist yet; Talk to Us leads", async ({ page }) => {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:135:25

    Error Context: test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "free AI Visibility Check"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#_R_1atbsnnb_-panel-8')
    Expected: "Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live."
    Received: "Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live."
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#_R_1atbsnnb_-panel-8') with timeout 5000ms
      - waiting for locator('#_R_1atbsnnb_-panel-8')
        14 × locator resolved to <div role="region" class="pb-ledger" id="_R_1atbsnnb_-panel-8" aria-labelledby="_R_1atbsnnb_-button-8">…</div>
           - unexpected value "Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live."


      133 |     await question.click();
      134 |     const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);
    > 135 |     await expect(panel).toHaveText("Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.");
          |                         ^
      136 |   });
      137 |
      138 |   test("no button names a check that does not exist yet; Talk to Us leads", async ({ page }) => {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:135:25

    Error Context: test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-b6b7c-itten-to-what-is-true-today-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
    [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today 
    [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
    [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today 
  94 passed (42.5s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### VM4
```
=== VM4 diff ===
 apps/zbm/app/search-intelligence/page.tsx | 3 +++
 1 file changed, 3 insertions(+)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (278ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (240ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (402ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (212ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (190ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (201ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (275ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (146ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (121ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (135ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (102ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (105ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (104ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (101ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (117ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (134ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (132ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (152ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (155ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (122ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (393ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (64ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (102ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (127ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (110ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (135ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (192ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (583ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (39ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (34ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (34ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (97ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (82ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (192ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (395ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (103ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (84ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (89ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (107ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (100ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (55ms)
  ✓  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (266ms)
  ✓  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (87ms)
  ✘  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (447ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (3ms)
  ✓  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (180ms)
  ✓  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (106ms)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (511ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (369ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (633ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (342ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (286ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (321ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (474ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (258ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (232ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (246ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (209ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (230ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (205ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (205ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (221ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (236ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (228ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (249ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (273ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (233ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (612ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (178ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (223ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (239ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (221ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (254ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (288ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (708ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (135ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (132ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (137ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (131ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (211ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (197ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (288ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (602ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (214ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (204ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (203ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (224ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (213ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (149ms)
  ✓  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (392ms)
  ✓  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (207ms)
  ✘  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (576ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (2ms)
  ✓  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (342ms)
  ✓  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (237ms)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "whether and how your business currently shows up"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 

    Error: /search-intelligence carries a retired string

    expect(received).toBeNull()

    Received: "whether and how your business currently shows up"

      110 |       // `hidden`, and innerText would not see them.
      111 |       const text = (await page.locator("main").textContent()) ?? "";
    > 112 |       expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
          |                                                                                     ^
      113 |     }
      114 |   });
      115 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:112:85

    Error Context: test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Retirem-639be--hidden-FAQ-panels-included-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
    [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included 
  96 passed (31.5s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### VM5
```
=== VM5 diff ===
 apps/zbm/content/visibility-gaps.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (279ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (238ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (408ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (247ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (191ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (197ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (204ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (280ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (149ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (122ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (130ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (101ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (109ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (100ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (99ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (113ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (123ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (111ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (140ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (157ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (113ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (393ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (102ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (114ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (118ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (116ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (132ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (193ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (569ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (35ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (32ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (36ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (32ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (98ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (93ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (195ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (401ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (100ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (97ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (88ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (120ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (99ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (61ms)
  ✘  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.1s)
  ✘  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (140ms)
  ✓  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (530ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (1ms)
  ✓  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (138ms)
  ✓  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (103ms)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (518ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (377ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (637ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (374ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (284ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (295ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (329ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (478ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (257ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (231ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (246ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (212ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (207ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (209ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (206ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (224ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (240ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (230ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (248ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (273ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (231ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (629ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (183ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (224ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (241ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (221ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (252ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (280ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (704ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (128ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (126ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (127ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (129ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (208ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (202ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (287ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (605ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (209ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (196ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (200ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (217ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (217ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (149ms)
  ✘  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.2s)
  ✘  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (314ms)
  ✓  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (784ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (274ms)
  ✓  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (222ms)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('.type-label').first()
    Expected: "Visibility Gap Library"
    Received: "Visibility Leak Library"
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#visibility-gaps').locator('.type-label').first() with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('.type-label').first()
        14 × locator resolved to <p class="type-label text-text-secondary">Visibility Leak Library</p>
           - unexpected value "Visibility Leak Library"


      71 |     await visit(page, "/search-intelligence#visibility-gaps");
      72 |     const section = page.locator("#visibility-gaps");
    > 73 |     await expect(section.locator(".type-label").first()).toHaveText("Visibility Gap Library");
         |                                                          ^
      74 |     const rows = section.locator("li");
      75 |     await expect(rows).toHaveCount(8);
      76 |     for (const [i, gap] of library.entries()) {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:73:58

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /leak/i
    Received string:      "Visibility Leak LibraryEight visibility gaps, and what fixing each one looks like.Business Profile GapThe basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search.Fix directionClaim your business profile on maps and in search, complete every field, and keep it current.Entity Consistency GapYour business name, address, phone number or description reads differently from one place to the next.Fix directionUse one exact name, address, phone number and description everywhere your business appears.Reviews GapYou have few recent reviews, or the reviews you get go unanswered.Fix directionAsk every satisfied customer for a review, and respond to the reviews you receive.Crawlability GapAutomated crawlers may not be able to reach or read the pages that matter most on your site.Fix directionCheck your site’s crawler rules and sitemap so your key pages can be reached and read.Structured Data GapYour website doesn’t label its key facts in a machine-readable way.Fix directionAdd structured data for your business, your services and your most-asked questions.Answer Content GapYour website doesn’t directly answer the questions customers actually ask.Fix directionPublish clear, specific answers to the questions your customers ask most.Brand Citations GapFew other credible websites mention or link to your business.Fix directionEarn mentions on credible local and industry websites.Local Listings GapYour business is missing from the directories and map apps beyond your business profile on maps and in search.Fix directionGet listed in the directories and map apps that matter for your area and industry."

       98 |     await visit(page, "/search-intelligence");
       99 |     const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
    > 100 |     expect(text).not.toMatch(/leak/i);
          |                      ^
      101 |     expect(text).not.toContain("'");
      102 |   });
      103 | });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:100:22

    Error Context: test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('.type-label').first()
    Expected: "Visibility Gap Library"
    Received: "Visibility Leak Library"
    Timeout:  5000ms

    Call log:
      - Expect "toHaveText" locator('#visibility-gaps').locator('.type-label').first() with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('.type-label').first()
        14 × locator resolved to <p class="type-label text-text-secondary">Visibility Leak Library</p>
           - unexpected value "Visibility Leak Library"


      71 |     await visit(page, "/search-intelligence#visibility-gaps");
      72 |     const section = page.locator("#visibility-gaps");
    > 73 |     await expect(section.locator(".type-label").first()).toHaveText("Visibility Gap Library");
         |                                                          ^
      74 |     const rows = section.locator("li");
      75 |     await expect(rows).toHaveCount(8);
      76 |     for (const [i, gap] of library.entries()) {
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:73:58

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 

    Error: expect(received).not.toMatch(expected)

    Expected pattern: not /leak/i
    Received string:      "Visibility Leak LibraryEight visibility gaps, and what fixing each one looks like.Business Profile GapThe basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search.Fix directionClaim your business profile on maps and in search, complete every field, and keep it current.Entity Consistency GapYour business name, address, phone number or description reads differently from one place to the next.Fix directionUse one exact name, address, phone number and description everywhere your business appears.Reviews GapYou have few recent reviews, or the reviews you get go unanswered.Fix directionAsk every satisfied customer for a review, and respond to the reviews you receive.Crawlability GapAutomated crawlers may not be able to reach or read the pages that matter most on your site.Fix directionCheck your site’s crawler rules and sitemap so your key pages can be reached and read.Structured Data GapYour website doesn’t label its key facts in a machine-readable way.Fix directionAdd structured data for your business, your services and your most-asked questions.Answer Content GapYour website doesn’t directly answer the questions customers actually ask.Fix directionPublish clear, specific answers to the questions your customers ask most.Brand Citations GapFew other credible websites mention or link to your business.Fix directionEarn mentions on credible local and industry websites.Local Listings GapYour business is missing from the directories and map apps beyond your business profile on maps and in search.Fix directionGet listed in the directories and map apps that matter for your area and industry."

       98 |     await visit(page, "/search-intelligence");
       99 |     const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
    > 100 |     expect(text).not.toMatch(/leak/i);
          |                      ^
      101 |     expect(text).not.toContain("'");
      102 |   });
      103 | });
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:100:22

    Error Context: test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
    [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 
    [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
    [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 
  94 passed (42.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### VM6
```
=== VM6 diff ===
 apps/zbm/content/visibility-gaps.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)


  ⚠  Gate running against a DIRTY tree — screenshots will not match b67f62f.


Running 98 tests using 1 worker

  ✓   1 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (278ms)
  ✓   2 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (236ms)
  ✓   3 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (414ms)
  ✓   4 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (213ms)
  ✓   5 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (188ms)
  ✓   6 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (193ms)
  ✓   7 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (203ms)
  ✓   8 [desktop-1440] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (274ms)
  ✓   9 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (169ms)
  ✓  10 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (127ms)
  ✓  11 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (137ms)
  ✓  12 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (110ms)
  ✓  13 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (107ms)
  ✓  14 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (103ms)
  ✓  15 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (107ms)
  ✓  16 [desktop-1440] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (136ms)
  ✓  17 [desktop-1440] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (146ms)
  ✓  18 [desktop-1440] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (122ms)
  ✓  19 [desktop-1440] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (139ms)
  ✓  20 [desktop-1440] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (152ms)
  ✓  21 [desktop-1440] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (118ms)
  ✓  22 [desktop-1440] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (409ms)
  ✓  23 [desktop-1440] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (67ms)
  ✓  24 [desktop-1440] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (121ms)
  ✓  25 [desktop-1440] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (124ms)
  ✓  26 [desktop-1440] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (115ms)
  ✓  27 [desktop-1440] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (131ms)
  ✓  28 [desktop-1440] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (195ms)
  ✓  29 [desktop-1440] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (587ms)
  ✓  30 [desktop-1440] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (37ms)
  ✓  31 [desktop-1440] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (36ms)
  ✓  32 [desktop-1440] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (38ms)
  ✓  33 [desktop-1440] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (34ms)
  ✓  34 [desktop-1440] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (109ms)
  ✓  35 [desktop-1440] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (85ms)
  ✓  36 [desktop-1440] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (198ms)
  ✓  37 [desktop-1440] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (426ms)
  ✓  38 [desktop-1440] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (101ms)
  ✓  39 [desktop-1440] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (87ms)
  ✓  40 [desktop-1440] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (94ms)
  ✓  41 [desktop-1440] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (134ms)
  ✓  42 [desktop-1440] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (110ms)
  ✓  43 [desktop-1440] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (60ms)
  ✘  44 [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.2s)
  ✘  45 [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (146ms)
  ✓  46 [desktop-1440] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (533ms)
  ✓  47 [desktop-1440] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (1ms)
  ✓  48 [desktop-1440] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (163ms)
  ✓  49 [desktop-1440] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (107ms)
  ✓  50 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › / › renders, carries its metadata, holds the site rules, and is captured (524ms)
  ✓  51 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /digital-advertising › renders, carries its metadata, holds the site rules, and is captured (399ms)
  ✓  52 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /revenue-recovery › renders, carries its metadata, holds the site rules, and is captured (652ms)
  ✓  53 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /out-of-home › renders, carries its metadata, holds the site rules, and is captured (360ms)
  ✓  54 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /about › renders, carries its metadata, holds the site rules, and is captured (291ms)
  ✓  55 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /contact › renders, carries its metadata, holds the site rules, and is captured (307ms)
  ✓  56 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /faq › renders, carries its metadata, holds the site rules, and is captured (334ms)
  ✓  57 [mobile-390] › tests/phase-4-zbm.spec.ts:92:5 › /search-intelligence › renders, carries its metadata, holds the site rules, and is captured (477ms)
  ✓  58 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › / — every same-site link resolves (328ms)
  ✓  59 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /digital-advertising — every same-site link resolves (243ms)
  ✓  60 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /revenue-recovery — every same-site link resolves (253ms)
  ✓  61 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /out-of-home — every same-site link resolves (254ms)
  ✓  62 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /about — every same-site link resolves (248ms)
  ✓  63 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /contact — every same-site link resolves (222ms)
  ✓  64 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /faq — every same-site link resolves (216ms)
  ✓  65 [mobile-390] › tests/phase-4-zbm.spec.ts:176:3 › /search-intelligence — every same-site link resolves (230ms)
  ✓  66 [mobile-390] › tests/phase-4-zbm.spec.ts:203:3 › Home (§A4) › hero stat block shows non-outcome facts only, no counter claim (249ms)
  ✓  67 [mobile-390] › tests/phase-4-zbm.spec.ts:222:3 › Home (§A4) › How we work carries one process, capitalized, promising only priority and confidence (236ms)
  ✓  68 [mobile-390] › tests/phase-4-zbm.spec.ts:235:3 › Home (§A4) › four disciplines link to their pages; See What We Do anchors to them (264ms)
  ✓  69 [mobile-390] › tests/phase-4-zbm.spec.ts:250:3 › Home (§A4) › featured Revenue Recovery carries the six leaks, the decision-10 assessment CTA and its fixture label (278ms)
  ✓  70 [mobile-390] › tests/phase-4-zbm.spec.ts:269:3 › Home (§A4) › How we work carries no case study cards (246ms)
  ✓  71 [mobile-390] › tests/phase-4-zbm.spec.ts:276:3 › Home (§A4) › the scroll-scrubbed hero moves with scroll, and not at all with reduced motion (654ms)
  ✓  72 [mobile-390] › tests/phase-4-zbm.spec.ts:296:3 › Digital Advertising (§A4) › certifications block is not rendered — not merely hidden (188ms)
  ✓  73 [mobile-390] › tests/phase-4-zbm.spec.ts:303:3 › Digital Advertising (§A4) › pricing, audience and FAQ as written (239ms)
  ✓  74 [mobile-390] › tests/phase-4-zbm.spec.ts:315:3 › Revenue Recovery (§A4, filtered live carry-over) › carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison (245ms)
  ✓  75 [mobile-390] › tests/phase-4-zbm.spec.ts:354:3 › Revenue Recovery (§A4, filtered live carry-over) › filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims (238ms)
  ✓  76 [mobile-390] › tests/phase-4-zbm.spec.ts:368:3 › Revenue Recovery (§A4, filtered live carry-over) › every engagement phase has a body; Phase 1 says exactly the approved line (audit F8) (263ms)
  ✓  77 [mobile-390] › tests/phase-4-zbm.spec.ts:378:3 › Revenue Recovery (§A4, filtered live carry-over) › FAQ restores 'How does the process start?' around decision 10, and keeps the Sep 17 withdrawals (299ms)
  ✓  78 [mobile-390] › tests/phase-4-zbm.spec.ts:391:3 › Revenue Recovery (§A4, filtered live carry-over) › assessment form: fixture-labeled, stub-marked, validates, and never claims delivery (770ms)
  ✓  79 [mobile-390] › tests/phase-4-zbm.spec.ts:435:3 › Lead route stub (§6.2) › valid contact submission is acknowledged as a stub (132ms)
  ✓  80 [mobile-390] › tests/phase-4-zbm.spec.ts:446:3 › Lead route stub (§6.2) › invalid fields return the field-level error envelope (130ms)
  ✓  81 [mobile-390] › tests/phase-4-zbm.spec.ts:458:3 › Lead route stub (§6.2) › malformed envelope, unknown form and missing submission_id are rejected (135ms)
  ✓  82 [mobile-390] › tests/phase-4-zbm.spec.ts:469:3 › Lead route stub (§6.2) › a filled honeypot looks like success and is not validated (129ms)
  ✓  83 [mobile-390] › tests/phase-4-zbm.spec.ts:482:3 › Out-of-Home (§A4) › each kept figure is cited inline to its primary source; the untraceable one is dropped (211ms)
  ✓  84 [mobile-390] › tests/phase-4-zbm.spec.ts:500:3 › About and Contact (§A4) › About carries the brief's standard and routes to Talk to Us, not the assessment (200ms)
  ✓  85 [mobile-390] › tests/phase-4-zbm.spec.ts:511:3 › About and Contact (§A4) › Contact form has the §6.1 fields and posts to the stub (288ms)
  ✓  86 [mobile-390] › tests/phase-4-zbm.spec.ts:535:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › the assessment is primary on Home and Revenue Recovery only (582ms)
  ✓  87 [mobile-390] › tests/phase-4-zbm.spec.ts:560:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Digital Advertising states the pairing without the agency framing (215ms)
  ✓  88 [mobile-390] › tests/phase-4-zbm.spec.ts:576:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Out-of-Home plans across operators and claims no buying (211ms)
  ✓  89 [mobile-390] › tests/phase-4-zbm.spec.ts:585:3 › Copy revision (founder rulings, Sep 17 — audit at 1fc360f) › Search Intelligence drops the competitor-admission clause (202ms)
  ✓  90 [mobile-390] › tests/phase-4-zbm.spec.ts:594:3 › FAQ (§A4) › aggregates the three discipline blocks, grouped, with no Search Intelligence questions (225ms)
  ✓  91 [mobile-390] › tests/phase-4-zbm.spec.ts:615:3 › Search Intelligence (§A4 — built, never linked) › exists, is noindex, carries its pricing and FAQ (225ms)
  ✓  92 [mobile-390] › tests/phase-4-zbm.spec.ts:623:3 › Search Intelligence (§A4 — built, never linked) › no built page links to it, and neither sitemap nor robots names it (151ms)
  ✘  93 [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order (5.3s)
  ✘  94 [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) (317ms)
  ✓  95 [mobile-390] › tests/phase-5-visibility.spec.ts:106:3 › Retirement — §12.8, condition C3 › no ZBM page carries a retired string, hidden FAQ panels included (763ms)
  ✓  96 [mobile-390] › tests/phase-5-visibility.spec.ts:116:3 › Retirement — §12.8, condition C3 › the pattern still recognises every retired string, and not the new name (0ms)
  ✓  97 [mobile-390] › tests/phase-5-visibility.spec.ts:130:3 › Retirement — §12.8, condition C3 › the free-trial FAQ answer is rewritten to what is true today (272ms)
  ✓  98 [mobile-390] › tests/phase-5-visibility.spec.ts:138:3 › Retirement — §12.8, condition C3 › no button names a check that does not exist yet; Talk to Us leads (222ms)


  1) [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: structured_data description

    expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('li').nth(4).locator('.type-body')
    Expected: "Your website doesn’t label its key facts in a machine-readable way."
    Received: "Your website doesn't label its key facts in a machine-readable way."
    Timeout:  5000ms

    Call log:
      - structured_data description locator('#visibility-gaps').locator('li').nth(4).locator('.type-body') with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('li').nth(4).locator('.type-body')
        14 × locator resolved to <div class="type-body text-text-secondary">Your website doesn't label its key facts in a mac…</div>
           - unexpected value "Your website doesn't label its key facts in a machine-readable way."


      77 |       const row = rows.nth(i);
      78 |       await expect(row.locator("h3"), `${gap.key} name`).toHaveText(gap.name);
    > 79 |       await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
         |                                                                         ^
      80 |       await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
      81 |       await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
      82 |     }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:79:73

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  2) [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 

    Error: expect(received).not.toContain(expected) // indexOf

    Expected substring: not "'"
    Received string:        "Visibility Gap LibraryEight visibility gaps, and what fixing each one looks like.Business Profile GapThe basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search.Fix directionClaim your business profile on maps and in search, complete every field, and keep it current.Entity Consistency GapYour business name, address, phone number or description reads differently from one place to the next.Fix directionUse one exact name, address, phone number and description everywhere your business appears.Reviews GapYou have few recent reviews, or the reviews you get go unanswered.Fix directionAsk every satisfied customer for a review, and respond to the reviews you receive.Crawlability GapAutomated crawlers may not be able to reach or read the pages that matter most on your site.Fix directionCheck your site’s crawler rules and sitemap so your key pages can be reached and read.Structured Data GapYour website doesn't label its key facts in a machine-readable way.Fix directionAdd structured data for your business, your services and your most-asked questions.Answer Content GapYour website doesn’t directly answer the questions customers actually ask.Fix directionPublish clear, specific answers to the questions your customers ask most.Brand Citations GapFew other credible websites mention or link to your business.Fix directionEarn mentions on credible local and industry websites.Local Listings GapYour business is missing from the directories and map apps beyond your business profile on maps and in search.Fix directionGet listed in the directories and map apps that matter for your area and industry."

       99 |     const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
      100 |     expect(text).not.toMatch(/leak/i);
    > 101 |     expect(text).not.toContain("'");
          |                      ^
      102 |   });
      103 | });
      104 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:101:22

    Error Context: test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--desktop-1440/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  3) [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 

    Error: structured_data description

    expect(locator).toHaveText(expected) failed

    Locator:  locator('#visibility-gaps').locator('li').nth(4).locator('.type-body')
    Expected: "Your website doesn’t label its key facts in a machine-readable way."
    Received: "Your website doesn't label its key facts in a machine-readable way."
    Timeout:  5000ms

    Call log:
      - structured_data description locator('#visibility-gaps').locator('li').nth(4).locator('.type-body') with timeout 5000ms
      - waiting for locator('#visibility-gaps').locator('li').nth(4).locator('.type-body')
        14 × locator resolved to <div class="type-body text-text-secondary">Your website doesn't label its key facts in a mac…</div>
           - unexpected value "Your website doesn't label its key facts in a machine-readable way."


      77 |       const row = rows.nth(i);
      78 |       await expect(row.locator("h3"), `${gap.key} name`).toHaveText(gap.name);
    > 79 |       await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
         |                                                                         ^
      80 |       await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
      81 |       await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
      82 |     }
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:79:73

    Error Context: test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-d8f9c-d-spec-states-them-in-order-mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4) [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 

    Error: expect(received).not.toContain(expected) // indexOf

    Expected substring: not "'"
    Received string:        "Visibility Gap LibraryEight visibility gaps, and what fixing each one looks like.Business Profile GapThe basic facts about your business — what you do, where, and when you’re open — are incomplete or out of date on your business profile on maps and in search.Fix directionClaim your business profile on maps and in search, complete every field, and keep it current.Entity Consistency GapYour business name, address, phone number or description reads differently from one place to the next.Fix directionUse one exact name, address, phone number and description everywhere your business appears.Reviews GapYou have few recent reviews, or the reviews you get go unanswered.Fix directionAsk every satisfied customer for a review, and respond to the reviews you receive.Crawlability GapAutomated crawlers may not be able to reach or read the pages that matter most on your site.Fix directionCheck your site’s crawler rules and sitemap so your key pages can be reached and read.Structured Data GapYour website doesn't label its key facts in a machine-readable way.Fix directionAdd structured data for your business, your services and your most-asked questions.Answer Content GapYour website doesn’t directly answer the questions customers actually ask.Fix directionPublish clear, specific answers to the questions your customers ask most.Brand Citations GapFew other credible websites mention or link to your business.Fix directionEarn mentions on credible local and industry websites.Local Listings GapYour business is missing from the directories and map apps beyond your business profile on maps and in search.Fix directionGet listed in the directories and map apps that matter for your area and industry."

       99 |     const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
      100 |     expect(text).not.toMatch(/leak/i);
    > 101 |     expect(text).not.toContain("'");
          |                      ^
      102 |   });
      103 | });
      104 |
        at /Users/andrelove/WebstormProjects/zbest-sites/e2e/tests/phase-5-visibility.spec.ts:101:22

    Error Context: test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/error-context.md

    attachment #2: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/trace.zip
    Usage:

        pnpm exec playwright show-trace test-results/phase-5-visibility-Visibil-ccc4d-rly-apostrophes-only-§12-1--mobile-390/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

  4 failed
    [desktop-1440] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
    [desktop-1440] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 
    [mobile-390] › tests/phase-5-visibility.spec.ts:64:3 › Visibility Gap Library — published as certified (§12.4) › renders all eight gaps exactly as the certified spec states them, in order 
    [mobile-390] › tests/phase-5-visibility.spec.ts:97:3 › Visibility Gap Library — published as certified (§12.4) › says 'gap', never 'leak', and uses curly apostrophes only (§12.1) 
  94 passed (43.3s)
undefined
/Users/andrelove/WebstormProjects/zbest-sites/e2e:
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command failed with exit code 1: playwright test tests/phase-5-visibility.spec.ts tests/phase-4-zbm.spec.ts
```

#### `vis-mutate.py`, verbatim
```python
"""Mutations for b67f62f, one per invocation."""
import sys, pathlib
R = pathlib.Path("/Users/andrelove/WebstormProjects/zbest-sites")
LIB, SI = R / "apps/zbm/content/visibility-gaps.ts", R / "apps/zbm/app/search-intelligence/page.tsx"
def sub(p, old, new):
    s = p.read_text(); assert s.count(old) == 1, f"{p.name}: {old[:60]}"; p.write_text(s.replace(old, new))
def VM1():  # a library fix hand-edited away from the certified §12.4 text
    sub(LIB, '"Earn mentions on credible local and industry websites."', '"Earn more mentions online."')
def VM2():  # a retired CTA label returns on the hero button
    sub(SI, '''        <CtaRow>
          <ButtonLink href="/contact">Talk to Us</ButtonLink>
        </CtaRow>
      </PageHeader>''', '''        <CtaRow>
          <ButtonLink href="/contact">Get Your Free Visibility Check</ButtonLink>
        </CtaRow>
      </PageHeader>''')
def VM3():  # the false FAQ line returns, INSIDE a collapsed (hidden) FAQ answer
    sub(SI, '"Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live."',
            '"Not yet — a free AI Visibility Check is available now. A self-serve trial mechanic is planned once the client dashboard itself is live."')
def VM4():  # the retired promise returns as visible copy
    sub(SI, '''        <p className="type-body-lead text-text-primary">
          Businesses that need to be found''', '''        <p className="type-body-lead text-text-primary">
          See whether and how your business currently shows up in AI answers.
        </p>
        <p className="type-body-lead text-text-primary">
          Businesses that need to be found''')
def VM5():  # "leak" enters the library
    sub(LIB, 'title: "Visibility Gap Library",', 'title: "Visibility Leak Library",')
def VM6():  # a straight apostrophe enters the library
    sub(LIB, "Your website doesn’t label its key facts", "Your website doesn't label its key facts")
globals()[sys.argv[1]](); print(sys.argv[1], "applied")
```

## Appended — disclosures

Everything above this heading is unedited capture. The items below are appended.

### 1. Steps 1 and 3 merged, on the founder's ruling; step 2 not built

The auditor planned four separate gates. The founder chose to run steps 1 and 3 as one lane so
the page never shows both the library and the retired promise. The readiness check does not exist
until step 2, so no button names it. Talk to Us leads both CTA rows, the same pattern as Digital
Advertising and Out-of-Home. Step 2 adds the check and its CTA.

### 2. New customer-facing strings in this lane — for the copy gate

```
$ python3 -c "
import re
s=open('apps/zbm/content/visibility-gaps.ts').read()
for k in ['title','intro']:
    print(k+':', re.search(k+r': \"([^\"]+)\"', s).group(1))
"
title: Visibility Gap Library
intro: Eight visibility gaps, and what fixing each one looks like.
$ grep -n 'Not yet. A self-serve trial mechanic' apps/zbm/app/search-intelligence/page.tsx
113:      "Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.",
$ grep -n 'label: "Fix direction"' apps/zbm/app/search-intelligence/page.tsx
242:            facts: [{ label: "Fix direction", value: gap.fix }],
```

- `title` is the spec's own name for the library (§12.4).
- `intro` is NEW copy, not in §12.4. It mirrors the certified Leak Library intro ("Eight ways revenue
  leaks, and what fixing each one looks like."). It is the only new sentence in this lane.
- The FAQ answer is the old answer with its false clause removed. The rest is unchanged, and it
  is true today.
- "Fix direction" is the Leak Library's existing label, reused.
- The eight gap rows are the certified §12.4 text, generated from the spec table and checked
  against it by the gate.

### 3. Found by viewing captures, not by any test

- **The nav overlapped this lane's capture.** The sticky nav painted over the first library row at
  1440 and over the section label at 390. The nav is not part of the section, so it is hidden for
  the screenshot only, using Playwright's `style` option; the page is unchanged.
- **The certified assessment captures have the same overlap.** At 390 the nav covers the "GET AN
  ASSESSMENT" label in `e2e/snapshots/phase-5/zbm-assessment-*-mobile-390.png`. Neither the build
  session nor the audit caught it. Not changed here: fixing it moves certified screenshots.

### 4. A blind spot in a certified gate, found and not fixed

Decision 10's "60 sec" / "one quantified leak" retirement check, in the per-page block of
`phase-4-zbm.spec.ts`, reads `innerText`. Collapsed FAQ answers are in the DOM but `hidden`, so
innerText cannot see them. A retired phrase placed inside a collapsed FAQ answer would pass that
check. The new C3 check reads `textContent` for exactly this reason, and VM3 proves the difference.
The fix is one method name in a certified gate outside this lane, so it is flagged, not made.

```
$ grep -n 'const mainText\|not.toMatch(/60' e2e/tests/phase-4-zbm.spec.ts
87:const mainText = (page: Page) => page.locator("main").innerText();
127:      expect(text).not.toMatch(/60[- ]?sec/i);
```

### 5. Where the retired strings still appear

Only in code comments that record the retirement. None is rendered:
```
$ grep -nE 'whether and how your business currently shows up|Free AI Visibility Check|Free Visibility Check|available now' apps/zbm/app/search-intelligence/page.tsx
21: * below (§12.4, certified copy). The brief's "Free AI Visibility Check" and its
22: * promise to show "whether and how your business currently shows up…" are
231:        "Free AI Visibility Check" section and its promise (§12.1, §12.8 C3).
```
Lines 21-22 are the page docstring. Line 231 is inside a JSX comment, which opens on line 229 and
closes on line 232:
```
$ awk 'NR>=229 && NR<=232 {printf "%d: %s\n", NR, $0}' apps/zbm/app/search-intelligence/page.tsx
229:       {/*
230:         §12.4: the Visibility Gap Library, certified copy. Replaces the retired
231:         "Free AI Visibility Check" section and its promise (§12.1, §12.8 C3).
232:       */}
```
The C3 gate reads rendered text, and it passes.
