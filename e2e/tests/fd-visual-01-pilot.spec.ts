import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { captureFullPage } from "../capture";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * FD-VISUAL-01 pilot (amendment §7.2, §10): the three launch showpieces.
 *
 * For each page, at both viewports:
 *   - reduced motion: the showpiece renders its static frame, nothing on the
 *     page moves with scroll, and nothing is pinned; full-page capture.
 *   - motion on, first paint (founder pilot review, 2026-10-30: no empty
 *     frames): before any scroll, every image in the showpiece is loaded and
 *     fully visible — nothing waits for scroll to appear. Full-page capture of
 *     that first frame.
 *   - motion on: the showpiece goes live, scroll visibly drives it, and any pin
 *     lasts no more than 1.5 viewports (§4.2); viewport captures at four points
 *     through the showpiece, plus a full-page capture after it has played.
 *
 * Captures land in e2e/snapshots/fd-visual-01/ for founder review (§7.7).
 * No page ships on these checks alone.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "fd-visual-01");
const CONSENT_KEY = "zbest-cookie-consent";
const FRAMES = [0, 0.33, 0.66, 1];

const PILOTS = [
  { name: "zbm-out-of-home", base: ZBM_BASE_URL, path: "/out-of-home", showpiece: "zbm-ooh-billboard" },
  { name: "zbc-how-it-works", base: ZBC_BASE_URL, path: "/", showpiece: "zbc-clip-split" },
] as const;

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

/** Where the showpiece sits on the page, and how far it can be scrolled through. */
async function geometry(page: Page, name: string) {
  return page.evaluate((n) => {
    const el = document.querySelector(`[data-showpiece="${n}"]`)!;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
  }, name);
}

/** Every inline transform and opacity inside the showpiece: what scroll is driving. */
async function fingerprint(page: Page, name: string) {
  return page.evaluate((n) => {
    const root = document.querySelector(`[data-showpiece="${n}"]`)!;
    return [...root.querySelectorAll<HTMLElement>("*")]
      .map((el) => {
        const cs = getComputedStyle(el);
        return `${cs.transform}|${cs.opacity}`;
      })
      .join(";");
  }, name);
}

/**
 * Every image in the showpiece that is not shown: not loaded, zero-sized, or
 * under an ancestor whose opacity is below 1. Empty list = nothing hidden.
 */
async function hiddenImages(page: Page, name: string) {
  return page.evaluate((n) => {
    const root = document.querySelector(`[data-showpiece="${n}"]`)!;
    return [...root.querySelectorAll("img")].flatMap((img) => {
      const r = img.getBoundingClientRect();
      let opacity = 1;
      for (let el: Element | null = img; el && el !== root.parentElement; el = el.parentElement) {
        opacity *= Number(getComputedStyle(el).opacity);
      }
      const why = [
        !img.complete || img.naturalWidth === 0 ? "not loaded" : "",
        r.width === 0 || r.height === 0 ? "zero size" : "",
        opacity < 0.99 ? `opacity ${opacity.toFixed(2)}` : "",
      ].filter(Boolean);
      return why.length ? [`${img.closest("[data-asset-id]")?.getAttribute("data-asset-id")}: ${why.join(", ")}`] : [];
    });
  }, name);
}

async function scrollToFrame(page: Page, name: string, f: number) {
  const g = await geometry(page, name);
  const travel = Math.max(g.height - g.vh, g.vh * 0.8);
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, g.top + f * travel - (f === 0 ? g.vh * 0.1 : 0)));
  await page.waitForTimeout(500);
}

