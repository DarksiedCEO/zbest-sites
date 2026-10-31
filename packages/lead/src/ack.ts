import { resolveTransport, type Env, type TransportConfig } from "./config";
import { consoleLogger, type LeadLogger } from "./log";
import { cronAuthorized } from "./retention";
import type { LeadApp } from "./types";

/**
 * AEGIS r6 R6-1(d), R6-7: the founder acknowledges leads whose email could
 * not be delivered after every re-send ('abandoned') or could not be verified
 * ('unverifiable'), after reading them in the database
 * (`pnpm --filter @zbest/lead notify-backlog-report` lists them).
 *
 *   curl -X POST https://www.zbestmedia.com/api/cron/ack-undelivered \
 *     -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
 *     -d '{"by":"Andre"}'
 *
 * POST only, CRON_SECRET required (the same fail-closed check as the crons).
 * It records when and by whom on each such lead not yet acknowledged, and
 * deletes nothing. /api/health then stops reporting leads_undelivered (and
 * the delivery_unverifiable warning) for them. A lead abandoned or found
 * unverifiable again later needs a new acknowledgement. Logs carry counts only.
 */

/** Who acknowledged: a name or initials (letters, digits, space, . ' -), 1–80 characters. */
const BY = /^[\p{L}\p{N}][\p{L}\p{N} .'-]{0,79}$/u;
const json = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function handleAckUndelivered(
  request: Request,
  opts: { app: LeadApp; env?: Env; logger?: LeadLogger; transport?: TransportConfig },
): Promise<Response> {
  const log = opts.logger ?? consoleLogger;
  const env = opts.env ?? process.env;
  const app = opts.app;
  try {
    if (request.method !== "POST") return json({ ok: false, error: { code: "method_not_allowed" } }, 405, { Allow: "POST" });
    const secret = (env.CRON_SECRET ?? "").trim();
    if (secret.length < 16) {
      log("error", "ack_not_configured", { app, missing: "CRON_SECRET:min-16-chars" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    if (!cronAuthorized(request.headers.get("authorization"), secret)) {
      log("warn", "ack_unauthorized", { app });
      return json({ ok: false, error: { code: "unauthorized" } }, 401);
    }
    let by: unknown;
    try {
      by = ((await request.json()) as { by?: unknown })?.by;
    } catch {
      by = undefined;
    }
    if (typeof by !== "string" || !BY.test(by.trim())) return json({ ok: false, error: { code: "bad_request", field: "by" } }, 400);
    const config = opts.transport ?? resolveTransport(env);
    if (!config.ok || !config.transport.outbox) {
      log("error", "ack_not_configured", { app, missing: config.ok ? "outbox" : config.missing.join(",") });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    const acknowledged = await config.transport.outbox.acknowledgeUndelivered(app, by.trim());
    log("info", "undelivered_acknowledged", { app, deleted: acknowledged });
    return json({ ok: true, acknowledged }, 200);
  } catch {
    log("error", "ack_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
