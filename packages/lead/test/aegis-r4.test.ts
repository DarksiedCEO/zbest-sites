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
import { resendNotifier } from "../src/resend";
import { purgeHealth } from "../src/retention";
import { DeliveryError, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus } from "../src/types";
import { captureLogger, readJsonl, tempOutbox } from "./helpers";

/**
 * AEGIS r4 (scratchpad/night/aegis-site-redteam-fixes-r4.md), made into
 * assertions. Written before the fixes.
 *
 *   M1  health counts every unsent lead, however old.
 *   M2  a delivery signal: the Resend email id of every accepted send is
 *       stored, the cron reads its last_event, and bounced / complained /
 *       suppressed / failed is "not delivered": health delivery_failed, the
 *       lead back in the next digest, flagged, and an error log.
 *   L1  batch statements lock rows in id order: concurrent crons never deadlock.
 *   L2  a 409 is never taken as "accepted".
 *   L3  the expired count batch never loads payloads.
 *   L4  migrate verifies the notify-status CHECK.
 *   L5  the privacy policy says what really happens.
 *   L6  only a genuinely unknown outcome is flagged "may already have been emailed".
 */

const CRON = "k".repeat(32);
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });
const tokens = formTokens("aegis-r4-form-secret-0123456789abcdef");
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

type Act = "ok" | "down" | "accept-timeout" | "timeout" | "inflight";
/**
 * Resend, modelled: accepted keys are kept (same key + same body replays the
 * original response with its id; different body → 409). "inflight" answers
 * 409 as for a concurrent request with the same key and accepts nothing.
 * Every accepted email gets an id; `events` sets an id's last_event.
 */
function modelResend(pick: () => Act = () => "ok") {
  const keys = new Map<string, { body: string; id: string }>();
  const accepted: { key: string; id: string; subject: string; text: string }[] = [];
  const events = new Map<string, string>();
  const lookups: string[] = [];
  const notifier: LeadNotifier = {
    async send(email: LeadEmail, key: string) {
      const body = JSON.stringify(email);
      const prev = keys.get(key);
      if (prev) {
        if (prev.body !== body) throw new DeliveryError("notify_rejected", 409);
        return { id: prev.id };
      }
      const act = pick();
      if (act === "down") throw new DeliveryError("notify_rejected", 500);
      if (act === "timeout") throw new DeliveryError("notify_unreachable");
      if (act === "inflight") throw new DeliveryError("notify_rejected", 409);
      const id = randomUUID();
      keys.set(key, { body, id });
      accepted.push({ key, id, subject: email.subject, text: email.text });
      if (act === "accept-timeout") throw new DeliveryError("notify_unreachable");
      return { id };
    },
    async lastEvent(id: string) {
      lookups.push(id);
      return { event: events.get(id) ?? model.defaultEvent };
    },
  };
  // Since AEGIS r5 N6 the check runs at the END of the same run, so a test
  // sets the event an email will report before the run that sends it.
  const model = { notifier, accepted, events, lookups, keys, defaultEvent: "delivered" };
  return model;
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
  const dir = tempOutbox();
  let clock = Date.parse("2026-11-01T12:00:00Z");
  const store = fakeStore(dir, () => clock);
  const statuses = () => {
    const byId = new Map<string, NotifyStatus>();
    for (const r of readJsonl<LeadRecord>(dir, "rows.jsonl")) byId.set(r.submission_id, "pending");
    for (const s of readJsonl<{ submission_id: string; notify_status: NotifyStatus }>(dir, "notify.jsonl")) byId.set(s.submission_id, s.notify_status);
    return byId;
  };
  return { store, now: () => clock, advance: (ms: number) => void (clock += ms), statuses };
}
const run = (d: ReturnType<typeof fakeDriver>, notifier: LeadNotifier, log = captureLogger(), env = cronEnv()) =>
  handleNotifyRetry(cronReq(), { app: "zbm", env, transport: transportOf(d.store, notifier), now: () => new Date(d.now()), logger: log.logger }).then((r) => r.json() as Promise<Record<string, unknown>>);

