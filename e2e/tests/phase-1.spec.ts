import { expect, test } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { GATE_NONCE, ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 1 gate (Brief §3.1). Deliverable under test: two blank pages rendering
 * the correct base color and one line of Fraunces / Bricolage.
 *
 * Screenshots land in e2e/snapshots/phase-1/ and are committed — a phase is not
 * complete without them (Brief §3, §9).
 *
 * Every assertion here has to be capable of failing. Two earlier ones were not:
 * a computed `font-family` string matched whether or not a single byte of the
 * face was ever fetched, and nothing checked that the page came from the Next
 * build at all. Both were demonstrated by an audit, so font presence is now
 * proven by measurement and the build is proven by its own asset requests.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-1");

/** Brief §A1 / §B1 — base colors, as rgb() for computed-style comparison. */
const APPS = [
  {
    slug: "zbm",
    name: "Z Best Media",
    baseUrl: ZBM_BASE_URL,
    base: "rgb(14, 15, 18)", // #0E0F12
    headlineFamily: "Fraunces",
  },
  {
    slug: "zbc",
    name: "Z Best Clips",
    baseUrl: ZBC_BASE_URL,
    base: "rgb(11, 13, 16)", // #0B0D10
    headlineFamily: "Bricolage Grotesque",
  },
] as const;

/** Brief §A1 / §B1 — shared across both brands. */
const TEXT_PRIMARY = "rgb(237, 235, 230)"; // #EDEBE6

/** A family that cannot resolve, so the browser must use its default face. */
const NO_SUCH_FAMILY = "__zbest_no_such_family__";

for (const app of APPS) {
  test.describe(app.name, () => {
    test("boots on the correct base color with its headline face", async ({
      page,
    }, testInfo) => {
      // Registered before the first navigation so nothing escapes observation.
      const requested: string[] = [];
      page.on("request", (request) => requested.push(request.url()));

      // `load`, not `networkidle`: since Phase 3 the root layout renders the nav,
      // whose links to Phase 4 pages are prefetched on desktop and stay pending
      // in the browser (the server answers them with a 404 in ~5ms), so the
      // network never idles. `load` covers the preloaded next/font faces, and
      // document.fonts.ready is awaited below before anything is measured.
      await page.goto(app.baseUrl, { waitUntil: "load" });

      // The page renders at all. Since Phase 4 the ZBM homepage's h1 is the
      // §A4 headline rather than the Phase 1 boot line, so the brand is checked
      // on the nav wordmark and the headline face is measured on whatever h1
      // the homepage carries.
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("banner").getByRole("link", { name: app.name, exact: true }),
      ).toBeVisible();

      // Brand token resolved through [data-brand] -> Tailwind `bg-base`.
      await expect(page.locator("html")).toHaveAttribute("data-brand", app.slug);
      await expect(page.locator("body")).toHaveCSS("background-color", app.base);
      await expect(page.locator("body")).toHaveCSS("color", TEXT_PRIMARY);

      await page.evaluate(() => document.fonts.ready);

      // Proof the face LOADED and is in use — not merely named in CSS. The same
      // string is computed whether or not the font was ever fetched, so the
      // headline is measured against a deliberately unresolvable family: if the
      // real face is missing, both fall back to the default and the widths match.
      const face = await page.evaluate(
        ([family, missing]) => {
          const h1 = document.querySelector("h1");
          if (!h1) return null;
          const cs = getComputedStyle(h1);
          const measure = (fontFamily: string) => {
            const el = document.createElement("span");
            el.textContent = h1.textContent;
            Object.assign(el.style, {
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "nowrap",
              fontFamily,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
              letterSpacing: cs.letterSpacing,
            });
            document.body.appendChild(el);
            const width = el.getBoundingClientRect().width;
            el.remove();
            return width;
          };
          // document.fonts lists only faces this DOCUMENT declared. A font
          // installed on the host does not appear here, and neither does a
          // family that was never declared at all — which is exactly what
          // document.fonts.check() gets wrong: it returns true for any family
          // on a page with no @font-face rules whatsoever.
          const declaredFaces = [...document.fonts].filter(
            (f) => f.family.replace(/["']/g, "") === family,
          );
          return {
            declared: cs.fontFamily,
            faceCount: declaredFaces.length,
            loadedCount: declaredFaces.filter((f) => f.status === "loaded").length,
            withFace: measure(`"${family}"`),
            withoutFace: measure(`"${missing}"`),
          };
        },
        [app.headlineFamily, NO_SUCH_FAMILY] as const,
      );

      expect(face, "h1 must exist to measure").not.toBeNull();
      expect(face!.declared).toContain(app.headlineFamily);
      expect(
        face!.faceCount,
        `${app.headlineFamily} is declared by this document via @font-face`,
      ).toBeGreaterThan(0);
      expect(
        face!.loadedCount,
        `${app.headlineFamily} has at least one face with status "loaded"`,
      ).toBeGreaterThan(0);
      expect(
        Math.abs(face!.withFace - face!.withoutFace),
        `${app.headlineFamily} renders differently than the fallback ` +
          `(${face!.withFace}px vs ${face!.withoutFace}px)`,
      ).toBeGreaterThan(1);

      const origin = new URL(app.baseUrl).origin;

      // Brief §1.1 forbids third-party font CDN calls at runtime. Asserting zero
      // off-origin requests rather than a Google-only pattern, because the rule
      // names no vendor — Typekit or Bunny would violate it just as squarely.
      const offOrigin = requested.filter(
        (url) => !url.startsWith(origin) && !/^(data|blob):/.test(url),
      );
      expect(offOrigin, "no off-origin requests at runtime").toEqual([]);

      // Proof this is the Next build and not some other server on the port:
      // the self-hosted faces must arrive from the build's own asset pipeline.
      const selfHostedFonts = requested.filter(
        (url) => url.startsWith(`${origin}/_next/static/`) && url.endsWith(".woff2"),
      );
      expect(
        selfHostedFonts.length,
        "self-hosted woff2 served from /_next/static (proves the Next build is under test)",
      ).toBeGreaterThan(0);

      // THE check that the page under test came from the process this gate
      // spawned. The nonce exists only in this run's memory and is passed to the
      // server via env, so no other process can produce it — unlike a free port,
      // which can be taken first, or an on-disk token, which any local process
      // can read and replay.
      //
      // It is asserted on the DOCUMENT, not on an asset: an impostor can proxy
      // /_next/static/** through to the real build while serving its own HTML,
      // and the screenshot is of the HTML.
      // Read directly rather than via a locator: a missing nonce is a hard
      // failure, not something to wait 30s for.
      const servedNonce = await page.evaluate(
        () =>
          document
            .querySelector('meta[name="x-zbest-gate-nonce"]')
            ?.getAttribute("content") ?? null,
      );
      expect(
        servedNonce,
        "served document carries this run's gate nonce — it is the server we spawned",
      ).toBe(GATE_NONCE);

      // Corroborating: the build served is the one the gate just produced.
      // BUILD_ID is regenerated per build and 404s for any other value.
      const buildId = (
        await readFile(
          path.join(import.meta.dirname, "..", "..", "apps", app.slug, ".next", "BUILD_ID"),
          "utf8",
        )
      ).trim();
      expect(buildId, "BUILD_ID was produced by the gate's own build").not.toBe("");
      const identity = await page.request.get(
        `${origin}/_next/static/${buildId}/_buildManifest.js`,
      );
      expect(
        identity.status(),
        `server serves build ${buildId} — the one this gate built`,
      ).toBe(200);

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
