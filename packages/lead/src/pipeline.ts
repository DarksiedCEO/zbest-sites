import { resolveLimiter, resolvePolicy, resolveTransport, type Env, type Limiters, type RequestPolicy, type TransportConfig } from "./config";
import { leadEmail } from "./email";
import { payloadHash } from "./hash";
import { clientIp } from "./ip";
import { consoleLogger, type LeadLogger } from "./log";
import { regionServed, type Region } from "./region";
import { DeliveryError, type LeadApp, type LeadRecord } from "./types";

/**
 * The one §6.2 lead pipeline both apps' route handlers call. Each app keeps
 * its own zod schemas and hands this a `parse` function; everything about
 * where a lead goes lives here.
 *
 * Order (docs/LEAD-ROUTE-DESIGN.md §4):
 *   content type (415) → origin (403) → declared size (413) → config (503)
 *   → client address from the one trusted header (503 if absent)
 *   → body, capped (413) → JSON → honeypot (not charged) → rate limit (429)
 *   → the app's validation (400/422) → store (upsert on app + submission_id; 409 on a changed
 *   resubmission) → notify → respond
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
  | { ok: false; error: { code: "unavailable" } };

export type HandleLeadOptions = {
  app: LeadApp;
  parse: (json: unknown) => ParsedLead;
  /** Defaults to process.env. */
  env?: Env;
  logger?: LeadLogger;
  /** Test seams; production resolves these from env. */
  transport?: TransportConfig;
  limiters?: Pick<Limiters, "perIp">;
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
  const limiters: Pick<Limiters, "perIp" | "problem"> = opts.limiters ?? resolveLimiter(env, log);
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
    const decision = await limiters.perIp.hit(`${app}:${transport.hashIp(ip.key).slice(0, 32)}`);
    if (decision.allowed) return null;
    log("warn", "rate_limited", { app, limiter: "ip" });
    return fail(
      { ok: false, error: { code: "rate_limited", retry_after_s: decision.retryAfterSec } },
      429,
      { "Retry-After": String(decision.retryAfterSec) },
    );
  };

  // 6. Body (capped; a 413 is not charged) and the app's own validation.
  let json: unknown;
  try {
    json = JSON.parse(await readCapped(request, policy.maxBodyBytes));
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
  if (parsed.kind === "bad_request") return fail({ ok: false, error: { code: "bad_request" } }, 400);
  if (parsed.kind === "reject") return reply(parsed.body, parsed.status);

  // Service area (founder decisions 2026-10-30: 50 US states, DC, PR, GU, VI, AS, MP). Outside it the
  // visitor gets a polite 422 and NOTHING is stored or sent. Checked here, in
  // the shared pipeline, so no form can skip it. Charged like any 422.
  if (!regionServed(parsed.region)) {
    log("info", "region_refused", { app, form: parsed.form, code: parsed.region.state });
    return fail({ ok: false, error: { code: "region_unavailable" } }, 422);
  }

  // 7. Store. The row is the lead; without it there is no success to claim.
  const record: LeadRecord = {
    submission_id: parsed.submission_id,
    app,
    form: parsed.form,
    payload: parsed.payload,
    // The region is part of what was submitted: a changed one is a changed lead (409).
    payload_hash: payloadHash({ form: parsed.form, payload: parsed.payload, region: parsed.region }),
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
    stored = await transport.store.insert(record);
  } catch (error) {
    const detail = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "store_failed", { ...ids, sqlstate: detail ?? "unknown" });
    return fail({ ok: false, error: { code: "unavailable" } }, 503);
  }
  if (!stored.inserted) {
    if (stored.samePayload) {
      // Double-click or retry: the same lead, already notified the first time.
      // A scored form's result is recomputed from identical answers, so it
      // matches what was stored.
      log("info", "duplicate", ids);
      return reply(parsed.body, 200);
    }
    // Same id, different content: refuse rather than drop the edit (AEGIS L2).
    log("warn", "conflict", ids);
    return fail({ ok: false, error: { code: "conflict" } }, 409);
  }

  // 8. Notify. Failure is recorded, not shown (Brief §6.2).
  let notify: "sent" | "failed" | "disabled" = "disabled";
  if (transport.notifier) {
    try {
      await transport.notifier.send(
        leadEmail(record, (opts.now ?? (() => new Date()))()),
        `lead-${app}-${record.submission_id}`,
      );
      notify = "sent";
    } catch (error) {
      notify = "failed";
      const code = error instanceof DeliveryError ? error.code : "notify_failed";
      const status = error instanceof DeliveryError ? error.detail : undefined;
      log("error", "notify_failed", { ...ids, code, status: status ?? "none" });
    }
  }
  try {
    await transport.store.setNotifyStatus(app, record.submission_id, notify);
  } catch (error) {
    const detail = error instanceof DeliveryError ? error.detail : undefined;
    log("warn", "notify_status_not_recorded", { ...ids, notify, sqlstate: detail ?? "unknown" });
  }

  log("info", "stored", { ...ids, notify });
  return reply(parsed.body, 200);
}
