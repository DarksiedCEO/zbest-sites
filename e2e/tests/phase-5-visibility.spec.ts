import { expect, test, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ZBM_BASE_URL } from "../playwright.config";

/**
 * Phase 5 gate — AI Visibility Readiness Check, build steps 1 and 3 (Backend
 * Spec v0.4 §12, founder decision 11). The founder ran the two steps as one lane
 * so the page never shows the new library beside the retired promise.
 *
 *   step 1: the Visibility Gap Library is published on the Search Intelligence
 *           page, exactly as certified in §12.4
 *   step 3: the four retired strings are gone from every ZBM page (§12.8, C3),
 *           the false FAQ line is rewritten to what is true today, and no button
 *           names a check that does not exist yet
 *
 * Step 2, added 2026-09-20 as its own lane: the VisibilityGapRuleSet fixture,
 * the ReadinessRequest/VisibilityReadinessResult contract, the form and result
 * on the Search Intelligence page, and §12.7's routing.
 *
 * The expected library text is read from the CERTIFIED SPEC, v0.4 §12.4, not
 * from the app, so this checks the published page against the contract.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-5");
const CONSENT_KEY = "zbest-cookie-consent";
const REPO = path.join(import.meta.dirname, "..", "..");

/** §12.8, C3 — the four retired strings as one pattern. It does not match the new name. */
const RETIRED = /whether and how your business currently shows up|free (ai )?visibility check/i;

/** Every ZBM page, including the unlinked Search Intelligence page and the legal shells. */
const ZBM_PATHS = [
  "/",
  "/digital-advertising",
  "/revenue-recovery",
  "/out-of-home",
  "/about",
  "/contact",
  "/faq",
  "/search-intelligence",
  "/legal/privacy-policy",
  "/legal/terms-of-service",
  "/legal/cookie-policy",
];

type Gap = { key: string; name: string; description: string; fix: string };

