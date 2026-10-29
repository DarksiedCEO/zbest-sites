import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ZBM_BASE_URL } from "../playwright.config";
import { formReady } from "../support/ready";

/**
 * Phase 5 gate — the free assessment chunk (Brief §6.3; Backend Spec v0.3 §11;
 * founder decision 10). Brief §6.3 lists three other Phase 5 items: the
 * recovered-revenue counter stays unwired by the brief's own rule; ZBC's
 * "Browse Active Campaigns" CTA was already built and certified in Phase 4 ZBC
 * (phase-4-zbc.spec.ts); the Search Intelligence AI Visibility Check is not
 * built, pending a specified result shape.
 *
 * Asserted rather than trusted:
 *   - the eight approved questions, in order, on the approved scale
 *   - C2: every result string equals the published Leak Library, character
 *     for character, for all eight categories
 *   - the §11.4 rule: all-zero is insufficient_signal; highest score wins; the
 *     approved priority order breaks every tie
 *   - one schema, both sides: the form sends nothing the route would reject
 *   - no dollar figure, currency or estimate anywhere in a free result
 *   - the result is shown only once the lead route stored the lead (amended
 *     Oct 25, 2026 when the route was wired; see phase-7-lead-route.spec.ts)
 *
 * Expected copy and order are transcribed from Backend Spec v0.3 §11.3–§11.4,
 * not imported from the app. The Leak Library is read from its source file,
 * independently of the app's own derivation.
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-5");
const CONSENT_KEY = "zbest-cookie-consent";
const REPO = path.join(import.meta.dirname, "..", "..");

/** The fixture rule set's version. A mismatch is a 409, by design (§11.3). */
const RULE_SET_VERSION = "fixture-2026-09-18.2";

/**
 * §11.2 — the expected `rules_hash` per rule-set version, PINNED (the auditor's
 * ask, recorded in TOOLING.md).
 *
 * Matching `/^[0-9a-f]{64}$/` only proves something hashed; it does not prove
 * the rule set is the one that was certified. A question, the scale, the
 * priority order or any copy could change and the shape assertion would still
 * pass. Pinning the digest per version makes "immutable after activation"
 * checkable: editing `.2` in place fails here, and a genuine change must arrive
 * as a NEW version with its own pinned digest rather than as an edit.
 */
const EXPECTED_RULE_SET_HASH: Record<string, string> = {
  // Captured at 1dfe670 on a clean tree, from the certified .2 rule set.
  "fixture-2026-09-18.2": "d6a3674beca7d6d01a4cfaba573bd4641801091a62b92928d49bab90d27d4406",
};

/** §11.3, verbatim and in display order. */
const QUESTIONS: [string, string][] = [
  ["follow_up", "When a lead comes in, we don’t always respond fast or follow up consistently."],
  ["conversion", "Our site or booking process makes it hard for people to take the next step."],
  ["offer", "People aren’t sure what they get from us, or why it’s worth it."],
  ["trust", "We don’t have enough reviews, proof, or credentials in front of visitors."],
  ["tracking", "We can’t tell which ads, pages, or channels actually bring in revenue."],
  ["creative", "Our ads get attention or clicks, but not many real buyers."],
  ["visibility", "We’re hard to find in search results, map listings, or AI search."],
  ["traffic", "We don’t get enough qualified visitors or inquiries in the first place."],
];

/** §11.3 scale, founder-approved wording. */
const SCALE = ["Not true", "Somewhat true", "Very true"] as const;

/** §11.4, founder-approved. */
const PRIORITY = ["follow_up", "conversion", "offer", "trust", "tracking", "creative", "visibility", "traffic"];

type Library = Record<string, { name: string; body: string; fix: string }>;

