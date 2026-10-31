import { resolvePolicy, resolveTransport, type Env, type TransportConfig } from "./config";
import { clientIp } from "./ip";
import { consoleLogger, type LeadLogger } from "./log";
import { cronAuthorized } from "./retention";
import type { LeadApp } from "./types";

/**
 * AEGIS r6 R6-1(d), R6-7, r7 R7-2: the founder acknowledges leads whose email
 * could not be delivered after every re-send ('abandoned') or could not be
 * verified ('unverifiable'), after reading them in the database.
 *
 * `pnpm --filter @zbest/lead notify-backlog-report` lists them with exact
 * counts and prints "acknowledge through: <timestamp>". Acknowledge exactly
 * what was read — everything up to that cutoff, and/or explicit ids:
 *
 *   curl -X POST https://www.zbestmedia.com/api/cron/ack-undelivered \
 *     -H "Authorization: Bearer $LEAD_ACK_SECRET" -H "Content-Type: application/json" \
 *     -d '{"through":"2026-11-02T10:15:00.000Z"}'          # or {"ids":["<submission id>", …]}
 *
 * A lead abandoned after the cutoff stays unacknowledged (and health stays
 * degraded) until it is read and acknowledged too.
 *
 * Who: the holder of LEAD_ACK_SECRET when it is set (a separate secret, so
 * the cron's own secret cannot acknowledge), else of CRON_SECRET. The actor
 * is recorded as that role, never as free text, with a keyed hash of the
 * request's address. Each acknowledgement appends a row to lead_acks (who,
 * when, from where, the cutoff, the ids); a later re-abandonment never erases
 * it. Nothing is deleted. POST only. Logs carry counts only.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_IDS = 5_000;
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
    const ackSecret = (env.LEAD_ACK_SECRET ?? "").trim();
    const cronSecret = (env.CRON_SECRET ?? "").trim();
    if (ackSecret && ackSecret.length < 16) {
      log("error", "ack_not_configured", { app, missing: "LEAD_ACK_SECRET:min-16-chars" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    const secret = ackSecret || cronSecret;
    const actor = ackSecret ? "ack-secret holder" : "cron-secret holder";
    if (secret.length < 16) {
      log("error", "ack_not_configured", { app, missing: "CRON_SECRET:min-16-chars" });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    if (!cronAuthorized(request.headers.get("authorization"), secret)) {
      log("warn", "ack_unauthorized", { app });
      return json({ ok: false, error: { code: "unauthorized" } }, 401);
    }
    let body: { through?: unknown; ids?: unknown } | null;
    try {
      body = (await request.json()) as { through?: unknown; ids?: unknown } | null;
    } catch {
      body = null;
    }
    const bad = (field: string) => json({ ok: false, error: { code: "bad_request", field } }, 400);
    let through: Date | undefined;
    if (body?.through !== undefined) {
      const t = typeof body.through === "string" && /^\d{4}-\d{2}-\d{2}T/.test(body.through) ? new Date(body.through) : new Date(NaN);
      if (Number.isNaN(t.getTime()) || t.getTime() > Date.now() + 5 * 60_000) return bad("through");
      through = t;
    }
    let ids: string[] | undefined;
    if (body?.ids !== undefined) {
      if (!Array.isArray(body.ids) || body.ids.length < 1 || body.ids.length > MAX_IDS || !body.ids.every((x) => typeof x === "string" && UUID.test(x))) return bad("ids");
      ids = body.ids as string[];
    }
    if (!through && !ids) return bad("through_or_ids");
    const config = opts.transport ?? resolveTransport(env);
    if (!config.ok || !config.transport.outbox) {
      log("error", "ack_not_configured", { app, missing: config.ok ? "outbox" : config.missing.join(",") });
      return json({ ok: false, error: { code: "not_configured" } }, 503);
    }
    const policy = resolvePolicy(env);
    const ip = policy.ipSource ? clientIp(request.headers, policy.ipSource) : null;
    const ipHash = ip ? config.transport.hashIp(ip.key).slice(0, 32) : null;
    const acknowledged = await config.transport.outbox.acknowledgeUndelivered(app, { actor, ipHash, through, ids });
    log("info", "undelivered_acknowledged", { app, deleted: acknowledged });
    return json({ ok: true, acknowledged, ...(through ? { through: through.toISOString() } : {}) }, 200);
  } catch {
    log("error", "ack_failed", { app });
    return json({ ok: false, error: { code: "unavailable" } }, 503);
  }
}
