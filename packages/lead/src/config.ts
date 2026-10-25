import { existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fakeNotifier, fakeStore } from "./fake";
import { hmacIp } from "./ip";
import { parsePostgresUrl } from "./pg-url";
import type { LeadLogger } from "./log";
import { postgresStore } from "./postgres";
import { memoryLimiter, parseRateLimit, restLimiter, DEFAULT_RATE_LIMIT, type RateLimitSpec } from "./rate-limit";
import { resendNotifier } from "./resend";
import type { LeadNotifier, LeadStore, RateLimiter } from "./types";

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
  hashIp: (ip: string) => string;
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
    return {
      ok: true,
      transport: {
        mode: "fake",
        store: fakeStore(dir),
        notifier: notify === "disabled" ? null : fakeNotifier(dir, ["founder@fake.invalid"]),
        hashIp: hmacIp("fake-transport-not-a-secret"),
      },
    };
  }
  if (transport !== "") return { ok: false, missing: ["ZBEST_LEAD_TRANSPORT:only-fake-recognised"] };

  const url = set(env, "POSTGRES_URL");
  const pg = url ? parsePostgresUrl(url) : null;
  if (!pg) missing.push("POSTGRES_URL");
  else if (!pg.ok) missing.push(`POSTGRES_URL:${pg.reason}`);

  const secret = set(env, "LEAD_IP_HASH_SECRET");
  if (secret.length < 16) missing.push("LEAD_IP_HASH_SECRET:min-16-chars");

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
  return {
    ok: true,
    transport: { mode: "live", store: postgresStore(pg.options), notifier, hashIp: hmacIp(secret) },
  };
}

/** Request-level policy: who may post, which client address to trust, how big a body may be. */
export type RequestPolicy = {
  /** Trust x-vercel-forwarded-for / x-real-ip / x-forwarded-for (AEGIS M4). */
  trustProxy: boolean;
  /** Running on Vercel (VERCEL=1), where the edge supplies the client address. */
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
  const trusted = set(env, "LEAD_TRUSTED_PROXY").toLowerCase();
  if (trusted !== "" && trusted !== "1" && trusted !== "true") problems.push("LEAD_TRUSTED_PROXY:must-be-1-or-unset");
  const onVercel = set(env, "VERCEL") === "1";
  const trustProxy = onVercel || trusted === "1" || trusted === "true";
  // AEGIS r2 N1: off Vercel, with no trusted proxy, there is no client
  // address to limit by, and a shared bucket would let one client lock every
  // visitor out. So that combination is a misconfiguration, not a mode.
  if (!trustProxy) problems.push("LEAD_TRUSTED_PROXY:required-off-vercel");
  return {
    // On Vercel the edge sets these headers; elsewhere only an operator who
    // knows a proxy overwrites them may switch trust on.
    trustProxy,
    onVercel,
    allowedOrigins,
    maxBodyBytes: DEFAULT_MAX_BODY_BYTES,
    problems,
  };
}

const limiters = new Map<string, RateLimiter>();

export type Limiters = {
  /** Per client address, per app. */
  perIp: RateLimiter;
  /**
   * The fallback, used only when the proxy is trusted but no client address
   * arrived (on Vercel the edge always sets one, so this is a backstop) —
   * AEGIS r2 N1. Keys, never one global bucket:
   *   - a same-origin browser request: a fingerprint of its user agent and
   *     language headers, so a non-browser flood cannot lock real visitors
   *     out;
   *   - anything else (no matching Origin): a per-app "no-origin" key, which
   *     only non-browser clients share.
   * Its limit (LEAD_RATE_LIMIT_FLOOD, default 200/600) is deliberately higher
   * than the per-IP one, because a fingerprint can be shared by many people.
   */
  flood: RateLimiter;
  spec: RateLimitSpec;
  problem?: string;
};

const DEFAULT_FLOOD = "200/600";

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
export function resolveLimiter(env: Env, logger: LeadLogger): Limiters {
  const parsed = parseRateLimit(env.LEAD_RATE_LIMIT);
  const spec = parsed ?? DEFAULT_RATE_LIMIT;
  const floodParsed = parseRateLimit(env.LEAD_RATE_LIMIT_FLOOD || DEFAULT_FLOOD);
  const floodSpec = floodParsed ?? parseRateLimit(DEFAULT_FLOOD)!;
  const problems = [
    ...(parsed ? [] : ["LEAD_RATE_LIMIT:expected-count/seconds"]),
    ...(floodParsed ? [] : ["LEAD_RATE_LIMIT_FLOOD:expected-count/seconds"]),
  ];
  return {
    perIp: buildLimiter(spec, env, logger, "ip"),
    flood: buildLimiter(floodSpec, env, logger, "flood"),
    spec,
    problem: problems.length ? problems.join(",") : undefined,
  };
}
