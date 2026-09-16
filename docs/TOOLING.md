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

## Build path — asked, unanswered, not stored

§2.1's init flow requires a one-time choice of **comp-first** (an image sets the bar before code) or
**code-first** (build directly against a direction contract). It was asked and not answered, so per
Impeccable's own rule **nothing was written to `.impeccable/config.json`.**

Naming the path rather than quietly picking a different one: **this session's default is
comp-first**, which is what new-work applies wherever image generation exists and nothing is
recorded. It is not stored, so it can be set either way before Phase 4 begins — which is the first
phase where it changes any output.

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

## Open items carried into Phase 2

- **Variable-font axes.** next/font loads only the `wght` axis by default. Fraunces ships `SOFT`,
  `WONK` and `opsz`; Bricolage Grotesque ships `opsz` and `wdth`. §B1 calls Bricolage "kinetic,
  distinctive", and at default axis values it renders as a fairly neutral grotesque. Decide in
  Phase 2, alongside the type scale, whether to request extra axes — it is a payload/character
  trade-off, and the brief locks the family, not the axes.
- **Build path** must be set (comp-first / code-first) before Phase 4, or comp-first applies
  unrecorded. See above.
- **`--zbc-panel` (`#13151A`) is derived, not from the brief.** §B1 specifies no panel surface for
  ZBC, but `Card` is a shared primitive (§1.2) and needs one under both brands. It holds the same
  base-to-panel step as ZBM. Confirm or replace in Phase 2 — it is marked as derived in
  `tokens.css` and in root `DESIGN.md` so it cannot silently become canon.
- **The ZBM production domain is unnamed.** §1.1 says "its existing domain" without giving it.
  Not needed until Phase 3 (sitemap, canonical URLs, OG metadata).

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

The runtime verdict is void at each repaired SHA by its own terms, and the gate must be re-run
against the current one before Phase 2 is authorized.

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
