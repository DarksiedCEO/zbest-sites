# Accessibility: what is checked, and how

Target: **WCAG 2.2 Level AA** on both sites (Z Best Media, Z Best Clips).

This file records what is checked automatically on every change, what still has to be checked by a person at each phase gate, and what has not been done yet. The public claim on `/websites` ("built to WCAG 2.2 AA as the target and checked automatically on every change") must stay true to this file. It must not claim screen-reader testing until the screen-reader pass below is recorded as done.

Origin: the WCAG 2.2 AA audit of `main` at 6960b6b (Oct 30 2026), which found 4 Serious, 6 Moderate and 10 Minor issues on ZBM and 2 Critical issues on ZBC. The fixes are on branch `a11y-wcag22aa`.

## Automated, on every change (blocks merge)

`e2e/tests/a11y.spec.ts` runs inside the required `e2e` check (`.github/workflows/ci.yml`), on both gate projects: desktop-1440 (Chromium) and mobile-390 (iPhone 14 on WebKit). **A failure blocks the merge.**

| Check | What it covers |
|---|---|
| axe-core (`@axe-core/playwright` 4.13.0, pinned), tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` | Every ZBM route (20, including the unlinked `/search-intelligence` and the 404) and every ZBC route (13), in each state a visitor can reach: consent banner open, banner details open, banner dismissed with the nav menu and the first FAQ answer open, and every form submitted empty (error state). **Zero violations allowed. No rule is disabled.** |
| axe best-practice rules `heading-order`, `page-has-heading-one`, `landmark-one-main`, `skip-link` | The same states. These guard the audit's heading and skip-link fixes, which axe does not tag as WCAG. |
| Sitemap sweep | Any route in `sitemap.xml` that is not in the spec's lists is scanned too, so a new page cannot ship unscanned. |
| 2.4.11 Focus Not Obscured | Tab and Shift+Tab through `/`, `/start`, `/revenue-recovery`, `/contact`, `/faq` (ZBM) and `/`, `/launch-a-campaign` (ZBC) with the banner open, and Shift+Tab with it dismissed. No focused element may be entirely covered by the sticky header or the banner, or sit outside the viewport. |
| 1.4.10 Reflow at 400% zoom | At 320×256: the banner fits within half the viewport with its heading on screen, and every link in the open mobile menu is visible when focused. |
| 2.4.1 Skip link | The first Tab stop is "Skip to content". It is visible when focused and moves focus to `<main>`. |
| 2.4.3 Focus order | "Change cookie settings" moves focus into the banner and returns it to the button after a choice. An empty submit on every form moves focus to the first invalid control. While sending, the submit button keeps focus. The success or failure message takes focus when the response arrives. |
| 1.4.3 Contrast mid-scroll | With motion on, the homepage hero is never faded and passes axe `color-contrast` at 150, 300 and 450 px of scroll. |

Also enforced by the required `lint` check: `eslint-plugin-jsx-a11y` rules from `eslint-config-next`. For example, it flagged `aria-invalid` on radio inputs during this work.

What automation cannot tell you:

- whether a screen reader announces things sensibly;
- whether the focus order makes sense to a person;
- whether link text and headings are meaningful out of context;
- anything in Firefox or Safari desktop. The gate runs Chromium and WebKit-mobile only.

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
- [ ] On the Cookie Policy page, "Change cookie settings" moves focus into the banner. After a choice, focus returns to the button.
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
- m6: there is no authored `:focus-visible` style; the site relies on the browser default. Firefox and Safari are UNVERIFIED.
- m9: no "opens in a new tab" cue.
- m10: without JavaScript, the mobile menu and the FAQ answers cannot be reached.
- Not executed: 200% text-only zoom (1.4.4) and Windows High Contrast / forced-colors.
- The accessibility statement page (`/accessibility`) is being added on a separate branch.
