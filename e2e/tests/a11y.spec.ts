import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";
import {
  FORM_ROUTES,
  SITES,
  banner,
  expectControlBorders,
  expectFocusNeverHidden,
  expectNoViolations,
  focused,
  isMobile,
  presetConsent,
  siteOf,
  walk,
} from "../support/a11y";
import { formReady } from "../support/ready";

/**
 * Accessibility gate (WCAG 2.2 AA), run on EVERY PR inside the required `e2e`
 * check — Andre's locked requirement: automated axe checks in the Playwright
 * suite on every change, and a failure blocks release.
 *
 * Every PR:
 *   1. axe-core on every route of both sites, in every state a visitor can
 *      reach without data: consent banner open, banner details open, banner
 *      dismissed, the nav menu and an FAQ open, and each form's error state. ZERO violations, nothing disabled, and no undecided contrast
 *      result outside a reviewed allowlist. One axe pass per state.
 *      Plus WCAG 1.4.11 on every form control's border (axe cannot see it).
 *   2. Scripted keyboard checks (@keyboard) for what axe cannot see: focus
 *      never fully hidden (2.4.11) on seven key routes, menu and banner at
 *      400% zoom (1.4.10), the skip link (2.4.1), the cookie settings reopen
 *      and Escape, focus after a form submit (2.4.3), and the hero's contrast
 *      mid-scroll (1.4.3).
 *
 * Nightly (tests/a11y.nightly.spec.ts and .github/workflows/a11y-nightly.yml):
 * focus walks on EVERY route, axe on every form's success screen, a Firefox
 * project, and the @keyboard tests repeated three times with no retries.
 *
 * What none of this proves: anything a screen reader would tell a person.
 * That pass is manual; docs/accessibility.md records it.
 *
 * Origin: the Oct 30 2026 WCAG 2.2 AA audit (S1–S4, M1–M6, Z1–Z2) and its
 * AEGIS review (F1–F9).
 */

// ---------------------------------------------------------------------------
// 1. axe on every route, every reachable state.
// ---------------------------------------------------------------------------

for (const { site, base, routes } of SITES) {
  test.describe(`axe ${site}`, () => {
    // Up to five axe passes per route; the default 30 s is too tight on a
    // loaded runner. A real hang still fails.
    test.describe.configure({ timeout: 180_000 });
    for (const route of routes) {
      test(`${site} ${route}`, async ({ page }, testInfo) => {
        await page.goto(base + route, { waitUntil: "networkidle" });
        const where = `${site}${route} [${testInfo.project.name}]`;

        // First visit: the consent banner is open.
        await expect(banner(page)).toBeVisible();
        await expectNoViolations(page, `${where} banner open`);

        await page.getByRole("button", { name: "What we store" }).click();
        await expectNoViolations(page, `${where} banner details open`);

        await page.getByRole("button", { name: "Reject non-essential" }).click();
        await expect(banner(page)).toBeHidden();

        // No overlay open, first FAQ answer open: page text that the banner
        // or a menu covers in the other states — the FAQ answer included —
        // is measured here, uncovered (AEGIS r2, F5 gap).
        const faq = page.locator("main h3 > button[aria-expanded]").first();
        const hasFaq = (await faq.count()) > 0;
        if (hasFaq) {
          if ((await faq.getAttribute("aria-expanded")) === "false") await faq.click();
          await expect(faq).toHaveAttribute("aria-expanded", "true");
        }
        await expectNoViolations(page, `${where} banner dismissed${hasFaq ? ", FAQ open" : ""}`);
        await expectControlBorders(page, `${where} banner dismissed`);

        // The nav menu open.
        const header = page.locator("header:has(> nav[aria-label='Primary'])");
        if (isMobile(testInfo)) {
          await header.getByRole("button", { name: "Menu" }).click();
        } else {
          const dropdown = header.locator("button[aria-expanded]").first();
          if (await dropdown.count()) await dropdown.click();
        }
        await expectNoViolations(page, `${where} menu open`);
        await page.keyboard.press("Escape");

        // Each form's error state: submitted empty.
        const forms = page.locator("form[data-lead-form]");
        const count = await forms.count();
        for (let i = 0; i < count; i++) {
          const form = await formReady(forms.nth(i));
          await form.locator("button[type=submit]").click();
          await expect(form.locator("[aria-invalid='true'], [data-invalid='true'], [role='alert']").first()).toBeVisible();
        }
        if (count) {
          await expectNoViolations(page, `${where} form errors`);
          await expectControlBorders(page, `${where} form errors`);
        }
      });
    }

    // Any indexable route added later is scanned even before it is listed
    // above, so a new page cannot ship unscanned.
    test(`${site} sitemap routes not listed above`, async ({ page, request }, testInfo) => {
      const xml = await (await request.get(`${base}/sitemap.xml`)).text();
      const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname || "/");
      const extra = paths.filter((p) => !(routes as readonly string[]).includes(p));
      for (const path of extra) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        await expectNoViolations(page, `${site}${path} (from sitemap) [${testInfo.project.name}]`);
        await page.getByRole("button", { name: "Reject non-essential" }).click();
        await expectControlBorders(page, `${site}${path} (from sitemap) [${testInfo.project.name}]`);
      }
    });
  });
}

