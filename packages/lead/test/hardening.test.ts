import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, symlinkSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolvePolicy, resolveTransport, type RequestPolicy } from "../src/config";
import { leadEmail, quoteVisitorBlock } from "../src/email";
import { payloadHash } from "../src/hash";
import { clientIp } from "../src/ip";
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
    const ip = (env: Record<string, string>) => clientIp(h, resolvePolicy(env).ipSource);
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
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, not-an-ip" }), { header: "x-forwarded-for", hop: "last" })).toBeNull();
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
    const policy: RequestPolicy = { ipSource: { header: "x-vercel-forwarded-for", hop: "first" }, onVercel: true, allowedOrigins: new Set(), maxBodyBytes: 65536, problems: [] };
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
    ip_hash: null,
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
