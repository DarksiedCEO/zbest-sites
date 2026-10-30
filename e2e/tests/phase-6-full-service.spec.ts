import { formReady } from "../support/ready";
import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 6 gate — full-service catalog (founder direction Oct 4, 2026;
 * docs/BRIEF-AMENDMENT-2026-10-04-full-service.md).
 *
 * Under test: the six new service pages, the /services hub, and the /start
 * universal intake — including campaign deep links (?service=, ?src=) and the
 * intake's server-side contract on the lead route (wired Oct 25, 2026; delivery
 * itself is asserted in phase-7-lead-route.spec.ts).
 *
 * Expected values are transcribed from the amendment here, not imported from
 * the app, so the gate cannot agree with a config that drifted.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-6-full-service");
const ORIGIN = "https://www.zbestmedia.com";
const CONSENT_KEY = "zbest-cookie-consent";
const ID = "8b1d3f6a-2c4e-4a7b-9e0f-1a2b3c4d5e6f";

const SERVICE_PAGES = [
  { slug: "tv-streaming", name: "TV & Streaming", h1: "Television, on the screens your customers actually watch." },
  { slug: "radio-audio", name: "Radio & Audio", h1: "Be heard where screens can’t reach." },
  { slug: "social-media", name: "Social Media", h1: "Social that runs every day, not when someone remembers." },
  { slug: "creative-production", name: "Creative & Production", h1: "Creative built to be measured, not just admired." },
  { slug: "influencer-marketing", name: "Influencer & Creator Partnerships", h1: "Creators your customers already trust." },
  { slug: "websites", name: "Websites & Landing Pages", h1: "Websites built to convert, not just to exist." },
] as const;

/** The whole catalog, in order, with where each entry points. */
const CATALOG: [string, string][] = [
  ["Digital Advertising", "/digital-advertising"],
  ["TV & Streaming", "/tv-streaming"],
  ["Radio & Audio", "/radio-audio"],
  ["Out-of-Home", "/out-of-home"],
  ["Social Media", "/social-media"],
  ["Creative & Production", "/creative-production"],
  ["Influencer & Creator Partnerships", "/influencer-marketing"],
  ["Z Best Clips", "https://zbestclips.com"],
  ["Revenue Recovery", "/revenue-recovery"],
  ["Websites & Landing Pages", "/websites"],
];

const INTAKE_VALUES = [
  "digital-advertising",
  "tv-streaming",
  "radio-audio",
  "out-of-home",
  "social-media",
  "creative-production",
  "influencer-marketing",
  "z-best-clips",
  "revenue-recovery",
  "websites",
  "not-sure",
];

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }),
    );
  }, CONSENT_KEY);
}

const head = (page: Page, selector: string, attr = "content") =>
  page.evaluate(
    ([sel, a]) => document.head.querySelector(sel)?.getAttribute(a) ?? null,
    [selector, attr] as const,
  );

const mainText = async (page: Page) =>
  ((await page.locator("main").textContent()) ?? "").replace(/\s+/g, " ");

async function capture(page: Page, name: string, projectName: string) {
  await page.evaluate(() => document.fonts.ready);
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, `zbm-${name}-${projectName}.png`), fullPage: true });
}

/** Site rules every new page holds (same bar as Phase 4). */
async function holdsSiteRules(page: Page, pagePath: string) {
  const url = `${ORIGIN}${pagePath}`;
  expect(await head(page, 'link[rel="canonical"]', "href")).toBe(url);
  const og = await head(page, 'meta[property="og:image"]');
  expect(og).toBe(`${ORIGIN}${pagePath}/opengraph-image`);
  const ogRes = await page.request.get(`${ZBM_BASE_URL}${new URL(og!).pathname}`);
  expect(ogRes.status()).toBe(200);
  expect(ogRes.headers()["content-type"]).toBe("image/png");
  expect((await head(page, 'meta[name="robots"]')) ?? "").not.toMatch(/noindex/);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "page scrolls horizontally").toBeLessThanOrEqual(0);

  // §A4 still holds: nothing links to, or names, Search Intelligence.
  const hrefs = await page.evaluate(() =>
    [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!))],
  );
  expect(hrefs.filter((h) => /search-intelligence/i.test(h))).toEqual([]);
  expect(await page.content()).not.toMatch(/search-intelligence/i);

  // Copy rules (amendment): no outcome numbers, percentages, case studies,
  // certifications, or "guaranteed" anything on the new pages.
  const text = await mainText(page);
  expect(text).not.toMatch(/\d+\s?%|case stud|certified|guarantee|award-winning|#1\b/i);

  // Every same-site link resolves.
  for (const href of hrefs.filter((h) => h.startsWith("/"))) {
    const [target] = href.split("#");
    const res = await page.request.get(`${ZBM_BASE_URL}${target}`);
    expect(res.status(), `link ${href} on ${pagePath}`).toBe(200);
  }
}

