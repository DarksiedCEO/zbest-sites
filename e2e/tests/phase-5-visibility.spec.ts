import { expect, test, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 5 gate — AI Visibility Readiness Check, build steps 1 and 3 (Backend
 * Spec v0.4 §12, founder decision 11). The founder ran the two steps as one lane
 * so the page never shows the new library beside the retired promise.
 *
 *   step 1: the Visibility Gap Library is published on the Search Intelligence
 *           page, exactly as certified in §12.4
 *   step 3: the four retired strings are gone from every ZBM page (§12.8, C3),
 *           the false FAQ line is rewritten to what is true today, and no button
 *           names a check that does not exist yet
 *
 * Step 2 (the rule set, form and result) is NOT in this lane.
 *
 * The expected library text is read from the CERTIFIED SPEC, v0.4 §12.4, not
 * from the app, so this checks the published page against the contract.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-5");
const CONSENT_KEY = "zbest-cookie-consent";
const REPO = path.join(import.meta.dirname, "..", "..");

/** §12.8, C3 — the four retired strings as one pattern. It does not match the new name. */
const RETIRED = /whether and how your business currently shows up|free (ai )?visibility check/i;

/** Every ZBM page, including the unlinked Search Intelligence page and the legal shells. */
const ZBM_PATHS = [
  "/",
  "/digital-advertising",
  "/revenue-recovery",
  "/out-of-home",
  "/about",
  "/contact",
  "/faq",
  "/search-intelligence",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
];

type Gap = { key: string; name: string; description: string; fix: string };

/** The approved library, parsed from the §12.4 table of the certified spec. */
async function certifiedLibrary(): Promise<Gap[]> {
  const spec = await readFile(path.join(REPO, "docs/backend-interface-spec-v0.4.md"), "utf8");
  const block = spec.match(/^### 12\.4 [\s\S]*?(?=^### 12\.5)/m)?.[0] ?? "";
  return [...block.matchAll(/^\| `([a-z_]+)` \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$/gm)].map(
    ([, key, name, description, fix]) => ({ key: key!, name: name!.trim(), description: description!.trim(), fix: fix!.trim() }),
  );
}

async function visit(page: Page, route: string) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
  await page.goto(`${ZBM_BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
}

test.describe("Visibility Gap Library — published as certified (§12.4)", () => {
  test("renders all eight gaps exactly as the certified spec states them, in order", async ({ page }, testInfo) => {
    const library = await certifiedLibrary();
    expect(library.map((g) => g.key), "§12.4 defines the eight gaps").toEqual([
      "business_profile", "entity_consistency", "reviews", "crawlability",
      "structured_data", "answer_content", "brand_citations", "local_listings",
    ]);

    await visit(page, "/search-intelligence#visibility-gaps");
    const section = page.locator("#visibility-gaps");
    await expect(section.locator(".type-label").first()).toHaveText("Visibility Gap Library");
    const rows = section.locator("li");
    await expect(rows).toHaveCount(8);
    for (const [i, gap] of library.entries()) {
      const row = rows.nth(i);
      await expect(row.locator("h3"), `${gap.key} name`).toHaveText(gap.name);
      await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
      await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
      await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
    }

    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    // The site nav is sticky, and in an element capture it paints over the top of
    // the section: the first row at 1440, the section label at 390. It is not part
    // of the section, so it is hidden for the screenshot only (Playwright's `style`
    // applies during capture and nowhere else). The certified assessment captures
    // carry this overlap on their section label; this lane does not change them.
    await section.screenshot({
      path: path.join(SNAPSHOT_DIR, `zbm-visibility-gaps-${testInfo.project.name}.png`),
      style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
    });
  });

  test("says 'gap', never 'leak', and uses curly apostrophes only (§12.1)", async ({ page }) => {
    await visit(page, "/search-intelligence");
    const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
    expect(text).not.toMatch(/leak/i);
    expect(text).not.toContain("'");
  });
});

test.describe("Retirement — §12.8, condition C3", () => {
  test("no ZBM page carries a retired string, hidden FAQ panels included", async ({ page }) => {
    for (const route of ZBM_PATHS) {
      await visit(page, route);
      // textContent, not innerText: collapsed FAQ answers stay in the DOM with
      // `hidden`, and innerText would not see them.
      const text = (await page.locator("main").textContent()) ?? "";
      expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
    }
  });

  test("the pattern still recognises every retired string, and not the new name", () => {
    for (const retired of [
      "See whether and how your business currently shows up when someone asks ChatGPT",
      "Free AI Visibility Check",
      "Not yet — a free AI Visibility Check is available now.",
      "Get Your Free Visibility Check",
    ]) {
      expect(retired, retired).toMatch(RETIRED);
    }
    for (const current of ["AI Visibility Readiness Check", "Get your free AI Visibility Readiness Check"]) {
      expect(current, current).not.toMatch(RETIRED);
    }
  });

  test("the free-trial FAQ answer is rewritten to what is true today", async ({ page }) => {
    await visit(page, "/search-intelligence");
    const question = page.locator("#faq button", { hasText: "Do you offer a free trial?" });
    await question.click();
    const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);
    await expect(panel).toHaveText("Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.");
  });

  test("no button names a check that does not exist yet; Talk to Us leads", async ({ page }) => {
    await visit(page, "/search-intelligence");
    await expect(page.locator("main").getByRole("link", { name: /visibility (readiness )?check/i })).toHaveCount(0);
    const heroLink = page.locator("main header").getByRole("link").first();
    await expect(heroLink).toHaveText("Talk to Us");
    await expect(heroLink).toHaveAttribute("href", "/contact");
  });
});
