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
import { purgeHealth, resetHealthCache } from "../src/retention";
import { DeliveryError, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type LookupResult, type NotifyOutbox } from "../src/types";
import { captureLogger, tempOutbox } from "./helpers";

/**
 * AEGIS r7 (scratchpad/night/aegis-site-redteam-fixes-r7.md), made into
 * assertions. Written before the fixes.
 *
 *   R7-1  automatic recovery is bounded per lead: at most once a day, at most
 *         5 times, each recovered lead in its own email.
 *   R7-2  the acknowledgement covers only what the founder saw (a cutoff the
 *         report prints, or explicit ids); exact counts; an append-only
 *         history; the actor is the secret's holder, not free text.
 *   R7-3  rows abandoned before migration 011 are still counted.
 *   R7-4  migrate checks nullability, defaults, extra columns and triggers.
 *   R7-5  each run keeps time for delivery lookups, even under a send backlog.
 *   R7-6  the privacy policy's timing is true on the shipped schedule.
 *   R7-7  an abandoned lead later confirmed delivered no longer needs an acknowledgement.
 */

const CRON = "k".repeat(32);
const H = 3_600_000;
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });
const tokens = formTokens("aegis-r7-form-secret-0123456789abcdef");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const leadsIn = (text: string) => new Set([...text.matchAll(/LEAD-(\d+)-END/g)].map((m) => Number(m[1])));

function modelResend() {
  const keys = new Map<string, { body: string; id: string }>();
  const accepted: { key: string; id: string; text: string; fate: string }[] = [];
  const fates = new Map<string, string>();
  const calls: string[] = [];
  const m = {
    fate: (_text: string): string => "delivered",
    sendDelayMs: 0,
    lookup: (id: string): LookupResult => ({ event: fates.get(id) ?? "sent" }),
    accepted,
    calls,
    notifier: null as unknown as LeadNotifier,
  };
  m.notifier = {
    async send(email: LeadEmail, key: string) {
      calls.push(`send:${key}`);
      if (m.sendDelayMs) await new Promise((r) => setTimeout(r, m.sendDelayMs));
      const body = JSON.stringify(email);
      const prev = keys.get(key);
      if (prev) {
        if (prev.body !== body) throw new DeliveryError("notify_rejected", 409);
        return { id: prev.id };
      }
      const id = randomUUID();
      keys.set(key, { body, id });
      const fate = m.fate(email.text);
      fates.set(id, fate);
      accepted.push({ key, id, text: email.text, fate });
      return { id };
    },
    async lastEvent(id: string) {
      calls.push(`lookup:${id}`);
      return m.lookup(id);
    },
  };
  return m;
}
type Model = ReturnType<typeof modelResend>;
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
async function addLead(d: Driver, n: number) {
  const rec = record(n);
  await d.store.insert(rec);
  await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
  return rec.submission_id;
}

describe("R7-1 — automatic recovery is bounded per lead", () => {
  it("a lead whose own email always bounces: at most 5 recovery emails in 14 days, apart from new leads; every other lead delivered", async () => {
    const d = fakeDriver();
    const r = modelResend();
    r.fate = (text) => (text.includes("LEAD-1-END") ? "bounced" : "delivered");
    let n = 1;
    await addLead(d, 1);
    for (let h = 0; h < 24 * 14; h++) {
      await addLead(d, ++n);
      d.advance(10 * 60_000);
      await run(d, r);
      d.advance(50 * 60_000);
    }
    const poison = r.accepted.filter((a) => leadsIn(a.text).has(1));
    const recoveries = poison.filter((a) => /PREVIOUSLY UNDELIVERABLE/.test(a.text));
    expect(poison.length).toBeLessThanOrEqual(1 + 4 + 5);
    expect(recoveries.length).toBeGreaterThan(0);
    expect(recoveries.length).toBeLessThanOrEqual(5);
    // Recovered leads travel apart from new leads: they cannot make them bounce.
    for (const a of recoveries) expect([...leadsIn(a.text)]).toEqual([1]);
    const ok = new Set<number>();
    for (const a of r.accepted) if (a.fate === "delivered") for (const k of leadsIn(a.text)) ok.add(k);
    expect([...Array(n - 1).keys()].map((i) => i + 2).filter((k) => !ok.has(k))).toEqual([]);
  }, 300_000);
});

