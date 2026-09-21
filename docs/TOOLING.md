# Tooling — installed versions and verification

Required by Build Brief v2 §2.1: *"Record the versions installed in docs/TOOLING.md.
Do not start Phase 1 until all three skills respond."*

Recorded during Phase 1. **Verified 2026-09-15.**

## Host environment

| | Version |
|---|---|
| Node | 20.19.5 (Next 16 requires `>=20.9.0`) |
| pnpm | 9.15.0 |
| git | 2.54.0 (Apple Git-157) |
| Platform | macOS (darwin 25.6.0), arm64 |

## The six tools (§2)

| Tool | Role (§2) | Installed version | Responded? | Evidence |
|---|---|---|---|---|
| **Motion.dev** | Animation/interaction primitives | `motion` 13.3.0 (dependency of `@zbest/ui`) | n/a — library, not a service | `pnpm --filter @zbest/ui list motion` |
| **React Bits** | Pre-built animated components | **not installed — see "React Bits discrepancy" below** | — | — |
| **Playwright** | QA screenshots, desktop + mobile | `@playwright/test` 1.63.0; chromium-1243, webkit-2359 | ✅ | `playwright test --list` → 4 tests; full run 4 passed |
| **Impeccable** | Anti-slop design enforcement | skill **4.3.1** (`~/.claude/skills/impeccable`) | ✅ | `impeccable context` ran; `init` completed; see discrepancy below |
| **Taste Skill** | Design taste layer | `design-taste-frontend` (v2, no version field in SKILL.md) | ✅ | skill present and loadable |
| **21st MCP** | Component generation | HTTP MCP at `https://21st.dev/api/mcp` | ✅ | `claude mcp list` → connected; live `search` call returned catalog results |

**AEGIS** is the audit gate between phases (§2), not one of the six build tools.

## Framework and build chain

| Package | Version | Note |
|---|---|---|
| next | 16.3.5 | App Router, Turbopack (Next 16 default) |
| react / react-dom | 19.3.0 | |
| typescript | 5.9.3 | **Not** 7.0.2 — see "Assumptions" |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | v4 CSS-first config |
| turbo | 2.10.13 | |
| eslint | 9.39.5 | **Not** 10.x — see "Assumptions" |
| eslint-config-next | 16.3.5 | native flat config; no `FlatCompat` shim |
| typescript-eslint | 8.70.0 | |

## React Bits discrepancy — flagged, not resolved

§2.1 supplies `pnpm --filter @zbest/ui add react-bits`. The npm package **`react-bits` is not
reactbits.dev.** It is `dmiller9911/react-bits`, "Common React Interfaces for cross platform
components and apis", last published **2022-06-25**. Installing it would add an unrelated,
four-year-stale dependency.

reactbits.dev distributes by copy-paste or via the `jsrepo` CLI, which is the alternative §2.1
itself offers: *"or copy individual components from reactbits.dev."* **That path is the one taken** —
nothing installed in Phase 1, components copied into `packages/ui` as Phase 2 needs them, each one
brought under the locked design tokens rather than used as shipped.

Nothing about this changes the locked brief. Recorded because §2.1 says these tools move fast and to
re-check before running.

## Impeccable `init` discrepancy — flagged, worked around

§2.1 states `/impeccable init` "scans the repo, writes PRODUCT.md and DESIGN.md". In the
installed version (**4.3.1**) `init` writes **PRODUCT.md only** and explicitly refuses to write
DESIGN.md — that moved to the `document` and new-work flows. The brief was written against the
3.9.x behaviour.

Worked around without re-ideating anything: `init` produced the PRODUCT.md files, and `DESIGN.md`
was written directly from the locked §A1 / §B1 tokens and §2.2 anti-references, which is the content
§2.1 requires that file to hold. No visual decisions were invented.

**File layout** (confirmed with the user, tightened from the first proposal):

| File | Holds |
|---|---|
| `DESIGN.md` (root) | **The only place tokens live.** §A1 + §B1 verbatim, brand-scoped, §2.2 anti-references, shared pieces |
| `PRODUCT.md` (root) | Shared product truth — positioning, brand commitments, evidence on hand, scope/backend/legal constraints |
| `apps/zbm/PRODUCT.md`, `apps/zbc/PRODUCT.md` | Audience, purpose, page inventory |
| `apps/zbm/DESIGN.md`, `apps/zbc/DESIGN.md` | Which brand scope applies + page-level vernacular. **No tokens, no overrides.** |

If a value is needed that is not at root, it gets added at root. Verified mechanically: both per-app
`DESIGN.md` files contain zero hex values.

`impeccable context` now resolves `productPath`, `designPath` and `platform: web` from both apps.

## Build path — code-first (founder decision)

§2.1's init flow requires a one-time choice of **comp-first** (an image sets the bar before code) or
**code-first** (build directly against a direction contract).

**Decision at Phase 1 close: `code-first`.** Recorded in `.impeccable/config.json` as
`{"buildPath": "code"}`, which is where Impeccable reads it. It first changes output at Phase 4.

