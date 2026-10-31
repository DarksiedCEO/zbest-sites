import { randomBytes } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { storable } from "./text";
import { DEDUPE_WINDOW_HOURS, DeliveryError, type Batch, type BatchKind, type BatchSummary, type DeliveryOutcome, type InsertResult, type NotifyExtra, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus, type StoredLead } from "./types";

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
  batchHash: string | null;
  quarantined: boolean;
  emailId: string | null;
  delivery: string | null;
  undeliveredAt: number | null;
  outcomeUnknown: boolean;
  sentAt: number | null;
  resends: number;
  checkedAt: number | null;
  abandonedAt: number | null;
  unverifiableAt: number | null;
  ackAt: number | null;
  ackBy: string | null;
  lookupFailures: number;
};
const newRow = (record: LeadRecord, createdAt: number): RowState => ({
  record, createdAt, status: "pending", attempts: 0, nextAt: null, firstAttemptAt: null, bodyHash: null, batch: null, batchAt: null, batchHash: null, quarantined: false,
  emailId: null, delivery: null, undeliveredAt: null, outcomeUnknown: false, sentAt: null, resends: 0, checkedAt: null,
  abandonedAt: null, unverifiableAt: null, ackAt: null, ackBy: null, lookupFailures: 0,
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
  notify_batch_hash: r.batchHash,
  quarantined: r.quarantined,
  notify_email_id: r.emailId,
  notify_delivery: r.delivery,
  notify_outcome_unknown: r.outcomeUnknown,
});
const LEASE_MS = 10 * 60_000;
/** As postgres.ts RESEND_WAIT_HOURS / MAX_RESENDS (AEGIS r6 R6-1(e)). */
const RESEND_WAIT_HOURS = [1, 6, 24, 72];
const MAX_RESENDS = RESEND_WAIT_HOURS.length;
/** As postgres.ts BATCH_STATUSES. */
const KIND: Record<BatchKind, { from: NotifyStatus[]; done: NotifyStatus }> = {
  digest: { from: ["deferred", "delivery_unknown"], done: "sent" },
  expired: { from: ["expired_notify"], done: "expired_reported" },
};
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

