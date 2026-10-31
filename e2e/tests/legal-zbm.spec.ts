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
  { path: "/revenue-recovery", form: 'form[data-lead-form="assessment"]' },
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
    // Assent to the Terms and the service-area confirmation (AEGIS M7).
    await expect(notice).toContainText("By sending, you agree to our Terms of Service");
    await expect(notice).toContainText("confirm your business is in our service area");

    const before = await form.evaluate((el) => {
      const n = el.querySelector("[data-collection-notice]");
      const b = el.querySelector("button[type=submit]");
      return !!n && !!b && !!(n.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(before, "notice precedes the submit button").toBe(true);

    const hrefs = await notice.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/legal/terms-of-service", "/legal/privacy-policy#california", "/legal/privacy-policy#rights"]);
  });
}

test("the notice's anchors exist on the Privacy Policy", async ({ page }) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/legal/privacy-policy`, { waitUntil: "domcontentloaded" });
  for (const id of ["california", "rights"]) await expect(page.locator(`section#${id}`)).toHaveCount(1);
});

test("Accessibility Statement: linked from the footer, in effect, honest about limitations", async ({ page }) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
  const link = page.getByRole("contentinfo").getByRole("link", { name: "Accessibility Statement" });
  await expect(link).toHaveAttribute("href", "/legal/accessibility");

  const res = await page.goto(`${ZBM_BASE_URL}/legal/accessibility`, { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Accessibility Statement");
  expect(await page.locator("[data-legal-notice]").count()).toBe(0);
  await expect(page.locator("section#status")).toContainText("partially conforms to WCAG 2.2 Level AA");
  expect(await page.locator("section#limitations li").count()).toBeGreaterThanOrEqual(1);
  // A contact route is given (an address, or a visibly marked token until it is filled).
  await expect(page.locator("section#feedback")).toContainText("email");
});

test("Refund and Cancellation Policy: in the footer, in effect, with a billing contact", async ({ page }) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
  const link = page.getByRole("contentinfo").getByRole("link", { name: "Refunds and Cancellation" });
  await expect(link).toHaveAttribute("href", "/legal/refunds");

  const res = await page.goto(`${ZBM_BASE_URL}/legal/refunds`, { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Refund and Cancellation Policy");
  expect(await page.locator("[data-legal-notice]").count()).toBe(0);
  for (const id of ["full-refunds", "cancel", "defects", "charges", "request", "how-paid", "contact"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.locator("section#cancel")).toContainText("15 days’ written notice");
  await expect(page.locator("section#how-paid")).toContainText("within 10 business days after the refund becomes due");
  expect(await page.locator("meta[name=robots]").getAttribute("content")).toMatch(/noindex/);
});
