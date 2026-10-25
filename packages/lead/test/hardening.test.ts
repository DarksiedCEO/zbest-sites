import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolvePolicy, resolveTransport, type RequestPolicy } from "../src/config";
import { leadEmail } from "../src/email";
import { clientIp } from "../src/ip";
import { parsePostgresUrl } from "../src/pg-url";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import type { RateLimiter } from "../src/types";
import { PII, captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/**
 * Regression tests for the AEGIS review of lead-route-v1@55d3437
 * (H1, M1–M4, L1–L8). Each block names the finding it pins.
 */

const NONCE = "gate-nonce-0123456789abcdef";
const open = () => memoryLimiter({ limit: 1000, windowSec: 60 });
const both = (l: RateLimiter) => ({ perIp: l, flood: l });
const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: NONCE,
  ZBEST_LEAD_FAKE_ACK: NONCE,
  ...extra,
});
const body = (id = randomUUID(), fields: Record<string, string> = {}) =>
  JSON.stringify({ form: "start", submission_id: id, fields: { name: PII.name, business: "B", reach: PII.reach, ...fields } });
const req = (payload: string | ReadableStream, headers: Record<string, string> = {}) =>
  new Request("http://www.zbestmedia.com/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", host: "www.zbestmedia.com", ...headers },
    body: payload,
    // Required by undici for a stream body.
    ...(typeof payload === "string" ? {} : { duplex: "half" }),
  } as RequestInit);

afterEach(() => vi.restoreAllMocks());

describe("H1 — vendor connection strings", () => {
  const SECRET = "npg_S3cr3tPw";
  const cases: [string, string, { host: string; port: number; database: string; username: string; ssl: string | false }][] = [
    [
      "Neon pooled (Vercel Marketplace POSTGRES_URL)",
      `postgresql://neondb_owner:${SECRET}@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
      { host: "ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech", port: 5432, database: "neondb", username: "neondb_owner", ssl: "require" },
    ],
    [
      "Neon direct (POSTGRES_URL_NON_POOLING)",
      `postgres://neondb_owner:${SECRET}@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require`,
      { host: "ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech", port: 5432, database: "neondb", username: "neondb_owner", ssl: "require" },
    ],
    [
      "Supabase transaction pooler (no sslmode → TLS by default)",
      `postgresql://postgres.abcdefghijklmnop:${SECRET}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
      { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, database: "postgres", username: "postgres.abcdefghijklmnop", ssl: "require" },
    ],
    [
      "Supabase pooler with the Prisma pgbouncer hint",
      `postgresql://postgres.abcdefghijklmnop:${SECRET}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=15`,
      { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, database: "postgres", username: "postgres.abcdefghijklmnop", ssl: "require" },
    ],
    [
      "Supabase direct",
      `postgresql://postgres:${SECRET}@db.abcdefghijklmnop.supabase.co:5432/postgres`,
      { host: "db.abcdefghijklmnop.supabase.co", port: 5432, database: "postgres", username: "postgres", ssl: "require" },
    ],
  ];
  for (const [label, url, expected] of cases) {
    it(`parses ${label}`, () => {
      const parsed = parsePostgresUrl(url);
      expect(parsed.ok, label).toBe(true);
      if (parsed.ok) {
        expect(parsed.options).toMatchObject({ ...expected, password: SECRET });
      }
    });
  }

  it("decodes a percent-encoded password; local hosts default to no TLS", () => {
    const parsed = parsePostgresUrl("postgres://u:p%40ss%3Aw%2Frd%25@localhost/db");
    expect(parsed).toEqual({
      ok: true,
      options: { host: "localhost", port: 5432, database: "db", username: "u", password: "p@ss:w/rd%", ssl: false },
    });
  });

  it("refuses unknown parameters, naming the key and never the value", () => {
    const cases: [string, string][] = [
      ["postgres://u:pw@h.example/db?options=-c%20search_path%3Devil", "unknown-param-options"],
      ["postgres://u:pw@h.example/db?application_name=x", "unknown-param-application_name"],
      ["postgres://u:pw@h.example/db?sslmode=sometimes", "bad-sslmode"],
      ["postgres://u:pw@h.example/db?channel_binding=always", "bad-channel_binding"],
      ["postgres://u:pw@h.example/", "no-database"],
      ["postgres://:pw@h.example/db", "no-user"],
      ["mysql://u:pw@h.example/db", "not-a-postgres-url"],
    ];
    for (const [url, reason] of cases) expect(parsePostgresUrl(url), url).toEqual({ ok: false, reason });
  });
});

