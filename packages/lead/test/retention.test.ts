import { describe, expect, it, vi } from "vitest";
import { purgeWith, type SqlTag } from "../src/postgres";
import {
  DEFAULT_LEAD_RETENTION_DAYS,
  DEFAULT_UA_RETENTION_DAYS,
  cronAuthorized,
  handleHealth,
  handlePurge,
  resetHealthCache,
  purgeHealth,
  resolveRetention,
  retentionCutoffs,
  type LeadPurger,
  type PurgeLedger,
} from "../src/retention";
import { captureLogger } from "./helpers";

/** Retention purge (security sweep M4, privacy sweep F2, 2026-10-30). */

// Built at runtime: a literal shaped like a key trips the CI secret scan (gitleaks generic-api-key).
const SECRET = ["unit", "test", "cron", "value", "16plus"].join("-");
const NOW = new Date("2026-10-30T12:00:00.000Z");
const call = (headers: Record<string, string> = {}) =>
  new Request("https://www.zbestmedia.com/api/cron/purge-leads", { method: "GET", headers });

function spyPurger(result = { deleted: 3, uaCleared: 5, ipHashCleared: 0 }) {
  const purge = vi.fn<LeadPurger["purge"]>(async () => result);
  return { purger: { purge } satisfies LeadPurger, purge };
}

describe("retention policy and cutoff math", () => {
  it("defaults to 730 days for leads and 90 for the user agent", () => {
    expect(resolveRetention({})).toEqual({ ok: true, policy: { leadDays: 730, uaDays: 90 } });
    expect(DEFAULT_LEAD_RETENTION_DAYS).toBe(730);
    expect(DEFAULT_UA_RETENTION_DAYS).toBe(90);
  });

  it("reads whole days and refuses anything else, naming the setting only", () => {
    expect(resolveRetention({ LEAD_RETENTION_DAYS: "365", LEAD_UA_RETENTION_DAYS: "30" })).toEqual({
      ok: true,
      policy: { leadDays: 365, uaDays: 30 },
    });
    for (const bad of ["0", "-1", "1.5", "abc", "3651", "99999", "7d"]) {
      expect(resolveRetention({ LEAD_RETENTION_DAYS: bad }), bad).toEqual({
        ok: false,
        problems: ["LEAD_RETENTION_DAYS:whole-days-1-to-3650"],
      });
    }
    expect(resolveRetention({ LEAD_RETENTION_DAYS: "60" })).toEqual({
      ok: false,
      problems: ["LEAD_UA_RETENTION_DAYS:must-not-exceed-LEAD_RETENTION_DAYS"],
    });
  });

  it("cutoffs are exactly N days of milliseconds before now", () => {
    const c = retentionCutoffs(NOW, { leadDays: 730, uaDays: 90 });
    expect(c.leads.toISOString()).toBe("2024-10-30T12:00:00.000Z");
    expect(c.userAgent.toISOString()).toBe("2026-08-01T12:00:00.000Z");
    expect(NOW.getTime() - c.leads.getTime()).toBe(730 * 86_400_000);
  });
});

describe("purge SQL (parameterised, scoped by app)", () => {
  it("sends the app and the cutoffs as bound values, never as SQL text", async () => {
    const calls: { text: string; values: unknown[] }[] = [];
    const tag: SqlTag = (strings, ...values) => {
      calls.push({ text: strings.join("$?"), values });
      return Promise.resolve({ count: [0, 4, 7, 3, 1][calls.length] ?? 1 });
    };
    const cutoffs = retentionCutoffs(NOW, { leadDays: 730, uaDays: 90 });
    expect(await purgeWith(tag, "zbc", cutoffs, NOW)).toEqual({ deleted: 4, uaCleared: 7, ipHashCleared: 3 });
    expect(calls).toHaveLength(4);
    const [del, ua, ip, ledger] = calls as [(typeof calls)[0], (typeof calls)[0], (typeof calls)[0], (typeof calls)[0]];
    expect(del.text.replace(/\s+/g, " ").trim()).toBe(
      "DELETE FROM leads WHERE app = $?::text AND created_at < $?::timestamptz",
    );
    expect(del.values).toEqual(["zbc", "2024-10-30T12:00:00.000Z"]);
    expect(ua.text.replace(/\s+/g, " ").trim()).toBe(
      "UPDATE leads SET user_agent = NULL WHERE app = $?::text AND user_agent IS NOT NULL AND created_at < $?::timestamptz",
    );
    expect(ua.values).toEqual(["zbc", "2026-08-01T12:00:00.000Z"]);
    // Any ip_hash a pre-hardening deployment wrote is cleared every day (AEGIS H-L1).
    expect(ip.text).toContain("UPDATE leads SET ip_hash = NULL");
    expect(ip.text).toContain("ip_hash IS NOT NULL");
    expect(ip.values).toEqual(["zbc"]);
    expect(ledger.text).toContain("INSERT INTO lead_purge_runs");
    expect(ledger.values).toEqual(["zbc", NOW.toISOString(), 4, 7]);
    for (const c of calls) expect(c.text).not.toMatch(/zbc|2024|2026/);
  });
});

