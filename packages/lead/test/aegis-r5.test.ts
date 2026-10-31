import { createHash, randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { type Env, type TransportConfig } from "../src/config";
import { fakeStore } from "../src/fake";
import { formTokens } from "../src/form-token";
import { handleNotifyRetry } from "../src/notify-retry";
import { parsePostgresUrl, type PgOptions } from "../src/pg-url";
import { postgresPurger, postgresStore } from "../src/postgres";
import { handleHealth, purgeHealth, resetHealthCache } from "../src/retention";
import { DeliveryError, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type LookupResult, type NotifyOutbox } from "../src/types";
import { captureLogger, tempOutbox } from "./helpers";

/**
 * AEGIS r5 (scratchpad/night/aegis-site-redteam-fixes-r5.md), made into
 * assertions. Written before the fixes.
 *
 *   N1  a digest batch never exceeds its limit, whatever plan Postgres picks.
 *   N2  a sending-only Resend key (401/403 on lookup) is its own health
 *       warning and stops re-sends; re-sends of undelivered leads back off
 *       and stop after 3, then health is degraded with an alert.
 *   N3  failed lookups are logged; failing for over 6 h degrades health.
 *   N4  a success without a usable id is an unknown outcome: flagged, warning.
 *   N5  the privacy policy matches the code.
 *   N6  the delivery check runs after sending, time-boxed; maxDuration set.
 *   N7  migrate requires the exact allowed set for both CHECKs.
 */

const CRON = "k".repeat(32);
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });
const tokens = formTokens("aegis-r5-form-secret-0123456789abcdef");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const ROOT = path.join(import.meta.dirname, "..", "..", "..");

/** Resend, modelled, with a configurable lookup answer per id (default delivered). */
function modelResend(opts: { lookup?: (id: string) => LookupResult | Promise<LookupResult>; noId?: boolean } = {}) {
  const keys = new Map<string, { body: string; id: string }>();
  const accepted: { key: string; id: string; subject: string; text: string }[] = [];
  const calls: string[] = [];
  const notifier: LeadNotifier = {
    async send(email: LeadEmail, key: string) {
      calls.push(`send:${key}`);
      const body = JSON.stringify(email);
      const prev = keys.get(key);
      if (prev) {
        if (prev.body !== body) throw new DeliveryError("notify_rejected", 409);
        return opts.noId ? {} : { id: prev.id };
      }
      const id = randomUUID();
      keys.set(key, { body, id });
      accepted.push({ key, id, subject: email.subject, text: email.text });
      return opts.noId ? {} : { id };
    },
    async lastEvent(id: string) {
      calls.push(`lookup:${id}`);
      return opts.lookup ? opts.lookup(id) : { event: "delivered" };
    },
  };
  return { notifier, accepted, calls };
}
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
const run = (d: ReturnType<typeof fakeDriver>, notifier: LeadNotifier, log = captureLogger(), extra: Record<string, unknown> = {}) =>
  handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(d.store, notifier), now: () => new Date(d.now()), logger: log.logger, ...extra }).then(
    (r) => r.json() as Promise<Record<string, unknown>>,
  );
const leadEmails = (accepted: { text: string }[], n: number) => accepted.filter((a) => a.text.includes(`LEAD-${n}-END`)).length;

describe("N2 — a sending-only key stops re-sends; re-sends of undelivered leads are capped", () => {
  it("lookups answered 401 (restricted key): five days of hourly runs email each lead exactly once", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => ({ error: "unauthorized", status: 401 }) });
    for (let i = 0; i < 3; i++) {
      const rec = record(i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    }
    const log = captureLogger();
    for (let h = 0; h < 120; h++) {
      await run(d, resend.notifier, log);
      d.advance(3_600_000);
    }
    for (let i = 0; i < 3; i++) expect(leadEmails(resend.accepted, i)).toBe(1);
    expect(log.lines.some((l) => l.event === "notify_delivery_unverifiable")).toBe(true);
  }, 60_000);

  it("a suppressed inbox: each lead is re-sent at most 3 times with backoff, then abandoned with an error alert", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => ({ event: "suppressed" }) });
    const rec = record(7);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    const log = captureLogger();
    for (let h = 0; h < 120; h++) {
      await run(d, resend.notifier, log);
      d.advance(3_600_000);
    }
    expect(leadEmails(resend.accepted, 7)).toBe(4);
    expect(log.lines.some((l) => l.level === "error" && l.event === "notify_delivery_abandoned")).toBe(true);
  }, 60_000);

  it("re-sends are spaced out (backoff), not every run", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => ({ event: "bounced" }) });
    const rec = record(8);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    for (let h = 0; h < 6; h++) {
      await run(d, resend.notifier);
      d.advance(3_600_000);
    }
    expect(leadEmails(resend.accepted, 8)).toBeLessThanOrEqual(3);
  });

  it("emails still pending (lookups work, event never final) are re-sent only after 48 h and within the cap", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => ({ event: "sent" }) });
    const rec = record(9);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    for (let h = 0; h < 47; h++) {
      await run(d, resend.notifier);
      d.advance(3_600_000);
    }
    expect(leadEmails(resend.accepted, 9)).toBe(1);
    for (let h = 0; h < 24 * 20; h++) {
      await run(d, resend.notifier);
      d.advance(3_600_000);
    }
    expect(leadEmails(resend.accepted, 9)).toBe(4);
  }, 120_000);
});

