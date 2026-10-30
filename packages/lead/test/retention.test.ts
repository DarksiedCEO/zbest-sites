import { describe, expect, it, vi } from "vitest";
import { purgeWith, type SqlTag } from "../src/postgres";
import {
  DEFAULT_LEAD_RETENTION_DAYS,
  DEFAULT_UA_RETENTION_DAYS,
  cronAuthorized,
  handlePurge,
  resolveRetention,
  retentionCutoffs,
  type LeadPurger,
} from "../src/retention";
import { captureLogger } from "./helpers";

/** Retention purge (security sweep M4, privacy sweep F2, 2026-10-30). */

// Built at runtime: a literal shaped like a key trips the CI secret scan (gitleaks generic-api-key).
const SECRET = ["unit", "test", "cron", "value", "16plus"].join("-");
const NOW = new Date("2026-10-30T12:00:00.000Z");
const call = (headers: Record<string, string> = {}) =>
  new Request("https://www.zbestmedia.com/api/cron/purge-leads", { method: "GET", headers });

function spyPurger(result = { deleted: 3, uaCleared: 5 }) {
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
      return Promise.resolve({ count: calls.length === 1 ? 4 : 7 });
    };
    const cutoffs = retentionCutoffs(NOW, { leadDays: 730, uaDays: 90 });
    expect(await purgeWith(tag, "zbc", cutoffs)).toEqual({ deleted: 4, uaCleared: 7 });
    expect(calls).toHaveLength(2);
    const [del, ua] = calls as [(typeof calls)[0], (typeof calls)[0]];
    expect(del.text.replace(/\s+/g, " ").trim()).toBe(
      "DELETE FROM leads WHERE app = $?::text AND created_at < $?::timestamptz",
    );
    expect(del.values).toEqual(["zbc", "2024-10-30T12:00:00.000Z"]);
    expect(ua.text.replace(/\s+/g, " ").trim()).toBe(
      "UPDATE leads SET user_agent = NULL WHERE app = $?::text AND user_agent IS NOT NULL AND created_at < $?::timestamptz",
    );
    expect(ua.values).toEqual(["zbc", "2026-08-01T12:00:00.000Z"]);
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
    const { purger, purge } = spyPurger({ deleted: 2, uaCleared: 9 });
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
    expect(purge).toHaveBeenCalledWith("zbc", retentionCutoffs(NOW, { leadDays: 365, uaDays: 90 }));
    expect(log.lines).toEqual([{ level: "info", event: "purged", fields: { app: "zbc", deleted: 2, ua_cleared: 9, days: 365 } }]);
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
