import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, symlinkSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolvePolicy, resolveTransport, type RequestPolicy } from "../src/config";
import { leadEmail, quoteVisitorBlock } from "../src/email";
import { payloadHash } from "../src/hash";
import { clientIp, hmacIp, normalizeIp } from "../src/ip";
import { parsePostgresUrl } from "../src/pg-url";
import { handleLead } from "../src/pipeline";
import { memoryLimiter } from "../src/rate-limit";
import type { RateLimiter } from "../src/types";
import type { ParsedLead } from "../src/pipeline";
import { PII, captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/**
 * Regression tests for the AEGIS review of lead-route-v1@55d3437
 * (H1, M1–M4, L1–L8). Each block names the finding it pins.
 */

const NONCE = "gate-nonce-0123456789abcdef";
const open = () => memoryLimiter({ limit: 1000, windowSec: 60 });
const both = (l: RateLimiter) => ({ perIp: l });
const fakeEnv = (dir: string, extra: Record<string, string> = {}) => ({
  ZBEST_LEAD_TRANSPORT: "fake",
  ZBEST_LEAD_FAKE_OUTBOX: dir,
  ZBEST_GATE_NONCE: NONCE,
  ZBEST_LEAD_FAKE_ACK: NONCE,
  // Off Vercel the route requires the ONE trusted client-address header (AEGIS r2 N1, r3 F1).
  LEAD_TRUSTED_PROXY: "x-forwarded-for",
  ...extra,
});
const body = (id = randomUUID(), fields: Record<string, string> = {}) =>
  JSON.stringify({ form: "start", submission_id: id, fields: { name: PII.name, business: "B", reach: PII.reach, ...fields } });
const req = (payload: string | ReadableStream, headers: Record<string, string> = {}) =>
  new Request("http://www.zbestmedia.com/api/lead", {
    method: "POST",
    // A proxy-supplied client address, as the trusted header would carry it.
    headers: { "content-type": "application/json", host: "www.zbestmedia.com", "x-forwarded-for": "198.51.100.1", ...headers },
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
      ["postgres://u:pw@h.example/db?options=-c%20search_path%3Devil", "bad-options-only-endpoint-allowed"],
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

describe("N2, N3 — known-harmless vendor params; TLS modes", () => {
  it("accepts and ignores Supabase supa, Prisma connection_limit/pool_timeout", () => {
    const parsed = parsePostgresUrl(
      "postgres://postgres.ref:pw@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&connection_limit=1&pool_timeout=10&pgbouncer=true",
    );
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.options).not.toHaveProperty("startup_options");
  });

  it("Neon options=endpoint=<id> is passed through as the startup `options`; anything else in options is refused", () => {
    const parsed = parsePostgresUrl(
      "postgresql://u:pw@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-cool-darkness-a1b2c3d4",
    );
    expect(parsed.ok && parsed.options.startup_options).toBe("endpoint=ep-cool-darkness-a1b2c3d4");
    for (const bad of ["-c%20search_path%3Devil", "endpoint%3DEP_UPPER", "endpoint%3Dx%20-c%20y"]) {
      expect(parsePostgresUrl(`postgres://u:pw@h.example/db?options=${bad}`)).toEqual({ ok: false, reason: "bad-options-only-endpoint-allowed" });
    }
    expect(parsePostgresUrl("postgres://u:pw@h.example/db?connection_limit=lots")).toEqual({ ok: false, reason: "bad-connection_limit" });
    expect(parsePostgresUrl("postgres://u:pw@h.example/db?supa=a%20b")).toEqual({ ok: false, reason: "bad-supa" });
    expect(parsePostgresUrl("postgres://u:pw@h.example/db?unknownthing=1")).toEqual({ ok: false, reason: "unknown-param-unknownthing" });
  });

  it("a repeated parameter is refused (no last-one-wins)", () => {
    expect(parsePostgresUrl("postgres://u:pw@h.example/db?sslmode=verify-full&sslmode=disable")).toEqual({
      ok: false,
      reason: "duplicate-param-sslmode",
    });
  });

  it("sslmode=verify-full (and verify-ca) verify; require encrypts only; remote default stays TLS", () => {
    const mode = (q: string) => {
      const p = parsePostgresUrl(`postgres://u:pw@db.example.com/db${q}`);
      return p.ok ? p.options.ssl : p.reason;
    };
    expect(mode("?sslmode=verify-full")).toBe("verify-full");
    expect(mode("?sslmode=verify-ca")).toBe("verify-full");
    expect(mode("?sslmode=require")).toBe("require");
    expect(mode("")).toBe("require");
    expect(mode("?sslmode=disable")).toBe(false);
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

  it("config resolution itself never throws, even if reading the environment does", () => {
    const hostile = new Proxy({} as Record<string, string | undefined>, {
      get: (_t, key) => {
        if (key === "POSTGRES_URL") throw new Error(`env read failed ${SECRET}`);
        return undefined;
      },
    });
    const config = resolveTransport(hostile);
    expect(config).toEqual({ ok: false, missing: ["LEAD_TRANSPORT:unresolvable"] });
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

  it("…and with the real console logger, the thrown error never reaches console or stdio (N5)", async () => {
    const spies = (["info", "warn", "error", "log", "debug", "trace"] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    const out = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const err = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const res = await handleLead(req(body()), {
      app: "zbm",
      parse: () => {
        throw new Error(`boom ${SECRET}`);
      },
      env: fakeEnv(tempOutbox()),
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
    const everything = JSON.stringify([...spies.flatMap((s) => s.mock.calls.map((c) => c.map(String))), out.mock.calls, err.mock.calls]);
    expect(everything).not.toContain(SECRET);
    expect(everything).not.toContain("boom");
    expect(everything).toContain("internal_error");
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

  it("N6: refuses a symlink under the temp dir that points outside it, and a padded transport value", () => {
    const outside = mkdtempSync(path.join("/var/tmp", "lead-outside-"));
    const link = path.join(tempOutbox(), "escape");
    symlinkSync(outside, link);
    expect(resolveTransport({ ...ok, ZBEST_LEAD_FAKE_OUTBOX: path.join(link, "box") }).ok).toBe(false);
    expect(resolveTransport({ ...ok, ZBEST_LEAD_FAKE_OUTBOX: link }).ok).toBe(false);
    expect(resolveTransport({ ...ok, ZBEST_LEAD_TRANSPORT: " fake " }).ok).toBe(false);
    expect(resolveTransport({ ...ok, ZBEST_LEAD_TRANSPORT: "fake\n" }).ok).toBe(false);
  });

  it("refuses an outbox outside the OS temp directory", () => {
    for (const outbox of ["/var/lib/leads", "relative/dir", `${dir}/../../../etc`]) {
      const config = resolveTransport({ ...ok, ZBEST_LEAD_FAKE_OUTBOX: outbox });
      expect(config.ok, outbox).toBe(false);
    }
  });

  it("refuses on any production-like platform, even with a valid proof (the reviewer's exact env included)", () => {
    for (const marker of ["VERCEL", "VERCEL_ENV", "RAILWAY_ENVIRONMENT", "FLY_APP_NAME", "RENDER", "K_SERVICE", "DYNO", "KUBERNETES_SERVICE_HOST"]) {
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
    expect((await run({ "sec-fetch-site": "Cross-Site" })).status).toBe(403);
    expect((await run({ origin: "https://user:pw@www.zbestmedia.com" })).status).toBe(403);
    expect((await run({ origin: "https://www.zbestmedia.com/path" })).status).toBe(403);
    expect((await run({ origin: "https://www.zbestmedia.com" })).status).toBe(200);
    expect((await run({})).status).toBe(200);
  });

  it("LEAD_ALLOWED_ORIGINS adds origins; a malformed list is a misconfiguration", async () => {
    expect((await run({ origin: "https://zbestmedia.com" }, { LEAD_ALLOWED_ORIGINS: "https://zbestmedia.com" })).status).toBe(200);
    expect((await run({ origin: "https://other.example" }, { LEAD_ALLOWED_ORIGINS: "https://zbestmedia.com" })).status).toBe(403);
    expect((await run({}, { LEAD_ALLOWED_ORIGINS: "zbestmedia.com/path" })).status).toBe(503);
  });

  it("x-forwarded-host counts as the request host only on Vercel (AEGIS r3 F1)", async () => {
    const forwarded = { origin: "https://preview.example", "x-forwarded-host": "preview.example" };
    expect((await run(forwarded)).status).toBe(403);
    // On Vercel (policy as resolved from VERCEL=1; the fake transport itself refuses to run there).
    const onVercel = { ...resolvePolicy({ VERCEL: "1" }) };
    const res = await handleLead(req(body(), { ...forwarded, "x-vercel-forwarded-for": "198.51.100.3" }), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(tempOutbox()),
      logger: captureLogger().logger,
      limiters: both(open()),
      policy: onVercel,
    });
    expect(res.status).toBe(200);
  });
});

describe("M4 — client address trust and the no-address fallback", () => {
  it("F1: exactly one header is trusted — x-vercel-forwarded-for only when VERCEL is exactly \"1\"", () => {
    const h = new Headers({
      "x-real-ip": "203.0.113.5",
      "x-vercel-forwarded-for": "198.51.100.7",
      "x-forwarded-for": "10.9.9.9, 192.0.2.44",
    });
    const ip = (env: Record<string, string>) => clientIp(h, resolvePolicy(env).ipSource)?.address;
    expect(ip({ VERCEL: "1" })).toBe("198.51.100.7");
    expect(ip({ VERCEL: "1", LEAD_TRUSTED_PROXY: "x-real-ip" })).toBe("198.51.100.7");
    // Off Vercel, only the named header — and for XFF the hop the proxy appended.
    expect(ip({ LEAD_TRUSTED_PROXY: "x-forwarded-for" })).toBe("192.0.2.44");
    expect(ip({ LEAD_TRUSTED_PROXY: "x-real-ip" })).toBe("203.0.113.5");
    expect(ip({ LEAD_TRUSTED_PROXY: "X-Real-IP" })).toBe("203.0.113.5");
    // VERCEL=true is not Vercel's marker: no header is trusted.
    expect(resolvePolicy({ VERCEL: "true" }).ipSource).toBeNull();
    expect(resolvePolicy({ VERCEL: "true" }).problems).toContain("LEAD_TRUSTED_PROXY:required-off-vercel");
    expect(resolvePolicy({}).ipSource).toBeNull();
    // No trusted source → no address, whatever headers arrive.
    expect(clientIp(h, null)).toBeNull();
    expect(clientIp(h, resolvePolicy({ VERCEL: "true" }).ipSource)).toBeNull();
    // A single-value header with several values is not an address.
    expect(clientIp(new Headers({ "x-real-ip": "1.1.1.1, 2.2.2.2" }), { header: "x-real-ip", hop: "only" })).toBeNull();
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, not-an-ip" }), { header: "x-forwarded-for", hop: "from-right", hops: 1 })).toBeNull();
  });

  it("F1: any other LEAD_TRUSTED_PROXY value is a misconfiguration (incl. the old \"1\")", async () => {
    for (const value of ["1", "true", "x-vercel-forwarded-for", "forwarded", "x-forwarded-for,x-real-ip"]) {
      expect(resolvePolicy({ LEAD_TRUSTED_PROXY: value }).problems.join(), value).toContain("LEAD_TRUSTED_PROXY:must-name-one-of-");
      const res = await handleLead(req(body()), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox(), { LEAD_TRUSTED_PROXY: value }),
        logger: captureLogger().logger,
        limiters: both(open()),
      });
      expect(res.status, value).toBe(503);
    }
  });

  it("F1 (r3 probe P2): off Vercel, a rotating x-vercel-forwarded-for does not bypass the per-IP limit", async () => {
    const perIp = memoryLimiter({ limit: 2, windowSec: 600 });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(perIp) };
    const statuses: number[] = [];
    for (let i = 0; i < 20; i++) {
      const res = await handleLead(
        req(body(), { "x-forwarded-for": "203.0.113.200", "x-vercel-forwarded-for": `198.51.100.${i}`, "x-real-ip": `192.0.2.${i}` }),
        o,
      );
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 4)).toEqual([200, 200, 429, 429]);
    expect(statuses.filter((s) => s === 200)).toHaveLength(2);
  });

  it("F1: a client-prepended x-forwarded-for hop is ignored — only the proxy-appended last hop counts", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(perIp) };
    expect((await handleLead(req(body(), { "x-forwarded-for": "1.1.1.1, 203.0.113.201" }), o)).status).toBe(200);
    expect((await handleLead(req(body(), { "x-forwarded-for": "2.2.2.2, 203.0.113.201" }), o)).status).toBe(429);
  });

  it("N1: off Vercel without LEAD_TRUSTED_PROXY the route refuses to run — never a shared bucket", async () => {
    const dir = tempOutbox();
    const log = captureLogger();
    const statuses: number[] = [];
    const variants: Record<string, string>[] = [{}, { "x-real-ip": "203.0.113.9" }, { "x-vercel-forwarded-for": "203.0.113.9" }];
    for (const headers of variants) {
      const res = await handleLead(req(body(), headers), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(dir, { LEAD_TRUSTED_PROXY: "" }),
        logger: log.logger,
        limiters: both(memoryLimiter({ limit: 1, windowSec: 600 })),
      });
      statuses.push(res.status);
    }
    expect(statuses).toEqual([503, 503, 503]);
    expect(log.lines.find((l) => l.event === "not_configured")?.fields?.missing).toContain("LEAD_TRUSTED_PROXY:required-off-vercel");
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
    expect(resolvePolicy({ VERCEL: "1" }).problems).toEqual([]);
  });

  it("F2: a trusted proxy that sends no client address is 503 not_configured — no fallback bucket", async () => {
    const dir = tempOutbox();
    const log = captureLogger();
    const perIp = memoryLimiter({ limit: 1000, windowSec: 600 });
    for (const policy of [resolvePolicy({ LEAD_TRUSTED_PROXY: "x-forwarded-for" }), resolvePolicy({ VERCEL: "1" })]) {
      const res = await handleLead(req(body(), { "x-forwarded-for": "", origin: "https://www.zbestmedia.com" }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(dir),
        logger: log.logger,
        limiters: both(perIp),
        policy,
      });
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ ok: false, error: { code: "not_configured" } });
    }
    const missing = log.lines.filter((l) => l.event === "not_configured").map((l) => l.fields?.missing);
    expect(missing).toEqual(["no_client_address:x-forwarded-for", "no_client_address:x-vercel-forwarded-for"]);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(0);
  });

  it("F1: a flood of new keys evicts only the least-recently-seen buckets, never resets a blocked one", async () => {
    const limiter = memoryLimiter({ limit: 1, windowSec: 600 }, () => 0, 3);
    expect((await limiter.hit("victim-blocked")).allowed).toBe(true);
    expect((await limiter.hit("victim-blocked")).allowed).toBe(false);
    await limiter.hit("a");
    await limiter.hit("victim-blocked"); // recently seen again → kept
    await limiter.hit("b");
    await limiter.hit("c"); // evicts "a", the least recently seen
    expect((await limiter.hit("victim-blocked")).allowed).toBe(false);
  });

  it("F5: malformed JSON, 400 bad_request and 422 validation failures ARE charged to the client's bucket", async () => {
    const cases: [string, string, number][] = [
      ["malformed JSON", "{not json", 400],
      ["400 bad_request (no envelope)", JSON.stringify({ nothing: true }), 400],
      ["422 validation", JSON.stringify({ form: "start", submission_id: randomUUID(), fields: { name: "" } }), 422],
    ];
    for (const [label, bad, status] of cases) {
      const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
      const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(perIp) };
      expect((await handleLead(req(bad), o)).status, label).toBe(status);
      // The one token went on the failed attempt, so even a valid lead is now limited.
      expect((await handleLead(req(body()), o)).status, label).toBe(429);
    }
  });

  it("N1: honeypot hits and oversized bodies do not consume the bucket", async () => {
    const perIp = memoryLimiter({ limit: 2, windowSec: 600 });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(perIp) };
    const ip = { "x-real-ip": "198.51.100.77" };
    for (let i = 0; i < 10; i++) {
      const bot = JSON.stringify({ form: "start", submission_id: randomUUID(), fields: {}, company_url: "x" });
      expect((await handleLead(req(bot, ip), o)).status).toBe(200);
    }
    for (let i = 0; i < 10; i++) {
      expect((await handleLead(req(body(), { ...ip, "content-length": String(70 * 1024) }), o)).status).toBe(413);
      const huge = JSON.stringify({ form: "start", submission_id: randomUUID(), fields: { name: "x".repeat(70 * 1024) } });
      expect((await handleLead(req(huge, ip), o)).status).toBe(413);
    }
    expect((await handleLead(req(body(), ip), o)).status).toBe(200);
    expect((await handleLead(req(body(), ip), o)).status).toBe(200);
    expect((await handleLead(req(body(), ip), o)).status).toBe(429);
  });

  it("on Vercel: distinct x-vercel-forwarded-for addresses get distinct per-IP buckets", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const send = (ip: string) =>
      handleLead(req(body(), { "x-vercel-forwarded-for": ip }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox(), { VERCEL: "1", LEAD_TRUSTED_PROXY: "" }),
        logger: captureLogger().logger,
        limiters: both(perIp),
      }).then((r) => r.status);
    // fakeEnv carries VERCEL=1 here, so the fake transport refuses: assert the policy path directly.
    const policy: RequestPolicy = { ipSource: { header: "x-vercel-forwarded-for", hop: "only" }, onVercel: true, allowedOrigins: new Set(), maxBodyBytes: 65536, problems: [] };
    const sendP = (ip: string) =>
      handleLead(req(body(), { "x-vercel-forwarded-for": ip }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox()),
        logger: captureLogger().logger,
        limiters: both(perIp),
        policy,
      }).then((r) => r.status);
    expect(await send("198.51.100.1")).toBe(503); // the fake transport never runs on Vercel
    expect(await sendP("198.51.100.1")).toBe(200);
    expect(await sendP("198.51.100.2")).toBe(200);
    expect(await sendP("198.51.100.1")).toBe(429);
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
    payload: { name: "Mallory" } as Record<string, unknown>,
    payload_hash: "h",
    services: [],
    source: null,
    user_agent: null,
  };

  const OPENER = "----- visitor-supplied, unverified -----";
  const CLOSER = "----- end visitor-supplied -----";

  /**
   * The structural property (AEGIS r3 F4): between the real fences, EVERY
   * line starts with "> ", and the only unquoted lines in the email body are
   * the header, the two real fences and the footer.
   */
  const assertQuoted = (text: string, label: string) => {
    const lines = text.split("\n");
    const open = lines.indexOf(OPENER);
    const close = lines.lastIndexOf(CLOSER);
    expect(open, label).toBeGreaterThan(0);
    expect(close, label).toBeGreaterThan(open);
    expect(lines.filter((l) => l === OPENER), label).toHaveLength(1);
    expect(lines.filter((l) => l === CLOSER), label).toHaveLength(1);
    expect(close, label).toBe(lines.length - 3);
    for (const line of lines.slice(open + 1, close)) expect(line.startsWith("> "), `${label}: ${JSON.stringify(line)}`).toBe(true);
    // No line break of any kind survives inside a visitor line.
    // eslint-disable-next-line no-control-regex -- VT/FF are break characters under test
    for (const line of lines.slice(open + 1, close)) expect(/[\r\u000B\u000C\u0085\u2028\u2029]/.test(line), label).toBe(false);
  };

  // r2 vectors plus r3's lookalikes: blank Hangul fillers, combining grapheme
  // joiner, box-drawing, two-em dash, spaced dashes, and every break character.
  const LOOKALIKES: [string, string][] = [
    ["bare", CLOSER],
    ["space", ` ${CLOSER}`],
    ["tab", `\t${CLOSER}`],
    ["ZWSP", `\u200B${CLOSER}`],
    ["BOM", `\uFEFF${CLOSER}`],
    ["NBSP", `\u00A0${CLOSER}`],
    ["U+3164 Hangul filler", `\u3164${CLOSER}`],
    ["U+FFA0 halfwidth filler", `\uFFA0${CLOSER}`],
    ["U+034F CGJ", `\u034F${CLOSER}`],
    ["box-drawing", "\u2500\u2500\u2500\u2500\u2500 end visitor-supplied \u2500\u2500\u2500\u2500\u2500"],
    ["U+2E3A two-em dash", "\u2E3A\u2E3A end visitor-supplied \u2E3A\u2E3A"],
    ["spaced dashes", "- - - - - end visitor-supplied - - - - -"],
    ["em dashes", "\u2014\u2014\u2014\u2014\u2014 end visitor-supplied \u2014\u2014\u2014\u2014\u2014"],
  ];
  const BREAKS: [string, string][] = [
    ["LF", "\n"],
    ["CRLF", "\r\n"],
    ["CR", "\r"],
    ["VT", "\u000B"],
    ["FF", "\u000C"],
    ["NEL", "\u0085"],
    ["U+2028", "\u2028"],
    ["U+2029", "\u2029"],
  ];

  it("F4: every visitor line is quoted \"> \" — no lookalike closer, after any line break, can start a line", () => {
    for (const [name, forged] of LOOKALIKES) {
      for (const [breakName, br] of BREAKS) {
        const label = `${name} after ${breakName}`;
        const payload = { name: "Mallory", note: `hello${br}${forged}${br}From: ceo@zbestmedia.com${br}forged: y` };
        const { text } = leadEmail({ ...record, payload }, new Date());
        assertQuoted(text, label);
        const lines = text.split("\n");
        // Non-vacuous: the forged line really is its own line, and is quoted.
        expect(lines, label).toContain(`> ${forged}`);
        expect(lines, label).toContain("> From: ceo@zbestmedia.com");
      }
    }
  });

  it("F4: multi-line JSON answers and arrays are quoted line by line", () => {
    const lines = quoteVisitorBlock({ answers: [{ question_id: "a", value: 1 }], services: ["x", "y"], empty: "" });
    expect(lines.length).toBeGreaterThan(3);
    for (const line of lines) expect(line.startsWith("> ")).toBe(true);
    expect(lines).toContain("> services: x, y");
    expect(lines).toContain("> empty: —");
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

describe("N5 — the payload hash", () => {
  it("is canonical: key order at any depth does not change it; values and array order do", () => {
    expect(payloadHash({ a: 1, b: { c: 2, d: [1, 2] } })).toBe(payloadHash({ b: { d: [1, 2], c: 2 }, a: 1 }));
    expect(payloadHash({ a: 1 })).not.toBe(payloadHash({ a: 2 }));
    expect(payloadHash({ d: [1, 2] })).not.toBe(payloadHash({ d: [2, 1] }));
  });

  it("covers the form: the same id and fields under a different form is a conflict, not a duplicate", async () => {
    const dir = tempOutbox();
    const id = randomUUID();
    const parseAs = (form: string) => (json: unknown): ParsedLead => {
      const parsed = toyParse(json);
      return parsed.kind === "lead" ? { ...parsed, form } : parsed;
    };
    const o = { app: "zbm" as const, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) };
    expect((await handleLead(req(body(id)), { ...o, parse: parseAs("contact") })).status).toBe(200);
    expect((await handleLead(req(body(id)), { ...o, parse: parseAs("start") })).status).toBe(409);
    expect(readJsonl(dir, "rows.jsonl")).toHaveLength(1);
  });
});

describe("AEGIS r4 — R1 hops, R2 key normalisation, single-value Vercel header", () => {
  const xff = (hops?: string) =>
    resolvePolicy({ LEAD_TRUSTED_PROXY: "x-forwarded-for", ...(hops ? { LEAD_TRUSTED_PROXY_HOPS: hops } : {}) });

  it("R1: LEAD_TRUSTED_PROXY_HOPS picks the n-th entry from the right (default 1)", () => {
    const h = new Headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.9, 198.51.100.20" });
    expect(clientIp(h, xff().ipSource)?.address).toBe("198.51.100.20");
    expect(clientIp(h, xff("2").ipSource)?.address).toBe("203.0.113.9");
    expect(clientIp(h, xff("3").ipSource)?.address).toBe("6.6.6.6");
    // Fewer entries than the configured hops: the chain is not what the operator said.
    expect(clientIp(h, xff("4").ipSource)).toBeNull();
    expect(clientIp(new Headers({ "x-forwarded-for": "198.51.100.20" }), xff("2").ipSource)).toBeNull();
  });

  it("R1: with two appending proxies, a client-prepended entry cannot pick the bucket", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const o = {
      app: "zbm" as const,
      parse: toyParse,
      env: fakeEnv(tempOutbox(), { LEAD_TRUSTED_PROXY_HOPS: "2" }),
      logger: captureLogger().logger,
      limiters: both(perIp),
    };
    // client-spoofed, then the address the CDN saw, then the CDN egress the LB saw.
    expect((await handleLead(req(body(), { "x-forwarded-for": "1.1.1.1, 203.0.113.50, 10.0.0.1" }), o)).status).toBe(200);
    expect((await handleLead(req(body(), { "x-forwarded-for": "2.2.2.2, 203.0.113.50, 10.0.0.1" }), o)).status).toBe(429);
    // A different visitor behind the same CDN egress is a different bucket.
    expect((await handleLead(req(body(), { "x-forwarded-for": "203.0.113.51, 10.0.0.1" }), o)).status).toBe(200);
  });

  it("R1: invalid hops settings are misconfigurations", () => {
    for (const hops of ["0", "10", "two", "-1", "1.5"]) expect(xff(hops).problems.join(), hops).toContain("LEAD_TRUSTED_PROXY_HOPS:must-be-1-to-9");
    expect(resolvePolicy({ LEAD_TRUSTED_PROXY: "x-real-ip", LEAD_TRUSTED_PROXY_HOPS: "2" }).problems.join()).toContain(
      "LEAD_TRUSTED_PROXY_HOPS:only-with-x-forwarded-for",
    );
    expect(xff("1").problems).toEqual([]);
  });

  it("R2: ports are stripped; IPv4-mapped IPv6 is IPv4; IPv6 is keyed by its /64", () => {
    expect(normalizeIp("198.51.100.30:5678")).toEqual({ address: "198.51.100.30", key: "v4:198.51.100.30" });
    expect(normalizeIp("::ffff:198.51.100.30")).toEqual({ address: "198.51.100.30", key: "v4:198.51.100.30" });
    expect(normalizeIp("[2001:db8:1:1::5]:443")).toEqual({
      address: "2001:0db8:0001:0001:0000:0000:0000:0005",
      key: "v6/64:2001:0db8:0001:0001",
    });
    expect(normalizeIp("2001:DB8:1:1:aaaa:bbbb:cccc:dddd")?.key).toBe("v6/64:2001:0db8:0001:0001");
    expect(normalizeIp("64:ff9b::198.51.100.1")).toEqual({
      address: "0064:ff9b:0000:0000:0000:0000:c633:6401",
      key: "v6/64:0064:ff9b:0000:0000",
    });
    expect(normalizeIp("2001:db8:1:2::1")?.key).not.toBe(normalizeIp("2001:db8:1:1::1")?.key);
  });

  it("R2: anything net.isIP rejects is no address", () => {
    for (const bad of ["deadbeef", "999.1.1.1", "1.2.3", "1.2.3.4:99999", "fe80::1%eth0", "[::1", "::ffff:999.1.1.1", "1.2.3.4.5", "a".repeat(65), ""]) {
      expect(normalizeIp(bad), JSON.stringify(bad)).toBeNull();
    }
  });

  it("R2 (r4 probe P5): rotating addresses inside one IPv6 /64, or rotating ports, share one bucket", async () => {
    const perIp = memoryLimiter({ limit: 1, windowSec: 600 });
    const policy = resolvePolicy({ VERCEL: "1" });
    const send = (ip: string) =>
      handleLead(req(body(), { "x-vercel-forwarded-for": ip }), {
        app: "zbm",
        parse: toyParse,
        env: fakeEnv(tempOutbox()),
        logger: captureLogger().logger,
        limiters: both(perIp),
        policy,
      }).then((r) => r.status);
    const v6 = [];
    for (let i = 1; i <= 10; i++) v6.push(await send(`2001:db8:1:1::${i.toString(16)}`));
    expect(v6).toEqual([200, 429, 429, 429, 429, 429, 429, 429, 429, 429]);

    const perIp2 = memoryLimiter({ limit: 1, windowSec: 600 });
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(perIp2) };
    const ports = [];
    for (let i = 0; i < 10; i++) ports.push((await handleLead(req(body(), { "x-forwarded-for": `198.51.100.30:${40000 + i}` }), o)).status);
    expect(ports).toEqual([200, 429, 429, 429, 429, 429, 429, 429, 429, 429]);
  });

  it("privacy sweep 2026-10-30: no ip_hash and no address in any stored row (data minimisation)", async () => {
    const dir = tempOutbox();
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(dir), logger: captureLogger().logger, limiters: both(open()) };
    await handleLead(req(body(), { "x-forwarded-for": "198.51.100.30:5678" }), o);
    await handleLead(req(body(), { "x-forwarded-for": "[2001:db8:1:1::5]:443" }), o);
    const rows = readJsonl<Record<string, unknown>>(dir, "rows.jsonl");
    expect(rows).toHaveLength(2);
    for (const row of rows) expect(row).not.toHaveProperty("ip_hash");
    const text = JSON.stringify(rows);
    for (const leak of ["198.51.100.30", "2001:db8", "2001:0db8", hmacIp("fake-transport-not-a-secret")("198.51.100.30")]) {
      expect(text).not.toContain(leak);
    }
  });

  it("R2: a trusted header carrying a non-address is 503, never a bucket", async () => {
    const res = await handleLead(req(body(), { "x-forwarded-for": "deadbeef" }), {
      app: "zbm",
      parse: toyParse,
      env: fakeEnv(tempOutbox()),
      logger: captureLogger().logger,
      limiters: both(open()),
    });
    expect(res.status).toBe(503);
  });

  it("small: x-vercel-forwarded-for is read as one value; a list is refused (fail closed)", () => {
    const vercel = resolvePolicy({ VERCEL: "1" }).ipSource;
    expect(clientIp(new Headers({ "x-vercel-forwarded-for": "198.51.100.7" }), vercel)?.address).toBe("198.51.100.7");
    expect(clientIp(new Headers({ "x-vercel-forwarded-for": "6.6.6.6, 198.51.100.7" }), vercel)).toBeNull();
  });

  it("small: VERCEL with surrounding whitespace is not Vercel", () => {
    for (const v of [" 1", "1 ", "\t1"]) expect(resolvePolicy({ VERCEL: v }).onVercel, JSON.stringify(v)).toBe(false);
  });

  it("small: only the first x-forwarded-host hop is the host on Vercel", async () => {
    const policy = resolvePolicy({ VERCEL: "1" });
    const send = (xfh: string) =>
      handleLead(
        req(body(), { origin: "https://www.zbestmedia.com", host: "zbm.vercel.app", "x-forwarded-host": xfh, "x-vercel-forwarded-for": "198.51.100.9" }),
        { app: "zbm", parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(open()), policy },
      ).then((r) => r.status);
    expect(await send("www.zbestmedia.com, evil.example")).toBe(200);
    expect(await send("evil.example, www.zbestmedia.com")).toBe(403);
  });
});