/** C2's source of truth, read from the published Leak Library's source text. */
async function leakLibrary(): Promise<Library> {
  const source = await readFile(path.join(REPO, "apps/zbm/content/revenue-recovery.ts"), "utf8");
  const block = source.match(/export const LEAK_LIBRARY = \{[\s\S]*?leaks: \[([\s\S]*?)\]\.map/)?.[1] ?? "";
  const rows = [...block.matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)"\]/g)];
  return Object.fromEntries(
    rows.map(([, name, body, , fix]) => [
      name!.replace(/ Leak$/, "").toLowerCase().replace(/-/g, "_"),
      { name: name!, body: body!, fix: fix! },
    ]),
  );
}

type Answers = Record<string, 0 | 1 | 2>;
const all = (value: 0 | 1 | 2): Answers => Object.fromEntries(PRIORITY.map((id) => [id, value]));
const only = (id: string, value: 1 | 2): Answers => ({ ...all(0), [id]: value });
/** Every question answered except one — a MISSING answer, not a malformed one. */
const without = (id: string, value: 0 | 1 | 2): Answers =>
  Object.fromEntries(PRIORITY.filter((q) => q !== id).map((q) => [q, value]));
const omit = (record: Record<string, unknown>, ...drop: string[]) =>
  Object.fromEntries(Object.entries(record).filter(([k]) => !drop.includes(k)));

function request(answers: Answers, overrides: Record<string, unknown> = {}) {
  return {
    form: "assessment",
    submission_id: crypto.randomUUID(),
    rule_set_version: RULE_SET_VERSION,
    contact: { name: "Test Person", business: "Test Co", website: "example.com", reach: "test@example.com" },
    answers: Object.entries(answers).map(([question_id, value]) => ({ question_id, value })),
    ...overrides,
  };
}

const post = (page: Page, data: unknown) =>
  page.request.post(`${ZBM_BASE_URL}/api/lead`, { data, failOnStatusCode: false });

async function score(page: Page, answers: Answers) {
  const res = await post(page, request(answers));
  expect(res.status(), await res.text()).toBe(200);
  return (await res.json()).result;
}

/** Every key at every depth, so a currency FIELD cannot hide inside a nested object. */
function keys(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([k, v]) => [k, ...keys(v)]);
}

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

async function openAssessment(page: Page) {
  await presetConsent(page);
  await page.goto(`${ZBM_BASE_URL}/revenue-recovery#assessment`, { waitUntil: "domcontentloaded" });
  const section = page.locator("#assessment");
  await formReady(section.locator('form[data-lead-form="assessment"]'));
  return section;
}

async function fillContact(section: Locator) {
  const form = section.locator('form[data-lead-form="assessment"]');
  await form.getByLabel("Name", { exact: true }).fill("Test Person");
  await form.getByLabel("Business", { exact: true }).fill("Test Co");
  await form.getByLabel("Website", { exact: true }).fill("example.com");
  await form.getByLabel("Best way to reach you", { exact: true }).fill("test@example.com");
}

async function choose(section: Locator, choices: Record<string, (typeof SCALE)[number]>) {
  for (const [id, label] of Object.entries(choices)) {
    await section.locator(`[data-assessment-question="${id}"]`).getByRole("radio", { name: label, exact: true }).check();
  }
}

async function capture(section: Locator, name: string, project: string) {
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await section.page().evaluate(() => document.fonts.ready);
  // Repair (2026-09-20): the site nav is sticky, and in an element capture it
  // paints over the top of the section — at 390 it covers the "GET AN ASSESSMENT"
  // label. It is not part of the section, so it is hidden for the screenshot only
  // (Playwright's `style` applies during capture and nowhere else). This is the
  // same treatment the Visibility Gap Library captures already use. At 1440 the
  // nav does not reach the section, so those captures are unchanged.
  await section.screenshot({
    path: path.join(SNAPSHOT_DIR, `zbm-assessment-${name}-${project}.png`),
    style: 'header:has(> nav[aria-label="Primary"]) { visibility: hidden !important; }',
  });
}

const everyOther = (value: (typeof SCALE)[number]) => Object.fromEntries(PRIORITY.map((id) => [id, value]));

