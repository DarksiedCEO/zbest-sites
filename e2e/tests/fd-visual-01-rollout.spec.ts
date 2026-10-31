import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { captureFullPage } from "../capture";
import { cutWords } from "../crop-check";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * FD-VISUAL-01 §10 rollout, batch by batch (amendment §8.7: batches of three
 * to four pages, each gated). For each page, at both viewports:
 *
 *   - the hero carries its lead image, in the frame where that work runs, and
 *     the image is loaded and fully visible on first paint (no empty frames);
 *     the Services hub instead carries one tile per act in its hero and one
 *     image-previewing list per act, each showing an image at both viewports;
 *     Revenue Recovery carries the six leaks as a code-drawn ledger with no
 *     numbers in it; About carries no image frame at all until the founder
 *     portrait arrives (no empty frame);
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

/**
 * What the page must carry:
 *   hero    — a hero image (`asset` in a `frame`, plus any `also` beside it);
 *   hub     — `acts` hero tiles and `previews` image-previewing service lists;
 *   ledger  — a code-drawn leak ledger of `rows` leaks, no numbers;
 *   noFrame — no image frame anywhere (About, until the founder portrait).
 */
type RolloutPage = { name: string; base: string; path: string } & (
  | { kind: "hero"; asset: string; frame: string; also?: string[] }
  | { kind: "hub"; previews: number; acts: number }
  | { kind: "ledger"; rows: number }
  | { kind: "noFrame" }
);

const BATCHES: Record<string, RolloutPage[]> = {
  "batch-1": [
    { name: "zbm-digital-advertising", base: ZBM_BASE_URL, path: "/digital-advertising", kind: "hero", asset: "quellmont-feed-sticker", frame: "phone" },
    { name: "zbm-tv-streaming", base: ZBM_BASE_URL, path: "/tv-streaming", kind: "hero", asset: "quellmont-tv-keys", frame: "player" },
    { name: "zbm-radio-audio", base: ZBM_BASE_URL, path: "/radio-audio", kind: "hero", asset: "saltgrove-radio", frame: "plate" },
    { name: "zbm-social-media", base: ZBM_BASE_URL, path: "/social-media", kind: "hero", asset: "marenvale-social", frame: "phone" },
  ],
  "batch-2": [
    { name: "zbm-creative-production", base: ZBM_BASE_URL, path: "/creative-production", kind: "hero", asset: "saltgrove-brand-system", frame: "plate" },
    { name: "zbm-influencer-marketing", base: ZBM_BASE_URL, path: "/influencer-marketing", kind: "hero", asset: "marenvale-influencer", frame: "phone" },
    { name: "zbm-websites", base: ZBM_BASE_URL, path: "/websites", kind: "hero", asset: "marenvale-website", frame: "plate" },
    { name: "zbm-services", base: ZBM_BASE_URL, path: "/services", kind: "hub", previews: 3, acts: 3 },
  ],
  "batch-3": [
    { name: "zbc-entertainment", base: ZBC_BASE_URL, path: "/entertainment", kind: "hero", asset: "ivosolace-stage", frame: "phone" },
    { name: "zbc-brands", base: ZBC_BASE_URL, path: "/brands", kind: "hero", asset: "quellmont-cover", frame: "phone", also: ["marenvale-room"] },
    { name: "zbc-become-a-clipper", base: ZBC_BASE_URL, path: "/become-a-clipper", kind: "hero", asset: "zbc-clipper-phone", frame: "plate" },
  ],
  "batch-4": [
    { name: "zbm-revenue-recovery", base: ZBM_BASE_URL, path: "/revenue-recovery", kind: "ledger", rows: 6 },
    { name: "zbm-about", base: ZBM_BASE_URL, path: "/about", kind: "noFrame" },
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

/** Every hero image that is loaded and shown, in order. */
async function heroAssets(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("header [data-hero-media] [data-media-frame]")].flatMap((f) => {
      const img = f.querySelector("img");
      return img && img.complete && img.naturalWidth > 0 && f.getBoundingClientRect().width > 0 ? [f.getAttribute("data-asset-id")] : [];
    }),
  );
}

/** Image-previewing lists on the page, and any of their visible frames not showing its image. */
async function previews(page: Page) {
  return page.evaluate(() => {
    const lists = [...document.querySelectorAll("[data-service-preview]")];
    const missing = lists.flatMap((list) =>
      [...list.querySelectorAll("[data-media-frame]")].flatMap((frame) => {
        const r = frame.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return []; // not rendered at this viewport
        const img = frame.querySelector("img");
        return img && img.complete && img.naturalWidth > 0 ? [] : [frame.getAttribute("data-asset-id")];
      }),
    );
    const framed = lists.filter((l) => [...l.querySelectorAll("[data-media-frame]")].some((f) => f.getBoundingClientRect().width > 0));
    const acts = [...document.querySelectorAll("header [data-hero-acts] [data-media-frame]")].filter((f) => {
      const img = f.querySelector("img");
      return img && img.complete && img.naturalWidth > 0 && f.getBoundingClientRect().width > 0;
    }).length;
    return { lists: lists.length, framed: framed.length, missing, acts };
  });
}