describe("R7-5 — every run keeps time for delivery lookups", () => {
  it("a send backlog that fills the send window still leaves lookups in every run", async () => {
    const d = fakeDriver();
    const r = modelResend();
    // Emails are never confirmed, so there is always something to look up;
    // each digest takes 400 ms, so the sends alone overrun the send window.
    // Scaled to a 5 s budget: a send takes 690 ms (as an 8 s send timeout
    // would at 50 s), a lookup 150 ms. The old schedule started a send at
    // 3.45 s that ended at 4.14 s, leaving the check 60 ms (one lookup).
    r.lookup = () => ({ event: "sent" });
    r.sendDelayMs = 690;
    const lookupNow = r.notifier.lastEvent!;
    r.notifier.lastEvent = async (id) => {
      await new Promise((res) => setTimeout(res, 150));
      return lookupNow(id);
    };
    let n = 1000;
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < 1000; i++) {
        const rec = record(++n);
        await d.store.insert(rec);
        await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
      }
      r.calls.length = 0;
      await run(d, r, captureLogger(), { runBudgetMs: 5_000 });
      if (k > 0) expect(r.calls.filter((c) => c.startsWith("lookup:")).length, `run ${k}`).toBeGreaterThanOrEqual(3);
      d.advance(H);
    }
  }, 60_000);
});

describe("R7-2 — the acknowledgement covers only what was seen", () => {
  const post = (body: unknown, auth = `Bearer ${CRON}`) =>
    new Request("https://x.test/api/cron/ack-undelivered", { method: "POST", headers: { authorization: auth, "content-type": "application/json", "x-forwarded-for": "198.51.100.9" }, body: JSON.stringify(body) });
  it("needs a cutoff ('through') or explicit ids; free text alone is refused", async () => {
    const t = transportOf(fakeDriver().store, null);
    for (const body of [{}, { by: "Andre" }, { through: "yesterday" }, { ids: ["not-a-uuid"] }]) {
      expect((await handleAckUndelivered(post(body), { app: "zbm", env: cronEnv(), transport: t, logger: () => {} })).status, JSON.stringify(body)).toBe(400);
    }
  });
  it("with LEAD_ACK_SECRET set, CRON_SECRET no longer acknowledges", async () => {
    const t = transportOf(fakeDriver().store, null);
    const env = cronEnv({ LEAD_ACK_SECRET: "a".repeat(32) });
    expect((await handleAckUndelivered(post({ through: new Date().toISOString() }), { app: "zbm", env, transport: t, logger: () => {} })).status).toBe(401);
    expect((await handleAckUndelivered(post({ through: new Date().toISOString() }, `Bearer ${"a".repeat(32)}`), { app: "zbm", env, transport: t, logger: () => {} })).status).toBe(200);
  });
});

