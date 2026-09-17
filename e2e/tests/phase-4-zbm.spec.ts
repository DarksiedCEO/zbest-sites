import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 4 gate — Z Best Media chunk (Brief §3.4, §A4). Pages in brief order:
 * Home → Digital Advertising → Revenue Recovery → Out-of-Home → About →
 * Contact → FAQ → Search Intelligence (unlinked).
 *
 * Founder direction for this chunk, asserted below rather than trusted:
 *   - both "60-second" assessment lines are HELD (Home CTA, RR FAQ answer)
 *   - forms post to a marked stub with no delivery
 *   - assessment CTAs are labeled fixtures
 *   - Revenue Recovery: filtered carry-over of the live page, NO dollar pricing
 *   - the Get an Assessment form lives at /revenue-recovery#assessment
 *   - OOH figures cited inline to a primary source, or dropped
 *
 * Expected copy is transcribed from the brief here, not imported from the app.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-4-zbm");
const ORIGIN = "https://www.zbestmedia.com";
const CONSENT_KEY = "zbest-cookie-consent";

const PAGES = [
  { slug: "home", path: "/", h1: "Advertising you can audit.", title: "Z Best Media" },
  {
    slug: "digital-advertising",
    path: "/digital-advertising",
    h1: "The traffic engine, built to feed a funnel that actually converts.",
    title: "Digital Advertising — Z Best Media",
  },
  {
    slug: "revenue-recovery",
    path: "/revenue-recovery",
    h1: "Find out where your revenue is going.",
    title: "Revenue Recovery — Z Best Media",
  },
  {
    slug: "out-of-home",
    path: "/out-of-home",
    h1: "Presence you can’t scroll past.",
    title: "Out-of-Home — Z Best Media",
  },
  {
    slug: "about",
    path: "/about",
    h1: "An advertising agency built on evidence, not promises.",
    title: "About — Z Best Media",
  },
  {
    slug: "contact",
    path: "/contact",
    h1: "Tell us what’s actually going on. We’ll tell you honestly whether we’re the right fit.",
    title: "Contact — Z Best Media",
  },
  { slug: "faq", path: "/faq", h1: "Frequently asked questions", title: "FAQ — Z Best Media" },
  {
    slug: "search-intelligence",
    path: "/search-intelligence",
    h1: "Ranked isn’t the same as cited.",
    title: "Search Intelligence — Z Best Media",
    hidden: true,
  },
] as const;

type PageDef = (typeof PAGES)[number];

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

/** Every page, both viewports: the checks that hold site-wide. */
for (const p of PAGES) {
  test.describe(`${p.path}`, () => {
    test("renders, carries its metadata, holds the site rules, and is captured", async ({
      page,
    }, testInfo) => {
      await presetConsent(page);
      const response = await page.goto(`${ZBM_BASE_URL}${p.path}`, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(p.title);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      // Canonical and a per-page OG image (§7: generated per page from its title).
      const url = `${ORIGIN}${p.path === "/" ? "" : p.path}`;
      expect(await head(page, 'link[rel="canonical"]', "href")).toBe(url);
      const og = await head(page, 'meta[property="og:image"]');
      expect(og).toBe(p.path === "/" ? `${ORIGIN}/opengraph-image` : `${ORIGIN}${p.path}/opengraph-image`);
      const ogRes = await page.request.get(`${ZBM_BASE_URL}${new URL(og!).pathname}`);
      expect(ogRes.status()).toBe(200);
      expect(ogRes.headers()["content-type"]).toBe("image/png");

      const robots = (await head(page, 'meta[name="robots"]')) ?? "";
      if ("hidden" in p) expect(robots).toMatch(/noindex/);
      else expect(robots).not.toMatch(/noindex/);

      // FOUNDER HOLD: no page promises a 60-second or "one quantified leak"
      // assessment until the Phase 5 decision is made.
      const text = await mainText(page);
      expect(text).not.toMatch(/60[- ]?sec/i);
      expect(text).not.toMatch(/one quantified leak/i);

      // No horizontal scroll at this viewport.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, "page scrolls horizontally").toBeLessThanOrEqual(0);

      // Filled controls size to their label (the Phase 2 inline-block defect).
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

      // §A4: no page links to Search Intelligence — the page itself included,
      // which has no reason to link to its own URL.
      const hrefs = await page.evaluate(() =>
        [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!))],
      );
      expect(hrefs.filter((h) => /search-intelligence/i.test(h))).toEqual([]);

      await page.evaluate(() => document.fonts.ready);
      await mkdir(SNAPSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(SNAPSHOT_DIR, `zbm-${p.slug}-${testInfo.project.name}.png`),
        fullPage: true,
      });
    });
  });
}