/** The hero leak ledger: its rows, any digit in it, its badge, and its drift transform. */
async function ledger(page: Page) {
  return page.evaluate(() => {
    const drift = document.querySelector("header [data-scroll-drift]");
    const el = drift?.querySelector("[data-leak-ledger]");
    if (!drift || !el) return null;
    const badge = el.querySelector("figcaption span");
    const r = el.getBoundingClientRect();
    return {
      rows: el.querySelectorAll("ol > li").length,
      digits: (el.textContent ?? "").match(/\d/g)?.join("") ?? "",
      badge: badge?.textContent?.trim() ?? "",
      shown: r.width > 0 && r.height > 0,
      top: r.top + window.scrollY,
      transform: getComputedStyle(drift.firstElementChild!).transform,
    };
  });
}

/** Every image frame on the page, and every frame window (empty or not). */
async function frames(page: Page) {
  return page.evaluate(() => ({
    frames: document.querySelectorAll("[data-media-frame]").length,
    windows: document.querySelectorAll("[data-frame-window]").length,
    imgs: document.querySelectorAll("main img, main video").length,
  }));
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
      test("reduced motion: the page's media is in place and still; full page captured", async ({ page }, testInfo) => {
        await presetConsent(page);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(p.base + p.path, { waitUntil: "networkidle" });

        if (p.kind === "hub") {
          const v = await previews(page);
          expect(v.lists, "image-previewing lists").toBe(p.previews);
          expect(v.framed, "lists showing an image at this viewport").toBe(p.previews);
          expect(v.missing, "preview frames without their image, before any scroll").toEqual([]);
          expect(v.acts, "hero act tiles showing their image").toBe(p.acts);
        } else if (p.kind === "ledger") {
          const l = await ledger(page);
          expect(l, "no leak ledger in the hero").not.toBeNull();
          expect(l!.rows).toBe(p.rows);
          expect(l!.digits, "the ledger shows numbers").toBe("");
          expect(l!.badge).toMatch(/^Illustrative/);
          expect(l!.shown).toBe(true);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 3));
          await page.waitForTimeout(300);
          expect((await ledger(page))!.transform, "the ledger moved with scroll under reduced motion").toBe("none");
        } else if (p.kind === "noFrame") {
          expect(await frames(page), "an image frame on a page that must have none").toEqual({ frames: 0, windows: 0, imgs: 0 });
        } else {
          const h = await hero(page);
          expect(h, "no hero image").not.toBeNull();
          expect(h!.asset).toBe(p.asset);
          expect(h!.frame).toBe(p.frame);
          expect(h!.shown, "hero image not shown on first paint").toBe(true);
          if (p.also) expect(await heroAssets(page), "every hero image, shown").toEqual([p.asset, ...p.also]);

          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 3));
          await page.waitForTimeout(300);
          expect((await hero(page))!.transform, "the hero moved with scroll under reduced motion").toBe("none");
        }
        expect(await cutWords(page, p.name), "a frame cuts a word").toEqual([]);

        await page.evaluate(() => window.scrollTo(0, 0));
        await page.evaluate(() => document.fonts.ready);
        await mkdir(dir, { recursive: true });
        await captureFullPage(page, path.join(dir, `${p.name}-${testInfo.project.name}-reduced.png`), testInfo);
      });

      test("motion on: first frame captured; the page's media moves with scroll as built; no frame cuts a word", async ({ page }, testInfo) => {
        await presetConsent(page);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.goto(p.base + p.path, { waitUntil: "networkidle" });
        expect(await page.evaluate(() => window.scrollY)).toBe(0);

        const first = p.kind === "hero" ? await hero(page) : p.kind === "ledger" ? await ledger(page) : null;
        if (first) expect(first.shown, "hero visual not shown on first paint").toBe(true);
        if (p.kind === "hub") expect((await previews(page)).missing, "preview frames without their image on first paint").toEqual([]);
        if (p.kind === "noFrame") expect((await frames(page)).frames, "an image frame on a page that must have none").toBe(0);
        await page.evaluate(() => document.fonts.ready);
        await mkdir(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${p.name}-${testInfo.project.name}-first-frame.png`) });

        if (first) {
          // Once the hero visual starts to leave the viewport, it drifts.
          await page.evaluate((top) => window.scrollTo(0, top + 200), first.top);
          await page.waitForTimeout(400);
          const now = p.kind === "ledger" ? await ledger(page) : await hero(page);
          expect(now!.transform, "the hero did not move with scroll").not.toBe("none");
        }

        expect(await cutsThroughScroll(page, p.name), "a frame cuts a word").toEqual([]);
      });
    });
  }
}
