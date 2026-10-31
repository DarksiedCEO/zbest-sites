import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { type Env, type TransportConfig } from "../src/config";
import { fakeStore } from "../src/fake";
import { formTokens } from "../src/form-token";
import { handleAckUndelivered } from "../src/ack";
import { handleNotifyRetry } from "../src/notify-retry";
import { parsePostgresUrl, type PgOptions } from "../src/pg-url";
import { postgresPurger, postgresStore } from "../src/postgres";
import { handleHealth, purgeHealth, resetHealthCache } from "../src/retention";
import { DeliveryError, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type LookupResult, type NotifyOutbox } from "../src/types";
import { captureLogger, tempOutbox } from "./helpers";

/**
 * AEGIS r6 (scratchpad/night/aegis-site-redteam-fixes-r6.md), made into
 * assertions. Written before the fixes.
 *
 *   R6-1  an abandoned lead never silently disappears: health stays degraded
 *         (leads_undelivered) until acknowledged; once a later email is
 *         confirmed delivered, abandoned leads are re-queued (flagged
 *         "previously undeliverable"); the backlog report lists them; the
 *         back-off (1 h, 6 h, 24 h, 72 h) outlasts a 24 h outage.
 *   R6-2  delivery_unverifiable is a 503 when leads are unsent or unconfirmed past the alert age.
 *   R6-3  every multi-row update picks its ids once (bad plan safe).
 *   R6-4  a run ends within its budget.
 *   R6-5  an id that keeps failing with 5xx does not block the others; after 5 it is unverifiable.
 *   R6-6  migrate parses the constraints strictly.
 *   R6-7  an accepted email without an id: warning until acknowledged; the lead is re-sent in the next digest, flagged.
 */

const CRON = "k".repeat(32);
const H = 3_600_000;
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });
const tokens = formTokens("aegis-r6-form-secret-0123456789abcdef");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const leadsIn = (text: string) => new Set([...text.matchAll(/LEAD-(\d+)-END/g)].map((m) => Number(m[1])));

/** Resend, modelled: each accepted email gets a fate when it is accepted; lookups answer it. */
function modelResend() {
  const keys = new Map<string, { body: string; id: string }>();
  const accepted: { key: string; id: string; subject: string; text: string; fate: string }[] = [];
  const fates = new Map<string, string>();
  const calls: string[] = [];
  const m = {
    fate: (): string => "delivered",
    noId: false,
    sendDelayMs: 0,
    lookup: (id: string): LookupResult => ({ event: fates.get(id) ?? "sent" }),
    notifier: null as unknown as LeadNotifier,
    accepted,
    fates,
    calls,
  };
  m.notifier = {
    async send(email: LeadEmail, key: string) {
      calls.push(`send:${key}`);
      if (m.sendDelayMs) await new Promise((r) => setTimeout(r, m.sendDelayMs));
      const body = JSON.stringify(email);
      const prev = keys.get(key);
      if (prev) {
        if (prev.body !== body) throw new DeliveryError("notify_rejected", 409);
        return m.noId ? {} : { id: prev.id };
      }
      const id = randomUUID();
      keys.set(key, { body, id });
      const fate = m.fate();
      fates.set(id, fate);
      accepted.push({ key, id, subject: email.subject, text: email.text, fate });
      return m.noId ? {} : { id };
    },
    async lastEvent(id: string) {
      calls.push(`lookup:${id}`);
      return m.lookup(id);
    },
  };
  return m;
}
type Model = ReturnType<typeof modelResend>;
const DELIVERED = new Set(["delivered", "opened", "clicked"]);
/** Leads that were in at least one email whose fate is delivered. */
const deliveredLeads = (r: Model) => {
  const ok = new Set<number>();
  for (const a of r.accepted) if (DELIVERED.has(a.fate)) for (const n of leadsIn(a.text)) ok.add(n);
  return ok;
};
const transportOf = (store: LeadStore & NotifyOutbox, notifier: LeadNotifier | null): TransportConfig => ({
  ok: true,
  transport: { mode: "live", store, outbox: store, notifier, hashIp: (ip: string) => sha(ip), formTokens: tokens },
});
const record = (n: number): LeadRecord => ({
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
});
function fakeDriver() {
  let clock = Date.parse("2026-11-01T12:00:00Z");
  const store = fakeStore(tempOutbox(), () => clock);
  return { store, now: () => clock, advance: (ms: number) => void (clock += ms) };
}
type Driver = ReturnType<typeof fakeDriver>;
const run = (d: Driver, r: Model, log = captureLogger(), extra: Record<string, unknown> = {}) =>
  handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(d.store, r.notifier), now: () => new Date(d.now()), logger: log.logger, ...extra });
