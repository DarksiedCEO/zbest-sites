import { expect, test, type Locator } from "@playwright/test";
import {
  FORM_ROUTES,
  SITES,
  expectControlBorders,
  expectFocusNeverHidden,
  expectNoViolations,
  presetConsent,
  siteOf,
} from "../support/a11y";
import { formReady } from "../support/ready";

/**
 * Nightly extension of the accessibility gate (AEGIS F3). Runs ONLY under
 * A11Y_NIGHTLY=1 (playwright.config.ts ignores *.nightly.spec.ts otherwise),
 * from .github/workflows/a11y-nightly.yml: every night, and on every push to
 * main. A failure opens (or comments on) an issue.
 *
 * It adds what is too slow for every PR:
 *   - WCAG 2.4.11 focus walks on EVERY route of both sites (PRs walk seven);
 *   - axe and the 1.4.11 border check on every form's SUCCESS screen, reached
 *     with a real submission to the gate's fake lead transport;
 *   - a Firefox project (the workflow also runs WebKit mobile and Chromium
 *     desktop), and the PR spec's @keyboard tests three times over with no
 *     retries, so a flake the PR's single retry hides shows up here.
 */

test.describe.configure({ timeout: 300_000 });

for (const { site, base, routes } of SITES) {
  for (const route of routes) {
    test(`2.4.11 focus is never fully hidden — ${site} ${route}`, async ({ page }) => {
      await expectFocusNeverHidden(page, base + route);
    });
  }
}

/**
 * Fills every visible control with a value its server accepts: text by name
 * or type, the first real option of each select, the first radio of each
 * group, and the first box of each checkbox group.
 */
async function fillValid(form: Locator) {
  await form.evaluate((f) => {
    const set = (el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) => {
      const proto = Object.getPrototypeOf(el) as object;
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const shown = (el: Element) => !el.closest('[aria-hidden="true"], [hidden]');
    for (const el of f.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]), textarea',
    )) {
      if (!shown(el) || el.value) continue;
      const key = `${el.name} ${el.type} ${el.autocomplete}`.toLowerCase();
      set(
        el,
        /email|reach/.test(key)
          ? "a11y-nightly@example.com"
          : /url|website|site/.test(key)
            ? "https://example.com"
            : el instanceof HTMLTextAreaElement
              ? "Nightly accessibility check: a valid submission, sent to the gate's fake transport."
              : "A11y Nightly",
      );
    }
    for (const el of f.querySelectorAll<HTMLSelectElement>("select")) {
      if (!shown(el) || el.value) continue;
      const option = [...el.options].find((o) => o.value && !o.disabled);
      if (option) set(el, option.value);
    }
    const groups = new Set<string>();
    for (const el of f.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')) {
      if (!shown(el) || groups.has(el.name)) continue;
      groups.add(el.name);
      if (![...f.querySelectorAll<HTMLInputElement>(`input[name="${CSS.escape(el.name)}"]`)].some((x) => x.checked)) el.click();
    }
  });
}

for (const { base, route } of FORM_ROUTES) {
  test(`success screen: focus on the result, axe clean — ${siteOf(base)} ${route}`, async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(base + route, { waitUntil: "networkidle" });
    const forms = page.locator("form[data-lead-form]");
    const count = await forms.count();
    expect(count, "form present").toBeGreaterThan(0);
    // One form per page load: a success replaces the form, and a page may
    // hold more than one.
    for (let i = 0; i < count; i++) {
      if (i > 0) await page.goto(base + route, { waitUntil: "networkidle" });
      const form = await formReady(page.locator("form[data-lead-form]").nth(i));
      await fillValid(form);
      await form.locator("button[type=submit]").focus();
      await page.keyboard.press("Enter");
      const result = page.locator('[role="status"][tabindex="-1"]');
      await expect(result, "the result takes focus").toBeFocused({ timeout: 20_000 });
      const where = `${siteOf(base)}${route} form ${i + 1} success [${testInfo.project.name}]`;
      await expectNoViolations(page, where);
      await expectControlBorders(page, where);
    }
  });
}
