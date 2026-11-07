# DESIGN.md Visual Amendment v1 — Imagery, Motion, and the Visual Gate

**Status:** APPROVED by founder 2026-10-28, including the Nov 8 launch scope in §10. In force once merged into `DESIGN.md`.
**Decision:** FD-VISUAL-01 (assign the next founder-decision number in the registry on approval).
**Date:** 2026-10-28
**Ruled by:** Andre (founder), 2026-10-27: the current visual level is rejected as too basic. Evolve the system, use all three honest image sources, and use cinematic (not busy) motion.
**Applies to:** both apps, all pages. Applies on top of the current `main` (`9a7464f`), after PR #2 (CI and cleanup) is merged.

---

## 0. Why this exists

The sites are basic because the spec told them to be. Every session built to these clauses, and every gate enforced them:

- Brief §7: *"Photography / imagery: none required at launch. The design system carries the pages."*
- Brief §2.2 and DESIGN.md: *"one signature motion moment per page; restraint everywhere else."*
- Brief §A4 (line 228) and DESIGN.md: ZBM's only motion is *"a counter that ticks up once."*

The tools to do better are already in the stack (Motion.dev 13.3.0, React Bits, Impeccable, Taste Skill), and the spec forbade using them. This amendment raises the ceiling and keeps the integrity rules intact.

## 1. What this supersedes, and what stays locked

**Superseded by FD-VISUAL-01:**

| Clause | Old | New |
|---|---|---|
| Brief §7, imagery | None required at launch | §3 Imagery System (required) |
| Brief §2.2 "Yes this" | One signature motion moment per page | §4 Motion Language |
| Brief §2.2 "Not this" | Fade-and-slide-up on every section | Narrowed: no **identical** reveal repeated on every section (§4.3) |
| Brief §2.2 "Not this" | Hover effects on everything | Narrowed: hover only on elements that do something (§4.3) |
| Brief line 228, §B1 line 510 | Counter-only signature motion | §5 Showpiece Map |
| DESIGN.md Overview paragraph 3, Key Characteristics bullet 5, "Signature motion", Do bullet 5, Don't (stock photography) bullet | as written | replaced per §6 |
| DESIGN.md motion tokens | 3 tokens, no hover token | §4.4 token set |

**Unchanged and still locked:**

- All color tokens, typefaces, the type scale, spacing tokens, the ledger rule and tabular numerals. *Evolve, not replace.*
- The Evidence Rule and `IllustrativeBadge`.
- The Functional Color Rule on ZBC.
- These anti-references: no Inter-on-dark SaaS, no purple-to-blue gradients, no cards inside cards, no rounded icon tiles above headings, no hero with a floating dashboard mockup, no "Trusted by" logo rows until real, no custom cursors, no 3D tilt cards.
- No stock photography.
- No naming real companies, leagues or studios on ZBC.
- The `prefers-reduced-motion` requirement: content fully readable with motion off.
- The CWV thresholds in `docs/TOOLING.md`.

## 2. The new North Star, in one paragraph

Replaces DESIGN.md Overview paragraph 3:

> **Restrained, not empty.** Each page is a composed piece of work: a cinematic opening, real visual material, and one showpiece moment that a visitor remembers. Restraint governs *how* things move and *how much* is on screen, never *whether* there is anything to see. An advertising agency's site is its first piece of creative, and every page must look like it was made by people who make advertising.

## 3. Imagery System (new section, required)

### 3.1 The four honest sources (all four in use at launch)

| Source | What it is | Label | Where |
|---|---|---|---|
| **Real work** | Creative Z Best Media actually produced and ran: Pussycat Alley, ZBM's own campaigns, and client work as it arrives | None needed. Carries the client or brand name only if that client consented in writing. | Anywhere. Always preferred over a concept. |
| **Concept work** | Creative made to show capability for sample brands Z Best Media invented: billboards, TV frames, social posts, sites, ad sets | `ConceptBadge` ("Concept — not a client campaign") on every instance | Service pages, home, the work wall |
| **Process visuals** | What the work looks like inside: a redacted audit report, a media plan, a campaign timeline, a call-tracking breakdown, a clip-review queue | `ConceptBadge` if the data is illustrative; `IllustrativeBadge` on any number | Revenue Recovery, How We Work, ZBC How It Works |
| **Founder portrait** | Real photographs of Andre | None | About, Home (one placement) |

When a real asset exists for a slot, it replaces the concept, and the concept is retired from the manifest.

### 3.2 Hard rules