describe("AEGIS r5 — N3 IPv4 in IPv6, N5 edges", () => {
  it("N3: every spelling of IPv4-in-IPv6 keys as the same IPv4 client", () => {
    const v4 = { address: "198.51.100.30", key: "v4:198.51.100.30" };
    for (const spelling of [
      "::ffff:198.51.100.30",
      "::FFFF:198.51.100.30",
      "0:0:0:0:0:ffff:198.51.100.30",
      "0000:0000:0000:0000:0000:FFFF:c633:641e",
      "::ffff:c633:641e",
      "::ffff:0:198.51.100.30",
      "::ffff:0:c633:641e",
      "::198.51.100.30",
      "[::ffff:198.51.100.30]:443",
    ]) {
      expect(normalizeIp(spelling), spelling).toEqual(v4);
    }
  });

  it("N3: distinct IPv4 clients in those forms no longer share the zero-/64", () => {
    const keys = new Set(["0:0:0:0:0:ffff:198.51.100.30", "::ffff:c633:641f", "::ffff:0:198.51.100.32", "::198.51.100.33"].map((s) => normalizeIp(s)?.key));
    expect(keys.size).toBe(4);
    expect([...keys].every((k) => k?.startsWith("v4:"))).toBe(true);
    // :: and ::1 are not IPv4 clients.
    expect(normalizeIp("::1")?.key).toBe("v6/64:0000:0000:0000:0000");
    expect(normalizeIp("::")?.key).toBe("v6/64:0000:0000:0000:0000");
  });

  it("N5: valid inputs of 40–64 characters are accepted (the length cap is not lower than real addresses)", () => {
    const long = "[ffff:ffff:ffff:ffff:ffff:ffff:255.255.255.255]:65535"; // 53 chars
    expect(long.length).toBeGreaterThanOrEqual(40);
    expect(normalizeIp(long)).toEqual({ address: "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff", key: "v6/64:ffff:ffff:ffff:ffff" });
    const uncompressed = "[2001:0db8:0001:0001:0000:0000:0000:0005]:443"; // 45 chars
    expect(normalizeIp(uncompressed)?.key).toBe("v6/64:2001:0db8:0001:0001");
    expect(normalizeIp(`  ${uncompressed}  `)?.key).toBe("v6/64:2001:0db8:0001:0001");
  });

  it("N5: port 0 is not a port", () => {
    expect(normalizeIp("198.51.100.30:0")).toBeNull();
    expect(normalizeIp("[2001:db8::1]:0")).toBeNull();
  });

  it("N5: LEAD_TRUSTED_PROXY settings are validated everywhere — on Vercel a valid one is ignored, an invalid one is 503", () => {
    // Chosen behaviour (documented): a stray or malformed setting is config
    // drift; failing closed and visibly beats silently ignoring it.
    expect(resolvePolicy({ VERCEL: "1", LEAD_TRUSTED_PROXY: "x-forwarded-for", LEAD_TRUSTED_PROXY_HOPS: "2" })).toMatchObject({
      ipSource: { header: "x-vercel-forwarded-for", hop: "only" },
      problems: [],
    });
    expect(resolvePolicy({ VERCEL: "1", LEAD_TRUSTED_PROXY_HOPS: "2" }).problems).toEqual(["LEAD_TRUSTED_PROXY_HOPS:only-with-x-forwarded-for"]);
    expect(resolvePolicy({ VERCEL: "1", LEAD_TRUSTED_PROXY: "1" }).problems.join()).toContain("LEAD_TRUSTED_PROXY:must-name-one-of-");
  });
});

