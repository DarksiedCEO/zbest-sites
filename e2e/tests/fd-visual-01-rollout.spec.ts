import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { captureFullPage } from "../capture";
import { cutWords } from "../crop-check";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * FD-VISUAL-01 §10 rollout, batch by batch (amendment §8.7: batches of three
 * to four pages, each gated). For each page, at both viewports:
 *
 *   - the hero carries its lead image, in the frame where that work runs, and
 *     the image is loaded and fully visible on first paint (no empty frames);
 *   - reduced motion: the frame is still — scrolling moves nothing — and the
 *     full page is captured;
 *   - motion on: the first frame (viewport, before any scroll) is captured,
 *     the hero drifts with scroll, and at every point of the scroll no frame
 *     on the page cuts a word (../crop-check.ts).
 *
 * Captures land in e2e/snapshots/fd-visual-01/<batch>/ for founder review
 * (§7.7). No page ships on these checks alone.
 */

const CONSENT_KEY = "zbest-cookie-consent";

type RolloutPage = { name: string; base: string; path: string; asset: string; frame: string };

const BATCHES: Record<string, RolloutPage[]> = {
  "batch-1": [
    { name: "zbm-digital-advertising", base: ZBM_BASE_URL, path: "/digital-advertising", asset: "quellmont-feed-sticker", frame: "phone" },
    { name: "zbm-tv-streaming", base: ZBM_BASE_URL, path: "/tv-streaming", asset: "quellmont-tv-keys", frame: "player" },
    { name: "zbm-radio-audio", base: ZBM_BASE_URL, path: "/radio-audio", asset: "saltgrove-radio", frame: "plate" },
    { name: "zbm-social-media", base: ZBM_BASE_URL, path: "/social-media", asset: "marenvale-social", frame: "phone" },
  ],
};

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

/** The hero frame's asset, kind, whether its image is shown, and its transform. */
async function hero(page: Page) {
  return page.evaluate(() => {
    const wrap = document.querySelector("header [data-hero-media]");
    const frame = wrap?.querySelector("[data-media-frame]");
    const img = frame?.querySelector("img");
    if (!wrap || !frame || !img) return null;
    const r = img.getBoundingClientRect();
    let opacity = 1;
    for (let el: Element | null = img; el; el = el.parentElement) opacity *= Number(getComputedStyle(el).opacity);
    return {
      asset: frame.getAttribute("data-asset-id"),
      frame: frame.getAttribute("data-media-frame"),
      shown: img.complete && img.naturalWidth > 0 && r.width > 0 && r.height > 0 && opacity > 0.99,
      top: r.top + window.scrollY,
      transform: getComputedStyle(wrap.firstElementChild!).transform,
    };
  });
}

/** Scroll the whole page in steps, running the crop check at each one. */
async function cutsThroughScroll(page: Page, where: string) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize()!.height;
  const problems = new Set<string>();
  for (let y = 0; y < height; y += Math.round(vh * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
    for (const p of await cutWords(page, `${where} @${y}px`)) problems.add(p);
  }
  return [...problems];
}

for (const [batch, pages] of Object.entries(BATCHES)) {
  const dir = path.join(import.meta.dirname, "..", "snapshots", "fd-visual-01", batch);

  for (const p of pages) {
    test.describe(`${batch} — ${p.name}`, () => {
      test("reduced motion: the hero image is in place and still; full page captured", async ({ page }, testInfo) => {
        await presetConsent(page);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(p.base + p.path, { waitUntil: "networkidle" });

        const h = await hero(page);
        expect(h, "no hero image").not.toBeNull();
        expect(h!.asset).toBe(p.asset);
        expect(h!.frame).toBe(p.frame);
        expect(h!.shown, "hero image not shown on first paint").toBe(true);

        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 3));
        await page.waitForTimeout(300);
        expect((await hero(page))!.transform, "the hero moved with scroll under reduced motion").toBe("none");
        expect(await cutWords(page, p.name), "a frame cuts a word").toEqual([]);

        await page.evaluate(() => window.scrollTo(0, 0));
        await page.evaluate(() => document.fonts.ready);
        await mkdir(dir, { recursive: true });
        await captureFullPage(page, path.join(dir, `${p.name}-${testInfo.project.name}-reduced.png`), testInfo);
      });

      test("motion on: first frame captured; the hero drifts with scroll; no frame cuts a word", async ({ page }, testInfo) => {
        await presetConsent(page);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.goto(p.base + p.path, { waitUntil: "networkidle" });
        expect(await page.evaluate(() => window.scrollY)).toBe(0);

        const first = await hero(page);
        expect(first?.shown, "hero image not shown on first paint").toBe(true);
        await page.evaluate(() => document.fonts.ready);
        await mkdir(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${p.name}-${testInfo.project.name}-first-frame.png`) });

        // Once the hero image starts to leave the viewport, it drifts.
        await page.evaluate((top) => window.scrollTo(0, top + 200), first!.top);
        await page.waitForTimeout(400);
        expect((await hero(page))!.transform, "the hero did not move with scroll").not.toBe("none");

        expect(await cutsThroughScroll(page, p.name), "a frame cuts a word").toEqual([]);
      });
    });
  }
}