/** A new lead whose inline email was refused (as if Resend were down): the cron sends it. */
async function addLead(d: Driver, n: number) {
  const rec = record(n);
  await d.store.insert(rec);
  await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
}

describe("R6-1 — abandoned leads come back once the inbox works (fake store)", () => {
  it("24 h bounce, 1 lead an hour, then fixed: every lead ends up in a delivered email", async () => {
    const d = fakeDriver();
    const r = modelResend();
    let bouncing = true;
    r.fate = () => (bouncing ? "bounced" : "delivered");
    let n = 0;
    for (let h = 0; h < 24; h++) {
      await addLead(d, ++n);
      d.advance(10 * 60_000);
      await run(d, r);
      d.advance(50 * 60_000);
    }
    bouncing = false;
    for (let h = 0; h < 96; h++) {
      await run(d, r);
      d.advance(H);
    }
    const ok = deliveredLeads(r);
    expect([...Array(n).keys()].map((i) => i + 1).filter((k) => !ok.has(k))).toEqual([]);
  }, 120_000);

  it("5-day suppression, 2 leads an hour, then fixed: 0 leads lost once the inbox recovers", async () => {
    const d = fakeDriver();
    const r = modelResend();
    let suppressed = true;
    r.fate = () => (suppressed ? "suppressed" : "delivered");
    let n = 0;
    const log = captureLogger();
    for (let h = 0; h < 120; h++) {
      await addLead(d, ++n);
      await addLead(d, ++n);
      d.advance(10 * 60_000);
      await run(d, r, log);
      d.advance(50 * 60_000);
    }
    expect(log.lines.some((l) => l.event === "notify_delivery_abandoned")).toBe(true);
    suppressed = false;
    // A new lead is delivered: that confirmation re-queues every abandoned lead, once.
    for (let h = 0; h < 24 * 4; h++) {
      if (h === 0) await addLead(d, ++n);
      await run(d, r);
      d.advance(H);
    }
    const ok = deliveredLeads(r);
    expect([...Array(n).keys()].map((i) => i + 1).filter((k) => !ok.has(k))).toEqual([]);
    const recovered = r.accepted.filter((a) => /previously undeliverable/i.test(a.text));
    expect(recovered.length).toBeGreaterThan(0);
  }, 300_000);

  it("the back-off is 1 h, 6 h, 24 h, 72 h: five emails over ~4 days, then nothing until a delivery is confirmed", async () => {
    const d = fakeDriver();
    const r = modelResend();
    r.fate = () => "suppressed";
    await addLead(d, 1);
    d.advance(10 * 60_000);
    const times: number[] = [];
    for (let h = 0; h < 24 * 8; h++) {
      const before = r.accepted.length;
      await run(d, r);
      if (r.accepted.length > before) times.push(Math.round((d.now() - Date.parse("2026-11-01T12:10:00Z")) / H));
      d.advance(H);
    }
    expect(times).toEqual([0, 1, 7, 31, 103]);
  }, 120_000);

  it("one recovery per delivered-confirmation event: no loop while the inbox keeps failing", async () => {
    const d = fakeDriver();
    const r = modelResend();
    r.fate = () => "suppressed";
    await addLead(d, 1);
    d.advance(10 * 60_000);
    for (let h = 0; h < 24 * 5; h++) {
      await run(d, r);
      d.advance(H);
    }
    const before = r.accepted.length;
    // One unrelated email is delivered, the rest still fail.
    let first = true;
    r.fate = () => {
      if (first) {
        first = false;
        return "delivered";
      }
      return "suppressed";
    };
    await addLead(d, 2);
    for (let h = 0; h < 48; h++) {
      await run(d, r);
      d.advance(H);
    }
    const after = r.accepted.filter((a) => leadsIn(a.text).has(1)).length;
    expect(r.accepted.length - before).toBeLessThanOrEqual(3);
    expect(after).toBeGreaterThanOrEqual(6);
  }, 120_000);
});

