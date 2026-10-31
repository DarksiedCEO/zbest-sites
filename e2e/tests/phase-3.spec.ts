import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { captureFullPage } from "../capture";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 3 gate (Brief §3.3). Under test: nav and footer wired into both apps,
 * legal page shells with the §5 banner, 404, sitemap.xml and robots.txt with
 * Search Intelligence and /dev excluded, metadata/OG defaults on the canonical
 * hosts, and the Entertainment/Brands color-coded system on Z Best Clips.
 *
 * Expected values are transcribed from the brief HERE, not imported from the
 * apps' lib/site.ts. A gate that reads the config it is checking agrees with
 * whatever the config says.
 *
 * Navigation waits on `domcontentloaded`: the nav links to Phase 4 pages that
 * do not exist yet, so Next prefetches routes that 404 and the network does
 * not reliably go idle. Every assertion waits on the thing it is about.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-3");
const REPO_ROOT = path.join(import.meta.dirname, "..", "..");
const CONSENT_KEY = "zbest-cookie-consent";
/**
 * Founder decision, Oct 30 2026: neither site may carry review-status or draft
 * wording about its legal documents. ZBC shows this notice until launch.
 */
const STATUS_WORDING = /pending attorney|attorney review|not yet in effect|\bdraft\b/i;
const ZBC_LEGAL_NOTICE = "Z Best Clips is not yet accepting clients. These terms will be published before launch.";

const LEGAL = [
  { path: "/legal/privacy-policy", title: "Privacy Policy", slug: "legal-privacy-policy" },
  { path: "/legal/terms-of-service", title: "Terms of Service", slug: "legal-terms-of-service" },
  { path: "/legal/cookie-policy", title: "Cookie Policy", slug: "legal-cookie-policy" },
] as const;

const APPS = [
  {
    slug: "zbm",
    name: "Z Best Media",
    baseUrl: ZBM_BASE_URL,
    // Founder decision 3: zbestmedia.com, canonical host www.
    origin: "https://www.zbestmedia.com",
    // §A2 as amended Oct 4, 2026 (docs/BRIEF-AMENDMENT-2026-10-04-full-service.md):
    // a Services dropdown carrying the full catalog, and a Start a Project CTA.
    nav: ["Services", "Revenue Recovery", "Z Best Clips", "About", "Contact"],
    dropdown: { trigger: "Services", probe: "TV & Streaming" },
    navCta: "Start a Project",
    // §A3 as amended Oct 4, 2026: every service in Services; Start a Project in Company.
    footer: [
      {
        heading: "Services",
        links: [
          "Digital Advertising",
          "TV & Streaming",
          "Radio & Audio",
          "Out-of-Home",
          "Social Media",
          "Creative & Production",
          "Influencer & Creator Partnerships",
          "Z Best Clips",
          "Revenue Recovery",
          "Websites & Landing Pages",
          "All Services",
        ],
      },
      { heading: "Company", links: ["About", "Start a Project", "Contact"] },
      { heading: "Resources", links: ["FAQ"] },
      // Accessibility Statement added with the in-effect legal set (Oct 30 2026).
      { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "Refunds and Cancellation", "Cookie Settings", "Accessibility Statement"] },
    ],
    // §A3: "Z Best Clips (→ zbestclips.com)"; own domain per §1.1.
    crossLink: { label: "Z Best Clips", href: "https://zbestclips.com" },
  },
  {
    slug: "zbc",
    name: "Z Best Clips",
    baseUrl: ZBC_BASE_URL,
    origin: "https://zbestclips.com",
    // §B2
    nav: ["Focus Areas", "How It Works", "Pricing", "Become a Clipper"],
    dropdown: { trigger: "Focus Areas", probe: "Brands" },
    navCta: "Launch a Campaign",
    // §B3 launch configuration
    footer: [
      {
        heading: "Company",
        links: ["About", "Media Kit", "Become a Clipper", "Launch a Campaign", "Contact"],
      },
      { heading: "Resources", links: ["FAQ"] },
      { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Settings"] },
    ],
    // §B1/§B3: endorsement line under the wordmark, linking to the ZBM site.
    crossLink: { label: "Z Best Clips, by Z Best Media", href: "https://www.zbestmedia.com" },
  },
] as const;

