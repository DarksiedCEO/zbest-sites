import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 1 gate (Brief §3.1). Deliverable under test: two blank pages rendering
 * the correct base color and one line of Fraunces / Bricolage.
 *
 * Screenshots land in e2e/snapshots/phase-1/ and are committed — a phase is not
 * complete without them (Brief §3, §9).
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-1");

/** Brief §A1 / §B1 — base colors, as rgb() for computed-style comparison. */
const APPS = [
  {
    slug: "zbm",
    name: "Z Best Media",
    baseUrl: ZBM_BASE_URL,
    base: "rgb(14, 15, 18)", // #0E0F12
    headlineFace: /Fraunces/i,
  },
  {
    slug: "zbc",
    name: "Z Best Clips",
    baseUrl: ZBC_BASE_URL,
    base: "rgb(11, 13, 16)", // #0B0D10
    headlineFace: /Bricolage/i,
  },
] as const;

/** Brief §A1 / §B1 — shared across both brands. */
const TEXT_PRIMARY = "rgb(237, 235, 230)"; // #EDEBE6

for (const app of APPS) {
  test.describe(app.name, () => {
    test(`boots on the correct base color with its headline face`, async ({
      page,
    }, testInfo) => {
      await page.goto(app.baseUrl, { waitUntil: "networkidle" });

      // The page renders at all.
      const heading = page.getByRole("heading", { level: 1, name: app.name });
      await expect(heading).toBeVisible();

      // Brand token resolved through [data-brand] -> Tailwind `bg-base`.
      await expect(page.locator("html")).toHaveAttribute("data-brand", app.slug);
      await expect(page.locator("body")).toHaveCSS("background-color", app.base);
      await expect(page.locator("body")).toHaveCSS("color", TEXT_PRIMARY);

      // Fonts actually loaded and self-hosted (Brief §1.1 — no runtime CDN).
      await page.evaluate(() => document.fonts.ready);
      await expect(heading).toHaveCSS("font-family", app.headlineFace);

      const thirdPartyFontRequests: string[] = [];
      page.on("request", (request) => {
        const url = request.url();
        if (/fonts\.(googleapis|gstatic)\.com/.test(url)) {
          thirdPartyFontRequests.push(url);
        }
      });
      await page.reload({ waitUntil: "networkidle" });
      expect(thirdPartyFontRequests).toEqual([]);

      await mkdir(SNAPSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(
          SNAPSHOT_DIR,
          `${app.slug}-home-${testInfo.project.name}.png`,
        ),
        fullPage: true,
      });
    });
  });
}
