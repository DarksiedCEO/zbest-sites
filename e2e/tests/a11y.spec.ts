import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";
import { formReady } from "../support/ready";

/**
 * Accessibility gate (WCAG 2.2 AA) — Andre's locked requirement: automated
 * axe checks in the Playwright suite on every change, and a failure blocks
 * release. This file runs under the required `e2e` check, so a violation
 * blocks the merge.
 *
 * Two layers:
 *   1. axe-core on every route of both sites, in every state a visitor can
 *      reach without data: consent banner open, banner details open, banner
 *      dismissed with the nav menu and an FAQ open, and each form's error
 *      state. ZERO violations are allowed. Nothing is disabled.
 *   2. Scripted keyboard checks for what axe cannot see (docs/accessibility.md
 *      lists them): focus never fully hidden by the sticky header or the
 *      consent banner (2.4.11), the menu and banner at 400% zoom (1.4.10),
 *      focus after a form submit (2.4.3), the skip link (2.4.1), the cookie
 *      settings reopen, and the hero text's contrast mid-scroll (1.4.3).
 *
 * What this does NOT prove: anything a screen reader would tell a person.
 * That pass is manual and is recorded in docs/accessibility.md.
 *
 * Origin: the Oct 30 2026 WCAG 2.2 AA audit (S1–S4, M1–M6, Z1–Z2).
 */

/** axe tags for WCAG 2.0, 2.1 and 2.2, levels A and AA. (axe has no "wcag22a" tag; 2.2's new A criteria are not automatable.) */
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * axe "best-practice" rules that guard audit findings axe does not tag as WCAG.
 * Each one failed, or would have failed, on the Oct 30 audit:
 *   heading-order        — M1, section titles not marked up / h1 → h3 skips (1.3.1)
 *   page-has-heading-one — one <h1> per page
 *   landmark-one-main    — exactly one <main> (the skip link's target)
 *   skip-link            — the skip link's target exists (m1, 2.4.1)
 */
const STRUCTURE_RULES = ["heading-order", "page-has-heading-one", "landmark-one-main", "skip-link"];

const ZBM_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/digital-advertising",
  "/tv-streaming",
  "/radio-audio",
  "/out-of-home",
  "/social-media",
  "/creative-production",
  "/influencer-marketing",
  "/websites",
  "/revenue-recovery",
  // Built but never linked (CLAUDE.md, Brief §A4) — still served, so still scanned.
  "/search-intelligence",
  "/start",
  "/faq",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/this-page-does-not-exist",
];
const ZBC_ROUTES = [
  "/",
  "/about",
  "/entertainment",
  "/brands",
  "/pricing",
  "/faq",
  "/media-kit",
  "/launch-a-campaign",
  "/become-a-clipper",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/this-page-does-not-exist",
];
const SITES = [
  { site: "zbm", base: ZBM_BASE_URL, routes: ZBM_ROUTES },
  { site: "zbc", base: ZBC_BASE_URL, routes: ZBC_ROUTES },
] as const;

const CONSENT_KEY = "zbest-cookie-consent";
const isMobile = (info: TestInfo) => info.project.name.startsWith("mobile");

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

/** Runs axe (WCAG A/AA tags, then the structure rules) and requires zero violations. */
async function expectNoViolations(page: Page, label: string) {
  const wcag = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const structure = await new AxeBuilder({ page }).withRules(STRUCTURE_RULES).analyze();
  const violations = [...wcag.violations, ...structure.violations].map(
    (v) =>
      `${v.id} (${v.impact}) ${v.help}\n` +
      v.nodes
        .slice(0, 5)
        .map((n) => `    ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`)
        .join("\n"),
  );
  expect(violations, `axe violations — ${label}`).toEqual([]);
}

const banner = (page: Page) => page.getByRole("dialog", { name: "Cookies on this site" });

// ---------------------------------------------------------------------------
// 1. axe on every route, every reachable state.
// ---------------------------------------------------------------------------