describe("N3 — failed lookups are logged", () => {
  it("a 503 on lookup logs a warning with the status and stops this run's checks", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => ({ error: "unavailable", status: 503 }) });
    for (let i = 0; i < 2; i++) {
      const rec = record(20 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    }
    await run(d, resend.notifier);
    const log = captureLogger();
    d.advance(3_600_000);
    await run(d, resend.notifier, log);
    const failed = log.lines.filter((l) => l.event === "notify_delivery_lookup_failed");
    expect(failed).toHaveLength(1);
    expect(failed[0]!.fields).toMatchObject({ status: 503 });
  });

  it("a 404 for one id does not block the others", async () => {
    const d = fakeDriver();
    let first = true;
    const resend = modelResend({
      lookup: () => {
        if (first) {
          first = false;
          return { error: "not_found", status: 404 };
        }
        return { event: "delivered" };
      },
    });
    for (let i = 0; i < 3; i++) {
      const rec = record(30 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
      d.advance(60_000);
    }
    d.advance(10 * 60_000);
    await run(d, resend.notifier);
    const looked = new Set(resend.calls.filter((c) => c.startsWith("lookup:")).map((c) => c.slice(7)));
    expect(looked).toEqual(new Set(resend.accepted.map((a) => a.id)));
    expect(looked.size).toBe(3);
  });
});

describe("N4 — a success without a usable id is an unknown outcome", () => {
  it("logged at error, recorded unverifiable", async () => {
    const d = fakeDriver();
    const resend = modelResend({ noId: true });
    const rec = record(40);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    d.advance(10 * 60_000);
    const log = captureLogger();
    await run(d, resend.notifier, log);
    expect(log.lines.some((l) => l.level === "error" && l.event === "notify_sent_without_id")).toBe(true);
    expect(resend.calls.filter((c) => c.startsWith("lookup:"))).toHaveLength(0);
  });
});