describe("cron route: authorisation fails closed", () => {
  it("without CRON_SECRET (or a short one) it refuses to run: 503, nothing purged", async () => {
    for (const env of [{}, { CRON_SECRET: "" }, { CRON_SECRET: "short" }]) {
      const { purger, purge } = spyPurger();
      const log = captureLogger();
      const res = await handlePurge(call({ authorization: "Bearer short" }), { app: "zbm", env, purger, logger: log.logger, now: () => NOW });
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ ok: false, error: { code: "not_configured" } });
      expect(purge).not.toHaveBeenCalled();
      expect(log.lines[0]).toMatchObject({ event: "purge_not_configured", fields: { missing: "CRON_SECRET:min-16-chars" } });
    }
  });

  it("no, wrong or malformed Authorization: 401, nothing purged", async () => {
    for (const headers of <Record<string, string>[]>[
      {},
      { authorization: "Bearer wrong-secret-0123456789" },
      { authorization: SECRET },
      { authorization: `bearer ${SECRET}` },
      { authorization: `Bearer ${SECRET}x` },
      { authorization: `Basic ${SECRET}` },
    ]) {
      const { purger, purge } = spyPurger();
      const res = await handlePurge(call(headers), { app: "zbm", env: { CRON_SECRET: SECRET }, purger, logger: captureLogger().logger, now: () => NOW });
      expect(res.status, JSON.stringify(headers)).toBe(401);
      expect(purge).not.toHaveBeenCalled();
    }
  });

  it("the right Bearer secret purges this app's rows with the configured cutoffs and logs counts only", async () => {
    const { purger, purge } = spyPurger({ deleted: 2, uaCleared: 9, ipHashCleared: 4 });
    const log = captureLogger();
    const res = await handlePurge(call({ authorization: `Bearer ${SECRET}` }), {
      app: "zbc",
      env: { CRON_SECRET: SECRET, LEAD_RETENTION_DAYS: "365" },
      purger,
      logger: log.logger,
      now: () => NOW,
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ ok: true, deleted: 2, ua_cleared: 9 });
    expect(purge).toHaveBeenCalledWith("zbc", retentionCutoffs(NOW, { leadDays: 365, uaDays: 90 }), NOW);
    expect(log.lines).toEqual([{ level: "info", event: "purged", fields: { app: "zbc", deleted: 2, ua_cleared: 9, ip_hash_cleared: 4, days: 365 } }]);
    expect(log.text()).not.toContain(SECRET);
  });

  it("a bad retention setting or a missing database is 503 not_configured, nothing purged", async () => {
    const { purger, purge } = spyPurger();
    const auth = { authorization: `Bearer ${SECRET}` };
    const bad = await handlePurge(call(auth), { app: "zbm", env: { CRON_SECRET: SECRET, LEAD_RETENTION_DAYS: "forever" }, purger, logger: captureLogger().logger });
    expect(bad.status).toBe(503);
    expect(purge).not.toHaveBeenCalled();
    const log = captureLogger();
    const nodb = await handlePurge(call(auth), { app: "zbm", env: { CRON_SECRET: SECRET }, logger: log.logger });
    expect(nodb.status).toBe(503);
    expect(log.lines[0]?.fields?.missing).toBe("POSTGRES_URL");
  });

  it("a store failure is 503 unavailable with no error detail in the log", async () => {
    const purger: LeadPurger = { purge: async () => Promise.reject(new Error("host db.internal password=x")) };
    const log = captureLogger();
    const res = await handlePurge(call({ authorization: `Bearer ${SECRET}` }), { app: "zbm", env: { CRON_SECRET: SECRET }, purger, logger: log.logger });
    expect(res.status).toBe(503);
    expect(log.text()).not.toContain("db.internal");
  });

  it("cronAuthorized compares exactly", () => {
    expect(cronAuthorized(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(cronAuthorized(null, SECRET)).toBe(false);
    expect(cronAuthorized(`Bearer ${SECRET.slice(0, -1)}`, SECRET)).toBe(false);
  });
});

describe("retention defaults and bounds (AEGIS, legal branch review)", () => {
  it("unset or blank settings mean 730 days for leads and 90 for the user agent, and the purge uses them", async () => {
    for (const env of [{}, { LEAD_RETENTION_DAYS: "", LEAD_UA_RETENTION_DAYS: "  " }]) {
      expect(resolveRetention(env)).toEqual({ ok: true, policy: { leadDays: 730, uaDays: 90 } });
      const { purger, purge } = spyPurger();
      const res = await handlePurge(call({ authorization: `Bearer ${SECRET}` }), {
        app: "zbm",
        env: { CRON_SECRET: SECRET, ...env },
        purger,
        logger: captureLogger().logger,
        now: () => NOW,
      });
      expect(res.status).toBe(200);
      const [, cutoffs] = purge.mock.calls[0]!;
      expect(cutoffs.leads.toISOString()).toBe("2024-10-30T12:00:00.000Z");
      expect(cutoffs.userAgent.toISOString()).toBe("2026-08-01T12:00:00.000Z");
    }
  });

  it("out-of-bounds values are refused on every run (no purge) and reported by the health check", async () => {
    for (const [name, value] of [
      ["LEAD_RETENTION_DAYS", "0"],
      ["LEAD_RETENTION_DAYS", "3651"],
      ["LEAD_UA_RETENTION_DAYS", "0"],
      ["LEAD_UA_RETENTION_DAYS", "800"],
    ] as const) {
      const env = { CRON_SECRET: SECRET, [name]: value };
      const { purger, purge } = spyPurger();
      const res = await handlePurge(call({ authorization: `Bearer ${SECRET}` }), { app: "zbm", env, purger, logger: captureLogger().logger });
      expect(res.status, `${name}=${value}`).toBe(503);
      expect(purge).not.toHaveBeenCalled();
      const ledger: PurgeLedger = { lastSuccess: async () => NOW };
      expect((await purgeHealth({ app: "zbm", env, ledger, logger: captureLogger().logger, now: () => NOW })).status).toBe("misconfigured");
    }
  });
});

