# Pre-launch verification and cleanup run — 2026-09-24

Branch `pre-launch-cleanup-2026-09-24`, cut from `main` at `49a46d1`. Nothing in this run is
committed to `main`, pushed, deployed, or applied to repository settings.

**Scope, as ruled by Andre before the run:** the "safe subset" of the pre-launch brief — items
1, 3, 4, 5, 7, 8, 9. Items 2, 6 and 10 are logged as blocked below, with the reason, and were
not attempted.

**Who ran it:** the zbest-sites build session. Phase 1 below is a pre-check, not the phase audit —
the standing rule is that the audit never runs in the session that built the work, so these
results are evidence for an independent reviewer, not a verdict.

Environment: Node v24.9.0, pnpm 9.15.0, Playwright 1.63.0 (Chromium), production build
(`next build` + `next start`, both apps) served on 127.0.0.1:3100 (ZBM) and :3101 (ZBC).

---

## Phase 1 — Verification (evidence only; nothing changed)

### Item 1 — Route audit

Every route was loaded fresh in Chromium at 1440×900 and at 390×844, one browser context per
load, waited to network idle plus 1.5 s. Recorded per load: HTTP status, the word count of
`<main>` as rendered (`innerText`), section count, `<h1>`, the robots meta, the count of
`[data-placeholder]` and `[data-fixture-note]` elements, and every console error, uncaught page
error, and hydration or React-key warning. The route list comes from the page files: 22
`page.tsx` files, of which the two `legal/[document]` files each produce three documents — 26
pages, 25 excluding the internal ZBC focus gallery (`/dev/system/focus/[focus]`, reached from
`/dev/system`). The 404 page was loaded too. The results are the same at both viewports except
where noted.

**Classifications:** *real content* — final copy renders, nothing on the page is a stand-in;
*real content + labeled fixture* — final copy, plus a visibly labeled note where something is
not live yet; *labeled placeholder* — the page exists to hold text that has not been written,
and says so; *internal* — not a public page; *stub* / *broken* — none found.

| Site | Route | Status | Words | Classification | Note |
|---|---|---|---|---|---|
| ZBM | `/` | 200 | 324 | real content + labeled fixture | 1 fixture note |
| ZBM | `/about` | 200 | 125 | real content | |
| ZBM | `/contact` | 200 | 82 | real content | lead form posts to the no-delivery stub |
| ZBM | `/faq` | 200 | 140 | real content | |
| ZBM | `/digital-advertising` | 200 | 330 | real content | |
| ZBM | `/out-of-home` | 200 | 286 | real content | |
| ZBM | `/revenue-recovery` | 200 | 1216 | real content + labeled fixture | the free assessment, on fixtures (1 fixture note) |
| ZBM | `/search-intelligence` | 200 | 976 / 993 | real content | `noindex, follow`; unlinked by rule. Word count differs by viewport because of viewport-specific elements |
| ZBM | `/legal/privacy-policy` | 200 | 92 | labeled placeholder | draft banner present; 6 `[data-placeholder]` |
| ZBM | `/legal/terms-of-service` | 200 | 101 | labeled placeholder | draft banner; 7 placeholders |
| ZBM | `/legal/cookie-policy` | 200 | 70 | labeled placeholder | draft banner; 4 placeholders |
| ZBM | `/dev/system` | 200 | 342 | internal | `noindex, nofollow` |
| ZBC | `/` (How It Works) | 200 | 373 | real content | |
| ZBC | `/about` | 200 | 136 | real content | |
| ZBC | `/faq` | 200 | 79 | real content | short by design |
| ZBC | `/pricing` | 200 | 98 | real content | short by design |
| ZBC | `/entertainment` | 200 | 126 | real content | |
| ZBC | `/brands` | 200 | 104 | real content | |
| ZBC | `/become-a-clipper` | 200 | 230 | real content + labeled fixture | "No campaigns are open yet — this opens the clipper waitlist." |
| ZBC | `/launch-a-campaign` | 200 | 206 | real content | |
| ZBC | `/media-kit` | 200 | 252 | real content + labeled placeholder | press mailbox marked "Placeholder — this mailbox does not exist yet." |
| ZBC | `/legal/privacy-policy` | 200 | 103 | labeled placeholder | draft banner; 7 placeholders |
| ZBC | `/legal/terms-of-service` | 200 | 179 | labeled placeholder | draft banner; 15 placeholders |
| ZBC | `/legal/cookie-policy` | 200 | 70 | labeled placeholder | draft banner; 4 placeholders |
| ZBC | `/dev/system` | 200 | 393 | internal | `noindex, nofollow` |
| both | `/this-page-does-not-exist` | 404 | 18 | correct 404 | `noindex`; see console note below |

