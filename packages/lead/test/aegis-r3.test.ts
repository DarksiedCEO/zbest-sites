import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resolveLimiter, resolvePolicy, type Env, type TransportConfig } from "../src/config";
import { fakeStore } from "../src/fake";
import { FORM_TOKEN_HEADER, formTokens } from "../src/form-token";
import { handleNotifyRetry } from "../src/notify-retry";
import { handleLead, type ParsedLead } from "../src/pipeline";
import { parsePostgresUrl, type PgOptions } from "../src/pg-url";
import { postgresPurger, postgresStore } from "../src/postgres";
import { REGION } from "../src/region";
import { purgeHealth, type PurgeLedger } from "../src/retention";
import { DeliveryError, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus } from "../src/types";
import { captureLogger, readJsonl, tempOutbox, toyParse } from "./helpers";

/**
 * AEGIS r3 (scratchpad/night/aegis-site-redteam-fixes-r3.md) probes, made
 * into assertions. Written before the fixes.
 *
 *   H1  a lead is marked sent ONLY if it was in an email Resend accepted:
 *       digest batches are immutable (same leads, same body, same key) and
 *       never re-sliced; an invariant over random failure sequences.
 *   M1  quarantine keeps the full text; it trips per source network (IPv4
 *       /24, IPv6 /48) or on a high global count from other sources.
 *   M3  expired_notify leads keep health degraded until their count email is
 *       accepted, retried under the same key.
 *   M4  health degrades at 60% of LEAD_DB_BUDGET_MB (default 400).
 *   L1  a store failure may still have saved the lead: the copy says so and
 *       a lead committed after the 503 is still emailed.
 *   L2  the per-hour email cap is per site.
 *   L3  only leads under an hour old are retried one by one; older unsent
 *       leads go in the digest.
 */

const CRON = "k".repeat(32);
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });
const tokens = formTokens("aegis-r3-form-secret-0123456789abcdef");
const policy = resolvePolicy({ LEAD_TRUSTED_PROXY: "x-forwarded-for" });
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/** Deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Act = "ok" | "down" | "accept-timeout" | "timeout";
/**
 * Resend's documented idempotency, as a model: a key it accepted is kept;
 * the same key with the same body is a replay (no new email), with a
 * different body a 409. "accept-timeout" accepts the email and then the
 * client sees a timeout; "timeout" and "down" accept nothing.
 */
function modelResend(pick: () => Act) {
  const keys = new Map<string, string>();
  const accepted: { key: string; subject: string; text: string }[] = [];
  const notifier: LeadNotifier = {
    async send(email: LeadEmail, key: string) {
      const body = JSON.stringify(email);
      const prev = keys.get(key);
      if (prev !== undefined) {
        if (prev !== body) throw new DeliveryError("notify_rejected", 409);
        return;
      }
      const act = pick();
      if (act === "down") throw new DeliveryError("notify_rejected", 500);
      if (act === "timeout") throw new DeliveryError("notify_unreachable");
      keys.set(key, body);
      accepted.push({ key, subject: email.subject, text: email.text });
      if (act === "accept-timeout") throw new DeliveryError("notify_unreachable");
    },
  };
  return { notifier, accepted, keys };
}
const leadsIn = (text: string) => new Set([...text.matchAll(/LEAD-(\d+)-END/g)].map((m) => Number(m[1])));

const transportOf = (store: LeadStore & NotifyOutbox, notifier: LeadNotifier | null): TransportConfig => ({
  ok: true,
  transport: { mode: "live", store, outbox: store, notifier, hashIp: (ip: string) => sha(ip), formTokens: tokens },
});
const record = (n: number, extra: Partial<LeadRecord> = {}): LeadRecord => ({
  submission_id: randomUUID(),
  app: "zbm",
  form: "start",
  payload: { name: `N${n}`, business: "B", reach: "r@x.test", problem: `LEAD-${n}-END` },
  payload_hash: randomUUID(),
  content_hash: randomUUID(),
  services: [],
  source: null,
  service_area: "US-CA",
  user_agent: null,
  ...extra,
});

/** One store under test, with a way to read its rows and move its clock. */
type Driver = {
  store: LeadStore & NotifyOutbox;
  now: () => number;
  /** Moves time forward: leases lapse, rows and attempts get older. */
  advance(ms: number): Promise<void>;
  rows(): Promise<{ n: number; status: NotifyStatus }[]>;
};