/** The approved library, parsed from the §12.4 table of the certified spec. */
async function certifiedLibrary(): Promise<Gap[]> {
  const spec = await readFile(path.join(REPO, "docs/backend-interface-spec-v0.4.md"), "utf8");
  const block = spec.match(/^### 12\.4 [\s\S]*?(?=^### 12\.5)/m)?.[0] ?? "";
  return [...block.matchAll(/^\| `([a-z_]+)` \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \|$/gm)].map(
    ([, key, name, description, fix]) => ({ key: key!, name: name!.trim(), description: description!.trim(), fix: fix!.trim() }),
  );
}

async function visit(page: Page, route: string) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
  await page.goto(`${ZBM_BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
}

test.describe("Visibility Gap Library — published as certified (§12.4)", () => {
  test("renders all eight gaps exactly as the certified spec states them, in order", async ({ page }, testInfo) => {
    const library = await certifiedLibrary();
    expect(library.map((g) => g.key), "§12.4 defines the eight gaps").toEqual([
      "business_profile", "entity_consistency", "reviews", "crawlability",
      "structured_data", "answer_content", "brand_citations", "local_listings",
    ]);

    await visit(page, "/search-intelligence#visibility-gaps");
    const section = page.locator("#visibility-gaps");
    await expect(section.locator(".type-label").first()).toHaveText("Visibility Gap Library");
    const rows = section.locator("li");
    await expect(rows).toHaveCount(8);
    for (const [i, gap] of library.entries()) {
      const row = rows.nth(i);
      await expect(row.locator("h3"), `${gap.key} name`).toHaveText(gap.name);
      await expect(row.locator(".type-body"), `${gap.key} description`).toHaveText(gap.description);
      await expect(row.locator("dt"), `${gap.key} label`).toHaveText("Fix direction");
      await expect(row.locator("dd"), `${gap.key} fix`).toHaveText(gap.fix);
    }

    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    // The site nav is sticky, and in an element capture it paints over the top of
    // the section: the first row at 1440, the section label at 390. It is not part
    // of the section, so it is hidden for the screenshot only (Playwright's `style`
    // applies during capture and nowhere else). The certified assessment captures
    // carry this overlap on their section label; this lane does not change them.
    await section.screenshot({
      path: path.join(SNAPSHOT_DIR, `zbm-visibility-gaps-${testInfo.project.name}.png`),
      style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
    });
  });

  test("says 'gap', never 'leak', and uses curly apostrophes only (§12.1)", async ({ page }) => {
    await visit(page, "/search-intelligence");
    const text = (await page.locator("#visibility-gaps").textContent()) ?? "";
    expect(text).not.toMatch(/leak/i);
    expect(text).not.toContain("'");
  });
});

test.describe("Retirement — §12.8, condition C3", () => {
  test("no ZBM page carries a retired string, hidden FAQ panels included", async ({ page }) => {
    for (const route of ZBM_PATHS) {
      await visit(page, route);
      // textContent, not innerText: collapsed FAQ answers stay in the DOM with
      // `hidden`, and innerText would not see them.
      const text = (await page.locator("main").textContent()) ?? "";
      expect(text.match(RETIRED)?.[0] ?? null, `${route} carries a retired string`).toBeNull();
    }
  });

  test("the pattern still recognises every retired string, and not the new name", () => {
    for (const retired of [
      "See whether and how your business currently shows up when someone asks ChatGPT",
      "Free AI Visibility Check",
      "Not yet — a free AI Visibility Check is available now.",
      "Get Your Free Visibility Check",
    ]) {
      expect(retired, retired).toMatch(RETIRED);
    }
    for (const current of ["AI Visibility Readiness Check", "Get your free AI Visibility Readiness Check"]) {
      expect(current, current).not.toMatch(RETIRED);
    }
  });

  test("the free-trial FAQ answer is rewritten to what is true today", async ({ page }) => {
    await visit(page, "/search-intelligence");
    const question = page.locator("#faq button", { hasText: "Do you offer a free trial?" });
    await question.click();
    const panel = page.locator(`#${await question.getAttribute("aria-controls")}`);
    await expect(panel).toHaveText("Not yet. A self-serve trial mechanic is planned once the client dashboard itself is live.");
  });

  test("no LINK offers the check, and Talk to Us still leads the hero", async ({ page }) => {
    await visit(page, "/search-intelligence");
    // Step 2 built the check on this page, so a submit BUTTON now names it. No
    // link does: nothing routes elsewhere to a check, and the hero is unchanged
    // from the certified steps 1+3 state.
    await expect(page.locator("main").getByRole("link", { name: /visibility (readiness )?check/i })).toHaveCount(0);
    const heroLink = page.locator("main header").getByRole("link").first();
    await expect(heroLink).toHaveText("Talk to Us");
    await expect(heroLink).toHaveAttribute("href", "/contact");
  });
});

/* ------------------------------------------------------------------------- *
 * Build step 2 — the rule set, the contract, the form and the result.
 *
 * Everything expected below is read from the CERTIFIED SPEC (v0.4 §12.4-§12.7)
 * or from the published library, never from the app's own modules, so this
 * checks the build against the contract rather than against itself.
 * ------------------------------------------------------------------------- */

/** §12.3 — the rule set's version, and the digest it was built with. */
const VISIBILITY_RULE_SET_VERSION = "fixture-2026-09-20.1";

/**
 * §12.3 `rules_hash`, PINNED per version — the same discipline the §11 rule set
 * carries. A shape check proves only that something hashed; the pin is what
 * makes "immutable after activation" checkable, so editing this rule set in
 * place fails here and a real change must arrive as a new version.
 */
const EXPECTED_VISIBILITY_RULES_HASH: Record<string, string> = {
  // Captured at the build commit on a clean tree, from the §12.4-derived rule set.
  "fixture-2026-09-20.1": "9fee199893864245cd6409d71f8c95e9ce0c25887e994ca87258afdb0345c093",
};

/** §12.2 — likert_3, the same three labels as §11, read from the spec's own text. */
const READINESS_SCALE = ["Not true", "Somewhat true", "Very true"] as const;

