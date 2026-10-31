import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveLimiter, resolveTransport } from "../src/config";
import { FORM_TOKEN_HEADER, fakeFormTokenSecret, formTokens } from "../src/form-token";
import { handleNotifyRetry } from "../src/notify-retry";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import { purgeHealth } from "../src/retention";
import { DeliveryError, type LeadNotifier } from "../src/types";
import { PII, TEST_NONCE, captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/**
 * AEGIS review of 6c6b720 (scratchpad/night/aegis-site-redteam-fixes.md):
 * F1 global cap failure mode, F2 token binding and clock skew, F3 content
 * duplicate after a failed email, F4 schema check in /api/health.
 * Written before the fixes.
 */

const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: TEST_NONCE,
  ZBEST_LEAD_FAKE_ACK: TEST_NONCE,
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
  CRON_SECRET: "c".repeat(32),
  ...extra,
});
const tokens = formTokens(fakeFormTokenSecret(TEST_NONCE));
const post = (fields: Record<string, string>, ip = PII.ip, token: string = tokens.issue("zbm", Date.now() - 10_000), id = randomUUID()) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip, "user-agent": PII.ua, [FORM_TOKEN_HEADER]: token },
    body: JSON.stringify({ form: "start", submission_id: id, fields: { name: PII.name, business: PII.business, reach: PII.reach, ...fields } }),
  });
const cron = () => new Request("https://www.zbestmedia.com/api/cron/retry-notify", { headers: { authorization: `Bearer ${"c".repeat(32)}` } });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("F1 — past the global cap a lead is STORED and its email deferred to one digest", () => {
  it("cap 3: five leads from five sources are all stored (200); three emailed, two deferred; the trip is an error-level alert", async () => {
    const dir = tempOutbox();
    const env = fakeEnv(dir, { LEAD_GLOBAL_LIMIT_PER_MINUTE: "3" });
    const limiters = resolveLimiter(env, captureLogger().logger, "f1-a");
    const log = captureLogger();
    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) {
      statuses.push((await handleLead(post({ problem: `p${i}` }, `198.51.100.${i + 1}`), { app: "zbm", parse: toyParse, env, logger: log.logger, limiters })).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200]);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(5);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(3);
    expect(readJsonl<{ notify_status: string }>(dir, "notify.jsonl").filter((n) => n.notify_status === "deferred")).toHaveLength(2);
    expect(log.lines.filter((l) => l.level === "error" && l.event === "global_cap_tripped")).toHaveLength(2);

    // The cron sends ONE digest for both deferred leads, then marks them sent.
    const res = await handleNotifyRetry(cron(), { app: "zbm", env, logger: captureLogger().logger });
    expect(await res.json()).toMatchObject({ ok: true, digest: 2 });
    const emails = readJsonl<{ subject: string; idempotency_key: string; text: string }>(dir, "emails.jsonl");
    expect(emails).toHaveLength(4);
    const digest = emails[3]!;
    expect(digest.subject).toContain("2 leads");
    expect(digest.idempotency_key).toMatch(/^digest-zbm-/);
    expect(digest.text).toContain("p3");
    expect(digest.text).toContain("p4");
    expect(readJsonl<{ notify_status: string }>(dir, "notify.jsonl").filter((n) => n.notify_status === "sent")).toHaveLength(5);
    // Nothing left to digest.
    expect(await (await handleNotifyRetry(cron(), { app: "zbm", env, logger: captureLogger().logger })).json()).toMatchObject({ digest: 0 });
  });

  it("exact duplicates do not consume the cap", async () => {
    const dir = tempOutbox();
    const env = fakeEnv(dir, { LEAD_GLOBAL_LIMIT_PER_MINUTE: "2" });
    const limiters = resolveLimiter(env, captureLogger().logger, "f1-b");
    const o = { app: "zbm" as const, parse: toyParse, env, logger: captureLogger().logger, limiters };
    await handleLead(post({ problem: "same" }, "198.51.100.1"), o);
    for (let i = 0; i < 4; i++) expect((await handleLead(post({ problem: "same" }, `198.51.100.${i + 2}`), o)).status).toBe(200);
    await handleLead(post({ problem: "other" }, "198.51.100.9"), o);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(2);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(2);
    expect(readJsonl<{ notify_status: string }>(dir, "notify.jsonl").filter((n) => n.notify_status === "deferred")).toHaveLength(0);
  });

  it("a hard storage ceiling (LEAD_STORE_CEILING_PER_HOUR) answers 503 busy and stores nothing past it", async () => {
    const dir = tempOutbox();
    const env = fakeEnv(dir, { LEAD_STORE_CEILING_PER_HOUR: "4" });
    const limiters = resolveLimiter(env, captureLogger().logger, "f1-c");
    const statuses: number[] = [];
    let last: unknown;
    for (let i = 0; i < 5; i++) {
      const res = await handleLead(post({ problem: `q${i}` }, `198.51.100.${i + 1}`), { app: "zbm", parse: toyParse, env, logger: captureLogger().logger, limiters });
      statuses.push(res.status);
      last = await res.json();
    }
    expect(statuses).toEqual([200, 200, 200, 200, 503]);
    expect(last).toMatchObject({ ok: false, error: { code: "busy" } });
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(4);
    expect(resolveLimiter({}, captureLogger().logger, "f1-d").ceilingSpec).toEqual({ limit: 500, windowSec: 3600 });
  });
});

