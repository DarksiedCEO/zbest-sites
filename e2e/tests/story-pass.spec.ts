import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { captureFullPage } from "../capture";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

const inventory = JSON.parse(readFileSync(path.join(import.meta.dirname, "../../docs/story-pass/inventory.json"), "utf8")) as {
  assets: { id: string; page: string; section: string; width: number; height: number }[];
};
const supportingHeaders: Record<string, string> = {
  "zbm:/contact": "saltgrove-brand-system", "zbm:/search-intelligence": "marenvale-website",
  "zbc:/pricing": "zbc-clipper-phone", "zbc:/about": "zbc-clipper-phone", "zbc:/media-kit": "zbc-clipper-phone",
};
const sharedFooterPages = ["zbm:/start", "zbm:/faq", "zbc:/launch-a-campaign", "zbc:/faq",
  ...["zbm", "zbc"].flatMap((site) => ["privacy-policy", "terms-of-service", "cookie-policy"].map((policy) => `${site}:/legal/${policy}`)),
];
const pages = [...new Set([...inventory.assets.map((a) => a.page), ...Object.keys(supportingHeaders), "zbm:/services", ...sharedFooterPages])];
for (const route of pages) {
  for (const motion of ["reduce", "no-preference"] as const) {
    test(`${route}: approved image layout, complete canvases, visible badges (${motion})`, async ({ page }, info) => {
      test.setTimeout(90_000);
      const [site, pathname] = route.split(":");
      await page.addInitScript(() => localStorage.setItem("zbest-cookie-consent", JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" })));
      await page.emulateMedia({ reducedMotion: motion });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto((site === "zbm" ? ZBM_BASE_URL : ZBC_BASE_URL) + pathname, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const name = route.replace(":", "").replaceAll("/", "-").replace(/-$/, "-home");
      const dir = path.join(import.meta.dirname, "../snapshots/story-pass");
      if (motion === "no-preference") {
        const { mkdir } = await import("node:fs/promises");
        await mkdir(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${name}-${info.project.name}-first-frame.png`) });
      }
      for (const a of inventory.assets.filter((a) => a.page === route)) {
        const slot = page.locator(`[data-story-image="${a.id}"]`);
        await expect(slot).toHaveCount(1);
        if (a.section.startsWith("hero")) {
          await expect(slot.locator("xpath=ancestor::header")).toHaveCount(1);
        } else if (a.id.startsWith("zbc-step") || (a.page === "zbm:/revenue-recovery" && a.id !== "rr-leak-report")) {
          await expect(slot.locator("xpath=ancestor::li[1]").getByRole("heading")).toContainText(a.section);
        } else {
          await expect(slot.locator("xpath=ancestor::section[1]").locator(".type-label").first()).toHaveText(a.section);
        }
        await slot.scrollIntoViewIfNeeded();
        const img = slot.locator("img");
        await expect(img).toBeVisible();
        await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
        await expect(img).toHaveAttribute("alt", /^Concept:/);
        await expect(slot.locator("[data-asset-class=concept] [data-concept-badge]")).toBeVisible();
        const win = await slot.locator("[data-frame-window]").boundingBox();
        expect(Math.abs(win!.width / win!.height - a.width / a.height), `${a.id}: source canvas cropped or stretched`).toBeLessThan(0.01);
        if (a.id.startsWith("zbc-step")) {
          expect(win!.width).toBeLessThanOrEqual(416);
          await expect(slot.locator("xpath=ancestor::*[@data-timeline]")).toHaveCount(1);
        }
      }
      if (supportingHeaders[route]) {
        const frame = page.locator(`main header [data-asset-id="${supportingHeaders[route]}"]`);
        await expect(frame).toHaveCount(1);
        await expect(frame.locator("[data-concept-badge]")).toBeVisible();
        await expect(frame.locator("img")).toHaveAttribute("alt", /^Concept:/);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "horizontal overflow").toBe(true);
      // Images are semantic non-interactive content, never keyboard traps.
      expect(await page.locator("[data-story-image] [tabindex]").count()).toBe(0);
      const faq = page.locator("main button[aria-expanded]").first();
      if (await faq.count()) {
        await faq.focus();
        const before = await faq.getAttribute("aria-expanded");
        await page.keyboard.press("Enter");
        await expect(faq).toHaveAttribute("aria-expanded", before === "true" ? "false" : "true");
        await page.keyboard.press("Enter");
      }
      expect(errors).toEqual([]);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.evaluate(() => scrollTo(0, 0));
      await captureFullPage(page, path.join(dir, `${name}-${info.project.name}-${motion === "reduce" ? "reduced" : "motion"}.png`), info);
    });
  }
}
