# Accessibility: what is checked, and how

Target: **WCAG 2.2 Level AA** on both sites (Z Best Media, Z Best Clips).

This file records what is checked automatically, what still has to be checked by a person at each phase gate, and what has not been done yet.

**Public wording.** The Websites service page (`/websites`) says client sites are "built to WCAG 2.2 AA as the target, with automated accessibility checks and keyboard testing before launch". That line is a promise about **client** deliverables, so it must not promise more than a client build gets. It promises checks before launch, not on every change after handoff. Any statement about **this** site's own process belongs on the accessibility statement page (`/legal/accessibility`, legal branch), not in the service copy. Neither may claim screen-reader testing until the screen-reader pass below is recorded as done.

Origin: the WCAG 2.2 AA audit of `main` at 6960b6b (Oct 30 2026), which found 4 Serious, 6 Moderate and 10 Minor issues on ZBM and 2 Critical issues on ZBC. The fixes are on branch `a11y-wcag22aa`. The AEGIS review of that branch (findings F1–F9) shaped the gate below.

## Automated on every PR (blocks merge)

`e2e/tests/a11y.spec.ts` runs inside the required `e2e` check (`.github/workflows/ci.yml`). The gate runs as two parallel jobs, `e2e (desktop-1440)` on Chromium and `e2e (mobile-390)` on WebKit with the iPhone 14 profile. The job named `e2e` fails unless both pass, and that is the check branch protection requires. **A failure blocks the merge.**

| Check | What it covers |
|---|---|
| axe-core (`@axe-core/playwright` 4.13.0, pinned), tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, plus best-practice `heading-order`, `page-has-heading-one`, `landmark-one-main`, `skip-link` | Every ZBM route (22, including the unlinked `/search-intelligence` and the 404) and every ZBC route (13). Each is scanned in every state a visitor can reach: consent banner open, banner details open, banner dismissed with the first FAQ answer open (no overlay open), nav menu open, and every form submitted empty (error state). axe runs once per state, and the gate asserts that the four best-practice rules actually ran. **Zero violations allowed. No rule is disabled.** |
| axe "needs review" contrast | An undecided `color-contrast` result **fails** the gate, with three named exceptions in `e2e/support/a11y.ts`. (1) Two decorative `aria-hidden` glyphs that axe cannot measure: the `→` after link labels and the `▾` on menu buttons. (2) Page text covered by an open overlay (the banner or a menu panel); that text, including the open FAQ answer, is measured in the "banner dismissed" state with nothing over it. (3) Text inside an overlay that axe left undecided **only** because something overlaps its box (`bgOverlap`, `elmPartiallyObscuring`, `elmPartiallyObscured`). The gate measures that text itself against the overlay's own opaque background and requires 4.5:1, or 3:1 for large text. The sticky site header also counts as an overlay, but its background is translucent (95%), so there the gate bounds the background instead. It composites black and white under the panel, and the text must clear the ratio against every colour in that range. It stays undecided, and fails, if a pseudo-element background, opacity, a filter, a blend mode or another painted element touches the text. A probe test proves that a light `::before` behind the banner's grey text fails the gate. |
| axe results that are **not** gated | Only axe **violations** (every rule) and **needs-review `color-contrast`** results fail the gate. Needs-review ("incomplete") results from every other rule are **not** gated, for example `link-in-text-block` (1.4.1), `video-caption` and `frame-tested`. Rules that do not apply to a page ("inapplicable") are not reported. Review the needs-review list by hand at each phase gate, from the axe output of any route. |
| Form control borders (WCAG 1.4.11; axe has no rule for it) | Every visible text field, select and textarea, and the box of every custom radio and checkbox, must have a border of at least 3:1 against the background just outside it. Checked in the banner-dismissed and form-error states on every route. Proven to fail on the old faint borders (`/35`, about 1.7:1). |
| Sitemap sweep | Any route in `sitemap.xml` that is not in the spec's lists is scanned too, so a new page cannot ship unscanned. |
| 2.4.11 Focus Not Obscured | Tab and Shift+Tab with the banner open, and Shift+Tab with it dismissed, on seven routes: `/`, `/start`, `/revenue-recovery`, `/contact` and `/faq` on ZBM, and `/` and `/launch-a-campaign` on ZBC. No focused element may be entirely covered by the sticky header or the banner, or sit outside the viewport. The nightly run walks every route. |
| 1.4.10 Reflow at 400% zoom | At 320×256: the banner fits within half the viewport with its heading on screen, and every link in the open mobile menu is visible when focused. |
| 2.4.1 Skip link | The first Tab stop is "Skip to content". It is visible when focused and moves focus to `<main>`. |
| 2.4.3 Focus order | "Change cookie settings" moves focus into the banner and returns it to the button after a choice. **Escape** collapses the banner details and returns focus to their toggle. On a banner reopened over a stored choice, Escape closes it without changing that choice. With no stored choice (a first visit, even if "Change cookie settings" was pressed), the banner stays until a choice is made. An empty submit on every form moves focus to the first invalid control. While sending, the submit button keeps focus, and the success or failure message takes focus when the response arrives. A server rejection for a field the form does not show produces a visible summary that takes focus, and the form stays usable. |
| 1.4.3 Contrast mid-scroll | With motion on, the homepage hero is never faded and passes axe `color-contrast` at 150, 300 and 450 px of scroll. |