/** §A4: never linked, never listed. /dev: development surfaces (Phase 2+). */
const FORBIDDEN_LINK = /search-intelligence|(^|zbestmedia\.com|zbestclips\.com)\/dev(\/|$)/i;

/** Brief §B1 accents, as computed rgb(). */
const ENT = "rgb(255, 107, 91)"; // #FF6B5B
const BRAND = "rgb(76, 140, 255)"; // #4C8CFF

const isMobile = (projectName: string) => projectName.startsWith("mobile");

/** Suppress the consent banner for captures where it would cover content. */
async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }),
    );
  }, CONSENT_KEY);
}

async function capture(page: Page, name: string, testInfo: TestInfo) {
  await page.evaluate(() => document.fonts.ready);
  await captureFullPage(page, path.join(SNAPSHOT_DIR, `${name}.png`), testInfo);
}

const head = (page: Page, selector: string, attr = "content") =>
  page.evaluate(
    ([sel, a]) => document.head.querySelector(sel)?.getAttribute(a) ?? null,
    [selector, attr] as const,
  );

for (const app of APPS) {
  const PAGES = [
    { path: "/", slug: "home", status: 200 },
    ...LEGAL.map((l) => ({ path: l.path, slug: l.slug, status: 200 })),
    { path: "/this-page-does-not-exist", slug: "404", status: 404 },
  ];

  test.describe(`${app.name} — shared scaffolding`, () => {
    for (const p of PAGES) {
      test(`${p.path} — nav, footer and no forbidden links`, async ({ page }, testInfo) => {
        // The homepage is captured with the consent banner up, as a first
        // visitor sees it; every other page with it dismissed, so the capture
        // shows the page rather than the banner.
        if (p.slug !== "home") await presetConsent(page);

        const response = await page.goto(`${app.baseUrl}${p.path}`, {
          waitUntil: "domcontentloaded",
        });
        expect(response?.status()).toBe(p.status);

        const header = page.getByRole("banner");
        const footer = page.getByRole("contentinfo");
        await expect(header).toBeVisible();
        await expect(footer).toBeVisible();

        // Nav: exactly the brief's top-level items, in order.
        const navLabels = await page.evaluate(() =>
          [...document.querySelectorAll('nav[aria-label="Primary"] > ul > li')].map((li) =>
            (li.firstElementChild?.textContent ?? "").replace("▾", "").trim(),
          ),
        );
        expect(navLabels).toEqual([...app.nav]);

        // ...and actually reachable at this viewport, not merely in the DOM.
        if (isMobile(testInfo.project.name)) {
          const toggle = header.getByRole("button", { name: "Menu" });
          await toggle.click();
          await expect(header.getByRole("button", { name: "Close" })).toHaveAttribute(
            "aria-expanded",
            "true",
          );
          for (const label of app.nav) {
            await expect(header.getByText(label, { exact: true }).last()).toBeVisible();
          }
          await page.keyboard.press("Escape");
          await expect(header.getByRole("button", { name: "Menu" })).toHaveAttribute(
            "aria-expanded",
            "false",
          );
        } else {
          const items = page.locator('nav[aria-label="Primary"] > ul > li > :first-child');
          await expect(items).toHaveCount(app.nav.length);
          for (let i = 0; i < app.nav.length; i++) await expect(items.nth(i)).toBeVisible();
          if (app.navCta) {
            await expect(header.getByRole("link", { name: app.navCta })).toBeVisible();
          }
        }

        // Footer: exactly the brief's columns and entries.
        const columns = await page.evaluate(() =>
          [...document.querySelectorAll("footer ul")].map((ul) => ({
            heading: ul.previousElementSibling?.textContent?.trim() ?? "",
            links: [...ul.querySelectorAll("a")].map((a) => a.textContent?.trim() ?? ""),
          })),
        );
        expect(columns).toEqual(app.footer.map((c) => ({ heading: c.heading, links: [...c.links] })));

        // Cross-domain link on the canonical host of the sibling site.
        await expect(
          footer.getByRole("link", { name: app.crossLink.label, exact: true }),
        ).toHaveAttribute("href", app.crossLink.href);

        // §A4 and /dev: no link anywhere on the page — hidden menus included,
        // which is why this reads the DOM rather than visible links — and the
        // served HTML does not mention the route at all, RSC payload included.
        const hrefs = await page.evaluate(() =>
          [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href") ?? ""),
        );
        expect(hrefs.length).toBeGreaterThan(0);
        expect(hrefs.filter((h) => FORBIDDEN_LINK.test(h))).toEqual([]);
        const html = (await response?.text()) ?? "";
        expect(html).not.toMatch(/search-intelligence/i);
        expect(html).not.toMatch(/href="\/dev/);

        await capture(page, `${app.slug}-${p.slug}-${testInfo.project.name}`, testInfo);
      });
    }

    test("nav stays pinned to the top while the page scrolls", async ({ page }) => {
      await presetConsent(page);
      await page.goto(`${app.baseUrl}/legal/terms-of-service`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
      const top = await page.getByRole("banner").evaluate((el) => el.getBoundingClientRect().top);
      expect(top).toBe(0);
      await expect(page.getByRole("banner")).toBeInViewport();
    });

    test("menus close on navigation, Escape and outside click", async ({ page }, testInfo) => {
      await presetConsent(page);
      await page.goto(`${app.baseUrl}/legal/privacy-policy`, { waitUntil: "domcontentloaded" });
      const header = page.getByRole("banner");

      // The navigation step must be a CLIENT navigation, because that is the
      // only case where the layout — and an open menu — survives. A first
      // version clicked a nav link to a Phase 4 page; Next cannot prefetch a
      // 404, so it fell back to a full page load that reset every menu on its
      // own, and the test passed with the close-on-navigation code deleted.
      // The brand link goes to "/", which is built, and a window marker proves
      // no reload happened.
      const clientNavigateHome = async () => {
        await page.evaluate(() => ((window as unknown as { __noReload: boolean }).__noReload = true));
        await header.getByRole("link", { name: app.name, exact: true }).click();
        await expect(page).toHaveURL(`${app.baseUrl}/`);
        expect(
          await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload),
          "navigation was client-side",
        ).toBe(true);
      };

      if (isMobile(testInfo.project.name)) {
        const toggle = header.locator('button[aria-controls$="-mobile"]');
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        // Outside click.
        await page.locator("main h1").click();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        // Navigation.
        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await clientNavigateHome();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(page.locator(`[id$="-mobile"]`)).toBeHidden();
      } else if (app.dropdown) {
        const trigger = header.getByRole("button", { name: app.dropdown.trigger });
        await trigger.click();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await page.keyboard.press("Escape");
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await trigger.click();
        await page.locator("main h1").click();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await trigger.click();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await clientNavigateHome();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(header.getByRole("link", { name: app.dropdown.probe, exact: true })).toBeHidden();
      } else {
        // An app without a dropdown: nothing opens.
        expect(await header.locator("button[aria-expanded]:visible").count()).toBe(0);
      }
    });

    // Z Best Media's documents are IN EFFECT (founder decision Oct 30 2026,
    // CLAUDE.md): real text, no draft banner. Z Best Clips keeps the shells.
    for (const doc of app.slug === "zbm" ? LEGAL : []) {
      test(`${doc.path} — in-effect document: no draft banner, real sections, dated`, async ({ page }) => {
        await presetConsent(page);
        const response = await page.goto(`${app.baseUrl}${doc.path}`, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);

        await expect(page.locator("[data-legal-document]")).toBeVisible();
        expect(await page.locator("[data-legal-notice]").count()).toBe(0);
        const text = await page.locator("main").innerText();
        expect(text).not.toMatch(STATUS_WORDING);
        expect(await head(page, 'meta[name="description"]')).not.toMatch(STATUS_WORDING);

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(doc.title);
        // Real sections with real text, each reachable from the contents list.
        const sections = page.locator("main section[id] h2");
        expect(await sections.count()).toBeGreaterThanOrEqual(5);
        const toc = page.getByRole("navigation", { name: `${doc.title} contents` });
        expect(await toc.getByRole("link").count()).toBe(await sections.count());
        expect(text.length).toBeGreaterThan(2500);

        // Issuer and effective date are stated up front.
        await expect(page.locator("[data-legal-issuer]")).toContainText("Z Best Media");
        await expect(page.locator("[data-legal-effective]")).toBeVisible();

        // Anything unfilled is visibly marked, never passed off as text; only
        // known tokens may appear. A production build refuses to ship any.
        const tokens = await page.locator("main [data-placeholder]").allInnerTexts();
        for (const t of tokens) expect(t).toMatch(/^\[[A-Z0-9][A-Z0-9 ,.'’/&—()-]*\]$/);

        // Legal Brief cross-cutting note 2: no unconfirmed entity name.
        expect(text).not.toMatch(/silverback|pussycat/i);
        // Search Intelligence stays unlinked and unnamed (Brief §A4).
        expect(text).not.toMatch(/search intelligence|visibility readiness/i);
        expect(await page.locator('main a[href*="search-intelligence"]').count()).toBe(0);

        // Still noindex until the placeholders are filled (lib/site.ts).
        expect(await head(page, 'meta[name="robots"]')).toMatch(/noindex/);
      });
    }

    for (const doc of app.slug === "zbm" ? [] : LEGAL) {
      test(`${doc.path} — outline carries the not-yet-accepting-clients notice and no status wording`, async ({ page }) => {
        await presetConsent(page);
        const response = await page.goto(`${app.baseUrl}${doc.path}`, {
          waitUntil: "domcontentloaded",
        });
        expect(response?.status()).toBe(200);

        const banner = page.locator("[data-legal-notice]");
        await expect(banner).toBeVisible();
        await expect(banner).toHaveText(ZBC_LEGAL_NOTICE);
        // Above the fold and ahead of the title — it cannot be scrolled past
        // on the way to the content.
        await expect(banner).toBeInViewport();
        const bannerFirst = await page.evaluate(() => {
          const b = document.querySelector("[data-legal-notice]");
          const h1 = document.querySelector("main h1");
          return !!b && !!h1 && !!(b.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING);
        });
        expect(bannerFirst).toBe(true);

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(doc.title);

        // Every section is a placeholder: as many markers as section headings,
        // plus the entity line.
        const counts = await page.evaluate(() => ({
          sections: document.querySelectorAll("main ol :is(h2, h3)").length,
          placeholders: document.querySelectorAll("main ol [data-placeholder]").length,
        }));
        expect(counts.sections).toBeGreaterThanOrEqual(3);
        expect(counts.placeholders).toBe(counts.sections);
        await expect(page.getByText("[Legal entity — to be confirmed]")).toBeVisible();

        // The contracting entity is unconfirmed; no candidate name appears.
        const text = await page.locator("main").innerText();
        expect(text).not.toMatch(/silverback|pussycat/i);
        expect(text).not.toMatch(STATUS_WORDING);
        expect(await head(page, 'meta[name="description"]')).not.toMatch(STATUS_WORDING);

        // An outline must not be indexed as the company's terms.
        expect(await head(page, 'meta[name="robots"]')).toMatch(/noindex/);
      });
    }

    test("404 returns 404, is noindex, and offers a way home", async ({ page }) => {
      await presetConsent(page);
      const response = await page.goto(`${app.baseUrl}/no/such/page`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn’t here.");
      const robots = await page.evaluate(() =>
        [...document.head.querySelectorAll('meta[name="robots"]')].map((m) => m.getAttribute("content")),
      );
      expect(robots.some((r) => /noindex/.test(r ?? ""))).toBe(true);
      await page.getByRole("link", { name: "Back to the homepage" }).click();
      await expect(page).toHaveURL(`${app.baseUrl}/`);
    });

    test("sitemap.xml lists only built, indexable pages on the canonical host", async ({ page }) => {
      const res = await page.request.get(`${app.baseUrl}/sitemap.xml`);
      expect(res.status()).toBe(200);
      const xml = await res.text();
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

      expect(locs.length).toBeGreaterThan(0);
      expect(xml).not.toMatch(/search-intelligence/i);
      expect(xml).not.toMatch(/\/dev(\/|<)/);
      for (const loc of locs) {
        expect(new URL(loc).origin, `${loc} is on the canonical host`).toBe(app.origin);
      }
      expect(locs.map((l) => new URL(l).pathname)).toContain("/");

      // Every listed URL resolves in THIS build, is indexable, and declares
      // itself canonical — a sitemap entry that 404s, is noindex, or points at a
      // different canonical is a sitemap error.
      for (const loc of locs) {
        const { pathname } = new URL(loc);
        const pageRes = await page.goto(`${app.baseUrl}${pathname}`, { waitUntil: "domcontentloaded" });
        expect(pageRes?.status(), `${loc} resolves`).toBe(200);
        expect((await head(page, 'meta[name="robots"]')) ?? "", `${loc} is indexable`).not.toMatch(/noindex/);
        expect(await head(page, 'link[rel="canonical"]', "href")).toBe(loc);
      }

      // Legal shells are drafts: built, but deliberately absent.
      for (const doc of LEGAL) expect(xml).not.toContain(doc.path);
    });

    test("robots.txt allows crawling, points at the sitemap, names no hidden route", async ({ page }) => {
      const res = await page.request.get(`${app.baseUrl}/robots.txt`);
      expect(res.status()).toBe(200);
      const txt = await res.text();
      expect(txt).toMatch(/User-Agent: \*/i);
      expect(txt).toMatch(/^Allow: \/$/m);
      expect(txt).not.toMatch(/^Disallow: \/\s*$/m);
      expect(txt).toContain(`Sitemap: ${app.origin}/sitemap.xml`);
      // Naming a hidden route in public robots.txt would disclose it (§A4).
      expect(txt).not.toMatch(/search-intelligence/i);
      expect(txt).not.toMatch(/\/dev/);
    });

    test("metadata defaults: canonical, Open Graph and Twitter on the canonical host", async ({
      page,
    }) => {
      await presetConsent(page);
      for (const p of [{ path: "/", title: null }, ...LEGAL.map((l) => ({ path: l.path, title: l.title }))]) {
        await page.goto(`${app.baseUrl}${p.path}`, { waitUntil: "domcontentloaded" });
        const url = `${app.origin}${p.path === "/" ? "" : p.path}`;
        const title = p.title ? `${p.title} — ${app.name}` : app.name;

        await expect(page).toHaveTitle(title);
        expect(await head(page, 'link[rel="canonical"]', "href"), `${p.path} canonical`).toBe(url);
        expect(await head(page, 'meta[property="og:url"]')).toBe(url);
        expect(await head(page, 'meta[property="og:title"]')).toBe(title);
        expect(await head(page, 'meta[property="og:site_name"]')).toBe(app.name);
        expect(await head(page, 'meta[property="og:type"]')).toBe("website");
        expect(await head(page, 'meta[name="description"]')).toBeTruthy();
        expect(await head(page, 'meta[name="twitter:card"]')).toBe("summary_large_image");
        // The first build of the metadata helper dropped og:image on every
        // nested route while the homepage kept it — asserted per page for that
        // reason.
        expect(await head(page, 'meta[property="og:image"]'), `${p.path} og:image`).toBe(
          `${app.origin}/opengraph-image`,
        );
        expect(await head(page, 'meta[name="twitter:image"]')).toBe(`${app.origin}/opengraph-image`);
      }
    });

    test("OG image renders on the brand base color at 1200×630", async ({ page }, testInfo) => {
      const res = await page.request.get(`${app.baseUrl}/opengraph-image`);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe("image/png");
      const png = await res.body();
      // IHDR: width and height are big-endian at bytes 16 and 20.
      expect(png.readUInt32BE(16)).toBe(1200);
      expect(png.readUInt32BE(20)).toBe(630);

      // Open the PNG in the browser and sample a corner pixel: the brief says
      // "on the brand base color" (§7), so check the color, not just the size.
      await page.setContent(`<canvas id="c" width="1200" height="630"></canvas>`);
      const corner = await page.evaluate(async (b64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const ctx = (document.getElementById("c") as HTMLCanvasElement).getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return [...ctx.getImageData(5, 5, 1, 1).data.slice(0, 3)];
      }, png.toString("base64"));
      expect(corner).toEqual(app.slug === "zbm" ? [14, 15, 18] : [11, 13, 16]);

      if (!isMobile(testInfo.project.name)) {
        await mkdir(SNAPSHOT_DIR, { recursive: true });
        await writeFile(path.join(SNAPSHOT_DIR, `${app.slug}-og-default.png`), png);
      }
    });

    test("Cookie Settings reopens a consent choice already made", async ({ page }) => {
      await page.goto(`${app.baseUrl}/`, { waitUntil: "domcontentloaded" });
      const dialog = page.getByRole("dialog", { name: "Cookies on this site" });
      await expect(dialog).toBeVisible();

      // Phase 2 carry-forward: the banner's Cookie Policy link now resolves.
      const policyHref = await dialog.getByRole("link", { name: "Cookie Policy" }).getAttribute("href");
      expect((await page.request.get(`${app.baseUrl}${policyHref}`)).status()).toBe(200);

      await dialog.getByRole("button", { name: "Reject non-essential" }).click();
      await expect(dialog).toBeHidden();

      await page.getByRole("contentinfo").getByRole("link", { name: "Cookie Settings" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cookie Policy");
      await expect(dialog).toBeHidden();

      await page.getByRole("button", { name: "Change cookie settings" }).click();
      await expect(dialog).toBeVisible();

      // The banner's detail says what each site really stores; neither carries
      // review-status wording (founder decision Oct 30 2026).
      await dialog.getByRole("button", { name: "What we store" }).click();
      const detail = dialog.locator("#cookie-consent-detail");
      if (app.slug === "zbm") {
        await expect(detail).toContainText("Not used on this site.");
        await expect(dialog).toContainText("doesn’t use analytics or advertising cookies");
      } else {
        await expect(detail).toContainText(ZBC_LEGAL_NOTICE);
        await expect(detail).toContainText("Not used on this site.");
      }
      expect(await dialog.innerText()).not.toMatch(STATUS_WORDING);
      await dialog.getByRole("button", { name: "Accept all" }).click();
      expect(await page.evaluate((k) => window.localStorage.getItem(k), CONSENT_KEY)).toContain(
        "accepted-all",
      );
    });
  });
}

test.describe("Z Best Clips — Entertainment/Brands color-coded system", () => {
  const FOCI = [
    { focus: "entertainment", accent: ENT, other: BRAND },
    { focus: "brands", accent: BRAND, other: ENT },
  ] as const;

  const bg = (loc: Locator) =>
    loc.evaluate((el) => getComputedStyle(el).backgroundColor);

  for (const f of FOCI) {
    test(`${f.focus} page focus carries through page accent, nav, CTA, card edge and banner`, async ({
      page,
    }, testInfo) => {
      const response = await page.goto(`${ZBC_BASE_URL}/dev/system/focus/${f.focus}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);
      expect(await head(page, 'meta[name="robots"]')).toMatch(/noindex/);
      const main = page.locator("main");
      await expect(main).toHaveAttribute("data-page-focus", f.focus);

      // Page accent.
      await expect(main.locator(".type-label.text-accent").first()).toHaveCSS("color", f.accent);
      // CTA color.
      expect(await bg(page.getByTestId("page-cta"))).toBe(f.accent);
      // Card edge — and a card explicitly scoped to the other focus keeps its
      // own, so a page focus never bleeds into How It Works-style mixed pages.
      await expect(page.getByTestId("page-card")).toHaveCSS("border-left-color", f.accent);
      await expect(page.getByTestId("other-card")).toHaveCSS("border-left-color", f.other);

      // The consent banner lives in the root layout, outside <main>.
      const dialog = page.getByRole("dialog", { name: "Cookies on this site" });
      expect(await bg(dialog.getByRole("button", { name: "Accept all" }))).toBe(f.accent);
      await dialog.getByRole("button", { name: "Reject non-essential" }).click();

      // Nav CTA (root layout) and the dropdown entries, each in its own color.
      const header = page.getByRole("banner");
      if (isMobile(testInfo.project.name)) {
        await header.getByRole("button", { name: "Menu" }).click();
      } else {
        await header.getByRole("button", { name: "Focus Areas" }).click();
      }
      expect(await bg(header.locator("[data-nav-cta]:visible"))).toBe(f.accent);
      expect(await bg(header.locator('li[data-focus="entertainment"]:visible [data-focus-marker]'))).toBe(ENT);
      expect(await bg(header.locator('li[data-focus="brands"]:visible [data-focus-marker]'))).toBe(BRAND);

      await capture(page, `zbc-focus-${f.focus}-nav-open-${testInfo.project.name}`, testInfo);
    });
  }

  test("a page without a focus keeps the documented default and does not inherit one", async ({
    page,
  }, testInfo) => {
    // Visit a Brands page first: client state must not carry the accent over.
    await presetConsent(page);
    await page.goto(`${ZBC_BASE_URL}/dev/system/focus/brands`, { waitUntil: "domcontentloaded" });
    await page.goto(`${ZBC_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const header = page.getByRole("banner");
    if (isMobile(testInfo.project.name)) await header.getByRole("button", { name: "Menu" }).click();
    // Entertainment is the page default (tokens.css, certified in Phase 2).
    expect(await bg(header.locator("[data-nav-cta]:visible"))).toBe(ENT);
  });

  test("Z Best Media ignores data-page-focus", async ({ page }) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const accent = await page.evaluate(() => {
      document.querySelector("main")!.setAttribute("data-page-focus", "brands");
      return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    });
    expect(accent.toLowerCase()).toBe("#c99a4b");
  });
});

// eslint-disable-next-line no-empty-pattern -- Playwright requires the fixtures object pattern.
test("OG literals match the brand tokens", async ({}, testInfo) => {
  test.skip(isMobile(testInfo.project.name), "file comparison — viewport-independent");
  // next/og cannot read CSS variables, so og.tsx repeats the brand values.
  // This is the check that they have not drifted from tokens.css.
  const [og, tokens] = await Promise.all([
    readFile(path.join(REPO_ROOT, "packages/ui/src/og.tsx"), "utf8"),
    readFile(path.join(REPO_ROOT, "packages/ui/src/styles/tokens.css"), "utf8"),
  ]);
  const literals = [...og.matchAll(/"([a-z0-9-]+)": "(#[0-9a-f]{6})"/gi)];
  expect(literals.length).toBe(7);
  for (const [, name, hex] of literals) {
    const token = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6});`, "i"));
    expect(token?.[1]?.toLowerCase(), `--${name}`).toBe(hex!.toLowerCase());
  }
});
