import { expect, test, type Locator, type Page } from "@playwright/test";
import { spawn } from "node:child_process";
import { formReady } from "../support/ready";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  LIMITED_RATE,
  ZBC_BASE_URL,
  ZBM_BASE_URL,
  ZBM_LIMITED_URL,
  ZBM_MALFORMED_PORT,
  ZBM_UNCONFIGURED_URL,
  outboxFor,
} from "../playwright.config";

/**
 * Lead route gate (docs/LEAD-ROUTE-DESIGN.md; Brief §6.2).
 *
 * The gate never delivers for real. ZBM (3000) and ZBC (3001) run the FAKE
 * transport, which appends every stored row, every founder email and every
 * notify_status update to JSONL files in a per-run outbox; these tests read
 * those files back, so "stored" and "sent" are asserted, not inferred from a
 * 200. Two more servers run the same ZBM build:
 *   - 3002 with NO transport env → must fail closed: 503, nothing saved, and
 *     the form says so;
 *   - 3003 with a tight rate limit → 429 with Retry-After, and the form says so.
 *
 * Asserted, at both viewports:
 *   - success: row + email + notify 'sent'; services[] and source carried
 *   - idempotency: a double submit is one row and one email
 *   - validation: field errors, nothing stored
 *   - honeypot: looks like success, nothing stored or sent
 *   - misconfiguration: honest failure, never a success
 *   - rate limit: honest failure after the limit
 *   - assessment / readiness / ZBC forms record their leads too
 *
 * What this cannot assert: real Postgres, real Resend, Vercel's edge headers.
 * Postgres is covered by packages/lead/test/postgres.test.ts against a real
 * database; Resend and Vercel are not exercised anywhere (report says so).
 */

const SNAPSHOT_DIR = path.join(import.meta.dirname, "..", "snapshots", "phase-7-lead-route");
const CONSENT_KEY = "zbest-cookie-consent";

type Row = {
  submission_id: string;
  app: string;
  form: string;
  payload: Record<string, unknown>;
  services: string[];
  source: string | null;
  ip_hash?: string | null;
  user_agent: string | null;
};
type Email = { to: string[]; idempotency_key: string; subject: string; text: string; replyTo?: string };
type Notify = { app: string; submission_id: string; notify_status: string };

async function jsonl<T>(server: "zbm" | "zbc" | "zbm-limited", file: string): Promise<T[]> {
  try {
    const text = await readFile(path.join(outboxFor(server), file), "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as T);
  } catch {
    return [];
  }
}
const rowsFor = async (server: "zbm" | "zbc" | "zbm-limited", id: string) =>
  (await jsonl<Row>(server, "rows.jsonl")).filter((r) => r.submission_id === id);
const emailsFor = async (server: "zbm" | "zbc" | "zbm-limited", id: string) =>
  (await jsonl<Email>(server, "emails.jsonl")).filter(
    // Namespaced by app (AEGIS L6).
    (e) => e.idempotency_key === `lead-${server === "zbc" ? "zbc" : "zbm"}-${id}`,
  );
const notifyFor = async (server: "zbm" | "zbc", id: string) =>
  (await jsonl<Notify>(server, "notify.jsonl")).filter((n) => n.submission_id === id);
/** Every stored row whose payload mentions this marker. */
const rowsMentioning = async (server: "zbm" | "zbc", marker: string) =>
  (await jsonl<Row>(server, "rows.jsonl")).filter((r) => JSON.stringify(r.payload).includes(marker));

async function presetConsent(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ choice: "rejected-non-essential", at: "2026-01-01T00:00:00.000Z" }));
  }, CONSENT_KEY);
}

async function capture(page: Page, name: string, projectName: string) {
  await page.evaluate(() => document.fonts.ready);
  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, `zbm-${name}-${projectName}.png`), fullPage: true });
}

const startForm = (page: Page) => page.locator('form[data-lead-form="start"]');

/** A per-test marker in the Name field, so outbox rows can be found and counted. */
const marker = (label: string, project: string) => `E2E ${label} ${project} ${randomUUID().slice(0, 8)}`;

async function fillStart(page: Page, name: string) {
  const form = await formReady(startForm(page));
  await form.getByLabel("Name", { exact: true }).fill(name);
  await form.getByLabel("Business", { exact: true }).fill("Lead Gate Co");
  await form.getByLabel("Best way to reach you", { exact: true }).fill("lead-gate@example.com");
}

const sendStart = async (page: Page) => {
  await formReady(startForm(page));
  return sendStartNow(page);
};
const sendStartNow = (page: Page) =>
  Promise.all([
    page.waitForResponse((r) => r.url().endsWith("/api/lead") && r.request().method() === "POST"),
    startForm(page).getByRole("button", { name: "Send" }).click(),
  ]).then(([response]) => response);