describe("F2 — the token is bound to the site and tolerates small clock skew", () => {
  it("a ZBM token does not verify for ZBC", () => {
    const t = tokens.issue("zbm", 1_800_000_000_000);
    expect(tokens.verify("zbm", t, 1_800_000_010_000)).toEqual({ ok: true });
    expect(tokens.verify("zbc", t, 1_800_000_010_000)).toMatchObject({ ok: false, problem: "bad_signature" });
  });

  it("too new (or from an instance a few seconds ahead): 425 form_too_fast with a retry time, not 'expired'", async () => {
    const dir = tempOutbox();
    for (const ageMs of [1_000, -4_000]) {
      const res = await handleLead(post({ problem: `skew ${ageMs}` }, PII.ip, tokens.issue("zbm", Date.now() - ageMs)), {
        app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: memoryLimiter({ limit: 1000, windowSec: 60 }) },
      });
      expect(res.status).toBe(425);
      const body = (await res.json()) as { error: { code: string; retry_after_s: number } };
      expect(body.error.code).toBe("form_too_fast");
      expect(body.error.retry_after_s).toBeGreaterThanOrEqual(1);
      expect(body.error.retry_after_s).toBeLessThanOrEqual(8);
    }
    // Far in the future is not skew: refused as invalid.
    const far = await handleLead(post({ problem: "far" }, PII.ip, tokens.issue("zbm", Date.now() + 60_000)), {
      app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: memoryLimiter({ limit: 1000, windowSec: 60 }) },
    });
    expect(far.status).toBe(403);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });
});

describe("F3 — a content duplicate of a lead whose email failed sends that email", () => {
  it("first copy's email fails; the same words under a new id email the stored lead and mark it sent", async () => {
    const dir = tempOutbox();
    const t = resolveTransport(fakeEnv(dir));
    if (!t.ok) throw new Error("fake");
    const failing: LeadNotifier = { send: async () => { throw new DeliveryError("notify_unreachable"); } };
    const firstId = randomUUID();
    await handleLead(post({ problem: "Billboards please" }, PII.ip, undefined, firstId), {
      app: "zbm", parse: toyParse, env: fakeEnv(dir), transport: { ok: true, transport: { ...t.transport, notifier: failing } }, logger: captureLogger().logger,
      limiters: { perIp: memoryLimiter({ limit: 1000, windowSec: 60 }) },
    });
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
    const res = await handleLead(post({ problem: "billboards  PLEASE" }), {
      app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: memoryLimiter({ limit: 1000, windowSec: 60 }) },
    });
    expect(res.status).toBe(200);
    const emails = readJsonl<{ idempotency_key: string }>(dir, "emails.jsonl");
    expect(emails.map((e) => e.idempotency_key)).toEqual([`lead-zbm-${firstId}`]);
    expect(readJsonl(dir, "notify.jsonl").at(-1)).toMatchObject({ submission_id: firstId, notify_status: "sent" });
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(1);
  });
});

describe("F4 — /api/health checks the schema the app writes", () => {
  it("missing 006/007 columns: degraded 'schema_outdated'", async () => {
    const now = new Date("2026-10-30T12:00:00Z");
    const ledger = (missing: string[]) => ({
      lastSuccess: async () => new Date(now.getTime() - 3_600_000),
      unsentOlderThan: async () => 0,
      missingColumns: async () => missing,
    });
    const env = { CRON_SECRET: "c".repeat(32) };
    expect(await purgeHealth({ app: "zbm", env, ledger: ledger([]), now: () => now, logger: captureLogger().logger })).toMatchObject({ status: "ok" });
    expect(await purgeHealth({ app: "zbm", env, ledger: ledger(["content_hash"]), now: () => now, logger: captureLogger().logger })).toMatchObject({
      status: "schema_outdated",
    });
  });
});
