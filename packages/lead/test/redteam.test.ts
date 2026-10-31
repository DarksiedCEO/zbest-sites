import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveLimiter, resolveTransport } from "../src/config";
import { leadEmail } from "../src/email";
import { fakeStore } from "../src/fake";
import { FORM_TOKEN_HEADER, FORM_TOKEN_MAX_AGE_MS, fakeFormTokenSecret, formTokens } from "../src/form-token";
import { contentHash } from "../src/hash";
import { normalizeIp } from "../src/ip";
import { parsePostgresUrl, productionPg } from "../src/pg-url";
import { handleFormToken, handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import { cleanJson, cleanText, neutralizeCell } from "../src/text";
import { DeliveryError, type LeadRecord } from "../src/types";
import { PII, captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/**
 * Red team 2026-10-30 (scratchpad/audit/redteam-sites.md): RTS-3, RTS-7,
 * RTS-8, RTS-10. Written before the fixes; each case failed on d2fa733.
 */

const NONCE = "gate-nonce-0123456789abcdef";
const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: NONCE,
  ZBEST_LEAD_FAKE_ACK: NONCE,
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
  ...extra,
});
const open = () => memoryLimiter({ limit: 100_000, windowSec: 60 });
const tokens = formTokens(fakeFormTokenSecret(NONCE));
const aged = (ms = 10_000) => tokens.issue("zbm", Date.now() - ms);

const post = (body: unknown, headers: Record<string, string> = {}, token: string | null = aged()) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": PII.ip,
      "user-agent": PII.ua,
      ...(token === null ? {} : { [FORM_TOKEN_HEADER]: token }),
      ...headers,
    },
    body: JSON.stringify(body),
  });
const lead = (fields: Record<string, string> = {}, id = randomUUID()) => ({
  form: "start",
  submission_id: id,
  fields: { name: PII.name, business: PII.business, reach: PII.reach, ...fields },
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("RTS-3 — server-issued form token", () => {
  it("a token is valid between 3 s and 2 h after issue, and only with its signature", () => {
    const t0 = 1_800_000_000_000;
    const token = tokens.issue("zbm", t0);
    expect(tokens.verify("zbm", token, t0 + 2_999)).toEqual({ ok: false, problem: "too_new", retryAfterMs: 1 });
    expect(tokens.verify("zbm", token, t0 + 3_000)).toEqual({ ok: true });
    expect(tokens.verify("zbm", token, t0 + FORM_TOKEN_MAX_AGE_MS)).toEqual({ ok: true });
    // AEGIS F2: up to FORM_TOKEN_SKEW_MS past the maximum is clock skew, not expiry.
    expect(tokens.verify("zbm", token, t0 + FORM_TOKEN_MAX_AGE_MS + 5_000)).toEqual({ ok: true });
    expect(tokens.verify("zbm", token, t0 + FORM_TOKEN_MAX_AGE_MS + 5_001)).toEqual({ ok: false, problem: "expired" });
    expect(tokens.verify("zbm", token, t0 - 60_000)).toEqual({ ok: false, problem: "future" });
    expect(formTokens("a".repeat(32)).verify("zbm", token, t0 + 5_000)).toEqual({ ok: false, problem: "bad_signature" });
    const forgedTime = token.replace(String(t0), String(t0 - 10_000));
    expect(tokens.verify("zbm", forgedTime, t0 + 5_000)).toEqual({ ok: false, problem: "bad_signature" });
    expect(tokens.verify("zbm", null, t0)).toEqual({ ok: false, problem: "missing" });
    expect(tokens.verify("zbm", "v1.x", t0)).toEqual({ ok: false, problem: "malformed" });
  });

  it("GET issues a token (no-store); it holds no client data", async () => {
    const res = await handleFormToken(new Request("http://localhost/api/lead", { headers: { "x-forwarded-for": PII.ip, "user-agent": PII.ua } }), {
      app: "zbm",
      env: fakeEnv(tempOutbox()),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = (await res.json()) as { ok: boolean; token: string };
    expect(body.ok).toBe(true);
    expect(body.token).toMatch(/^v1\.\d{13}\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/);
    expect(body.token).not.toContain(PII.ip);
  });

  it("GET is 503 not_configured when the transport is not configured", async () => {
    const res = await handleFormToken(new Request("http://localhost/api/lead"), { app: "zbm", env: {} });
    expect(res.status).toBe(503);
  });

  it("live transport: LEAD_FORM_SECRET when set, else derived from LEAD_IP_HASH_SECRET; a short LEAD_FORM_SECRET is refused", () => {
    const live = {
      POSTGRES_URL: "postgres://u:p@localhost:5432/db",
      LEAD_IP_HASH_SECRET: "s".repeat(32),
      LEAD_NOTIFY: "disabled",
    };
    const a = resolveTransport(live);
    const b = resolveTransport({ ...live, LEAD_FORM_SECRET: "f".repeat(32) });
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    const token = a.transport.formTokens.issue("zbm", Date.now() - 10_000);
    expect(a.transport.formTokens.verify("zbm", token, Date.now()).ok).toBe(true);
    expect(b.transport.formTokens.verify("zbm", token, Date.now()).ok).toBe(false);
    expect(resolveTransport({ ...live, LEAD_FORM_SECRET: "short" })).toEqual({ ok: false, missing: ["LEAD_FORM_SECRET:min-16-chars"] });
  });

  for (const [label, token] of [
    ["no token", null],
    ["a token older than 2 h", tokens.issue("zbm", Date.now() - FORM_TOKEN_MAX_AGE_MS - 60_000)],
    ["a token from another secret", formTokens("a".repeat(32)).issue("zbm", Date.now() - 10_000)],
  ] as const) {
    it(`POST with ${label}: 403 form_expired, nothing stored or sent`, async () => {
      const dir = tempOutbox();
      const res = await handleLead(post(lead(), {}, token), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: open() } });
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ ok: false, error: { code: "form_expired" } });
      expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
      expect(readJsonl(dir, "emails.jsonl")).toHaveLength(0);
    });
  }

  it("the honeypot still answers like a success without a token (a bot learns nothing)", async () => {
    const dir = tempOutbox();
    const res = await handleLead(post({ ...lead(), company_url: "x" }, {}, null), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: open() } });
    expect(res.status).toBe(200);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });
});