(An earlier revision of this file recorded the question as unanswered, with comp-first applying
unstored as Impeccable's default. That is superseded.)

## Assumptions (stated per the §Appendix kickoff instruction)

1. **TypeScript 5.9.3, not 7.0.2.** TypeScript 7 (the native port) is published, but
   `typescript-eslint` 8.70.0 declares `typescript: ">=4.8.4 <6.1.0"`. Pinning 5.9.3 keeps lint and
   typecheck working together. Revisit when the lint chain supports 7.x.
2. **ESLint 9.39.5, not 10.x.** `eslint-config-next@16.3.5` declares `eslint: ">=9.0.0"`; 9.x is the
   combination Next itself is tested against.
3. **Mobile project uses the `iPhone 14` device descriptor (WebKit).** Its native viewport is
   390×844, matching §3's "mobile 390" exactly, and WebKit reflects what this audience actually
   browses on. Its `deviceScaleFactor` is 3, so mobile PNGs are 1170px wide for a 390px CSS
   viewport — that is 3× pixel density, not a wrong viewport.
4. **Fonts are split per brand.** `@zbest/ui/fonts/zbm` and `@zbest/ui/fonts/zbc` are separate
   modules so neither app self-hosts the other's headline face. A single shared `fonts.ts` made both
   apps emit all four families (27 woff2 files each); split, each emits 24 — 21 shared IBM Plex,
   3 brand-specific.

## Open items carried into Phase 3

- **Fraunces' optional axes** (`SOFT`, `WONK`, `opsz`) are still undecided and left at defaults.
  Raise only if a page shows a reason; the brief locks the family, not the axes.
- **`/dev/system` must stay out of `sitemap.xml`** when Phase 3 builds one, alongside Search
  Intelligence. Two unlisted routes now, for different reasons.
- **The cookie consent choice is stored but nothing reads it.** There are no analytics or
  advertising tags on either site yet. Whoever adds the first tag must read
  `localStorage["zbest-cookie-consent"]` before loading anything non-essential, or the banner
  becomes decoration.
- **Legal shells do not exist yet** (Phase 3). The consent banner links to `/legal/cookie-policy`,
  which 404s until then.

## Phase 1 AEGIS audit (Brief §3, §9)

Two independent read-only auditors were run against commit `12750b9` — the build session could
not certify its own output. Both were told Phases 2-6 are out of scope.

**`aegis-source` — SOURCE_GREEN.** 44/44 in-scope files read in full. Every hex in `tokens.css` and
root `DESIGN.md` diffed character-by-character against §A1/§B1: all 9 brief-specified values exact,
no undisclosed invented value, `--zbc-panel` honestly marked in all three places. Layout matches
§1.2. Per-app `DESIGN.md` files contain zero tokens. No suppressed checks. It also chased the
font-CDN vacuity suspicion to an out-of-repo reproduction in both engines and **disproved it**,
then declined to report the finding it had refuted.

**`aegis-runtime` — RUNTIME_GREEN_FOR_SCOPE on the artifact, BLOCK on the harness.** All eight
claims reproduced from a wiped build state. Screenshots regenerate byte-identical (SHA-256 stable
across two full rebuilds), and the committer's own `.next` was byte-identical to an independent
rebuild — the committed screenshots did come from the committed source. Versions: zero
discrepancies against this file. Fonts: **zero off-origin requests of any kind**, stronger than
§1.1 requires. It then found two HIGH defects in the gate harness:

| ID | Defect | Demonstrated by |
|---|---|---|
| F-09 | `reuseExistingServer: !CI` + `next start` with no build → the suite adopted a hand-written static server with **no fonts at all**, reported `4 passed`, and overwrote all four committed screenshots | Executing it |
| F-10 | `toHaveCSS("font-family", …)` is a string check that passes with zero font bytes fetched; `document.fonts.ready` was awaited but its result discarded | The same impostor page |

Plus F-11 (listener attached after the first navigation — not vacuous, but blind to first load),
F-12 (CDN check was Google-only; §1.1 names no vendor), F-13 (`e2e` and `@zbest/config` were the
only workspaces neither linted nor typechecked).

### Repaired, not restarted (§9)

All five fixed in `e2e/playwright.config.ts` and `e2e/tests/phase-1.spec.ts`:

1. `reuseExistingServer: false` unconditionally — the gate never adopts a server it did not start.
2. The webServer command is now `next build && next start`, so the gate builds what it tests.
3. Font presence proven by **measurement**: `document.fonts.check` plus the headline's rendered
   width against a deliberately unresolvable family. If the face is missing both fall back to the
   default and the widths converge.
4. The request listener moved above the first `goto`, and the assertion is now **zero off-origin
   requests** rather than a Google-only regex.
5. A `/_next/static/**.woff2` assertion proves the Next build is what is under test.
6. `e2e` and `@zbest/config` now have lint/typecheck; all **5** workspaces are checked.

**Both attacks re-run against the repaired gate:**

| Attack | Before | After |
|---|---|---|
| Impostor server on 3000/3001 | `4 passed`, screenshots overwritten | Refuses to run; screenshots untouched |
| woff2 blocked | `toHaveCSS` passed | `loaded=false`, width delta `0.0px` → **FAILS** |

### Re-audit of the repair — F-09 was still open

The repaired SHA was re-audited. F-10, F-11, F-12 and F-13 came back **CLOSED**, each confirmed by
execution. **F-09 did not close**, and the second finding was sharper than the first:

`next start` binds the **wildcard** address `*:3000`, which leaves the more specific
`127.0.0.1:3000` socket free. BSD longest-prefix matching then routes every gate request to
whichever process holds the loopback-specific socket. `reuseExistingServer: false` only rejects a
server already bound at precheck time — it does not bind the gate to the build it started. The
auditor took the port **six seconds after Playwright declared the real server healthy**, with no
race at all, and got `4 passed` with the committed screenshots overwritten. Its impostor also
defeated both new assertions by serving real font bytes from a hand-written `/_next/static/media/`
path.

Two further findings: `document.fonts.check()` returns **true for any family on a page with no
`@font-face` rules at all** (R-03), so that assertion could not catch the original F-10 case; and
`next build` builds the working tree, so a green gate is producible from uncommitted source (R-02).

### Second repair

| Fix | Closes |
|---|---|
| `next start --hostname 127.0.0.1` — binds the loopback address specifically, so a second bind fails `EADDRINUSE` | F-09 |
| Assert `/_next/static/<BUILD_ID>/_buildManifest.js` returns 200, reading `BUILD_ID` from the build the gate just produced. It is regenerated per build, cannot be guessed, and any other value 404s | F-09 defence in depth, R-04 |
| Font proof now requires a `document.fonts` entry for the family with `status === "loaded"`, instead of `document.fonts.check()` | R-03, and the host-dependence the auditor left UNVERIFIED — a system-installed font never appears in `document.fonts` |
| `global-setup.ts` stamps commit, tree, clean/dirty and timestamp beside the artifacts, and warns loudly on a dirty run | R-02 |

Measured directly, since the mechanism is the whole point:

| Server binding | Loopback hijack |
|---|---|
| `*:3000` (Next default) | **SUCCEEDS** |
| `--hostname 127.0.0.1` | **FAILS — EADDRINUSE** |

Re-running the auditor's variant-B attack against the repaired gate: **blocked on both ports**, gate
ran against the real build, and all four PNG hashes stayed byte-identical to the committed ones.
The vacuity of the old font check was reproduced too — on a page naming Fraunces with no
`@font-face`, `document.fonts.check()` returns `true` while the new assertion returns `0` and fails.

`PROVENANCE.txt` is gitignored: it is an operator warning for the run in front of you, not committed
evidence. What binds a screenshot to a commit is that captures are byte-reproducible — re-run the
gate at a SHA and the hashes must match, which both runtime audits independently confirmed.

### Third audit — F-09 still open, and the real invariant finally named

The second repair was re-audited. It closed the *symptom* and left the *mechanism*. The auditor
produced a **race-free** reproducer in which the real Next server never starts at all:

An impostor takes the port **before the gate launches** and destroys the first connection.
Playwright's `reuseExistingServer: false` is a single pre-spawn HTTP probe (`runner/index.js:857`),
so one dropped connection defeats it permanently; readiness is then `Promise.race` on "does the URL
answer", which never checks *who* is answering (`:936`). `next start` dies with `EADDRINUSE` — printed
to the gate's own console — and the gate exits `0`. `PROVENANCE.txt` stamped `clean: yes` on the
forgery.

The invariant that had never held, across all three SHAs:

> **The gate cannot tell that the thing answering the URL is the process it spawned.**

`--hostname 127.0.0.1` only narrowed *when* the port has to be taken. It is not a window you wait
for — you create it by taking the port first. The auditor also showed BUILD_ID proves only *"the
responder can read the build output"*, not *"the responder is the build"* — its impostor proxied
`/_next/static/**` straight through to the real `.next`, satisfying the 200, while serving its own
HTML. And the screenshot is of the HTML.

### Third repair — bind the document, not the port or the disk

A nonce is generated per run in the gate process, passed to the spawned server via env, rendered
into the served **document**, and asserted there. It exists only in that run's memory, so no other
process can produce it — unlike a port, which can be taken first, or an on-disk token, which any
local process can read and replay.

`GateNonce` (`packages/ui/src/gate.tsx`) renders nothing unless `ZBEST_GATE_NONCE` is set, so it
never reaches production. Verified both ways: a build without the variable emits **0** occurrences;
a build with it emits the meta tag.

**Both attacks re-run against the repaired gate:**

| Attack | Before | After |
|---|---|---|
| Pre-bound impostor, drops probe #1, proxies real fonts (canonical E2.2) | `4 passed`, exit 0, screenshots forged | **4 failed**, exit 1, screenshots untouched |
| Single-port hijack at t+2s (variant A′) | `4 passed`, exit 0, zbm screenshots forged | **exit 1**, screenshots untouched |

The impostor defeats every other assertion — it serves real woff2 from the real build, so off-origin,
self-hosted-font and BUILD_ID all pass. Only the nonce catches it.

Also fixed from the same audit: `pnpm lint` failed with 3965 errors after any gate run, because
`e2e/playwright-report/` is gitignored but was not eslint-ignored — the project's own documented
order (gate, then lint) did not pass. Now ignored in the shared config; lint is 5/5 after a gate run.

### Known residuals — accepted out of scope (founder decision)

**Founder decision at Phase 1 close: the three residuals below are accepted as out of scope for a
single-machine marketing-site gate, and harness work stops here.** They are recorded rather than
fixed, deliberately. The gate's job is to catch a stale or wrong build on this machine, which it now
does; it is not a security boundary, and an attacker who can run processes on this machine can edit
the repository directly.

Do not reopen these as findings in later phases. If the project ever gains CI or a second machine,
the Linux/CI item becomes live again and should be re-raised then.

**The residuals, stated plainly:**

- **The font assertion proves a family *name*, not a typeface.** `@font-face{font-family:"Fraunces"}`
  serving Bricolage bytes passes. Only reachable by an attacker who already controls the response,
  which the nonce now prevents — so it is not a backstop, and is not treated as one.
- **Ambient interception** (`HTTP_PROXY`, hosts file, DNS) was never run to a conclusion by any audit.
  Chromium bypasses proxies for loopback by default. Not proven safe, only not needed for the attacks
  that were found.
- **Linux/CI behaviour unverified.** All three audits ran on macOS. The two Playwright defects are
  platform-independent, but the attacks were not executed elsewhere.

### Phase 1 closed here — by decision, not by a clean audit

A fourth audit round was offered and **declined**; Phase 1 is committed as-is. Recording that
plainly so nobody later reads this file as a clean bill of health:

- The **artifact** passed every audit at every SHA — source and runtime, three rounds, all
  independently reproduced.
- The **gate** carries no independent GREEN at the final SHA `a24fcaa`. Its last independent verdict
  was BLOCK at `a0e2d30`. The third repair was verified by me against that auditor's own canonical
  reproducer and its stated falsifier, but it has not itself been independently audited.
- The residuals above are **accepted out of scope by founder decision**, not fixed. No further
  harness work.

Before Phase 2's own gate is trusted, the runtime audit should be re-run against the then-current
SHA.

## Phase 2 — design system (Brief §3.2)

Built: type scale and spacing rhythm, motion tokens, and the nine reusable pieces — `LedgerRule`,
`Counter`, `StatBlock`, `Nav`, `Footer`, `Card`, `FAQ`, `CookieConsent`, `IllustrativeBadge` — plus
the `/dev/system` gallery route in both apps and the Bricolage axes from founder decision 4.

`/dev/system` is **unlinked and noindex** in both apps, the same discoverability posture as Search
Intelligence (§A4) for a different reason: it is a development surface, not a staged reveal. It must
be kept out of `sitemap.xml` when Phase 3 builds one.

Gate: `e2e/tests/phase-2.spec.ts`, 16 tests across both apps and both viewports. It operates things
rather than locating them — the accordion is driven by keyboard, the consent banner is actually
rejected and the choice re-checked after reload, and the counter is asserted to tick once, to not
restart on re-entry, and to be disabled under `prefers-reduced-motion`.

### Three bugs the gate caught, all of which looked fine in code review

1. **The counter froze partway.** `format` is a default parameter, so it was a new function identity
   on every render; it was listed as an effect dependency, and every tick set state, so the effect
   re-ran mid-animation, the cleanup stopped the tween and the once-only guard refused to restart.
   It stopped on whatever number it had reached — 37,993 in the failing run. Fixed by holding
   `format` in a ref.
2. **A spacing token shadowed a core utility.** `--spacing-block: 2.5rem` made Tailwind v4 emit
   `.inline-block { inline-size: 2.5rem }` in addition to the built-in
   `.inline-block { display: inline-block }`. Every `inline-block` element became exactly 40px wide.
   Devtools attributed the width to no rule at all, because both rules carry the same class name and
   the collision is only visible by reading the compiled CSS. CTAs rendered as 40px boxes with their
   labels stacked vertically. Tokens renamed to `--spacing-stack` and `--spacing-ledger`.
3. **The Bricolage axes were loaded but not applied.** `font-variation-settings` was scoped to the
   `.type-*` roles, so anything using the raw `font-kinetic` utility — including the Phase 1 boot
   page — still rendered a neutral grotesque. Now applied to the utility as well.

The Phase 1 ZBC screenshots changed as a result of (3), which is correct and not drift: decision 4
deliberately changed that face. The Phase 1 gate still passes unmodified.

A first version of the anti-wrap assertion measured only height, so it passed while the CTA was a
40px box with its label overflowing — the fix had changed the symptom the test measured rather than
the defect. It now checks `scrollWidth` against the rendered box as well.

Impeccable's mechanical detector (`impeccable detect --json`) returns `[]` over
`packages/ui/src`, `apps/zbm/app` and `apps/zbc/app`.

## Phase 3 — shared scaffolding (Brief §3.3)

Built, in both apps:

- **Nav and footer in the root layout**, driven by `lib/site.ts` (§A2/§A3, §B2/§B3). The cookie
  banner moved there too, so every route — the 404 included — carries all three. `/dev/system`
  now takes its chrome from the layout instead of rendering its own; its Phase 2 captures stayed
  byte-identical.
- **Legal page shells** at `/legal/{privacy-policy,terms-of-service,cookie-policy}` with the §5
  banner above the title. Structure only: section headings name the scope items of the Legal
  Document Brief, each body is a marked placeholder, and the issuing entity is a placeholder.
  Noindex and out of the sitemap while they are drafts. The Cookie Policy shell has a
  "Change cookie settings" control that reopens the banner, so the footer's "Cookie Settings"
  entry leads somewhere a choice can actually be changed.
- **404** with site chrome and a way home; returns HTTP 404 and noindex.
- **sitemap.xml** from `ROUTES` in `lib/site.ts`: a route is listed only when built AND
  indexable. Today that is `/` on each site. Phase 4 flips `built` per page.
- **robots.txt**: allow-all plus the sitemap. Search Intelligence and `/dev` are excluded by
  *not being named* — a `Disallow` would publish the hidden path and stop crawlers reading its
  noindex. They appear in no route list, link, sitemap or robots file.
- **Metadata/OG defaults**: `metadataBase` on `https://www.zbestmedia.com` and
  `https://zbestclips.com`; `pageMetadata()` sets canonical, OG and Twitter per page; a
  statically generated `opengraph-image` per app (next/og, brand base color, brand faces from
  `@fontsource` woff because next/og cannot read woff2).
- **Entertainment/Brands system on ZBC**: page scope via `data-page-focus` + `:has()`, subtree
  scope via `data-focus` (see `apps/zbc/DESIGN.md`), with specimens at `/dev/system/focus/*`.

Gate: `e2e/tests/phase-3.spec.ts`. Expected nav, footer, hosts and colors are transcribed from the
brief in the spec, not imported from `lib/site.ts`.

### Defects found while building, and a test that could not fail

1. **Nested routes lost og:image.** A page-level `openGraph` object replaces the file-based image —
   including one from an `opengraph-image.tsx` in the page's own segment (checked). The homepage
   kept its image, `/legal/*` had none. `pageMetadata()` now names the image; a page with its own
   image passes it as `ogImage`. The gate asserts `og:image` per page.
2. **Menus would stay open across navigations.** With the nav mounted in the layout it persists
   between client navigations. It now closes on route change, link click, Escape and outside click.
3. **The first nav-close test passed with the fix deleted.** It clicked a nav link to a Phase 4
   page; Next cannot prefetch a 404, so it did a full reload, which reset the menu by itself. The
   test now navigates client-side to a built route and asserts no reload happened. Found by a
   mutation run: seven deliberate breaks (search-intelligence in sitemap and footer, `Disallow:
   /dev/` in robots, `:has()` rule removed, og:image dropped, banner text changed, nav reset
   removed). All seven are now caught; before the fix, six were.
4. **Phase 1's `networkidle` wait timed out on desktop.** The nav's prefetches of Phase 4 routes
   stay pending in the browser (the server answers 404 in ~5ms), so the network never idles. The
   Phase 1 spec now waits for `load` and `document.fonts.ready`; its assertions are unchanged.
   Its four screenshots changed, correctly: the home page now carries nav and footer.

Impeccable's detector flagged the OG card's Satori font aliases (`Display`, `Mono`) as families
outside DESIGN.md; they now use the declared names. `impeccable detect --json` returns `[]`.

## Phase 4 — Z Best Media chunk (Brief §3.4, §A4)

Built in brief order, each captured at 1440 and 390 under `e2e/snapshots/phase-4-zbm/`: Home,
Digital Advertising, Revenue Recovery, Out-of-Home, About, Contact, FAQ, Search Intelligence.
ZBC pages not started.

**Founder decisions this chunk** (given in the build window):

1. Both "60-second" assessment lines are held — the Home CTA reads "Get a free assessment", and
   the Revenue Recovery FAQ "How does the process start?" is omitted. The gate fails any page
   containing "60 sec" or "one quantified leak".
2. Forms post to a marked stub (`apps/zbm/app/api/lead/route.ts`): zod validation, §6.2 error
   envelope, honeypot, `submission_id` — no Postgres, no Resend, no rate limit. Marked in the
   response body, the `X-Zbest-Lead-Stub: no-delivery` header, and on the form itself.
3. Assessment CTAs are labeled fixtures; all point to the request form at
   `/revenue-recovery#assessment`.
4. Revenue Recovery: filtered carry-over of the live page, no dollar pricing. Source text and
   exclusions in `docs/sources/`.
5. FAQ page built in this chunk, after Contact (its absence from §3.4 was a brief error).
6. OOH figures cited inline to primary sources or dropped — two kept, the 61% figure dropped
   (`docs/sources/README.md`).
7. Home proof section (Brief homepage lock, Sep 13) deferred until a named client exists; How we
   work stands in its place.
8. **Copy revision, Sep 17**, from the independent copy audit at `1fc360f`. ZBM is positioned as an
   advertising agency, not against one: the Revenue Recovery "Why us" comparison and the
   traditional-agency FAQ are gone. One process, not two: the Revenue Recovery Method™ section is
   removed with no replacement, leaving Home's Assess / Audit / Fix / Scale. Nothing promises what
   the Audit deliverable does not, so recovered-revenue pricing language is gone from the
   engagements headline, the Phase 3 Implementation body and the pricing FAQ. "Get an Assessment"
   is primary on Home and Revenue Recovery only; Talk to Us leads Digital Advertising, Out-of-Home
   and About. Two FAQ questions are withdrawn (case studies, strategist load). Revenue Recovery
   therefore carries six sections: the hero plus Where revenue leaks, the Leak Library, Industry
   Leak Patterns, the Audit Deliverable and How Engagements Work, with the FAQ and the assessment
   form below them (seven `PageSection`s in the file, down from nine).
9. **Neither the founding year nor the media buys are literally true** (founder, Sep 17). The hero
   stat block's "Est. | 2011 · Los Angeles" row is removed, "Platforms bought across" is now
   "Platforms we plan across", and Out-of-Home says "plan across" rather than "plan and buy across"
   in its hero, its FAQ answer and its meta description. This diverges from the locked brief
   §A4:267/270 and from `PRODUCT.md:66-68`, which still record the brief's wording — deliberate,
   not drift. **Open, not fixed in this chunk:** Z Best Clips still asserts both at
   `apps/zbc/app/media-kit/page.tsx:42` ("an advertising agency founded in 2011") and `:56`
   ("Parent — Z Best Media, est. 2011, Los Angeles"), and the shared design-system gallery repeats
   the stat row at `packages/ui/src/dev/system-gallery.tsx:172`. ZBC was explicitly out of scope
   here; these three need a ZBC pass before ZBC ships.

   **Provenance of this decision, as the build session witnessed it.** It was taken in the build
   window on 2026-09-17, by explicit founder selection from four written options, twice. The
   session put the question because it could not answer it: nothing in this repository bears on
   whether the company transacted on those six platforms or was founded in 2011, and both claims
   originate in the locked brief (§A4:267, :270, and :670/:674) and are carried into
   `PRODUCT.md:66-68`. The first selection was "both real — delete item 4"; the founder then
   corrected it, asked to see the options again, and selected "neither — apply item 4 in full",
   which is what shipped. No copy change was made under the first selection. This paragraph
   records what the session directly observed, not a later ratification it did not witness.

**Built alongside:** per-page OG images (`lib/og.tsx`, one `opengraph-image.tsx` per route),
`ButtonLink` and `ScrollScrub` in `@zbest/ui` (the scroll-scrubbed hero, §A1, disabled under
reduced motion), `zod` in `apps/zbm`. Every `ROUTES` entry is now `built: true`, so all seven
public pages are in `sitemap.xml`; Search Intelligence is not.

**Changed in earlier phases:** Home replaced the Phase 1 boot page, so the Phase 1 spec now
checks the brand on the nav wordmark instead of an h1 named "Z Best Media" (face measurement,
off-origin, nonce and build-identity checks unchanged), and the Phase 1 and Phase 3 home
captures changed.

**Judgment calls to review:** section labels such as "What we do", "Why us", "Managed, not
metered", "Contact form" and the FAQ page's h1 "Frequently asked questions" are structural
labels the brief does not supply. The live Method (Diagnose / Rebuild / Optimize / Scale) and
the brief's Home steps (Assess / Audit / Fix / Scale) now both appear on the site. The RR FAQ
answer "identified with the interactive leak assessment" was kept verbatim; it names the tool
but not what it returns.

Mutation run, output kept in the Phase 4 verification log: seven deliberate breaks (footer link
to Search Intelligence, certifications rendered-but-hidden, held FAQ restored, Kantar cited to a
non-primary URL, stub skipping validation, dollar pricing restored, scrub ignoring reduced
motion) — all seven caught.

## Phase 4 — audit F8 fix, and the Z Best Clips chunk (Brief §3.4, §B4)

**F8 (Phase 4 ZBM audit, CONDITIONAL):** the Revenue Recovery "How Engagements Work" Phase 1
card had no body. Set to exactly "Free. No payment, no obligation." (founder direction), with a
gate test verified to fail against the unfixed content. Revenue Recovery re-captured; no other
ZBM capture changed. Committed separately as `9342192`.

**ZBC pages**, built strictly one at a time — each captured at 1440 and 390 under
`e2e/snapshots/phase-4-zbc/` before the next page was written: How It Works, Entertainment,
Brands, Pricing, Become a Clipper, Launch a Campaign, About, Media Kit, FAQ.

**Founder decisions this chunk** (build window):

1. `/` serves How It Works; `/how-it-works` redirects there permanently (308); the nav's
   How It Works links to `/`. One canonical URL, one sitemap entry.
2. Carry-overs from the ZBM chunk: Launch a Campaign and the Become a Clipper waitlist post to
   the marked no-delivery stub; `press@zbestclips.com` is a labeled placeholder (plain text, no
   mailto); "Assets available on request." as written.
3. **Copy revision, Sep 17**, from the ZBC gate's CONDITIONAL verdict at `c35ee1d` and the copy
   audit folded into it. Founder decision 9 applied to ZBC: the Media Kit drops "founded in 2011"
   from its long boilerplate and its Parent row becomes "Z Best Media, Los Angeles" — only the
   year was retired, not the city — and `packages/ui/src/dev/system-gallery.tsx` drops the
   retired Est. stat row. ZBC is then held to the ZBM rulings: About no longer positions against
   marketing agencies; Pricing, the FAQ and the Media Kit short boilerplate no longer say
   creators are paid only on views, which contradicted the guaranteed flat fee per approved post
   that Brands campaigns carry; "dozens" replaces "hundreds" everywhere including
   `lib/site.ts` `SITE.description`; the FAQ drops the unsupported "proven" and writes full
   sentences. Four negative gate assertions lock each of these.
4. **Media Kit "Founder" row removed** (founder ruling, build window, Sep 17). The row read "A
   software engineer with a background in high-end automotive sales" with no name. The auditor
   raised it as reading evasive in a press kit and offered name-it-or-remove-it; naming would
   have contradicted the standing company-voice direction recorded at
   `apps/zbc/app/about/page.tsx:16` ("no founder name"), so the founder chose removal. The About
   page keeps the background in company voice, which that same direction permits.

5. **Honesty note revised** (founder ruling, build window, Sep 17), closing the item raised and
   held open one cycle earlier. It said "a new operation built on **proven** mechanics — the same
   clipping and distribution model **driving results** industry-wide", which is the same
   unsupported claim the copy audit struck from the FAQ two files away. It now reads "a new
   operation using an established model — the same clipping and distribution mechanics already in
   use across the industry"; the rest of the paragraph is unchanged. "Established" and "already in
   use" describe what exists, where "proven" and "driving results" asserted an outcome nobody here
   has measured — and the revised wording now agrees with the FAQ answer shipped in decision 3.

   **This supersedes the §B4 wording.** The brief mandates that the honesty note exists and stays
   on Launch a Campaign, which it does; it does not freeze wording against a founder ruling made
   after the brief was written. The gate's word-for-word assertion and mutation M5 moved to the new
   text in the same commit, and a negative check now fails the note if "proven" or "driving
   results" ever returns.

**Rules enforced by the gate on every ZBC page:** a real-company blocklist (platforms §B4 names
are allowed); no dollar figure on any client-facing page, and the clipper starting rates only on
Become a Clipper; focus pages carry `data-page-focus` and the nav CTA color follows it; badges on
all three How It Works example cards, whose figures match §B4 exactly.

**Shared code moved into `@zbest/ui`** so the two sites cannot drift: the page furniture
(`@zbest/ui/page`) and the stub-marked lead form plus its typed adapter (`@zbest/ui/lead`). ZBM
re-exports them; its gate and every ZBM capture were byte-identical after the move. The two
apps' stub route handlers are deliberately still separate files with the same logic.

**ZBC-only device:** `apps/zbc/components/timeline.tsx`, the §B1 scrubber — a ruled horizontal
track at 1440, a vertical timeline at 390 — used on How It Works only.

**Open on ZBC after certification at `28ef158`** — raised by the auditor in the certifying pass,
ruled by the founder to batch with the pre-launch ZBC work (press mailbox, legal shells) rather
than open another gate cycle for three lines. They are the same class as H2: Brands campaigns
carry a guaranteed flat fee per approved post, so "views only" language is false for them.

| # | Where | Now | Should read |
|---|---|---|---|
| O1 | `apps/zbc/app/page.tsx:118`, What's Included — client-facing | "Only eligible views billed" | "Nothing billed before you approve the post" |
| O2 | `apps/zbc/app/become-a-clipper/page.tsx:9` (metadata) and `:49` (step 5) — clipper-facing | "Paid on verified views" / "Get paid on verified views" | "Paid on approved posts and verified views" |
| O3 | `apps/zbc/app/media-kit/page.tsx:47-48`, long boilerplate | "clients pay only for approved posts with verified views" | "clients pay only for approved posts" |

O3 is the subtle one: an approved Brands post with zero verified views still earns its flat fee,
so the current wording understates what the client owes. When these are fixed, add the fourth
negative assertion alongside the three from decision 3, and expect roughly ten captures to move —
O1 is on the home page, which is captured in phase-1, phase-3 and phase-4-zbc.

### Evidence bundle standard — from the E1/E2 findings at `28ef158`

Two defects in the ZBC bundle's own evidence, both in artifacts this session generated. Neither
changed a verdict; both are recorded because an audit bundle that misstates its own proof is worse
than one that omits it.

**E1. An annotation asserted output that the command above it contradicted.** `commit-history.txt`
ran `git diff --name-only c35ee1d..HEAD -- apps/zbm/`, which printed eight ZBM files, and then
printed a fixed line reading "(no output above = no ZBM source changed)". The range was wrong for
the claim: `c35ee1d` predates the ZBM copy revision, so those files changed in the ZBM lane, not
the ZBC one. The claim was true and the evidence for it was not.

Rules, from now on:

- An annotation may only restate what the command above it actually printed. Never `echo` a
  conclusion unconditionally next to a command whose output could contradict it; if the claim is
  "this is empty", the emptiness has to be visible.
- Range a lane's diffs from the commit that lane started on, never from an older chunk's commit.
  For the ZBC lane that was `96193db..1ab0d9e`, which is genuinely empty for `apps/zbm/`.
- Prove a negative per commit as well as per range, so docs commits carrying no `--stat` in the
  bundle are still covered: `git show --name-only --format= <sha> -- <path>` for each.

**E2. A gate re-run was recorded as exit codes only.** The post-ruling run at `28ef158` logged
`build=0 typecheck=0 e2e=0 lint=0`, and the MANIFEST's pass count for it was carried over from the
earlier raw run. That is an inference, however safe. Every gate run recorded in a log or a MANIFEST
carries its own raw counts.

**Judgment calls to review:** structural labels the brief does not supply ("The Process",
"Examples", "Step 01 — Levers", "Payouts", "Honesty note", "Where we come from", "Questions",
card eyebrows "Your account" / "The client’s account"); How It Works' Step 1 levers rendered
as rows beneath the timeline rather than inside its first column; "Browse Active Campaigns"
kept as the CTA label (§B4) with a fixture note, opening the waitlist section; the Media Kit
fact values wrap right-aligned at 390 (Phase 2 `StatBlock`, left unchanged to avoid moving
certified ZBM captures).

Mutation run, raw output in the ZBC verification log: seven breaks (a real company name, payout
split on Pricing, badges dropped from the Brands examples, Brands page in the Entertainment
focus, honesty note reworded, press mailbox as a mailto link, `/how-it-works` redirect removed)
— all seven caught.

## Commands used to verify

```
node -v && pnpm -v
claude mcp list                                   # 21st connected
pnpm install
pnpm --filter @zbest/zbm exec next build          # ✅
pnpm --filter @zbest/zbc exec next build          # ✅
pnpm typecheck                                    # ✅ 3/3
pnpm lint                                         # ✅ 3/3
pnpm --filter e2e exec playwright install chromium webkit
pnpm --filter e2e exec playwright test            # ✅ 4 passed (builds inside the gate)
```

## Founder decision 10 — Phase 5, the free assessment mechanic (2026-09-17)

This was the blocker on Phase 5 opening at all, and on the two copy holds enforced since Phase 4.

**Ruled: a deterministic rule-based result for the free tier, the AI-drafted document for the paid
Audit.** The free assessment runs the form's own answers through the Revenue Leak taxonomy and
returns the single most likely leak category plus what fixing it looks like — no dollar figure, no
human in the loop, immediate. The paid Revenue Recovery Audit remains the AI-drafted,
founder-approved document that exists today.

**What this retires.** Brief §6.3's automated tool returning "one quantified leak in about 60
seconds" is retired for good, not held. The copy is rewritten around *one prioritized leak*, which
is a promise the free tier can actually keep on day one. This is a deliberate supersession of §6.3,
recorded the same way ZBC decision 5 supersedes the §B4 note wording.

**Why not the other two.** Keeping the drafted document as the free deliverable puts founder time on
every free lead and cannot scale. Building §6.3 literally would derive a dollar figure from form
inputs with no access to the client's analytics, ad accounts or CRM — a fabricated number, which
contradicts the Revenue Recovery Audit Deliverable copy certified at `831ad39`: "We do not guess at
dollar figures."

**Commercial context, founder-confirmed 2026-09-17:** the Sep 9 bridge plan is still live — a $497
teardown leading to a $1,500/mo retainer. The free rule-based result therefore sits in front of an
already-priced paid entry product. Any pricing copy written for Phase 5 has to reconcile with that;
the Revenue Recovery page currently carries no dollar figure at all by founder decision 4 of the
Phase 4 ZBM chunk, and that tension is a decision to take deliberately, not to resolve in passing.

**What the ruling unblocks, none of it started.** Each needs its own go-ahead:

1. **Backend spec v0.3.** Note that there is nothing to "correct": `AssessmentResult` appears
   exactly once in v0.2, at line 283, inside §10 *Explicit Deferred Items — DEFER_UNTIL_EVIDENCE*,
   with no shape defined. It would be defined for the first time and promoted out of the deferred
   list. The spec's own precondition there — "the real input schema still needs to be pulled from
   the live tool before `AssessmentResult` can be finalized" — is **transformed, not dissolved**.

   **Correction, same day.** This section first claimed the ruling dissolved that precondition
   because "the free tier's input is the site's existing lead form". That was wrong and is
   corrected here rather than edited away. The assessment form collects four fields and no
   diagnostic answers at all — `apps/zbm/lib/lead.ts:44-49`: `name`, `business`, `website`,
   `reach`. A rule-based mapping onto the leak taxonomy has nothing to read. So the ruling removes
   the dependency on the live tool *as the deliverable*, while the input question stands open in a
   new form: either the live tool's diagnostic questions are pulled after all, which is what line
   283 asks for, or a new question set is designed for Phase 5. **`AssessmentResult` cannot be
   specified until that is decided, because its input shape is undetermined.**

   v0.2 was authored by the founder, not by a session; v0.3 should be too, or be explicitly
   delegated. **Delegated, 2026-09-18:** the founder chose to have the build session write it
   rather than the backend window or himself. Written to
   `docs/backend-interface-spec-v0.3.md`, generated from v0.2 so that §§1–9 are byte-identical
   (verified per section by SHA-256), with §10's assessment item promoted into a new §11. Two parts
   are PROPOSED and need founder approval before build: the eight-question set (customer-facing
   copy) and the tie-break priority order. Because the build session wrote the contract it will
   build against, the auditor reviews v0.3 before approval and the backend author accepts it before
   implementing. `CLAUDE.md` still names v0.2 as the backend contract and should be pointed at v0.3
   only once it is approved, not before.

   **Two founder rulings on v0.3, 2026-09-18, taken in the build window:**
   - *"Messaging Leak" counts as Offer.* The Revenue Recovery page's Industry Leak Patterns names a
     ninth leak, "Messaging Leak" (Professional Services), that is not in the eight-category Leak
     Library. Found while staging the v0.3 review bundle. Ruled: keep the label on the certified page
     as written, and state in v0.3 §11.2 that it is an industry name for Offer. The taxonomy stays at
     eight; no result returns `messaging`. No capture moves.
   - *The eight questions and the tie-break order stay PROPOSED* until the auditor has gated them —
     the questions as customer-facing copy under the same standard as the sites, the order as the
     rule that decides which leak a prospect sees. The founder approves or amends after that.

   **v0.3 gate at `f6450b6`: CONDITIONAL** (auditor, 2026-09-18). Two spec conditions, applied:
   - *C1, §11.6:* `rejected` is terminal; a redraft is a new `PaidAuditDocument` with a new `id`
     against the same `submission_id`, so a rejected record is never edited back into `drafting`.
   - *C2, §11.2 and §11.5:* the active rule set's copy is derived from the published Leak Library,
     never authored into a rule set directly, and the Phase 5 gate asserts that the fixture rule
     set's strings equal `LEAK_LIBRARY` character for character, for all eight categories.

   *C1 extended to `verifier_failed`* (founder ruling, 2026-09-18). The build session raised it
   beside C1 rather than widening the auditor's narrowly written condition: `verifier_failed` was the
   other dead-end status in §11.6, with no stated exit. The founder ruled it terminal in the same
   terms as `rejected` — a redraft is a new `PaidAuditDocument` with a new `id` against the same
   `submission_id`. Both terminal statuses in §11.6 now read the same way.

   **Founder rulings on the two PROPOSED items, 2026-09-18, taken in the build window after the
   gate:**
   - *The eight questions: approved, with the answer scale changed* from the proposed "Not really ·
     Somewhat · Very true" to "Not true · Somewhat true · Very true", the auditor's alternative, so
     that all three answers take the same form. The §11.5 `value_label` enum follows it.
   - *The tie-break order: approved as proposed* — Follow-Up, Conversion, Offer, Trust, Tracking,
     Creative, Visibility, Traffic.

   v0.3 stays DRAFT and `CLAUDE.md` stays on v0.2 until the auditor clears the re-stage.

   **Update:** the auditor certified v0.3 at `92cbf36` as the Phase 5 contract. Its own status stays
   DRAFT until the backend author accepts it. `CLAUDE.md` names v0.3 from `beef78d` onward.

   **Phase 5 assessment chunk: certified at `87c9ee9`** (auditor, 2026-09-18). Founder rulings on
   the auditor's three open calls, taken in the build window the same day:
   - *Apostrophes: curly, amended now.* The six approved questions containing apostrophes were
     written with straight ones in v0.3 §11.3, while the site and every other string use curly.
     They are amended to curly in the spec, `rules.ts` and `phase-5.spec.ts`. The wording is
     unchanged. A changed question is a new rule-set version under §11.2, so the fixture moves
     from `fixture-2026-09-18.1` to `.2` with a new hash; `.1` is not edited in place. The
     auditor's line said to re-run the Phase 5 spec only, but the questions also appear in the
     Revenue Recovery full-page captures of the Phase 4 suite, so the full gate runs.
   - *RR Phase 1 engagement card: left as written.* "Free. No payment, no obligation." stays; the
     section title above it and the Home CTA line already name the deliverable.
   - *The retired-wording checks (60 sec, one quantified leak): kept*, as the only automated guard
     against that wording returning through a content edit.

   **Correction to the Phase 5 record.** The Phase 5 bundle, its MANIFEST, its log and the header
   of `phase-5.spec.ts` listed ZBC's "Browse Active Campaigns" as a Phase 5 item not yet built. It
   was built and certified in Phase 4 ZBC: `apps/zbc/app/become-a-clipper/page.tsx` sends it to
   the waitlist, whose title is the Brief §B4 label word for word, and `phase-4-zbc.spec.ts` tests
   it. The claim was made without checking the ZBC code. The founder then picked it as the next
   item because of that claim. With it corrected, the only Phase 5 build item left is the Search
   Intelligence AI Visibility Check, which no spec defines a result shape for. Under CLAUDE.md's
   rule against guessed DTOs it needs a specified shape before any UI is built.

   **Routed out of Phase 5:** the Phase 2 counter reduced-motion defect in
   `packages/ui/src/components/counter.tsx` is its own small Phase 2 fix, with its own re-gate.
   `packages/ui` is not touched inside Phase 5.

## Founder decision 11 — Phase 5, the AI Visibility Readiness Check (2026-09-18)

The last Phase 5 build item, and the same fork as decision 10: what the free check returns had to
be settled before any UI, because no spec defined a result shape and CLAUDE.md forbids building
against guessed DTOs.

**Ruled: option (a), a deterministic rule-based readiness check.** The prospect rates eight
statements about signals AI answer engines use; rules return one prioritized visibility gap with
a because-line and a fix direction. No live engine queries, no AI drafting, no dollar figure, and
no claim about what any engine currently says. Named **"AI Visibility Readiness Check"**.
Vocabulary is "gap", never "leak", so nothing collides with the Revenue Leak Library.

**Retired permanently from the free tier:** the brief's promise to show "whether and how your
business currently shows up when someone asks ChatGPT, Gemini, or Perplexity", and any
equivalent. Live engine observation moves to the paid Audit or the Search Intelligence backend,
later. That is a deliberate supersession of Brief §A4 and §6.3, recorded the same way decision 10
superseded "one quantified leak". The line is still printed on the unlinked Search Intelligence
page — its "Free AI Visibility Check" section and one FAQ answer — and is removed at build time.

**Provenance, as the build session witnessed it.** The options and the ruling were drafted by the
auditor. The founder answered D1, D2 and the name to the auditor, and the session received the
auditor's account of that. The session then asked the founder directly, in the build window, and
he confirmed the settled parts "as written". On the one clause the auditor left open, he chose to
approve the taxonomy and tie-break order **together with the questions**, not ahead of them.

**Written as spec §12, v0.3 → v0.4,** with §§1–11 unchanged. PROPOSED, gated by the auditor first
and then approved by the founder, all together: the eight categories, their tie-break order, the
eight questions and the Visibility Gap Library copy. That library has to be published on the
Search Intelligence page and certified as copy before any rule set derives from it. §11 had a
certified library to derive from; §12 does not. Nothing is built until v0.4 is certified, and
CLAUDE.md stays on v0.3 until then.

**v0.4 gate at `b440211`: CERTIFIED** as the Phase 5 Visibility Check contract, with condition C3.
The auditor accepted all three places §12 went past its draft (the library is published and
certified before derivation; Business Profile and Local Listings defined apart; Crawlability and
Structured Data asked as "have you checked / added"), and the correction to its framing of the
order's principle.

*C3, applied:* §12.8's retirement check names exact, regex-testable strings rather than
"framing". The auditor gave three: the promise, the section label, and the FAQ line, which is
also currently false and so must be rewritten, not stripped. The build session found a fourth
before applying it: both CTA buttons read "Get Your Free Visibility Check", which none of the three
strings match, so a gate on only those three would have passed with both old buttons in place.
The founder chose C3 plus that fourth string.

**Founder rulings on §12, 2026-09-18, taken in the build window:**
- *Business-profile wording: described, not named*, in all four places the term appears. The
  auditor's copy finding named two (Business Profile's question and library row). The build session
  found the same undefined "own business profile" in Local Listings' row and question too, and the
  founder ruled it changed in all four. Now "business profile on maps and in search". Naming Google
  was declined as the first vendor product in customer-facing rule copy.
