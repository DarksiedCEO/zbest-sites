import { resolveLimiter, resolvePolicy, resolveTransport, type Env, type Limiters, type RequestPolicy, type TransportConfig } from "./config";
import { NOTIFY_PENDING_GRACE_MS } from "./notify-retry";
import { FORM_TOKEN_HEADER } from "./form-token";
import { contentHash, payloadHash } from "./hash";
import { clientIp } from "./ip";
import { consoleLogger, type LeadLogger } from "./log";
import { regionServed, type Region } from "./region";
import { cleanJson } from "./text";
import { deliverLead } from "./notify";
import { DeliveryError, type LeadApp, type LeadRecord, type RateLimiter, type StoredLead } from "./types";

/**
 * The one §6.2 lead pipeline both apps' route handlers call. Each app keeps
 * its own zod schemas and hands this a `parse` function; everything about
 * where a lead goes lives here.
 *
 * Order (docs/LEAD-ROUTE-DESIGN.md §4):
 *   content type (415) → origin (403) → declared size (413) → config (503)
 *   → client address from the one trusted header (503 if absent)
 *   → body, capped (413) → JSON, cleaned (NUL, lone surrogates, NFC: RTS-7)
 *   → honeypot (not charged) → rate limit per address, then per IPv6 /48 (429)
 *   → form token (403 form_expired: RTS-3) → the app's validation (400/422)
 *   → service area (422) → global per-app cap (429 busy: RTS-3)
 *   → store (upsert on app + submission_id; 409 on a changed resubmission;
 *     the same normalised content within 24 h is one lead: RTS-3)
 *   → notify → respond
 *
 * Honesty rules:
 *   - never claim success unless the row was written (or the identical row
 *     already existed);
 *   - a misconfigured transport is 503 not_configured, never a quiet success;
 *   - an email failure after the row is written is logged and recorded on the
 *     row, and the visitor still sees success (Brief §6.2 failure mode);
 *   - nothing thrown anywhere in here reaches the platform's error logger:
 *     an unexpected throw is logged as a bare event and answered 503.
 */

/** What an app's validator makes of a request body. */
export type ParsedLead =
  | { kind: "bad_request" }
  /** A typed rejection the app's form understands (422 validation, 409 superseded …). */
  | { kind: "reject"; status: number; body: unknown }
  /** Filled honeypot: answer exactly like a success; nothing is stored or sent. */
  | { kind: "honeypot"; form: string; body: unknown }
  | {
      kind: "lead";
      form: string;
      submission_id: string;
      payload: Record<string, unknown>;
      services?: string[];
      source?: string | null;
      /**
       * Where the business is (self-declared, validated by the app with
       * REGION from ./region). Required: the pipeline refuses an unserved
       * region before anything is stored (service-area rule).
       */
      region: Region;
      /** The success body for this form (e.g. it may carry a scored result). */
      body: unknown;
    };

export type LeadErrorBody =
  | { ok: false; error: { code: "bad_request" } }
  | { ok: false; error: { code: "unsupported_media_type" } }
  | { ok: false; error: { code: "forbidden_origin" } }
  | { ok: false; error: { code: "payload_too_large" } }
  | { ok: false; error: { code: "rate_limited"; retry_after_s: number } }
  | { ok: false; error: { code: "not_configured" } }
  | { ok: false; error: { code: "conflict" } }
  | { ok: false; error: { code: "region_unavailable" } }
  | { ok: false; error: { code: "form_expired" } }
  | { ok: false; error: { code: "form_too_fast"; retry_after_s: number } }
  /** AEGIS r2 H1: refused only while the storage guard is tripped (LEAD_HARD_LIMIT_PER_DAY). */
  | { ok: false; error: { code: "storage_guard"; retry_after_s: number } }
  | { ok: false; error: { code: "validation"; fields: Record<string, string> } }
  | { ok: false; error: { code: "unavailable" } };

