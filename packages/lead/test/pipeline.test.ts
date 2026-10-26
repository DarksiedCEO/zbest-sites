import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTransport, type RequestPolicy, type TransportConfig } from "../src/config";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import { DeliveryError, type LeadNotifier, type LeadStore, type RateLimiter } from "../src/types";
import { PII, captureLogger, readJsonl, request, tempOutbox, toyParse } from "./helpers";

const open = () => memoryLimiter({ limit: 1000, windowSec: 60 });
const both = (l: RateLimiter) => ({ perIp: l });
const TRUSTED: RequestPolicy = { ipSource: { header: "x-forwarded-for", hop: "last" }, onVercel: false, allowedOrigins: new Set(), maxBodyBytes: 65536, problems: [] };
const NONCE = "gate-nonce-0123456789abcdef";
const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: NONCE,
  ZBEST_LEAD_FAKE_ACK: NONCE,
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
  ...extra,
});
const valid = (id = randomUUID(), extra: Record<string, string> = {}) => ({
  form: "start",
  submission_id: id,
  fields: { name: PII.name, business: PII.business, reach: PII.reach, services: "out-of-home,tv-streaming", source: "bb-i405-oct", ...extra },
});

afterEach(() => vi.restoreAllMocks());

describe("success through the fake transport", () => {
  it("stores one row, sends one email, records notify_status, carries source and services", async () => {
    const dir = tempOutbox();
    const log = captureLogger();
    const id = randomUUID();
    const res = await handleLead(request(valid(id)), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: log.logger, limiters: both(open()) });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, submission_id: id });
    expect(res.headers.get("x-zbest-lead-transport")).toBe("fake");
    expect(res.headers.get("cache-control")).toBe("no-store");

    const rows = readJsonl(dir, "rows.jsonl");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      submission_id: id,
      app: "zbm",
      form: "start",
      services: ["out-of-home", "tv-streaming"],
      source: "bb-i405-oct",
      user_agent: PII.ua,
    });
    // ip_hash is an HMAC, never the IP.
    expect(rows[0]!.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(rows)).not.toContain(PII.ip);

    const emails = readJsonl(dir, "emails.jsonl");
    expect(emails).toHaveLength(1);
    expect(emails[0]).toMatchObject({ idempotency_key: `lead-zbm-${id}`, replyTo: PII.reach });
    expect(String(emails[0]!.subject)).toContain("src:bb-i405-oct");
    expect(String(emails[0]!.text)).toContain(PII.name);
    expect(readJsonl(dir, "notify.jsonl")).toEqual([{ app: "zbm", submission_id: id, notify_status: "sent" }]);
  });

  it("a double submit with the same submission_id is one lead and one email", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const opts = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) };
    const [a, b] = await Promise.all([handleLead(request(valid(id)), opts), handleLead(request(valid(id)), opts)]);
    const c = await handleLead(request(valid(id)), opts);
    for (const r of [a, b, c]) {
      expect(r.status).toBe(200);
      expect(await r.json()).toEqual({ ok: true, submission_id: id });
    }
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(1);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
  });

  it("LEAD_NOTIFY=disabled stores the row and records 'disabled', sends nothing", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const res = await handleLead(request(valid(id)), {
      app: "zbc",
      parse: toyParse,
      env: fakeEnv(dir, { LEAD_NOTIFY: "disabled" }),
      logger: captureLogger().logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(200);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(1);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
    expect(readJsonl(dir, "notify.jsonl")).toEqual([{ app: "zbc", submission_id: id, notify_status: "disabled" }]);
  });
});

