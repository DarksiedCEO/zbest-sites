import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTransport } from "../src/config";
import { fakeStore } from "../src/fake";
import { handleNotifyRetry, NOTIFY_PENDING_GRACE_MS, notifyBackoffMs } from "../src/notify-retry";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import { purgeHealth } from "../src/retention";
import { DeliveryError, type LeadNotifier, type LeadRecord } from "../src/types";
import { captureLogger, readJsonl, request, tempOutbox, TEST_NONCE, toyParse } from "./helpers";

/**
 * Chaos red team 2026-10-30 (scratchpad/audit/redteam-chaos.md) CH-8: a lead
 * whose founder email failed, or whose request died between the insert and
 * the email, must still reach the founder. Written before the fix.
 */

const open = () => ({ perIp: memoryLimiter({ limit: 100_000, windowSec: 60 }) });
const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: TEST_NONCE,
  ZBEST_LEAD_FAKE_ACK: TEST_NONCE,
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
  CRON_SECRET: "c".repeat(32),
  ...extra,
});
const body = (id: string) => ({ form: "start", submission_id: id, fields: { name: "Ada", business: "B", reach: "ada@example.com", details: id } });
const failing: LeadNotifier = {
  send: async () => {
    throw new DeliveryError("notify_unreachable");
  },
};
/** The fake transport, with its notifier swapped for one that fails. */
function brokenTransport(dir: string) {
  const t = resolveTransport(fakeEnv(dir));
  if (!t.ok) throw new Error("fake transport");
  return { ok: true as const, transport: { ...t.transport, notifier: failing } };
}
const cron = (secret = "c".repeat(32)) =>
  new Request("https://www.zbestmedia.com/api/cron/retry-notify", { headers: { authorization: `Bearer ${secret}` } });

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CH-8 — a resubmit of a stored but un-emailed lead sends the email", () => {
  it("first send fails (row 'failed'); the visitor's retry of the same submission emails it and marks it sent", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const first = await handleLead(request(body(id)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), transport: brokenTransport(dir), logger: captureLogger().logger, limiters: open() });
    expect(first.status).toBe(200);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
    expect(readJsonl(dir, "notify.jsonl").at(-1)).toMatchObject({ submission_id: id, notify_status: "failed" });

    const retry = await handleLead(request(body(id)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: open() });
    expect(retry.status).toBe(200);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
    expect(readJsonl(dir, "notify.jsonl").at(-1)).toMatchObject({ submission_id: id, notify_status: "sent" });
  });

  it("a duplicate of a lead already emailed sends nothing more", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: open() };
    await handleLead(request(body(id)), o);
    await handleLead(request(body(id)), o);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
  });

  it("a 'pending' row (request died after the insert) is emailed on resubmit only once it is older than the grace period", async () => {
    const dir = tempOutbox();
    const store = fakeStore(dir);
    const id = randomUUID();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
    const rec: LeadRecord = {
      submission_id: id, app: "zbm", form: "start", payload: { name: "Ada", business: "B", reach: "ada@example.com", details: id },
      payload_hash: "", content_hash: "", services: [], source: null, service_area: "US-CA", user_agent: null,
    };
    // Simulate the crash: the row exists as pending, no email went out.
    const t = resolveTransport(fakeEnv(dir));
    if (!t.ok) throw new Error("fake");
    const parsed = toyParse(body(id));
    if (parsed.kind !== "lead") throw new Error("parse");
    const { payloadHash, contentHash } = await import("../src/hash");
    await store.insert({
      ...rec,
      payload: parsed.payload,
      payload_hash: payloadHash({ form: parsed.form, payload: parsed.payload, region: parsed.region }),
      content_hash: contentHash({ form: parsed.form, payload: parsed.payload, region: parsed.region }),
    });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: open() };
    // Within the grace period the first request may still be sending: nothing more.
    await handleLead(request(body(id)), o);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
    vi.setSystemTime(new Date(Date.parse("2026-10-30T12:00:00Z") + NOTIFY_PENDING_GRACE_MS + 1_000));
    await handleLead(request(body(id)), o);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
    expect(readJsonl(dir, "notify.jsonl").at(-1)).toMatchObject({ submission_id: id, notify_status: "sent" });
  });
});