// AEGIS r2 N1 probe, kept as a regression test: a light pseudo-element
// background behind the banner's grey description puts it at about 2:1.
// axe cannot decide it (pseudoContent), and the overlay exemption must not
// pass it on the strength of the banner's dark panel. The gate MUST fail.
test("the gate fails on low-contrast banner text over a pseudo-element background (exemption probe)", async ({ page }) => {
  await page.goto(ZBM_BASE_URL + "/contact", { waitUntil: "networkidle" });
  await expect(banner(page)).toBeVisible();
  await page.addStyleTag({
    content: `
      [role="dialog"] #cookie-consent-heading + p { position: relative; isolation: isolate; }
      [role="dialog"] #cookie-consent-heading + p::before {
        content: ""; position: absolute; inset: 0; z-index: -1; background: rgb(237 237 240 / 0.85);
      }`,
  });
  await expect(expectNoViolations(page, "probe")).rejects.toThrow(/color-contrast needs review|axe violations/);
});

// ---------------------------------------------------------------------------
// 2. Scripted keyboard checks: what axe cannot see.
// ---------------------------------------------------------------------------

/** The seven routes walked on every PR; the nightly run walks all of them. */
const FOCUS_ROUTES = [
  { base: ZBM_BASE_URL, route: "/" },
  { base: ZBM_BASE_URL, route: "/start" },
  { base: ZBM_BASE_URL, route: "/revenue-recovery" },
  { base: ZBM_BASE_URL, route: "/contact" },
  { base: ZBM_BASE_URL, route: "/faq" },
  { base: ZBC_BASE_URL, route: "/" },
  { base: ZBC_BASE_URL, route: "/launch-a-campaign" },
];