test.describe("Success through the fake transport (§6.2)", () => {
  test("a campaign visitor's /start lead is stored once, emailed once, with services and source; captured", async ({
    page,
  }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=out-of-home&src=BB-Lead-Gate`, { waitUntil: "domcontentloaded" });
    const name = marker("success", testInfo.project.name);
    await fillStart(page, name);
    await startForm(page).getByLabel(/TV & Streaming/).check();
    const response = await sendStart(page);

    expect(response.status()).toBe(200);
    expect(response.headers()["x-zbest-lead-transport"]).toBe("fake");
    expect(response.headers()["cache-control"]).toBe("no-store");
    const id = response.request().postDataJSON().submission_id as string;
    expect(await response.json()).toEqual({ ok: true, submission_id: id });

    const accepted = page.locator('[data-lead-result="accepted"]');
    await expect(accepted).toContainText("Received");
    await expect(accepted).toContainText("A person reads every submission");
    await expect(accepted).not.toContainText(/stub|not delivered/i);

    const rows = await rowsFor("zbm", id);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      app: "zbm",
      form: "start",
      services: ["tv-streaming", "out-of-home"],
      source: "bb-lead-gate",
    });
    expect(rows[0]!.payload).toMatchObject({ name, business: "Lead Gate Co", reach: "lead-gate@example.com" });
    // The gate server trusts x-forwarded-for, which `next start` fills from the socket
    // when absent (this test sends none — see the R1 caution in playwright.config.ts).
    // Nothing derived from the address is stored (privacy sweep 2026-10-30): no ip_hash.
    expect(rows[0]).not.toHaveProperty("ip_hash");
    expect(JSON.stringify(rows[0])).not.toContain("127.0.0.1");

    const emails = await emailsFor("zbm", id);
    expect(emails).toHaveLength(1);
    expect(emails[0]!.subject).toBe("New lead — Z Best Media · start · tv-streaming, out-of-home · src:bb-lead-gate");
    expect(emails[0]!.text).toContain(name);
    expect(emails[0]!.replyTo).toBe("lead-gate@example.com");
    expect(await notifyFor("zbm", id)).toEqual([{ app: "zbm", submission_id: id, notify_status: "sent" }]);

    await capture(page, "start-received", testInfo.project.name);
  });

  test("a double submit is one lead and one email", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=websites`, { waitUntil: "domcontentloaded" });
    const name = marker("double", testInfo.project.name);
    await fillStart(page, name);

    // A real double-click: the button disables after the first, so at most a
    // second request can slip through; and the same submission_id is reused.
    const posts: string[] = [];
    let sentBody: unknown;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/lead") && r.method() === "POST") {
        sentBody = r.postDataJSON();
        posts.push(r.postDataJSON().submission_id);
      }
    });
    // Wait for hydration: a double-click before it would hit the disabled
    // pre-hydration button, not the double submit under test.
    await formReady(startForm(page));
    await startForm(page).getByRole("button", { name: "Send" }).dblclick();
    await expect(page.locator('[data-lead-result="accepted"]')).toBeVisible();
    expect(new Set(posts).size).toBe(1);
    const id = posts[0]!;

    // And the server holds even when the client does not: replay the exact
    // request twice more, concurrently. (A replay with CHANGED content is a
    // 409 conflict — asserted in the hardening block below.)
    const replay = () => page.request.post(`${ZBM_BASE_URL}/api/lead`, { data: sentBody, failOnStatusCode: false });
    const [a, b] = await Promise.all([replay(), replay()]);
    for (const r of [a, b]) {
      expect(r.status()).toBe(200);
      expect(await r.json()).toEqual({ ok: true, submission_id: id });
    }

    expect(await rowsFor("zbm", id)).toHaveLength(1);
    expect(await emailsFor("zbm", id)).toHaveLength(1);
    expect(await rowsMentioning("zbm", name)).toHaveLength(1);
  });

  test("Z Best Clips: a clipper waitlist lead is stored as app 'zbc', reply-to the clipper", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBC_BASE_URL}/become-a-clipper`, { waitUntil: "domcontentloaded" });
    const form = page.locator('form[data-lead-form="clipper"]');
    const name = marker("clipper", testInfo.project.name);
    await form.getByLabel("Name", { exact: true }).fill(name);
    await form.getByLabel("Email", { exact: true }).fill("clipper-gate@example.com");
    await form.getByLabel("Primary platform", { exact: true }).selectOption("instagram-reels");
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Join the clipper list" }).click(),
    ]);
    expect(response.status()).toBe(200);
    const id = response.request().postDataJSON().submission_id as string;
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Received");

    const rows = await rowsFor("zbc", id);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ app: "zbc", form: "clipper", services: [], source: null });
    expect(rows[0]!.payload).toMatchObject({ name, email: "clipper-gate@example.com", platform: "instagram-reels" });
    const emails = await emailsFor("zbc", id);
    expect(emails).toHaveLength(1);
    expect(emails[0]!.subject).toBe("New lead — Z Best Clips · clipper");
    expect(emails[0]!.replyTo).toBe("clipper-gate@example.com");
    // Never in ZBM's store.
    expect(await rowsFor("zbm", id)).toHaveLength(0);
  });

  test("assessment and readiness submissions record the lead before returning a result (§11.3, §12.7)", async ({
    page,
  }, testInfo) => {
    const contact = { name: marker("assess", testInfo.project.name), business: "B", website: "example.com", reach: "r@example.com" };
    const assessmentId = randomUUID();
    const assessment = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      data: {
        form: "assessment",
        submission_id: assessmentId,
        rule_set_version: "fixture-2026-09-18.2",
        contact,
        answers: ["follow_up", "conversion", "offer", "trust", "tracking", "creative", "visibility", "traffic"].map((q, i) => ({
          question_id: q,
          value: i === 1 ? 2 : 0,
        })),
      },
    });
    expect(assessment.status()).toBe(200);
    expect((await assessment.json()).result.category).toBe("conversion");
    const [aRow] = await rowsFor("zbm", assessmentId);
    expect(aRow).toMatchObject({ form: "assessment", payload: { contact, result: { status: "leak_identified", category: "conversion" } } });
    expect((aRow!.payload.answers as unknown[]).length).toBe(8);
    expect(await emailsFor("zbm", assessmentId)).toHaveLength(1);

    const readinessId = randomUUID();
    const readiness = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      data: {
        form: "readiness",
        submission_id: readinessId,
        rule_set_version: "fixture-2026-09-20.1",
        contact,
        answers: [
          "business_profile", "entity_consistency", "reviews", "crawlability",
          "structured_data", "answer_content", "brand_citations", "local_listings",
        ].map((q) => ({ question_id: q, value: 0 })),
      },
    });
    expect(readiness.status()).toBe(200);
    const [rRow] = await rowsFor("zbm", readinessId);
    expect(rRow).toMatchObject({
      form: "readiness",
      payload: { result: { check: "ai_visibility_readiness", status: "insufficient_signal", category: null } },
    });
  });

  test("a tampered source tag is dropped, never stored", async ({ page }) => {
    const id = randomUUID();
    const res = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      data: {
        form: "start",
        submission_id: id,
        fields: { services: "radio-audio", name: "A", business: "B", reach: "C", website: "", budget: "", timing: "", details: "", source: "<script>x</script>" },
      },
    });
    expect(res.status()).toBe(200);
    const [row] = await rowsFor("zbm", id);
    expect(row!.source).toBeNull();
    expect(row!.payload.source).toBe("");
  });
});

test.describe("Validation and abuse (§6.2)", () => {
  test("field errors are shown and nothing is stored", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start`, { waitUntil: "domcontentloaded" });
    const name = marker("invalid", testInfo.project.name);
    await startForm(page).getByLabel("Name", { exact: true }).fill(name);
    const response = await sendStart(page);
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.error.code).toBe("validation");
    expect(Object.keys(body.error.fields).sort()).toEqual(["business", "reach", "services"]);
    await expect(startForm(page).getByText("Enter your business name.")).toBeVisible();
    expect(await rowsMentioning("zbm", name)).toHaveLength(0);
  });

  test("a filled honeypot looks exactly like success and stores and sends nothing", async ({ page }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=social-media`, { waitUntil: "domcontentloaded" });
    const name = marker("honeypot", testInfo.project.name);
    await fillStart(page, name);
    // What a form-filling bot does: fills every input, including the hidden one.
    // The input's name is non-semantic (AEGIS L4); it is sent as company_url.
    const trap = startForm(page).locator('input[name="zbx_hp_7f3"]');
    await expect(trap).toHaveAttribute("autocomplete", "off");
    await trap.fill("http://spam.example", { force: true });
    const response = await sendStart(page);
    expect(response.status()).toBe(200);
    const id = response.request().postDataJSON().submission_id as string;
    expect(await response.json()).toEqual({ ok: true, submission_id: id });
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Received");
    expect(await rowsFor("zbm", id)).toHaveLength(0);
    expect(await emailsFor("zbm", id)).toHaveLength(0);
    expect(await rowsMentioning("zbm", name)).toHaveLength(0);
  });

  test("rate limit: after the limit the route answers 429 with Retry-After, and the form says nothing was saved; captured", async ({
    page,
  }, testInfo) => {
    // Its own client address per project, so the two viewports do not share a bucket.
    const ip = testInfo.project.name === "desktop-1440" ? "198.51.100.14" : "198.51.100.39";
    const headers = { "x-real-ip": ip };
    const ids: string[] = [];
    for (let i = 0; i < LIMITED_RATE.limit; i++) {
      const id = randomUUID();
      ids.push(id);
      const ok = await page.request.post(`${ZBM_LIMITED_URL}/api/lead`, {
        headers,
        data: { form: "contact", submission_id: id, fields: { name: "A", business: "B", problem: "C", reach: "D" } },
      });
      expect(ok.status(), `request ${i + 1} of ${LIMITED_RATE.limit}`).toBe(200);
    }
    const blocked = await page.request.post(`${ZBM_LIMITED_URL}/api/lead`, {
      headers,
      data: { form: "contact", submission_id: randomUUID(), fields: { name: "A", business: "B", problem: "C", reach: "D" } },
      failOnStatusCode: false,
    });
    expect(blocked.status()).toBe(429);
    const body = await blocked.json();
    expect(body.error.code).toBe("rate_limited");
    expect(body.error.retry_after_s).toBeGreaterThan(0);
    expect(Number(blocked.headers()["retry-after"])).toBe(body.error.retry_after_s);
    for (const id of ids) expect(await rowsFor("zbm-limited", id)).toHaveLength(1);

    // The visitor on that same address sees an honest message, not a success.
    await page.setExtraHTTPHeaders(headers);
    await presetConsent(page);
    await page.goto(`${ZBM_LIMITED_URL}/start?service=websites`, { waitUntil: "domcontentloaded" });
    const name = marker("limited", testInfo.project.name);
    await fillStart(page, name);
    const response = await sendStart(page);
    expect(response.status()).toBe(429);
    const alert = startForm(page).locator('[data-lead-failure="rate_limited"]');
    await expect(alert).toHaveText("Too many attempts from your connection. Nothing was saved — please wait a few minutes and try again.");
    await expect(page.locator('[data-lead-result="accepted"]')).toHaveCount(0);
    await capture(page, "start-rate-limited", testInfo.project.name);
  });
});

test.describe("Misconfiguration fails closed", () => {
  test("no transport configured: 503 not_configured, and the form never claims success; captured", async ({
    page,
  }, testInfo) => {
    const api = await page.request.post(`${ZBM_UNCONFIGURED_URL}/api/lead`, {
      data: { form: "contact", submission_id: randomUUID(), fields: { name: "A", business: "B", problem: "C", reach: "D" } },
      failOnStatusCode: false,
    });
    expect(api.status()).toBe(503);
    expect(await api.json()).toEqual({ ok: false, error: { code: "not_configured" } });
    expect(api.headers()["x-zbest-lead-transport"]).toBeUndefined();

    await presetConsent(page);
    await page.goto(`${ZBM_UNCONFIGURED_URL}/start?service=out-of-home`, { waitUntil: "domcontentloaded" });
    await fillStart(page, marker("unconfigured", testInfo.project.name));
    const response = await sendStart(page);
    expect(response.status()).toBe(503);
    const alert = startForm(page).locator('[data-lead-failure="not_configured"]');
    await expect(alert).toHaveText("This form isn’t accepting submissions yet, so nothing was saved or sent.");
    await expect(page.locator('[data-lead-result="accepted"]')).toHaveCount(0);
    // The visitor's entries are still there to retry or copy.
    await expect(startForm(page).getByLabel("Business", { exact: true })).toHaveValue("Lead Gate Co");
    await capture(page, "start-not-configured", testInfo.project.name);
  });

  test("the assessment shows no result when the lead cannot be recorded", async ({ page }) => {
    await presetConsent(page);
    await page.goto(`${ZBM_UNCONFIGURED_URL}/revenue-recovery`, { waitUntil: "domcontentloaded" });
    const section = page.locator("#assessment");
    const form = section.locator('form[data-lead-form="assessment"]');
    await form.getByLabel("Name", { exact: true }).fill("A");
    await form.getByLabel("Business", { exact: true }).fill("B");
    await form.getByLabel("Website", { exact: true }).fill("example.com");
    await form.getByLabel("Best way to reach you", { exact: true }).fill("a@example.com");
    for (const question of await form.locator("[data-assessment-question]").all()) {
      await question.getByRole("radio", { name: "Somewhat true", exact: true }).check();
    }
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead")),
      form.getByRole("button", { name: "Get an Assessment" }).click(),
    ]);
    expect(response.status()).toBe(503);
    await expect(form.locator('[data-lead-failure="not_configured"]')).toBeVisible();
    await expect(section.locator('[data-lead-result="accepted"]')).toHaveCount(0);
  });

  test("Z Best Clips' misconfiguration path is the same pipeline (unit-tested); its live server is configured", async ({ page }) => {
    // Guard against the gate itself silently running ZBC unconfigured.
    const res = await page.request.post(`${ZBC_BASE_URL}/api/lead`, {
      data: { form: "campaign", submission_id: randomUUID(), fields: { name: "A", organization: "B", promoting: "C", focus: "brands", reach: "D" } },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["x-zbest-lead-transport"]).toBe("fake");
  });
});

test.describe("Hardening (AEGIS review of 55d3437)", () => {
  const contact = (id: string, name = "A") => ({ form: "contact", submission_id: id, fields: { name, business: "B", problem: "C", reach: "D" } });

  test("M3: non-JSON is 415 and a foreign Origin is 403; nothing is stored", async ({ page }, testInfo) => {
    const id = randomUUID();
    const plain = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      headers: { "content-type": "text/plain" },
      data: JSON.stringify(contact(id)),
      failOnStatusCode: false,
    });
    expect(plain.status()).toBe(415);
    const foreign = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      headers: { origin: "https://evil.example" },
      data: contact(id),
      failOnStatusCode: false,
    });
    expect(foreign.status()).toBe(403);
    expect(await rowsFor("zbm", id)).toHaveLength(0);

    // The real attack, from a real browser on another origin: a no-cors
    // text/plain POST, and a JSON POST that needs a preflight. The attacker's
    // page is a bare local server with no CSP. (It used to be the ZBC site,
    // but ZBC's own CSP, connect-src 'self', now blocks both requests in the
    // browser before the server is ever tested; Phase 6 step 3.)
    const name = marker("cross-site", testInfo.project.name);
    const attacker = createServer((_req, res) => {
      res.writeHead(200, { "content-type": "text/html" });
      res.end("<!doctype html><title>attacker</title>");
    });
    await new Promise<void>((resolve) => attacker.listen(0, "127.0.0.1", resolve));
    const attackerUrl = `http://127.0.0.1:${(attacker.address() as AddressInfo).port}/`;
    await page.goto(attackerUrl, { waitUntil: "domcontentloaded" });
    const outcomes = await page.evaluate(
      async ([target, body]) => {
        const results: string[] = [];
        try {
          await fetch(target, { method: "POST", mode: "no-cors", headers: { "content-type": "text/plain" }, body });
          results.push("no-cors sent");
        } catch {
          results.push("no-cors blocked");
        }
        try {
          await fetch(target, { method: "POST", headers: { "content-type": "application/json" }, body });
          results.push("json allowed");
        } catch {
          results.push("json blocked");
        }
        return results;
      },
      [`${ZBM_BASE_URL}/api/lead`, JSON.stringify(contact(randomUUID(), name))] as const,
    );
    attacker.close();
    expect(outcomes).toEqual(["no-cors sent", "json blocked"]);
    expect(await rowsMentioning("zbm", name)).toHaveLength(0);

    // From the ZBC site, our CSP refuses the cross-site request outright.
    await page.goto(`${ZBC_BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const underCsp = await page.evaluate(async (target) => {
      try {
        await fetch(target, { method: "POST", mode: "no-cors", headers: { "content-type": "text/plain" }, body: "{}" });
        return "sent";
      } catch {
        return "blocked";
      }
    }, `${ZBM_BASE_URL}/api/lead`);
    expect(underCsp).toBe("blocked");
  });

  test("L1: an oversized body is 413; L2: a changed resubmission is 409", async ({ page }) => {
    const big = await page.request.post(`${ZBM_BASE_URL}/api/lead`, {
      data: contact(randomUUID(), "x".repeat(70 * 1024)),
      failOnStatusCode: false,
    });
    expect(big.status()).toBe(413);

    const id = randomUUID();
    expect((await page.request.post(`${ZBM_BASE_URL}/api/lead`, { data: contact(id, "First") })).status()).toBe(200);
    const changed = await page.request.post(`${ZBM_BASE_URL}/api/lead`, { data: contact(id, "Edited"), failOnStatusCode: false });
    expect(changed.status()).toBe(409);
    expect(await changed.json()).toEqual({ ok: false, error: { code: "conflict" } });
    const rows = await rowsFor("zbm", id);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.payload.name).toBe("First");
    expect(await emailsFor("zbm", id)).toHaveLength(1);
  });

  test("M1: a real `next start` with a malformed POSTGRES_URL answers 503 and never prints the URL", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "server behaviour — viewport-independent");
    const secret = `PwLeak${randomUUID().slice(0, 8)}`;
    const server = spawn(
      "pnpm",
      ["--filter", "@zbest/zbm", "exec", "next", "start", "--hostname", "127.0.0.1", "--port", String(ZBM_MALFORMED_PORT)],
      {
        cwd: path.join(import.meta.dirname, "..", ".."),
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          POSTGRES_URL: `postgres://u:${secret}@[bad/db`,
          LEAD_IP_HASH_SECRET: "s".repeat(32),
          LEAD_NOTIFY: "disabled",
        },
        stdio: ["ignore", "pipe", "pipe"],
        // Own process group, so the whole pnpm → next tree is stopped after.
        detached: true,
      },
    );
    let output = "";
    server.stdout.on("data", (d) => (output += String(d)));
    server.stderr.on("data", (d) => (output += String(d)));
    try {
      const base = `http://127.0.0.1:${ZBM_MALFORMED_PORT}`;
      await expect
        .poll(async () => (await page.request.get(`${base}/start`, { failOnStatusCode: false }).catch(() => null))?.status() ?? 0, {
          timeout: 30_000,
        })
        .toBe(200);
      for (let i = 0; i < 3; i++) {
        const res = await page.request.post(`${base}/api/lead`, { data: contact(randomUUID()), failOnStatusCode: false });
        expect(res.status()).toBe(503);
        expect(await res.json()).toEqual({ ok: false, error: { code: "not_configured" } });
      }
      await expect.poll(() => output.includes("POSTGRES_URL:unparseable"), { timeout: 5_000 }).toBe(true);
      expect(output).not.toContain(secret);
      expect(output).not.toContain("[bad");
      expect(output).not.toMatch(/TypeError|Invalid URL/);
    } finally {
      if (server.pid) process.kill(-server.pid, "SIGTERM");
    }
  });
});