test.describe("Free assessment — the rule (§11.4) and its copy (C2)", () => {
  test("C2: every category's rationale and remediation equal the published Leak Library, character for character", async ({ page }) => {
    const library = await leakLibrary();
    expect(Object.keys(library).sort(), "the Leak Library defines exactly the eight categories").toEqual([...PRIORITY].sort());
    for (const category of PRIORITY) {
      const result = await score(page, only(category, 2));
      expect(result.category, category).toBe(category);
      expect(result.rationale, `${category} rationale`).toBe(library[category]!.body);
      expect(result.remediation, `${category} remediation`).toBe(library[category]!.fix);
    }
  });

  test("all answers 'Not true' is insufficient_signal — no category is invented", async ({ page }) => {
    const result = await score(page, all(0));
    expect(result).toMatchObject({
      tier: "free",
      status: "insufficient_signal",
      category: null,
      rationale: null,
      remediation: null,
      because: null,
      tie_broken_by_priority: false,
    });
  });

  test("the approved priority order decides every tie, all the way down", async ({ page }) => {
    const answers = all(2);
    for (const [index, expected] of PRIORITY.entries()) {
      const result = await score(page, answers);
      expect(result.category, `with ${PRIORITY.slice(index).join(", ")} tied`).toBe(expected);
      expect(result.tie_broken_by_priority).toBe(index < PRIORITY.length - 1);
      answers[expected] = 0;
    }
  });

  test("the highest score wins before priority is consulted", async ({ page }) => {
    // Traffic is last in the order but alone at the top score.
    const lone = await score(page, { ...all(1), traffic: 2 });
    expect(lone).toMatchObject({ category: "traffic", tie_broken_by_priority: false });
    expect(lone.because).toMatchObject({ question_id: "traffic", value: 2, value_label: "Very true" });
    // Everything 'Somewhat true': the order picks, and says it did.
    const flat = await score(page, all(1));
    expect(flat).toMatchObject({ category: "follow_up", tie_broken_by_priority: true });
    expect(flat.because).toMatchObject({ value: 1, value_label: "Somewhat true" });
  });

  test("deterministic: the same answers return the same outcome and the same rule-set hash", async ({ page }) => {
    const answers: Answers = { ...all(0), offer: 2, trust: 1 };
    const [a, b] = [await score(page, answers), await score(page, answers)];
    expect(omit(a, "submission_id", "produced_at")).toEqual(omit(b, "submission_id", "produced_at"));
    expect(a.rule_set_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.rule_set_version).toBe(RULE_SET_VERSION);
    // The pin: this version must still hash to the digest it was certified with.
    expect(EXPECTED_RULE_SET_HASH[a.rule_set_version], `no pinned rules_hash for ${a.rule_set_version}`).toBeDefined();
    expect(a.rule_set_hash, `rules_hash changed for ${a.rule_set_version} — a new version is required, not an edit`).toBe(
      EXPECTED_RULE_SET_HASH[a.rule_set_version],
    );
  });

  test("no free result carries a dollar figure, a currency or an estimate", async ({ page }) => {
    for (const answers of [all(0), all(2), only("tracking", 1)]) {
      const result = await score(page, answers);
      expect(JSON.stringify(result)).not.toMatch(/\$/);
      expect(keys(result).filter((k) => /currency|amount|price|minor_units|estimate|dollar/i.test(k))).toEqual([]);
    }
  });
});

test.describe("Free assessment — one schema, both sides (§11.3)", () => {
  test("the route rejects every malformed answer set, field by field, and stores nothing", async ({ page }) => {
    const cases: [string, Record<string, unknown>, string, string][] = [
      ["a missing answer", request(without("follow_up", 1)), "answers.follow_up", "Choose an answer."],
      ["an unknown question", request(all(1), { answers: [...request(all(1)).answers, { question_id: "bogus", value: 1 }] }), "answers.bogus", "Unknown question."],
      ["a duplicate answer", request(all(1), { answers: [...request(all(1)).answers, { question_id: "trust", value: 2 }] }), "answers.trust", "Answer each question once."],
      ["a bad website", request(all(1), { contact: { name: "A", business: "B", website: "not a website", reach: "C" } }), "website", "Enter a website address, like example.com."],
    ];
    for (const [label, data, field, message] of cases) {
      const res = await post(page, data);
      expect(res.status(), label).toBe(422);
      expect(res.headers()["x-zbest-lead-stub"], label).toBeUndefined();
      const body = await res.json();
      expect(body.error.code, label).toBe("validation");
      expect(body.error.fields[field], label).toBe(message);
    }
    const outOfRange = await post(page, request(all(1), { answers: [{ question_id: "follow_up", value: 3 }] }));
    expect(outOfRange.status()).toBe(422);
  });

  test("a superseded rule-set version is refused with a typed error, never scored", async ({ page }) => {
    const res = await post(page, request(all(2), { rule_set_version: "fixture-2026-01-01.0" }));
    expect(res.status()).toBe(409);
    expect(await res.json()).toEqual({
      ok: false,
      error: { code: "rule_set_superseded", active_version: RULE_SET_VERSION },
    });
  });

  test("a request without its envelope is malformed, not a form to correct", async ({ page }) => {
    expect((await post(page, omit(request(all(1)), "submission_id"))).status()).toBe(400);
  });
});

