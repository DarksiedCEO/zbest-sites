import { expect, test, type Page } from "@playwright/test";
import { ZBC_BASE_URL, ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 6 step 3: security headers (packages/ui/src/security-headers.ts).
 * Every page of both apps is served with the CSP and its companion headers,
 * and under that CSP the fonts load, the consent banner works and all six
 * lead forms submit, with zero CSP violations reported by the browser.
 *
 * The gate runs `next start` (NODE_ENV=production, no VERCEL_ENV), so this
 * is the production policy: no 'unsafe-eval', no vercel.live.
 */

const REQUIRED: [string, string][] = [
  ["default-src", "'self'"],
  ["object-src", "'none'"],
  ["base-uri", "'self'"],
  ["form-action", "'self'"],
  ["frame-ancestors", "'none'"],
  ["font-src", "'self'"],
  ["connect-src", "'self'"],
];

function directives(csp: string) {
  return new Map(
    csp.split(";").map((d) => d.trim().split(/\s+/)).filter((p) => p[0]).map(([n, ...v]) => [n!, v] as const),
  );
}

/** Records every CSP violation the browser reports, from first script on. */
async function watchCsp(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (e) =>
      (window as unknown as { __csp: string[] }).__csp.push(`${e.effectiveDirective} ${e.blockedURI} ${e.sourceFile}:${e.lineNumber}`),
    );
  });
  const consoleCsp: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to/i.test(m.text())) consoleCsp.push(m.text());
  });
  return consoleCsp;
}

const violations = (page: Page) => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);

async function routes(page: Page, base: string, extra: string[]) {
  const xml = await (await page.request.get(`${base}/sitemap.xml`)).text();
  return [...new Set([...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname), ...extra])];
}

for (const [app, base, extra] of [
  ["zbm", ZBM_BASE_URL, ["/search-intelligence", "/legal/privacy-policy", "/nope"]],
  ["zbc", ZBC_BASE_URL, ["/legal/privacy-policy", "/nope"]],
] as const) {
  test(`${app}: every page sends the security headers and loads its fonts with zero CSP violations`, async ({ page }) => {
    const consoleCsp = await watchCsp(page);
    const report: string[] = [];
    for (const p of await routes(page, base, [...extra])) {
      const res = await page.goto(`${base}${p}`, { waitUntil: "load" });
      const h = res!.headers();
      const csp = directives(h["content-security-policy"] ?? "");
      for (const [name, value] of REQUIRED) expect(csp.get(name), `${p} ${name}`).toEqual([value]);
      expect(csp.get("script-src"), `${p} script-src`).not.toContain("'unsafe-eval'");
      expect(h["content-security-policy"], `${p} vercel.live outside preview`).not.toContain("vercel.live");
      expect(h["strict-transport-security"], p).toBe("max-age=63072000; includeSubDomains");
      expect(h["x-content-type-options"], p).toBe("nosniff");
      expect(h["referrer-policy"], p).toBe("strict-origin-when-cross-origin");
      expect(h["permissions-policy"], p).toContain("camera=()");
      expect(h["x-frame-options"], p).toBe("DENY");
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() => {
        const all = [...document.fonts];
        return { loaded: all.filter((f) => f.status === "loaded").length, error: all.filter((f) => f.status === "error").length };
      });
      const v = await violations(page);
      report.push(`${p} fontsLoaded=${fonts.loaded} fontErrors=${fonts.error} violations=${v.length}`);
      expect(fonts.error, `${p} font errors`).toBe(0);
      expect(fonts.loaded, `${p} no fonts loaded`).toBeGreaterThan(0);
      expect(v, `${p} CSP violations`).toEqual([]);
    }
    test.info().annotations.push({ type: "fonts", description: report.join("\n") });
    expect(consoleCsp).toEqual([]);
  });

  test(`${app}: consent banner works under the CSP`, async ({ page }) => {
    const consoleCsp = await watchCsp(page);
    await page.goto(`${base}/`, { waitUntil: "load" });
    const banner = page.locator('[aria-labelledby="cookie-consent-heading"]');
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Reject non-essential" }).click();
    await expect(banner).toBeHidden();
    const stored = await page.evaluate(() => window.localStorage.getItem("zbest-cookie-consent"));
    expect(stored).toContain("rejected");
    await page.reload({ waitUntil: "load" });
    await expect(banner).toBeHidden();
    expect(await violations(page)).toEqual([]);
    expect(consoleCsp).toEqual([]);
  });
}

const FORMS = [
  [ZBM_BASE_URL, "/contact"],
  [ZBM_BASE_URL, "/start"],
  [ZBM_BASE_URL, "/revenue-recovery"],
  [ZBM_BASE_URL, "/search-intelligence"],
  [ZBC_BASE_URL, "/launch-a-campaign"],
  [ZBC_BASE_URL, "/become-a-clipper"],
] as const;

for (const [base, p] of FORMS) {
  test(`lead form on ${base === ZBM_BASE_URL ? "zbm" : "zbc"}${p} submits under the CSP`, async ({ page }) => {
    const consoleCsp = await watchCsp(page);
    await page.addInitScript(() =>
      window.localStorage.setItem("zbest-cookie-consent", JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" })),
    );
    await page.goto(`${base}${p}`, { waitUntil: "load" });
    const form = page.locator("form[data-lead-form]").first();
    await form.scrollIntoViewIfNeeded();
    await expect(form).toHaveAttribute("data-ready", "true", { timeout: 15_000 });

    for (const el of await form.locator("input:visible, textarea:visible").all()) {
      const type = (await el.getAttribute("type")) ?? "text";
      if (type === "radio" || type === "checkbox" || type === "hidden" || type === "submit") continue;
      const label = ((await el.getAttribute("name")) ?? "").toLowerCase();
      await el.fill(type === "email" || label.includes("email") || label.includes("reach") ? "csp-probe@example.com" : type === "url" || label.includes("website") || label.includes("url") ? "https://example.com" : "CSP probe");
    }
    for (const sel of await form.locator("select:visible").all()) {
      const values = await sel.locator("option").evaluateAll((os) => os.map((o) => (o as HTMLOptionElement).value).filter(Boolean));
      if (values[0]) await sel.selectOption(values[0]);
    }
    const groups = new Set<string>();
    for (const r of await form.locator('input[type="radio"], input[type="checkbox"]').all()) {
      const n = (await r.getAttribute("name")) ?? "";
      if (groups.has(n)) continue;
      groups.add(n);
      await r.evaluate((el) => (el as HTMLInputElement).click());
    }

    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead") && r.request().method() === "POST"),
      form.locator('button[type="submit"]').click(),
    ]);
    const body = await res.text();
    expect(res.status(), body).toBe(200);
    await expect(page.locator('[data-lead-result="accepted"], [data-lead-result]').first()).toBeVisible();
    expect(await violations(page)).toEqual([]);
    expect(consoleCsp).toEqual([]);
  });
}