describe("R6-7 — an accepted email without an id is re-sent in the next digest, flagged", () => {
  it("no id → the lead is in the next digest marked unverifiable", async () => {
    const d = fakeDriver();
    const r = modelResend();
    r.noId = true;
    await addLead(d, 1);
    d.advance(10 * 60_000);
    await run(d, r);
    r.noId = false;
    d.advance(2 * H);
    await run(d, r);
    const digest = r.accepted.find((a) => a.key.startsWith("digest-"));
    expect(digest?.text).toContain("LEAD-1-END");
    expect(digest?.text).toMatch(/could not be verified/);
  });
});

describe("R6-5 — an id that keeps failing does not block the others", () => {
  it("one id answers 500 for ever: the others are checked; after 5 failures it is re-sent, flagged", async () => {
    const d = fakeDriver();
    const r = modelResend();
    let bad: string | null = null;
    r.lookup = (id) => {
      bad ??= id;
      return id === bad ? { error: "unavailable", status: 500 } : { event: r.fates.get(id) ?? "sent" };
    };
    for (let i = 0; i < 5; i++) {
      await addLead(d, 10 + i);
      d.advance(60_000);
    }
    d.advance(10 * 60_000);
    const log = captureLogger();
    for (let h = 0; h < 8; h++) {
      await run(d, r, log);
      d.advance(H);
    }
    const looked = new Set(r.calls.filter((c) => c.startsWith("lookup:")).map((c) => c.slice(7)));
    expect(looked.size).toBeGreaterThanOrEqual(5);
    expect(log.lines.some((l) => l.event === "notify_delivery_lookup_given_up")).toBe(true);
    expect(r.accepted.some((a) => a.key.startsWith("digest-") && /could not be verified/.test(a.text))).toBe(true);
  });
});

describe("R6-4 — a run ends within its budget", () => {
  it("slow sends: the run stops starting work at the budget and logs it", async () => {
    const d = fakeDriver();
    const r = modelResend();
    r.sendDelayMs = 100;
    for (let i = 0; i < 30; i++) {
      await addLead(d, 100 + i);
      d.advance(1_000);
    }
    d.advance(10 * 60_000);
    const log = captureLogger();
    const t0 = Date.now();
    const res = await run(d, r, log, { runBudgetMs: 600 });
    expect(res.status).toBe(200);
    expect(Date.now() - t0).toBeLessThan(2_000);
    expect(log.lines.some((l) => l.event === "notify_run_budget_reached")).toBe(true);
  });
});