describe("CH-8 — the retry cron", () => {
  it("refuses without CRON_SECRET (503) and without the bearer (401)", async () => {
    const dir = tempOutbox();
    expect((await handleNotifyRetry(cron(), { app: "zbm", env: { ...fakeEnv(dir), CRON_SECRET: "" } })).status).toBe(503);
    expect((await handleNotifyRetry(cron("x".repeat(32)), { app: "zbm", env: fakeEnv(dir) })).status).toBe(401);
  });

  it("re-sends failed rows with the same idempotency key, marks them sent, and leaves sent rows alone", async () => {
    const dir = tempOutbox();
    const ids = [randomUUID(), randomUUID()];
    for (const id of ids) {
      await handleLead(request(body(id)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), transport: brokenTransport(dir), logger: captureLogger().logger, limiters: open() });
    }
    const sentId = randomUUID();
    await handleLead(request(body(sentId)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: open() });
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);

    const res = await handleNotifyRetry(cron(), { app: "zbm", env: fakeEnv(dir), logger: captureLogger().logger });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, sent: 2, failed: 0, digest: 0 });
    const emails = readJsonl<{ idempotency_key: string }>(dir, "emails.jsonl");
    expect(emails.map((e) => e.idempotency_key).sort()).toEqual([...ids, sentId].map((i) => `lead-zbm-${i}`).sort());
    // A second run finds nothing to do.
    expect(await (await handleNotifyRetry(cron(), { app: "zbm", env: fakeEnv(dir), logger: captureLogger().logger })).json()).toEqual({ ok: true, sent: 0, failed: 0, digest: 0 });
  });

  it("a failure is recorded with backoff: the next run inside the backoff does not retry it", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    await handleLead(request(body(id)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), transport: brokenTransport(dir), logger: captureLogger().logger, limiters: open() });
    const broken = brokenTransport(dir);
    const r1 = await handleNotifyRetry(cron(), { app: "zbm", env: fakeEnv(dir), transport: broken, logger: captureLogger().logger });
    expect(await r1.json()).toEqual({ ok: true, sent: 0, failed: 1, digest: 0 });
    const r2 = await handleNotifyRetry(cron(), { app: "zbm", env: fakeEnv(dir), logger: captureLogger().logger });
    expect(await r2.json()).toEqual({ ok: true, sent: 0, failed: 0, digest: 0 });
    expect(notifyBackoffMs(1)).toBe(15 * 60_000);
    expect(notifyBackoffMs(3)).toBe(60 * 60_000);
    expect(notifyBackoffMs(20)).toBe(24 * 3_600_000);
  });

  it("does nothing when notifications are disabled on purpose", async () => {
    const dir = tempOutbox();
    const res = await handleNotifyRetry(cron(), { app: "zbm", env: fakeEnv(dir, { LEAD_NOTIFY: "disabled" }), logger: captureLogger().logger });
    expect(await res.json()).toEqual({ ok: true, sent: 0, failed: 0, digest: 0, notify: "disabled" });
  });
});

describe("CH-8 — /api/health reports unsent notifications", () => {
  it("degraded 'notify_backlog' when an un-emailed lead is older than LEAD_NOTIFY_ALERT_MINUTES", async () => {
    const env = { CRON_SECRET: "c".repeat(32) };
    const now = new Date("2026-10-30T12:00:00Z");
    const ledger = (unsent: number) => ({ lastSuccess: async () => new Date(now.getTime() - 3_600_000), unsentOlderThan: async () => unsent });
    expect(await purgeHealth({ app: "zbm", env, ledger: ledger(0), now: () => now, logger: captureLogger().logger })).toMatchObject({ status: "ok" });
    expect(await purgeHealth({ app: "zbm", env, ledger: ledger(2), now: () => now, logger: captureLogger().logger })).toMatchObject({ status: "notify_backlog" });
  });
});