- *Everything else first written as PROPOSED: approved as proposed* — the eight categories, the
  tie-break order, and the remaining questions and library rows.
- *Routing:* `gap_identified` goes to Talk to Us and `#pricing`; `insufficient_signal` goes to Talk
  to Us only, so an empty result never pushes toward pricing.

**Build, not started — each step needs its own go:** (1) publish the Visibility Gap Library on the
Search Intelligence page, as its own small copy gate; (2) rule set, form and result against
fixtures, pinning the expected `rules_hash` per version for both rule sets in one pass, as the
auditor asked; (3) remove the four retired strings, rewrite the false FAQ answer, add the C3 gate;
(4) bundle. The auditor's recommendation to add `check: "revenue_leak_assessment"` to §11.5 is for
the next spec revision, since it changes certified assessment code and tests.

**Build steps 1 and 3, run as one lane on the founder's ruling — built at `b67f62f`, not yet
audited.** The founder merged them so the Search Intelligence page never shows the library beside
the retired promise. The Visibility Gap Library is published from `apps/zbm/content/visibility-gaps.ts`,
which is generated from the certified §12.4 table and gate-checked against it. The four retired
strings are gone from every rendered page. The false FAQ line is rewritten. Talk to Us leads,
because the check doesn't exist until step 2. CLAUDE.md names v0.4. Gated at the commit, twice,
297 passed / 1 skipped; six mutations, each alone, all caught. Step 2 still needs its own go.
Found and flagged, not fixed: decision 10's retirement check reads `innerText` and cannot see
collapsed FAQ answers; the certified assessment captures at 390 have the sticky nav over their
section label.