test.describe("keyboard @keyboard", () => {
  // Keyboard walks press Tab a few hundred times per test.
  test.describe.configure({ timeout: 180_000 });

  for (const { base, route } of FOCUS_ROUTES) {
    test(`2.4.11 focus is never fully hidden — ${siteOf(base)} ${route}`, async ({ page }) => {
      await expectFocusNeverHidden(page, base + route);
    });
  }

  for (const base of [ZBM_BASE_URL, ZBC_BASE_URL]) {
    const site = siteOf(base);

    test(`1.4.10 at 400% zoom (320x256): the open menu and the banner stay reachable — ${site}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 256 });

      // Banner: within the viewport, heading on screen, every stop visible.
      await page.goto(base + "/", { waitUntil: "networkidle" });
      const box = (await banner(page).boundingBox())!;
      expect(box.y, "banner top inside the viewport").toBeGreaterThanOrEqual(0);
      expect(box.height, "banner at most half the viewport").toBeLessThanOrEqual(256 / 2 + 1);
      await expect(page.locator("#cookie-consent-heading")).toBeInViewport();
      expect(await walk(page, "Shift+Tab", 6), "banner buttons").toEqual([]);

      // Mobile menu (S3): every link in the open panel can be seen when focused.
      await presetConsent(page);
      await page.goto(base + "/", { waitUntil: "networkidle" });
      const menu = page.getByRole("button", { name: "Menu" });
      // Read before opening: the button is renamed "Close" once open.
      const panel = page.locator(`[id="${await menu.getAttribute("aria-controls")}"]`);
      await menu.focus();
      await page.keyboard.press("Enter");
      await expect(panel).toBeVisible();
      const links = await panel.locator("a").count();
      const hidden: string[] = [];
      for (let i = 0; i < links; i++) {
        await page.keyboard.press("Tab");
        const f = await focused(page);
        if (f.hidden) hidden.push(f.name);
      }
      expect(hidden, "menu links focused but not visible").toEqual([]);
    });

    test(`2.4.1 skip link is the first stop and moves focus to <main> — ${site}`, async ({ page }) => {
      await presetConsent(page);
      await page.goto(base + "/about", { waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      const f = await focused(page);
      expect(f.name).toMatch(/skip to content/i);
      expect(f.hidden, "skip link visible when focused").toBe(false);
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
    });
  }

  test("2.4.3 'Change cookie settings' moves focus into the banner, and back after a choice", async ({ page }) => {
    await presetConsent(page);
    await page.goto(ZBM_BASE_URL + "/legal/cookie-policy", { waitUntil: "networkidle" });
    const opener = page.getByRole("button", { name: "Change cookie settings" });
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeVisible();
    await expect(page.locator("#cookie-consent-heading")).toBeFocused();
    // Keyboard to "Reject non-essential": the next stops are inside the banner.
    const reject = page.getByRole("button", { name: "Reject non-essential" });
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      if (await reject.evaluate((b) => b === document.activeElement)) break;
    }
    await expect(reject).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeHidden();
    await expect(opener).toBeFocused();
  });

  // AEGIS F9: Escape never records a consent choice.
  test("Escape collapses the banner details, then closes a reopened banner, without changing the choice", async ({ page }) => {
    await presetConsent(page);
    await page.goto(ZBM_BASE_URL + "/legal/cookie-policy", { waitUntil: "networkidle" });
    const stored = () => page.evaluate(() => localStorage.getItem("zbest-cookie-consent"));
    const before = await stored();
    const opener = page.getByRole("button", { name: "Change cookie settings" });
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeVisible();

    const toggle = banner(page).getByRole("button", { name: "What we store" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#cookie-consent-detail")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#cookie-consent-detail")).toBeHidden();
    await expect(banner(page).getByRole("button", { name: "What we store" })).toBeFocused();
    await expect(banner(page)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(banner(page)).toBeHidden();
    await expect(opener).toBeFocused();
    expect(await stored(), "Escape made no consent choice").toBe(before);
  });

  test("Escape on a first-visit banner collapses the details but does not dismiss it", async ({ page }) => {
    await page.goto(ZBM_BASE_URL + "/", { waitUntil: "networkidle" });
    await expect(banner(page)).toBeVisible();
    const toggle = banner(page).getByRole("button", { name: "What we store" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#cookie-consent-detail")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#cookie-consent-detail")).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(banner(page), "a choice is still required").toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("zbest-cookie-consent"))).toBeNull();
  });

  // GPC (site-region) + focus safety + Escape, merged (AEGIS r1 F6, r2): with
  // Global Privacy Control on, no banner shows and a rejection is stored.
  // Reopening by keyboard focuses the heading, "Accept all" is absent,
  // Escape collapses the details, then closes the banner, focus returns to
  // the button, and the GPC rejection is still what is stored.
  test("GPC: reopen by keyboard, no Accept all, Escape closes without changing the stored rejection", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true, configurable: true });
    });
    await page.goto(ZBM_BASE_URL + "/legal/cookie-policy", { waitUntil: "networkidle" });
    await expect(banner(page)).toBeHidden();
    const stored = () => page.evaluate(() => localStorage.getItem("zbest-cookie-consent"));
    await expect.poll(stored).toContain('"rejected-non-essential"');
    const before = await stored();

    const opener = page.getByRole("button", { name: "Change cookie settings" });
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeVisible();
    await expect(page.locator("#cookie-consent-heading")).toBeFocused();
    await expect(banner(page).getByRole("button", { name: "Accept all" })).toHaveCount(0);
    await expect(banner(page).locator("[data-gpc-note]")).toBeVisible();

    const toggle = banner(page).getByRole("button", { name: "What we store" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#cookie-consent-detail")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#cookie-consent-detail")).toBeHidden();
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(banner(page)).toBeHidden();
    await expect(opener).toBeFocused();
    expect(await stored(), "Escape left the GPC rejection as it was").toBe(before);
  });

  // AEGIS r2 N2: "Change cookie settings" pressed while the FIRST-VISIT
  // banner is still up (nothing stored yet). Escape must not dismiss it.
  test("Escape does not dismiss a first-visit banner reopened before any choice", async ({ page }) => {
    await page.goto(ZBM_BASE_URL + "/legal/cookie-policy", { waitUntil: "networkidle" });
    await expect(banner(page)).toBeVisible();
    await page.getByRole("button", { name: "Change cookie settings" }).click();
    await expect(page.locator("#cookie-consent-heading")).toBeFocused();
    const toggle = banner(page).getByRole("button", { name: "What we store" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
    await expect(page.locator("#cookie-consent-detail")).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(banner(page), "a choice is still required").toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("zbest-cookie-consent"))).toBeNull();
  });

  // Every form, submitted empty from the keyboard: focus must land on the
  // first invalid control, never on <body> (M5).
  for (const { base, route } of FORM_ROUTES) {
    test(`2.4.3 empty submit moves focus to the first invalid control — ${siteOf(base)} ${route}`, async ({ page }) => {
      await presetConsent(page);
      await page.goto(base + route, { waitUntil: "networkidle" });
      const forms = page.locator("form[data-lead-form]");
      const count = await forms.count();
      expect(count, "form present").toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const form = await formReady(forms.nth(i));
        await form.locator("button[type=submit]").focus();
        await page.keyboard.press("Enter");
        await expect
          .poll(() =>
            form.evaluate((f) => {
              const a = document.activeElement;
              return !!a && f.contains(a) && (a.getAttribute("aria-invalid") === "true" || !!a.closest("[data-invalid='true']"));
            }),
          )
          .toBe(true);
        // ...and it is the FIRST one, in DOM order.
        expect(
          await form.evaluate(
            (f) => f.querySelector('[aria-invalid="true"], [data-invalid="true"] input:not([type="hidden"])') === document.activeElement,
          ),
        ).toBe(true);
      }
    });
  }

  // While sending, the focused button keeps focus; the result or the failure
  // takes it when the response arrives (M5). The response is stubbed: this is
  // about focus, not delivery (phase-7 covers delivery), and a stub makes it
  // independent of which fields the form asks for.
  for (const outcome of ["accepted", "failed"] as const) {
    test(`2.4.3 lead form keeps focus while sending, then focuses the ${outcome} message`, async ({ page }) => {
      await presetConsent(page);
      let release!: () => void;
      const held = new Promise<void>((r) => (release = r));
      await page.route("**/api/lead", async (route) => {
        await held;
        await route.fulfill(
          outcome === "accepted"
            ? { status: 200, json: { ok: true, submission_id: "a11y-stub" } }
            : { status: 503, json: { ok: false, error: { code: "unavailable" } } },
        );
      });
      await page.goto(ZBM_BASE_URL + "/contact", { waitUntil: "networkidle" });
      const form = await formReady(page.locator('form[data-lead-form="contact"]'));
      const send = form.locator("button[type=submit]");
      await send.focus();
      await page.keyboard.press("Enter");
      await expect(send).toHaveAttribute("aria-disabled", "true");
      await expect(send, "the sending button keeps focus").toBeFocused();
      release();
      const target = outcome === "accepted" ? page.locator('[data-lead-result="accepted"]') : page.locator("[data-lead-failure]");
      await expect(target).toBeFocused();
    });
  }

  // AEGIS F9: the server rejects a field this form does not render. There is
  // no field to focus, so the summary becomes visible, names the problem and
  // takes focus; the form stays usable.
  test("2.4.3 a server rejection for a field the form does not show focuses a visible summary", async ({ page }) => {
    await presetConsent(page);
    const message = "That source isn’t one we recognise.";
    let calls = 0;
    await page.route("**/api/lead", async (route) => {
      calls++;
      await route.fulfill({
        status: 400,
        json: { ok: false, error: { code: "validation", fields: { not_a_rendered_field: message } } },
      });
    });
    await page.goto(ZBM_BASE_URL + "/contact", { waitUntil: "networkidle" });
    const form = await formReady(page.locator('form[data-lead-form="contact"]'));
    await form.locator("button[type=submit]").focus();
    await page.keyboard.press("Enter");
    const summary = form.locator("[data-lead-invalid-summary]");
    await expect(summary).toBeFocused();
    await expect(summary).toBeVisible();
    await expect(summary).toContainText("Some fields need attention.");
    await expect(summary).toContainText(message);
    expect(calls).toBe(1);
    // Not locked: a second submit goes out (AEGIS F8 — the guard is released).
    await form.locator("button[type=submit]").focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => calls).toBe(2);
  });

  test("1.4.3 hero text keeps its contrast mid-scroll (motion on)", async ({ page }) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(ZBM_BASE_URL + "/", { waitUntil: "networkidle" });
    for (const y of [150, 300, 450]) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(250);
      // No ancestor of the hero copy may be faded.
      const opacity = await page.locator("main header h1").evaluate((el) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
        return o;
      });
      expect(opacity, `hero opacity at ${y}px`).toBe(1);
      const r = await new AxeBuilder({ page }).withRules(["color-contrast"]).include("main header").analyze();
      expect(r.violations.map((v) => v.id), `contrast at ${y}px`).toEqual([]);
    }
  });
});
