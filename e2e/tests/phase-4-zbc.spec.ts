import { formReady } from "../support/ready";
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { captureFullPage } from "../capture";
import { ZBC_BASE_URL } from "../playwright.config";

/**
 * Phase 4 gate — Z Best Clips chunk (Brief §3.4, §B4). Pages in brief order:
 * How It Works (served at "/") → Entertainment → Brands → Pricing → Become a
 * Clipper → Launch a Campaign → About → Media Kit → FAQ.
 *
 * Rules asserted on every page rather than trusted:
 *   - no real company names (§9) — a blocklist, platforms named by the brief excepted
 *   - client-facing pricing stays bundled; clipper payout figures appear only
 *     on Become a Clipper (§9)
 *   - every illustrative figure carries the badge (§9)
 *   - forms post to the §6.2 lead route (fake transport in the gate; see phase-7-lead-route)
 *
 * Expected copy is transcribed from the brief here, not imported from the app.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-4-zbc");
const ORIGIN = "https://zbestclips.com";
const CONSENT_KEY = "zbest-cookie-consent";
const ENT = "rgb(255, 107, 91)";
const BRAND = "rgb(76, 140, 255)";

export const PAGES = [
  { slug: "how-it-works", path: "/", h1: "One source. Dozens of clips. Real reach.", title: "Z Best Clips" },
  {
    slug: "entertainment",
    path: "/entertainment",
    h1: "Get discovered by people who’ve never heard of you.",
    title: "Entertainment — Z Best Clips",
    focus: "entertainment",
  },
  {
    slug: "brands",
    path: "/brands",
    h1: "Build an audience that keeps showing up.",
    title: "Brands — Z Best Clips",
    focus: "brands",
  },
  { slug: "pricing", path: "/pricing", h1: "How a campaign is priced.", title: "Pricing — Z Best Clips" },
  {
    slug: "become-a-clipper",
    path: "/become-a-clipper",
    h1: "Turn footage into income. No experience required, no follower minimum.",
    title: "Become a Clipper — Z Best Clips",
    clipperFacing: true,
  },
  {
    slug: "launch-a-campaign",
    path: "/launch-a-campaign",
    h1: "Tell us what you have. We’ll tell you what it can become.",
    title: "Launch a Campaign — Z Best Clips",
  },
  {
    slug: "about",
    path: "/about",
    h1: "We come from advertising. Now we’re building the next version of it.",
    title: "About — Z Best Clips",
  },
  { slug: "media-kit", path: "/media-kit", h1: "Z Best Clips — press kit.", title: "Media Kit — Z Best Clips" },
  { slug: "faq", path: "/faq", h1: "Frequently asked questions", title: "FAQ — Z Best Clips" },
] as const;

type PageDef = (typeof PAGES)[number];

/**
 * §9: "No real company names (Netflix, NFL, specific studios, etc.) anywhere on
 * Z Best Clips." TikTok, Instagram and YouTube are the platforms §B4 itself
 * names and are allowed. Whole-word, case-sensitive, so ordinary words do not
 * trip it.
 */
const COMPANY_BLOCKLIST = [
  "Netflix", "Hulu", "HBO", "Max", "Disney", "Pixar", "Marvel", "Warner", "Paramount", "Universal",
  "Sony", "Lionsgate", "A24", "Amazon", "Prime Video", "Apple", "Peacock", "Spotify", "SoundCloud",
  "Twitch", "Kick", "Rumble", "Whop", "Patreon", "NFL", "NBA", "WNBA", "MLB", "NHL", "MLS", "NCAA",
  "UFC", "WWE", "ESPN", "FIFA", "Nike", "Adidas", "Toyota", "Honda", "Ford", "Chevrolet", "BMW",
  "Mercedes", "Tesla", "Lexus", "Porsche", "Ferrari", "Lamborghini", "Botox", "Allergan", "Lamar",
  "Clear Channel", "OUTFRONT", "Google", "Meta", "Facebook", "Snapchat", "X Corp", "Twitter",
  "Silverback", "Pussycat",
];
const BLOCKLIST_RE = new RegExp(`\\b(${COMPANY_BLOCKLIST.map((n) => n.replace(/ /g, "\\s")).join("|")})\\b`);

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

const mainText = (page: Page) => page.locator("main").innerText();

const visit = async (page: Page, p: PageDef) => {
  await presetConsent(page);
  await page.goto(`${ZBC_BASE_URL}${p.path}`, { waitUntil: "domcontentloaded" });
};
const byPath = (p: string) => PAGES.find((x) => x.path === p)!;

