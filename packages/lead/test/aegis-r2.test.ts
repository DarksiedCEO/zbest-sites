import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { resolveLimiter, resolvePolicy, type Env, type TransportConfig } from "../src/config";
import { FORM_TOKEN_HEADER, formTokens } from "../src/form-token";
import { handleNotifyRetry } from "../src/notify-retry";
import { handleLead } from "../src/pipeline";
import { parsePostgresUrl, type PgOptions } from "../src/pg-url";
import { postgresPurger, postgresStore } from "../src/postgres";
import { resendNotifier } from "../src/resend";
import { purgeHealth } from "../src/retention";
import { captureLogger, toyParse } from "./helpers";

/**
 * AEGIS r2 (scratchpad/night/aegis-site-redteam-fixes-r2.md) probes, adapted
 * into assertions: H1, M1, M2, M3, M5, L2, L3. Real Postgres, the real
 * pipeline and store, the real Resend notifier against a FAKE Resend that
 * models its documented idempotency rules (24 h keys; same key and a
 * different body -> 409; same key in flight -> 409). Written before the fix.
 */

const url = process.env.LEAD_TEST_POSTGRES_URL;
const base = (() => {
  if (!url) return null;
  const p = parsePostgresUrl(url);
  if (!p.ok) throw new Error("bad url");
  return p.options;
})();
let n = 0;
/** A store on its OWN connection (the client cache is keyed by options). */
const freshStore = (ms?: number) => postgresStore({ ...(base as PgOptions), connect_timeout: 30 + ++n }, ms ? { statementTimeoutMs: ms } : {});
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const tokens = formTokens("aegis-r2-form-secret-0123456789abcdef");
const CRON = "k".repeat(32);

type Mode = "ok" | "hang-after-deliver" | "down";
function fakeResend() {
  const keys = new Map<string, { body: string; inflight: boolean }>();
  const deliveries: { key: string; subject: string; text: string }[] = [];
  const modes: Mode[] = [];
  let latency = 0;
  const fetchImpl = (async (_u: string, init: RequestInit) => {
    const key = (init.headers as Record<string, string>)["Idempotency-Key"]!;
    const body = String(init.body);
    const k = keys.get(key);
    const done = (s: number) => new Response(JSON.stringify({}), { status: s });
    if (k) return done(k.inflight || k.body !== body ? 409 : 200);
    const mode = modes.shift() ?? "ok";
    if (mode === "down") return done(500);
    keys.set(key, { body, inflight: true });
    await sleep(latency);
    const p = JSON.parse(body);
    deliveries.push({ key, subject: p.subject, text: p.text });
    keys.get(key)!.inflight = false;
    if (mode === "hang-after-deliver") await new Promise((_, rej) => init.signal!.addEventListener("abort", () => rej(new Error("aborted"))));
    return done(200);
  }) as unknown as typeof fetch;
  return {
    deliveries,
    modes,
    setLatency: (ms: number) => (latency = ms),
    forgetKeys: () => keys.clear(),
    // 2 s: long enough that a loaded CI host never times out an in-process
    // fake send by accident (AEGIS r4 rerun flake), short enough for the
    // hang-after-deliver cases.
    notifier: resendNotifier({ apiKey: "re_fake", from: "a@b.test", to: ["f@b.test"], fetchImpl, timeoutMs: 2_000 }),
  };
}
const transportOf = (store: ReturnType<typeof postgresStore>, notifier: ReturnType<typeof resendNotifier> | null): TransportConfig => ({
  ok: true,
  transport: { mode: "live", store, outbox: store, notifier, hashIp: (ip: string) => createHash("sha256").update(ip).digest("hex"), formTokens: tokens },
});
const policy = resolvePolicy({ LEAD_TRUSTED_PROXY: "x-forwarded-for" });
let ipn = 0;
const nextIp = () => `198.18.${(++ipn >> 8) & 255}.${ipn & 255}`;
const post = (fields: Record<string, string>, id: string = randomUUID()) =>
  new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": nextIp(), "user-agent": "aegis", [FORM_TOKEN_HEADER]: tokens.issue("zbm", Date.now() - 10_000) },
    body: JSON.stringify({ form: "start", submission_id: id, fields: { name: "N", business: "B", reach: "r@x.test", ...fields } }),
  });