function fakeDriver(): Driver {
  const dir = tempOutbox();
  // Starts at the real time, not a fixed date: handleLead compares a lead's
  // stored created_at with Date.now(), so a fixed past date made every lead
  // look days old (and go to the digest) once the wall clock passed it.
  let clock = Date.now();
  const store = fakeStore(dir, () => clock);
  return {
    store,
    now: () => clock,
    advance: async (ms) => void (clock += ms),
    rows: async () => {
      const byId = new Map<string, NotifyStatus>();
      const nOf = new Map<string, number>();
      for (const r of readJsonl<LeadRecord>(dir, "rows.jsonl")) {
        byId.set(r.submission_id, "pending");
        nOf.set(r.submission_id, Number(/LEAD-(\d+)-END/.exec(String(r.payload.problem))![1]));
      }
      for (const s of readJsonl<{ submission_id: string; notify_status: NotifyStatus }>(dir, "notify.jsonl")) byId.set(s.submission_id, s.notify_status);
      return [...byId].map(([id, status]) => ({ n: nOf.get(id)!, status }));
    },
  };
}

/**
 * H1 invariant. Random runs of the retry cron over a mix of new, failed and
 * deferred leads, with Resend randomly down, timing out before or after
 * accepting, and time jumps past the 23 h key window. After EVERY run, every
 * lead marked sent appeared in an email Resend accepted. After a final drain
 * with Resend healthy, every lead is sent.
 */
async function invariantRun(d: Driver, seed: number, runs = 10) {
  const r = rng(seed);
  let act: Act[] = ["ok", "down", "accept-timeout", "timeout"];
  const resend = modelResend(() => act[Math.floor(r() * act.length)]!);
  const t = transportOf(d.store, resend.notifier);
  let n = 0;
  const addLeads = async (k: number) => {
    for (let i = 0; i < k; i++) {
      const rec = record(++n);
      await d.store.insert(rec);
      const pick = r();
      if (pick < 0.5) await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
      else if (pick < 0.75) await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
      // else left 'pending' (a crash before the inline email)
    }
  };
  const check = async (label: string) => {
    const delivered = new Set<number>();
    for (const a of resend.accepted) for (const x of leadsIn(a.text)) delivered.add(x);
    const rows = await d.rows();
    const lost = rows.filter((x) => x.status === "sent" && !delivered.has(x.n)).map((x) => x.n);
    expect(lost, `${label}: marked sent but never in an accepted email`).toEqual([]);
    return rows;
  };
  await addLeads(140 + Math.floor(r() * 160));
  for (let run = 0; run < runs; run++) {
    if (r() < 0.6) await addLeads(Math.floor(r() * 120));
    await d.advance(r() < 0.15 ? 25 * 3_600_000 : (11 + Math.floor(r() * 100)) * 60_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()), logger: captureLogger().logger });
    await check(`seed ${seed} run ${run}`);
  }
  act = ["ok"];
  for (let i = 0; i < 8; i++) {
    await d.advance(61 * 60_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()), logger: captureLogger().logger });
  }
  const rows = await check(`seed ${seed} drained`);
  expect(rows.filter((x) => x.status !== "sent"), `seed ${seed}: not delivered after the drain`).toEqual([]);
}

describe("H1 — a lead is marked sent only if it was in an email Resend accepted (fake store)", () => {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    it(`invariant over random send failures and timeouts, seed ${seed}`, async () => {
      await invariantRun(fakeDriver(), seed);
    }, 60_000);
  }
});

