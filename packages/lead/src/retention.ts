import { createHash, timingSafeEqual } from "node:crypto";
import type { Env } from "./config";
import { consoleLogger, type LeadLogger } from "./log";
import { parsePostgresUrl } from "./pg-url";
import { postgresPurger } from "./postgres";
import type { LeadApp } from "./types";

/**
 * Lead retention (security sweep M4, privacy sweep F2, 2026-10-30).
 *
 * A daily Vercel Cron call to each app's /api/cron/purge-leads:
 *   - deletes that app's leads submitted more than LEAD_RETENTION_DAYS ago
 *     (default 730, about 24 months);
 *   - blanks the stored user agent on rows older than LEAD_UA_RETENTION_DAYS
 *     (default 90).
 *
 * The clock is the SUBMISSION date (`created_at`). The table has no "last
 * contact" column, so a period "after our last contact" cannot be enforced
 * by code; disclosures must say "after you send it".
 *
 * Fail closed: without CRON_SECRET (≥ 16 chars) the route refuses to run
 * (503), and without the exact `Authorization: Bearer <CRON_SECRET>` header
 * Vercel sends it answers 401 and touches nothing. Logs carry counts only.
 * Both statements are idempotent, so a duplicate or missed cron run is safe.
 */

export const DEFAULT_LEAD_RETENTION_DAYS = 730;
export const DEFAULT_UA_RETENTION_DAYS = 90;
/** Ten years: a cap so a typo cannot read as "keep forever". */
const MAX_DAYS = 3650;
const DAY_MS = 24 * 60 * 60 * 1000;

export type RetentionPolicy = { leadDays: number; uaDays: number };

/** Parses the two day counts. Anything but a whole number from 1 to 3650 is a problem, never a guess. */
export function resolveRetention(env: Env): { ok: true; policy: RetentionPolicy } | { ok: false; problems: string[] } {
  const problems: string[] = [];
  const read = (name: string, fallback: number) => {
    const raw = (env[name] ?? "").trim();
    if (raw === "") return fallback;
    if (!/^\d{1,4}$/.test(raw) || Number(raw) < 1 || Number(raw) > MAX_DAYS) {
      problems.push(`${name}:whole-days-1-to-${MAX_DAYS}`);
      return fallback;
    }
    return Number(raw);
  };
  const leadDays = read("LEAD_RETENTION_DAYS", DEFAULT_LEAD_RETENTION_DAYS);
  const uaDays = read("LEAD_UA_RETENTION_DAYS", DEFAULT_UA_RETENTION_DAYS);
  if (!problems.length && uaDays > leadDays) problems.push("LEAD_UA_RETENTION_DAYS:must-not-exceed-LEAD_RETENTION_DAYS");
  return problems.length ? { ok: false, problems } : { ok: true, policy: { leadDays, uaDays } };
}

/** Rows created strictly before these instants are purged / have their user agent blanked. */
export function retentionCutoffs(now: Date, policy: RetentionPolicy): { leads: Date; userAgent: Date } {
  return {
    leads: new Date(now.getTime() - policy.leadDays * DAY_MS),
    userAgent: new Date(now.getTime() - policy.uaDays * DAY_MS),
  };
}

export type PurgeResult = { deleted: number; uaCleared: number };

export interface LeadPurger {
  purge(app: LeadApp, cutoffs: { leads: Date; userAgent: Date }): Promise<PurgeResult>;
}

/** Constant-time check of `Authorization: Bearer <secret>`, compared as digests so length leaks nothing. */
export function cronAuthorized(header: string | null, secret: string): boolean {
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return header !== null && timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

export type HandlePurgeOptions = {
  app: LeadApp;
  env?: Env;
  logger?: LeadLogger;
  now?: () => Date;
  /** Test seam; production builds it from POSTGRES_URL. */
  purger?: LeadPurger;
};

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handlePurge(request: Request, opts: HandlePurgeOptions): Promise<Response> {
  const log = opts.logger ?? consoleLogger;
  const env = opts.env ?? process.env;
  const app = opts.app;
  try {
    const secret = (env.CRON_SECRET ?? "").trim();
    if (secret.length < 16) {
      log("error", "purge_not_configured", { app, missing: "CRON_SECRET:min-16-chars" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    if (!cronAuthorized(request.headers.get("authorization"), secret)) {
      log("warn", "purge_unauthorized", { app });
      return json({ ok: false, error: { code: "unauthorized" } }, 401);
    }

    const retention = resolveRetention(env);
    let purger = opts.purger;
    const missing = retention.ok ? [] : [...retention.problems];
    if (!purger) {
      const url = (env.POSTGRES_URL ?? "").trim();
      const pg = url ? parsePostgresUrl(url) : null;
      if (!pg) missing.push("POSTGRES_URL");
      else if (!pg.ok) missing.push(`POSTGRES_URL:${pg.reason}`);
      else if (!missing.length) purger = postgresPurger(pg.options);
    }
    if (!retention.ok || missing.length || !purger) {
      log("error", "purge_not_configured", { app, missing: missing.join(",") });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }

    const cutoffs = retentionCutoffs((opts.now ?? (() => new Date()))(), retention.policy);
    const result = await purger.purge(app, cutoffs);
    log("info", "purged", { app, deleted: result.deleted, ua_cleared: result.uaCleared, days: retention.policy.leadDays });
    return json({ ok: true, deleted: result.deleted, ua_cleared: result.uaCleared }, 200);
  } catch {
    // No error object: it may carry a host or a value.
    log("error", "purge_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
