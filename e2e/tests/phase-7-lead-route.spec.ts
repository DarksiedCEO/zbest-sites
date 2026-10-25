import { expect, test, type Page } from "@playwright/test";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
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
  ip_hash: string | null;
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
  const form = startForm(page);
  await form.getByLabel("Name", { exact: true }).fill(name);
  await form.getByLabel("Business", { exact: true }).fill("Lead Gate Co");
  await form.getByLabel("Best way to reach you", { exact: true }).fill("lead-gate@example.com");
}

const sendStart = (page: Page) =>
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
    // This gate server is not behind a trusted proxy, so no client address is
    // believed and none is hashed (AEGIS M4). The HMAC path is unit-tested.
    expect(rows[0]!.ip_hash).toBeNull();
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

    // The real attack, from a real browser on another origin (the ZBC site):
    // a no-cors text/plain POST, and a JSON POST that needs a preflight.
    const name = marker("cross-site", testInfo.project.name);
    await page.goto(`${ZBC_BASE_URL}/`, { waitUntil: "domcontentloaded" });
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
    expect(outcomes).toEqual(["no-cors sent", "json blocked"]);
    expect(await rowsMentioning("zbm", name)).toHaveLength(0);
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