describe("L3 — after deploy, a backlog of old unsent leads is not emailed one by one", () => {
  it("300 pending/failed leads 2–30 hours old: zero individual emails, three digests", async () => {
    const d = fakeDriver();
    const resend = modelResend(() => "ok");
    for (let i = 0; i < 300; i++) {
      const rec = record(i);
      await d.store.insert(rec);
      if (i % 2) await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
      await d.advance(5 * 60_000);
    }
    await d.advance(2 * 3_600_000);
    const res = await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(d.store, resend.notifier), now: () => new Date(d.now()) });
    expect(await res.json()).toMatchObject({ ok: true, sent: 0, digest: 300 });
    expect(resend.accepted.filter((a) => a.key.startsWith("lead-"))).toHaveLength(0);
    expect(resend.accepted.filter((a) => a.key.startsWith("digest-"))).toHaveLength(3);
  });

  it("a failed lead under an hour old is still retried on its own", async () => {
    const d = fakeDriver();
    const resend = modelResend(() => "ok");
    const rec = record(1);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    await d.advance(20 * 60_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(d.store, resend.notifier), now: () => new Date(d.now()) });
    expect(resend.accepted.map((a) => a.key)).toEqual([`lead-zbm-${rec.submission_id}`]);
  });
});

describe("M3 — expired leads stay visible until their count email is accepted", () => {
  it("Resend down: health is notify_expired and the count email is retried under the SAME key; once accepted, health is ok", async () => {
    const d = fakeDriver();
    let down = true;
    const resend = modelResend(() => (down ? "down" : "ok"));
    const keysTried: string[] = [];
    const notifier: LeadNotifier = { send: (e, k) => (keysTried.push(k), resend.notifier.send(e, k)) };
    for (let i = 0; i < 3; i++) await d.store.insert(record(i));
    await d.advance(4 * 86_400_000);
    const t = transportOf(d.store, notifier);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()) });
    const ledger: PurgeLedger = {
      lastSuccess: async () => new Date(d.now()),
      leadState: async () => {
        const rows = await d.rows();
        return {
          unsent: 0,
          digestPending: 0,
          quarantined24h: 0,
          stored24h: 0,
          expiredUnreported: rows.filter((x) => x.status === "expired_notify").length,
        } as never;
      },
    };
    expect((await purgeHealth({ app: "zbm", env: cronEnv(), ledger, logger: () => {}, now: () => new Date(d.now()) })).status).toBe("notify_expired");
    await d.advance(3_600_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()) });
    down = false;
    await d.advance(3_600_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()) });
    const expiredKeys = keysTried.filter((k) => k.startsWith("expired-"));
    expect(expiredKeys.length).toBeGreaterThanOrEqual(3);
    expect(new Set(expiredKeys).size).toBe(1);
    expect(resend.accepted.filter((a) => a.key.startsWith("expired-"))).toHaveLength(1);
    expect(resend.accepted[0]!.subject).toContain("3 older leads");
    expect((await d.rows()).map((x) => x.status)).toEqual(["expired_reported", "expired_reported", "expired_reported"]);
    expect((await purgeHealth({ app: "zbm", env: cronEnv(), ledger, logger: () => {}, now: () => new Date(d.now()) })).status).toBe("ok");
  });
});

describe("M4 — health is degraded at 60% of the database storage budget", () => {
  const ledgerWith = (bytes: number): PurgeLedger => ({
    lastSuccess: async () => new Date(),
    dbBytes: async () => bytes,
  } as PurgeLedger);
  it("default budget 400 MB: 239 MB is ok, 240 MB is db_budget, with an error-level alert", async () => {
    const log = captureLogger();
    expect((await purgeHealth({ app: "zbm", env: cronEnv(), ledger: ledgerWith(239 * 1024 * 1024), logger: log.logger })).status).toBe("ok");
    expect((await purgeHealth({ app: "zbm", env: cronEnv(), ledger: ledgerWith(240 * 1024 * 1024), logger: log.logger })).status).toBe("db_budget");
    expect(log.lines.some((l) => l.level === "error" && l.event === "lead_db_budget")).toBe(true);
  });
  it("LEAD_DB_BUDGET_MB sets the budget; a malformed value is misconfigured", async () => {
    expect((await purgeHealth({ app: "zbm", env: cronEnv({ LEAD_DB_BUDGET_MB: "10000" }), ledger: ledgerWith(5000 * 1024 * 1024), logger: () => {} })).status).toBe("ok");
    expect((await purgeHealth({ app: "zbm", env: cronEnv({ LEAD_DB_BUDGET_MB: "100" }), ledger: ledgerWith(61 * 1024 * 1024), logger: () => {} })).status).toBe("db_budget");
    expect((await purgeHealth({ app: "zbm", env: cronEnv({ LEAD_DB_BUDGET_MB: "lots" }), ledger: ledgerWith(1), logger: () => {} })).status).toBe("misconfigured");
  });
});

