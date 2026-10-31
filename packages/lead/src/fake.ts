import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { storable } from "./text";
import { DEDUPE_WINDOW_HOURS, DeliveryError, type InsertResult, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus, type UnsentLead } from "./types";

/**
 * TEST-ONLY transport: the store and the notifier append JSON lines to files
 * in an outbox directory, so the e2e gate can assert exactly what would have
 * been stored and sent. config.ts enables it only with the gate's per-run
 * nonce, an outbox under the OS temp dir and no platform marker
 * (fakeTransportProblems), so it cannot run on a deployment.
 *
 *   <outbox>/rows.jsonl     one line per inserted lead (duplicates are not written)
 *   <outbox>/emails.jsonl   one line per notification
 *   <outbox>/notify.jsonl   one line per notify_status update
 */

/** Per stored row: what the notification outbox needs (CH-8), mirroring the leads columns. */
type RowState = { record: LeadRecord; createdAt: number; status: NotifyStatus; attempts: number; nextAt: number | null };
type Outbox = { dir: string; seen: Map<string, string>; recent: Map<string, number>; rows: Map<string, RowState>; byContent: Map<string, string> };
const outboxes = new Map<string, Outbox>();

function outbox(dir: string): Outbox {
  let box = outboxes.get(dir);
  if (!box) {
    mkdirSync(dir, { recursive: true });
    const seen = new Map<string, string>();
    const recent = new Map<string, number>();
    const rows = new Map<string, RowState>();
    const byContent = new Map<string, string>();
    try {
      for (const line of readFileSync(path.join(dir, "rows.jsonl"), "utf8").split("\n")) {
        if (line) {
          const { created_at, ...record } = JSON.parse(line) as LeadRecord & { created_at: string };
          const key = `${record.app}:${record.submission_id}`;
          seen.set(key, record.payload_hash);
          if (record.content_hash) {
            recent.set(`${record.app}:${record.content_hash}`, Date.parse(created_at));
            byContent.set(`${record.app}:${record.content_hash}`, key);
          }
          rows.set(key, { record, createdAt: Date.parse(created_at), status: "pending", attempts: 0, nextAt: null });
        }
      }
      for (const line of readFileSync(path.join(dir, "notify.jsonl"), "utf8").split("\n")) {
        if (!line) continue;
        const n = JSON.parse(line) as { app: string; submission_id: string; notify_status: NotifyStatus };
        const row = rows.get(`${n.app}:${n.submission_id}`);
        if (row) row.status = n.notify_status;
      }
    } catch {
      // No rows yet.
    }
    box = { dir, seen, recent, rows, byContent };
    outboxes.set(dir, box);
  }
  return box;
}

const append = (box: Outbox, file: string, value: unknown) =>
  appendFileSync(path.join(box.dir, file), `${JSON.stringify(value)}\n`);

/**
 * What Postgres jsonb refuses, refused the same way (red team RTS-7): a NUL
 * (22P05) or an unpaired surrogate (22P02) anywhere in the payload. Without
 * this the gate's fake transport accepted what production loses.
 */
function jsonbRefusal(value: unknown): "22P05" | "22P02" | null {
  const strings: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") strings.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, inner] of Object.entries(v)) {
        strings.push(k);
        walk(inner);
      }
    }
  };
  walk(value);
  if (strings.some((s) => s.includes("\u0000"))) return "22P05";
  if (strings.some((s) => !storable(s))) return "22P02";
  return null;
}

export function fakeStore(dir: string): LeadStore & NotifyOutbox {
  const box = outbox(dir);
  return {
    async insert(record: LeadRecord): Promise<InsertResult> {
      const refusal = jsonbRefusal(record.payload);
      if (refusal) throw new DeliveryError("store_failed", refusal);
      const key = `${record.app}:${record.submission_id}`;
      if (box.seen.has(key)) {
        const row = box.rows.get(key);
        return {
          inserted: false,
          samePayload: box.seen.get(key) === record.payload_hash,
          ...(row ? { notifyStatus: row.status, createdAt: new Date(row.createdAt) } : {}),
        };
      }
      // Same normalised content within the window under another id: one lead (RTS-3), as postgres.ts.
      const contentKey = `${record.app}:${record.content_hash}`;
      const at = Date.now();
      const previous = box.recent.get(contentKey);
      if (previous !== undefined && at - previous < DEDUPE_WINDOW_HOURS * 3_600_000) {
        const row = box.rows.get(box.byContent.get(contentKey) ?? "");
        return {
          inserted: false,
          duplicateOf: "content",
          ...(row
            ? { original: { ...row.record, created_at: new Date(row.createdAt), notify_attempts: row.attempts, notify_status: row.status } }
            : {}),
        };
      }
      box.seen.set(key, record.payload_hash);
      box.recent.set(contentKey, at);
      box.byContent.set(contentKey, key);
      box.rows.set(key, { record, createdAt: at, status: "pending", attempts: 0, nextAt: null });
      append(box, "rows.jsonl", { ...record, created_at: new Date(at).toISOString() });
      return { inserted: true };
    },
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus, retryAt?: Date) {
      const row = box.rows.get(`${app}:${submissionId}`);
      if (row) {
        row.status = status;
        if (status === "failed") row.attempts += 1;
        row.nextAt = retryAt ? retryAt.getTime() : null;
      }
      append(box, "notify.jsonl", { app, submission_id: submissionId, notify_status: status });
    },
    async claimUnsent(app, { pendingBefore, maxAttempts, limit }): Promise<UnsentLead[]> {
      const now = Date.now();
      const due = [...box.rows.values()]
        .filter(
          (r) =>
            r.record.app === app &&
            (r.status === "failed" || (r.status === "pending" && r.createdAt < pendingBefore.getTime())) &&
            (r.nextAt === null || r.nextAt <= now) &&
            r.attempts < maxAttempts,
        )
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, limit);
      // The lease, as postgres.ts: a parallel run skips these for 10 minutes.
      for (const r of due) r.nextAt = now + 10 * 60_000;
      return due.map((r) => ({ ...r.record, created_at: new Date(r.createdAt), notify_attempts: r.attempts }));
    },
    async claimDeferred(app, limit): Promise<UnsentLead[]> {
      const now = Date.now();
      const due = [...box.rows.values()]
        .filter((r) => r.record.app === app && r.status === "deferred" && (r.nextAt === null || r.nextAt <= now))
        .sort((a, b) => a.createdAt - b.createdAt)
        .slice(0, limit);
      for (const r of due) r.nextAt = now + 10 * 60_000;
      return due.map((r) => ({ ...r.record, created_at: new Date(r.createdAt), notify_attempts: r.attempts }));
    },
  };
}

export function fakeNotifier(dir: string, to: string[]): LeadNotifier {
  const box = outbox(dir);
  return {
    async send(email: LeadEmail, idempotencyKey: string) {
      append(box, "emails.jsonl", { to, idempotency_key: idempotencyKey, ...email });
    },
  };
}
