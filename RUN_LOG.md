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