/** §12.6 — the founder-approved tie-break order, and §12.5's display order. */
const READINESS_PRIORITY = [
  "business_profile", "entity_consistency", "reviews", "crawlability",
  "structured_data", "answer_content", "brand_citations", "local_listings",
];

/** The eight questions, parsed from the §12.5 table of the certified spec. */
async function certifiedQuestions(): Promise<{ id: string; statement: string }[]> {
  const spec = await readFile(path.join(REPO, "docs/backend-interface-spec-v0.4.md"), "utf8");
  const block = spec.match(/^### 12\.5 [\s\S]*?(?=^### 12\.6)/m)?.[0] ?? "";
  return [...block.matchAll(/^\| `([a-z_]+)` \| ([^|]+?) \|$/gm)].map(([, id, statement]) => ({
    id: id!,
    statement: statement!.trim(),
  }));
}

type ReadinessAnswers = Record<string, 0 | 1 | 2>;
const allGaps = (value: 0 | 1 | 2): ReadinessAnswers =>
  Object.fromEntries(READINESS_PRIORITY.map((id) => [id, value]));
const onlyGap = (id: string, value: 1 | 2): ReadinessAnswers => ({ ...allGaps(0), [id]: value });

function readinessRequest(answers: ReadinessAnswers, overrides: Record<string, unknown> = {}) {
  return {
    form: "readiness",
    submission_id: crypto.randomUUID(),
    rule_set_version: VISIBILITY_RULE_SET_VERSION,
    contact: { name: "Test Person", business: "Test Co", website: "example.com", reach: "test@example.com" },
    answers: Object.entries(answers).map(([question_id, value]) => ({ question_id, value })),
    ...overrides,
  };
}

const postReadiness = (page: Page, data: unknown) =>
  page.request.post(`${ZBM_BASE_URL}/api/lead`, { data, failOnStatusCode: false });

async function check(page: Page, answers: ReadinessAnswers) {
  const response = await postReadiness(page, readinessRequest(answers));
  expect(response.status(), await response.text()).toBe(200);
  const body = await response.json();
  return body.result as Record<string, unknown> & {
    status: string;
    category: string | null;
    rationale: string | null;
    remediation: string | null;
    because: { question_id: string; statement: string; value: number; value_label: string } | null;
    tie_broken_by_priority: boolean;
    check: string;
    rule_set_version: string;
    rule_set_hash: string;
  };
}

test.describe("Readiness check — the rule set derives from the published library (§12.2, C2)", () => {
  test("every category's rationale and remediation equal the certified library, character for character", async ({ page }) => {
    const library = await certifiedLibrary();
    for (const gap of library) {
      const result = await check(page, onlyGap(gap.key, 2));
      expect(result.category, `${gap.key} wins when only it is true`).toBe(gap.key);
      expect(result.rationale, `${gap.key} rationale`).toBe(gap.description);
      expect(result.remediation, `${gap.key} remediation`).toBe(gap.fix);
    }
  });

  test("the eight questions are the certified §12.5 statements, in order, each on the approved scale", async ({ page }) => {
    const questions = await certifiedQuestions();
    expect(questions.map((q) => q.id), "§12.5 defines the eight questions").toEqual(READINESS_PRIORITY);

    await visit(page, "/search-intelligence#readiness-check");
    const fieldsets = page.locator("[data-readiness-question]");
    await expect(fieldsets).toHaveCount(8);
    for (const [i, question] of questions.entries()) {
      const fieldset = fieldsets.nth(i);
      await expect(fieldset, `question ${i + 1} is ${question.id}`).toHaveAttribute(
        "data-readiness-question",
        question.id,
      );
      await expect(fieldset.locator("legend")).toContainText(question.statement);
      for (const label of READINESS_SCALE) {
        await expect(fieldset.getByRole("radio", { name: label, exact: true })).toHaveCount(1);
      }
    }
  });
});

test.describe("Readiness check — the rule (§12.6)", () => {
  test("all answers 'Not true' is insufficient_signal — no gap is invented", async ({ page }) => {
    const result = await check(page, allGaps(0));
    expect(result.status).toBe("insufficient_signal");
    expect(result.category).toBeNull();
    expect(result.rationale).toBeNull();
    expect(result.remediation).toBeNull();
    expect(result.because).toBeNull();
    expect(result.tie_broken_by_priority).toBe(false);
  });

  test("the highest score wins before priority is consulted", async ({ page }) => {
    // local_listings is LAST in priority, and the only one rated "Very true".
    const result = await check(page, { ...allGaps(1), local_listings: 2 });
    expect(result.category).toBe("local_listings");
    expect(result.tie_broken_by_priority).toBe(false);
    expect(result.because).toMatchObject({ question_id: "local_listings", value: 2, value_label: "Very true" });
  });

  test("the approved priority order decides every tie, all the way down", async ({ page }) => {
    // Every suffix of the order, all tied at 2: the earliest must always win.
    for (let i = 0; i < READINESS_PRIORITY.length; i++) {
      const tied = READINESS_PRIORITY.slice(i);
      const answers = { ...allGaps(0), ...Object.fromEntries(tied.map((id) => [id, 2 as const])) };
      const result = await check(page, answers);
      expect(result.category, `tie among ${tied.join(", ")}`).toBe(tied[0]);
      expect(result.tie_broken_by_priority).toBe(tied.length > 1);
    }
  });

  test("deterministic: the same answers return the same result and the same pinned rule-set hash", async ({ page }) => {
    const answers: ReadinessAnswers = { ...allGaps(0), reviews: 2, crawlability: 1 };
    const [a, b] = [await check(page, answers), await check(page, answers)];
    const omitStamps = (r: Record<string, unknown>) =>
      Object.fromEntries(Object.entries(r).filter(([k]) => k !== "submission_id" && k !== "produced_at"));
    expect(omitStamps(a)).toEqual(omitStamps(b));
    expect(a.rule_set_version).toBe(VISIBILITY_RULE_SET_VERSION);
    expect(a.rule_set_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(
      EXPECTED_VISIBILITY_RULES_HASH[a.rule_set_version],
      `no pinned rules_hash for ${a.rule_set_version}`,
    ).toBeDefined();
    expect(
      a.rule_set_hash,
      `rules_hash changed for ${a.rule_set_version} — a new version is required, not an edit`,
    ).toBe(EXPECTED_VISIBILITY_RULES_HASH[a.rule_set_version]);
  });
});

test.describe("Readiness check — one schema, both sides (§12.2, §12.7)", () => {
  test("the stub rejects every malformed answer set, field by field, and stays a stub", async ({ page }) => {
    const cases: [string, unknown, number][] = [
      ["a missing answer", readinessRequest(Object.fromEntries(READINESS_PRIORITY.slice(1).map((id) => [id, 0]))), 422],
      ["an unknown question", readinessRequest({ ...allGaps(0), not_a_gap: 2 } as ReadinessAnswers), 422],
      ["a value off the scale", readinessRequest({ ...allGaps(0), reviews: 3 } as unknown as ReadinessAnswers), 422],
      ["a blank contact field", readinessRequest(allGaps(0), { contact: { name: "", business: "b", website: "example.com", reach: "r" } }), 422],
      ["no envelope", { answers: [] }, 400],
      ["a bad submission_id", readinessRequest(allGaps(0), { submission_id: "not-a-uuid" }), 400],
    ];
    for (const [label, data, status] of cases) {
      const response = await postReadiness(page, data);
      expect(response.status(), label).toBe(status);
      expect(response.headers()["x-zbest-lead-stub"], `${label} is still the stub`).toBe("no-delivery");
      const body = await response.json();
      expect(body.ok, label).toBe(false);
    }
  });

  test("a superseded rule_set_version is refused with a typed error, never scored", async ({ page }) => {
    const response = await postReadiness(page, readinessRequest(allGaps(2), { rule_set_version: "fixture-2026-01-01.1" }));
    expect(response.status()).toBe(409);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "rule_set_superseded", active_version: VISIBILITY_RULE_SET_VERSION },
    });
  });

  test("a result is never mistaken for §11's, and carries no money and no engine claim", async ({ page }) => {
    for (const answers of [allGaps(0), allGaps(2), onlyGap("structured_data", 1)]) {
      const result = await check(page, answers);
      // §12.7's discriminator.
      expect(result.check).toBe("ai_visibility_readiness");
      expect(result.tier).toBe("free");
      // §12.1 separation: no §11 vocabulary anywhere in a §12 result.
      expect(JSON.stringify(result)).not.toMatch(/leak/i);
      // §12.9: no price, currency or payment field.
      expect(JSON.stringify(result)).not.toMatch(/\$/);
      expect(
        Object.keys(result).filter((k) => /currency|amount|price|minor_units|estimate|dollar/i.test(k)),
      ).toEqual([]);
      // §12.1: nothing states what an engine currently says or shows.
      expect(JSON.stringify(result)).not.toMatch(/chatgpt|gemini|perplexity|currently shows|we found that|ranks for/i);
    }
  });
});

