import { resolveLimiter, resolveTransport, type Env, type TransportConfig } from "./config";
import { leadEmail } from "./email";
import { clientIp, plainIpKey } from "./ip";
import { consoleLogger, type LeadLogger } from "./log";
import { DeliveryError, type LeadApp, type RateLimiter } from "./types";

/**
 * The one §6.2 lead pipeline both apps' route handlers call. Each app keeps
 * its own zod schemas and hands this a `parse` function; everything about
 * where a lead goes lives here.
 *
 * Order (docs/LEAD-ROUTE-DESIGN.md §4):
 *   rate limit → transport config → JSON → the app's validation → honeypot
 *   → store (upsert on app + submission_id) → notify → respond
 *
 * Honesty rules:
 *   - never claim success unless the row was written (or already existed);
 *   - a misconfigured transport is 503 not_configured, never a quiet success;
 *   - an email failure after the row is written is logged and recorded on the
 *     row, and the visitor still sees success (Brief §6.2 failure mode).
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
      /** The success body for this form (e.g. it may carry a scored result). */
      body: unknown;
    };

export type LeadErrorBody =
  | { ok: false; error: { code: "bad_request" } }
  | { ok: false; error: { code: "rate_limited"; retry_after_s: number } }
  | { ok: false; error: { code: "not_configured" } }
  | { ok: false; error: { code: "unavailable" } };

export type HandleLeadOptions = {
  app: LeadApp;
  parse: (json: unknown) => ParsedLead;
  /** Defaults to process.env. */
  env?: Env;
  logger?: LeadLogger;
  /** Test seams; production resolves both from env. */
  transport?: TransportConfig;
  limiter?: RateLimiter;
  now?: () => Date;
};

export async function handleLead(request: Request, opts: HandleLeadOptions): Promise<Response> {
  const env = opts.env ?? process.env;
  const log = opts.logger ?? consoleLogger;
  const app = opts.app;
  // Set once the transport resolves; marks every later response from a fake transport.
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

  // 1. Rate limit, per IP per app. Runs even when misconfigured.
  const resolved = opts.limiter ? { limiter: opts.limiter, problem: undefined } : resolveLimiter(env, log);
  const ip = clientIp(request.headers);
  const decision = await resolved.limiter.hit(`${app}:${plainIpKey(ip)}`);
  if (!decision.allowed) {
    log("warn", "rate_limited", { app });
    return fail(
      { ok: false, error: { code: "rate_limited", retry_after_s: decision.retryAfterSec } },
      429,
      { "Retry-After": String(decision.retryAfterSec) },
    );
  }

  // 2. Transport. Missing config fails closed, naming settings (never values).
  const config = opts.transport ?? resolveTransport(env);
  const missing = [...(config.ok ? [] : config.missing), ...(resolved.problem ? [resolved.problem] : [])];
  if (!config.ok || missing.length) {
    log("error", "not_configured", { app, missing: missing.join(",") });
    return fail({ ok: false, error: { code: "not_configured" } }, 503);
  }
  const transport = config.transport;
  seen.mode = transport.mode;

  // 3. Body and the app's own validation.
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return fail({ ok: false, error: { code: "bad_request" } }, 400);
  }
  const parsed = opts.parse(json);
  if (parsed.kind === "bad_request") return fail({ ok: false, error: { code: "bad_request" } }, 400);
  if (parsed.kind === "reject") return reply(parsed.body, parsed.status);
  if (parsed.kind === "honeypot") {
    log("info", "honeypot", { app, form: parsed.form });
    return reply(parsed.body, 200);
  }

  // 4. Store. The row is the lead; without it there is no success to claim.
  const record = {
    submission_id: parsed.submission_id,
    app,
    form: parsed.form,
    payload: parsed.payload,
    services: parsed.services ?? [],
    source: parsed.source || null,
    ip_hash: ip === "unknown" ? null : transport.hashIp(ip),
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  };
  const ids = { app, form: record.form, submission_id: record.submission_id, mode: transport.mode };
  let inserted: boolean;
  try {
    ({ inserted } = await transport.store.insert(record));
  } catch (error) {
    const detail = error instanceof DeliveryError ? error.detail : undefined;
    log("error", "store_failed", { ...ids, sqlstate: detail ?? "unknown" });
    return fail({ ok: false, error: { code: "unavailable" } }, 503);
  }
  if (!inserted) {
    // Double-click or retry: the same lead. Already notified the first time.
    log("info", "duplicate", ids);
    return reply(parsed.body, 200);
  }

  // 5. Notify. Failure is recorded, not shown (Brief §6.2).
  let notify: "sent" | "failed" | "disabled" = "disabled";
  if (transport.notifier) {
    try {
      await transport.notifier.send(leadEmail(record, (opts.now ?? (() => new Date()))()), `lead-${record.submission_id}`);
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