for (const pilot of PILOTS) {
  test.describe(`${pilot.name} — ${pilot.showpiece}`, () => {
    test("reduced motion: composed static frame, nothing scroll-driven, nothing pinned", async ({ page }, testInfo) => {
      await presetConsent(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(pilot.base + pilot.path, { waitUntil: "networkidle" });
      const sp = page.locator(`[data-showpiece="${pilot.showpiece}"]`);
      await expect(sp).toHaveCount(1);
      await expect(sp).toHaveAttribute("data-showpiece-state", "static");

      // Every image in the static frame is loaded and fully visible.
      expect(await hiddenImages(page, pilot.showpiece), "images not shown in the static frame").toEqual([]);

      // Not pinned: the section is no taller than its content.
      const g = await geometry(page, pilot.showpiece);
      const stuck = await page.evaluate(
        (n) => [...document.querySelectorAll(`[data-showpiece="${n}"] *`)].some((el) => getComputedStyle(el).position === "sticky"),
        pilot.showpiece,
      );
      expect(stuck, "a sticky pin under reduced motion").toBe(false);

      // Scrolling through changes nothing inside the showpiece.
      await scrollToFrame(page, pilot.showpiece, 0);
      const before = await fingerprint(page, pilot.showpiece);
      await page.evaluate((y) => window.scrollTo(0, y), g.top + g.height);
      await page.waitForTimeout(400);
      expect(await fingerprint(page, pilot.showpiece), "scroll moved something under reduced motion").toBe(before);

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => document.fonts.ready);
      await mkdir(SNAPSHOT_DIR, { recursive: true });
      await captureFullPage(page, path.join(SNAPSHOT_DIR, `${pilot.name}-${testInfo.project.name}-reduced.png`), testInfo);
    });

    test("motion on: live, scroll-driven, pin ≤ 1.5 viewports, captured through the sequence", async ({ page }, testInfo) => {
      await presetConsent(page);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto(pilot.base + pilot.path, { waitUntil: "networkidle" });
      const sp = page.locator(`[data-showpiece="${pilot.showpiece}"]`);
      await expect(sp).toHaveAttribute("data-showpiece-state", "live");

      // First paint, before any scroll: nothing in the showpiece is empty.
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await hiddenImages(page, pilot.showpiece), "images not shown on first paint").toEqual([]);
      await page.evaluate(() => document.fonts.ready);
      await mkdir(SNAPSHOT_DIR, { recursive: true });
      await captureFullPage(page, path.join(SNAPSHOT_DIR, `${pilot.name}-${testInfo.project.name}-motion-first-frame.png`), testInfo);
      expect(await page.evaluate(() => window.scrollY), "the first-frame capture scrolled the page").toBe(0);

      const g = await geometry(page, pilot.showpiece);
      const pin = (g.height - g.vh) / g.vh;
      expect(pin, "pinned for more than 1.5 viewports").toBeLessThanOrEqual(1.5);

      await mkdir(SNAPSHOT_DIR, { recursive: true });
      const prints: string[] = [];
      for (const f of FRAMES) {
        await scrollToFrame(page, pilot.showpiece, f);
        prints.push(await fingerprint(page, pilot.showpiece));
        await page.screenshot({
          path: path.join(SNAPSHOT_DIR, `${pilot.name}-${testInfo.project.name}-motion-${String(Math.round(f * 100)).padStart(3, "0")}.png`),
        });
      }
      expect(prints[0], "scroll did not drive the showpiece").not.toBe(prints[prints.length - 1]);

      // Every image stays shown through the whole sequence, end included. (A
      // scroll-timeline mapping once faded every clip back out at the end.)
      for (const f of FRAMES) {
        await scrollToFrame(page, pilot.showpiece, f);
        expect(await hiddenImages(page, pilot.showpiece), `images not shown at ${f * 100}%`).toEqual([]);
      }

      // After the showpiece has played through, the whole page.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await captureFullPage(page, path.join(SNAPSHOT_DIR, `${pilot.name}-${testInfo.project.name}-motion-full.png`), testInfo);
    });
  });
}

