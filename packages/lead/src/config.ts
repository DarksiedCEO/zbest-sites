import { existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fakeNotifier, fakeStore } from "./fake";
import { TRUSTED_PROXY_HEADERS, VERCEL_IP_SOURCE, hmacIp, ipSourceFor, type IpSource } from "./ip";
import { resolvePg } from "./pg-url";
import { fakeFormTokenSecret, formTokens, type FormTokens } from "./form-token";
import type { LeadLogger } from "./log";
import { postgresStore } from "./postgres";
import { memoryLimiter, parseRateLimit, restLimiter, DEFAULT_RATE_LIMIT, type RateLimitSpec } from "./rate-limit";
import { resendNotifier } from "./resend";
import type { LeadNotifier, LeadStore, NotifyOutbox, RateLimiter } from "./types";

/**
 * Which implementation sits behind each port, decided by env and nothing else.
 *
 * FAIL CLOSED. Real delivery is off until it is configured, and a partial
 * configuration is a misconfiguration, not a degraded mode: the route answers
 * 503 not_configured and stores nothing. The only way to run without the
 * founder email is to say so explicitly (LEAD_NOTIFY=disabled) — a missing
 * RESEND_API_KEY is never read as "notifications off".
 *
 * `missing` holds setting NAMES (with a short reason code) only, so it is safe
 * to log. No value is ever included.
 */

export type Env = Record<string, string | undefined>;

export type Transport = {
  mode: "live" | "fake";
  store: LeadStore;
  /** null only when LEAD_NOTIFY=disabled was set on purpose. */
  notifier: LeadNotifier | null;
  /** Keyed HMAC of a client address (LEAD_IP_HASH_SECRET). Rate-limit keys only. */
  hashIp: (ip: string) => string;
  /** Issues and checks the form token every POST must carry (RTS-3). */
  formTokens: FormTokens;
  /** The unsent-email outbox the retry cron reads (CH-8); the same store. */
  outbox?: NotifyOutbox;
};

export type TransportConfig = { ok: true; transport: Transport } | { ok: false; missing: string[] };