describe("M1 — a malformed URL never crashes and never logs", () => {
  const SECRET = "SuperSecretPw";
  const malformed = [
    `postgres://u:${SECRET}@[bad/db`,
    `postgres://u:${SECRET}%ZZ@host.example/db`,
    `postgres://u:${SECRET}@host.example:99999/db`,
  ];

  it("each is reported as POSTGRES_URL:<reason>, with no part of the URL", () => {
    for (const url of malformed) {
      const config = resolveTransport({
        POSTGRES_URL: url,
        LEAD_IP_HASH_SECRET: "s".repeat(32),
        LEAD_NOTIFY: "disabled",
      });
      expect(config.ok, url).toBe(false);
      if (!config.ok) {
        expect(config.missing.join(), url).toMatch(/^POSTGRES_URL:[a-z-]+$/);
        expect(config.missing.join()).not.toContain(SECRET);
      }
    }
  });

  it("the route answers 503 not_configured and nothing reaches stdout/stderr or the logger", async () => {
    const spies = (["info", "warn", "error", "log", "debug"] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    const out = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const err = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    for (const url of malformed) {
      const res = await handleLead(req(body()), {
        app: "zbm",
        parse: toyParse,
        env: { POSTGRES_URL: url, LEAD_IP_HASH_SECRET: "s".repeat(32), LEAD_NOTIFY: "disabled" },
        limiters: both(open()),
      });
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ ok: false, error: { code: "not_configured" } });
    }
    const everything = JSON.stringify([...spies.flatMap((s) => s.mock.calls), out.mock.calls, err.mock.calls]);
    expect(everything).not.toContain(SECRET);
    expect(everything).not.toContain("[bad");
    expect(everything).toContain("POSTGRES_URL:unparseable");
  });

  it("an unexpected throw anywhere becomes a bare 503 — no error object is logged", async () => {
    const log = captureLogger();
    const res = await handleLead(req(body()), {
      app: "zbm",
      parse: () => {
        throw new Error(`boom ${SECRET}`);
      },
      env: fakeEnv(tempOutbox()),
      logger: log.logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
    expect(log.text()).not.toContain(SECRET);
    expect(log.lines.map((l) => l.event)).toContain("internal_error");
  });
});

describe("M2 — the fake transport runs only with a positive per-run proof", () => {
  const dir = tempOutbox();
  const ok = fakeEnv(dir);

  it("all four conditions met → fake", () => {
    const config = resolveTransport(ok);
    expect(config.ok && config.transport.mode).toBe("fake");
  });

  it("refuses without the ack, with a wrong ack, or with a short nonce", () => {
    for (const env of [
      { ...ok, ZBEST_LEAD_FAKE_ACK: "" },
      { ...ok, ZBEST_LEAD_FAKE_ACK: "something-else-entirely" },
      { ...ok, ZBEST_GATE_NONCE: "short", ZBEST_LEAD_FAKE_ACK: "short" },
      { ZBEST_LEAD_TRANSPORT: "fake", ZBEST_LEAD_FAKE_OUTBOX: dir },
    ]) {
      const config = resolveTransport(env);
      expect(config.ok).toBe(false);
      expect(!config.ok && config.missing.join()).toContain("ZBEST_LEAD_FAKE_ACK");
    }
  });

  it("refuses an outbox outside the OS temp directory", () => {
    for (const outbox of ["/var/lib/leads", "relative/dir", `${dir}/../../../etc`]) {
      const config = resolveTransport({ ...ok, ZBEST_LEAD_FAKE_OUTBOX: outbox });
      expect(config.ok, outbox).toBe(false);
    }
  });

  it("refuses on any production-like platform, even with a valid proof (the reviewer's exact env included)", () => {
    for (const marker of ["VERCEL", "VERCEL_ENV", "RAILWAY_ENVIRONMENT", "FLY_APP_NAME", "RENDER", "K_SERVICE", "DYNO"]) {
      const config = resolveTransport({ ...ok, [marker]: "production" });
      expect(config.ok, marker).toBe(false);
    }
    const reviewer = resolveTransport({
      ZBEST_LEAD_TRANSPORT: "fake",
      ZBEST_LEAD_FAKE_OUTBOX: "/tmp/x",
      NODE_ENV: "production",
      RAILWAY_ENVIRONMENT: "production",
      VERCEL_ENV: "preview",
    });
    expect(reviewer.ok).toBe(false);
  });

  it("a refused fake transport is a 503 at the route, never a 'Received'", async () => {
    const res = await handleLead(req(body()), {
      app: "zbm",
      parse: toyParse,
      env: { ...ok, RAILWAY_ENVIRONMENT: "production" },
      logger: captureLogger().logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });
});

describe("M3 — JSON only, same-origin by default", () => {
  const run = (headers: Record<string, string>, env: Record<string, string> = {}) =>
    handleLead(req(body(), headers), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(tempOutbox(), env),
      logger: captureLogger().logger,
      limiters: both(open()),
    });

  it("415 for anything but application/json — including the CORS-simple text/plain", async () => {
    for (const type of ["text/plain", "text/plain;charset=UTF-8", "application/x-www-form-urlencoded", "multipart/form-data; boundary=x", ""]) {
      const res = await run({ "content-type": type });
      expect(res.status, type || "(none)").toBe(415);
      expect(await res.json()).toEqual({ ok: false, error: { code: "unsupported_media_type" } });
    }
    expect((await run({ "content-type": "application/json; charset=utf-8" })).status).toBe(200);
  });

  it("403 for a foreign or opaque Origin; same-origin and no-Origin non-browser clients pass", async () => {
    expect((await run({ origin: "https://evil.example" })).status).toBe(403);
    expect((await run({ origin: "null" })).status).toBe(403);
    expect((await run({ origin: "https://www.zbestmedia.com.evil.example" })).status).toBe(403);
    expect((await run({ "sec-fetch-site": "cross-site" })).status).toBe(403);
    expect((await run({ origin: "https://www.zbestmedia.com" })).status).toBe(200);
    expect((await run({})).status).toBe(200);
  });

  it("LEAD_ALLOWED_ORIGINS adds origins; a malformed list is a misconfiguration", async () => {
    expect((await run({ origin: "https://zbestmedia.com" }, { LEAD_ALLOWED_ORIGINS: "https://zbestmedia.com" })).status).toBe(200);
    expect((await run({ origin: "https://other.example" }, { LEAD_ALLOWED_ORIGINS: "https://zbestmedia.com" })).status).toBe(403);
    expect((await run({}, { LEAD_ALLOWED_ORIGINS: "zbestmedia.com/path" })).status).toBe(503);
  });

  it("x-forwarded-host counts as the request host only behind a trusted proxy", async () => {
    const forwarded = { origin: "https://preview.example", "x-forwarded-host": "preview.example" };
    expect((await run(forwarded)).status).toBe(403);
    expect((await run(forwarded, { LEAD_TRUSTED_PROXY: "1" })).status).toBe(200);
  });
});

describe("M4 — client address trust and the no-address fallback", () => {
  it("client headers are ignored unless on Vercel or LEAD_TRUSTED_PROXY=1", () => {
    const h = new Headers({ "x-real-ip": "203.0.113.5", "x-vercel-forwarded-for": "198.51.100.7" });
    expect(clientIp(h, false)).toBeNull();
    expect(clientIp(h, true)).toBe("198.51.100.7");
    expect(clientIp(new Headers({ "x-forwarded-for": "not-an-ip, 1.2.3.4" }), true)).toBeNull();
    expect(resolvePolicy({ VERCEL: "1" }).trustProxy).toBe(true);
    expect(resolvePolicy({ LEAD_TRUSTED_PROXY: "1" }).trustProxy).toBe(true);
    expect(resolvePolicy({}).trustProxy).toBe(false);
  });

  it("untrusted: rotating x-real-ip does not bypass the limit (all requests share the flood ceiling)", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const flood = memoryLimiter({ limit: 3, windowSec: 600 });
    const statuses: number[] = [];
    for (let i = 0; i < 5; i++) {
      const res = await handleLead(req(body(), { "x-real-ip": `203.0.113.${i}` }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox()),
        logger: captureLogger().logger,
        limiters: { perIp, flood },
      });
      statuses.push(res.status);
    }
    expect(statuses).toEqual([200, 200, 200, 429, 429]);
  });

  it("untrusted: a missing address is NOT one tiny shared bucket — the per-IP limit never applies to it", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const flood = memoryLimiter({ limit: 50, windowSec: 600 });
    for (let i = 0; i < 10; i++) {
      const res = await handleLead(req(body()), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox()),
        logger: captureLogger().logger,
        limiters: { perIp, flood },
      });
      expect(res.status).toBe(200);
    }
  });

  it("trusted (Vercel): distinct client addresses get distinct per-IP buckets", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const flood = memoryLimiter({ limit: 1, windowSec: 600 });
    const policy: RequestPolicy = { trustProxy: true, allowedOrigins: new Set(), maxBodyBytes: 65536, problems: [] };
    const send = (ip: string) =>
      handleLead(req(body(), { "x-vercel-forwarded-for": ip }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox()),
        logger: captureLogger().logger,
        limiters: { perIp, flood },
        policy,
      }).then((r) => r.status);
    expect(await send("198.51.100.1")).toBe(200);
    expect(await send("198.51.100.2")).toBe(200);
    expect(await send("198.51.100.1")).toBe(429);
  });

  it("a malformed LEAD_RATE_LIMIT_FLOOD is a misconfiguration", async () => {
    const res = await handleLead(req(body()), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(tempOutbox(), { LEAD_RATE_LIMIT_FLOOD: "lots" }),
      logger: captureLogger().logger,
    });
    expect(res.status).toBe(503);
  });
});