describe("R6-1(d) — acknowledging requires CRON_SECRET and deletes nothing", () => {
  const ack = (init: RequestInit = {}, env: Env = cronEnv()) =>
    handleAckUndelivered(new Request("https://x.test/api/cron/ack-undelivered", init), { app: "zbm", env, logger: () => {}, transport: transportOf(fakeDriver().store, null) });
  it("GET is 405; no or wrong secret is 401; a missing or odd 'by' is 400", async () => {
    expect((await ack()).status).toBe(405);
    expect((await ack({ method: "POST", body: JSON.stringify({ by: "Andre" }), headers: { "content-type": "application/json" } })).status).toBe(401);
    expect((await ack({ method: "POST", body: JSON.stringify({ by: "Andre" }), headers: { "content-type": "application/json", authorization: "Bearer wrong" } })).status).toBe(401);
    expect((await ack({ method: "POST", body: JSON.stringify({}), headers: { "content-type": "application/json", authorization: `Bearer ${CRON}` } })).status).toBe(400);
    expect((await ack({ method: "POST", body: JSON.stringify({ by: "<script>" }), headers: { "content-type": "application/json", authorization: `Bearer ${CRON}` } })).status).toBe(400);
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
const freshStore = (startup?: string) =>
  postgresStore({ ...(base as PgOptions), connect_timeout: 200 + (++cn % 50), ...(startup ? { startup_options: startup } : {}) });

describe.skipIf(!url)("AEGIS r6 — undelivered leads, health codes, strict migrate (integration)", () => {
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
    await sql`DELETE FROM lead_delivery_checks`;
    await sql.end();
  });
  beforeEach(async () => {
    await sql`DELETE FROM leads`;
    await sql`DELETE FROM lead_delivery_checks`;
    resetHealthCache();
  });
  const opts = () => ({ app: "zbm" as const, env: cronEnv(), cacheMs: 0, logger: () => {}, ledger: { ...postgresPurger({ ...base!, connect_timeout: 90 }), lastSuccess: async () => new Date() } });
  const healthHttp = async () => {
    const res = await handleHealth(new Request("https://x.test/api/health"), opts() as never);
    return `${res.status}:${((await res.json()) as { status: string }).status}`;
  };
  const advance = async (ms: number) => {
    const iv = `${Math.round(ms / 1000)} seconds`;
    await sql`UPDATE leads SET created_at = created_at - ${iv}::interval,
      notify_first_attempt_at = notify_first_attempt_at - ${iv}::interval,
      notify_batch_at = notify_batch_at - ${iv}::interval,
      notify_next_at = notify_next_at - ${iv}::interval,
      notified_at = notified_at - ${iv}::interval,
      notify_undelivered_at = notify_undelivered_at - ${iv}::interval,
      notify_checked_at = notify_checked_at - ${iv}::interval`;
    await sql`UPDATE lead_delivery_checks SET failing_since = failing_since - ${iv}::interval`;
  };
  async function seed(count: number, status: string, startN: number, agoSec = 600) {
    const rows = Array.from({ length: count }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start",
      payload: sql.json({ name: `S ${i}`, problem: `LEAD-${startN + i}-END` }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: status,
      created_at: new Date(Date.now() - agoSec * 1000 + i).toISOString(),
    }));
    for (let i = 0; i < rows.length; i += 1000) {
      await sql`INSERT INTO leads ${sql(rows.slice(i, i + 1000), "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status", "created_at")}`;
    }
  }
  const cron = (r: Model) => handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), r.notifier), logger: () => {} });

  it("R6-1: suppressed for 2 days then fixed: health degraded throughout until acknowledged; 0 leads lost; ack records who and when, deletes nothing", async () => {
    const r = modelResend();
    let suppressed = true;
    r.fate = () => (suppressed ? "suppressed" : "delivered");
    let n = 0;
    const hs: string[] = [];
    for (let h = 0; h < 48; h++) {
      await seed(1, "failed", ++n);
      await cron(r);
      await advance(H);
    }
    // Push the remaining back-off waits past so every lead is abandoned.
    for (let i = 0; i < 6; i++) {
      await sql`UPDATE leads SET notify_next_at = NULL`;
      await cron(r);
      await advance(25 * H);
    }
    expect((await sql`SELECT count(*)::int AS c FROM leads WHERE notify_delivery = 'abandoned'`)[0]!.c).toBeGreaterThan(0);
    hs.push(await healthHttp());
    suppressed = false;
    await seed(1, "failed", ++n);
    for (let h = 0; h < 12; h++) {
      await cron(r);
      await advance(H);
      hs.push(await healthHttp());
    }
    // Ten days later, still degraded: no time-based clearing.
    await advance(10 * 24 * H);
    hs.push(await healthHttp());
    for (const h of hs) expect(h).toBe("503:leads_undelivered");
    const ok = deliveredLeads(r);
    expect([...Array(n).keys()].map((i) => i + 1).filter((k) => !ok.has(k))).toEqual([]);

    // The backlog report lists them (ids and dates only), never as plain "sent".
    const report = spawnSync("node", ["scripts/notify-backlog-report.mjs"], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: url!, POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });
    expect(report.status).toBe(0);
    expect(report.stdout).toMatch(/abandoned/);
    expect(report.stdout).toMatch(/not acknowledged/);

    const rows = (await sql`SELECT count(*)::int AS c FROM leads`)[0]!.c;
    const res = await handleAckUndelivered(
      new Request("https://x.test/api/cron/ack-undelivered", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${CRON}` }, body: JSON.stringify({ by: "Andre Love" }) }),
      { app: "zbm", env: cronEnv(), logger: () => {}, transport: transportOf(freshStore(), null) },
    );
    expect(res.status).toBe(200);
    expect(((await res.json()) as { acknowledged: number }).acknowledged).toBeGreaterThan(0);
    expect((await sql`SELECT count(*)::int AS c FROM leads`)[0]!.c).toBe(rows);
    expect((await sql`SELECT DISTINCT notify_ack_by FROM leads WHERE notify_abandoned_at IS NOT NULL`).map((x) => x.notify_ack_by)).toEqual(["Andre Love"]);
    expect(await healthHttp()).toBe("200:ok");
  }, 600_000);

  it("R6-2: a sending-only key with sent emails unconfirmed past the alert age is a 503, not a 200", async () => {
    const r = modelResend();
    r.lookup = () => ({ error: "unauthorized", status: 401 });
    await seed(1, "failed", 1);
    await cron(r);
    expect(await healthHttp()).toBe("200:delivery_unverifiable");
    await advance(2 * H);
    expect(await healthHttp()).toBe("503:delivery_unverifiable");
  }, 60_000);

  it("R6-7: an accepted email without an id keeps the warning until acknowledged (not 24 h)", async () => {
    const r = modelResend();
    r.noId = true;
    await seed(1, "failed", 1);
    await cron(r);
    r.noId = false;
    await sql`UPDATE leads SET notify_next_at = NULL`;
    await cron(r);
    await advance(30 * H);
    const s = (await purgeHealth(opts() as never)).status;
    expect(s).toBe("delivery_unverifiable");
  }, 60_000);

  it("R6-3: 2,600 expired leads under the forced bad plan: one run reports them all (no statement timeout)", async () => {
    await sql`ANALYZE leads`;
    await seed(2_600, "pending", 1, 4 * 86_400);
    const r = modelResend();
    const res = await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore("-c enable_hashjoin=off -c enable_mergejoin=off"), r.notifier), logger: () => {} });
    expect(res.status).toBe(200);
    expect((await sql`SELECT DISTINCT notify_status FROM leads`).map((x) => x.notify_status)).toEqual(["expired_reported"]);
  }, 120_000);

  it("R6-6: migrate refuses non-literal ORs, extra constraints on the notify columns, and a wrong lead_delivery_checks", async () => {
    const admin = postgres({ host: base!.host, port: base!.port, database: base!.database, username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await admin.unsafe("DROP DATABASE IF EXISTS leads_r6_check");
    await admin.unsafe("CREATE DATABASE leads_r6_check");
    await admin.end();
    const u = new URL(url!);
    u.pathname = "/leads_r6_check";
    const migrate = () => spawnSync("node", ["scripts/migrate.mjs"], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: u.toString(), POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });
    expect(migrate().status).toBe(0);
    const db = postgres({ host: base!.host, port: base!.port, database: "leads_r6_check", username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    const statuses = "'pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify', 'expired_reported'";
    const deliveries = "'delivered', 'undelivered', 'unconfirmed', 'abandoned', 'unverifiable'";
    const cases: [string, string, string][] = [
      ["status OR length", `ALTER TABLE leads DROP CONSTRAINT leads_notify_status_check; ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check CHECK (notify_status IN (${statuses}) OR length(notify_status) = 42)`, `ALTER TABLE leads DROP CONSTRAINT leads_notify_status_check; ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check CHECK (notify_status IN (${statuses}))`],
      ["delivery OR length", `ALTER TABLE leads DROP CONSTRAINT leads_notify_delivery_check; ALTER TABLE leads ADD CONSTRAINT leads_notify_delivery_check CHECK (notify_delivery IS NULL OR notify_delivery IN (${deliveries}) OR length(notify_delivery) > 0)`, `ALTER TABLE leads DROP CONSTRAINT leads_notify_delivery_check; ALTER TABLE leads ADD CONSTRAINT leads_notify_delivery_check CHECK (notify_delivery IS NULL OR notify_delivery IN (${deliveries}))`],
      ["extra constraint", `ALTER TABLE leads ADD CONSTRAINT no_abandon CHECK (notify_delivery IS DISTINCT FROM 'abandoned')`, `ALTER TABLE leads DROP CONSTRAINT no_abandon`],
      ["checks table column", `ALTER TABLE lead_delivery_checks DROP COLUMN failing_since`, `ALTER TABLE lead_delivery_checks ADD COLUMN failing_since timestamptz`],
    ];
    for (const [label, breakIt, fixIt] of cases) {
      await db.unsafe(breakIt);
      const res = migrate();
      expect(res.status, label).toBe(1);
      await db.unsafe(fixIt);
      expect(migrate().status, `${label} fixed`).toBe(0);
    }
    await db.end();
  }, 120_000);
});