test.describe("UI after a 409 conflict (AEGIS r2 N5)", () => {
  test("an unconfirmed send, then an edit: the form shows the conflict copy, starts a new id, and the next send is stored", async ({
    page,
  }, testInfo) => {
    await presetConsent(page);
    await page.goto(`${ZBM_BASE_URL}/start?service=websites`, { waitUntil: "domcontentloaded" });
    const name = marker("conflict-ui", testInfo.project.name);
    await fillStart(page, name);

    // 1. The first send reaches the server and is stored, but the browser
    //    never sees the answer (a dropped response): the outcome is unknown.
    let firstId = "";
    await page.route("**/api/lead", async (route) => {
      firstId = route.request().postDataJSON().submission_id;
      await route.fetch(); // stored server-side
      await route.abort("failed");
    });
    await startForm(page).getByRole("button", { name: "Send" }).click();
    await expect(startForm(page).locator('[data-lead-failure="failed"]')).toHaveText(
      "We couldn’t confirm that went through — please try again.",
    );
    await page.unroute("**/api/lead");
    expect(await rowsFor("zbm", firstId)).toHaveLength(1);

    // 2. The visitor edits a field and sends again — same id, new content.
    await startForm(page).getByLabel("Business", { exact: true }).fill("Edited Co");
    const conflict = await sendStart(page);
    expect(conflict.status()).toBe(409);
    expect(conflict.request().postDataJSON().submission_id).toBe(firstId);
    await expect(startForm(page).locator('[data-lead-failure="conflict"]')).toHaveText(
      "We already have an earlier version of this from you. Send again to submit these changes as a new message.",
    );
    await expect(page.locator('[data-lead-result="accepted"]')).toHaveCount(0);

    // 3. Send again: a NEW id, stored as a new lead with the edit.
    const second = await sendStart(page);
    expect(second.status()).toBe(200);
    const secondId = second.request().postDataJSON().submission_id as string;
    expect(secondId).not.toBe(firstId);
    await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Received");
    expect((await rowsFor("zbm", firstId))[0]!.payload.business).toBe("Lead Gate Co");
    expect((await rowsFor("zbm", secondId))[0]!.payload.business).toBe("Edited Co");
    expect(await rowsMentioning("zbm", name)).toHaveLength(2);
  });
});