for (const p of PAGES) {
  test.describe(`${p.path}`, () => {
    test("renders, carries its metadata, holds the site rules, and is captured", async ({
      page,
    }, testInfo) => {
      await presetConsent(page);
      const response = await page.goto(`${ZBC_BASE_URL}${p.path}`, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(p.title);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      const url = `${ORIGIN}${p.path === "/" ? "" : p.path}`;
      expect(await head(page, 'link[rel="canonical"]', "href")).toBe(url);
      const og = await head(page, 'meta[property="og:image"]');
      expect(og).toBe(p.path === "/" ? `${ORIGIN}/opengraph-image` : `${ORIGIN}${p.path}/opengraph-image`);
      const ogRes = await page.request.get(`${ZBC_BASE_URL}${new URL(og!).pathname}`);
      expect(ogRes.status()).toBe(200);
      expect(ogRes.headers()["content-type"]).toBe("image/png");
      expect((await head(page, 'meta[name="robots"]')) ?? "").not.toMatch(/noindex/);

      // §9: no real company names — whole page, nav and footer included.
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.match(BLOCKLIST_RE)?.[0] ?? null, "real company name on the page").toBeNull();

      // §9: client pricing bundled; clipper payout figures only on Become a Clipper.
      if (!("clipperFacing" in p)) {
        expect(await mainText(page), "dollar figure on a client-facing page").not.toMatch(/\$\s?\d/);
      }

      // §B1: focus pages recolor the document; everything else keeps the default.
      const cta = page.locator("header [data-nav-cta]").first();
      const focus = "focus" in p ? p.focus : null;
      expect(await page.locator("main").getAttribute("data-page-focus")).toBe(focus);
      expect(await cta.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
        focus === "brands" ? BRAND : ENT,
      );

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, "page scrolls horizontally").toBeLessThanOrEqual(0);

      const crushed = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll<HTMLElement>(".type-label")) {
          const cs = getComputedStyle(el);
          if (cs.backgroundColor === "rgba(0, 0, 0, 0)" || el.offsetParent === null) continue;
          const lh = parseFloat(cs.lineHeight) || 16;
          const r = el.getBoundingClientRect();
          if (r.height > lh * 2.4 + 32 || el.scrollWidth > Math.ceil(r.width) + 1) {
            bad.push(el.textContent?.trim() ?? "");
          }
        }
        return bad;
      });
      expect(crushed).toEqual([]);

      await page.evaluate(() => document.fonts.ready);
      await captureFullPage(
        page,
        path.join(SNAPSHOT_DIR, `zbc-${p.slug}-${testInfo.project.name}.png`),
        testInfo,
      );
    });
  });
}

/**
 * Every same-site link resolves. Kept out of the capture test so each page is
 * captured as it lands, before the pages it links to exist.
 */
for (const p of PAGES) {
  test(`${p.path} — every same-site link resolves`, async ({ page }) => {
    await visit(page, p);
    const hrefs = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!))],
    );
    const local = hrefs.filter((h) => h.startsWith("/") || h.startsWith("#"));
    expect(local.length).toBeGreaterThan(0);
    for (const href of local) {
      const [target, hash] = href.split("#");
      const res = await page.request.get(`${ZBC_BASE_URL}${target || p.path}`);
      expect(res.status(), `link ${href} on ${p.path}`).toBe(200);
      if (hash) expect(await res.text(), `anchor #${hash} for ${href}`).toContain(`id="${hash}"`);
    }
  });
}

