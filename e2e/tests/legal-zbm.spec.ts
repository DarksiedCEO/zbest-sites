import { expect, test, type Page } from "@playwright/test";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Z Best Media legal documents in effect (founder decision Oct 30 2026).
 * Notice at collection: every form that collects personal information shows
 * the notice BEFORE its submit button, linking to policy sections that exist.
 */

const CONSENT_KEY = "zbest-cookie-consent";

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

const FORMS = [
  { path: "/contact", form: 'form[data-lead-form="contact"]' },
  { path: "/start", form: 'form[data-lead-form="start"]' },
  // Built but unlinked (Brief §A4); it still collects, so it still gets a notice.
  { path: "/search-intelligence", form: 'form[data-lead-form="readiness"]' },
];

for (const f of FORMS) {
  test(`${f.path}: notice at collection sits above the submit button and links to the policy`, async ({ page }) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}${f.path}`, { waitUntil: "domcontentloaded" });
    const form = page.locator(f.form).first();
    const notice = form.locator("[data-collection-notice]");
    await expect(notice).toHaveCount(1);
    await expect(notice).toContainText("We save what you send so a person can reply.");

    const before = await form.evaluate((el) => {
      const n = el.querySelector("[data-collection-notice]");
      const b = el.querySelector("button[type=submit]");
      return !!n && !!b && !!(n.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(before, "notice precedes the submit button").toBe(true);

    const hrefs = await notice.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/legal/privacy-policy#california", "/legal/privacy-policy#rights"]);
  });
}

test("the notice's anchors exist on the Privacy Policy", async ({ page }) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/legal/privacy-policy`, { waitUntil: "domcontentloaded" });
  for (const id of ["california", "rights"]) await expect(page.locator(`section#${id}`)).toHaveCount(1);
});
