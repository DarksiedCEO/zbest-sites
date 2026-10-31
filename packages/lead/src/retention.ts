import { createHash, timingSafeEqual } from "node:crypto";
import type { Env } from "./config";
import { consoleLogger, type LeadLogger } from "./log";
import { resolveCaps } from "./config";
import { resolvePg } from "./pg-url";
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

export type PurgeResult = { deleted: number; uaCleared: number; ipHashCleared: number };

export interface LeadPurger {
  /** Purges, and records `ranAt` as this app's last successful run (one transaction). */
  purge(app: LeadApp, cutoffs: { leads: Date; userAgent: Date }, ranAt: Date): Promise<PurgeResult>;
}

/** Reads the last successful purge (sql/003_purge_runs.sql). */
export interface PurgeLedger {
  lastSuccess(app: LeadApp): Promise<Date | null>;
  /** Leads created before `before` whose founder email has not gone out (CH-8), plus any deferred lead (AEGIS F1). Legacy seam. */
  unsentOlderThan?(app: LeadApp, before: Date): Promise<number>;
  /** Email and cap state for health (AEGIS r2 H1/M1/M3). */
  leadState?(
    app: LeadApp,
    window: { unsentBefore: Date; retryAfter: Date },
  ): Promise<{ unsent: number; digestPending: number; quarantined24h: number; stored24h: number; expiredUnreported?: number; undelivered24h?: number; abandoned7d?: number; unverifiable24h?: number }>;
  /** The delivery check's own state (AEGIS r5 N2/N3). */
  deliveryCheckState?(app: LeadApp): Promise<{ unauthorized: boolean; failingSince: Date | null }>;
  /** Bytes the lead tables occupy (pg_total_relation_size; AEGIS r3 M4). */
  dbBytes?(): Promise<number>;
  /** Columns the app writes that the database lacks (AEGIS F4: migrations 004/006/007/008 not applied). */
  missingColumns?(): Promise<string[]>;
}

/** How old an unsent founder email may get before /api/health is degraded (CH-8). */
export const DEFAULT_NOTIFY_ALERT_MINUTES = 60;
/** Leads older than this are not retried one by one (AEGIS r2 M3). */
export const DEFAULT_NOTIFY_RETRY_DAYS = 3;
export function notifyRetryDays(env: Env): number {
  const raw = (env.LEAD_NOTIFY_RETRY_DAYS ?? "").trim();
  return /^\d{1,3}$/.test(raw) && Number(raw) >= 1 && Number(raw) <= 30 ? Number(raw) : DEFAULT_NOTIFY_RETRY_DAYS;
}

/** AEGIS r3 M4: the storage budget for the lead tables (Neon's free tier is 0.5 GB). */
export const DEFAULT_LEAD_DB_BUDGET_MB = 400;
/** Health degrades, with an error-level alert, at this share of the budget. */
export const DB_BUDGET_ALERT_RATIO = 0.6;
export function leadDbBudgetMb(env: Env): number | null {
  const raw = (env.LEAD_DB_BUDGET_MB ?? "").trim();
  if (raw === "") return DEFAULT_LEAD_DB_BUDGET_MB;
  return /^\d{1,7}$/.test(raw) && Number(raw) >= 1 ? Number(raw) : null;
}