describe("health: a purge that stops is never silent", () => {
  const ledgerAt = (d: Date | null): PurgeLedger => ({ lastSuccess: async () => d });
  const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3_600_000);
  const health = (env: Record<string, string>, ledger: PurgeLedger) => {
    const log = captureLogger();
    return handleHealth(new Request("https://www.zbestmedia.com/api/health"), { app: "zbm", env, ledger, logger: log.logger, now: () => NOW, cacheMs: 0 }).then(
      async (res) => ({ status: res.status, body: await res.json(), log }),
    );
  };

  it("ok within 48 hours of the last successful purge: 200", async () => {
    const r = await health({ CRON_SECRET: SECRET }, ledgerAt(hoursAgo(25)));
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ ok: true, status: "ok" });
    expect(r.log.lines).toEqual([]);
  });

  it("overdue after 48 hours: 503 and an error-level event", async () => {
    const r = await health({ CRON_SECRET: SECRET }, ledgerAt(hoursAgo(49)));
    expect(r.status).toBe(503);
    expect(r.body).toEqual({ ok: false, status: "overdue" });
    expect(r.log.lines).toEqual([{ level: "error", event: "purge_degraded", fields: { app: "zbm", status: "overdue" } }]);
  });

  it("never run, unreadable ledger, and a missing CRON_SECRET are all degraded (503, error log)", async () => {
    const cases: [Record<string, string>, PurgeLedger, string][] = [
      [{ CRON_SECRET: SECRET }, ledgerAt(null), "never_run"],
      [{ CRON_SECRET: SECRET }, { lastSuccess: () => Promise.reject(new Error("db.internal")) }, "unknown"],
      [{}, ledgerAt(hoursAgo(1)), "cron_secret_missing"],
      [{ CRON_SECRET: "short" }, ledgerAt(hoursAgo(1)), "cron_secret_missing"],
    ];
    for (const [env, ledger, status] of cases) {
      const r = await health(env, ledger);
      expect(r.status, status).toBe(503);
      expect(r.body).toEqual({ ok: false, status });
      expect(r.log.lines[0]).toMatchObject({ level: "error", event: "purge_degraded", fields: { status } });
      expect(r.log.text()).not.toContain("db.internal");
    }
  });

  it("the cron route itself logs an error on EVERY invocation while CRON_SECRET is unset", async () => {
    const log = captureLogger();
    for (let i = 0; i < 3; i++) await handlePurge(call({}), { app: "zbm", env: {}, logger: log.logger });
    expect(log.lines.map((l) => [l.level, l.event])).toEqual(Array(3).fill(["error", "purge_not_configured"]));
  });
});

describe("health is cheap to call: one check per minute per instance (AEGIS H-M2)", () => {
  const SEC = ["unit", "test", "cron", "value", "16plus"].join("-");
  it("reuses the computed status for 60 s, shares an in-flight check, logs degraded once, and lets the CDN cache it", async () => {
    resetHealthCache();
    let reads = 0;
    let t = NOW.getTime();
    const ledger: PurgeLedger = {
      lastSuccess: async () => {
        reads++;
        return null; // never_run: degraded, so it logs
      },
    };
    const log = captureLogger();
    const get = () =>
      handleHealth(new Request("https://www.zbestmedia.com/api/health"), {
        app: "zbc",
        env: { CRON_SECRET: SEC },
        ledger,
        logger: log.logger,
        now: () => new Date(t),
      });
    const burst = await Promise.all(Array.from({ length: 50 }, get));
    expect(burst.every((r) => r.status === 503)).toBe(true);
    expect(burst[0]!.headers.get("cache-control")).toBe("public, max-age=0, s-maxage=60");
    expect(await burst[0]!.json()).toEqual({ ok: false, status: "never_run" });
    t += 59_000;
    await get();
    expect(reads).toBe(1);
    expect(log.lines.filter((l) => l.event === "purge_degraded")).toHaveLength(1);
    t += 2_000; // past 60 s: checked again
    await get();
    expect(reads).toBe(2);
    expect(log.lines.filter((l) => l.event === "purge_degraded")).toHaveLength(2);
    resetHealthCache();
  });
});