test.describe("How It Works (§B4, served at /)", () => {
  test("/how-it-works redirects permanently to /", async ({ page }) => {
    const res = await page.request.get(`${ZBC_BASE_URL}/how-it-works`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/");
  });

  test("the process runs on the timeline: horizontal at 1440, vertical at 390", async ({ page }, testInfo) => {
    await visit(page, byPath("/"));
    const steps = page.locator("[data-timeline] li");
    await expect(steps.locator("h3")).toHaveText([
      "Set the Campaign",
      "Clippers Create and Post",
      "Every Submission Reviewed",
      "Verified Reporting",
    ]);
    const boxes = await steps.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
    if (testInfo.project.name.startsWith("mobile")) {
      for (let i = 1; i < boxes.length; i++) expect(boxes[i]!.top).toBeGreaterThan(boxes[i - 1]!.bottom - 1);
    } else {
      for (let i = 1; i < boxes.length; i++) {
        expect(Math.abs(boxes[i]!.top - boxes[0]!.top)).toBeLessThan(2);
        expect(boxes[i]!.left).toBeGreaterThan(boxes[i - 1]!.right - 1);
      }
    }
    for (const lever of ["Reward rate", "Minimum payout threshold", "Maximum payout cap", "Optional flat fee bonus"]) {
      await expect(page.locator("#process").getByRole("heading", { name: lever })).toBeVisible();
    }
  });

  test("the two models carry their own focus colors", async ({ page }) => {
    await visit(page, byPath("/"));
    const cards = page.locator("#models [data-focus]");
    await expect(cards).toHaveCount(2);
    expect(await cards.nth(0).evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(ENT);
    expect(await cards.nth(1).evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(BRAND);
  });

  test("three illustrative example cards: badged, accented, and exactly the §B4 figures", async ({ page }) => {
    await visit(page, byPath("/"));
    const cards = page.locator("[data-example-card]");
    await expect(cards).toHaveCount(3);
    const expected = [
      ["Independent single release", "1,240,000", "84", "TikTok · Reels · Shorts", ENT],
      ["Auto dealership showroom series", "340,000", "46", "TikTok · Reels", BRAND],
      ["Med spa treatment-room series", "215,000", "38", "Reels · Shorts", BRAND],
    ] as const;
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      const [title, views, clips, platforms, accent] = expected[i]!;
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(title);
      // Final values are exposed on the Counter's aria-label (captures run reduced-motion).
      await expect(card.locator("[aria-label]").nth(0)).toHaveAttribute("aria-label", views);
      await expect(card.locator("[aria-label]").nth(1)).toHaveAttribute("aria-label", clips);
      await expect(card).toContainText(platforms);
      await expect(card).toContainText("Illustrative example — not a client result");
      expect(await card.locator("> div").evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(accent);
    }
    // No unbadged figure anywhere else in the section.
    await expect(page.locator("#examples [aria-label]")).toHaveCount(6);
  });

  test("view counters tick once on entry, and not at all with reduced motion", async ({ page }) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`${ZBC_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const views = page.locator("[data-example-card]").first().locator("[aria-label] > [aria-hidden]").first();
    await expect(views).toHaveText("0");
    await views.scrollIntoViewIfNeeded();
    await expect(views).toHaveText("1,240,000", { timeout: 5000 });

    // Reduced motion: after hydration and on entry, the number is final and
    // never moves. Every text change is recorded, so a tick of any length (or
    // a rewind to 0) fails, not just one that is still running at the read.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${ZBC_BASE_URL}/`, { waitUntil: "networkidle" });
    await expect(views).toHaveText("1,240,000");
    await views.evaluate((el) => {
      const seen: string[] = [];
      (window as unknown as { __seen: string[] }).__seen = seen;
      new MutationObserver(() => seen.push(el.textContent ?? "")).observe(el, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
    await views.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // longer than the 1.1 s tick
    await expect(views).toHaveText("1,240,000");
    const seen = await page.evaluate(() => (window as unknown as { __seen: string[] }).__seen);
    expect(seen.filter((t) => t !== "1,240,000"), "reduced-motion counter moved").toEqual([]);
  });
});

test.describe("Pricing (§B4)", () => {
  test("five client levers, bundled, and no clipper payout split", async ({ page }) => {
    await visit(page, byPath("/pricing"));
    await expect(page.locator("#levers h3")).toHaveText([
      "Campaign budget",
      "Reward rate",
      "Minimum payout",
      "Maximum payout",
      "Flat fee bonus",
    ]);
    const text = await mainText(page);
    expect(text).not.toMatch(/guaranteed flat fee|per approved post|performance bonus|split/i);
  });
});

test.describe("Become a Clipper (§B4)", () => {
  test("five steps, both payout models in their focus colors, and the disclosed starting rates", async ({ page }) => {
    await visit(page, byPath("/become-a-clipper"));
    await expect(page.locator("#how-it-works h3")).toHaveText([
      "Join a campaign",
      "Get the source material",
      "Cut and post",
      "Submit for review",
      "Get paid on approved posts and verified views",
    ]);
    const cards = page.locator("#payouts [data-focus]");
    expect(await cards.nth(0).evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(ENT);
    expect(await cards.nth(1).evaluate((el) => getComputedStyle(el).borderLeftColor)).toBe(BRAND);
    const rates = page.locator("[data-starting-rates]");
    await expect(rates).toContainText("$50–100 guaranteed flat fee per approved post");
    await expect(rates).toContainText("$3–5 per 1,000 views bonus");
  });

  test("Browse Active Campaigns opens the labeled waitlist form, which posts to the lead route", async ({ page }) => {
    await visit(page, byPath("/become-a-clipper"));
    const cta = page.locator("main header").getByRole("link", { name: "Browse Active Campaigns" });
    await expect(cta).toHaveAttribute("href", "#waitlist");
    await expect(page.locator("main header [data-fixture-note]")).toContainText("No campaigns are open yet");
    const section = page.locator("#waitlist");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      "Join the clipper list — we’ll notify you when the first campaigns open.",
    );
    const form = section.locator('form[data-lead-form="clipper"]');
    await formReady(form);
    await expect(form).not.toContainText("Stub");
    for (const label of ["Name", "Email", "State or territory", "Primary platform"]) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(form.getByLabel(/Profile link/)).toBeVisible();

    await form.getByRole("button", { name: "Join the clipper list" }).click();
    await expect(form.getByText("Enter a valid email address.")).toBeVisible();
    await expect(form.getByText("Choose your primary platform.")).toBeVisible();

    await form.getByLabel("Name", { exact: true }).fill("Test Clipper");
    await form.getByLabel("Email", { exact: true }).fill("clipper@example.com");
    await form.getByLabel("Primary platform", { exact: true }).selectOption("tiktok");
    await form.getByLabel("State or territory", { exact: true }).selectOption("US-NY");
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Join the clipper list" }).click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-zbest-lead-transport"]).toBe("fake");
    expect(response.request().postDataJSON().fields).toEqual({
      name: "Test Clipper",
      email: "clipper@example.com",
      platform: "tiktok",
      profile: "",
      state: "US-NY",
    });
    await expect(section.locator('[data-lead-result="accepted"]')).toContainText("Received");
  });
});

test.describe("Launch a Campaign (§B4)", () => {
  test("keeps the honesty note word for word", async ({ page }) => {
    await visit(page, byPath("/launch-a-campaign"));
    await expect(page.locator("[data-honesty-note]")).toHaveText(
      "Z Best Clips is a new operation using an established model — the same clipping and distribution mechanics already in use across the industry. We’re building our own case studies now, one campaign at a time, and we’d rather be straight with you about that than pretend otherwise.",
    );
  });

  test("four steps, both ways to start, and a form with the §6.1 fields posting to the lead route", async ({ page }) => {
    await visit(page, byPath("/launch-a-campaign"));
    await expect(page.locator("#what-happens h3")).toHaveCount(4);
    await expect(page.locator("#start").getByRole("link", { name: "See How It Works" })).toHaveAttribute("href", "/");
    const form = page.locator('form[data-lead-form="campaign"]');
    await formReady(form);
    await expect(form).not.toContainText("Stub");
    for (const label of ["Name", "Organization", "State or territory", "What are you promoting?", "Entertainment / Brands", "Best way to reach you"]) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(form.getByLabel(/Budget range/)).toBeVisible();
    const focusOptions = await form.getByLabel("Entertainment / Brands", { exact: true }).locator("option").allTextContents();
    expect(focusOptions).toEqual(["Choose one", "Entertainment", "Brands"]);

    await form.getByLabel("Name", { exact: true }).fill("Test Person");
    await form.getByLabel("Organization", { exact: true }).fill("Test Label");
    await form.getByLabel("What are you promoting?", { exact: true }).fill("A single release.");
    await form.getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    await form.getByRole("button", { name: "Launch a Campaign" }).click();
    await expect(form.getByText("Choose Entertainment or Brands.")).toBeVisible();

    await form.getByLabel("Entertainment / Brands", { exact: true }).selectOption("entertainment");
    // Service area: a territory is served too.
    await form.getByLabel("State or territory", { exact: true }).selectOption("PR");
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Launch a Campaign" }).click(),
    ]);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-zbest-lead-transport"]).toBe("fake");
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("we have your details");
  });
});