**Draft banner check — a correction to this log's own first reading.** The first pass tested
`document.body.innerText` for "Draft — pending attorney review. Not yet in effect." and matched
on no legal page. The page was not the problem; the check was: the banner is a `type-label`,
which is CSS-uppercased, and `innerText` returns the transformed text. The served HTML of all six
legal pages carries the exact string inside `[data-legal-draft-banner]`
(`<p class="type-label text-accent">Draft — pending attorney review. Not yet in effect.</p>`), and
in each page's meta description.

**Result:** 50 of 50 route loads returned 200 with an `<h1>` and rendered copy. There were no
stubs, no blank pages, and no broken routes at `49a46d1`.

### Item 2 — Accessibility scan (axe) — BLOCKED, not run

axe-core is not installed in the repo (no `axe-core`, `@axe-core/playwright` or `lighthouse` in
any `package.json`), and installing it is the Phase 6 control 1 work and a supply-chain change,
not an evidence-only step. Ruled out of this run by Andre. No accessibility result is claimed.

### Item 3 — Dependency vulnerability scan

`pnpm audit --json`, 458 dependencies:

| Severity | Count |
|---|---|
| critical | 0 |
| high | 0 |
| moderate | 0 |
| low | 0 |
| info | 0 |

"No known vulnerabilities found." Nothing to flag, nothing patched.

The brief cites `specs/FRONTEND_COMPLIANCE_HANDOFF_2026-09-23.md` for the "critical/high blocks
release" rule. That file does not exist in this repo (there is no `specs/` directory) and was
not found anywhere under the home directory to depth 6. The rule was moot at zero findings.

### Item 4 — Core Web Vitals and console errors

Thresholds from `dacbc02` (`docs/TOOLING.md`, Phase 6 rows 2 and 4): LCP ≤ 2.5 s, INP ≤ 200 ms,
CLS ≤ 0.1, both viewports; zero console errors, zero hydration or React-key warnings, zero
uncaught page errors.

Maximum observed over the 50 route loads:

| Metric | Threshold | Max observed | Result |
|---|---|---|---|
| LCP | ≤ 2500 ms | 60 ms | pass |
| CLS | ≤ 0.1 | 0 | pass |
| INP (proxy) | ≤ 200 ms | 56 ms | pass |
| Console errors | 0 | 0 | pass |
| Page errors | 0 | 0 | pass |
| Hydration / key warnings | 0 | 0 | pass |

Every route passed individually; per-load numbers are in the JSON beside this run (scratchpad,
not committed).

What these numbers are not:
- **Lab, localhost, unthrottled.** No network or CPU throttling, and the server is on the same
  machine, so LCP is far below what a real device on a real network sees. This is the floor, not
  the Phase 6 measurement, which also needs the Lighthouse ≥ 90 scores and field data.
- **INP is a proxy.** INP needs real interactions. This took the longest `event` timing entry
  (≥ 16 ms) from one click and one Tab keypress per page. It is evidence that nothing is
  grossly blocked, not an INP figure.
- **The 404 route logs one console error** — the browser's own "Failed to load resource: 404"
  for the document itself, which is correct behavior for a 404 page. It is not counted against
  the threshold, and it is recorded here so that exclusion is visible rather than silent.

---

## Phase 2 — Cleanup

### Item 5 — ZBC O1–O3 (done)

Exact wording from `docs/TOOLING.md:541-543`, applied literally, one commit per item:

| Commit | Item | File | Was | Now |
|---|---|---|---|---|
| `01a56b1` | tests | `e2e/tests/phase-4-zbc.spec.ts` | — | three new tests (O1, O2, O3) plus the five-steps test updated; all 8 runs failed on the old copy before any fix |
| `2a63b88` | O1 | `apps/zbc/app/page.tsx:118` | "Only eligible views billed" | "Nothing billed before you approve the post" |
| `aff806d` | O2 | `apps/zbc/app/become-a-clipper/page.tsx:9` and `:49` | "Paid on verified views" / "Get paid on verified views" | "Paid on approved posts and verified views" (both) |
| `690a345` | O3 | `apps/zbc/app/media-kit/page.tsx:47-48` | "clients pay only for approved posts with verified views." | "clients pay only for approved posts." |

**Gate on the fixed tree:** typecheck exit 0, lint exit 0, e2e **335 passed, 1 skipped, 0 failed**
(the gate builds both apps itself). Exactly 10 captures moved, matching TOOLING.md's estimate:
ZBC home in phase-1, phase-3 and phase-4-zbc (6), become-a-clipper (2), media-kit (2). Every
other committed PNG was byte-identical after the run.

**Mutations,** each applied alone to the fixed tree, running the three O-tests plus the
five-steps test:

| Mutation | Tests that failed (both viewports) | Everything else |
|---|---|---|
| M1: O1 reverted | O1 | passed |
| M2a: O2 step title reverted | O2, five-steps | passed |
| M2b: O2 meta description reverted | O2 | passed |
| M3: O3 reverted | O3 | passed |

Each failure was an assertion failure on a tree that built. The tree was restored from a backup
after each one, and the final state is what the commits hold.

### Item 6 — Legal text slots — BLOCKED, not run

Defined only in `specs/FRONTEND_COMPLIANCE_HANDOFF_2026-09-23.md`, which does not exist in this
repo or anywhere under the home directory to depth 6. With no definition, "wire the slots" (cookie
banner, footer legal links, accessibility statement, form privacy links) would be new UI built from
a guess. The legal shells as they stand are unchanged: all six carry the required draft banner and
labeled placeholders (item 1).

### Item 7 — Phase 2 counter fix (done, `9dfefda`)

**What broke, and how it was observed.** It was not a regression: `packages/ui/src/components/counter.tsx`
has not changed since Phase 2 (`cc512d9`), so the defect has been latent since certification.
It surfaced on 2026-09-18, in a Phase 5 gate run, as a flake. `phase-2.spec.ts` "counter ticks
once, and prefers-reduced-motion disables the tick" read "0" where it expected "1,240,000", and
passed on re-run. It was routed out of Phase 5 at `TOOLING.md:719`.