describe("privacy sweep 2026-10-30 F7 — rate-limit key and bucket expiry", () => {
  it("the limiter key is the keyed HMAC of the normalised address, not a plain SHA-256", async () => {
    const keys: string[] = [];
    const spy: RateLimiter = { hit: async (key) => (keys.push(key), { allowed: true }) };
    const o = { app: "zbm" as const, parse: toyParse, env: fakeEnv(tempOutbox()), logger: captureLogger().logger, limiters: both(spy) };
    await handleLead(req(body(), { "x-forwarded-for": "198.51.100.30:5678" }), o);
    const { createHash } = await import("node:crypto");
    const hmac = hmacIp("fake-transport-not-a-secret")("v4:198.51.100.30").slice(0, 32);
    const plain = createHash("sha256").update("v4:198.51.100.30").digest("hex").slice(0, 32);
    expect(keys).toEqual([`zbm:${hmac}`]);
    expect(keys[0]).not.toContain(plain);
    expect(keys[0]).not.toContain("198.51.100.30");
  });

  it("a different secret gives a different key for the same address", () => {
    expect(hmacIp("secret-one-0123456789")("v4:1.2.3.4")).not.toBe(hmacIp("secret-two-0123456789")("v4:1.2.3.4"));
  });

  it("memory buckets expire after a full idle window and never sooner", async () => {
    let t = 0;
    const limiter = memoryLimiter({ limit: 1, windowSec: 600 }, () => t);
    await limiter.hit("a");
    t = 100_000;
    await limiter.hit("b");
    expect(limiter.size()).toBe(2);
    // 599.999 s after "a": still held, and still blocked.
    t = 599_999;
    expect((await limiter.hit("a")).allowed).toBe(false);
    expect(limiter.size()).toBe(2);
    // A full window after the last touch of "b" (100 s) and of "a" (599.999 s):
    t = 700_000;
    await limiter.hit("c");
    expect(limiter.size()).toBe(2); // "b" expired; "a" (touched at 599.999 s) and "c" remain
    t = 1_300_000;
    await limiter.hit("d");
    expect(limiter.size()).toBe(1); // only "d"
  });

  it("expiry does not change decisions: an expired key starts with a full bucket, as it would have anyway", async () => {
    let t = 0;
    const limiter = memoryLimiter({ limit: 2, windowSec: 10 }, () => t);
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("k")).allowed).toBe(false);
    t = 10_000;
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("k")).allowed).toBe(true);
    expect((await limiter.hit("k")).allowed).toBe(false);
  });
});