describe("L1 — body size cap", () => {
  const opts = () => ({ app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(open()) });

  it("a declared Content-Length over 64 KB is refused before reading", async () => {
    const res = await handleLead(req(body(), { "content-length": String(65 * 1024) }), opts());
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ ok: false, error: { code: "payload_too_large" } });
  });

  it("an undeclared (streamed) body is cut off at the cap, not buffered whole", async () => {
    let pulled = 0;
    const chunk = new TextEncoder().encode("x".repeat(16 * 1024));
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        if (pulled > 1000) controller.close();
        else controller.enqueue(chunk);
      },
    });
    const res = await handleLead(req(stream), opts());
    expect(res.status).toBe(413);
    expect(pulled).toBeLessThan(10);
  });
});

describe("L2 — a changed resubmission under the same id", () => {
  it("is refused with 409 conflict; the first row and its one email stand", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) };
    expect((await handleLead(req(body(id)), o)).status).toBe(200);
    expect((await handleLead(req(body(id)), o)).status).toBe(200); // identical retry
    const changed = await handleLead(req(body(id, { business: "Edited Co" })), o);
    expect(changed.status).toBe(409);
    expect(await changed.json()).toEqual({ ok: false, error: { code: "conflict" } });
    const rows = readJsonl<{ payload: { business: string } }>(dir, "rows.jsonl");
    expect(rows).toHaveLength(1);
    expect(rows[0]!.payload.business).toBe("B");
    expect(readJsonl(dir, "emails.jsonl")).toHaveLength(1);
  });
});