describe("RTS-3 — IPv6 /48 bucket and a global per-app cap", () => {
  it("normalizeIp gives IPv6 a /48 network key; IPv4 has none", () => {
    expect(normalizeIp("2001:db8:aaaa:1::1")).toMatchObject({ key: "v6/64:2001:0db8:aaaa:0001", net: "v6/48:2001:0db8:aaaa" });
    expect(normalizeIp("203.0.113.9")?.net).toBeUndefined();
  });

  it("30 different /64s inside one /48 are limited by the /48 bucket (default 24 per 10 min)", async () => {
    const dir = tempOutbox();
    const env = fakeEnv(dir, { LEAD_RATE_LIMIT: "5/600" });
    const limiters = resolveLimiter({ ...env, LEAD_GLOBAL_LIMIT_PER_MINUTE: "100000" }, captureLogger().logger, "test-48");
    const statuses: number[] = [];
    for (let i = 0; i < 30; i++) {
      const res = await handleLead(post(lead({ problem: `p${i}` }), { "x-forwarded-for": `2001:db8:77:${i.toString(16)}::1` }), { app: "zbm", parse: toyParse, env, logger: captureLogger().logger, limiters });
      statuses.push(res.status);
    }
    expect(statuses.filter((s) => s === 200)).toHaveLength(24);
    expect(statuses.slice(24).every((s) => s === 429)).toBe(true);
  });

  it("the global cap (reworked by AEGIS F1): past LEAD_GLOBAL_LIMIT_PER_MINUTE a minute leads are still stored, their email deferred", async () => {
    const dir = tempOutbox();
    const env = fakeEnv(dir, { LEAD_GLOBAL_LIMIT_PER_MINUTE: "3" });
    const limiters = resolveLimiter(env, captureLogger().logger, "test-global");
    const statuses: number[] = [];
    let last: unknown;
    for (let i = 0; i < 5; i++) {
      const res = await handleLead(post(lead({ problem: `p${i}` }), { "x-forwarded-for": `198.51.100.${i + 1}` }), { app: "zbm", parse: toyParse, env, logger: captureLogger().logger, limiters });
      statuses.push(res.status);
      last = await res.json();
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200]);
    expect(last).toMatchObject({ ok: true });
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(5);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(3);
  });

  it("default global cap is 20 a minute; a malformed setting is a misconfiguration", () => {
    expect(resolveLimiter({}, captureLogger().logger, "d").globalSpec).toEqual({ limit: 20, windowSec: 60 });
    expect(resolveLimiter({ LEAD_GLOBAL_LIMIT_PER_MINUTE: "lots" }, captureLogger().logger, "e").problem).toBe(
      "LEAD_GLOBAL_LIMIT_PER_MINUTE:expected-1-to-100000",
    );
  });
});