**Cause.** The server rendered `format(0)`, and only a client effect swapped in the final value.
The server cannot know the visitor's motion preference, so:
- a reduced-motion visitor saw 0 until hydration;
- a visitor with JavaScript off saw 0 permanently, which fails §9 ("content fully readable with
  motion off");
- the test's immediate `textContent` read raced hydration.

The same race showed up during this run. The first O1 test failure dumped the ZBC home `<main>`
at 1440 with the example cards reading "Views0 Clips0".

**Before.** A new deterministic test — no JavaScript, both `reducedMotion` values, `/dev/system`
must serve "1,240,000" — failed 4/4 on the old component (Received: "0").

**Fix.** The server renders the final value. A client that allows motion rewinds to 0 in a
layout effect before the hydrated frame paints, so the tick still starts from zero. A
reduced-motion client never shows 0.

**After.** Typecheck 0, lint 0, e2e **339 passed, 1 skipped, 0 failed** (the 335 plus the 4 new
runs). No capture moved: captures run with reduced motion, and those already settled on final
values.

**Mutations,** each alone:
- The server `format(0)` restored: the new test fails 4/4.
- The rewind removed: the Phase 2 tick test and the ZBC "view counters tick once on entry" test
  both fail at both viewports (Expected "0", Received "1,240,000").

### Item 8 — Fixture/Stub note merge — AMBIGUOUS, not done

The brief frames this as "documentation only; must not touch rendered page content". The item
it points at — "the stacked Fixture/Stub note merge" in the pre-launch batch (auditor + founder,
2026-09-20) — is a rendered-UI change:
- `apps/zbm/app/revenue-recovery/page.tsx:131` puts a `FixtureNote` ("Fixture — eight questions
  return one prioritized leak… Nothing you enter is stored or sent.") directly above
  `AssessmentForm`.
- That form opens with its own notice (`apps/zbm/components/assessment-form.tsx:157-160`, "Stub —
  this form scores your answers on fixture rules but is not connected yet…").

The two notes stack and say overlapping things. The readiness check has the same form-level stub
notice (`readiness-check.tsx:167`), and so does the shared `LeadForm` (`packages/ui/src/lead/lead-form.tsx:92`)
used under the ZBC waitlist `FixtureNote`.

Merging them changes copy on certified pages, and no wording for the merged note is recorded
anywhere. The brief's own rule applies — stop on an ambiguous item and do not guess — so nothing
was changed. **For Andre:** confirm the item is the rendered merge, and give or approve the
merged wording.

### Item 9 — Press mailbox — FLAGGED for Andre, nothing changed

**What it is:** `apps/zbc/app/media-kit/page.tsx:69-73` shows `press@zbestclips.com` as plain
text (not a `mailto:` link), marked `data-placeholder`, with the fixture note "Placeholder — this
mailbox does not exist yet."

**What cleanup means here:** the brief itself (`ZBM-ZBC-Build-Brief-v2.md:684`) says "create the
alias before launch or replace with the founder's address". That is not a copy fix — it is **real
inbox wiring**: a mailbox or alias at the zbestclips.com mail provider, outside this repo. Once it
exists, the repo change is small: remove the placeholder marker and note, and make it a `mailto:`
link.

**Two decisions for Andre:**
1. **Alias or founder address?** The founder-address option conflicts with the standing
   no-founder-name direction (`apps/zbc/app/about/page.tsx:16`), unless the address is a role
   address.
2. **Who creates the mailbox?**

---

## Phase 3 — Structural

### Item 10 — Branch protection on `main` — BLOCKED, not run

The repo has no CI: no `.github/workflows`, so no status check exists. Protection requiring a
build check would wait on a check that never reports, which blocks every push and merge to `main`,
Andre's included. It is also a repository-settings change, outward of this branch. Ruled out of
this run by Andre. The prerequisite is a CI workflow that runs the gate (the gate needs about 2
minutes and builds both apps), followed by protection that requires that workflow's check.

---

## Seen during the run, outside its scope — not changed

- **The same "views only" claim remains in the product doc.** `apps/zbc/PRODUCT.md:35` still says
  "only approved posts with verified views are billed". The same claim also appears in the
  brief's source copy (`ZBM-ZBC-Build-Brief-v2.md:623`, `:670`); the brief is the locked
  handoff, so that is a note, not a fix. PRODUCT.md is not rendered, and it was not in O1–O3.
- **O2's literal swap breaks the step list's voice.** How It Works on Become a Clipper now reads
  "Join a campaign / Get the source material / Cut and post / Submit for review / **Paid on**
  approved posts and verified views". The first four are imperatives. "Get paid on approved posts
  and verified views" would match them. TOOLING.md gives the one replacement for both places, so
  it was applied as written — Andre's call.
- **A ZBC test name overclaims.** `phase-4-zbc.spec.ts:263`, "view counters tick once on entry,
  and not at all with reduced motion", never exercises reduced motion. The Phase 2 tests cover
  the component; the name is the only overclaim.
- **A mislabeled SHA in the reviewer's note.** The note from the other reviewer calls `1fc360f`
  "ZBC staged". It is "Add raw Phase 4 ZBM verification log and capture zip", the ZBM audit point.
  ZBC is certified at `28ef158`.

---

## Summary

| # | Item | Result | Commit(s) |
|---|---|---|---|
| 1 | Route audit | done — 50/50 loads 200 with content; 6 labeled legal placeholders; no stubs, blank, or broken pages | `6aab51b` |
| 2 | axe scan | blocked — not installed; Phase 6 control 1 | — |
| 3 | Dependency scan | done — 0 findings in 458 dependencies | `6aab51b` |
| 4 | CWV / console | done — lab LCP ≤ 60 ms, CLS 0, INP proxy ≤ 56 ms; 0 console/page errors or hydration warnings | `6aab51b` |
| 5 | ZBC O1–O3 | done — exact swaps, 10 captures, 4 mutations caught | `01a56b1`, `2a63b88`, `aff806d`, `690a345` |
| 6 | Legal text slots | blocked — defining document does not exist | — |
| 7 | Counter fix | done — latent since `cc512d9`, reproduced 4/4, fixed, 2 mutations caught | `9dfefda` |
| 8 | Fixture/Stub merge | ambiguous — it is a rendered-copy change; needs wording | — |
| 9 | Press mailbox | flagged — real-inbox wiring outside the repo; two decisions for Andre | — |
| 10 | Branch protection | blocked — no CI to require | — |

Final gate on this branch: typecheck 0, lint 0, e2e 339 passed / 1 skipped / 0 failed.
Nothing is merged to `main`, pushed, deployed, or applied to repository settings. None of this is
certified; the phase audit belongs to an independent reviewer.

---

# Housekeeping batch 2 — 2026-09-24, same branch

Source: a reviewer's note, pasted by Andre. Same boundaries as the first pass: no merge to `main`,
no new claims, nothing beyond the four items below.

## B2-1 — `apps/zbc/PRODUCT.md:35` — PROPOSED, not committed

The line and the replacement are held for one round of confirmation, as the note asks.

- **Current:** "Every submission is reviewed by a person before it counts, and only approved
  posts with verified views are billed."
- **Proposed:** "Every submission is reviewed by a person before it counts, and clients pay only
  for approved posts."

This line is client-facing billing, so it follows O3 (the Media Kit boilerplate, the same claim
in the same sentence shape), not O2, which is the clipper payout line. The same paragraph also
opens "One source, **hundreds** of clips". The Sep 17 ruling changed hundreds to dozens across
the site; PRODUCT.md was not in that sweep. This is not in B2-1's scope — flagged, not proposed.

## B2-2 — O2 step 5 voice (done, `8ba79ee`)

"Paid on approved posts and verified views" becomes "**Get** paid on approved posts and verified
views", matching the verb-first steps 1–4. The meta description keeps TOOLING.md's wording, as a
sentence fragment.
- The tests were updated first and failed 4/4 on the old title. That run is the mutation proof:
  the tests reject "Paid on…".
- Gate: typecheck 0, lint 0, e2e 339 passed / 1 skipped / 0 failed.
- Two captures re-taken (become-a-clipper, both viewports).

## B2-3 — Scans re-run at the branch tip `8ba79ee`

The Phase 1 numbers above are from `49a46d1`. Since then O1–O3, the counter and B2-2 have
changed rendered output, so the scans were re-run on a fresh production build of `8ba79ee`, with
the same method and script.

- **Accessibility (axe):** not run. It is still blocked for the reason in item 2, and no result
  is claimed.
- **Dependencies:** `pnpm audit` — "No known vulnerabilities found". Pass.
- **Routes:** 50 of 50 loads returned 200 with rendered copy, and the classifications are
  unchanged. Word counts moved only on the three O1–O3 pages: ZBC `/` 373→376,
  `/become-a-clipper` 230→233, `/media-kit` 252→249.
- **CWV / console, per route:** 0 failures. Thresholds: LCP ≤ 2500 ms, CLS ≤ 0.1, INP ≤ 200 ms,
  0 console errors, 0 hydration/key warnings. Cells show status, LCP / CLS / INP proxy, console.
  The lab, unthrottled and INP-proxy caveats from item 4 apply. † = the 404 document's own
  "Failed to load resource: 404", the expected behavior, which is not counted.

| Site | Route | 1440 | 390 |
|---|---|---|---|
| ZBM | `/` | pass — 200, 68 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 32 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBM | `/about` | pass — 200, 24 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBM | `/contact` | pass — 200, 20 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBM | `/faq` | pass — 200, 20 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBM | `/digital-advertising` | pass — 200, 60 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 36 ms / 0 / 32 ms / 0 err, 0 warn |
| ZBM | `/out-of-home` | pass — 200, 24 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBM | `/revenue-recovery` | pass — 200, 28 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 24 ms / 0 / 40 ms / 0 err, 0 warn |
| ZBM | `/search-intelligence` | pass — 200, 28 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 40 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBM | `/legal/privacy-policy` | pass — 200, 44 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 40 ms / 0 err, 0 warn |
| ZBM | `/legal/terms-of-service` | pass — 200, 44 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBM | `/legal/cookie-policy` | pass — 200, 44 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBM | `/dev/system` | pass — 200, 24 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 32 ms / 0 err, 0 warn |
| ZBM | `/this-page-does-not-exist` | pass — 404, 24 ms / 0.004 / 16 ms / 1† err, 0 warn | pass — 404, 44 ms / 0 / 40 ms / 1† err, 0 warn |
| ZBC | `/` | pass — 200, 32 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBC | `/about` | pass — 200, 28 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 40 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBC | `/faq` | pass — 200, 28 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBC | `/pricing` | pass — 200, 28 ms / 0 / 24 ms / 0 err, 0 warn | pass — 200, 36 ms / 0 / 32 ms / 0 err, 0 warn |
| ZBC | `/entertainment` | pass — 200, 28 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 40 ms / 0 / 16 ms / 0 err, 0 warn |
| ZBC | `/brands` | pass — 200, 28 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 48 ms / 0 err, 0 warn |
| ZBC | `/become-a-clipper` | pass — 200, 44 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 40 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBC | `/launch-a-campaign` | pass — 200, 52 ms / 0 / 40 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 24 ms / 0 err, 0 warn |
| ZBC | `/media-kit` | pass — 200, 28 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 20 ms / 0 / 40 ms / 0 err, 0 warn |
| ZBC | `/legal/privacy-policy` | pass — 200, 60 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 40 ms / 0 err, 0 warn |
| ZBC | `/legal/terms-of-service` | pass — 200, 60 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 40 ms / 0 err, 0 warn |
| ZBC | `/legal/cookie-policy` | pass — 200, 60 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 44 ms / 0 / 48 ms / 0 err, 0 warn |
| ZBC | `/dev/system` | pass — 200, 32 ms / 0 / 32 ms / 0 err, 0 warn | pass — 200, 24 ms / 0 / 32 ms / 0 err, 0 warn |
| ZBC | `/this-page-does-not-exist` | pass — 404, 24 ms / 0.003 / 24 ms / 1† err, 0 warn | pass — 404, 40 ms / 0 / 32 ms / 1† err, 0 warn |

## B2-4 — Everything still open from the first pass: the list, not the resolution

Held until Andre has seen it. Nothing here was acted on.

| # | Item | State | What it needs |
|---|---|---|---|
| 1 | Item 2 — axe scan | blocked | a go-ahead to install `@axe-core/playwright` (Phase 6 control 1, a supply-chain change) |
| 2 | Item 6 — legal text slots | blocked | `specs/FRONTEND_COMPLIANCE_HANDOFF_2026-09-23.md`, which the brief cites and which does not exist |
| 3 | Item 8 — Fixture/Stub note merge | ambiguous | confirmation that it is the rendered merge (RR `FixtureNote` above the form's own "Stub —" notice; the same stack on the ZBC waitlist), and the merged wording |
| 4 | Item 9 — press mailbox | flagged | two decisions: an alias or the founder's address (the latter against the no-founder-name direction unless it is a role address), and who creates the mailbox |
| 5 | Item 10 — branch protection | blocked | a CI workflow that runs the gate, first |
| 6 | B2-1 — PRODUCT.md:35 | proposed | a yes or no on the replacement above |
| 7 | PRODUCT.md "hundreds of clips" | flagged | whether PRODUCT.md is in the dozens sweep |
| 8 | Brief source copy (`ZBM-ZBC-Build-Brief-v2.md:623`, `:670`) | noted | nothing, while the brief stays the locked handoff — it still carries the pre-O1–O3 wording |
| 9 | `phase-4-zbc.spec.ts:263` test name | noted | a rename or a real reduced-motion check, whichever is preferred |

Branch tip `8ba79ee` before this log commit. Nothing is merged, pushed, deployed, or applied to
repository settings.

## B3-1 — PRODUCT.md:31: the clip count comes out, with no number put back

Founder instruction 2026-09-25 (open item 7 above). This applies the no-fabricated-metrics
principle to a file the Sep 17 "dozens" ruling did not cover. It is not a reading of that
ruling, and it leaves `apps/zbm/app/page.tsx:85` alone.

- **Original** (`apps/zbc/PRODUCT.md:31`): `One source, hundreds of clips, real reach. A client hands over one piece of long-form`
- **New:** `One source, a stream of clips, real reach. A client hands over one piece of long-form`
- It keeps the three-beat fragment of the site's hero ("One source. … Real reach.") and makes no quantity claim.
- **No verified clip count exists — revisit if a real number becomes available.**
- Not touched: line 32 still reads "cuts it into dozens of distinct short-form videos". That is outside the line
  given and is flagged for a separate call. Items 1 (the `phase-4-zbc.spec.ts:263` reduced-motion test) and
  2 (`apps/zbm/app/page.tsx:85`) are still open.

## B3-2 — The three open calls, as given by Andre 2026-09-25 ("1 go, 2 apply dozens, line 32 drop dozens too")

One commit each, in this order:

| Call | Commit | Change | Proof |
|---|---|---|---|
| 1 go (open item 9) | `6efbb86` | `phase-4-zbc.spec.ts:263` gets a real reduced-motion half: it reloads with `reduce`, waits for hydration, records every text change while the counter scrolls into view, and requires 1,240,000 throughout | two counter mutants run and then reverted, both failed 2/2: rewind-to-0 (read "0" after hydration) and tick-only (67 intermediate values recorded) |
| 2 apply dozens | `8337bb8` | `apps/zbm/app/page.tsx:85` "One source, hundreds of clips, real reach." → "One source, **dozens** of clips, real reach." | new test in `phase-4-zbm.spec.ts` failed 2/2 on the old copy; ZBM home captures re-taken (phase-1, phase-3, phase-4-zbm, both viewports) |
| line 32 drop dozens too | `2bb6595` | `apps/zbc/PRODUCT.md:32` "cuts it into dozens of distinct short-form videos" → "cuts it into distinct short-form videos" | docs only; no number put back, same as line 31 |

- Gate at `2bb6595`: typecheck 0, lint 0, e2e **341 passed, 1 skipped, 0 failed** (339 + the 2 new ZBM runs).
- The ZBC site copy still says "dozens" (Sep 17 ruling). Only PRODUCT.md dropped it; the site copy was left as is.
- Still open from B2-4: items 1–6 and 8. Nothing is merged, pushed, or deployed. The branch is local only.

## B3-3 — B2-1 applied: PRODUCT.md:35 (`83272c8`)

Founder instruction 2026-09-25, given directly in this window. The earlier "6 yes" messages
reached this session only as quotes inside pasted third-party notes, so they were not acted on.

- **Original:** "…person before it counts, and only approved posts with verified views are billed."
- **New:** "…person before it counts, and clients pay only for approved posts."
- This follows O3 (the Media Kit boilerplate), as proposed in B2-1. Docs only, so no test or capture changes.
- Still open from B2-4: items 1–5. B2-4 item 8 (the brief's source copy) needs nothing while the brief stays locked.
- Pushed commits end at `b329328`. This commit and the log commit are local until pushed.

## P6-3 — Security headers (Andre 2026-10-28, launch Nov 8)

Applied in both apps from `packages/ui/src/security-headers.ts`: CSP, HSTS (2 years,
includeSubDomains, no preload), X-Content-Type-Options, Referrer-Policy,
Permissions-Policy, X-Frame-Options. vercel.live allowed on previews only;
'unsafe-eval' and ws: in `next dev` only. zod set to jitless in its 4 importers.
Guarded by `e2e/tests/phase-6-security-headers.spec.ts`.

Logged for after launch:

- **Hash-based CSP.** script-src still carries 'unsafe-inline' because Next.js puts
  per-page inline startup scripts in every statically built page. Upgrade: hash
  those scripts at build time (or nonces, if per-request rendering is accepted)
  and drop 'unsafe-inline'. style-src 'unsafe-inline' goes in the same pass.
- **Stale ZBM screenshots (follow-up PR after step 4).** `96db6e6` changed the ZBM
  nav and footer on every page but did not re-capture the phase 1–5 PNGs; 75 ZBM
  PNGs on main differ from what the gate now captures. Own PR, not fixed yet.