/** A purge older than this is overdue: two missed daily runs. */
export const PURGE_OVERDUE_HOURS = 48;

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
      const pg = url ? resolvePg(url, env) : null;
      if (!pg) missing.push("POSTGRES_URL");
      else if (!pg.ok) missing.push(`POSTGRES_URL:${pg.reason}`);
      else if (!missing.length) purger = postgresPurger(pg.options);
    }
    if (!retention.ok || missing.length || !purger) {
      log("error", "purge_not_configured", { app, missing: missing.join(",") });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }

    const now = (opts.now ?? (() => new Date()))();
    const cutoffs = retentionCutoffs(now, retention.policy);
    const result = await purger.purge(app, cutoffs, now);
    log("info", "purged", {
      app,
      deleted: result.deleted,
      ua_cleared: result.uaCleared,
      ip_hash_cleared: result.ipHashCleared,
      days: retention.policy.leadDays,
    });
    return json({ ok: true, deleted: result.deleted, ua_cleared: result.uaCleared }, 200);
  } catch {
    // No error object: it may carry a host or a value.
    log("error", "purge_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}

export type PurgeHealth =
  | "ok"
  /** CRON_SECRET missing or short: the cron cannot run (the purge route refuses). */
  | "cron_secret_missing"
  /** LEAD_RETENTION_DAYS / LEAD_UA_RETENTION_DAYS out of bounds, or no usable POSTGRES_URL. */
  | "misconfigured"
  /** No successful run recorded yet (expected only in the first day after go-live). */
  | "never_run"
  /** Last success older than PURGE_OVERDUE_HOURS. */
  | "overdue"
  /** The ledger could not be read. */
  | "unknown"
  /** A lead's founder email has not gone out for longer than LEAD_NOTIFY_ALERT_MINUTES, however old the lead (CH-8, AEGIS r4 M1), or the email cap tripped (AEGIS F1). */
  | "notify_backlog"
  /** The database lacks columns this code writes: a migration was not run (AEGIS F4). */
  | "schema_outdated"
  /** A lead was quarantined in the last 24 h: the daily quarantine threshold tripped (AEGIS r2 H1). */
  | "quarantined"
  /** The storage guard is refusing new leads: LEAD_HARD_LIMIT_PER_DAY newly stored in 24 h (AEGIS r2 H1). */
  | "storage_guard"
  /** Leads too old to retry whose count email Resend has not accepted yet (AEGIS r3 M3). */
  | "notify_expired"
  /** The lead tables use 60% or more of LEAD_DB_BUDGET_MB (default 400; AEGIS r3 M4). */
  | "db_budget"
  /**
   * Resend reported an accepted lead email as not delivered (bounced,
   * complained, suppressed, failed) or never confirmed it, in the last 24 h
   * (AEGIS r4 M2). If the founder inbox is on Resend's suppression list,
   * remove it there (docs/LEAD-ROUTE-DESIGN.md §8).
   */
  | "delivery_failed"
  /** Delivery lookups have been failing (not 401/403) for over DELIVERY_CHECK_FAILING_HOURS (AEGIS r5 N3). */
  | "delivery_check_failing"
  /**
   * WARNING, not degraded (/api/health answers 200 with this status): the
   * delivery check cannot run — Resend refused the lookup as unauthorized
   * (a sending-only API key; delivery checks need a Full access key), or an
   * accepted email came back without a usable id in the last 24 h (AEGIS r5 N2/N4).
   */
  | "delivery_unverifiable";

/** Statuses that are warnings: reported, logged at warn, but /api/health still answers 200. */
export const HEALTH_WARNINGS: ReadonlySet<PurgeHealth> = new Set<PurgeHealth>(["delivery_unverifiable"]);
/** Lookups failing for longer than this degrade health (AEGIS r5 N3). */
export const DELIVERY_CHECK_FAILING_HOURS = 6;

export type HealthOptions = {
  app: LeadApp;
  env?: Env;
  logger?: LeadLogger;
  now?: () => Date;
  /** Test seam; production builds it from POSTGRES_URL. */
  ledger?: PurgeLedger;
  /** How long a computed status is reused on this instance (default 60 s; 0 disables). */
  cacheMs?: number;
};

/** One computed status per app per instance, reused for HEALTH_CACHE_MS. */
export const HEALTH_CACHE_MS = 60_000;
type HealthResult = { status: PurgeHealth; ageHours?: number };
const healthCache = new Map<LeadApp, { at: number; result: Promise<HealthResult> }>();

/** Test seam: forget cached statuses. */
export function resetHealthCache() {
  healthCache.clear();
}

/**
 * Whether the retention promise is actually being kept for this app. Every
 * status but "ok" and the HEALTH_WARNINGS is DEGRADED and is logged at error
 * level, so a log alert or an uptime check on /api/health catches a purge
 * that stopped. A warning is logged at warn level and answered 200.
 */
export async function purgeHealth(opts: HealthOptions): Promise<{ status: PurgeHealth; ageHours?: number }> {
  const log = opts.logger ?? consoleLogger;
  const env = opts.env ?? process.env;
  const app = opts.app;
  const degraded = (status: PurgeHealth, missing?: string, ageHours?: number) => {
    log("error", "purge_degraded", { app, status, ...(missing ? { missing } : {}) });
    return { status, ...(ageHours === undefined ? {} : { ageHours }) };
  };
  if ((env.CRON_SECRET ?? "").trim().length < 16) return degraded("cron_secret_missing", "CRON_SECRET:min-16-chars");
  const retention = resolveRetention(env);
  if (!retention.ok) return degraded("misconfigured", retention.problems.join(","));
  const budgetMb = leadDbBudgetMb(env);
  if (budgetMb === null) return degraded("misconfigured", "LEAD_DB_BUDGET_MB:whole-megabytes");
  let ledger = opts.ledger;
  if (!ledger) {
    const url = (env.POSTGRES_URL ?? "").trim();
    const pg = url ? resolvePg(url, env) : null;
    if (!pg || !pg.ok) return degraded("misconfigured", pg ? `POSTGRES_URL:${pg.reason}` : "POSTGRES_URL");
    ledger = postgresPurger(pg.options);
  }
  if (ledger.missingColumns) {
    let missing: string[];
    try {
      missing = await ledger.missingColumns();
    } catch {
      return degraded("unknown");
    }
    // Column names are ours (a fixed list), safe to log.
    if (missing.length) return degraded("schema_outdated", missing.join(","));
  }
  if (ledger.dbBytes) {
    // AEGIS r3 M4: before the database fills, while there is time to act.
    let bytes: number;
    try {
      bytes = await ledger.dbBytes();
    } catch {
      return degraded("unknown");
    }
    const usedMb = bytes / (1024 * 1024);
    if (usedMb >= budgetMb * DB_BUDGET_ALERT_RATIO) {
      log("error", "lead_db_budget", { app, used_mb: Math.round(usedMb), budget_mb: budgetMb });
      return degraded("db_budget");
    }
  }
  let last: Date | null;
  try {
    last = await ledger.lastSuccess(app);
  } catch {
    return degraded("unknown");
  }
  if (!last) return degraded("never_run");
  const nowMs = (opts.now ?? (() => new Date()))().getTime();
  const ageHours = Math.floor((nowMs - last.getTime()) / 3_600_000);
  if (ageHours > PURGE_OVERDUE_HOURS) return degraded("overdue", undefined, ageHours);
  const raw = (env.LEAD_NOTIFY_ALERT_MINUTES ?? "").trim();
  const minutes = /^\d{1,5}$/.test(raw) && Number(raw) >= 1 ? Number(raw) : DEFAULT_NOTIFY_ALERT_MINUTES;
  if (ledger.leadState) {
    let state: Awaited<ReturnType<NonNullable<PurgeLedger["leadState"]>>>;
    try {
      state = await ledger.leadState(app, {
        unsentBefore: new Date(nowMs - minutes * 60_000),
        retryAfter: new Date(nowMs - notifyRetryDays(env) * 86_400_000),
      });
    } catch {
      return degraded("unknown");
    }
    // Every cap or guard trip degrades health (AEGIS r2 H1(c)).
    if (state.stored24h >= resolveCaps(env).hardLimit) return degraded("storage_guard");
    if ((state.undelivered24h ?? 0) > 0 || (state.abandoned7d ?? 0) > 0) return degraded("delivery_failed");
    if (state.quarantined24h > 0) return degraded("quarantined");
    if ((state.expiredUnreported ?? 0) > 0) return degraded("notify_expired");
    if (state.digestPending > 0 || state.unsent > 0) return degraded("notify_backlog");
    let check: { unauthorized: boolean; failingSince: Date | null } = { unauthorized: false, failingSince: null };
    if (ledger.deliveryCheckState) {
      try {
        check = await ledger.deliveryCheckState(app);
      } catch {
        return degraded("unknown");
      }
    }
    if (check.failingSince && nowMs - check.failingSince.getTime() > DELIVERY_CHECK_FAILING_HOURS * 3_600_000) return degraded("delivery_check_failing");
    if (check.unauthorized || (state.unverifiable24h ?? 0) > 0) {
      log("warn", "purge_degraded", { app, status: "delivery_unverifiable" });
      return { status: "delivery_unverifiable", ageHours };
    }
  } else if (ledger.unsentOlderThan) {
    let unsent: number;
    try {
      unsent = await ledger.unsentOlderThan(app, new Date(nowMs - minutes * 60_000));
    } catch {
      return degraded("unknown");
    }
    if (unsent > 0) return degraded("notify_backlog");
  }
  return { status: "ok", ageHours };
}

/**
 * GET /api/health: 200 when the retention purge is healthy (or only a
 * warning such as delivery_unverifiable applies), 503 when degraded, so any
 * uptime monitor alerts on it. The body is minimal,
 * `{"ok":bool,"status":"<code>"}`: no ages, counts or config values.
 *
 * Public, so it must not be a lever on the database (AEGIS H-M2): each
 * instance computes the status at most once per HEALTH_CACHE_MS (concurrent
 * requests share the one in-flight check), which also limits the
 * error-level `purge_degraded` log to once a minute per instance, and the
 * CDN may serve the same answer for 60 s (s-maxage). A monitor therefore
 * sees a change within about two minutes, well inside the 48 h window.
 */
export async function handleHealth(_request: Request, opts: HealthOptions): Promise<Response> {
  const ttl = opts.cacheMs ?? HEALTH_CACHE_MS;
  const nowMs = (opts.now ?? (() => new Date()))().getTime();
  let entry = ttl > 0 ? healthCache.get(opts.app) : undefined;
  if (!entry || nowMs - entry.at >= ttl || nowMs < entry.at) {
    entry = { at: nowMs, result: purgeHealth(opts).catch((): HealthResult => ({ status: "unknown" })) };
    if (ttl > 0) healthCache.set(opts.app, entry);
  }
  const purge = await entry.result;
  const ok = purge.status === "ok" || HEALTH_WARNINGS.has(purge.status);
  return Response.json(
    { ok, status: purge.status },
    { status: ok ? 200 : 503, headers: { "Cache-Control": `public, max-age=0, s-maxage=${Math.round(HEALTH_CACHE_MS / 1000)}` } },
  );
}
