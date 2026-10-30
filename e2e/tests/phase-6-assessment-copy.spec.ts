import { expect, test } from "@playwright/test";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Copy ruling, Oct 28 2026: the assessment note said "Nothing you enter is
 * stored or sent", which stopped being true once the lead route stored leads.
 * This guards the raw HTML the server sends, not the rendered page, so a
 * hidden element or an attribute counts too.
 *
 * Scope is Z Best Media, where the assessment lives. Z Best Clips still uses
 * placeholder notes (data-fixture-note) on purpose.
 */

/** Routes the sitemap does not list but the server still serves. */
const UNLISTED = [
  "/search-intelligence",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
  "/legal/accessibility",
  "/this-page-does-not-exist",
];

const FORBIDDEN = [/stored or sent/i, /fixture/i];

test("no served Z Best Media page says 'stored or sent' or 'fixture'", async ({ request }) => {
  const xml = await (await request.get(`${ZBM_BASE_URL}/sitemap.xml`)).text();
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  expect(listed.length, "sitemap lists no pages").toBeGreaterThan(5);

  const paths = [...new Set([...listed, ...UNLISTED])];
  for (const p of paths) {
    const res = await request.get(`${ZBM_BASE_URL}${p}`);
    expect([200, 404], `${p} answered ${res.status()}`).toContain(res.status());
    const html = await res.text();
    for (const pattern of FORBIDDEN) {
      const hit = html.match(pattern);
      expect(hit, `${p} serves ${pattern}: …${hit ? html.slice(Math.max(0, hit.index! - 60), hit.index! + 60) : ""}…`).toBeNull();
    }
  }
});