**Repairs lane — the three items above, fixed on their own gate (2026-09-20).** Separated from
step 2 on the founder's ruling, so new construction and repairs to certified surfaces do not share
one evidence subject.

1. *`phase-4-zbm.spec.ts` `mainText` now reads `textContent`, not `innerText`* (`:87`), feeding all
   eleven call sites including decision 10's holds. Whitespace is collapsed, because `textContent`
   keeps JSX indentation and inserts no separator between block elements. Proven with a two-run
   mutation, VM-R1: a retired phrase ("one quantified leak in 60 sec") placed inside a collapsed
   FAQ answer on `/revenue-recovery`. Pre-repair, `innerText`: 86/86 passed — the blind spot,
   reproduced. Post-repair, `textContent`: 4 failed, `/revenue-recovery` and `/faq` on both
   viewports. Mutation reverted; `faq.ts` byte-identical to HEAD afterwards.
2. *The §11 `rules_hash` is pinned per version* — `EXPECTED_RULE_SET_HASH` in `phase-5.spec.ts`,
   `fixture-2026-09-18.2` → `d6a3674beca7d6d01a4cfaba573bd4641801091a62b92928d49bab90d27d4406`,
   captured at 1dfe670 on a clean tree. A shape check (`/^[0-9a-f]{64}$/`) only proves something
   hashed; the pin is what makes §11.2's "immutable after activation" checkable. Proven with
   VM-R2: a question's copy edited in place with the version left alone — the pin failed it,
   naming the version and saying a new version is required rather than an edit. Reverted.
   The §12 rule set gets its own pin inside step 2; that is why this says "the §11 rule set"
   and not "both".