for (const s of SERVICE_PAGES) {
  test(`/${s.slug} — renders, holds the site rules, routes to the intake, and is captured`, async ({
    page,
  }, testInfo) => {
    await presetConsent(page);
    const response = await page.goto(`${ZBM_BASE_URL}/${s.slug}`, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(s.h1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(`${s.name} — Z Best Media`);
    expect((await head(page, 'meta[name="description"]'))?.length ?? 0).toBeGreaterThan(40);
    await holdsSiteRules(page, `/${s.slug}`);

    // Both Start a Project buttons pre-select this service.
    const starts = page.locator("main").getByRole("link", { name: "Start a Project" });
    await expect(starts).toHaveCount(2);
    for (const link of await starts.all()) {
      await expect(link).toHaveAttribute("href", `/start?service=${s.slug}`);
    }
    await expect(page.locator("main").getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");

    // Section order matches the Brief's own service pages.
    const labels = await page.locator("main section p.type-label").allTextContents();
    expect(labels.map((l) => l.trim())).toEqual([
      "What’s included",
      "How it fits with the rest of what we do",
      "Pricing",
      "Who this is for",
      "FAQ",
    ]);
    await expect(page.locator("#faq button[aria-expanded]")).toHaveCount(5);

    await capture(page, s.slug, testInfo.project.name);
  });
}

test("/services — every service, grouped, each linking to its page; captured", async ({ page }, testInfo) => {
  await presetConsent(page);
  const response = await page.goto(`${ZBM_BASE_URL}/services`, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Everything you need to be seen, remembered, and paid.",
  );
  await expect(page).toHaveTitle("Services — Z Best Media");
  await holdsSiteRules(page, "/services");

  await expect(page.locator("main section h2").first()).toHaveText("Get seen.");
  for (const [name, href] of CATALOG) {
    await expect(
      page.locator("main").getByRole("link", { name: new RegExp(`^${name.replace(/[&]/g, "\\$&")}`) }).first(),
    ).toHaveAttribute("href", href);
  }
  // Industries only — no client names or logos.
  await expect(page.locator("#who-we-work-with li")).toHaveCount(9);
  await expect(page.locator("main img")).toHaveCount(0);

  await capture(page, "services", testInfo.project.name);
});

test.describe("/start — universal intake", () => {
  const form = (page: Page) => page.locator('form[data-lead-form="start"]');
  const checked = (page: Page) =>
    form(page)
      .locator('input[type="checkbox"][name="services"]:checked')
      .evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));

  test("renders every service as a choice, plus Not sure; captured", async ({ page }, testInfo) => {
    await presetConsent(page);
    const response = await page.goto(`${ZBM_BASE_URL}/start`, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Start a Project — Z Best Media");
    await holdsSiteRules(page, "/start");

    const values = await form(page)
      .locator('input[type="checkbox"][name="services"]')
      .evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));
    expect(values).toEqual(INTAKE_VALUES);
    expect(await checked(page)).toEqual([]);
    // Amended Oct 25, 2026: the route is wired, so the stub marker is gone.
    await expect(form(page)).not.toContainText("Stub");
    for (const label of ["Name", "Business", "State or territory", "Best way to reach you"]) {
      await expect(form(page).getByLabel(label, { exact: true })).toBeVisible();
    }
    await capture(page, "start", testInfo.project.name);
  });

  test("campaign deep links pre-tick services; unknown values are ignored", async ({ page }) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=tv-streaming`, { waitUntil: "domcontentloaded" });
    expect(await checked(page)).toEqual(["tv-streaming"]);
    await page.goto(`${ZBM_BASE_URL}/start?service=TV-Streaming,social-media&service=out-of-home`, {
      waitUntil: "domcontentloaded",
    });
    expect(await checked(page)).toEqual(["tv-streaming", "out-of-home", "social-media"]);
    await page.goto(`${ZBM_BASE_URL}/start?service=bogus,<script>`, { waitUntil: "domcontentloaded" });
    expect(await checked(page)).toEqual([]);
  });

  test("the campaign tag is carried from ?src= (or utm_campaign), and junk is dropped", async ({ page }) => {
    await presetConsent(page);
    const source = () => form(page).locator('input[type="hidden"][name="source"]').inputValue();
    await page.goto(`${ZBM_BASE_URL}/start?src=Billboard-I405-Oct`, { waitUntil: "domcontentloaded" });
    expect(await source(), "stored lowercase so one campaign counts once").toBe("billboard-i405-oct");
    await page.goto(`${ZBM_BASE_URL}/start?utm_campaign=fall_radio.v2`, { waitUntil: "domcontentloaded" });
    expect(await source()).toBe("fall_radio.v2");
    await page.goto(`${ZBM_BASE_URL}/start?src=${encodeURIComponent('"><img src=x>')}`, {
      waitUntil: "domcontentloaded",
    });
    expect(await source()).toBe("");
  });

  test("submitting with nothing picked asks for a choice; captured", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start`, { waitUntil: "domcontentloaded" });
    await form(page).getByLabel("Name", { exact: true }).fill("Test Person");
    await form(page).getByLabel("Business", { exact: true }).fill("Test Co");
    await form(page).getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    await formReady(form(page));
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form(page).getByRole("button", { name: "Send" }).click(),
    ]);
    expect(response.status()).toBe(422);
    const group = form(page).locator('fieldset[data-field="services"]');
    await expect(group).toHaveAttribute("data-invalid", "true");
    await expect(group.locator('input[aria-invalid="true"]')).toHaveCount(11);
    await expect(group).toContainText("Pick at least one");
    await capture(page, "start-error", testInfo.project.name);
  });

  test("a campaign visitor submits: services and tag reach the lead route, which confirms receipt; captured", async ({
    page,
  }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=out-of-home&src=bb-test`, { waitUntil: "domcontentloaded" });
    await form(page).getByLabel(/TV & Streaming/).check();
    await form(page).getByLabel("Name", { exact: true }).fill("Test Person");
    await form(page).getByLabel("Business", { exact: true }).fill("Test Co");
    await form(page).getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    await form(page).getByLabel("Budget").selectOption("25k-100k");
    await form(page).getByLabel("State or territory", { exact: true }).selectOption("US-CA");
    await formReady(form(page));
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form(page).getByRole("button", { name: "Send" }).click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-zbest-lead-transport"]).toBe("fake");
    const sent = response.request().postDataJSON();
    expect(sent.form).toBe("start");
    expect(sent.fields.services).toBe("tv-streaming,out-of-home");
    expect(sent.fields.source).toBe("bb-test");
    expect(sent.fields.budget).toBe("25k-100k");
    expect(sent.fields.state).toBe("US-CA");
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Received");
    await capture(page, "start-accepted", testInfo.project.name);
  });
});

test.describe("/start — server contract on the lead route", () => {
  const post = (page: Page, fields: Record<string, string>) =>
    page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      data: { form: "start", submission_id: ID, fields },
      failOnStatusCode: false,
    });
  const base = {
    services: "radio-audio",
    name: "A",
    business: "B",
    reach: "C",
    website: "",
    budget: "",
    timing: "",
    details: "",
    source: "",
    state: "US-CA",
  };

  test("a minimal valid intake is acknowledged", async ({ page }) => {
    const res = await post(page, base);
    expect(res.status()).toBe(200);
    expect(res.headers()["x-zbest-lead-stub"]).toBeUndefined();
    expect(await res.json()).toEqual({ ok: true, submission_id: ID });
  });

  test("blank-but-whitespace optional fields are treated as empty", async ({ page }) => {
    const res = await post(page, { ...base, website: "   ", budget: " ", timing: "  ", details: "  " });
    expect(res.status()).toBe(200);
  });

  test("unknown services, bad choices and a bad website are field errors", async ({ page }) => {
    const res = await post(page, {
      ...base,
      services: "radio-audio,crypto-pumps",
      website: "not a site",
      budget: "a-million",
      timing: "yesterday",
    });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.error.fields).sort()).toEqual(["budget", "services", "timing", "website"]);
    // The field's own message, not zod's generic "Invalid input".
    expect(body.error.fields.budget).toBe("Choose a budget range from the list.");
    expect(body.error.fields.timing).toBe("Choose a timing from the list.");
  });

  test("required fields are required; an empty service list is refused", async ({ page }) => {
    const res = await post(page, { ...base, services: ",,", name: " ", business: "", reach: "" });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.error.fields).sort()).toEqual(["business", "name", "reach", "services"]);
  });

  // The route echoes nothing, so this proves only that a bad tag is never a
  // visitor-facing error; that the stored tag is cleaned is proven in phase-7.
  test("a tampered source tag is not surfaced as an error", async ({ page }) => {
    const res = await post(page, { ...base, source: "<script>alert(1)</script>" });
    expect(res.status()).toBe(200);
  });
});

test("sitemap lists the new pages and still never names Search Intelligence", async ({ page }) => {
  const xml = await (await page.request.get(`${ZBM_BASE_URL}/sitemap.xml`)).text();
  for (const p of ["/services", "/start", ...SERVICE_PAGES.map((s) => `/${s.slug}`)]) {
    expect(xml, p).toContain(`<loc>${ORIGIN}${p}</loc>`);
  }
  expect(xml).not.toMatch(/search-intelligence/i);
});

test("the Services menu reaches every service at this viewport", async ({ page }, testInfo) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
  const header = page.getByRole("banner");
  // Scoped to the Services list itself, so a top-level link with the same
  // href (Revenue Recovery, Z Best Clips) cannot satisfy the check.
  let menu;
  if (testInfo.project.name.startsWith("mobile")) {
    await header.getByRole("button", { name: "Menu" }).click();
    menu = header.locator('[id$="-mobile"] li', { has: page.getByText("Services", { exact: true }) }).locator("ul");
  } else {
    const trigger = header.getByRole("button", { name: "Services" });
    await trigger.click();
    menu = page.locator(`[id="${await trigger.getAttribute("aria-controls")}"]`);
  }
  const entries = [["All Services", "/services"] as [string, string], ...CATALOG];
  await expect(menu.locator("a")).toHaveCount(entries.length);
  for (const [i, [name, href]] of entries.entries()) {
    const link = menu.locator("a").nth(i);
    await expect(link, name).toBeVisible();
    await expect(link).toHaveText(name);
    await expect(link).toHaveAttribute("href", href);
  }
  await expect(header.locator("[data-nav-cta]:visible")).toHaveAttribute("href", "/start");
  await capture(page, "nav-services-open", testInfo.project.name);
});

/**
 * Amendment Oct 4 2026 supersedes the Sep 17 CTA-primacy ruling: Start a
 * Project is the first hero action on Home and the service pages, and the
 * first action on About.
 * Revenue Recovery keeps Get an Assessment first; Home keeps it in the
 * featured section and the closing row.
 */
test("Start a Project leads the hero; Revenue Recovery still leads with the assessment", async ({ page }) => {
  await presetConsent(page);
  const firstHeroCta = async (p: string) => {
    await page.goto(`${ZBM_BASE_URL}${p}`, { waitUntil: "domcontentloaded" });
    return page.locator("main header a").first();
  };
  for (const [p, href] of <[string, string][]>[
    ["/", "/start"],
    ["/digital-advertising", "/start?service=digital-advertising"],
    ["/out-of-home", "/start?service=out-of-home"],
    ["/tv-streaming", "/start?service=tv-streaming"],
  ]) {
    const cta = await firstHeroCta(p);
    await expect(cta, p).toHaveText(/Start a Project/i);
    await expect(cta, p).toHaveAttribute("href", href);
  }
  await expect(await firstHeroCta("/revenue-recovery")).toHaveText(/Get an Assessment/i);
  // About has no hero CTA (§A4); its one CTA row now leads with Start a Project.
  await page.goto(`${ZBM_BASE_URL}/about`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main a").first()).toHaveText(/Start a Project/i);
  await expect(page.locator("main a").first()).toHaveAttribute("href", "/start");
  await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("#revenue-recovery").getByRole("link", { name: "Get your free assessment" })).toBeVisible();
});
