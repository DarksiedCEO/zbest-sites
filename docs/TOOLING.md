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
pnpm --filter e2e exec playwright test            # ✅ 4 passed
```