3. *The sticky nav is hidden for the assessment element captures*, the same treatment the
   Visibility Gap Library captures already use — `style` applies during capture and nowhere else.
   The lane brief said two captures; there are **three** at 390 (form, result, insufficient), and
   leaving one of three carrying the artifact would be incoherent, so all three were regenerated.
   All three 1440 captures are byte-identical afterwards, which confirms the nav never reached the
   section at that viewport.

Gated twice at the same commit: build 2/2, typecheck 4/4, lint 5/5, e2e 297 passed / 1 skipped on
both runs. The three regenerated captures hash identically across the two runs. No source file in
`apps/` or `packages/` changed in this lane — it touches two spec files and three PNGs.
2. **The gate holds.** One file, not two: `e2e/tests/phase-4-zbm.spec.ts:116-120`.
   `phase-4-zbc.spec.ts` never enforced them and should not start — the assessment is a ZBM surface.
   The two `not.toMatch` holds become positive assertions on the new wording.

   This was asserted loosely once before it was checked — a build-session message claimed the holds
   were "still enforced by both gates", which was an assumption stated as fact. The grep, printed in
   full so the claim is settled rather than repeated:

   ```
   $ grep -n "60 sec\|one quantified leak" e2e/tests/*.spec.ts
   e2e/tests/phase-4-zbm.spec.ts:116:      // FOUNDER HOLD: no page promises a 60-second or "one quantified leak"
   e2e/tests/phase-4-zbm.spec.ts:120:      expect(text).not.toMatch(/one quantified leak/i);
   ```

   Two matches, one file, both inside the per-page block at `phase-4-zbm.spec.ts:116-120`:

   ```
   // FOUNDER HOLD: no page promises a 60-second or "one quantified leak"
   // assessment until the Phase 5 decision is made.
   const text = await mainText(page);
   expect(text).not.toMatch(/60[- ]?sec/i);
   expect(text).not.toMatch(/one quantified leak/i);
   ```

   Note the second `not.toMatch` is what the grep's line 120 shows; the `60[- ]?sec` assertion on
   line 119 does not contain the literal string "60 sec" and so does not appear in the grep output.
   Anyone re-running it should expect two hits, not three.