**Lint (required `lint` check).** eslint-plugin-jsx-a11y's 31 recommended rules run at **error** level on every `.tsx` file in both apps and in `packages/ui`, where the shared forms, banner and nav live (`packages/config/eslint/a11y.mjs`). An error fails `lint`. Before this change, eslint-config-next ran six of these rules as warnings, which can never fail `eslint .`.

## Automated nightly (does not block merges)

`.github/workflows/a11y-nightly.yml` runs every night and on every push to `main`. A failure opens an issue, or comments on the open one. It adds what is too slow for every PR:

- 2.4.11 focus walks on **every** route of both sites (`e2e/tests/a11y.nightly.spec.ts`);
- each form's **success screen**, reached with a real submission to the gate's fake lead transport: focus must land on the result, axe must be clean, and borders must pass 1.4.11;
- all of the accessibility specs on **Firefox** (`firefox-1440`), alongside Chromium desktop and WebKit mobile;
- the PR spec's `@keyboard` tests **three times** over with retries off, so a flake that the PR gate's single retry would hide shows up here.

**What automation cannot tell you:**

- whether a screen reader announces things sensibly;
- whether the focus order makes sense to a person;
- whether link text and headings are meaningful out of context;
- anything in desktop Safari.

## Manual, at every phase gate

Record each pass in that phase's verification log (`docs/phase-*-verification-log.md`): the date, who did it, the browser and assistive technology versions, the routes covered, and what was found.

### Keyboard only (no mouse, no trackpad)

On every new or changed route, at desktop width and at 390 px:

- [ ] The first Tab shows "Skip to content". Enter on it moves to the main content.
- [ ] Every link, button and field can be reached with Tab and Shift+Tab, in an order that matches the visual order.
- [ ] Focus is visible on every stop. It is never hidden under the header, the cookie banner or anything else.
- [ ] Menus open with Enter or Space, close with Escape, and do not trap focus.
- [ ] The FAQ answers open and close with Enter and Space.
- [ ] Each form, submitted empty with Enter, puts focus on the first field that needs fixing, and the message under that field says what to fix.
- [ ] Each form, submitted correctly with Enter, keeps focus on Send while it is sending, then moves focus to the confirmation.
- [ ] On the Cookie Policy page, "Change cookie settings" moves focus into the banner. After a choice, focus returns to the button. Escape closes the details, then the banner, without changing the choice.
- [ ] At 400% browser zoom (or a 320 px wide window), nothing needs sideways scrolling. The open menu and the banner scroll and are fully reachable.

### Screen reader

**Status: NOT YET DONE.** No screen-reader pass has been run on either site. This sandbox has no screen reader. Until this pass is recorded, the site must not claim screen-reader testing anywhere, including the accessibility statement and the `/websites` copy.

At each phase gate, use NVDA with Firefox or Chrome on Windows, VoiceOver with Safari on macOS, and VoiceOver on iOS (TalkBack on Android if available):

- [ ] Page title and `<h1>` are announced. The heading list (NVDA H / VoiceOver rotor) reads as an outline of the page, with no skipped levels.
- [ ] Landmarks are announced: banner, Primary navigation, main and contentinfo.
- [ ] The cookie banner is announced as "Cookies on this site". Its buttons have clear names. After "Change cookie settings", the banner heading is read.
- [ ] The ZBC homepage example figures are read as their final numbers (for example "1,240,000"), not as nothing and not as a count in progress.
- [ ] Every form field's label is read. Optional fields say "(optional)". On an error, the field is announced as invalid together with its message, and "Some fields need attention" / "Some answers need attention" is announced.
- [ ] While a form is sending, the button reads as unavailable (aria-disabled). The confirmation, or the failure message, is read when it arrives.
- [ ] Links that open a new tab are identifiable. This is audit item m9 and is still open.

## Known open items (from the Oct 30 audit, not yet fixed)

- m2: required fields are not marked programmatically (`aria-required`).
- m4: the "Sending…" state is not announced through a live region.
- m5: some small targets pass only through the 2.5.8 spacing exception.
- m6: there is no authored `:focus-visible` style; the site relies on the browser default.
- m9: no "opens in a new tab" cue.
- m10: without JavaScript, the mobile menu and the FAQ answers cannot be reached.
- Not executed: 200% text-only zoom (1.4.4) and Windows High Contrast / forced-colors.
- The 1.4.11 border check reads background colours, not background images or gradients. A control placed over an image would need a manual check.
- The public accessibility statement (`/legal/accessibility`, text in `apps/zbm/lib/legal.ts`) mirrors this file: its "Known limitations" are the open items above, and it claims no screen-reader testing. Change both in the same commit.