/** A request shaped like the ZBM /start form, from `ip`. */
const startPost = (fields: Record<string, unknown>, ip: string, id = randomUUID()) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip, "user-agent": "aegis", [FORM_TOKEN_HEADER]: tokens.issue("zbm", Date.now() - 10_000) },
    body: JSON.stringify({ form: "start", submission_id: id, fields }),
  });
const startParse = (json: unknown): ParsedLead => {
  const j = json as { submission_id: string; fields: Record<string, unknown> };
  const { state, ...payload } = j.fields;
  return { kind: "lead", form: "start", submission_id: j.submission_id, payload, region: REGION.parse({ state: state ?? "US-CA" }), services: [], source: null, body: { ok: true } };
};
const LONG_REACH =
  "Call Jennifer Martinez-Rodriguez on her cell 310-555-0147 between 7 and 9 am Pacific, or email jennifer.martinez-rodriguez@southbaydentalgroup.example, or text the office line 310-555-0100 any time";
const LONG_DETAILS = "We run three dental offices in the South Bay and our booking page drops people. ".repeat(20).slice(0, 1500) + " call me on 424-555-0199";

describe("M1 — quarantine never destroys a real lead's text, and is not cheap to trip", () => {
  it("one /24 sending past its limit is quarantined (full text kept); a real lead from elsewhere is not", async () => {
    const d = fakeDriver();
    const resend = modelResend(() => "ok");
    const t = transportOf(d.store, resend.notifier);
    const log = captureLogger();
    const limiters = resolveLimiter({ LEAD_RATE_LIMIT: "100000/60" }, log.logger, "r3-m1a");
    const ids: string[] = [];
    // 40 junk leads from 40 addresses in ONE /24.
    for (let i = 0; i < 40; i++) {
      const id = randomUUID();
      ids.push(id);
      expect((await handleLead(startPost({ name: "J", business: "B", reach: LONG_REACH, details: `${LONG_DETAILS} ${i}` }, `203.0.113.${i + 1}`, id), { app: "zbm", parse: startParse, transport: t, limiters, policy, logger: log.logger })).status).toBe(200);
    }
    const realId = randomUUID();
    await handleLead(startPost({ name: "Real", business: "South Bay Dental Group", reach: LONG_REACH, details: LONG_DETAILS }, "198.51.100.7", realId), { app: "zbm", parse: startParse, transport: t, limiters, policy, logger: log.logger });
    // The real lead, from another network, got its own email with the full text.
    const own = resend.accepted.find((a) => a.key === `lead-zbm-${realId}`);
    expect(own?.text).toContain("jennifer.martinez-rodriguez@southbaydentalgroup.example, or text the office line 310-555-0100 any time");
    expect(own?.text).toContain("424-555-0199");
    // The /24 past its limit: quarantined, never an email of its own.
    const singles = new Set(resend.accepted.filter((a) => a.key.startsWith("lead-")).map((a) => a.key));
    expect(ids.filter((id) => singles.has(`lead-zbm-${id}`)).length).toBeLessThanOrEqual(12);
    expect(log.lines.some((l) => l.event === "quarantine_tripped")).toBe(true);
    // Their full text reaches the digest, clearly marked.
    await d.advance(2 * 3_600_000);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(d.now()) });
    const digest = resend.accepted.filter((a) => a.key.startsWith("digest-")).map((a) => a.text).join("\n");
    expect(digest).toMatch(/QUARANTINED/);
    expect(digest).not.toMatch(/\[cut\]|cut to 2 KB/);
    expect(digest).toContain("424-555-0199");
    expect(digest).toContain("310-555-0100 any time");
  });

  it("the default global threshold is far above ~5 addresses' daily output: 6,000 leads from 600 networks are not quarantined", async () => {
    const d = fakeDriver();
    const resend = modelResend(() => "ok");
    const t = transportOf(d.store, resend.notifier);
    const log = captureLogger();
    const limiters = resolveLimiter({ LEAD_RATE_LIMIT: "100000/60", LEAD_GLOBAL_LIMIT_PER_MINUTE: "100000", LEAD_EMAIL_LIMIT_PER_HOUR: "1000000" }, log.logger, "r3-m1b");
    for (let i = 0; i < 6_000; i++) {
      const net = i % 600;
      await handleLead(startPost({ name: "J", business: "B", reach: "r@x.test", details: `junk ${i}` }, `10.${net >> 8}.${net & 255}.${(i % 7) + 1}`), { app: "zbm", parse: startParse, transport: t, limiters, policy, logger: log.logger });
    }
    expect(log.lines.filter((l) => l.event === "quarantine_tripped")).toHaveLength(0);
  }, 120_000);
});