describe("misconfiguration fails closed", () => {
  it("no env at all: 503 not_configured, nothing stored, names (not values) logged", async () => {
    const log = captureLogger();
    const res = await handleLead(request(valid()), { app: "zbm", parse: toyParse, env: {}, logger: log.logger, limiters: both(open()) });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: { code: "not_configured" } });
    const line = log.lines.find((l) => l.event === "not_configured");
    expect(line?.fields?.missing).toContain("POSTGRES_URL");
  });

  it("store configured but Resend missing (and not explicitly disabled): 503, not a quiet success", async () => {
    const env = { POSTGRES_URL: "postgres://u:p@127.0.0.1:1/db", LEAD_IP_HASH_SECRET: "x".repeat(32) };
    const log = captureLogger();
    const res = await handleLead(request(valid()), { app: "zbm", parse: toyParse, env, logger: log.logger, limiters: both(open()) });
    expect(res.status).toBe(503);
    expect(log.text()).toContain("RESEND_API_KEY");
    expect(log.text()).not.toContain("u:p@");
  });

  it("the fake transport refuses to run on Vercel", async () => {
    const dir = tempOutbox();
    const res = await handleLead(request(valid()), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(dir, { VERCEL: "1" }),
      logger: captureLogger().logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });

  it("a malformed LEAD_RATE_LIMIT is a misconfiguration", async () => {
    const dir = tempOutbox();
    const res = await handleLead(request(valid()), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(dir, { LEAD_RATE_LIMIT: "lots" }),
      logger: captureLogger().logger,
    });
    expect(res.status).toBe(503);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });
});

describe("validation and abuse", () => {
  const opts = (dir: string) => ({ app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) });

  it("unparseable JSON is 400 bad_request", async () => {
    const res = await handleLead(request("{not json"), opts(tempOutbox()));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: { code: "bad_request" } });
  });

  it("the app's field errors pass through as 422 and nothing is stored", async () => {
    const dir = tempOutbox();
    const res = await handleLead(request(valid(randomUUID(), { name: "" })), opts(dir));
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: { code: "validation", fields: { name: "Enter your name." } } });
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });

  it("a filled honeypot looks like success and stores and sends nothing", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const res = await handleLead(request({ ...valid(id), company_url: "http://spam.example" }), opts(dir));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, submission_id: id });
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
  });

  it("rate limit: the N+1th request from one IP is 429 with Retry-After; another IP is unaffected", async () => {
    const dir = tempOutbox();
    const limiter = memoryLimiter({ limit: 3, windowSec: 600 });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(limiter) };
    for (let i = 0; i < 3; i++) expect((await handleLead(request(valid()), o)).status).toBe(200);
    const blocked = await handleLead(request(valid()), o);
    expect(blocked.status).toBe(429);
    const body = (await blocked.json()) as { error: { code: string; retry_after_s: number } };
    expect(body.error.code).toBe("rate_limited");
    expect(body.error.retry_after_s).toBeGreaterThan(0);
    expect(Number(blocked.headers.get("retry-after"))).toBe(body.error.retry_after_s);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(3);
    const other = await handleLead(request(valid(), { "x-forwarded-for": "198.51.100.9" }), o);
    expect(other.status).toBe(200);
  });

  it("rate limits apply per app", async () => {
    const limiter = memoryLimiter({ limit: 1, windowSec: 600 });
    const base = { parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(limiter) };
    expect((await handleLead(request(valid()), { ...base, app: "zbm" })).status).toBe(200);
    expect((await handleLead(request(valid()), { ...base, app: "zbc" })).status).toBe(200);
    expect((await handleLead(request(valid()), { ...base, app: "zbm" })).status).toBe(429);
  });
});