describe("R7-6 — the privacy policy's timing is true on the shipped schedule", () => {
  it("says the four re-sends take about four days only with hourly checks, longer otherwise", () => {
    const text = readFileSync(path.join(import.meta.dirname, "..", "..", "..", "apps", "zbm", "lib", "legal.ts"), "utf8");
    expect(text).not.toMatch(/up to four times over about four days, and/);
    expect(text).toMatch(/up to four times/);
    expect(text).toMatch(/hourly/);
    expect(text).toMatch(/longer/);
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
const freshStore = () => postgresStore({ ...(base as PgOptions), connect_timeout: 250 + (++cn % 40) });
const SQL_DIR = path.join(import.meta.dirname, "..", "sql");

describe.skipIf(!url)("AEGIS r7 — scoped acknowledgement, history, backfill, strict migrate, health (integration)", () => {
  let sql: postgres.Sql;
  beforeAll(async () => {
    const o = base!;
    sql = postgres({ host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl, max: 4, onnotice: () => {} });
    for (const f of readdirSync(SQL_DIR).filter((x) => /^\d{3}_.+\.sql$/.test(x)).sort()) await sql.unsafe(readFileSync(path.join(SQL_DIR, f), "utf8"));
  }, 60_000);
  afterAll(async () => {
    await sql`DELETE FROM leads`;
    await sql.end();
  });
  beforeEach(async () => {
    await sql`DELETE FROM leads`;
    await sql`DELETE FROM lead_delivery_checks`;
    await sql`DELETE FROM lead_acks`.catch(() => {});
    resetHealthCache();
  });
  const health = async () =>
    (await purgeHealth({ app: "zbm", env: cronEnv(), cacheMs: 0, logger: () => {}, ledger: { ...postgresPurger({ ...base!, connect_timeout: 89 }), lastSuccess: async () => new Date() } } as never)).status;
  async function seedAbandoned(count: number, abandonedAgo: string, startN = 1) {
    const rows = Array.from({ length: count }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start", payload: sql.json({ problem: `LEAD-${startN + i}-END` }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: "sent",
    }));
    for (let i = 0; i < rows.length; i += 1000) {
      await sql`INSERT INTO leads ${sql(rows.slice(i, i + 1000), "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status")}`;
    }
    await sql`UPDATE leads SET notify_delivery = 'abandoned', notify_resends = 4, notify_email_id = 'x',
      notify_abandoned_at = now() - ${abandonedAgo}::interval, notify_undelivered_at = now() - ${abandonedAgo}::interval
      WHERE submission_id = ANY(${rows.map((r) => r.submission_id)}::uuid[])`;
    return rows.map((r) => r.submission_id);
  }
  const ack = (body: unknown) =>
    handleAckUndelivered(
      new Request("https://x.test/api/cron/ack-undelivered", { method: "POST", headers: { authorization: `Bearer ${CRON}`, "content-type": "application/json", "x-forwarded-for": "198.51.100.9" }, body: JSON.stringify(body) }),
      { app: "zbm", env: cronEnv({ LEAD_TRUSTED_PROXY: "x-forwarded-for" }), transport: transportOf(freshStore(), null), logger: () => {} },
    );
  const report = (args: string[] = []) =>
    spawnSync("node", ["scripts/notify-backlog-report.mjs", ...args], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: url!, POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });

  it("R7-2: the report prints exact counts (600 > any page) and a cutoff; ack through that cutoff leaves a later abandonment unacknowledged; history is append-only", async () => {
    await seedAbandoned(600, "2 hours");
    const rep = report();
    expect(rep.status).toBe(0);
    expect(rep.stdout).toMatch(/600 \(600 not acknowledged\)/);
    const through = /acknowledge through: (\S+)/.exec(rep.stdout)?.[1];
    expect(through).toBeTruthy();
    expect(report(["--page=3"]).stdout).toMatch(/page 3 of 3/);
    // A new lead is abandoned AFTER the founder read the report.
    const [late] = await seedAbandoned(1, "0 seconds", 9000);
    const res = await ack({ through });
    expect(res.status).toBe(200);
    expect(((await res.json()) as { acknowledged: number }).acknowledged).toBe(600);
    expect((await sql`SELECT notify_ack_at FROM leads WHERE submission_id = ${late!}::uuid`)[0]!.notify_ack_at).toBeNull();
    expect(await health()).toBe("leads_undelivered");
    const [h] = await sql`SELECT actor, ip_hash, acknowledged, through FROM lead_acks`;
    expect(h!.actor).toBe("cron-secret holder");
    expect(String(h!.ip_hash)).toMatch(/^[0-9a-f]{16,}$/);
    expect(h!.acknowledged).toBe(600);
    // Explicit ids; a re-abandonment never erases the history.
    expect(((await (await ack({ ids: [late] })).json()) as { acknowledged: number }).acknowledged).toBe(1);
    await sql`UPDATE leads SET notify_ack_at = NULL, notify_ack_by = NULL WHERE submission_id = ${late!}::uuid`;
    expect((await sql`SELECT count(*)::int AS c FROM lead_acks`)[0]!.c).toBe(2);
  }, 120_000);

  it("R7-7: an abandoned lead that is later confirmed delivered no longer keeps health degraded", async () => {
    await seedAbandoned(2, "2 days");
    expect(await health()).toBe("leads_undelivered");
    const r = modelResend();
    // One delivered email confirms the inbox; the abandoned leads are recovered and delivered.
    const rec = record(50);
    const s = freshStore();
    await s.insert(rec);
    await s.setNotifyStatus("zbm", rec.submission_id, "failed");
    await sql`UPDATE leads SET created_at = now() - interval '10 minutes' WHERE submission_id = ${rec.submission_id}::uuid`;
    for (let i = 0; i < 3; i++) {
      await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), r.notifier), logger: () => {} });
      await sql`UPDATE leads SET notify_next_at = NULL`;
    }
    expect((await sql`SELECT count(*)::int AS c FROM leads WHERE notify_delivery = 'delivered'`)[0]!.c).toBe(3);
    expect(await health()).toBe("ok");
  }, 60_000);

  const migrateDb = async (name: string) => {
    const admin = postgres({ host: base!.host, port: base!.port, database: base!.database, username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await admin.unsafe(`DROP DATABASE IF EXISTS ${name}`);
    await admin.unsafe(`CREATE DATABASE ${name}`);
    await admin.end();
    const u = new URL(url!);
    u.pathname = `/${name}`;
    const db = postgres({ host: base!.host, port: base!.port, database: name, username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    const migrate = () => spawnSync("node", ["scripts/migrate.mjs"], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: u.toString(), POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });
    return { db, migrate };
  };

  it("R7-3: rows abandoned or unverifiable under migration 010 are dated by the later migrations, so health and the report see them", async () => {
    const { db, migrate } = await migrateDb("leads_r7_backfill");
    await db`CREATE TABLE schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
    for (const f of readdirSync(SQL_DIR).filter((x) => /^\d{3}_.+\.sql$/.test(x) && Number(x.slice(0, 3)) <= 10).sort()) {
      await db.unsafe(readFileSync(path.join(SQL_DIR, f), "utf8"));
      await db`INSERT INTO schema_migrations (version) VALUES (${f.slice(0, 3)})`;
    }
    await db`INSERT INTO leads (submission_id, app, form, payload, payload_hash, notify_status, notify_delivery, notified_at, notify_undelivered_at)
      VALUES (gen_random_uuid(), 'zbm', 'start', '{}', 'h', 'sent', 'abandoned', now() - interval '2 days', now() - interval '1 day'),
             (gen_random_uuid(), 'zbm', 'start', '{}', 'h', 'sent', 'unverifiable', now() - interval '3 hours', NULL)`;
    const res = migrate();
    expect(res.status, res.stderr).toBe(0);
    const rows = await db`SELECT notify_delivery, notify_abandoned_at IS NOT NULL AS a, notify_unverifiable_at IS NOT NULL AS u FROM leads ORDER BY notify_delivery`;
    expect(rows.map((r) => [r.notify_delivery, r.a, r.u])).toEqual([["abandoned", true, false], ["unverifiable", false, true]]);
    await db.end();
  }, 90_000);

  it("R7-4: migrate refuses a nullable or default-less counter, an extra NOT NULL column without a default, a trigger, and a missing index", async () => {
    const { db, migrate } = await migrateDb("leads_r7_strict");
    expect(migrate().status).toBe(0);
    const cases: [string, string, string][] = [
      ["nullable counter", "ALTER TABLE leads ALTER COLUMN notify_lookup_failures DROP NOT NULL", "ALTER TABLE leads ALTER COLUMN notify_lookup_failures SET NOT NULL"],
      ["no default", "ALTER TABLE leads ALTER COLUMN notify_resends DROP DEFAULT", "ALTER TABLE leads ALTER COLUMN notify_resends SET DEFAULT 0"],
      ["extra NOT NULL column", "ALTER TABLE lead_delivery_checks ADD COLUMN extra text NOT NULL DEFAULT 'x'; ALTER TABLE lead_delivery_checks ALTER COLUMN extra DROP DEFAULT", "ALTER TABLE lead_delivery_checks DROP COLUMN extra"],
      ["trigger", `CREATE FUNCTION r7_block() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$; CREATE TRIGGER r7_block BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION r7_block()`, "DROP TRIGGER r7_block ON leads; DROP FUNCTION r7_block()"],
      ["missing index", "DROP INDEX leads_app_unacked_idx", "CREATE INDEX leads_app_unacked_idx ON leads (app) WHERE notify_ack_at IS NULL AND (notify_abandoned_at IS NOT NULL OR notify_unverifiable_at IS NOT NULL)"],
    ];
    for (const [label, breakIt, fixIt] of cases) {
      await db.unsafe(breakIt);
      expect(migrate().status, label).toBe(1);
      await db.unsafe(fixIt);
      expect(migrate().status, `${label} fixed`).toBe(0);
    }
    await db.end();
  }, 120_000);
});