3. **Copy**: the Revenue Recovery FAQ and the Home CTA, both currently written around the hold.
4. **Then** Phase 5 may open, under the usual rule — its own phase gate, and an audit in a session
   that did not build it.

## Phase 6 — launch-gate controls from the frontend production standard (recorded 2026-09-18)

Recorded ahead of Phase 6; nothing here is built or started. Source list:
[`docs/sources/frontend-production-standard.md`](sources/frontend-production-standard.md).

### (a) The twelve controls

Brief §3 step 6 ("Launch checklist") stays in force as written. These twelve are added to
it, not substituted for it. Where a brief item already covers part of a control, the column
says so.

| # | Control | What the gate has to prove | Already in Brief §3.6? | State at `ab6a480` |
|---|---|---|---|---|
| 1 | Accessibility — axe-core | Zero axe-core violations on every route, both apps, both viewports, run inside the Playwright gate. If the dark theme throws contrast noise on the dev-only gallery, exclude `/dev/*` from the scan. Don't lower the bar | Partly: Lighthouse Accessibility ≥ 90 (a score, not a violation count) | Not installed; no gate asserts it |
| 2 | Core Web Vitals | Google's "good" thresholds as the gate line: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**, both viewports, alongside the Lighthouse ≥ 90 scores. Lab measurement in the gate; RUM from Vercel Analytics after launch, held to the same numbers | Partly: Lighthouse Performance ≥ 90 (lab score only; no CWV thresholds) | Not measured |
| 3 | Cross-browser + real device | Chromium, WebKit and Firefox pass the gate, plus a pass on at least one real iOS and one real Android device | No | Gate runs two projects (`e2e/playwright.config.ts:61-66`): Chromium at 1440 and WebKit (iPhone 14 profile) at 390. No Firefox project, no real-device pass |
| 4 | Console cleanliness | **Zero console errors and zero hydration / React-key warnings** on every route, plus no uncaught page errors. Checking errors alone lets hydration mismatches through | No | No spec listens for `console` or `pageerror` |
| 5 | Environment leakage | No dev routes, fixture labels, preview URLs, debug output or non-public env values in the production build | No | `/dev/system` gallery routes exist in both apps (Phase 2) and must be excluded or gated |
| 6 | CSP / security headers | Content-Security-Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame-ancestors set and asserted | No | Neither `next.config.ts` sets `headers()` |
| 7 | Consent gates scripts | No non-essential script loads or cookie is set before consent; reject keeps it that way | Partly: CookieConsent built in Phase 2 (§3.2) | Banner exists (`packages/ui/src/components/cookie-consent.tsx`); no third-party scripts exist yet to gate |
| 8 | Analytics integrity | Every analytics event fires once, with the right name and payload, only after consent | No | No analytics installed |
| 9 | Content resilience | Pages hold up under long strings, missing optional content, 200% zoom, and no-JS for core content | No | Anti-wrap and overflow assertions exist from Phase 2; the rest is not covered |
| 10 | Image handling | Every image has explicit dimensions, correct alt, modern format, responsive sizes, lazy below the fold | No | No raster images in either app yet |
| 11 | Production config | Canonical domains, sitemap and robots correct for production, `noindex` only where intended (Search Intelligence), OG and metadata resolve to production URLs | Partly: Search Intelligence exclusion (§A4) | Phase 3 built sitemap/robots/OG; not re-verified against a production config |
| 12 | Release verification | The deployed build is the certified SHA, and the gate re-runs against the deployed URL, not only localhost | Partly: "forms deliver email end-to-end from the preview deployment" | Not built; no deployment exists for either app |