describe("delivery failures (Brief §6.2 failure mode)", () => {
  const transportWith = (store: LeadStore, notifier: LeadNotifier | null): TransportConfig => ({
    ok: true,
    transport: { mode: "live", store, notifier, hashIp: () => "h" },
  });

  it("store failure: 503 unavailable, no email, never a success", async () => {
    const send = vi.fn();
    const store: LeadStore = {
      insert: async () => {
        throw new DeliveryError("store_failed", "08006");
      },
      setNotifyStatus: async () => {},
    };
    const log = captureLogger();
    const res = await handleLead(request(valid()), {
      app: "zbm",
      parse: toyParse,
      policy: TRUSTED,
      transport: transportWith(store, { send }),
      logger: log.logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: { code: "unavailable" } });
    expect(send).not.toHaveBeenCalled();
    expect(log.lines.find((l) => l.event === "store_failed")?.fields?.sqlstate).toBe("08006");
  });

  it("email failure after the row is written: visitor sees success, row marked failed, failure logged", async () => {
    const statuses: string[] = [];
    const store: LeadStore = { insert: async () => ({ inserted: true as const }), setNotifyStatus: async (_app, _id, s) => void statuses.push(s) };
    const notifier: LeadNotifier = {
      send: async () => {
        throw new DeliveryError("notify_rejected", 403);
      },
    };
    const log = captureLogger();
    const id = randomUUID();
    const res = await handleLead(request(valid(id)), {
      app: "zbm",
      parse: toyParse,
      policy: TRUSTED,
      transport: transportWith(store, notifier),
      logger: log.logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, submission_id: id });
    expect(statuses).toEqual(["failed"]);
    expect(log.lines.find((l) => l.event === "notify_failed")?.fields).toMatchObject({ code: "notify_rejected", status: 403 });
  });
});

describe("no PII in logs", () => {
  it("across success, duplicate, honeypot, validation, misconfig and failures, no visitor data is logged", async () => {
    const log = captureLogger();
    const spies = (["info", "warn", "error", "log"] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    const dir = tempOutbox();
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: log.logger, limiters: both(open()) };
    const id = randomUUID();
    await handleLead(request(valid(id)), o);
    await handleLead(request(valid(id)), o);
    await handleLead(request({ ...valid(), company_url: "x" }), o);
    await handleLead(request(valid(randomUUID(), { name: "" })), o);
    await handleLead(request(valid()), { ...o, env: {} });
    // And the real console logger, used when none is injected:
    await handleLead(request(valid()), { app: "zbm", parse: toyParse, env: fakeEnv(dir), limiters: both(open()) });

    const consoleText = JSON.stringify(spies.flatMap((s) => s.mock.calls));
    for (const text of [log.text(), consoleText]) {
      for (const value of [PII.name, PII.business, PII.reach, PII.ip, PII.ua]) expect(text).not.toContain(value);
    }
    expect(log.lines.map((l) => l.event)).toEqual(
      expect.arrayContaining(["stored", "duplicate", "honeypot", "not_configured"]),
    );
  });
});

describe("resolveTransport", () => {
  it("live config with everything set resolves; notify list must be emails", () => {
    const base = {
      POSTGRES_URL: "postgres://u:p@127.0.0.1:5432/db",
      LEAD_IP_HASH_SECRET: "s".repeat(32),
      RESEND_API_KEY: "re_test",
      LEAD_NOTIFY_FROM: "Leads <leads@example.com>",
      LEAD_NOTIFY_TO: "a@example.com, b@example.com",
    };
    const ok = resolveTransport(base);
    expect(ok.ok && ok.transport.mode).toBe("live");
    expect(ok.ok && ok.transport.notifier).not.toBeNull();
    const bad = resolveTransport({ ...base, LEAD_NOTIFY_TO: "not-an-email" });
    expect(bad.ok).toBe(false);
    const badNotify = resolveTransport({ ...base, LEAD_NOTIFY: "maybe" });
    expect(badNotify.ok).toBe(false);
    const short = resolveTransport({ ...base, LEAD_IP_HASH_SECRET: "short" });
    expect(!short.ok && short.missing.join()).toContain("LEAD_IP_HASH_SECRET");
    const unknown = resolveTransport({ ...base, ZBEST_LEAD_TRANSPORT: "memory" });
    expect(unknown.ok).toBe(false);
  });

  it("store-only is allowed only by explicit LEAD_NOTIFY=disabled", () => {
    const store = { POSTGRES_URL: "postgres://u:p@127.0.0.1:5432/db", LEAD_IP_HASH_SECRET: "s".repeat(32) };
    expect(resolveTransport(store).ok).toBe(false);
    const disabled = resolveTransport({ ...store, LEAD_NOTIFY: "disabled" });
    expect(disabled.ok && disabled.transport.notifier).toBeNull();
  });
});