/**
 * Home showpiece, founder direction 2026-11-07: "the line". It runs the length
 * of the page instead of pinning a hero, so it has its own contract here in
 * place of the pilot loop's pin and first-paint rules (which assume a short
 * pinned hero). Same guarantees, applied to what the line is:
 *   - reduced motion: static, nothing sticky, the whole line drawn, no dots,
 *     and scrolling changes nothing;
 *   - motion on: live, and scroll drives the line and the customer's dot;
 *   - nothing on screen is an empty frame, at every stop, for every business
 *     the visitor can pick (images hidden because another business is picked
 *     are not on screen and are skipped).
 */
const LINE = "zbm-home-line";

async function visibleImagesNotShown(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll<HTMLImageElement>("[data-home-line] img")].flatMap((img) => {
      const r = img.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return []; // another business is picked
      if (r.bottom < 0 || r.top > window.innerHeight) return []; // off screen
      return img.complete && img.naturalWidth > 0 ? [] : [img.closest("[data-asset-id]")?.getAttribute("data-asset-id") ?? img.src];
    }),
  );
}

test.describe(`zbm-home — ${LINE}`, () => {
  test("reduced motion: static, drawn in full, nothing sticky, scroll moves nothing", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "networkidle" });
    const sp = page.locator(`[data-showpiece="${LINE}"]`);
    await expect(sp).toHaveAttribute("data-showpiece-state", "static");
    await expect(page.locator("[data-line-state]")).toHaveAttribute("data-line-state", "static");
    await expect.poll(() => page.locator("#hl-a").evaluate((el) => getComputedStyle(el).strokeDashoffset)).toMatch(/^0(px)?$/);
    await expect(page.locator("#hl-dot-a")).toBeHidden();
    const stuck = await page.evaluate(
      (n) => [...document.querySelectorAll(`[data-showpiece="${n}"] *`)].some((el) => getComputedStyle(el).position === "sticky"),
      LINE,
    );
    expect(stuck, "a sticky pin under reduced motion").toBe(false);
    const before = await fingerprint(page, LINE);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await page.waitForTimeout(400);
    expect(await fingerprint(page, LINE), "scroll moved something under reduced motion").toBe(before);
    await page.evaluate(() => window.scrollTo(0, 0));
    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await captureFullPage(page, path.join(SNAPSHOT_DIR, `zbm-home-line-${testInfo.project.name}-reduced.png`), testInfo);
  });

  test("motion on: live, and scroll draws the line and moves the customer", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "networkidle" });
    await expect(page.locator(`[data-showpiece="${LINE}"]`)).toHaveAttribute("data-showpiece-state", "live");
    await expect(page.locator("[data-line-state]")).toHaveAttribute("data-line-state", "live");
    expect(await visibleImagesNotShown(page), "empty frames on first paint").toEqual([]);
    const line = () => page.locator("#hl-a").evaluate((el) => getComputedStyle(el).strokeDashoffset);
    const dot = () => page.locator("#hl-dot-a").evaluate((el) => getComputedStyle(el).offsetDistance);
    await expect.poll(line).not.toBe("");
    const [l0, d0] = [await line(), await dot()];
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.5));
    await expect.poll(line, "scroll did not draw the line").not.toBe(l0);
    await expect.poll(dot, "scroll did not move the customer").not.toBe(d0);
    expect(await page.locator("main header h1").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `zbm-home-line-${testInfo.project.name}-motion-250.png`) });
  });

  test("every business: picking it swaps the story, and every frame on screen has its image", async ({ page }) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "networkidle" });
    for (const [label, ooh] of [
      ["Auto dealer", "Quellmont Motors"],
      ["Med spa", "Your hour starts here"],
      ["Injury law", "Talk to a lawyer"],
      ["Restaurant", "Dinner by the water"],
      ["Artist", "Ivo Solace"],
    ] as const) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByText(label, { exact: true }).click();
      await expect(page.locator(".hl-ooh .hl-moment")).toContainText(ooh);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 600) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await expect.poll(() => visibleImagesNotShown(page), `${label}: empty frame near y=${y}`).toEqual([]);
      }
    }
  });
});