"State" is from a grep of the tree at `ab6a480`, not from a run.

**Thresholds corrected 2026-09-18 (founder), after `8e1b6ad`.** Rows 2 and 4 had no numbers
first time round. Row 2 said "good" thresholds without stating them, and a CWV row with no
number is monitoring, not a gate. Row 4 was not explicit that hydration and key warnings fail it.
The thresholds written first time round stand: zero axe violations, one real iOS and one real
Android device, Firefox added.

### (b) Doctrine items not in Build Brief v2

- **axe-core and Lighthouse / Core Web Vitals — restored via (a), controls 1 and 2.** Stated
  precisely, because the brief is not silent on all of it: §3.6 already requires Lighthouse ≥ 90
  on Performance, Accessibility and SEO at both viewports. What it lacks is axe-core (a zero-
  violation check, not a score) and CWV thresholds (LCP / INP / CLS, not the Lighthouse
  Performance number). Those two are what (a) brings back.
- **Awesome DESIGN.md — completeness reference for DESIGN.md at Phase 6 start.** At Phase 6
  start, check the root `DESIGN.md` and both app `DESIGN.md` files against it for missing
  sections. It is a checklist of what a DESIGN.md should cover. It is not a style source, and
  it does not override the brief's §2.2 anti-references or the Phase 2 tokens.
- **Emil Design Engineering — disposition pending.** Not adopted, not rejected. No founder
  ruling yet; nothing in the build depends on it until there is one.
