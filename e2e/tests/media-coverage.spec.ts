import { coverageBands, uncoveredBands } from "../support/media-coverage";
import { expect, test } from "@playwright/test";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/** FD-VISUAL-01 §7.1: blocking, across the complete page (including footer).
 * Desktop: each 900px band contains substantive visual material.
 * Mobile: at most two consecutive 844px bands may be text-only.
 * Small icons, decorative rules and offscreen/hidden elements never count.
 */
for (const [site, base] of [["zbm", ZBM_BASE_URL], ["zbc", ZBC_BASE_URL]]) {
  test(`${site}: blocking §7.1 media coverage`, async ({ page }, info) => {
    test.setTimeout(240_000);
    await page.addInitScript(() => localStorage.setItem("zbest-cookie-consent", JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" })));
    const xml = await (await page.request.get(base + "/sitemap.xml")).text();
    const routes = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname))];
    if (site === "zbm") routes.push("/search-intelligence");
    const failures: string[] = [];
    for (const route of routes) {
      if (/^\/(start|launch-a-campaign|faq|legal)(\/|$)/.test(route)) continue;
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 35)); }
        scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      const measurement = await page.evaluate(() => {
        const height = document.documentElement.scrollHeight;
        const shown = (el: Element) => {
          for (let node: Element | null = el; node; node = node.parentElement) {
            const css = getComputedStyle(node);
            if (css.display === "none" || css.visibility === "hidden" || Number(css.opacity) === 0) return false;
          }
          return true;
        };
        const rects = [...document.querySelectorAll("main img, main video, main svg[role=img], main [data-leak-ledger], footer img, footer video, footer svg[role=img]")].flatMap((el) => {
          const r = el.getBoundingClientRect();
          if (r.width < 80 || r.height < 80 || r.right <= 0 || r.left >= innerWidth || !shown(el)) return [];
          if (el instanceof HTMLImageElement && (!el.complete || !el.naturalWidth)) return [];
          return [{ top: r.top + scrollY, bottom: r.bottom + scrollY }];
        });
        return { height, rects };
      });
      const bands = coverageBands(measurement.height, info.project.name === "mobile-390" ? 844 : 900, measurement.rects);
      await info.attach(`${site}${route.replaceAll("/", "-")}-coverage.json`, { body: JSON.stringify(bands, null, 2), contentType: "application/json" });
      for (const band of uncoveredBands(bands, info.project.name === "mobile-390" ? 2 : 0)) {
        failures.push(`${site}${route}: text-only band ${band.top}–${band.bottom}px`);
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
