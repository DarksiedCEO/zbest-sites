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
 *   3. every render of a `concept` entry sits in a MediaFrame that carries a
 *      ConceptBadge, and the badge is visible on the asset's frame;
 *   4. concept alt text starts with "Concept:" and matches the manifest.
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
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
      page.off("response", onResponse);

      for (const url of requested) {
        if (url.startsWith("data:")) continue;
        if (!entryFor(url, base)) problems.push(`${site}${route}: requested ${url} — no manifest entry`);
      }

      const rendered = await page.evaluate(() =>
        [...document.querySelectorAll("img, video")].map((el) => {
          const media = el as HTMLImageElement | HTMLVideoElement;
          const r = media.getBoundingClientRect();
          const frame = media.closest("[data-media-frame]");
          const win = media.closest("[data-frame-window]");
          const badge = frame?.querySelector("[data-concept-badge]");
          const b = badge?.getBoundingClientRect();
          const w = win?.getBoundingClientRect();
          const style = badge ? getComputedStyle(badge) : null;
          return {
            src: media.getAttribute("src") ?? (media as HTMLVideoElement).poster ?? "",
            alt: media.getAttribute("alt"),
            shown: r.width > 0 && r.height > 0,
            frameId: frame?.getAttribute("data-asset-id") ?? null,
            badge: Boolean(badge),
            badgeVisible: Boolean(
              b && w && style && b.width > 0 && b.height > 0 && style.visibility !== "hidden" && Number(style.opacity) > 0 &&
                b.left >= w.left - 1 && b.top >= w.top - 1 && b.right <= w.right + 1 && b.bottom <= w.bottom + 1,
            ),
          };
        }),
      );

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
          if (!m.badge) problems.push(`${key}: concept "${entry.id}" renders without a ConceptBadge`);
          else if (!m.badgeVisible) problems.push(`${key}: concept "${entry.id}" has a ConceptBadge that is not visible on its frame`);
          if (!m.alt?.startsWith("Concept:")) problems.push(`${key}: concept "${entry.id}" alt does not start with "Concept:"`);
          if (m.alt !== entry.alt) problems.push(`${key}: "${entry.id}" alt differs from the manifest`);
        }
      }
    }

    expect(problems, problems.join("\n")).toEqual([]);
  });
}