test.describe("Readiness check — the form, the result and §12.7 routing", () => {
  async function fill(page: Page, answers: ReadinessAnswers) {
    await visit(page, "/search-intelligence#readiness-check");
    const section = page.locator("#readiness-check");
    const form = section.locator('form[data-lead-form="readiness"]');
    await form.getByLabel("Name", { exact: true }).fill("Test Person");
    await form.getByLabel("Business", { exact: true }).fill("Test Co");
    await form.getByLabel("Website", { exact: true }).fill("example.com");
    await form.getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
    for (const [id, value] of Object.entries(answers)) {
      await section
        .locator(`[data-readiness-question="${id}"]`)
        .getByRole("radio", { name: READINESS_SCALE[value], exact: true })
        .check();
    }
    await section.getByRole("button", { name: "Get Your Readiness Check" }).click();
    return section;
  }

  test("validates with the shared schema before sending — nothing reaches the stub", async ({ page }) => {
    const sent: string[] = [];
    await page.route("**/api/lead", (route) => {
      sent.push(route.request().url());
      return route.abort();
    });
    await visit(page, "/search-intelligence#readiness-check");
    const section = page.locator("#readiness-check");
    await section.getByRole("button", { name: "Get Your Readiness Check" }).click();
    await expect(section.getByRole("alert")).toContainText("Some answers need attention");
    expect(sent, "an invalid request is never sent").toEqual([]);
  });

  test("a gap: the gap, the because line, the fix, and BOTH next steps (§12.7)", async ({ page }, testInfo) => {
    const library = await certifiedLibrary();
    const reviews = library.find((g) => g.key === "reviews")!;
    const section = await fill(page, { ...allGaps(0), reviews: 2 });

    const result = section.locator("[data-readiness-result]");
    await expect(result).toHaveAttribute("data-readiness-result", "gap_identified");
    await expect(section.locator("[data-readiness-category]")).toHaveText(reviews.name);
    await expect(section.locator("[data-readiness-rationale]")).toHaveText(reviews.description);
    await expect(section.locator("[data-readiness-remediation]")).toHaveText(reviews.fix);
    await expect(section.locator("[data-readiness-because]")).toContainText("very true");
    await expect(section.locator("blockquote")).toContainText("We have few recent reviews");

    // §12.8 separation applies to RENDERED strings, not just the payload: the
    // whole result panel, as a visitor reads it, carries no §11 vocabulary.
    // VM-S5 proved this needs its own assertion — the form-section sweep runs
    // before submitting and never sees the result view.
    expect((await result.textContent()) ?? "", "§12.1 vocabulary in the rendered result").not.toMatch(/leak/i);

    // §12.7: a found gap routes to the page's #pricing AND to Talk to Us.
    const next = section.locator('[data-readiness-next="gap_identified"]');
    await expect(next.getByRole("link", { name: "See Pricing" })).toHaveAttribute("href", "#pricing");
    await expect(next.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");

    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await section.screenshot({
      path: path.join(SNAPSHOT_DIR, `zbm-readiness-result-${testInfo.project.name}.png`),
      style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
    });
  });

  test("a tie says the order decided it", async ({ page }) => {
    const section = await fill(page, { ...allGaps(0), reviews: 2, crawlability: 2 });
    await expect(section.locator("[data-readiness-category]")).toHaveText("Reviews Gap");
    await expect(section.locator("[data-readiness-tie]")).toContainText("Several gaps scored the same");
  });

  test("insufficient_signal: no gap is invented, and it routes to Talk to Us ONLY (§12.7)", async ({ page }, testInfo) => {
    const section = await fill(page, allGaps(0));
    await expect(section.locator("[data-readiness-result]")).toHaveAttribute(
      "data-readiness-result",
      "insufficient_signal",
    );
    await expect(section.locator("h3")).toHaveText("No prioritized gap from these answers.");
    await expect(section.locator("[data-readiness-category]")).toHaveCount(0);
    // §12.8, as above: the rendered insufficient view carries no §11 vocabulary.
    expect(
      (await section.locator("[data-readiness-result]").textContent()) ?? "",
      "§12.1 vocabulary in the rendered result",
    ).not.toMatch(/leak/i);

    // The whole point of the ruling: this outcome must NOT push toward pricing.
    const next = section.locator('[data-readiness-next="insufficient_signal"]');
    await expect(next.getByRole("link")).toHaveCount(1);
    await expect(next.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
    await expect(section.getByRole("link", { name: "See Pricing" })).toHaveCount(0);
    await expect(section.locator('a[href="#pricing"]')).toHaveCount(0);

    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await section.screenshot({
      path: path.join(SNAPSHOT_DIR, `zbm-readiness-insufficient-${testInfo.project.name}.png`),
      style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
    });
  });

  test("the form section is captured, and says 'gap' rather than 'leak'", async ({ page }, testInfo) => {
    await visit(page, "/search-intelligence#readiness-check");
    const section = page.locator("#readiness-check");
    const text = (await section.textContent()) ?? "";
    expect(text, "§12.1 vocabulary").not.toMatch(/leak/i);
    expect(text, "§12.1: never a claim about an engine").not.toMatch(/chatgpt|gemini|perplexity/i);
    expect(text).not.toContain("'");

    await mkdir(SNAPSHOT_DIR, { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await section.screenshot({
      path: path.join(SNAPSHOT_DIR, `zbm-readiness-form-${testInfo.project.name}.png`),
      style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
    });
  });
});

test.describe("Separation — §11 and §12 are different tools (§12.1, §12.2)", () => {
  test("the two rule sets share no taxonomy and no question id", async () => {
    const source = (f: string) => readFile(path.join(REPO, f), "utf8");
    const ids = (text: string) => [...text.matchAll(/id: "([a-z_]+)"/g)].map(([, id]) => id!);
    const [assessment, visibility] = [
      await source("apps/zbm/lib/assessment/rules.ts"),
      await source("apps/zbm/lib/visibility/rules.ts"),
    ];
    const shared = ids(assessment).filter((id) => ids(visibility).includes(id));
    expect(shared, "no question id belongs to both rule sets").toEqual([]);
  });

  test("the §12 rule set does not import the §11 one", async () => {
    const dir = path.join(REPO, "apps/zbm/lib/visibility");
    for (const file of ["rules.ts", "score.ts", "hash.ts"]) {
      const text = await readFile(path.join(dir, file), "utf8");
      // IMPORT statements only. hash.ts names lib/assessment in a comment, to
      // explain why `canonical` is duplicated rather than shared; a comment
      // cannot cross the taxonomies, an import can.
      const imports = text.split("\n").filter((line) => /^\s*import\b/.test(line));
      expect(imports.join("\n"), `${file} must not read §11's rule set`).not.toMatch(/assessment/);
    }
  });
});
