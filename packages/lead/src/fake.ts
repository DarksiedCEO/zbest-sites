import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { storable } from "./text";
import { DEDUPE_WINDOW_HOURS, DeliveryError, type InsertResult, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus, type StoredLead } from "./types";

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
type RowState = {
  record: LeadRecord;
  createdAt: number;
  status: NotifyStatus;
  attempts: number;
  nextAt: number | null;
  firstAttemptAt: number | null;
  bodyHash: string | null;
  batch: string | null;
  batchAt: number | null;
  quarantined: boolean;
};
const newRow = (record: LeadRecord, createdAt: number): RowState => ({
  record, createdAt, status: "pending", attempts: 0, nextAt: null, firstAttemptAt: null, bodyHash: null, batch: null, batchAt: null, quarantined: false,
});
const stored = (r: RowState): StoredLead => ({
  ...r.record,
  created_at: new Date(r.createdAt),
  notify_status: r.status,
  notify_attempts: r.attempts,
  notify_first_attempt_at: r.firstAttemptAt === null ? null : new Date(r.firstAttemptAt),
  notify_body_hash: r.bodyHash,
  notify_batch: r.batch,
  notify_batch_at: r.batchAt === null ? null : new Date(r.batchAt),
  quarantined: r.quarantined,
});
const LEASE_MS = 10 * 60_000;
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
          rows.set(key, newRow(record, Date.parse(created_at)));
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
  const row = (app: LeadApp, id: string) => box.rows.get(`${app}:${id}`);
  const lease = (rows: RowState[]) => {
    const now = Date.now();
    for (const r of rows) r.nextAt = now + LEASE_MS;
    return rows.map(stored);
  };
  const due = (r: RowState) => r.nextAt === null || r.nextAt <= Date.now();
  const byAge = (a: RowState, b: RowState) => a.createdAt - b.createdAt;
  const log = (app: LeadApp, submissionId: string, status: NotifyStatus) =>
    append(box, "notify.jsonl", { app, submission_id: submissionId, notify_status: status });
  return {
    async insert(record: LeadRecord): Promise<InsertResult> {
      const refusal = jsonbRefusal(record.payload);
      if (refusal) throw new DeliveryError("store_failed", refusal);
      const key = `${record.app}:${record.submission_id}`;
      if (box.seen.has(key)) {
        const r = box.rows.get(key);
        return { inserted: false, samePayload: box.seen.get(key) === record.payload_hash, ...(r ? { stored: stored(r) } : {}) };
      }
      // Same normalised content within the window under another id: one lead (RTS-3), as postgres.ts.
      const contentKey = `${record.app}:${record.content_hash}`;
      const at = Date.now();
      const previous = box.recent.get(contentKey);
      if (previous !== undefined && at - previous < DEDUPE_WINDOW_HOURS * 3_600_000) {
        const r = box.rows.get(box.byContent.get(contentKey) ?? "");
        return { inserted: false, duplicateOf: "content", ...(r ? { original: stored(r) } : {}) };
      }
      box.seen.set(key, record.payload_hash);
      box.recent.set(contentKey, at);
      box.byContent.set(contentKey, key);
      box.rows.set(key, newRow(record, at));
      append(box, "rows.jsonl", { ...record, created_at: new Date(at).toISOString() });
      return { inserted: true, createdAt: new Date(at) };
    },
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus, retryAt?: Date) {
      const r = row(app, submissionId);
      if (r) {
        r.status = status;
        if (status === "failed") r.attempts += 1;
        r.nextAt = retryAt ? retryAt.getTime() : null;
      }
      log(app, submissionId, status);
    },
    async markAttempt(app: LeadApp, submissionId: string, bodyHash: string) {
      const r = row(app, submissionId);
      if (!r) return { firstAttemptAt: new Date(), bodyHash };
      r.firstAttemptAt ??= Date.now();
      r.bodyHash ??= bodyHash;
      return { firstAttemptAt: new Date(r.firstAttemptAt), bodyHash: r.bodyHash };
    },
    async quarantine(app: LeadApp, submissionId: string, payload: Record<string, unknown>) {
      const r = row(app, submissionId);
      if (r) {
        r.quarantined = true;
        r.record = { ...r.record, payload };
      }
      append(box, "quarantine.jsonl", { app, submission_id: submissionId });
    },
    async claimUnsent(app, { pendingBefore, createdAfter, maxAttempts, limit }): Promise<StoredLead[]> {
      return lease(
        [...box.rows.values()]
          .filter(
            (r) =>
              r.record.app === app &&
              r.createdAt > createdAfter.getTime() &&
              (r.status === "failed" || (r.status === "pending" && r.createdAt < pendingBefore.getTime())) &&
              due(r) &&
              r.attempts < maxAttempts,
          )
          .sort(byAge)
          .slice(0, limit),
      );
    },
    async expireOld(app, createdBefore) {
      let n = 0;
      for (const r of box.rows.values()) {
        if (r.record.app === app && (r.status === "pending" || r.status === "failed") && r.createdAt <= createdBefore.getTime()) {
          r.status = "expired_notify";
          r.nextAt = null;
          log(app, r.record.submission_id, r.status);
          n += 1;
        }
      }
      return n;
    },
    async markUnknown(app, firstAttemptBefore) {
      let n = 0;
      for (const r of box.rows.values()) {
        if (
          r.record.app === app &&
          (r.status === "pending" || r.status === "failed") &&
          r.firstAttemptAt !== null &&
          r.firstAttemptAt < firstAttemptBefore.getTime()
        ) {
          r.status = "delivery_unknown";
          r.nextAt = null;
          log(app, r.record.submission_id, r.status);
          n += 1;
        }
      }
      return n;
    },
    async claimDigest(app, limit): Promise<StoredLead[]> {
      return lease(
        [...box.rows.values()]
          .filter((r) => r.record.app === app && (r.status === "deferred" || r.status === "delivery_unknown") && due(r))
          .sort(byAge)
          .slice(0, limit),
      );
    },
    async assignBatch(app, submissionIds, key) {
      for (const id of submissionIds) {
        const r = row(app, id);
        if (r) {
          r.batch = key;
          r.batchAt = Date.now();
        }
      }
    },
    async markBatchSent(app, key) {
      for (const r of box.rows.values()) {
        if (r.record.app === app && r.batch === key) {
          r.status = "sent";
          r.nextAt = null;
          log(app, r.record.submission_id, "sent");
        }
      }
    },
    async clearBatch(app, key) {
      for (const r of box.rows.values()) {
        if (r.record.app === app && r.batch === key && r.status !== "sent") {
          r.batch = null;
          r.batchAt = null;
          r.status = "delivery_unknown";
          r.nextAt = null;
        }
      }
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
