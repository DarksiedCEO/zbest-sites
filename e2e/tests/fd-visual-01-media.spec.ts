import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * FD-VISUAL-01 §3.2 and §7.3–7.4, rendered half (the static half is
 * scripts/check-media.mjs). For every page of both built sites, at both
 * viewports:
 *
 *   1. every image or video the page requests maps to a manifest entry;
 *   2. every <img>/<video> in the DOM maps to a manifest entry, and its page is
 *      one of that entry's listed `pages`;
 *   3. every render of a `concept` entry is labelled, one of two ways
 *      (amendment §3.2.5 as amended by founder ruling 2026-10-30):
 *        - standalone: its own MediaFrame carries a visible ConceptBadge, and
 *          the badge does not overlap the image (it never covers the
 *          creative's own type);
 *        - a crop of one source: it sits in a ConceptGroup for that same
 *          source, carries no badge of its own, every frame in the group is
 *          a crop of that source, and the group label is visible and reads
 *          "Concept — N clips cut from one source" with N = the crops shown;
 *   4. concept alt text starts with "Concept:" and matches the manifest;
 *   5. no frame is ever blank (founder pilot review, 2026-10-30): on load,
 *      before any scroll, every image in a visible frame is either loaded or
 *      showing its inline blurred preview.
 *
 * Runs with the gate's default reduced motion, so every showpiece is in its
 * static frame and nothing is covered mid-animation.
 *
 * The manifest is read from disk here rather than imported from the app, so
 * the gate cannot agree with an app that drifted from it.
 */

type Entry = { id: string; file: string; class: string; alt: string; pages: string[] };
const MANIFEST: Entry[] = JSON.parse(
  readFileSync(path.join(import.meta.dirname, "..", "..", "packages", "ui", "assets", "manifest.json"), "utf8"),
).assets;
const BY_STEM = new Map(MANIFEST.map((e) => [path.basename(e.file).split(".")[0]!, e]));
const CONSENT_KEY = "zbest-cookie-consent";

/** The manifest entry a served URL comes from, or null. */
function entryFor(raw: string, base: string): Entry | null {
  const u = new URL(raw, base);
  const inner = u.pathname === "/_next/image" ? new URL(u.searchParams.get("url") ?? "", base).pathname : u.pathname;
  const stem = path.basename(inner).split(".")[0] ?? "";
  return BY_STEM.get(stem) ?? null;
}

async function routes(base: string, extra: string[]): Promise<string[]> {
  const res = await fetch(`${base}/sitemap.xml`);
  const xml = await res.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname || "/");
  return [...new Set([...paths, ...extra])];
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

const SITES = [
  { site: "zbm", base: ZBM_BASE_URL, extra: ["/search-intelligence"] as string[] },
  { site: "zbc", base: ZBC_BASE_URL, extra: [] as string[] },
] as const;

for (const { site, base, extra } of SITES) {
  test(`${site}: every served image is in the manifest, and every concept render is badged`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
    }, CONSENT_KEY);

    const problems: string[] = [];
    const seen = new Map<string, Set<string>>(); // asset id → pages it rendered on

    for (const route of await routes(base, extra)) {
      const requested: string[] = [];
      const onResponse = (r: import("@playwright/test").Response) => {
        const type = r.request().resourceType();
        if (type === "image" || type === "media") requested.push(r.url());
      };
      page.on("response", onResponse);
      await page.goto(base + route, { waitUntil: "networkidle" });
      const blank = await page.evaluate(() =>
        [...document.querySelectorAll("[data-media-frame] img")].flatMap((el) => {
          const img = el as HTMLImageElement;
          const r = img.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return [];
          const loaded = img.complete && img.naturalWidth > 0;
          const preview = /url\(["']?data:/.test(img.style.backgroundImage);
          return loaded || preview ? [] : [img.closest("[data-asset-id]")?.getAttribute("data-asset-id") ?? img.src];
        }),
      );
      for (const id of blank) problems.push(`${site}${route}: frame for "${id}" is blank before scroll (not loaded, no preview)`);
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
      page.off("response", onResponse);

      for (const url of requested) {
        if (url.startsWith("data:")) continue;
        if (!entryFor(url, base)) problems.push(`${site}${route}: requested ${url} — no manifest entry`);
      }

      const rendered = await page.evaluate(() => {
        const visible = (el: Element | null | undefined) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
        };
        const overlaps = (a: DOMRect, b: DOMRect) =>
          a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
        return [...document.querySelectorAll("img, video")].map((el) => {
          const media = el as HTMLImageElement | HTMLVideoElement;
          const r = media.getBoundingClientRect();
          const frame = media.closest("[data-media-frame]");
          const win = media.closest("[data-frame-window]");
          const badge = frame?.querySelector("[data-concept-badge]");
          const group = media.closest("[data-concept-group]");
          const groupBadge = group?.querySelector(":scope > * [data-concept-group-badge], :scope > [data-concept-group-badge]");
          const groupFrames = group ? [...group.querySelectorAll("[data-media-frame]")] : [];
          return {
            src: media.getAttribute("src") ?? (media as HTMLVideoElement).poster ?? "",
            alt: media.getAttribute("alt"),
            shown: r.width > 0 && r.height > 0,
            frameId: frame?.getAttribute("data-asset-id") ?? null,
            badge: Boolean(badge),
            badgeVisible: visible(badge),
            badgeOverImage: Boolean(badge && win && overlaps(badge.getBoundingClientRect(), win.getBoundingClientRect())),
            group: group?.getAttribute("data-concept-group") ?? null,
            groupLabel: groupBadge?.textContent?.trim() ?? null,
            groupLabelVisible: visible(groupBadge),
            groupIds: groupFrames.map((f) => f.getAttribute("data-asset-id")),
            groupShown: groupFrames.filter((f) => visible(f)).length,
          };
        });
      });

      for (const m of rendered) {
        const entry = entryFor(m.src, base);
        if (!entry) {
          problems.push(`${site}${route}: renders ${m.src} — no manifest entry`);
          continue;
        }
        if (!m.shown) continue; // not rendered at this viewport (e.g. a mobile-only thumbnail)
        const key = `${site}:${route}`;
        if (!seen.has(entry.id)) seen.set(entry.id, new Set());
        seen.get(entry.id)!.add(key);
        if (!entry.pages.includes(key)) problems.push(`${key}: renders "${entry.id}", which the manifest does not list on this page`);
        if (m.frameId !== entry.id) problems.push(`${key}: "${entry.id}" renders outside its MediaFrame`);
        if (entry.class === "concept") {
          if (m.group) {
            if (m.group !== entry.id) problems.push(`${key}: "${entry.id}" sits in a ConceptGroup for "${m.group}"`);
            if (m.badge) problems.push(`${key}: grouped crop of "${entry.id}" carries its own badge (the group label covers it)`);
            if (m.groupIds.some((id) => id !== m.group)) problems.push(`${key}: ConceptGroup "${m.group}" mixes sources: ${m.groupIds.join(", ")}`);
            if (!m.groupLabelVisible) problems.push(`${key}: ConceptGroup "${m.group}" label is not visible`);
            const expected = `Concept — ${m.groupShown} clips cut from one source`;
            if (m.groupLabel !== expected) problems.push(`${key}: ConceptGroup label reads "${m.groupLabel}", expected "${expected}"`);
          } else if (!m.badge) problems.push(`${key}: concept "${entry.id}" renders without a ConceptBadge`);
          else if (!m.badgeVisible) problems.push(`${key}: concept "${entry.id}" has a ConceptBadge that is not visible`);
          else if (m.badgeOverImage) problems.push(`${key}: concept "${entry.id}" has its ConceptBadge over the image (it must not cover the creative)`);
          if (!m.alt?.startsWith("Concept:")) problems.push(`${key}: concept "${entry.id}" alt does not start with "Concept:"`);
          if (m.alt !== entry.alt) problems.push(`${key}: "${entry.id}" alt differs from the manifest`);
        }
      }
    }

    expect(problems, problems.join("\n")).toEqual([]);
  });
}