describe("M2 — the Resend email id is stored and the cron checks delivery", () => {
  it("the real Resend client returns the id from the response and reads last_event with GET /emails/{id}", async () => {
    const calls: { url: string; method: string }[] = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET" });
      if ((init?.method ?? "GET") === "POST") return new Response(JSON.stringify({ id: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c" }), { status: 200 });
      return new Response(JSON.stringify({ object: "email", id: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c", last_event: "bounced" }), { status: 200 });
    }) as unknown as typeof fetch;
    const n = resendNotifier({ apiKey: "re_fake", from: "a@b.test", to: ["f@b.test"], fetchImpl });
    expect(await n.send({ subject: "s", text: "t" }, "k1")).toEqual({ id: "4ef9a417-02e9-4d39-ad75-9611e0fcc33c" });
    expect(await n.lastEvent!("4ef9a417-02e9-4d39-ad75-9611e0fcc33c")).toEqual({ event: "bounced" });
    expect(calls[1]).toEqual({ url: "https://api.resend.com/emails/4ef9a417-02e9-4d39-ad75-9611e0fcc33c", method: "GET" });
  });

  for (const event of ["bounced", "complained", "suppressed", "failed"]) {
    it(`an individual lead email whose last_event is '${event}' goes back into the next digest, flagged, with an error log`, async () => {
      const d = fakeDriver();
      const resend = modelResend();
      const rec = record(1);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
      d.advance(10 * 60_000);
      resend.defaultEvent = event;
      const log = captureLogger();
      await run(d, resend.notifier, log);
      expect(resend.accepted.map((a) => a.key)).toEqual([`lead-zbm-${rec.submission_id}`]);
      // Re-sent after the first wait (1 h, AEGIS r5 N2).
      d.advance(61 * 60_000);
      await run(d, resend.notifier, log);
      expect(log.lines.some((l) => l.level === "error" && l.event === "notify_not_delivered")).toBe(true);
      const digest = resend.accepted.find((a) => a.key.startsWith("digest-"));
      expect(digest?.text).toContain("LEAD-1-END");
      expect(digest?.text).toMatch(/was not delivered/);
      expect(digest?.text).not.toMatch(/may already have been emailed/);
    });
  }

  it("delivered (or opened/clicked) is final: checked once, never again", async () => {
    const d = fakeDriver();
    const resend = modelResend();
    const rec = record(2);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    d.advance(10 * 60_000);
    await run(d, resend.notifier);
    for (let i = 0; i < 3; i++) {
      d.advance(60 * 60_000);
      await run(d, resend.notifier);
    }
    expect(resend.lookups).toHaveLength(1);
    expect(resend.accepted).toHaveLength(1);
  });

  it("a still-pending or unknown last_event is never taken as delivered or as bounced; unknown values are logged", async () => {
    const d = fakeDriver();
    const resend = modelResend();
    const rec = record(3);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    d.advance(10 * 60_000);
    resend.defaultEvent = "teleported";
    const log = captureLogger();
    await run(d, resend.notifier, log);
    resend.events.set(resend.accepted[0]!.id, "delivery_delayed");
    d.advance(60 * 60_000);
    await run(d, resend.notifier, log);
    expect(resend.lookups).toHaveLength(2);
    expect(resend.accepted).toHaveLength(1);
    expect(log.lines.some((l) => l.event === "notify_delivery_event_unknown")).toBe(true);
  });

  it("the digest's own email id is checked too; a bounced digest puts every one of its leads back, flagged", async () => {
    const d = fakeDriver();
    const resend = modelResend();
    for (let i = 0; i < 3; i++) {
      const rec = record(10 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    }
    resend.defaultEvent = "suppressed";
    await run(d, resend.notifier);
    d.advance(61 * 60_000);
    await run(d, resend.notifier);
    const digests = resend.accepted.filter((a) => a.key.startsWith("digest-"));
    expect(digests).toHaveLength(2);
    for (const n of [10, 11, 12]) expect(digests[1]!.text).toContain(`LEAD-${n}-END`);
    expect(digests[1]!.text).toMatch(/was not delivered/);
  });

  it("checks are bounded per run", async () => {
    const d = fakeDriver();
    const resend = modelResend();
    for (let i = 0; i < 30; i++) {
      const rec = record(100 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    }
    d.advance(10 * 60_000);
    await run(d, resend.notifier, captureLogger(), cronEnv());
    resend.lookups.length = 0;
    for (const a of resend.accepted) resend.events.set(a.id, "sent");
    d.advance(60 * 60_000);
    await run(d, resend.notifier);
    expect(resend.lookups.length).toBeLessThanOrEqual(20);
    expect(resend.lookups.length).toBeGreaterThan(0);
  });
});

describe("L2 — a 409 is never taken as accepted", () => {
  it("a digest answered 409 (key in flight) stays pending with an alert; the next run's replay confirms it", async () => {
    const d = fakeDriver();
    const acts: Act[] = ["inflight"];
    const resend = modelResend(() => acts.shift() ?? "ok");
    for (let i = 0; i < 2; i++) {
      const rec = record(20 + i);
      await d.store.insert(rec);
      await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    }
    const log = captureLogger();
    await run(d, resend.notifier, log);
    expect([...d.statuses().values()]).toEqual(["deferred", "deferred"]);
    expect(log.lines.some((l) => l.level === "error" && l.event === "notify_conflict_pending")).toBe(true);
    d.advance(11 * 60_000);
    await run(d, resend.notifier);
    expect([...d.statuses().values()]).toEqual(["sent", "sent"]);
    expect(resend.accepted.filter((a) => a.key.startsWith("digest-"))).toHaveLength(1);
  });

  it("an individual lead answered 409 is not marked sent", async () => {
    const d = fakeDriver();
    const acts: Act[] = ["inflight"];
    const resend = modelResend(() => acts.shift() ?? "ok");
    const rec = record(30);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "failed");
    d.advance(10 * 60_000);
    await run(d, resend.notifier);
    expect(d.statuses().get(rec.submission_id)).not.toBe("sent");
    d.advance(40 * 60_000);
    await run(d, resend.notifier);
    expect(d.statuses().get(rec.submission_id)).toBe("sent");
  });
});

describe("L6 — only a genuinely unknown outcome is flagged 'may already have been emailed'", () => {
  const flagged = /may already have been emailed/;
  it("a digest that failed with a 500 and is retried 25 h later is re-sent without the flag", async () => {
    const d = fakeDriver();
    const acts: Act[] = ["down"];
    const resend = modelResend(() => acts.shift() ?? "ok");
    const rec = record(40);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    await run(d, resend.notifier);
    d.advance(25 * 3_600_000);
    await run(d, resend.notifier);
    const digest = resend.accepted.find((a) => a.key.startsWith("digest-"))!;
    expect(digest.text).toContain("LEAD-40-END");
    expect(digest.text).not.toMatch(flagged);
  });
  it("a digest that timed out (outcome unknown) and is retried 25 h later IS flagged", async () => {
    const d = fakeDriver();
    const acts: Act[] = ["timeout"];
    const resend = modelResend(() => acts.shift() ?? "ok");
    const rec = record(41);
    await d.store.insert(rec);
    await d.store.setNotifyStatus("zbm", rec.submission_id, "deferred");
    await run(d, resend.notifier);
    d.advance(25 * 3_600_000);
    await run(d, resend.notifier);
    expect(resend.accepted.find((a) => a.key.startsWith("digest-"))!.text).toMatch(flagged);
  });
  it("an individual email refused with a 500, older than an hour, goes in the digest without the flag; a timed-out one with it", async () => {
    const d = fakeDriver();
    const acts: Act[] = ["down", "timeout"];
    const resend = modelResend(() => acts.shift() ?? "ok");
    const a = record(42);
    const b = record(43);
    for (const r of [a, b]) {
      await d.store.insert(r);
      await d.store.setNotifyStatus("zbm", r.submission_id, "failed");
      d.advance(60_000);
    }
    d.advance(10 * 60_000);
    await run(d, resend.notifier);
    d.advance(2 * 3_600_000);
    await run(d, resend.notifier);
    const digest = resend.accepted.find((x) => x.key.startsWith("digest-"))!;
    const parts = digest.text.split("Each lead follows, oldest first.")[1]!.split("==========");
    expect(parts.find((p) => p.includes("LEAD-42-END"))).not.toMatch(flagged);
    expect(parts.find((p) => p.includes("LEAD-43-END"))).toMatch(flagged);
  });
});

describe("L5 — the privacy policy says what really happens", () => {
  it("no 'never sent twice'; duplicates avoided and flagged; too-old leads reported as a count, kept until normal deletion; delivery check disclosed", async () => {
    const text = readFileSync(path.join(import.meta.dirname, "..", "..", "..", "apps", "zbm", "lib", "legal.ts"), "utf8");
    expect(text).not.toMatch(/never sent twice/);
    expect(text).toMatch(/possible duplicate/i);
    expect(text).toMatch(/as a count/);
    expect(text).toMatch(/delivery/i);
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
const freshStore = () => postgresStore({ ...(base as PgOptions), connect_timeout: 120 + ++cn });

describe.skipIf(!url)("AEGIS r4 — health window, delivery signal, lock order, 409, expired paging, migrate check (integration)", () => {
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
  const health = (env: Env = cronEnv()) => {
    const purger = postgresPurger({ ...base!, connect_timeout: 93 });
    return purgeHealth({ app: "zbm", env, cacheMs: 0, logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } } as never);
  };
  async function seed(count: number, startAgoSec: number, status: string, tag: string) {
    const rows = Array.from({ length: count }, (_, i) => ({
      submission_id: randomUUID(), app: "zbm", form: "start",
      payload: sql.json({ name: `${tag} ${i}`, problem: `${tag} ${i}`, filler: "x".repeat(2000) }),
      payload_hash: randomUUID(), content_hash: randomUUID(), service_area: "US-CA", notify_status: status,
      created_at: new Date(Date.now() - (startAgoSec - i) * 1000).toISOString(),
    }));
    for (let i = 0; i < rows.length; i += 1000) {
      await sql`INSERT INTO leads ${sql(rows.slice(i, i + 1000), "submission_id", "app", "form", "payload", "payload_hash", "content_hash", "service_area", "notify_status", "created_at")}`;
    }
  }

  it("M1: retry cron off, purge cron on: a never-emailed lead 4 days old still degrades health", async () => {
    await seed(1, 4 * 86_400, "pending", "OLD");
    expect((await health()).status).toBe("notify_backlog");
  });

  it("M2: a bounced lead email degrades health (delivery_failed) and the lead is re-sent in a digest", async () => {
    const resend = modelResend();
    const t = transportOf(freshStore(), resend.notifier);
    await seed(1, 600, "failed", "B");
    resend.defaultEvent = "bounced";
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    const [row] = await sql`SELECT notify_status, notify_email_id, notify_delivery FROM leads`;
    expect(row!.notify_email_id).toBe(resend.accepted[0]!.id);
    expect(row!.notify_delivery).toBe("undelivered");
    // Re-sent after the first wait (1 h): skip the wait.
    await sql`UPDATE leads SET notify_next_at = NULL`;
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    expect((await health()).status).toBe("delivery_failed");
    const digest = resend.accepted.find((a) => a.key.startsWith("digest-"));
    expect(digest?.text).toMatch(/was not delivered/);
  });

  it("L1: five concurrent crons over failing and dissolving batches never deadlock (every run answers 200)", async () => {
    for (let round = 0; round < 6; round++) {
      await seed(400, 7200, "deferred", `R${round}`);
      let k = 0;
      const resend = modelResend(() => (["ok", "down", "timeout", "accept-timeout"] as Act[])[k++ % 4]!);
      const runs = await Promise.all(
        [0, 1, 2, 3, 4].map(() => handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) }).then((r) => r.status)),
      );
      expect(runs).toEqual([200, 200, 200, 200, 200]);
      // Age the batches past the key window so the next round also dissolves some.
      await sql`UPDATE leads SET notify_batch_at = notify_batch_at - interval '24 hours', notify_next_at = NULL WHERE notify_batch IS NOT NULL`;
    }
  }, 240_000);

  it("L3: 12,000 expired leads are reported in count emails without loading their payloads, under the statement timeout", async () => {
    await seed(12_000, 10 * 86_400, "pending", "X");
    const resend = modelResend();
    const t0 = Date.now();
    const res = await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), resend.notifier) });
    expect(res.status).toBe(200);
    const counts = resend.accepted.filter((a) => a.key.startsWith("expired-")).map((a) => Number(/· (\d+) older leads/.exec(a.subject)![1]));
    expect(counts.reduce((s, c) => s + c, 0)).toBe(12_000);
    // No wall-clock bound: this shared host's disk speed varies tenfold. What
    // matters is that the run answered 200 (no statement hit the 5 s timeout:
    // bulk changes are paged, 500 rows per transaction) and every lead is reported.
    void t0;
    expect((await sql`SELECT DISTINCT notify_status FROM leads`).map((r) => r.notify_status)).toEqual(["expired_reported"]);
  }, 120_000);

  it("L4: migrate fails loudly when the notify-status CHECK lacks a status the app writes", async () => {
    const admin = postgres({ host: base!.host, port: base!.port, database: base!.database, username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await admin.unsafe("DROP DATABASE IF EXISTS leads_r4_check");
    await admin.unsafe("CREATE DATABASE leads_r4_check");
    await admin.end();
    const u = new URL(url!);
    u.pathname = "/leads_r4_check";
    const migrate = () => spawnSync("node", ["scripts/migrate.mjs"], { cwd: path.join(import.meta.dirname, ".."), env: { ...process.env, POSTGRES_URL: u.toString(), POSTGRES_URL_NON_POOLING: "", DATABASE_URL_UNPOOLED: "" }, encoding: "utf8" });
    expect(migrate().status).toBe(0);
    const db = postgres({ host: base!.host, port: base!.port, database: "leads_r4_check", username: base!.username, password: base!.password, ssl: base!.ssl, max: 1, onnotice: () => {} });
    await db.unsafe(`ALTER TABLE leads DROP CONSTRAINT leads_notify_status_check;
      ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify'))`);
    await db.end();
    const again = migrate();
    expect(again.status).toBe(1);
    expect(again.stderr).toContain("leads_notify_status_check");
    expect(again.stderr).toContain("expired_reported");
  }, 60_000);
});