describe("RTS-3 — identical submissions within 24 h are one lead, one email", () => {
  it("contentHash ignores case, spacing and Unicode form, not the words", () => {
    const a = contentHash({ form: "start", region: { state: "US-CA" }, payload: { name: "Ada  Lovelace", problem: "Café" } });
    const b = contentHash({ form: "start", region: { state: "US-CA" }, payload: { name: " ada lovelace ", problem: "Café" } });
    const c = contentHash({ form: "start", region: { state: "US-CA" }, payload: { name: "Ada Lovelace", problem: "Tea" } });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("the same normalized content under a new submission_id: 200, no second row, no second email", async () => {
    const dir = tempOutbox();
    const log = captureLogger();
    const opts = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: log.logger, limiters: { perIp: open() } };
    const first = await handleLead(post(lead({ problem: "Need billboards" })), opts);
    const second = await handleLead(post(lead({ problem: "  need   BILLBOARDS " })), opts);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(1);
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
    expect(log.lines.some((l) => l.event === "duplicate_content")).toBe(true);
  });

  it("after 24 h the same content is a new lead again", async () => {
    const dir = tempOutbox();
    const store = fakeStore(dir);
    const base: LeadRecord = {
      submission_id: randomUUID(), app: "zbm", form: "start", payload: { a: 1 }, payload_hash: "h1", content_hash: "same",
      services: [], source: null, service_area: "US-CA", user_agent: null,
    };
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-30T00:00:00Z"));
    expect(await store.insert(base)).toMatchObject({ inserted: true });
    vi.setSystemTime(new Date("2026-10-30T23:59:00Z"));
    expect(await store.insert({ ...base, submission_id: randomUUID() })).toMatchObject({ inserted: false, duplicateOf: "content" });
    vi.setSystemTime(new Date("2026-10-31T00:01:00Z"));
    expect(await store.insert({ ...base, submission_id: randomUUID() })).toMatchObject({ inserted: true });
  });
});

describe("RTS-7 — NUL and lone surrogates", () => {
  it("cleanText strips NUL and unpaired surrogates, keeps pairs, normalizes to NFC", () => {
    expect(cleanText("a\u0000b")).toBe("ab");
    expect(cleanText("x\ud800y\udc00z")).toBe("xyz");
    expect(cleanText("😀")).toBe("😀");
    expect(cleanText("Café")).toBe("Café");
    expect(cleanJson({ "k\u0000": ["\ud800v"], n: 1 })).toEqual({ k: ["v"], n: 1 });
  });

  it("a NUL in a field is stripped before storage: 200 and a clean row", async () => {
    const dir = tempOutbox();
    const res = await handleLead(post(lead({ problem: "a\u0000b \ud800c" })), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: open() } });
    expect(res.status).toBe(200);
    const [row] = readJsonl<LeadRecord>(dir, "rows.jsonl");
    expect(row!.payload.problem).toBe("ab c");
  });

  it("a required field that is only NUL is a 422 field error, not a retry message", async () => {
    const dir = tempOutbox();
    const res = await handleLead(post(lead({ name: "\u0000" })), { app: "zbm", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: { perIp: open() } });
    expect(res.status).toBe(422);
    expect(await res.json()).toMatchObject({ ok: false, error: { code: "validation", fields: { name: expect.any(String) } } });
  });

  it("the fake store refuses what jsonb refuses, as Postgres does (so the e2e gate sees it)", async () => {
    const store = fakeStore(tempOutbox());
    const rec: LeadRecord = {
      submission_id: randomUUID(), app: "zbm", form: "start", payload: { p: "a\u0000b" }, payload_hash: "h", content_hash: "c",
      services: [], source: null, service_area: "US-CA", user_agent: null,
    };
    await expect(store.insert(rec)).rejects.toMatchObject({ code: "store_failed", detail: "22P05" });
    await expect(store.insert({ ...rec, payload: { p: "\ud800" } })).rejects.toMatchObject({ detail: "22P02" });
  });

  it("a store refusal for characters (22P05/22P02/22021) is a 422 validation error, never 503 'try again'", async () => {
    for (const code of ["22P05", "22P02", "22021"]) {
      const res = await handleLead(post(lead()), {
        app: "zbm",
        parse: toyParse,
        env: {},
        logger: captureLogger().logger,
        limiters: { perIp: open() },
        transport: {
          ok: true,
          transport: {
            mode: "live",
            store: { insert: async () => { throw new DeliveryError("store_failed", code); }, setNotifyStatus: async () => {}, markAttempt: async (_a: string, _i: string, h: string) => ({ firstAttemptAt: new Date(), bodyHash: h }), quarantine: async () => {} },
            notifier: null,
            hashIp: () => "h",
            formTokens: tokens,
          },
        },
        policy: { ipSource: { header: "x-forwarded-for", hop: "from-right", hops: 1 }, onVercel: false, allowedOrigins: new Set(), maxBodyBytes: 65536, problems: [] },
      });
      expect(res.status).toBe(422);
      expect(await res.json()).toMatchObject({ ok: false, error: { code: "validation", fields: { form: expect.any(String) } } });
    }
  });
});