/** `clock` is a test seam (AEGIS r3 invariant tests move time); production passes nothing. */
export function fakeStore(dir: string, clock: () => number = () => Date.now()): LeadStore & NotifyOutbox {
  const box = outbox(dir);
  const row = (app: LeadApp, id: string) => box.rows.get(`${app}:${id}`);
  const lease = (rows: RowState[]) => {
    const now = clock();
    for (const r of rows) r.nextAt = now + LEASE_MS;
    return rows.map(stored);
  };
  const due = (r: RowState) => r.nextAt === null || r.nextAt <= clock();
  const byAge = (a: RowState, b: RowState) => a.createdAt - b.createdAt || (a.record.submission_id < b.record.submission_id ? -1 : 1);
  /** As postgres.ts requeue (AEGIS r5 N2, r6 R6-1/R6-7). */
  const requeue = (rows: RowState[], outcome: "undelivered" | "unconfirmed" | "unverifiable"): DeliveryOutcome => {
    const out = { resent: 0, abandoned: 0 };
    for (const r of rows) {
      if (outcome === "unverifiable") r.unverifiableAt = clock();
      else r.undeliveredAt = clock();
      r.checkedAt = null;
      r.lookupFailures = 0;
      if (r.resends < MAX_RESENDS) {
        setStatus(r, "deferred");
        r.delivery = outcome;
        r.batch = null;
        r.batchAt = null;
        r.batchHash = null;
        r.nextAt = clock() + RESEND_WAIT_HOURS[r.resends]! * 3_600_000;
        r.resends += 1;
        if (outcome === "unverifiable") {
          r.ackAt = null;
          r.ackBy = null;
        }
        out.resent += 1;
      } else {
        r.delivery = "abandoned";
        r.abandonedAt = clock();
        r.ackAt = null;
        r.ackBy = null;
        out.abandoned += 1;
      }
    }
    return out;
  };
  const batchOf = (kind: BatchKind, key: string, rows: RowState[]): Batch => {
    const times = rows.map((r) => r.createdAt);
    const summary: BatchSummary = {
      count: rows.length,
      oldest: new Date(Math.min(...times)),
      newest: new Date(Math.max(...times)),
      formedAt: rows[0]?.batchAt == null ? null : new Date(rows[0].batchAt),
      hash: rows[0]?.batchHash ?? null,
    };
    return { key, leads: kind === "expired" ? [] : [...rows].sort(byAge).map(stored), summary };
  };
  const mine = (app: LeadApp) => [...box.rows.values()].filter((r) => r.record.app === app);
  const setStatus = (r: RowState, status: NotifyStatus) => {
    r.status = status;
    log(r.record.app, r.record.submission_id, status);
  };
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
      const at = clock();
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
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus, retryAt?: Date, extra: NotifyExtra = {}) {
      const r = row(app, submissionId);
      if (r) {
        r.status = status;
        if (status === "failed") r.attempts += 1;
        r.nextAt = retryAt ? retryAt.getTime() : null;
        if (status === "sent") {
          r.sentAt = clock();
          r.emailId = extra.emailId ?? null;
          r.delivery = null;
          r.checkedAt = null;
        } else if (extra.emailId) r.emailId = extra.emailId;
        if (extra.unverifiable) {
          r.delivery = "unverifiable";
          r.unverifiableAt = clock();
          r.ackAt = null;
          r.ackBy = null;
        }
        if (status === "sent") r.lookupFailures = 0;
        if (extra.outcomeUnknown || extra.unverifiable) r.outcomeUnknown = true;
      }
      log(app, submissionId, status);
    },
    async markAttempt(app: LeadApp, submissionId: string, bodyHash: string) {
      const r = row(app, submissionId);
      if (!r) return { firstAttemptAt: new Date(), bodyHash };
      r.firstAttemptAt ??= clock();
      r.bodyHash ??= bodyHash;
      return { firstAttemptAt: new Date(r.firstAttemptAt), bodyHash: r.bodyHash };
    },
    async quarantine(app: LeadApp, submissionId: string) {
      const r = row(app, submissionId);
      if (r) r.quarantined = true;
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
      for (const r of mine(app)) {
        if (
          (r.status === "pending" || r.status === "failed") &&
          r.firstAttemptAt !== null &&
          r.firstAttemptAt < firstAttemptBefore.getTime() &&
          (r.outcomeUnknown || r.status === "pending")
        ) {
          setStatus(r, "delivery_unknown");
          r.nextAt = null;
          n += 1;
        }
      }
      return n;
    },
    async moveToDigest(app, createdBefore) {
      let n = 0;
      for (const r of mine(app)) {
        if ((r.status === "pending" || r.status === "failed") && r.createdAt < createdBefore.getTime()) {
          setStatus(r, r.outcomeUnknown || (r.status === "pending" && r.firstAttemptAt !== null) ? "delivery_unknown" : "deferred");
          r.nextAt = null;
          n += 1;
        }
      }
      return n;
    },
    async claimBatch(app, kind): Promise<Batch | null> {
      const { from } = KIND[kind];
      const keys = new Map<string, number>();
      for (const r of mine(app)) {
        if (r.batch && from.includes(r.status) && due(r)) keys.set(r.batch, Math.min(keys.get(r.batch) ?? Infinity, r.batchAt ?? 0));
      }
      for (const [key] of [...keys].sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1))) {
        const rows = mine(app).filter((r) => r.batch === key);
        if (rows.some((r) => !due(r))) continue;
        lease(rows);
        return batchOf(kind, key, rows);
      }
      return null;
    },
    async formBatch(app, kind, limit, seal): Promise<Batch | null> {
      const { from } = KIND[kind];
      const rows = mine(app).filter((r) => r.batch === null && from.includes(r.status) && due(r)).sort(byAge).slice(0, limit);
      if (!rows.length) return null;
      const key = `${kind}-${app}-${randomBytes(16).toString("hex")}`;
      for (const r of rows) {
        r.batch = key;
        r.batchAt = clock();
      }
      lease(rows);
      const hash = seal(batchOf(kind, key, rows));
      for (const r of rows) r.batchHash = hash;
      return batchOf(kind, key, rows);
    },
    async markBatchSent(app, kind, key, submissionIds, emailId, verifiable = true) {
      const { from, done } = KIND[kind];
      const ids = new Set(submissionIds);
      let n = 0;
      for (const r of mine(app)) {
        if (r.batch === key && (kind === "expired" || ids.has(r.record.submission_id)) && from.includes(r.status)) {
          setStatus(r, done);
          r.nextAt = null;
          if (done === "sent") r.sentAt = clock();
          r.emailId = emailId ?? null;
          const noId = !emailId && verifiable && done === "sent";
          r.delivery = noId ? "unverifiable" : null;
          if (noId) {
            r.unverifiableAt = clock();
            r.ackAt = null;
            r.ackBy = null;
          }
          r.lookupFailures = 0;
          if (noId) r.outcomeUnknown = true;
          r.checkedAt = null;
          n += 1;
        }
      }
      return n;
    },
    async markBatchUnknown(app, key) {
      for (const r of mine(app)) if (r.batch === key) r.outcomeUnknown = true;
    },
    async clearBatch(app, kind, key) {
      const { from } = KIND[kind];
      for (const r of mine(app)) {
        if (r.batch === key && from.includes(r.status)) {
          r.batch = null;
          r.batchAt = null;
          r.batchHash = null;
          r.nextAt = null;
          if (kind === "digest" && r.outcomeUnknown) setStatus(r, "delivery_unknown");
        }
      }
    },
    async deliveriesToCheck(app, limit) {
      const order = new Map<string, [number, number, number]>();
      for (const r of mine(app)) {
        if (r.status === "sent" && r.emailId && r.delivery === null) {
          const prev = order.get(r.emailId);
          const checked = r.checkedAt ?? -Infinity;
          order.set(
            r.emailId,
            prev ? [Math.max(prev[0], r.lookupFailures), Math.min(prev[1], checked), Math.min(prev[2], r.sentAt ?? 0)] : [r.lookupFailures, checked, r.sentAt ?? 0],
          );
        }
      }
      return [...order]
        .sort((a, b) => a[1][0] - b[1][0] || a[1][1] - b[1][1] || a[1][2] - b[1][2] || (a[0] < b[0] ? -1 : 1))
        .slice(0, limit)
        .map(([id]) => id);
    },
    async recordDelivery(app, emailId, outcome): Promise<DeliveryOutcome> {
      const rows = mine(app).filter((r) => r.status === "sent" && r.emailId === emailId && r.delivery === null);
      if (outcome === "delivered" || outcome === "pending") {
        for (const r of rows) {
          r.delivery = outcome === "delivered" ? "delivered" : null;
          r.checkedAt = clock();
          r.lookupFailures = 0;
        }
        return { resent: 0, abandoned: 0, delivered: outcome === "delivered" ? rows.length : 0 };
      }
      return requeue(rows, outcome);
    },
    async recordLookupFailure(app, emailId, maxFailures) {
      const rows = mine(app).filter((r) => r.status === "sent" && r.emailId === emailId && r.delivery === null);
      let worst = 0;
      for (const r of rows) worst = Math.max(worst, (r.lookupFailures += 1));
      if (!rows.length || worst < maxFailures) return null;
      return requeue(rows, "unverifiable");
    },
    async requeueUnverifiable(app) {
      return requeue(mine(app).filter((r) => r.status === "sent" && r.delivery === "unverifiable"), "unverifiable");
    },
    async recoverAbandoned(app) {
      let n = 0;
      for (const r of mine(app)) {
        if (r.status === "sent" && r.delivery === "abandoned") {
          setStatus(r, "deferred");
          r.nextAt = null;
          r.batch = null;
          r.batchAt = null;
          r.batchHash = null;
          n += 1;
        }
      }
      return n;
    },
    async acknowledgeUndelivered(app, by) {
      let n = 0;
      for (const r of mine(app)) {
        if (r.ackAt === null && (r.abandonedAt !== null || r.unverifiableAt !== null)) {
          r.ackAt = clock();
          r.ackBy = by;
          n += 1;
        }
      }
      return n;
    },
    async expireDeliveryChecks(app, before) {
      return requeue(
        mine(app).filter((r) => r.status === "sent" && r.emailId && r.delivery === null && r.checkedAt !== null && (r.sentAt ?? 0) <= before.getTime()),
        "unconfirmed",
      );
    },
    async recordCheckState(app, state, code) {
      append(box, "delivery-checks.jsonl", { app, state, ...(code ? { code } : {}) });
    },
  };
}

export function fakeNotifier(dir: string, to: string[]): LeadNotifier {
  const box = outbox(dir);
  return {
    async send(email: LeadEmail, idempotencyKey: string) {
      const id = randomBytes(16).toString("hex");
      append(box, "emails.jsonl", { to, idempotency_key: idempotencyKey, id, ...email });
      return { id };
    },
    // The fake provider delivers everything it accepts.
    async lastEvent() {
      return { event: "delivered" };
    },
  };
}