1. **No stock photography.** Unchanged.
2. **No AI-generated photoreal human faces anywhere.** Concept ads are product-, typography-, place- or illustration-led, or use stylized, non-photoreal people. *Reason:* a photoreal generated face on an agency site reads as a fake team or a fake client the moment anyone suspects it, and that undoes "advertising you can audit." The founder may override this rule; any override is recorded.
3. **Concept brands are invented and name-checked.** Every sample brand gets a trademark search before use, so none collides with a real business. No real brand marks, logos or products appear in concept work.
4. **Every asset is in the manifest** (`packages/ui/assets/manifest.json`) with: id, file, source class (real / concept / process / portrait), creator or tool, date, rights holder, consent reference (real work), alt text, and the pages it appears on. CI fails any image or video served from the app that has no manifest entry.
5. **`ConceptBadge`** is a new primitive, styled as a sibling of `IllustrativeBadge` (mono, uppercase, hairline-bordered), positioned inside or on the asset's frame, never in a footnote. CI asserts that every manifest entry with class `concept` renders with a badge on every page it appears on.

   > **Amended by founder ruling, 2026-10-30 (pilot review of PR #11):**
   > - The badge never covers the creative's own text. It sits in the caption strip directly under the frame (or the frame's bottom-left corner).
   > - Crops derived from one badged source share a single group label, "Concept — N clips cut from one source" (for the ZBC How It Works row: "Concept — 6 clips cut from one source"). The individual crops carry no badge. Standalone images keep their own badge.
   > - CI asserts both: every concept render has a visible badge on its own frame, or sits in a group whose crops all come from one source and whose group label is visible.
   >
   > The original text above is kept as approved on 2026-10-28; `design-inputs/fd-visual-01/` holds the unamended input.
6. **Alt text is required and descriptive,** and for concept work it starts with "Concept:".

### 3.3 Art direction (so the imagery belongs to this system)

- **Grade:** deep blacks, warm highlights. ZBM imagery leans brass and amber; ZBC Entertainment leans coral and warm; ZBC Brands leans cool blue. Imagery sits inside the palette, not on top of it.
- **Framing:** assets appear in real-world frames (a billboard in a street, a spot inside a 16:9 player with a timecode, a post inside a native platform frame, a site inside a browser chrome). The frame is part of the evidence vocabulary: *"this is where it runs."*
- **Ledger tie-in:** every major asset carries a mono caption line beneath a hairline rule (channel · format · placement · concept/real). The image and the ledger read as one system.
- **Density:** one dominant image per composition. Collages are allowed only for the work wall and the home reel, on a strict grid.

## 4. Motion Language (replaces "Signature motion")

### 4.1 Principle

**Cinematic, not busy.** Motion is used to reveal, to sequence and to direct attention, the way an edit does. It never decorates. Every page has exactly one **showpiece** (§5) plus a small, consistent vocabulary of supporting motion.

### 4.2 Allowed vocabulary

| Motion | Rule |
|---|---|
| **Scroll-driven hero** | Every major page. Tied to native scroll position through Motion's `useScroll`. No scroll hijacking, no smooth-scroll libraries, no pinning longer than about 1.5 viewports. |
| **Showpiece** | One per page (§5). Plays, or is driven, once per visit. Loops only when it is video. |
| **Section reveals** | Allowed, choreographed per section type. Ledger rows draw in along their rule, images unmask along a hairline edge, stats tick. Never the same fade-and-slide on every section. Each plays once. |
| **Image and video hover** | On navigable media only: scale ≤ 1.03, plus a caption or play-state change. 200–300ms. |
| **Interactive hover** | Links, buttons, service rows and cards that navigate: one consistent treatment per element type (the rule draws, the arrow moves, the accent appears). Non-interactive elements never react to hover. |
| **Service-row preview** | Desktop only: hovering a service row reveals that service's lead image beside the list. On mobile the image is inline in the row and is not hover-dependent. |
| **Video** | Muted, autoplay, inline, looped, with a poster frame. Pauses when off-screen. Sound only on explicit user action, with visible controls. |
| **Counters** | Unchanged: tick once on viewport entry. The server-rendered HTML carries the final value (the fix from commit 9dfefda on the cleanup branch). |

### 4.3 Still banned

The same identical reveal on every section; hover reactions on non-interactive elements; parallax on body text; scroll hijacking and scroll-jacked smooth scrolling; custom cursors; 3D tilt; particle or "AI orb" backgrounds; looping motion that never ends outside video; any motion that blocks reading or delays content past LCP; autoplay with sound.