describe("RTS-8 — rate-limit expiry on a timer; unverified TLS refused in production", () => {
  it("memory buckets are dropped by a timer after the window, with no further request", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const limiter = memoryLimiter({ limit: 5, windowSec: 600 });
    await limiter.hit("a");
    await limiter.hit("b");
    expect(limiter.size()).toBe(2);
    await vi.advanceTimersByTimeAsync(600_000 + 60_000);
    expect(limiter.size()).toBe(0);
    limiter.stop();
  });

  const remote = "postgres://u:p@db.example.com:5432/leads";
  const live = { LEAD_IP_HASH_SECRET: "s".repeat(32), LEAD_NOTIFY: "disabled", NODE_ENV: "production" };
  it("production refuses sslmode=prefer and allow (may fall back to plaintext)", () => {
    for (const mode of ["prefer", "allow"]) {
      expect(resolveTransport({ ...live, POSTGRES_URL: `${remote}?sslmode=${mode}` })).toEqual({
        ok: false,
        missing: ["POSTGRES_URL:sslmode-unverified-refused-in-production"],
      });
    }
  });

  it("production verifies the certificate: require (and no sslmode) connect with verify-full", () => {
    for (const url of [`${remote}?sslmode=require`, remote, `${remote}?sslmode=verify-full`]) {
      const t = resolveTransport({ ...live, POSTGRES_URL: url });
      expect(t.ok, url).toBe(true);
    }
  });

  it("productionPg upgrades require to verify-full on a remote host; loopback and non-production unchanged", () => {
    const parsed = parsePostgresUrl(`${remote}?sslmode=require`);
    if (!parsed.ok) throw new Error("parse");
    expect(productionPg(parsed.options, true)).toMatchObject({ ok: true, options: { ssl: "verify-full" } });
    expect(productionPg(parsed.options, false)).toMatchObject({ ok: true, options: { ssl: "require" } });
    expect(productionPg({ ...parsed.options, host: "127.0.0.1", ssl: false }, true)).toMatchObject({ ok: true, options: { ssl: false } });
  });

  it("no-verify and rejectUnauthorized stay refused everywhere", () => {
    expect(resolveTransport({ ...live, POSTGRES_URL: `${remote}?sslmode=no-verify` })).toEqual({ ok: false, missing: ["POSTGRES_URL:bad-sslmode"] });
    expect(resolveTransport({ ...live, POSTGRES_URL: `${remote}?rejectUnauthorized=false` })).toEqual({
      ok: false,
      missing: ["POSTGRES_URL:unknown-param-rejectUnauthorized"],
    });
  });
});

describe("RTS-10 — formulas and bidi controls in the founder email", () => {
  it("neutralizeCell prefixes = + - @ TAB CR with ' and strips bidi controls", () => {
    for (const s of ["=HYPERLINK(\"x\")", "+cmd|' /C calc'!A0", "-2+3", "@SUM(A1)", "\tx", "\rx"]) expect(neutralizeCell(s)).toBe(`'${s}`);
    expect(neutralizeCell("abc‮gpj.exe")).toBe("abcgpj.exe");
    expect(neutralizeCell("‮=1")).toBe("'=1");
    expect(neutralizeCell("plain")).toBe("plain");
  });

  it("the email quotes every value line neutralized", () => {
    const email = leadEmail(
      {
        submission_id: randomUUID(), app: "zbm", form: "start", payload_hash: "h", content_hash: "c", services: [], source: null,
        service_area: "US-CA", user_agent: null,
        payload: { name: "=HYPERLINK(\"http://evil.test\")", problem: "line one\n@SUM(A1)\nfile‮txt.exe" },
      },
      new Date("2026-10-30T00:00:00Z"),
    );
    expect(email.text).toContain("> name: '=HYPERLINK(\"http://evil.test\")");
    expect(email.text).toContain("> '@SUM(A1)");
    expect(email.text).toContain("> filetxt.exe");
    expect(email.text).not.toMatch(/[‪-‮⁦-⁩]/);
  });
});