/**
 * Store refusals caused by the characters in a submission, not by the
 * database being down: retrying cannot help, so the visitor is told to change
 * the text (422) instead of "try again" (RTS-7). cleanJson removes what
 * causes them today; this covers whatever else Postgres may refuse.
 *   22P05 untranslatable character (NUL in jsonb) · 22P02 invalid text
 *   representation (a lone surrogate in JSON) · 22021 invalid byte sequence
 */
const CHARACTER_SQLSTATES = new Set(["22P05", "22P02", "22021"]);
export const UNSTORABLE_TEXT_MESSAGE =
  "Some characters in this message can’t be saved. Remove any unusual symbols and send it again.";

export type HandleLeadOptions = {
  app: LeadApp;
  parse: (json: unknown) => ParsedLead;
  /** Defaults to process.env. */
  env?: Env;
  logger?: LeadLogger;
  /** Test seams; production resolves these from env. */
  transport?: TransportConfig;
  /** Test seam. A limiter left out is not applied (production always resolves every one). */
  limiters?: Partial<Pick<Limiters, "perNet" | "global" | "emailHour" | "quarantine" | "hard" | "guard">> & { perIp: RateLimiter };
  policy?: RequestPolicy;
  now?: () => Date;
};

/** application/json, with or without parameters (charset). */
const isJson = (contentType: string | null) => /^application\/json\s*(;|$)/i.test(contentType ?? "");

/** Same-origin, or an origin the operator listed (AEGIS M3). */
function originAllowed(request: Request, policy: RequestPolicy): boolean {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    if (policy.allowedOrigins.has(origin)) return true;
    let originHost: string;
    try {
      const u = new URL(origin);
      // A real Origin is scheme://host[:port] only (AEGIS r2 N7).
      if (u.username || u.password || (u.pathname !== "/" && u.pathname !== "") || u.search || u.hash) return false;
      originHost = u.host;
    } catch {
      return false; // includes the opaque "null" origin
    }
    // x-forwarded-host is believed only on Vercel, whose edge sets it; an
    // operator's proxy is trusted for one IP header only (AEGIS r3 F1).
    const forwardedHost = policy.onVercel ? request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() : undefined;
    const host = forwardedHost || request.headers.get("host");
    return !!host && originHost.toLowerCase() === host.toLowerCase();
  }
  // No Origin: browsers send one on every cross-origin POST, so this is a
  // non-browser client (rate-limited like anyone) — unless fetch metadata
  // says otherwise.
  return request.headers.get("sec-fetch-site")?.toLowerCase() !== "cross-site";
}

class TooLarge extends Error {}

/** AEGIS r2 L3: a store call answers within this, whatever the database is doing. */
const STORE_DEADLINE_MS = 6_000;
function withDeadline<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new DeliveryError("store_failed", "deadline")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** AEGIS r2 H1: what a quarantined lead keeps — about 2 KB of its text. */
const QUARANTINE_BYTES = 2_048;
export function truncatePayload(payload: Record<string, unknown>, budget: number): Record<string, unknown> {
  const strings: number[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") strings.push(v.length);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(payload);
  const per = Math.max(32, Math.floor(budget / Math.max(1, strings.length)) - 8);
  const cut = (v: unknown): unknown => {
    if (typeof v === "string") return v.length > per ? `${v.slice(0, per)}…[cut]` : v;
    if (Array.isArray(v)) return v.map(cut);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cut(x)]));
    return v;
  };
  return cut(payload) as Record<string, unknown>;
}

/** Reads at most `max` bytes; throws TooLarge past it, so a huge body is never buffered (AEGIS L1). */
async function readCapped(request: Request, max: number): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      throw new TooLarge();
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