test.describe("Lead route (§6.2, ZBC)", () => {
  const id = "5f0c2b8e-4f7a-4c1e-9d7b-0f5d3a2b1c9e";
  const post = (page: Page, data: unknown) =>
    page.request.post(`${ZBC_BASE_URL}/api/lead`, { data, failOnStatusCode: false });

  test("rejects ZBM's form names and unknown focus or platform values", async ({ page }) => {
    expect((await post(page, { form: "contact", submission_id: id, fields: {} })).status()).toBe(400);
    const badFocus = await post(page, {
      form: "campaign",
      submission_id: id,
      fields: { name: "A", organization: "B", promoting: "C", focus: "sports", reach: "D", state: "US-CA" },
    });
    expect(badFocus.status()).toBe(422);
    expect(Object.keys((await badFocus.json()).error.fields)).toEqual(["focus"]);
    const badPlatform = await post(page, {
      form: "clipper",
      submission_id: id,
      fields: { name: "A", email: "a@example.com", platform: "vine", state: "US-CA" },
    });
    expect(badPlatform.status()).toBe(422);
    expect(Object.keys((await badPlatform.json()).error.fields)).toEqual(["platform"]);
  });

  test("valid submissions and a filled honeypot are acknowledged", async ({ page }) => {
    const ok = await post(page, {
      form: "clipper",
      submission_id: id,
      fields: { name: "A", email: "a@example.com", platform: "youtube-shorts", profile: "youtube.com/@a", state: "US-CA" },
    });
    expect(ok.status()).toBe(200);
    expect(await ok.json()).toEqual({ ok: true, submission_id: id });
    expect(ok.headers()["x-zbest-lead-stub"]).toBeUndefined();
    const bot = await post(page, { form: "campaign", submission_id: id, fields: {}, company_url: "x" });
    expect(bot.status()).toBe(200);
  });
});