test.describe("Before hydration (AEGIS r5 N1)", () => {
  test("with JavaScript off, Send stays disabled and says why; nothing is posted, stored or put in the URL", async ({ browser }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(`${ZBM_BASE_URL}/start?service=websites`, { waitUntil: "domcontentloaded" });
      const name = marker("nojs", testInfo.project.name);
      const form = page.locator('form[data-lead-form="start"]');
      await expect(form).toHaveAttribute("method", "post");
      await expect(form).not.toHaveAttribute("data-ready", "true");
      const button = form.getByRole("button", { name: "Loading…" });
      await expect(button).toBeDisabled();
      await expect(form.locator("noscript")).toHaveCount(1);
      // AEGIS r6 O4: busy is the BUTTON's state, described for assistive tech;
      // nothing that holds the explanation is inside a busy region.
      await expect(form).not.toHaveAttribute("aria-busy", /.*/);
      await expect(button).toHaveAttribute("aria-busy", "true");
      await expect(button).toHaveAccessibleDescription("The form is still loading. Send will be available in a moment.");
      expect(await page.locator("[aria-busy] noscript, [aria-busy] [data-lead-stuck]").count()).toBe(0);
      // Playwright disables JS by emulation, so the parser still treats <noscript>
      // as raw text (and `scripting` stays "enabled"): assert the shipped markup.
      expect(await form.locator("noscript").textContent()).toContain(
        "This form needs JavaScript to send. Please enable it and reload the page.",
      );
      const posts: string[] = [];
      page.on("request", (r) => {
        if (r.method() === "POST") posts.push(r.url());
      });
      await form.getByLabel("Name", { exact: true }).fill(name);
      await form.getByLabel("Best way to reach you", { exact: true }).fill("nojs-secret@example.com");
      // Implicit submission (Enter) is blocked by the disabled default button; so is a click.
      await form.getByLabel("Name", { exact: true }).press("Enter");
      await button.click({ force: true });
      await page.waitForTimeout(500);
      expect(posts).toEqual([]);
      expect(page.url()).not.toContain("nojs-secret");
      expect(await form.getByLabel("Name", { exact: true }).inputValue()).toBe(name);
      expect(await rowsMentioning("zbm", name)).toHaveLength(0);
    } finally {
      await context.close();
    }
  });

  // AEGIS r6 O3: scripts that never arrive (failed chunk, blocker, version skew).
  const STUCK: { label: string; url: string; form: string }[] = [
    { label: "ZBM /start", url: `${ZBM_BASE_URL}/start?service=websites`, form: "start" },
    { label: "ZBM assessment", url: `${ZBM_BASE_URL}/revenue-recovery#assessment`, form: "assessment" },
    { label: "ZBC clipper", url: `${ZBC_BASE_URL}/become-a-clipper`, form: "clipper" },
  ];
  for (const c of STUCK) {
    test(`scripts never load, ${c.label}: after ~10 s a CSS-only line says to refresh; no contact claim`, async ({ page }) => {
      await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort("failed"));
      await page.goto(c.url, { waitUntil: "domcontentloaded" });
      const form = page.locator(`form[data-lead-form="${c.form}"]`);
      const stuck = form.locator("[data-lead-stuck]");
      await expect(form.getByRole("button", { name: "Loading…" })).toBeDisabled();
      await expect(stuck).toBeHidden(); // not before the delay
      await expect(stuck).toBeVisible({ timeout: 13_000 });
      await expect(stuck).toHaveText("Still loading? Please refresh the page.");
      expect(await stuck.textContent()).not.toMatch(/@|mailto|call|phone/i);
      await expect(form).not.toHaveAttribute("data-ready", "true");
    });
  }

  test("once hydrated, the fallback line is gone for good and the button is no longer busy", async ({ page }) => {
    await page.goto(`${ZBM_BASE_URL}/contact`, { waitUntil: "domcontentloaded" });
    const form = await formReady(page.locator('form[data-lead-form="contact"]'));
    await expect(form.locator("[data-lead-stuck]")).toHaveCSS("display", "none");
    const send = form.getByRole("button", { name: "Send" });
    await expect(send).toBeEnabled();
    await expect(send).not.toHaveAttribute("aria-busy", /.*/);
    await expect(send).not.toHaveAttribute("aria-describedby", /.*/);
  });

  type FormCase = {
    label: string;
    base: string;
    path: string;
    form: string;
    submit: string;
    server: "zbm" | "zbc";
    fill: (form: Locator, name: string) => Promise<void>;
  };
  const contact = async (form: Locator, name: string, extra: Record<string, string>) => {
    await form.getByLabel("Name", { exact: true }).fill(name);
    for (const [label, value] of Object.entries(extra)) await form.getByLabel(label, { exact: true }).fill(value);
  };
  const answerAll = async (form: Locator, attr: string) => {
    for (const q of await form.locator(`[${attr}]`).all()) await q.getByRole("radio", { name: "Very true", exact: true }).check();
  };
  const CASES: FormCase[] = [
    {
      label: "ZBM /start",
      base: ZBM_BASE_URL,
      path: "/start?service=websites",
      form: "start",
      submit: "Send",
      server: "zbm",
      fill: (f, n) => contact(f, n, { Business: "Slow JS Co", "Best way to reach you": "slow@example.com" }),
    },
    {
      label: "ZBM /contact",
      base: ZBM_BASE_URL,
      path: "/contact",
      form: "contact",
      submit: "Send",
      server: "zbm",
      fill: (f, n) => contact(f, n, { Business: "Slow JS Co", "What are you looking to solve?": "Slow pages.", "Best way to reach you": "slow@example.com" }),
    },
    {
      label: "ZBM assessment",
      base: ZBM_BASE_URL,
      path: "/revenue-recovery#assessment",
      form: "assessment",
      submit: "Get an Assessment",
      server: "zbm",
      fill: async (f, n) => {
        await contact(f, n, { Business: "Slow JS Co", Website: "example.com", "Best way to reach you": "slow@example.com" });
        await answerAll(f, "data-assessment-question");
      },
    },
    {
      label: "ZBM readiness",
      base: ZBM_BASE_URL,
      path: "/search-intelligence#readiness-check",
      form: "readiness",
      submit: "Get Your Readiness Check",
      server: "zbm",
      fill: async (f, n) => {
        await contact(f, n, { Business: "Slow JS Co", Website: "example.com", "Best way to reach you": "slow@example.com" });
        await answerAll(f, "data-readiness-question");
      },
    },
    {
      label: "ZBC campaign",
      base: ZBC_BASE_URL,
      path: "/launch-a-campaign",
      form: "campaign",
      submit: "Launch a Campaign",
      server: "zbc",
      fill: async (f, n) => {
        await contact(f, n, { Organization: "Slow JS Label", "What are you promoting?": "A release.", "Best way to reach you": "slow@example.com" });
        await f.getByLabel("Entertainment / Brands", { exact: true }).selectOption("brands");
      },
    },
    {
      label: "ZBC clipper",
      base: ZBC_BASE_URL,
      path: "/become-a-clipper",
      form: "clipper",
      submit: "Join the clipper list",
      server: "zbc",
      fill: async (f, n) => {
        await contact(f, n, { Email: "slow-clipper@example.com" });
        await f.getByLabel("Primary platform", { exact: true }).selectOption("tiktok");
      },
    },
  ];

  for (const c of CASES) {
    test(`slow JavaScript, ${c.label}: Send before hydration does nothing; after it, the same entries are stored once`, async ({
      page,
    }, testInfo) => {
      // r5's repro: hold every JS chunk so the page is visible and typable but not hydrated.
      let release!: () => void;
      const gate = new Promise<void>((r) => (release = r));
      await page.route(/\/_next\/static\/chunks\/.*\.js/, async (route) => {
        await gate;
        await route.continue();
      });
      const posts: string[] = [];
      page.on("request", (r) => {
        if (r.method() === "POST") posts.push(new URL(r.url()).pathname);
      });
      await page.goto(`${c.base}${c.path}`, { waitUntil: "domcontentloaded" });
      const form = page.locator(`form[data-lead-form="${c.form}"]`);
      const name = marker(`slow-${c.form}`, testInfo.project.name);
      await c.fill(form, name);

      // Before hydration: disabled, says why, and neither Enter nor a press submits.
      await expect(form).not.toHaveAttribute("data-ready", "true");
      const loading = form.getByRole("button", { name: "Loading…" });
      await expect(loading).toBeDisabled();
      await form.getByLabel("Name", { exact: true }).press("Enter");
      await loading.click({ force: true });
      await page.waitForTimeout(300);
      expect(posts, "no native submit").toEqual([]);
      await expect(page.locator("[data-lead-result]")).toHaveCount(0);
      const url = page.url();

      // Hydrate. The visitor's entries survive, and Send now works — once.
      release();
      await formReady(form);
      expect(page.url()).toBe(url);
      expect(await form.getByLabel("Name", { exact: true }).inputValue()).toBe(name);
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().endsWith("/api/lead")),
        form.getByRole("button", { name: c.submit }).click(),
      ]);
      expect(response.status(), await response.text()).toBe(200);
      await expect(page.locator('[data-lead-result="accepted"]')).toContainText("Received");
      expect(posts).toEqual(["/api/lead"]);
      const stored = (await jsonl<Row>(c.server, "rows.jsonl")).filter((r) => JSON.stringify(r.payload).includes(name));
      expect(stored).toHaveLength(1);
      expect(stored[0]!.form).toBe(c.form);
    });
  }
});