test.describe("Free assessment — the form and its result (§11.3, §11.5)", () => {
  test("renders the eight approved questions, in order, each on the approved scale", async ({ page }, testInfo) => {
    const section = await openAssessment(page);
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("Get your free assessment.");
    await expect(section.locator("[data-note]")).toHaveText("Free. We save your answers and contact details so we can follow up with you. See our Privacy Policy.");

    const ids = await section.locator("[data-assessment-question]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-assessment-question")),
    );
    expect(ids).toEqual(QUESTIONS.map(([id]) => id));
    for (const [id, statement] of QUESTIONS) {
      const group = section.getByRole("group", { name: statement, exact: true });
      await expect(group, id).toHaveAttribute("data-assessment-question", id);
      for (const label of SCALE) {
        await expect(group.getByRole("radio", { name: label, exact: true }), `${id}: ${label}`).toBeVisible();
      }
      await expect(group.getByRole("radio")).toHaveCount(3);
    }
    await capture(section, "form", testInfo.project.name);
  });

  test("validates with the shared schema before sending — nothing reaches the route", async ({ page }) => {
    const section = await openAssessment(page);
    let sent = 0;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/lead")) sent += 1;
    });
    await fillContact(section);
    await choose(section, { follow_up: "Very true" });
    await section.getByRole("button", { name: "Get an Assessment" }).click();
    await expect(section.getByText("Some answers need attention.")).toBeVisible();
    await expect(section.getByText("Choose an answer.")).toHaveCount(7);
    expect(sent).toBe(0);
  });

  test("a leak: the leak, the because template, the fix, and both next steps", async ({ page }, testInfo) => {
    const library = await leakLibrary();
    const section = await openAssessment(page);
    await fillContact(section);
    await choose(section, { ...everyOther("Not true"), conversion: "Very true", trust: "Somewhat true" });
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      section.getByRole("button", { name: "Get an Assessment" }).click(),
    ]);
    expect(response.headers()["x-zbest-lead-transport"]).toBe("fake");

    const result = section.locator('[data-assessment-result="leak_identified"]');
    await expect(result).toBeVisible();
    await expect(result).toContainText("Received");
    await expect(result).toContainText("Scored against a fixed set of rules. A full audit goes deeper.");
    await expect(result.getByRole("heading", { level: 3 })).toHaveText(library.conversion!.name);
    await expect(result.locator("[data-assessment-rationale]")).toHaveText(library.conversion!.body);
    await expect(result.locator("[data-assessment-because]")).toHaveText("Because you said this is very true for you:");
    await expect(result.locator("blockquote")).toHaveText(QUESTIONS[1]![1]);
    await expect(result.locator("[data-assessment-remediation]")).toHaveText(library.conversion!.fix);
    await expect(result.locator("[data-assessment-tie]")).toHaveCount(0);
    await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
    await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
    expect(await result.innerText()).not.toMatch(/\$/);
    await capture(section, "result", testInfo.project.name);
  });

  test("a tie says the order decided it", async ({ page }) => {
    const section = await openAssessment(page);
    await fillContact(section);
    await choose(section, everyOther("Very true"));
    await section.getByRole("button", { name: "Get an Assessment" }).click();
    const result = section.locator('[data-assessment-result="leak_identified"]');
    await expect(result.locator("[data-assessment-category]")).toHaveAttribute("data-assessment-category", "follow_up");
    await expect(result.locator("[data-assessment-tie]")).toHaveText(
      "Several leaks scored the same for you. This is the one we’d fix first.",
    );
  });

  test("insufficient_signal: no leak is invented, and it routes to the Audit and Talk to Us", async ({ page }, testInfo) => {
    const section = await openAssessment(page);
    await fillContact(section);
    await choose(section, everyOther("Not true"));
    await section.getByRole("button", { name: "Get an Assessment" }).click();

    const result = section.locator('[data-assessment-result="insufficient_signal"]');
    await expect(result).toBeVisible();
    await expect(result.getByRole("heading", { level: 3 })).toHaveText("No prioritized leak from these answers.");
    await expect(result.locator("[data-assessment-category]")).toHaveCount(0);
    await expect(result).toContainText("we won’t invent one");
    await expect(result.getByRole("link", { name: "See what the Audit covers" })).toHaveAttribute("href", "/revenue-recovery#audit");
    await expect(result.getByRole("link", { name: "Talk to Us" })).toHaveAttribute("href", "/contact");
    await capture(section, "insufficient", testInfo.project.name);
  });
});