test.describe("About (§B4)", () => {
  test("company voice only: no name, no figures, both CTAs", async ({ page }) => {
    await visit(page, byPath("/about"));
    const text = await mainText(page);
    expect(text).toContain("founded by a software engineer");
    // No founder name, sales figures, athlete background or broker license.
    expect(text).not.toMatch(/\d|Zack|athlete|broker|licen[cs]e/i);
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Launch a Campaign" })).toHaveAttribute("href", "/launch-a-campaign");
    await expect(main.getByRole("link", { name: "Become a Clipper" })).toHaveAttribute("href", "/become-a-clipper");
  });
});

test.describe("Copy revision (ZBC gate CONDITIONAL at c35ee1d — founder rulings, Sep 17)", () => {
  test("no founding-year claim survives on any ZBC page or the shared dev gallery", async ({ page }) => {
    for (const p of PAGES) {
      await visit(page, p);
      expect(await mainText(page), `${p.path} names a founding year`).not.toMatch(/2011/);
    }
    // The retired Est. row also lived in the shared @zbest/ui gallery, which both
    // apps render at /dev/system. Checked here because ZBC owns this revision.
    await page.goto(`${ZBC_BASE_URL}/dev/system`, { waitUntil: "domcontentloaded" });
    expect(await page.locator("body").innerText()).not.toMatch(/2011/);
  });

  test("clip volume says dozens everywhere, never hundreds", async ({ page }) => {
    for (const p of PAGES) {
      await visit(page, p);
      expect(await mainText(page), `${p.path} still claims hundreds`).not.toMatch(/[Hh]undreds of/);
    }
    await visit(page, byPath("/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("One source. Dozens of clips. Real reach.");
    // The site-wide default description feeds root OG/meta and said "Hundreds".
    const desc = await page.evaluate(() => document.querySelector('meta[name="description"]')?.getAttribute("content"));
    expect(desc).not.toMatch(/[Hh]undreds of/);
  });

  test("nothing claims creators are paid only on views — Brands carry a guaranteed per-post fee", async ({ page }) => {
    for (const path of ["/pricing", "/faq"]) {
      await visit(page, byPath(path));
      const text = await mainText(page);
      for (const gone of ["only when their clips get", "only pay for views", "only verified views billed"]) {
        expect(text, `${path} still says "${gone}"`).not.toContain(gone);
      }
    }
    await visit(page, byPath("/pricing"));
    expect(await mainText(page)).toContain("pays creators for approved posts and verified views");
    expect(
      await head(page, 'meta[name="description"]'),
    ).toContain("nothing is billed before you approve the post");
    await visit(page, byPath("/media-kit"));
    expect(await mainText(page)).not.toContain("only verified views billed");
  });

  // O1–O3 (TOOLING.md, open after 28ef158): the same "views only" error in the
  // three places decision 3 missed. textContent, not innerText — RuledList and
  // step titles are CSS-transformed, and the swap is exact.
  const bodyCopy = async (page: Page) => (await page.locator("main").textContent())?.replace(/\s+/g, " ") ?? "";

  test("O1: What's Included bills nothing before approval, not 'only eligible views'", async ({ page }) => {
    await visit(page, byPath("/"));
    const text = await bodyCopy(page);
    expect(text).toContain("Nothing billed before you approve the post");
    expect(text).not.toContain("eligible views billed");
  });

  test("O2: clippers are paid on approved posts and verified views, in the step and the metadata", async ({ page }) => {
    await visit(page, byPath("/become-a-clipper"));
    // Step 5 keeps the verb-first voice of steps 1–4 ("Get paid…"); the meta
    // description is a sentence fragment and keeps TOOLING.md's wording as given.
    await expect(page.locator("#how-it-works h3").nth(4)).toHaveText("Get paid on approved posts and verified views");
    expect(await head(page, 'meta[name="description"]')).toContain("Paid on approved posts and verified views");
    expect(await bodyCopy(page)).not.toContain("paid on verified views");
    expect(await head(page, 'meta[name="description"]')).not.toContain("Paid on verified views");
  });

  test("O3: the long boilerplate has clients pay for approved posts, not approved posts with views", async ({ page }) => {
    await visit(page, byPath("/media-kit"));
    const text = await bodyCopy(page);
    expect(text).toContain("clients pay only for approved posts.");
    expect(text).not.toContain("approved posts with verified views");
  });

  test("ZBC does not position against agencies, and drops the unsupported 'proven'", async ({ page }) => {
    await visit(page, byPath("/about"));
    const about = await mainText(page);
    expect(about).not.toContain("marketing agency guessing at video");
    expect(about).toContain("We’ve done the sales floor");
    await visit(page, byPath("/faq"));
    expect(await mainText(page)).not.toContain("proven industry-wide mechanics");
    // Founder decision 5: the honesty note describes what exists, and claims no
    // outcome nobody here has measured.
    await visit(page, byPath("/launch-a-campaign"));
    const note = await page.locator("[data-honesty-note]").innerText();
    for (const gone of ["proven", "driving results"]) {
      expect(note, `honesty note still says "${gone}"`).not.toContain(gone);
    }
  });
});

test.describe("Media Kit (§B4)", () => {
  test("facts as ledger rows, assets on request, press address a labeled non-link placeholder", async ({ page }) => {
    await visit(page, byPath("/media-kit"));
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll("#facts dt")].map((dt) => dt.textContent?.trim()),
    );
    expect(rows).toEqual(["Parent", "Launched", "Models", "Platforms", "Payout basis"]);
    await expect(page.locator("#assets")).toContainText("Assets available on request.");
    const press = page.locator("#press");
    await expect(press).toContainText("press@zbestclips.com");
    await expect(press.locator("[data-fixture-note]")).toContainText("Placeholder");
    // The mailbox does not exist, so nothing may offer to send mail to it.
    expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
    // Company voice: no founder name (§B4).
    expect(await mainText(page)).not.toMatch(/Zack/);
  });
});