React Bits components are allowed only if they pass this list. Most of its "backgrounds" fail.

### 4.4 Motion tokens (replaces the current three)

| Token | Value | Use |
|---|---|---|
| `--ease-ledger` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Unchanged; default easing |
| `--ease-cinema` | `cubic-bezier(0.65, 0, 0.35, 1)` | Showpieces and hero sequences |
| `--duration-tick` | `1100ms` | Unchanged |
| `--duration-reveal` | `420ms` | Unchanged; section reveals |
| `--duration-hover` | `240ms` | New; interactive hover |
| `--duration-unmask` | `700ms` | New; image unmask along a rule |
| `--stagger-ledger` | `60ms` | New; per-row stagger in ledger lists, capped at 8 rows |

### 4.5 Reduced motion and performance (pass/fail)

- With `prefers-reduced-motion: reduce`, every showpiece renders as a composed static frame, which must itself pass the visual gate (§7). Video shows its poster with a play control and does not autoplay. Every scroll effect is off.
- Motion runs on `transform` and `opacity` only. No layout-triggering animation.
- Showpieces and below-the-fold media load lazily. The hero's LCP element is a static image or text, never a video that has to start first.
- CWV budgets are unchanged and enforced at both viewports: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Every image and video has explicit dimensions.
- Media budgets: images AVIF or WebP through `next/image`; each loop video ≤ 2.5 MB (H.264 MP4 plus WebM), ≤ 12s, 1080p maximum; total media transfer for the first viewport ≤ 600 KB.

## 5. Showpiece Map (one per page)

### Z Best Media

| Page | Showpiece | Sources |
|---|---|---|
| Home | **The reel.** The hero headline holds while, on scroll, a strict-grid sequence of concept work across channels assembles: billboard, TV frame, social post, site, audit page. It resolves into the service list, where each row previews its lead image on hover. | Concept, process |
| Services hub | **Three acts.** "Get seen / Get remembered / Get paid" each open with a full-bleed channel composition that unmasks along a ledger rule. | Concept |
| Digital Advertising | **The ad set.** Concept creatives cycling inside native frames: search result, feed post, story, display. | Concept |
| TV & Streaming | **The spot.** A 16:9 concept spot loops in a player frame with a timecode and a scrubber that follows scroll. | Concept (video) |
| Radio & Audio | **The waveform.** A drawn waveform of a 15s concept spot. Plays only on click, with transcript captions. | Concept (audio) |
| Out-of-Home | **Can't scroll past.** A concept billboard in a street scene scales toward the viewer as you scroll, literalizing the page's headline. Scene is illustrated or real-photographed, never stock. | Concept |
| Social Media | **The calendar.** A native-frame phone with a concept feed, beside a content calendar whose ledger rows fill in. | Concept, process |
| Creative & Production | **The work wall.** A filterable grid of every asset in the manifest. Real work is pinned first; concepts are badged. | All |
| Influencer & Creator | **The brief to the post.** A creator brief document turns into a posted concept piece, content-led with no generated faces, with the disclosure tag visible. | Concept, process |
| Websites & Landing Pages | **Before / after.** A drag slider over a concept site, from leaky to fixed, with the fixes annotated as ledger notes. | Concept, process |
| Revenue Recovery | **The leak report.** A redacted sample audit report whose six findings mark themselves up in sequence as you scroll, and a traffic line that drops at each leak. | Process (`IllustrativeBadge` on every number) |
| About | **The founder.** A full-bleed real portrait with the agency's standard set beside it as a ledger. | Portrait |
| Start / Contact | None. A calm, form-first page; motion is limited to field-focus states. | — |
| FAQ, Legal, 404 | None. | — |

### Z Best Clips