const cronReq = () => new Request("https://x.test/api/cron/retry-notify", { headers: { authorization: `Bearer ${CRON}` } });
const cronEnv = (extra: Env = {}): Env => ({ CRON_SECRET: CRON, ...extra });

describe.skipIf(!url)("AEGIS r2 — lead caps, outbox and digests (integration)", () => {
  let sql: postgres.Sql;
  beforeAll(async () => {
    const o = base!;
    sql = postgres({ host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl, max: 4, onnotice: () => {} });
    for (const f of readdirSync(path.join(import.meta.dirname, "..", "sql")).filter((x) => /^\d{3}_.+\.sql$/.test(x)).sort()) {
      await sql.unsafe(readFileSync(path.join(import.meta.dirname, "..", "sql", f), "utf8"));
    }
  });
  afterAll(async () => {
    await sql`DELETE FROM leads`;
    await sql.end();
  });
  beforeEach(async () => {
    await sql`DELETE FROM leads`;
  });
  const statusCounts = async () =>
    Object.fromEntries((await sql`SELECT notify_status, count(*)::int AS c FROM leads GROUP BY 1`).map((r) => [r.notify_status, r.c]));
  const lead = (t: TransportConfig, limiters: ReturnType<typeof resolveLimiter>, fields: Record<string, string>, id?: string) =>
    handleLead(post(fields, id), { app: "zbm", parse: toyParse, transport: t, limiters, policy, logger: captureLogger().logger });

  it("H1 (P2): 520 identical junk posts from distinct addresses never block a real lead; nothing is refused", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r2-p2");
    const codes: Record<number, number> = {};
    for (let i = 0; i < 520; i++) {
      const res = await lead(t, limiters, { problem: "identical junk" });
      codes[res.status] = (codes[res.status] ?? 0) + 1;
    }
    const realId = randomUUID();
    const real = await lead(t, limiters, { problem: "REAL customer" }, realId);
    expect(codes).toEqual({ 200: 520 });
    expect(real.status).toBe(200);
    expect((await sql`SELECT count(*)::int AS c FROM leads`)[0]!.c).toBe(2);
    expect(r.deliveries.map((d) => d.key)).toContain(`lead-zbm-${realId}`);
  });

  it("H1: past LEAD_QUARANTINE_AFTER_PER_DAY new leads are stored quarantined (full text kept since r3 M1) and health is degraded", async () => {
    const r = fakeResend();
    const store = freshStore();
    const t = transportOf(store, r.notifier);
    const env = { LEAD_QUARANTINE_AFTER_PER_DAY: "3" };
    const limiters = resolveLimiter(env, captureLogger().logger, "r2-q");
    for (let i = 0; i < 5; i++) expect((await lead(t, limiters, { problem: `${i} ${"x".repeat(4_900)}` })).status).toBe(200);
    const rows = await sql`SELECT quarantined, octet_length(payload::text) AS bytes FROM leads ORDER BY created_at`;
    expect(rows.map((x) => x.quarantined)).toEqual([false, false, false, true, true]);
    for (const q of rows.filter((x) => x.quarantined)) expect(q.bytes).toBeGreaterThan(4_900);
    const purger = postgresPurger({ ...base!, connect_timeout: 97 });
    const health = await purgeHealth({ app: "zbm", env: cronEnv(env), logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } });
    expect(health.status).toBe("quarantined");
  });

  it("H1: only past LEAD_HARD_LIMIT_PER_DAY newly stored rows does the route refuse (503, truthful copy code), and health says so", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const env = { LEAD_HARD_LIMIT_PER_DAY: "4" };
    const limiters = resolveLimiter(env, captureLogger().logger, "r2-hard");
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await lead(t, limiters, { problem: `h${i}` })).status);
    // Duplicates never count toward it.
    expect(statuses.slice(0, 4)).toEqual([200, 200, 200, 200]);
    expect(statuses.slice(4)).toContain(503);
    const res = await lead(t, limiters, { problem: "after the guard" });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: { code: "storage_guard" } });
    const purger = postgresPurger({ ...base!, connect_timeout: 96 });
    const health = await purgeHealth({ app: "zbm", env: cronEnv(env), logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } });
    expect(health.status).toBe("storage_guard");
  });

  it("M5: per-lead emails are capped per hour (LEAD_EMAIL_LIMIT_PER_HOUR); the rest are deferred to the digest", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({ LEAD_EMAIL_LIMIT_PER_HOUR: "2" }, captureLogger().logger, "r2-m5");
    for (let i = 0; i < 4; i++) await lead(t, limiters, { problem: `m5 ${i}` });
    expect(r.deliveries.filter((d) => d.key.startsWith("lead-"))).toHaveLength(2);
    expect(await statusCounts()).toMatchObject({ sent: 2, deferred: 2 });
  });

  it("M1: one cron run sends EVERY deferred lead, 100 per digest email", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({ LEAD_GLOBAL_LIMIT_PER_MINUTE: "1" }, captureLogger().logger, "r2-m1");
    for (let i = 0; i < 251; i++) await lead(t, limiters, { problem: `m1 ${randomUUID()}` });
    const run = (await (await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t })).json()) as { digest: number };
    expect(run.digest).toBe(250);
    expect(r.deliveries.filter((d) => d.key.startsWith("digest-"))).toHaveLength(3);
    expect(await statusCounts()).toEqual({ sent: 251 });
  });

  it("M2 (P3b): the inline send reached Resend then timed out — retries reuse the identical body and key, the lead is delivered once and marked sent", async () => {
    const r = fakeResend();
    r.modes.push("hang-after-deliver");
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r2-m2");
    const id = randomUUID();
    expect((await lead(t, limiters, { problem: "timeout case" }, id)).status).toBe(200);
    // The cron runs later (its clock is 10 minutes on): the stored row is untouched, so the body is identical.
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(Date.now() + 10 * 60_000) });
    const [row] = await sql`SELECT notify_status FROM leads WHERE submission_id = ${id}::uuid`;
    expect(row!.notify_status).toBe("sent");
    expect(r.deliveries.map((d) => d.key)).toEqual([`lead-zbm-${id}`]);
  });

  it("M2: a 409 for a body that matches what we sent is 'already sent'", async () => {
    const r = fakeResend();
    r.setLatency(600); // in flight beyond the client's 400 ms timeout, then a retry gets 409 concurrent
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r2-409");
    const id = randomUUID();
    await lead(t, limiters, { problem: "409 case" }, id);
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t, now: () => new Date(Date.now() + 10 * 60_000) });
    const [row] = await sql`SELECT notify_status FROM leads WHERE submission_id = ${id}::uuid`;
    expect(row!.notify_status).toBe("sent");
    expect(r.deliveries).toHaveLength(1);
  });

  it("M2: an unconfirmed first attempt over 23 h old is not re-sent individually: delivery_unknown, then in the digest", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r2-24h");
    const id = randomUUID();
    r.modes.push("down");
    await lead(t, limiters, { problem: "old unknown" }, id);
    // The attempt's outcome is unknown (as after a timeout). Since AEGIS r4 L6
    // only such a lead is flagged; a definite failure goes in unflagged (aegis-r4.test.ts).
    await sql`UPDATE leads SET created_at = now() - interval '24 hours', notify_first_attempt_at = now() - interval '24 hours', notify_outcome_unknown = true WHERE submission_id = ${id}::uuid`;
    const run = (await (await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t })).json()) as { digest: number };
    expect(r.deliveries.filter((d) => d.key === `lead-zbm-${id}`)).toHaveLength(0);
    expect(run.digest).toBe(1);
    const digest = r.deliveries.find((d) => d.key.startsWith("digest-"))!;
    expect(digest.text).toContain("may already have been emailed");
    expect(digest.text).toContain("old unknown");
  });

  it("M3: pending/failed leads older than LEAD_NOTIFY_RETRY_DAYS become expired_notify, counted in one digest line, never emailed one by one", async () => {
    const r = fakeResend();
    const store = freshStore();
    const t = transportOf(store, r.notifier);
    const old = [randomUUID(), randomUUID(), randomUUID()];
    for (const id of old) {
      await store.insert({ submission_id: id, app: "zbm", form: "start", payload: { id }, payload_hash: id, content_hash: id, services: [], source: null, service_area: "US-CA", user_agent: null });
    }
    await store.setNotifyStatus("zbm", old[0]!, "failed");
    await sql`UPDATE leads SET created_at = now() - interval '10 days'`;
    const run = (await (await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t })).json()) as { expired: number };
    expect(run.expired).toBe(3);
    expect(r.deliveries.filter((d) => d.key.startsWith("lead-"))).toHaveLength(0);
    const digest = r.deliveries.find((d) => d.key.startsWith("expired-"))!;
    expect(digest.text).toContain("3 older leads");
    // AEGIS r3 M3: once their count email is accepted they are expired_reported, and health is ok.
    expect(await statusCounts()).toEqual({ expired_reported: 3 });
    const purger = postgresPurger({ ...base!, connect_timeout: 95 });
    expect((await purgeHealth({ app: "zbm", env: cronEnv(), logger: () => {}, ledger: { ...purger, lastSuccess: async () => new Date() } })).status).toBe("ok");
  });

  it("L2 (P3c): a digest that timed out is re-sent with the SAME key and body, never as a second, overlapping digest", async () => {
    const r = fakeResend();
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({ LEAD_GLOBAL_LIMIT_PER_MINUTE: "1" }, captureLogger().logger, "r2-l2");
    for (let i = 0; i < 31; i++) await lead(t, limiters, { problem: `d ${randomUUID()}` });
    r.modes.push("hang-after-deliver");
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    for (let i = 0; i < 5; i++) await lead(t, limiters, { problem: `late ${randomUUID()}` });
    await sql`UPDATE leads SET notify_next_at = now() - interval '1 second' WHERE notify_status = 'deferred'`;
    await handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: t });
    const digests = r.deliveries.filter((d) => d.key.startsWith("digest-"));
    expect(digests.map((d) => d.subject)).toEqual([expect.stringContaining(" 30 "), expect.stringContaining(" 5 ")]);
    expect(await statusCounts()).toEqual({ sent: 36 });
  });

  it("L3 (P4): six requests queued behind a held table lock all answer within ~6 s; none is lost", async () => {
    const t = transportOf(freshStore(), fakeResend().notifier);
    const limiters = resolveLimiter({}, captureLogger().logger, "r2-l3");
    const o = base!;
    const locker = postgres({ host: o.host, port: o.port, database: o.database, username: o.username, password: o.password, ssl: o.ssl, max: 1, onnotice: () => {} });
    let release!: () => void;
    const held = new Promise<void>((res) => (release = res));
    let locked!: () => void;
    const isLocked = new Promise<void>((res) => (locked = res));
    const lock = locker.begin(async (tx) => {
      await tx`LOCK TABLE leads IN ACCESS EXCLUSIVE MODE`;
      locked();
      await held;
    });
    await isLocked;
    const t0 = Date.now();
    const results = await Promise.all([0, 1, 2, 3, 4, 5].map(async (i) => {
      const res = await lead(t, limiters, { problem: `lock ${i} ${randomUUID()}` });
      return { status: res.status, ms: Date.now() - t0 };
    }));
    release();
    await lock;
    await locker.end();
    for (const x of results) {
      expect(x.status).toBe(503);
      expect(x.ms).toBeLessThan(7_500);
    }
    // AEGIS r3 L1: a 503 does not prove nothing was stored (the form says it
    // may have reached us). Whatever did commit is unsent and the cron emails it.
    await sleep(1_000);
    expect((await sql`SELECT count(*)::int AS c FROM leads WHERE notify_status NOT IN ('pending', 'failed')`)[0]!.c).toBe(0);
  }, 30_000);

  it("concurrent cron runs on SEPARATE connections send each deferred lead in exactly one digest", async () => {
    const r = fakeResend();
    r.setLatency(100);
    const t = transportOf(freshStore(), r.notifier);
    const limiters = resolveLimiter({ LEAD_GLOBAL_LIMIT_PER_MINUTE: "1" }, captureLogger().logger, "r2-cc");
    for (let i = 0; i < 61; i++) await lead(t, limiters, { problem: `cc ${randomUUID()}` });
    await Promise.all([0, 1].map(() => handleNotifyRetry(cronReq(), { app: "zbm", env: cronEnv(), transport: transportOf(freshStore(), r.notifier) })));
    const digests = r.deliveries.filter((d) => d.key.startsWith("digest-"));
    const total = digests.reduce((s, d) => s + Number(/· (\d+) lead/.exec(d.subject)?.[1] ?? 0), 0);
    expect(total).toBe(60);
    expect(await statusCounts()).toEqual({ sent: 61 });
  });
});