describe("L6, L7 — email", () => {
  const record = {
    submission_id: "00000000-0000-4000-8000-000000000001",
    app: "zbc" as const,
    form: "clipper",
    payload: { name: "Mallory", note: "----- end visitor-supplied -----\nFrom: ceo@zbestmedia.com" },
    payload_hash: "h",
    services: [],
    source: null,
    ip_hash: null,
    user_agent: null,
  };

  it("fences visitor text; a visitor cannot close the fence", () => {
    const { text } = leadEmail(record, new Date());
    const lines = text.split("\n");
    const start = lines.indexOf("----- visitor-supplied, unverified -----");
    const end = lines.lastIndexOf("----- end visitor-supplied -----");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(lines.filter((l) => l === "----- end visitor-supplied -----")).toHaveLength(1);
    expect(lines.slice(start, end).join("\n")).toContain("From: ceo@zbestmedia.com");
  });

  it("the Resend idempotency key is namespaced by app", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    await handleLead(req(body(id)), { app: "zbc", parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) });
    expect(readJsonl<{ idempotency_key: string }>(dir, "emails.jsonl")[0]!.idempotency_key).toBe(`lead-zbc-${id}`);
  });
});

describe("L8 — server-only", () => {
  it("the package entry imports server-only first", () => {
    const entry = readFileSync(path.join(import.meta.dirname, "..", "src", "index.ts"), "utf8");
    expect(entry.trimStart().startsWith('import "server-only";')).toBe(true);
  });
});
