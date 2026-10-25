import { fakeNotifier, fakeStore } from "./fake";
import { hmacIp } from "./ip";
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

export function resolveTransport(env: Env): TransportConfig {
  const missing: string[] = [];
  const transport = set(env, "ZBEST_LEAD_TRANSPORT");

  if (transport === "fake") {
    if (set(env, "VERCEL")) return { ok: false, missing: ["ZBEST_LEAD_TRANSPORT:fake-refused-on-vercel"] };
    const dir = set(env, "ZBEST_LEAD_FAKE_OUTBOX");
    if (!dir || !dir.startsWith("/")) missing.push("ZBEST_LEAD_FAKE_OUTBOX:absolute-path-required");
    const notify = resolveNotifyMode(env, missing);
    if (missing.length) return { ok: false, missing };
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
  if (!url) missing.push("POSTGRES_URL");
  else if (!/^postgres(ql)?:\/\//.test(url)) missing.push("POSTGRES_URL:not-a-postgres-url");

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

  if (missing.length) return { ok: false, missing };
  return {
    ok: true,
    transport: { mode: "live", store: postgresStore(url), notifier, hashIp: hmacIp(secret) },
  };
}

const limiters = new Map<string, RateLimiter>();

/**
 * Always returns a limiter, so abuse is limited even while the transport is
 * misconfigured. A malformed LEAD_RATE_LIMIT is reported as a misconfiguration
 * and the default applies to the rate check meanwhile.
 */
export function resolveLimiter(
  env: Env,
  logger: LeadLogger,
): { limiter: RateLimiter; spec: RateLimitSpec; problem?: string } {
  const parsed = parseRateLimit(env.LEAD_RATE_LIMIT);
  const spec = parsed ?? DEFAULT_RATE_LIMIT;
  const problem = parsed ? undefined : "LEAD_RATE_LIMIT:expected-count/seconds";
  const restUrl = set(env, "KV_REST_API_URL") || set(env, "UPSTASH_REDIS_REST_URL");
  const restToken = set(env, "KV_REST_API_TOKEN") || set(env, "UPSTASH_REDIS_REST_TOKEN");
  const cacheKey = `${spec.limit}/${spec.windowSec}|${restUrl ? "rest" : "memory"}`;

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
  return { limiter, spec, problem };
}