| Page | Showpiece | Sources |
|---|---|---|
| How It Works (home) | **One source, dozens of clips.** A horizontal source video splits into a grid of vertical clips playing at once. Below it, the step timeline is driven by a scrubber on scroll (the spec's original scrubber, now built). | Concept (video), process |
| Entertainment | **Rented distribution.** A coral-graded carousel of vertical concept clips in phone frames, each with a view ticker. | Concept (video) |
| Brands | **Owned distribution.** The same device in the cool blue grade, posting to one brand-owned account whose follower count ledger grows. | Concept (video) |
| Pricing | **The levers.** The five levers rendered as instrument controls that set themselves on scroll, with illustrative math and `IllustrativeBadge`. | Process |
| Become a Clipper | **The review queue.** A clip moving from submitted to reviewed to approved to paid, as a ledger row. Clipper-side only; no buyer pricing. | Process |
| Launch a Campaign | None. Form-first. | — |
| Media Kit | **The reel.** ZBC's best concept clips as one sequence. | Concept (video) |
| About, FAQ, Legal, 404 | None. | — |

## 6. Replacement text for DESIGN.md

- **Key Characteristics**, bullet 5 → "One showpiece per page, a consistent supporting motion vocabulary, and real visual material on every major page."
- **Signature motion** section → replaced by §4 and §5 of this amendment, transcribed.
- **Do**, bullet 5 → "**Do** give every major page one showpiece, and real or labeled-concept imagery."
- **Don't (stock photography)** → "**Don't** use stock photography. **Don't** use AI-generated photoreal human faces. **Don't** show real brands in concept work."
- **New Do:** "**Do** label every concept asset with `ConceptBadge`, on the asset itself."
- **Components** list adds: `ConceptBadge`, `MediaFrame` (billboard / player / phone / browser / document frames), `Showpiece` (the reduced-motion-aware wrapper), `WorkWall`, `ServicePreview`.

## 7. The Visual Gate (new; visual quality is pass/fail)

A page cannot close without all of the following, at 1440 and 390, with motion on and with reduced motion:

1. **Media coverage (automated).** On every page except Start, Launch a Campaign, FAQ, Legal and 404, every 900px band of the full-page capture at 1440 contains at least one image, video or drawn illustration. At 390 the band is 844px, and no more than two consecutive bands may be text-only. The check runs in the Playwright gate.
2. **Showpiece present and working (automated).** The page's §5 showpiece renders, plays or responds, and has a reduced-motion static frame. Both states are captured.
3. **Labels (automated).** Every `concept` manifest entry carries a `ConceptBadge` wherever it renders. Every number carries `IllustrativeBadge` unless sourced.
4. **Manifest (automated).** No served media file lacks a manifest entry.
5. **Performance (automated).** CWV budgets and the §4.5 media budgets pass.
6. **Accessibility (automated).** axe has zero violations; video has controls and captions where it has audio.
7. **Founder visual approval (human, final).** Andre approves the 1440 and 390 captures, motion-on and reduced-motion, per page. **No page ships on automated checks alone.** The automated checks stop a page from being empty or dishonest; only the founder decides whether it's good enough.

## 8. Order of work

1. Merge PR #2 (CI and cleanup) so this work builds on a gated `main`. This also ships the counter fix and the ZBC O1–O3 copy.
2. Separate copy ruling, needed right away: remove the visitor-facing "Fixture — the assessment is scored on fixture rules…" line on Home and Revenue Recovery.
3. Founder approves this amendment. It is merged into `DESIGN.md` and recorded as FD-VISUAL-01, and Brief §2.2, §7 and lines 228 and 510 are annotated "superseded by FD-VISUAL-01".
4. Build the primitives: `ConceptBadge`, `MediaFrame`, `Showpiece`, the manifest, and the automated checks in §7. This happens before any page work, so the gate exists before the pages it judges.
5. **Production run (founder plus the creative tools):**
   - Name the concept brands and run the trademark checks.
   - Produce the concept creative per §5.
   - Build the process visuals.
   - Book the founder portrait shoot.
6. Pilot two pages first, **ZBM Home** and **ZBC How It Works**, through the full visual gate, including founder approval, to calibrate the bar.
7. Roll out the remaining pages in batches of three to four, each batch gated.

## 9. Open items for the founder

- **Concept brand roster — APPROVED by founder 2026-10-27.** Names are provisional until USPTO and California business-name checks pass. The brands are invented; no real brand marks or products appear in any of their creative.

  | Brand | Vertical | Look | Line | Anchors |
  |---|---|---|---|---|
  | **Maren Vale Aesthetics** | Boutique med spa, two West LA locations | Bone white, warm sand, soft brass; product-, texture- and space-led | "Look rested. Not done." | Social Media, Influencer, Websites before/after, Revenue Recovery sample leak report, ZBC Brands |
  | **Quellmont Motors** | Three-rooftop South Bay dealer group | Graphite, wet asphalt, one amber signal light; vehicles de-badged or shot as silhouettes and details | "The price on the window is the price." | Out-of-Home billboard, TV & Streaming spot, Digital Advertising ad set, ZBC Brands showroom walkaround |
  | **Saltgrove Hospitality** | Three coastal restaurants (fish house, taqueria, rooftop bar) | Deep sea blue-black, salt white, citrus accent; food, light and place | "Pull up a chair by the water." | Radio & Audio spot, transit Out-of-Home, Creative & Production brand system, second social example |
  | **Ivo Solace** | Independent R&B/alt artist, debut single | Coral-graded night footage, film grain, handwritten type; artist stylized only | Single title, to be named in production | ZBC How It Works showpiece, ZBC Entertainment, Media Kit reel, Influencer |

  | **Ironhold Injury Law** — added by founder 2026-10-27; name chosen 2026-10-27 (alternates: Solvane, Kestrin) | Personal injury law firm, Los Angeles | Ink black, signal white, one safety-orange accent; the deliberate opposite of the loud PI billboard cliché; type-led | "Hurt? Talk to a lawyer before you talk to the insurer." (compliant: no guarantee, no fast-cash claim) | Out-of-Home billboard, TV & Streaming dramatized spot, Radio & Audio |

  **PI concept compliance requirements (California, in force since 2026-01-01; B&P §§6155, 6157–6158.7).** The concept creative must model a compliant ad, because a non-compliant concept would undercut the agency's pitch to this vertical:
  - Every piece conspicuously shows a responsible lawyer or firm name (fictional, inside the concept) and an office location.
  - No guarantees or warranties of outcome; no immediate-cash or quick-settlement statements or symbols.
  - Any dramatization or spokesperson carries its disclosure on screen or on air.
  - No awards or recognitions.
  - The firm name is cleared against State Bar records and California business names as well as USPTO, so it matches no real firm or attorney. Fictional attorney names are cleared the same way.
  - Kept off Z Best Clips at launch.
  - **Business-model note (not a design rule):** before ZBM sells lead generation, per-lead or per-case work to law firms, a California attorney-advertising lawyer reviews it (joint-advertising agreements, B&P §6152 runners and cappers).

  Names rejected after collision checks: "Marlowe Motor Group" (Marlow Motor Company exists), "Corvane" (Grupo Corven sells vehicles), "Steadline" (close to Stadlin Law, CA), "Northmere" (Northland Injury Law exists), "Varrow" (close to existing firm names).
- **Real work available now:** which Pussycat Alley or ZBM creative can be used as real work today?
- **Portrait:** a professional shoot (rec) or existing photos.
- **AI-face rule (§3.2.2):** keep (rec) or override.

## 10. Launch scope — November 8, 2026 (founder-approved 2026-10-28)

Launch is Nov 8. Anything not listed under "ships at launch" is a post-launch upgrade, gated the same way.

**Ships at launch**
- Every page in the §7.1 scope carries real visual material: at least one hero image or composition from the five concept brands (or real work), badged per §3.2.
- Three showpieces:
  1. **ZBM Home reel**, built from stills animated in code.
  2. **Out-of-Home "can't scroll past" billboard** (Ironhold or Quellmont), stills animated in code.
  3. **ZBC How It Works clip-split**: one generated source video, cut into vertical clips by code.
- The §4.2 supporting motion vocabulary: scroll-driven heroes, choreographed reveals, interactive hover, service-row image preview.
- Primitives: `ConceptBadge`, `MediaFrame`, `Showpiece`, the asset manifest. Automated checks: badge coverage, manifest coverage, CWV, axe.
- Founder visual approval (§7.7) on every page at 1440 and 390.
- Founder portrait: a well-lit phone portrait on About.

**Post-launch upgrades** (in this order unless reordered): the TV & Streaming spot video; the Revenue Recovery leak report; the Websites before/after slider; Radio waveform; work wall; ZBC Entertainment and Brands carousels; Media Kit reel; Pricing levers; Become a Clipper review queue; the automated §7.1 media-coverage check; pro portrait.

**Launch blockers outside this amendment** (must clear by Nov 7)
- PR #2 (CI and cleanup) merged; CI green on `main`.
- Visitor-facing "Fixture —" note removed (copy ruling).
- Legal pages and cookie banner: no "Draft — not in effect" text on a lead-collecting public site. Founder decision: attorney-reviewed text, or finalized policies formally adopted.
- Security headers in both `next.config.ts`; `/dev/system` excluded from production builds.
- Lead route live: Postgres and Resend keys set, sending DNS verified on both domains, one real test lead received end to end.
- Vercel plan permits commercial use (Pro).
- Domain cutover plan with tested rollback to the current live site.

**Budget:** creative production ≤ $250 (founder cap). Generated video limited to the clip-split source (plus at most one more after launch); everything else is stills animated in code.