test.describe("FAQ (§B4)", () => {
  test("all ten questions, operable, and no payout rates", async ({ page }) => {
    await visit(page, byPath("/faq"));
    const buttons = page.locator("#faq button[aria-expanded]");
    await expect(buttons).toHaveCount(10);
    const paid = page.locator("#faq button", { hasText: "How do clippers get paid?" });
    await paid.click();
    await expect(paid).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`#${await paid.getAttribute("aria-controls")}`);
    await expect(panel).toHaveText("Entertainment: per 1,000 verified views. Brands: guaranteed flat fee + performance bonus.");
  });
});

test.describe("Site-wide (ZBC chunk)", () => {
  test("clipper payout rates appear on Become a Clipper and nowhere else", async ({ page }) => {
    for (const p of PAGES) {
      const html = await (await page.request.get(`${ZBC_BASE_URL}${p.path}`)).text();
      const hasRates = /\$50–100|\$3–5/.test(html);
      expect(hasRates, `${p.path}`).toBe("clipperFacing" in p);
    }
  });

  test("sitemap lists exactly the nine built public pages; /how-it-works is not a second URL", async ({ page }) => {
    const xml = await (await page.request.get(`${ZBC_BASE_URL}/sitemap.xml`)).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.sort()).toEqual(PAGES.map((p) => `${ORIGIN}${p.path === "/" ? "" : p.path}`).sort());
  });
});