/**
 * Every same-site link resolves in this build. Nav and footer pages are all
 * built by the end of this chunk, so a 404 here is a broken link. Kept out of
 * the capture test so each page could be screenshotted as it landed, before the
 * pages it links to existed.
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
      const res = await page.request.get(`${ZBM_BASE_URL}${target || p.path}`);
      expect(res.status(), `link ${href} on ${p.path}`).toBe(200);
      // An anchor must land on an element that exists on the target page.
      if (hash) {
        const html = await res.text();
        expect(html, `anchor #${hash} exists for ${href}`).toContain(`id="${hash}"`);
      }
    }
  });
}

const visit = async (page: Page, p: PageDef) => {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}${p.path}`, { waitUntil: "domcontentloaded" });
};
const byPath = (path: string) => PAGES.find((p) => p.path === path)!;

test.describe("Home (§A4)", () => {
  test("hero stat block shows non-outcome facts only, no counter claim", async ({ page }) => {
    await visit(page, byPath("/"));
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll("main header dl > div > div")].map((row) => [
        row.querySelector("dt")?.textContent?.trim(),
        row.querySelector("dd")?.textContent?.trim(),
      ]),
    );
    expect(rows).toEqual([
      ["Disciplines", "4"],
      ["Platforms we plan across", "Google · Meta · TikTok · Lamar · Clear Channel · OUTFRONT"],
      ["Standard", "Audit first. Evidence. Then scale."],
    ]);
    // Founder ruling Sep 17: no founding-year claim anywhere on the page.
    expect(await mainText(page)).not.toMatch(/2011|Est\./);
    // The Counter is not wired to a claim until a verified figure exists (§6.3).
    expect(await page.locator("main [aria-label] > [aria-hidden='true']").count()).toBe(0);
  });

  test("How we work carries one process, capitalized, promising only priority and confidence", async ({ page }) => {
    await visit(page, byPath("/"));
    const bodies = await page
      .locator("#how-we-work li p.type-body")
      .evaluateAll((els) => els.map((el) => el.textContent?.trim() ?? ""));
    expect(bodies).toEqual([
      "A free look at where you’re likely losing revenue.",
      "A paid, full diagnostic. Every finding comes with a priority and a confidence label.",
      "Conversion repaired before a dollar more goes into spend.",
      "Once it’s proven, we run the media: digital, out-of-home, clips.",
    ]);
  });

  test("four disciplines link to their pages; See What We Do anchors to them", async ({ page }) => {
    await visit(page, byPath("/"));
    const section = page.locator("#what-we-do");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("One team. Four ways to be seen.");
    for (const [name, href] of <[string, string][]>[
      ["Digital Advertising", "/digital-advertising"],
      ["Revenue Recovery", "/revenue-recovery"],
      ["Out-of-Home", "/out-of-home"],
      ["Z Best Clips", "https://zbestclips.com"],
    ]) {
      await expect(section.getByRole("link", { name: new RegExp(`^${name}`) })).toHaveAttribute("href", href);
    }
    await expect(page.getByRole("link", { name: "See What We Do" })).toHaveAttribute("href", "#what-we-do");
  });

  test("featured Revenue Recovery carries the six leaks, a held CTA and its fixture label", async ({ page }) => {
    await visit(page, byPath("/"));
    const section = page.locator("#revenue-recovery");
    for (const leak of [
      "Missed and unreturned calls",
      "Forms that break on mobile",
      "Follow-up that dies after one touch",
      "Pages that load too slowly to convert",
      "Ad traffic landing on the wrong page",
      "No retargeting on the people who almost bought",
    ]) {
      await expect(section.getByRole("heading", { name: leak })).toBeVisible();
    }
    const cta = section.getByRole("link", { name: "Get a free assessment" });
    await expect(cta).toHaveAttribute("href", "/revenue-recovery#assessment");
    await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
  });

  test("How we work carries no case study cards", async ({ page }) => {
    await visit(page, byPath("/"));
    const section = page.locator("#how-we-work");
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(["Assess", "Audit", "Fix", "Scale"]);
    expect(await section.innerText()).not.toMatch(/case stud|representative|%/i);
  });

  test("the scroll-scrubbed hero moves with scroll, and not at all with reduced motion", async ({ page }) => {
    await presetConsent(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const scrubbed = page.locator("main header h1").locator("..");
    await expect.poll(() => scrubbed.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect
      .poll(() => scrubbed.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe("none");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${ZBM_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);
    expect(await page.locator("main header h1").locator("..").evaluate((el) => getComputedStyle(el).transform)).toBe("none");
  });
});

test.describe("Digital Advertising (§A4)", () => {
  test("certifications block is not rendered — not merely hidden", async ({ page }) => {
    await presetConsent(page);
    const res = await page.goto(`${ZBM_BASE_URL}/digital-advertising`, { waitUntil: "domcontentloaded" });
    const html = (await res?.text()) ?? "";
    expect(html).not.toMatch(/Certified, not just claimed|Google Partner|Meta Business Partner|TikTok Marketing Partner/);
  });

  test("pricing, audience and FAQ as written", async ({ page }) => {
    await visit(page, byPath("/digital-advertising"));
    const text = await mainText(page);
    expect(text).toContain("$1,500–$2,500/month");
    expect(text).toContain("flat management fee, not a percentage of spend");
    expect(text).toContain("first campaign ever, or existing spend underperforming");
    await expect(page.locator("#faq button[aria-expanded]")).toHaveCount(4);
    await expect(page.locator("#faq")).not.toContainText("How many accounts does my strategist manage?");
  });
});

test.describe("Revenue Recovery (§A4, filtered live carry-over)", () => {
  test("carries the leak library, patterns, deliverable and engagements — not the Method or the agency comparison", async ({ page }) => {
    await visit(page, byPath("/revenue-recovery"));
    const text = await mainText(page);
    for (const phrase of [
      "Revenue Recovery is the process of identifying and fixing",
      "Eight ways revenue leaks, and what fixing each one looks like.",
      "Traffic Leak", "Conversion Leak", "Trust Leak", "Offer Leak",
      "Follow-Up Leak", "Tracking Leak", "Creative Leak", "Visibility Leak",
      "Typical leak patterns we often find during diagnostic reviews.",
      "See what you receive before you ever submit.",
      "One path. Start free, pay only for the deep dive.",
      "every fix tied to the leak it closes",
      // Brief leak taxonomy, added because the live page lacks it.
      "Follow-up that dies after one touch",
    ]) {
      expect(text, phrase).toContain(phrase);
    }

    // Founder rulings Sep 17: one process, no positioning against agencies, and
    // no promise the Audit deliverable does not make. Asserted as absent so the
    // removals cannot quietly come back.
    for (const gone of [
      "The Z Best Revenue Recovery Method™",
      "A Disciplined, Measurable System",
      "Traditional Agency",
      "Revenue Recovery Partner",
      "Tactics without a recovery system.",
      "traditional advertising agency",
      "Are your case studies real?",
      "Priced against recovered revenue",
      "dollars it recovers",
      "tied to recovered revenue",
    ]) {
      expect(text, gone).not.toContain(gone);
    }
    // "Why us" was the comparison's only home; the section goes with it.
    await expect(page.getByRole("heading", { name: "Why us" })).toHaveCount(0);
  });

  test("filtered out: dollar pricing, illustrative outcomes, scenarios, founder name, unverified claims", async ({
    page,
  }) => {
    await visit(page, byPath("/revenue-recovery"));
    const text = await mainText(page);
    // Founder decision: no dollar figures on this page.
    expect(text).not.toMatch(/\$\s?\d/);
    // No outcome percentages (the illustrative diagnostic and scenario cards).
    expect(text).not.toMatch(/[+-]?\d+%/);
    expect(text).not.toMatch(/Representative Scenarios|Zack|Stripe|Proven System|Enterprise Readiness|proven 4-step/i);
    // Revenue Intelligence Center stays unlinked until the first post (§A3).
    expect(text).not.toMatch(/Revenue Intelligence/i);
  });

  test("every engagement phase has a body; Phase 1 says exactly the approved line (audit F8)", async ({ page }) => {
    await visit(page, byPath("/revenue-recovery"));
    const cards = page.locator("main li", { has: page.locator("h3", { hasText: /^Revenue Recovery (Assessment|Audit|Implementation|Program)/ }) });
    await expect(cards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(cards.nth(i).locator("p.type-body")).toHaveCount(1);
    }
    await expect(cards.nth(0).locator("p.type-body")).toHaveText("Free. No payment, no obligation.");
  });

  test("FAQ omits the held 60-second answer and the case-study question withdrawn Sep 17", async ({ page }) => {
    await visit(page, byPath("/revenue-recovery"));
    const questions = page.locator("#faq button[aria-expanded]");
    await expect(questions).toHaveCount(6);
    await expect(page.locator("#faq")).not.toContainText("How does the process start?");
    await expect(page.locator("#faq")).toContainText("Why audit before running ads?");
  });

  test("assessment form: fixture-labeled, stub-marked, validates, and never claims delivery", async ({ page }) => {
    await visit(page, byPath("/revenue-recovery"));
    const section = page.locator("#assessment");
    await expect(section.locator("[data-fixture-note]")).toContainText("Fixture");
    const form = section.locator('form[data-lead-form="assessment"]');
    await expect(form).toContainText("Stub");
    for (const label of ["Name", "Business", "Website", "Best way to reach you"]) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }

    // Empty submit: field-level errors from the server envelope.
    await form.getByRole("button", { name: "Get an Assessment" }).click();
    await expect(form.getByText("Enter your name.")).toBeVisible();
    await expect(form.getByLabel("Website", { exact: true })).toHaveAttribute("aria-invalid", "true");

    await form.getByLabel("Name", { exact: true }).fill("Test Person");
    await form.getByLabel("Business", { exact: true }).fill("Test Co");
    await form.getByLabel("Website", { exact: true }).fill("not a website");
    await form.getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    await form.getByRole("button", { name: "Get an Assessment" }).click();
    await expect(form.getByText("Enter a website address, like example.com.")).toBeVisible();

    await form.getByLabel("Website", { exact: true }).fill("example.com");
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Get an Assessment" }).click(),
    ]);
    expect(response.headers()["x-zbest-lead-stub"]).toBe("no-delivery");
    const result = section.locator('[data-lead-result="accepted"]');
    await expect(result).toContainText("Stub — not delivered");
    await expect(result).toContainText("nothing was stored or sent");
  });
});

test.describe("Lead route stub (§6.2)", () => {
  const post = (page: Page, data: unknown) =>
    page.request.post(`${ZBM_BASE_URL}/api/lead`, { data, failOnStatusCode: false });
  const id = "5f0c2b8e-4f7a-4c1e-9d7b-0f5d3a2b1c9e";

  test("valid contact submission is acknowledged as a stub", async ({ page }) => {
    const res = await post(page, {
      form: "contact",
      submission_id: id,
      fields: { name: "A", business: "B", problem: "C", reach: "D" },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["x-zbest-lead-stub"]).toBe("no-delivery");
    expect(await res.json()).toEqual({ ok: true, stub: true, submission_id: id });
  });

  test("invalid fields return the field-level error envelope", async ({ page }) => {
    const res = await post(page, { form: "assessment", submission_id: id, fields: { name: "A" } });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("validation");
    expect(Object.keys(body.error.fields).sort()).toEqual(["business", "reach", "website"]);
  });

  test("malformed envelope, unknown form and missing submission_id are rejected", async ({ page }) => {
    expect((await post(page, { form: "contact", fields: {} })).status()).toBe(400);
    expect((await post(page, { form: "newsletter", submission_id: id, fields: {} })).status()).toBe(400);
    const raw = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      headers: { "Content-Type": "application/json" },
      data: "{not json",
      failOnStatusCode: false,
    });
    expect(raw.status()).toBe(400);
  });

  test("a filled honeypot looks like success and is not validated", async ({ page }) => {
    const res = await post(page, {
      form: "contact",
      submission_id: id,
      fields: {},
      company_url: "http://spam.example",
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});

test.describe("Out-of-Home (§A4)", () => {
  test("each kept figure is cited inline to its primary source; the untraceable one is dropped", async ({ page }) => {
    await visit(page, byPath("/out-of-home"));
    const section = page.locator("#why-it-works");
    const cites = section.locator("[data-source-cite]");
    await expect(cites).toHaveCount(2);
    await expect(cites.nth(0)).toHaveAttribute(
      "href",
      "https://oaaa.org/news/out-of-home-advertising-revenue-reaches-record-9-46-billion/",
    );
    await expect(cites.nth(1)).toHaveAttribute("href", /clearchanneloutdoor\.com\/company-news\/new-kantar-study/);
    // Each citation sits in the same paragraph as the figure it supports.
    await expect(section.locator("p", { hasText: "$9.46 billion" }).locator("[data-source-cite]")).toHaveCount(1);
    await expect(section.locator("p", { hasText: "Kantar" }).locator("[data-source-cite]")).toHaveCount(1);
    expect(await mainText(page)).not.toMatch(/61%|Harris/);
  });
});

test.describe("About and Contact (§A4)", () => {
  test("About carries the brief's standard and routes to Talk to Us, not the assessment", async ({ page }) => {
    await visit(page, byPath("/about"));
    const text = await mainText(page);
    expect(text).toContain("No fake urgency, no manufactured scarcity, no unverified proof");
    expect(text).toContain("One team, one standard, applied everywhere we work.");
    await expect(page.locator("main").getByRole("link", { name: "Talk to Us" }).first()).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  test("Contact form has the §6.1 fields and posts to the stub", async ({ page }) => {
    await visit(page, byPath("/contact"));
    const form = page.locator('form[data-lead-form="contact"]');
    for (const label of ["Name", "Business", "What are you looking to solve?", "Best way to reach you"]) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }
    await form.getByLabel("Name", { exact: true }).fill("Test Person");
    await form.getByLabel("Business", { exact: true }).fill("Test Co");
    await form.getByLabel("What are you looking to solve?", { exact: true }).fill("Calls go unanswered.");
    await form.getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Send" }).click(),
    ]);
    expect(response.status()).toBe(200);
    const sent = response.request().postDataJSON();
    expect(sent.form).toBe("contact");
    expect(sent.submission_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(sent).not.toHaveProperty("company_url");
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Stub — not delivered");
  });
});

test.describe("Copy revision (founder rulings, Sep 17 — audit at 1fc360f)", () => {
  test("the assessment is primary on Home and Revenue Recovery only", async ({ page }) => {
    for (const path of ["/", "/revenue-recovery"]) {
      await visit(page, byPath(path));
      expect(
        await page.locator("main").getByRole("link", { name: /assessment/i }).count(),
        `${path} keeps its assessment CTA`,
      ).toBeGreaterThan(0);
    }
    for (const path of ["/digital-advertising", "/out-of-home", "/about", "/contact"]) {
      await visit(page, byPath(path));
      await expect(
        page.locator("main").getByRole("link", { name: /assessment/i }),
        `${path} has no assessment CTA`,
      ).toHaveCount(0);
    }
    // Contact is the destination, so it carries no Talk to Us button of its own.
    for (const path of ["/digital-advertising", "/out-of-home", "/about"]) {
      await visit(page, byPath(path));
      await expect(
        page.locator("main").getByRole("link", { name: "Talk to Us" }).first(),
        `${path} leads with Talk to Us`,
      ).toHaveAttribute("href", "/contact");
    }
  });

  test("Digital Advertising states the pairing without the agency framing", async ({ page }) => {
    await visit(page, byPath("/digital-advertising"));
    const text = await mainText(page);
    for (const phrase of [
      "Digital Advertising brings the traffic.",
      "Revenue Recovery makes sure it doesn’t leak.",
      "Run together, spend compounds instead of draining.",
    ]) {
      expect(text, phrase).toContain(phrase);
    }
    expect(text).not.toContain("other half of the same one");
  });

  test("Out-of-Home plans across operators and claims no buying", async ({ page }) => {
    await visit(page, byPath("/out-of-home"));
    const text = await mainText(page);
    expect(text).toContain("We plan across");
    expect(text).toContain("Cross-operator sourcing — the right board, not the operator we happen to know");
    expect(text).not.toMatch(/plan and buy|bought across/);
    expect(await head(page, 'meta[name="description"]')).not.toMatch(/bought across/);
  });

  test("Search Intelligence drops the competitor-admission clause", async ({ page }) => {
    await visit(page, byPath("/search-intelligence"));
    const text = await mainText(page);
    expect(text).toContain("Revenue attribution with an honest confidence band");
    expect(text).not.toContain("most tools in this category admit");
  });
});

test.describe("FAQ (§A4)", () => {
  test("aggregates the three discipline blocks, grouped, with no Search Intelligence questions", async ({ page }) => {
    await visit(page, byPath("/faq"));
    await expect(page.locator("main h2")).toHaveText(["Digital Advertising", "Revenue Recovery", "Out-of-Home"]);
    await expect(page.locator("#digital-advertising button[aria-expanded]")).toHaveCount(4);
    await expect(page.locator("#revenue-recovery button[aria-expanded]")).toHaveCount(6);
    // Withdrawn Sep 17 (founder rulings): no agency comparison, no case-study
    // question until a real case study exists, no strategist-load claim.
    for (const gone of [
      "How is this different from a traditional advertising agency?",
      "Are your case studies real?",
      "How many accounts does my strategist manage?",
    ]) {
      await expect(page.locator("main")).not.toContainText(gone);
    }
    await expect(page.locator("#out-of-home button[aria-expanded]")).toHaveCount(7);
    const html = await page.content();
    expect(html).not.toMatch(/AEO|GEO|LLMO|AI Visibility|confidence band|Search Intelligence/);
  });
});

test.describe("Search Intelligence (§A4 — built, never linked)", () => {
  test("exists, is noindex, carries its pricing and FAQ", async ({ page }) => {
    await visit(page, byPath("/search-intelligence"));
    expect(await head(page, 'meta[name="robots"]')).toMatch(/noindex/);
    const text = await mainText(page);
    for (const price of ["$2,000/mo", "$4,500/mo", "$7,500/mo"]) expect(text).toContain(price);
    await expect(page.locator("#faq button[aria-expanded]")).toHaveCount(10);
  });

  test("no built page links to it, and neither sitemap nor robots names it", async ({ page }) => {
    for (const p of PAGES) {
      const res = await page.request.get(`${ZBM_BASE_URL}${p.path}`);
      const html = await res.text();
      // Any anchor pointing at it, absolute or relative, on any page — itself
      // included. (Its own <link rel="canonical"> is head metadata, not a link.)
      expect(html, `${p.path} links to Search Intelligence`).not.toMatch(/<a\b[^>]*href="[^"]*search-intelligence/i);
      if (!("hidden" in p)) expect(html, `${p.path} mentions it`).not.toMatch(/search-intelligence/i);
    }
    for (const file of ["/sitemap.xml", "/robots.txt", "/404-probe"]) {
      const body = await (await page.request.get(`${ZBM_BASE_URL}${file}`)).text();
      expect(body, file).not.toMatch(/search-intelligence/i);
    }
  });
});