for (const { site, base, routes } of SITES) {
  test.describe(`axe ${site}`, () => {
    // Up to eight axe passes per route; the default 30 s is too tight on a
    // loaded runner. A real hang still fails.
    test.describe.configure({ timeout: 180_000 });
    for (const route of routes) {
      test(`${site} ${route}`, async ({ page }, testInfo) => {
        await page.goto(base + route, { waitUntil: "networkidle" });
        const where = `${site}${route} [${testInfo.project.name}]`;

        // First visit: the consent banner is open.
        await expect(banner(page)).toBeVisible();
        await expectNoViolations(page, `${where} banner open`);

        await page.getByRole("button", { name: "What we store" }).click();
        await expectNoViolations(page, `${where} banner details open`);

        await page.getByRole("button", { name: "Reject non-essential" }).click();
        await expect(banner(page)).toBeHidden();

        // Menus and the first FAQ answer open.
        const header = page.locator("header:has(> nav[aria-label='Primary'])");
        if (isMobile(testInfo)) {
          await header.getByRole("button", { name: "Menu" }).click();
        } else {
          const dropdown = header.locator("button[aria-expanded]").first();
          if (await dropdown.count()) await dropdown.click();
        }
        const faq = page.locator("main h3 > button[aria-expanded='false']").first();
        if (await faq.count()) await faq.click();
        await expectNoViolations(page, `${where} banner dismissed, menu + FAQ open`);
        await page.keyboard.press("Escape");

        // Each form's error state: submitted empty.
        const forms = page.locator("form[data-lead-form]");
        const count = await forms.count();
        for (let i = 0; i < count; i++) {
          const form = await formReady(forms.nth(i));
          await form.locator("button[type=submit]").click();
          await expect(form.locator("[aria-invalid='true'], [data-invalid='true'], [role='alert']").first()).toBeVisible();
        }
        if (count) await expectNoViolations(page, `${where} form errors`);
      });
    }

    // Any indexable route added later is scanned even before it is listed
    // above, so a new page cannot ship unscanned.
    test(`${site} sitemap routes not listed above`, async ({ page, request }, testInfo) => {
      const xml = await (await request.get(`${base}/sitemap.xml`)).text();
      const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname || "/");
      const extra = paths.filter((p) => !(routes as readonly string[]).includes(p));
      for (const path of extra) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        await expectNoViolations(page, `${site}${path} (from sitemap) [${testInfo.project.name}]`);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Scripted keyboard checks: what axe cannot see.
// ---------------------------------------------------------------------------

type Focused = { name: string; hidden: boolean; body: boolean; key: string };

/**
 * Where focus is, and whether it is ENTIRELY hidden (WCAG 2.4.11): none of
 * five sample points on the focused element is both inside the viewport and
 * topmost there (its own label counts as itself).
 */
const focused = (page: Page) =>
  page.evaluate((): Focused => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return { name: "BODY", hidden: false, body: true, key: "" };
    const r = el.getBoundingClientRect();
    const pts: [number, number][] = [
      [r.left + r.width / 2, r.top + r.height / 2],
      [r.left + 2, r.top + 2],
      [r.right - 2, r.top + 2],
      [r.left + 2, r.bottom - 2],
      [r.right - 2, r.bottom - 2],
    ];
    const labels = [...((el as HTMLInputElement).labels ?? [])];
    const seen = pts.some(([x, y]) => {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
      const top = document.elementFromPoint(x, y);
      return !!top && (top === el || el.contains(top) || top.contains(el) || labels.some((l) => l.contains(top)));
    });
    const name = (el.getAttribute("aria-label") || el.innerText || (el as HTMLInputElement).name || el.tagName)
      .trim()
      .slice(0, 40);
    const path = (n: Element | null): string => (n && n.parentElement ? `${path(n.parentElement)}>${[...n.parentElement.children].indexOf(n)}` : "");
    return { name, hidden: !seen, body: false, key: path(el) };
  });

/** Tabs through the page in one direction; returns every stop where focus was entirely hidden. */
async function walk(page: Page, key: "Tab" | "Shift+Tab", max = 160) {
  const hidden: string[] = [];
  let first = "";
  for (let i = 0; i < max; i++) {
    await page.keyboard.press(key);
    const f = await focused(page);
    if (f.body && i > 1) break;
    if (f.body) continue;
    if (f.key === first) break; // wrapped around
    first ||= f.key;
    if (f.hidden) hidden.push(`#${i} ${f.name}`);
  }
  return hidden;
}

const FOCUS_ROUTES = [
  { base: ZBM_BASE_URL, route: "/" },
  { base: ZBM_BASE_URL, route: "/start" },
  { base: ZBM_BASE_URL, route: "/revenue-recovery" },
  { base: ZBM_BASE_URL, route: "/contact" },
  { base: ZBM_BASE_URL, route: "/faq" },
  { base: ZBC_BASE_URL, route: "/" },
  { base: ZBC_BASE_URL, route: "/launch-a-campaign" },
];

test.describe("keyboard", () => {
  // Keyboard walks press Tab a few hundred times per test.
  test.describe.configure({ timeout: 180_000 });
  for (const { base, route } of FOCUS_ROUTES) {
    const site = base === ZBM_BASE_URL ? "zbm" : "zbc";
    test(`2.4.11 focus is never fully hidden — ${site} ${route}`, async ({ page }) => {
      // Consent banner open (S1): forward, then backward from the page end.
      await page.goto(base + route, { waitUntil: "networkidle" });
      await expect(banner(page)).toBeVisible();
      expect(await walk(page, "Tab"), "banner open, Tab").toEqual([]);
      await page.goto(base + route, { waitUntil: "networkidle" });
      expect(await walk(page, "Shift+Tab"), "banner open, Shift+Tab").toEqual([]);

      // Banner dismissed (S2): backward, where the sticky header covered focus.
      await presetConsent(page);
      await page.goto(base + route, { waitUntil: "networkidle" });
      await expect(banner(page)).toBeHidden();
      expect(await walk(page, "Shift+Tab"), "banner dismissed, Shift+Tab").toEqual([]);
    });
  }

  for (const base of [ZBM_BASE_URL, ZBC_BASE_URL]) {
    const site = base === ZBM_BASE_URL ? "zbm" : "zbc";

    test(`1.4.10 at 400% zoom (320x256): the open menu and the banner stay reachable — ${site}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 256 });

      // Banner: within the viewport, heading on screen, every stop visible.
      await page.goto(base + "/", { waitUntil: "networkidle" });
      const box = (await banner(page).boundingBox())!;
      expect(box.y, "banner top inside the viewport").toBeGreaterThanOrEqual(0);
      expect(box.height, "banner at most half the viewport").toBeLessThanOrEqual(256 / 2 + 1);
      await expect(page.locator("#cookie-consent-heading")).toBeInViewport();
      expect(await walk(page, "Shift+Tab", 6), "banner buttons").toEqual([]);

      // Mobile menu (S3): every link in the open panel can be seen when focused.
      await presetConsent(page);
      await page.goto(base + "/", { waitUntil: "networkidle" });
      const menu = page.getByRole("button", { name: "Menu" });
      // Read before opening: the button is renamed "Close" once open.
      const panel = page.locator(`[id="${await menu.getAttribute("aria-controls")}"]`);
      await menu.focus();
      await page.keyboard.press("Enter");
      await expect(panel).toBeVisible();
      const links = await panel.locator("a").count();
      const hidden: string[] = [];
      for (let i = 0; i < links; i++) {
        await page.keyboard.press("Tab");
        const f = await focused(page);
        if (f.hidden) hidden.push(f.name);
      }
      expect(hidden, "menu links focused but not visible").toEqual([]);
    });

    test(`2.4.1 skip link is the first stop and moves focus to <main> — ${site}`, async ({ page }) => {
      await presetConsent(page);
      await page.goto(base + "/about", { waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      const f = await focused(page);
      expect(f.name).toMatch(/skip to content/i);
      expect(f.hidden, "skip link visible when focused").toBe(false);
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
    });
  }

  test("2.4.3 'Change cookie settings' moves focus into the banner, and back after a choice", async ({ page }) => {
    await presetConsent(page);
    await page.goto(ZBM_BASE_URL + "/legal/cookie-policy", { waitUntil: "networkidle" });
    const opener = page.getByRole("button", { name: "Change cookie settings" });
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeVisible();
    await expect(page.locator("#cookie-consent-heading")).toBeFocused();
    // Keyboard to "Reject non-essential": the next stops are inside the banner.
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      if (await page.getByRole("button", { name: "Reject non-essential" }).evaluate((b) => b === document.activeElement)) break;
    }
    await expect(page.getByRole("button", { name: "Reject non-essential" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(banner(page)).toBeHidden();
    await expect(opener).toBeFocused();
  });

  // Every form, submitted empty from the keyboard: focus must land on the
  // first invalid control, never on <body> (M5).
  const FORM_ROUTES = [
    { base: ZBM_BASE_URL, route: "/contact" },
    { base: ZBM_BASE_URL, route: "/start" },
    { base: ZBM_BASE_URL, route: "/revenue-recovery" },
    { base: ZBM_BASE_URL, route: "/search-intelligence" },
    { base: ZBC_BASE_URL, route: "/launch-a-campaign" },
    { base: ZBC_BASE_URL, route: "/become-a-clipper" },
  ];
  for (const { base, route } of FORM_ROUTES) {
    const site = base === ZBM_BASE_URL ? "zbm" : "zbc";
    test(`2.4.3 empty submit moves focus to the first invalid control — ${site} ${route}`, async ({ page }) => {
      await presetConsent(page);
      await page.goto(base + route, { waitUntil: "networkidle" });
      const forms = page.locator("form[data-lead-form]");
      const count = await forms.count();
      expect(count, "form present").toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const form = await formReady(forms.nth(i));
        await form.locator("button[type=submit]").focus();
        await page.keyboard.press("Enter");
        await expect
          .poll(() =>
            form.evaluate((f) => {
              const a = document.activeElement;
              return !!a && f.contains(a) && (a.getAttribute("aria-invalid") === "true" || !!a.closest("[data-invalid='true']"));
            }),
          )
          .toBe(true);
        // ...and it is the FIRST one, in DOM order.
        expect(
          await form.evaluate(
            (f) => f.querySelector('[aria-invalid="true"], [data-invalid="true"] input:not([type="hidden"])') === document.activeElement,
          ),
        ).toBe(true);
      }
    });
  }

  // While sending, the focused button keeps focus; the result or the failure
  // takes it when the response arrives (M5). The response is stubbed: this is
  // about focus, not delivery (phase-7 covers delivery), and a stub makes it
  // independent of which fields the form asks for.
  for (const outcome of ["accepted", "failed"] as const) {
    test(`2.4.3 lead form keeps focus while sending, then focuses the ${outcome} message`, async ({ page }) => {
      await presetConsent(page);
      let release!: () => void;
      const held = new Promise<void>((r) => (release = r));
      await page.route("**/api/lead", async (route) => {
        await held;
        await route.fulfill(
          outcome === "accepted"
            ? { status: 200, json: { ok: true, submission_id: "a11y-stub" } }
            : { status: 503, json: { ok: false, error: { code: "unavailable" } } },
        );
      });
      await page.goto(ZBM_BASE_URL + "/contact", { waitUntil: "networkidle" });
      const form = await formReady(page.locator('form[data-lead-form="contact"]'));
      const send = form.locator("button[type=submit]");
      await send.focus();
      await page.keyboard.press("Enter");
      await expect(send).toHaveAttribute("aria-disabled", "true");
      await expect(send, "the sending button keeps focus").toBeFocused();
      release();
      const target = outcome === "accepted" ? page.locator('[data-lead-result="accepted"]') : page.locator("[data-lead-failure]");
      await expect(target).toBeFocused();
    });
  }

  test("1.4.3 hero text keeps its contrast mid-scroll (motion on)", async ({ page }) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(ZBM_BASE_URL + "/", { waitUntil: "networkidle" });
    for (const y of [150, 300, 450]) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(250);
      // No ancestor of the hero copy may be faded.
      const opacity = await page.locator("main header h1").evaluate((el) => {
        let o = 1;
        for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
        return o;
      });
      expect(opacity, `hero opacity at ${y}px`).toBe(1);
      const r = await new AxeBuilder({ page }).withRules(["color-contrast"]).include("main header").analyze();
      expect(r.violations.map((v) => v.id), `contrast at ${y}px`).toEqual([]);
    }
  });
});