describe("L1 — a store failure may still have saved the lead: the visitor is told so", () => {
  it("the 'unavailable' copy does not claim nothing was saved, and says sending again is safe", async () => {
    const { FAILURE_COPY } = await import("../../ui/src/lead/contract");
    expect(FAILURE_COPY.unavailable).not.toMatch(/nothing was (saved|sent)/i);
    expect(FAILURE_COPY.unavailable).toMatch(/may (still )?have reached us/i);
    expect(FAILURE_COPY.unavailable).toMatch(/again/i);
  });
});

describe("L2 — the per-hour email cap is per site and configurable", () => {
  it("LEAD_EMAIL_LIMIT_PER_HOUR=2: ZBM's third lead is deferred, ZBC's counter is separate", async () => {
    const d = fakeDriver();
    const resend = modelResend(() => "ok");
    const t = transportOf(d.store, resend.notifier);
    const limiters = resolveLimiter({ LEAD_EMAIL_LIMIT_PER_HOUR: "2" }, captureLogger().logger, "r3-l2");
    const post = (app: "zbm" | "zbc", i: number) =>
      handleLead(
        new Request("http://localhost/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json", "x-forwarded-for": `192.0.2.${i + 1}`, [FORM_TOKEN_HEADER]: tokens.issue(app, Date.now() - 10_000) },
          body: JSON.stringify({ form: "start", submission_id: randomUUID(), fields: { name: "N", business: "B", reach: "r@x.test", problem: `${app} ${i}` } }),
        }),
        { app, parse: toyParse, transport: t, limiters, policy },
      );
    for (let i = 0; i < 3; i++) await post("zbm", i);
    for (let i = 0; i < 2; i++) await post("zbc", 10 + i);
    const singles = resend.accepted.filter((a) => a.key.startsWith("lead-"));
    expect(singles.filter((a) => a.key.startsWith("lead-zbm-"))).toHaveLength(2);
    expect(singles.filter((a) => a.key.startsWith("lead-zbc-"))).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Integration: real Postgres.

const url = process.env.LEAD_TEST_POSTGRES_URL;
const base = (() => {
  if (!url) return null;
  const p = parsePostgresUrl(url);
  if (!p.ok) throw new Error("bad url");
  return p.options;
})();
let cn = 0;
const freshStore = () => postgresStore({ ...(base as PgOptions), connect_timeout: 60 + ++cn });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe.skipIf(!url)("AEGIS r3 — immutable digests, quarantine, expiry, budget, deadline (integration)", () => {
  let sql: postgres.Sql;
  beforeAll(async () => {
    const o = base!;
    sql = postgres({ host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl, max: 4, onnotice: () => {} });
    for (const f of readdirSync(path.join(import.meta.dirname, "..", "sql")).filter((x) => /^\d{3}_.+\.sql$/.test(x)).sort()) {
      await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", f), "utf8"));
    }
  }, 60_000);
  afterAll(async () => {
    await sql`DELETE FROM leads`;
    await sql.end();
  });
  beforeEach(async () => {
    await sql`DELETE FROM leads`;
  });

  const pgDriver = (): Driver => ({
    store: freshStore(),
    now: () => Date.now(),
    advance: async (ms) => {
      const iv = `${Math.round(ms / 1000)} seconds`;
      await sql`UPDATE leads SET created_at = created_at - ${iv}::interval,
        notify_first_attempt_at = notify_first_attempt_at - ${iv}::interval,
        notify_batch_at = notify_batch_at - ${iv}::interval,
        notify_next_at = NULL`;
    },
    rows: async () =>
      (await sql`SELECT payload->>'problem' p, notify_status FROM leads`).map((x) => ({ n: Number(/LEAD-(\d+)-END/.exec(String(x.p))![1]), status: x.notify_status as NotifyStatus })),
  });

  async function seed(count: number, startAgoSec: number, status: string, tag: string) {
    const rows = Array.from({ length: count }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start",
      payload: sql.json({ name: `${tag} ${i}`, problem: `${tag} ${i}` }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: status,
      created_at: new Date(Date.now() - (startAgoSec - i) * 1000).toISOString(),
    }));
    for (let i = 0; i < rows.length; i += 1000) {
      await sql`INSERT INTO leads ${sql(rows.slice(i, i + 1000), "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status", "created_at")}`;
    }
    return rows.map((r) => r.submission_id);
  }

  it("H1 (N5b): a failed digest batch is never re-claimed in part — older rows interleaved by created_at cannot make a lead 'sent' without an email", async () => {
    let down = 1;
    const resend = modelResend(() => (down-- > 0 ? "down" : "ok"));
    const t = transportOf(freshStore(), resend.notifier);
    await seed(1000, 5000, "deferred", "P");
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    const failed = await sql`SELECT submission_id::text id, created_at FROM leads WHERE notify_status <> 'sent' ORDER BY created_at`;
    expect(failed.length).toBeGreaterThan(0);
    const minT = new Date(failed[0]!.created_at).getTime();
    const maxT = new Date(failed[failed.length - 1]!.created_at).getTime();
    const older = Array.from({ length: 950 }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start", payload: sql.json({ name: `U ${i}`, problem: `U ${i}` }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: "delivery_unknown",
      created_at: new Date(minT + ((maxT - minT) * i) / 950).toISOString(),
    }));
    await sql`INSERT INTO leads ${sql(older, "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status", "created_at")}`;
    for (let i = 0; i < 4; i++) {
      await sql`UPDATE leads SET notify_next_at = NULL`;
      await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    }
    const delivered = new Set<string>();
    for (const a of resend.accepted) for (const m of a.text.matchAll(/(?:P|U) \d+\b/g)) delivered.add(m[0]);
    const rows = await sql`SELECT payload->>'problem' p, notify_status FROM leads`;
    expect(rows.filter((x) => x.notify_status === "sent" && !delivered.has(String(x.p))).map((x) => x.p)).toEqual([]);
    expect(rows.filter((x) => x.notify_status !== "sent")).toEqual([]);
  }, 120_000);

  it("H1: a batch's rows are locked as a whole — two concurrent crons never split one batch", async () => {
    const resend = modelResend(() => "ok");
    await seed(450, 5000, "deferred", "C");
    await Promise.all([0, 1, 2].map(() => handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) })));
    const seen = new Map<string, number>();
    for (const a of resend.accepted) for (const k of new Set([...a.text.matchAll(/C \d+\b/g)].map((m) => m[0]))) seen.set(k, (seen.get(k) ?? 0) + 1);
    expect(seen.size).toBe(450);
    expect([...seen.entries()].filter(([, v]) => v !== 1).slice(0, 5)).toEqual([]);
    expect((await sql`SELECT count(*)::int c FROM leads WHERE notify_status = 'sent'`)[0]!.c).toBe(450);
  }, 120_000);

  for (const s of [11, 12]) {
    it(`H1 invariant on Postgres, seed ${s}`, async () => {
      await invariantRun(pgDriver(), s, 8);
    }, 240_000);
  }

  it("M1: a quarantined lead keeps its full text in the database", async () => {
    const resend = modelResend(() => "ok");
    const t = transportOf(freshStore(), resend.notifier);
    const limiters = resolveLimiter({ LEAD_QUARANTINE_AFTER_PER_DAY: "1" }, captureLogger().logger, "r3-m1-pg");
    await handleLead(startPost({ name: "J", business: "B", reach: "r@x.test", details: "first" }, "198.51.100.1"), { app: "zbm", parse: startParse, transport: t, limiters, policy });
    const id = randomUUID();
    await handleLead(startPost({ name: "Real", business: "B", reach: LONG_REACH, details: LONG_DETAILS }, "192.0.2.9", id), { app: "zbm", parse: startParse, transport: t, limiters, policy });
    const [row] = await sql`SELECT quarantined, payload FROM leads WHERE submission_id = ${id}::uuid`;
    expect(row!.quarantined).toBe(true);
    expect(row!.payload.reach).toBe(LONG_REACH);
    expect(row!.payload.details).toBe(LONG_DETAILS);
  });

  it("M3: expired rows keep health degraded while the count email fails; retried under one key; then expired_reported and ok", async () => {
    let down = true;
    const resend = modelResend(() => (down ? "down" : "ok"));
    const t = transportOf(freshStore(), resend.notifier);
    await seed(4, 5 * 86_400, "pending", "E");
    const purger = postgresPurger({ ...base!, connect_timeout: 95 });
    const health = () => purgeHealth({ app: "zbm", env: cronEnv(), cacheMs: 0, logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } } as never);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    expect((await health()).status).toBe("notify_expired");
    await sql`UPDATE leads SET notify_next_at = NULL`;
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    expect((await health()).status).toBe("notify_expired");
    down = false;
    await sql`UPDATE leads SET notify_next_at = NULL`;
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    expect(resend.accepted.filter((a) => a.key.startsWith("expired-"))).toHaveLength(1);
    expect((await sql`SELECT DISTINCT notify_status FROM leads`).map((x) => x.notify_status)).toEqual(["expired_reported"]);
    expect((await health()).status).toBe("ok");
  }, 60_000);

  it("M4: dbBytes measures the leads table with pg_total_relation_size; a 1 MB budget trips db_budget", async () => {
    await seed(2000, 3600, "sent", "S");
    const purger = postgresPurger({ ...base!, connect_timeout: 94 });
    const bytes = await (purger as unknown as { dbBytes(): Promise<number> }).dbBytes();
    const [real] = await sql`SELECT pg_total_relation_size('leads')::bigint AS b`;
    expect(bytes).toBeGreaterThanOrEqual(Number(real!.b));
    const health = await purgeHealth({ app: "zbm", env: cronEnv({ LEAD_DB_BUDGET_MB: "1" }), cacheMs: 0, logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } } as never);
    expect(health.status).toBe("db_budget");
  }, 60_000);

  it("L1 (N6): a lead that commits after its visitor got a 503 is still emailed by the cron", async () => {
    const resend = modelResend(() => "ok");
    const t = transportOf(freshStore(), resend.notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r3-n6");
    const fields = { name: "N", business: "B", reach: "r@x.test", details: `deadline target ${randomUUID()}` };
    // Learn the content hash, then start clean.
    await handleLead(startPost(fields, "198.51.100.40"), { app: "zbm", parse: startParse, transport: transportOf(freshStore(), null), limiters, policy });
    const [row] = await sql`SELECT content_hash FROM leads LIMIT 1`;
    await sql`DELETE FROM leads`;
    const o = base!;
    const conn = () => postgres({ host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl, max: 1, onnotice: () => {} });
    const lockA = conn();
    const lockB = conn();
    let relA!: () => void, relB!: () => void, okA!: () => void, okB!: () => void;
    const hA = new Promise<void>((r) => (relA = r)), hB = new Promise<void>((r) => (relB = r));
    const iA = new Promise<void>((r) => (okA = r)), iB = new Promise<void>((r) => (okB = r));
    const pa = lockA.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtextextended(${`zbm:${row!.content_hash}`}::text, 0))`;
      okA();
      await hA;
    });
    const pb = lockB.begin(async (tx) => {
      await tx`LOCK TABLE leads IN SHARE MODE`;
      okB();
      await hB;
    });
    await Promise.all([iA, iB]);
    setTimeout(() => relA(), 4500);
    setTimeout(() => relB(), 8000);
    const id = randomUUID();
    const res = await handleLead(startPost(fields, "198.51.100.41", id), { app: "zbm", parse: startParse, transport: t, limiters, policy });
    expect(res.status).toBe(503);
    await Promise.all([pa, pb]);
    await lockA.end();
    await lockB.end();
    await sleep(2000);
    const after = await sql`SELECT notify_status FROM leads WHERE submission_id = ${id}::uuid`;
    if (after.length) {
      // It committed after the 503: the cron (after the pending grace) emails it.
      await sql`UPDATE leads SET created_at = now() - interval '10 minutes'`;
      await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
      expect(resend.accepted.some((a) => a.key === `lead-zbm-${id}`)).toBe(true);
    }
  }, 60_000);
});