describe("N6 — the delivery check runs after sending, time-boxed", () => {
  it("digests go out before any lookup; lookups stop at the budget", async () => {
    const d = fakeDriver();
    const resend = modelResend({ lookup: () => new Promise((r) => setTimeout(() => r({ event: "sent" }), 120)) });
    for (let i = 0; i < 10; i++) {
      const rec = record(50 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
      d.advance(60_000);
    }
    d.advance(10 * 60_000);
    await run(d, resend.notifier);
    d.advance(3_600_000);
    for (let i = 0; i < 2; i++) {
      const rec = record(70 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    }
    resend.calls.length = 0;
    await run(d, resend.notifier, captureLogger(), { deliveryBudgetMs: 300 });
    const firstLookup = resend.calls.findIndex((c) => c.startsWith("lookup:"));
    const lastSend = resend.calls.map((c) => c.startsWith("send:")).lastIndexOf(true);
    expect(lastSend).toBeGreaterThanOrEqual(0);
    expect(firstLookup).toBeGreaterThan(lastSend);
    expect(resend.calls.filter((c) => c.startsWith("lookup:")).length).toBeLessThanOrEqual(4);
  });

  it("both cron routes of both apps export maxDuration = 60 (valid on Hobby and Pro, with or without Fluid compute)", () => {
    for (const app of ["zbm", "zbc"]) {
      for (const route of ["retry-notify", "purge-leads"]) {
        const src = readFileSync(path.join(ROOT, "apps", app, "app", "api", "cron", route, "route.ts"), "utf8");
        expect(src, `${app} ${route}`).toMatch(/export const maxDuration = 60;/);
      }
    }
  });
});

describe("N5 — the privacy policy matches the code", () => {
  it("count only for submissions the retry system first reaches after 3 days; 'whether our emails were delivered'", () => {
    const text = readFileSync(path.join(ROOT, "apps", "zbm", "lib", "legal.ts"), "utf8");
    expect(text).not.toMatch(/If a submission still could not be emailed to us within 3 days/);
    expect(text).not.toMatch(/whether each email was delivered/);
    expect(text).toMatch(/whether our emails were delivered/);
    expect(text).toMatch(/first gets to it more than 3 days/);
    expect(text).toMatch(/up to three times/);
    expect(text).not.toMatch(/\bdraft\b|attorney review|pending legal review/i);
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
  postgresStore({ ...(base as PgOptions), connect_timeout: 160 + ++cn, ...(startup ? { startup_options: startup } : {}) });

describe.skipIf(!url)("AEGIS r5 — batch limit under any plan, delivery-check health, exact CHECKs (integration)", () => {
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
    await sql`DELETE FROM lead_delivery_checks`.catch(() => {});
    await sql.end();
  });
  beforeEach(async () => {
    await sql`DELETE FROM leads`;
    await sql`DELETE FROM lead_delivery_checks`.catch(() => {});
    resetHealthCache();
  });
  const health = () => {
    const purger = postgresPurger({ ...base!, connect_timeout: 92 });
    return purgeHealth({ app: "zbm", env: cronEnv(), cacheMs: 0, logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } } as never);
  };
  const healthResponse = () => {
    const purger = postgresPurger({ ...base!, connect_timeout: 91 });
    return handleHealth(new Request("https://x.test/api/health"), { app: "zbm", env: cronEnv(), cacheMs: 0, logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } } as never);
  };
  async function seed(count: number, status: string) {
    const rows = Array.from({ length: count }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start",
      payload: sql.json({ name: `S ${i}`, problem: `S ${i}` }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: status,
      created_at: new Date(Date.now() - (3600 - i) * 1000).toISOString(),
    }));
    await sql`INSERT INTO leads ${sql(rows, "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status", "created_at")}`;
  }

  it("N1: under a nested-loop plan with empty-table statistics, every digest has at most 100 leads (250 → 100, 100, 50)", async () => {
    await sql`ANALYZE leads`;
    await seed(250, "deferred");
    const resend = modelResend();
    const store = freshStore("-c enable_hashjoin=off -c enable_mergejoin=off");
    const res = await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(store, resend.notifier) });
    expect(res.status).toBe(200);
    const sizes = resend.accepted.filter((a) => a.key.startsWith("digest-")).map((a) => Number(/· (\d+) leads/.exec(a.subject)![1]));
    expect(sizes).toEqual([100, 100, 50]);
    const batches = await sql`SELECT notify_batch, count(*)::int AS n FROM leads GROUP BY 1`;
    for (const b of batches) expect(b.n).toBeLessThanOrEqual(100);
  }, 60_000);

  it("N2: lookups answered 401 make health a warning (200, delivery_unverifiable), not degraded", async () => {
    await seed(1, "deferred");
    const resend = modelResend({ lookup: () => ({ error: "unauthorized", status: 401 }) });
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) });
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) });
    expect((await health()).status).toBe("delivery_unverifiable");
    const res = await healthResponse();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, status: "delivery_unverifiable" });
  }, 60_000);

  it("N3: lookups failing for over 6 h degrade health (delivery_check_failing); a success clears it", async () => {
    await seed(1, "deferred");
    let down = true;
    const resend = modelResend({ lookup: () => (down ? { error: "unavailable", status: 503 } : { event: "delivered" }) });
    const go = () => handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) });
    await go();
    await go();
    expect((await health()).status).toBe("ok");
    await sql`UPDATE lead_delivery_checks SET failing_since = now() - interval '7 hours'`;
    expect((await health()).status).toBe("delivery_check_failing");
    down = false;
    await go();
    expect((await health()).status).toBe("ok");
  }, 60_000);

  it("N4: an accepted send without an id makes health a warning", async () => {
    await seed(1, "deferred");
    const resend = modelResend({ noId: true });
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) });
    expect((await health()).status).toBe("delivery_unverifiable");
  }, 60_000);

  it("N2: a lead abandoned after 3 re-sends degrades health (delivery_failed) even after 24 h", async () => {
    await seed(1, "sent");
    await sql`UPDATE leads SET notify_delivery = 'abandoned', notify_undelivered_at = now() - interval '3 days', notified_at = now() - interval '3 days'`;
    expect((await health()).status).toBe("delivery_failed");
  });

  it("N7: migrate requires the exact allowed set for both CHECKs (an extra value or a missing delivery CHECK fails)", async () => {
    const admin = postgres({ host: base!.host, port: base!.port, database: base!.database, username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await admin.unsafe("DROP DATABASE IF EXISTS leads_r5_check");
    await admin.unsafe("CREATE DATABASE leads_r5_check");
    await admin.end();
    const u = new URL(url!);
    u.pathname = "/leads_r5_check";
    const migrate = () => spawnSync("node", ["scripts/migrate.mjs"], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: u.toString(), POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });
    expect(migrate().status).toBe(0);
    const db = postgres({ host: base!.host, port: base!.port, database: "leads_r5_check", username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await db.unsafe(`ALTER TABLE leads DROP CONSTRAINT leads_notify_status_check;
      ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify', 'expired_reported', 'bogus'))`);
    const extra = migrate();
    expect(extra.status).toBe(1);
    expect(extra.stderr).toContain("leads_notify_status_check");
    expect(extra.stderr).toContain("bogus");
    await db.unsafe(`ALTER TABLE leads DROP CONSTRAINT leads_notify_status_check;
      ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify', 'expired_reported'));
      ALTER TABLE leads DROP CONSTRAINT leads_notify_delivery_check`);
    const noDelivery = migrate();
    expect(noDelivery.status).toBe(1);
    expect(noDelivery.stderr).toContain("leads_notify_delivery_check");
    await db.end();
  }, 90_000);
});