const EMAIL = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;
/** "Name <a@b.co>" or "a@b.co". */
const FROM = /^(?:[^<>]+<[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+>|[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+)$/;

const set = (env: Env, name: string) => (env[name] ?? "").trim();

function resolveNotifyMode(env: Env, missing: string[]): "enabled" | "disabled" {
  const mode = set(env, "LEAD_NOTIFY").toLowerCase();
  if (mode === "disabled") return "disabled";
  if (mode !== "" && mode !== "enabled") missing.push("LEAD_NOTIFY:must-be-enabled-or-disabled");
  return "enabled";
}

function recipients(env: Env, missing: string[]): string[] {
  const to = set(env, "LEAD_NOTIFY_TO")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (to.length === 0) missing.push("LEAD_NOTIFY_TO");
  else if (!to.every((a) => EMAIL.test(a))) missing.push("LEAD_NOTIFY_TO:not-an-email-list");
  return to;
}

/**
 * Any of these means "a deployed, production-like platform". The fake
 * transport refuses to run where any is set (AEGIS M2), in addition to
 * needing its positive proof below.
 */
const PLATFORM_MARKERS = [
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_URL",
  "RAILWAY_ENVIRONMENT",
  "RAILWAY_PROJECT_ID",
  "FLY_APP_NAME",
  "RENDER",
  "K_SERVICE",
  "NETLIFY",
  "AWS_LAMBDA_FUNCTION_NAME",
  "DYNO",
  // Any Kubernetes pod (AEGIS r2 N6).
  "KUBERNETES_SERVICE_HOST",
];

/**
 * The deepest existing ancestor of `p`, resolved through symlinks, with the
 * rest re-appended — so a symlink under /tmp pointing elsewhere is caught
 * even before the outbox exists (AEGIS r2 N6).
 */
function realish(p: string): string {
  let head = path.resolve(p);
  const tail: string[] = [];
  while (!existsSync(head)) {
    const parent = path.dirname(head);
    if (parent === head) break;
    tail.unshift(path.basename(head));
    head = parent;
  }
  return path.join(realpathSync(head), ...tail);
}

/**
 * The fake transport writes "leads" to a local JSONL file and answers
 * success, so it must be impossible to enable by accident. It needs ALL of:
 *   1. ZBEST_LEAD_TRANSPORT=fake;
 *   2. ZBEST_LEAD_FAKE_ACK equal to ZBEST_GATE_NONCE, a random value the
 *      Playwright gate generates per run (so a stale env var copied into a
 *      deployment does not match anything);
 *   3. an outbox under the OS temp directory;
 *   4. no production-platform marker in the environment.
 * NODE_ENV cannot be the test: `next start` — which the gate must exercise —
 * always runs with NODE_ENV=production. The per-run nonce is the stronger
 * equivalent the review allowed.
 */
function fakeTransportProblems(env: Env): string[] {
  const problems: string[] = [];
  const marker = PLATFORM_MARKERS.find((name) => set(env, name));
  if (marker) problems.push(`ZBEST_LEAD_TRANSPORT:fake-refused-on-platform-${marker}`);
  const nonce = set(env, "ZBEST_GATE_NONCE");
  if (nonce.length < 16 || set(env, "ZBEST_LEAD_FAKE_ACK") !== nonce) problems.push("ZBEST_LEAD_FAKE_ACK:must-equal-gate-nonce");
  const dir = set(env, "ZBEST_LEAD_FAKE_OUTBOX");
  const tmp = realpathSync(path.resolve(tmpdir()));
  if (!dir || !path.isAbsolute(dir) || !realish(dir).startsWith(tmp + path.sep)) {
    problems.push("ZBEST_LEAD_FAKE_OUTBOX:must-be-under-os-tmpdir");
  }
  return problems;
}

/**
 * Never throws (AEGIS M1): every way configuration can be wrong comes back
 * as `{ ok: false, missing }` naming settings, never values.
 */
export function resolveTransport(env: Env): TransportConfig {
  try {
    return resolveTransportUnsafe(env);
  } catch {
    return { ok: false, missing: ["LEAD_TRANSPORT:unresolvable"] };
  }
}

function resolveTransportUnsafe(env: Env): TransportConfig {
  const missing: string[] = [];
  // Exact match, no trimming: " fake " is a typo, not a test switch (AEGIS r2 N6).
  const transport = env.ZBEST_LEAD_TRANSPORT ?? "";

  if (transport === "fake") {
    missing.push(...fakeTransportProblems(env));
    const notify = resolveNotifyMode(env, missing);
    if (missing.length) return { ok: false, missing };
    const dir = set(env, "ZBEST_LEAD_FAKE_OUTBOX");
    const store = fakeStore(dir);
    return {
      ok: true,
      transport: {
        mode: "fake",
        store,
        outbox: store,
        notifier: notify === "disabled" ? null : fakeNotifier(dir, ["founder@fake.invalid"]),
        hashIp: hmacIp("fake-transport-not-a-secret"),
        // Derived from the gate's per-run nonce, so the gate can mint tokens for its direct posts.
        formTokens: formTokens(fakeFormTokenSecret(set(env, "ZBEST_GATE_NONCE"))),
      },
    };
  }
  if (transport !== "") return { ok: false, missing: ["ZBEST_LEAD_TRANSPORT:only-fake-recognised"] };

  const url = set(env, "POSTGRES_URL");
  // AEGIS r2 L5, red team RTS-8: in production a remote database must be
  // reached over TLS that verifies its certificate (pg-url.ts productionPg).
  const pg = url ? resolvePg(url, env) : null;
  if (!pg) missing.push("POSTGRES_URL");
  else if (!pg.ok) missing.push(`POSTGRES_URL:${pg.reason}`);

  const secret = set(env, "LEAD_IP_HASH_SECRET");
  if (secret.length < 16) missing.push("LEAD_IP_HASH_SECRET:min-16-chars");
  // RTS-3: the form-token key. Its own secret when set; otherwise derived
  // from the IP-hash secret under a different label (form-token.ts).
  const formSecret = set(env, "LEAD_FORM_SECRET");
  if (formSecret && formSecret.length < 16) missing.push("LEAD_FORM_SECRET:min-16-chars");

  const notify = resolveNotifyMode(env, missing);
  let notifier: LeadNotifier | null = null;
  if (notify === "enabled") {
    const apiKey = set(env, "RESEND_API_KEY");
    const from = set(env, "LEAD_NOTIFY_FROM");
    if (!apiKey) missing.push("RESEND_API_KEY");
    if (!from) missing.push("LEAD_NOTIFY_FROM");
    else if (!FROM.test(from)) missing.push("LEAD_NOTIFY_FROM:not-a-sender-address");
    const to = recipients(env, missing);
    if (!missing.length) notifier = resendNotifier({ apiKey, from, to });
  }

  if (missing.length || !pg?.ok) return { ok: false, missing };
  const store = postgresStore(pg.options);
  return {
    ok: true,
    transport: {
      mode: "live",
      store,
      outbox: store,
      notifier,
      hashIp: hmacIp(secret),
      formTokens: formTokens(formSecret || secret),
    },
  };
}

/** Request-level policy: who may post, which client address to trust, how big a body may be. */
export type RequestPolicy = {
  /**
   * The ONE header trusted for the client address (AEGIS r3 F1), or null when
   * none is (a misconfiguration off Vercel — `problems` says so).
   */
  ipSource: IpSource | null;
  /** Running on Vercel (VERCEL === "1" exactly). */
  onVercel: boolean;
  /** Extra allowed browser origins; same-origin is always allowed (AEGIS M3). */
  allowedOrigins: Set<string>;
  maxBodyBytes: number;
  problems: string[];
};

export const DEFAULT_MAX_BODY_BYTES = 64 * 1024;

export function resolvePolicy(env: Env): RequestPolicy {
  const problems: string[] = [];
  const allowedOrigins = new Set<string>();
  for (const raw of set(env, "LEAD_ALLOWED_ORIGINS").split(",").map((s) => s.trim()).filter(Boolean)) {
    try {
      const u = new URL(raw);
      if ((u.protocol !== "https:" && u.protocol !== "http:") || u.pathname !== "/" || u.search || u.username) throw new Error();
      allowedOrigins.add(u.origin);
    } catch {
      problems.push("LEAD_ALLOWED_ORIGINS:not-an-origin-list");
    }
  }

  // Exactly "1": VERCEL=true or VERCEL=yes is not Vercel's own marker.
  const onVercel = (env.VERCEL ?? "") === "1";
  const named = set(env, "LEAD_TRUSTED_PROXY").toLowerCase();
  const valid = (TRUSTED_PROXY_HEADERS as readonly string[]).includes(named);
  if (named !== "" && !valid) problems.push(`LEAD_TRUSTED_PROXY:must-name-one-of-${TRUSTED_PROXY_HEADERS.join("|")}`);

  // AEGIS r4 R1: how many appending proxies sit in front, for x-forwarded-for
  // only. Default 1. Meaningless (so refused) for the single-value headers.
  const hopsRaw = set(env, "LEAD_TRUSTED_PROXY_HOPS");
  let hops = 1;
  if (hopsRaw !== "") {
    if (!/^(?:[1-9])$/.test(hopsRaw)) problems.push("LEAD_TRUSTED_PROXY_HOPS:must-be-1-to-9");
    else if (named !== "x-forwarded-for") problems.push("LEAD_TRUSTED_PROXY_HOPS:only-with-x-forwarded-for");
    else hops = Number(hopsRaw);
  }

  let ipSource: IpSource | null = null;
  if (onVercel) {
    // The edge sets x-vercel-forwarded-for; nothing else is read on Vercel.
    ipSource = VERCEL_IP_SOURCE;
  } else if (valid) {
    ipSource = ipSourceFor(named as (typeof TRUSTED_PROXY_HEADERS)[number], hops);
  } else if (named === "") {
    // AEGIS r2 N1: off Vercel with no named proxy header there is no client
    // address to limit by, and a shared bucket would let one client lock
    // every visitor out. A misconfiguration, not a mode.
    problems.push("LEAD_TRUSTED_PROXY:required-off-vercel");
  }
  return { ipSource, onVercel, allowedOrigins, maxBodyBytes: DEFAULT_MAX_BODY_BYTES, problems };
}

const limiters = new Map<string, RateLimiter>();

/**
 * Lead caps (RTS-3; AEGIS F1, r2 H1/M5). The per-address and per-/48
 * buckets are charged before validation, per source. EVERY site-wide
 * counter is charged only after the insert, for a NEWLY stored lead, so
 * duplicates never count, and none of them refuses a lead — except the
 * storage guard, which exists only to keep the table from being flooded:
 *   - emailMinute / emailHour: past either, the lead is stored and its
 *     email deferred to the digest;
 *   - quarantine: past it (per day), the lead is stored flagged
 *     `quarantined`, its text cut to 2 KB, and deferred;
 *   - hard: past it (per day), new submissions are refused with 503
 *     `storage_guard` until the window ends.
 * Attacker cost of each is in docs/LEAD-ROUTE-DESIGN.md.
 */
export type Limiters = {
  perIp: RateLimiter;
  /** Per IPv6 /48, per app (red team RTS-3). IPv4 clients have no /48 bucket. */
  perNet: RateLimiter;
  /** Per-lead founder emails per minute (LEAD_GLOBAL_LIMIT_PER_MINUTE, default 20). */
  global: RateLimiter;
  /** Per-lead founder emails per hour (LEAD_EMAIL_LIMIT_PER_HOUR, default 20; r2 M5). */
  emailHour: RateLimiter;
  /** Newly stored leads per day before quarantine (LEAD_QUARANTINE_AFTER_PER_DAY, default 5000). */
  quarantine: RateLimiter;
  /** Newly stored leads per day before the storage guard refuses (LEAD_HARD_LIMIT_PER_DAY, default 100000). */
  hard: RateLimiter;
  /** The storage guard's state for this app and limiter set: refuse until this time (ms). */
  guard: { until: number };
  spec: RateLimitSpec;
  netSpec: RateLimitSpec;
  globalSpec: RateLimitSpec;
  emailHourSpec: RateLimitSpec;
  quarantineSpec: RateLimitSpec;
  hardSpec: RateLimitSpec;
  problem?: string;
};

/** Default /48 bucket: three times the per-address default over the same window. */
export const DEFAULT_NET_RATE_LIMIT: RateLimitSpec = { limit: 24, windowSec: 600 };
export const DEFAULT_GLOBAL_LIMIT_PER_MINUTE = 20;
export const DEFAULT_EMAIL_LIMIT_PER_HOUR = 20;
export const DEFAULT_QUARANTINE_AFTER_PER_DAY = 5_000;
export const DEFAULT_HARD_LIMIT_PER_DAY = 100_000;

/** A whole number from 1 to `max`, or the default; a malformed value is a problem, never a guess. */
function count(env: Env, name: string, fallback: number, max: number, problems: string[]): number {
  const raw = set(env, name);
  if (raw === "") return fallback;
  const n = /^\d{1,7}$/.test(raw) ? Number(raw) : NaN;
  if (n >= 1 && n <= max) return n;
  problems.push(`${name}:expected-1-to-${max}`);
  return fallback;
}

/** The site-wide caps, also read by /api/health (retention.ts). */
export function resolveCaps(env: Env, problems: string[] = []) {
  return {
    perMinute: count(env, "LEAD_GLOBAL_LIMIT_PER_MINUTE", DEFAULT_GLOBAL_LIMIT_PER_MINUTE, 100_000, problems),
    perHour: count(env, "LEAD_EMAIL_LIMIT_PER_HOUR", DEFAULT_EMAIL_LIMIT_PER_HOUR, 1_000_000, problems),
    quarantineAfter: count(env, "LEAD_QUARANTINE_AFTER_PER_DAY", DEFAULT_QUARANTINE_AFTER_PER_DAY, 10_000_000, problems),
    hardLimit: count(env, "LEAD_HARD_LIMIT_PER_DAY", DEFAULT_HARD_LIMIT_PER_DAY, 10_000_000, problems),
  };
}

const guards = new Map<string, { until: number }>();

function buildLimiter(spec: RateLimitSpec, env: Env, logger: LeadLogger, tag: string): RateLimiter {
  const restUrl = set(env, "KV_REST_API_URL") || set(env, "UPSTASH_REDIS_REST_URL");
  const restToken = set(env, "KV_REST_API_TOKEN") || set(env, "UPSTASH_REDIS_REST_TOKEN");
  const cacheKey = `${tag}|${spec.limit}/${spec.windowSec}|${restUrl && restToken ? "rest" : "memory"}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    const memory = memoryLimiter(spec);
    limiter =
      restUrl && restToken
        ? restLimiter({
            url: restUrl,
            token: restToken,
            spec,
            fallback: memory,
            onFallback: () => logger("warn", "rate_limit_store_unreachable", { limiter: "memory" }),
          })
        : memory;
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * Always returns limiters, so abuse is limited even while the transport is
 * misconfigured. A malformed setting is reported as a misconfiguration and
 * the default applies to the rate check meanwhile.
 *
 * Without KV_REST_API_* (or UPSTASH_REDIS_REST_*) the counters live in each
 * server instance's memory: on Vercel that is per serverless instance, NOT a
 * global cap. A global cap needs KV — a launch decision (design note §5).
 */
export function resolveLimiter(env: Env, logger: LeadLogger, namespace = ""): Limiters {
  const problems: string[] = [];
  const parsed = parseRateLimit(env.LEAD_RATE_LIMIT);
  if (!parsed) problems.push("LEAD_RATE_LIMIT:expected-count/seconds");
  const spec = parsed ?? DEFAULT_RATE_LIMIT;

  const netRaw = env.LEAD_RATE_LIMIT_NET;
  const netParsed = netRaw === undefined || netRaw.trim() === "" ? DEFAULT_NET_RATE_LIMIT : parseRateLimit(netRaw);
  if (!netParsed) problems.push("LEAD_RATE_LIMIT_NET:expected-count/seconds");
  const netSpec = netParsed ?? DEFAULT_NET_RATE_LIMIT;

  const caps = resolveCaps(env, problems);
  const globalSpec = { limit: caps.perMinute, windowSec: 60 };
  const emailHourSpec = { limit: caps.perHour, windowSec: 3600 };
  const quarantineSpec = { limit: caps.quarantineAfter, windowSec: 86_400 };
  const hardSpec = { limit: caps.hardLimit, windowSec: 86_400 };
  const guardKey = `${namespace}|${hardSpec.limit}`;
  let guard = guards.get(guardKey);
  if (!guard) guards.set(guardKey, (guard = { until: 0 }));

  return {
    perIp: buildLimiter(spec, env, logger, `${namespace}ip`),
    perNet: buildLimiter(netSpec, env, logger, `${namespace}net`),
    global: buildLimiter(globalSpec, env, logger, `${namespace}global`),
    emailHour: buildLimiter(emailHourSpec, env, logger, `${namespace}email-hour`),
    quarantine: buildLimiter(quarantineSpec, env, logger, `${namespace}quarantine`),
    hard: buildLimiter(hardSpec, env, logger, `${namespace}hard`),
    guard,
    spec,
    netSpec,
    globalSpec,
    emailHourSpec,
    quarantineSpec,
    hardSpec,
    problem: problems.length ? problems.join(",") : undefined,
  };
}