export async function handleLead(request: Request, opts: HandleLeadOptions): Promise<Response> {
  const log = opts.logger ?? consoleLogger;
  try {
    return await handle(request, opts, log);
  } catch {
    // Deliberately no error object: it may carry a URL, a value or a stack.
    log("error", "internal_error", { app: opts.app });
    return Response.json({ ok: false, error: { code: "unavailable" } }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

async function handle(request: Request, opts: HandleLeadOptions, log: LeadLogger): Promise<Response> {
  const env = opts.env ?? process.env;
  const app = opts.app;
  const seen: { mode?: "live" | "fake" } = {};

  const reply = (body: unknown, status: number, extra: Record<string, string> = {}) =>
    Response.json(body, {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(seen.mode === "fake" ? { "X-Zbest-Lead-Transport": "fake" } : {}),
        ...extra,
      },
    });
  const fail = (body: LeadErrorBody, status: number, extra?: Record<string, string>) => reply(body, status, extra);

  const policy = opts.policy ?? resolvePolicy(env);

  // 1. Only JSON. A text/plain POST is a CORS "simple request" any site could
  //    fire from its visitors' browsers; JSON forces a preflight (AEGIS M3).
  if (!isJson(request.headers.get("content-type"))) {
    return fail({ ok: false, error: { code: "unsupported_media_type" } }, 415);
  }
  // 2. Same-origin, or listed in LEAD_ALLOWED_ORIGINS.
  if (!originAllowed(request, policy)) {
    log("warn", "forbidden_origin", { app });
    return fail({ ok: false, error: { code: "forbidden_origin" } }, 403);
  }
  // 3. A declared size over the cap is refused before anything is read.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > policy.maxBodyBytes) {
    return fail({ ok: false, error: { code: "payload_too_large" } }, 413);
  }

  // 4. Transport and policy. Missing config fails closed, naming settings
  //    (never values). Off Vercel without LEAD_TRUSTED_PROXY is refused here
  //    (AEGIS r2 N1), so no request ever reaches a shared bucket.
  const limiters: Partial<Pick<Limiters, "perNet" | "global" | "emailHour" | "quarantine" | "hard" | "guard" | "problem">> & { perIp: RateLimiter } =
    opts.limiters ?? resolveLimiter(env, log);
  const config = opts.transport ?? resolveTransport(env);
  const missing = [
    ...(config.ok ? [] : config.missing),
    ...(limiters.problem ? [limiters.problem] : []),
    ...policy.problems,
  ];
  if (!config.ok || missing.length) {
    log("error", "not_configured", { app, missing: missing.join(",") });
    return fail({ ok: false, error: { code: "not_configured" } }, 503);
  }
  const transport = config.transport;
  seen.mode = transport.mode;

  // 5. The client address, from the one trusted header (AEGIS r3 F1). A
  //    trusted proxy that sends no address is itself a misconfiguration: fail
  //    closed rather than guess a shared or fingerprint bucket (AEGIS r3 F2).
  const ip = clientIp(request.headers, policy.ipSource);
  if (!ip) {
    log("error", "not_configured", { app, missing: `no_client_address:${policy.ipSource?.header ?? "none"}` });
    return fail({ ok: false, error: { code: "not_configured" } }, 503);
  }

  // Rate limit — charged for every request that reaches validation, including
  // malformed JSON and 400/422 rejects (so probing and form-fuzzing spend
  // tokens), but never for a honeypot hit or an oversized body, so bot traffic
  // cannot spend a real visitor's tokens (AEGIS r2 N1).
  const charge = async (): Promise<Response | null> => {
    // The normalised key: port-free, IPv6 by its /64 (AEGIS r4 R2), keyed
    // with the IP-hash secret (HMAC). A plain SHA-256 of an IPv4 address is
    // reversible by brute force over 2^32, and with KV enabled the key leaves
    // the process (privacy sweep 2026-10-30, F7).
    let decision = await limiters.perIp.hit(`${app}:${transport.hashIp(ip.key).slice(0, 32)}`);
    let limiter = "ip";
    // RTS-3: an IPv6 client is also charged to its /48, so rotating /64s
    // inside one allocation does not mint fresh buckets. Charged only when
    // the address bucket allowed it, so one noisy /64 cannot drain its
    // neighbours' shared /48 by itself beyond its own limit.
    if (decision.allowed && ip.net && limiters.perNet) {
      decision = await limiters.perNet.hit(`${app}:${transport.hashIp(ip.net).slice(0, 32)}`);
      limiter = "net";
    }
    if (decision.allowed) return null;
    log("warn", "rate_limited", { app, limiter });
    return fail(
      { ok: false, error: { code: "rate_limited", retry_after_s: decision.retryAfterSec } },
      429,
      { "Retry-After": String(decision.retryAfterSec) },
    );
  };

  // 6. Body (capped; a 413 is not charged) and the app's own validation.
  let json: unknown;
  try {
    // RTS-7: NUL and unpaired surrogates removed, NFC applied, before the
    // app validates — so a field left empty by it is a 422 field error.
    json = cleanJson(JSON.parse(await readCapped(request, policy.maxBodyBytes)));
  } catch (error) {
    if (error instanceof TooLarge) return fail({ ok: false, error: { code: "payload_too_large" } }, 413);
    return (await charge()) ?? fail({ ok: false, error: { code: "bad_request" } }, 400);
  }
  const parsed = opts.parse(json);
  if (parsed.kind === "honeypot") {
    // Not charged: a bot's hits must not consume the bucket real visitors share.
    log("info", "honeypot", { app, form: parsed.form });
    return reply(parsed.body, 200);
  }
  const limited = await charge();
  if (limited) return limited;
  // RTS-3: the server-issued form token (form-token.ts). Checked after the
  // charge, so posting without one still spends the sender's bucket.
  // The token is bound to this site (AEGIS F2). One that is too new — or
  // a few seconds ahead because instances' clocks differ — is a 425 the
  // browser waits out and retries, not a refusal.
  const token = transport.formTokens.verify(app, request.headers.get(FORM_TOKEN_HEADER), (opts.now ?? (() => new Date()))().getTime());
  if (!token.ok) {
    log("warn", "form_token_refused", { app, code: token.problem });
    if (token.problem === "too_new") {
      const wait = Math.max(1, Math.ceil(token.retryAfterMs / 1000));
      return fail({ ok: false, error: { code: "form_too_fast", retry_after_s: wait } }, 425, { "Retry-After": String(wait) });
    }
    return fail({ ok: false, error: { code: "form_expired" } }, 403);
  }
  if (parsed.kind === "bad_request") return fail({ ok: false, error: { code: "bad_request" } }, 400);
  if (parsed.kind === "reject") return reply(parsed.body, parsed.status);

  // Service area (founder decisions 2026-10-30: 50 US states, DC, PR, GU, VI, AS, MP). Outside it the
  // visitor gets a polite 422 and NOTHING is stored or sent. Checked here, in
  // the shared pipeline, so no form can skip it. Charged like any 422.
  if (!regionServed(parsed.region)) {
    log("info", "region_refused", { app, form: parsed.form, code: parsed.region.state });
    return fail({ ok: false, error: { code: "region_unavailable" } }, 422);
  }

  // AEGIS r2 H1: the storage guard is the ONLY site-wide limit that refuses
  // a lead, and only after LEAD_HARD_LIMIT_PER_DAY (default 100,000) NEWLY
  // stored leads in a day — a threat to the table itself. Duplicates never
  // count toward it. Health reports it (storage_guard).
  if (limiters.guard && limiters.guard.until > Date.now()) {
    const wait = Math.max(1, Math.ceil((limiters.guard.until - Date.now()) / 1000));
    log("error", "storage_guard_refused", { app, limiter: "hard" });
    return fail({ ok: false, error: { code: "storage_guard", retry_after_s: wait } }, 503, { "Retry-After": String(wait) });
  }

  // 7. Store. The row is the lead; without it there is no success to claim.
  const record: LeadRecord = {
    submission_id: parsed.submission_id,
    app,
    form: parsed.form,
    payload: parsed.payload,
    // The region is part of what was submitted: a changed one is a changed lead (409).
    payload_hash: payloadHash({ form: parsed.form, payload: parsed.payload, region: parsed.region }),
    content_hash: contentHash({ form: parsed.form, payload: parsed.payload, region: parsed.region }),
    services: parsed.services ?? [],
    source: parsed.source || null,
    // regionServed() narrowed it: always one of SERVICE_AREAS here.
    service_area: parsed.region.state,
    // No ip_hash: nothing ever read it, so it is no longer stored (privacy
    // sweep 2026-10-30, data minimisation; sql/002_retention.sql nulls old rows).
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  };
  const ids = { app, form: record.form, submission_id: record.submission_id, mode: transport.mode };
  let stored: Awaited<ReturnType<typeof transport.store.insert>>;
  try {
    // AEGIS r2 L3: a request-level deadline, so requests queued behind a held
    // lock on this instance's one connection also answer within ~6 s.
    stored = await withDeadline(transport.store.insert(record, { deadline: Date.now() + STORE_DEADLINE_MS }), STORE_DEADLINE_MS);
  } catch (error) {
    const detail = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "store_failed", { ...ids, sqlstate: detail ?? "unknown" });
    if (typeof detail === "string" && CHARACTER_SQLSTATES.has(detail)) {
      return fail({ ok: false, error: { code: "validation", fields: { form: UNSTORABLE_TEXT_MESSAGE } } }, 422);
    }
    return fail({ ok: false, error: { code: "unavailable" } }, 503);
  }

  const ctx = transport.notifier ? { app, store: transport.store, notifier: transport.notifier, log } : null;
  /** CH-8 / AEGIS F3: an email that never went out — 'failed', or 'pending' past the grace period. */
  const unsent = (lead: StoredLead | undefined) =>
    !!lead &&
    (lead.notify_status === "failed" || (lead.notify_status === "pending" && Date.now() - lead.created_at.getTime() > NOTIFY_PENDING_GRACE_MS));
  /** The visitor sees success; the email outcome is only recorded (Brief §6.2). Never throws. */
  const deliverQuietly = async (lead: StoredLead | (LeadRecord & { created_at: Date }), leadIds: typeof ids) => {
    try {
      return await deliverLead(ctx!, lead, leadIds);
    } catch (error) {
      const detail = error instanceof DeliveryError ? error.detail : undefined;
      log("warn", "notify_status_not_recorded", { ...leadIds, sqlstate: detail ?? "unknown" });
      return "failed" as const;
    }
  };

  if (!stored.inserted && "duplicateOf" in stored) {
    // The same message, already stored within the window (RTS-3): nothing new
    // is stored and NO site-wide counter is charged (AEGIS r2 H1(a)). AEGIS
    // F3: if the stored copy's email never went out, send it now — the stored
    // lead, under its own id and key, built from its stored values.
    const original = stored.original;
    if (ctx && unsent(original)) {
      const originalIds = { ...ids, submission_id: original!.submission_id };
      log("info", "duplicate_content_unsent", originalIds);
      await deliverQuietly(original!, originalIds);
    } else log("info", "duplicate_content", ids);
    return reply(parsed.body, 200);
  }
  if (!stored.inserted) {
    if (stored.samePayload) {
      // Double-click or retry: the same lead. CH-8: if its email never went
      // out, this resubmit sends it now (same key, same stored body).
      if (ctx && unsent(stored.stored)) {
        log("info", "duplicate_unsent", { ...ids, notify: stored.stored!.notify_status });
        const outcome = await deliverQuietly(stored.stored!, ids);
        log("info", "stored", { ...ids, notify: outcome });
      } else log("info", "duplicate", ids);
      return reply(parsed.body, 200);
    }
    // Same id, different content: refuse rather than drop the edit (AEGIS L2).
    log("warn", "conflict", ids);
    return fail({ ok: false, error: { code: "conflict" } }, 409);
  }

  // A NEW lead. Only now are the site-wide counters charged (AEGIS r2 H1(a)).
  const createdAt = stored.createdAt;
  let quarantined = false;
  if (limiters.hard) {
    const decision = await limiters.hard.hit(`${app}:store-hard`);
    if (!decision.allowed && limiters.guard) {
      limiters.guard.until = Date.now() + decision.retryAfterSec * 1000;
      log("error", "storage_guard_tripped", { app, limiter: "hard" });
      quarantined = true;
    }
  }
  if (!quarantined && limiters.quarantine) {
    const decision = await limiters.quarantine.hit(`${app}:store-quarantine`);
    if (!decision.allowed) {
      quarantined = true;
      log("error", "quarantine_tripped", { ...ids, limiter: "quarantine" });
    }
  }
  if (quarantined) {
    try {
      await withDeadline(transport.store.quarantine(app, record.submission_id, truncatePayload(record.payload, QUARANTINE_BYTES)), STORE_DEADLINE_MS);
    } catch {
      log("warn", "quarantine_not_recorded", ids);
    }
  }

  // 8. Notify. Failure is recorded, not shown (Brief §6.2). The email caps
  // (per minute and per hour, AEGIS F1 and r2 M5) are charged only for a new,
  // non-quarantined lead; past either, the lead's email is deferred to the
  // digest, an error-level alert is logged, and /api/health is degraded until
  // the digest goes out. Nothing is refused.
  let notify: "sent" | "failed" | "disabled" | "deferred" | "delivery_unknown" = "disabled";
  const setStatus = async (status: "deferred" | "disabled") => {
    try {
      await withDeadline(transport.store.setNotifyStatus(app, record.submission_id, status), STORE_DEADLINE_MS);
    } catch (error) {
      const detail = error instanceof DeliveryError ? error.detail : undefined;
      log("warn", "notify_status_not_recorded", { ...ids, notify: status, sqlstate: detail ?? "unknown" });
    }
  };
  if (ctx) {
    let capped = quarantined;
    if (!capped && limiters.global) capped = !(await limiters.global.hit(`${app}:email-minute`)).allowed;
    if (!capped && limiters.emailHour) capped = !(await limiters.emailHour.hit(`${app}:email-hour`)).allowed;
    if (capped) {
      notify = "deferred";
      if (!quarantined) log("error", "global_cap_tripped", { ...ids, limiter: "email" });
      await setStatus("deferred");
    } else {
      notify = await deliverQuietly({ ...record, created_at: createdAt }, ids);
    }
  } else {
    await setStatus("disabled");
  }

  log("info", "stored", { ...ids, notify });
  return reply(parsed.body, 200);
}

/**
 * GET /api/lead: a fresh form token (RTS-3), fetched by each form when the
 * page loads. It carries no personal data and nothing is stored. A
 * misconfigured transport is 503 not_configured, as for a POST.
 */
export function handleFormToken(_request: Request, opts: { app: LeadApp; env?: Env; transport?: TransportConfig; now?: () => Date; logger?: LeadLogger }): Response {
  const headers = { "Cache-Control": "no-store" };
  try {
    const config = opts.transport ?? resolveTransport(opts.env ?? process.env);
    if (!config.ok) {
      (opts.logger ?? consoleLogger)("error", "not_configured", { app: opts.app, missing: config.missing.join(",") });
      return Response.json({ ok: false, error: { code: "not_configured" } }, { status: 503, headers });
    }
    const token = config.transport.formTokens.issue(opts.app, (opts.now ?? (() => new Date()))().getTime());
    return Response.json({ ok: true, token }, { status: 200, headers });
  } catch {
    (opts.logger ?? consoleLogger)("error", "internal_error", { app: opts.app });
    return Response.json({ ok: false, error: { code: "unavailable" } }, { status: 503, headers });
  }
}
