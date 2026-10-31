import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { storable } from "./text";
import { DEDUPE_WINDOW_HOURS, DeliveryError, type InsertResult, type LeadApp, type LeadEmail, type LeadNotifier, type LeadRecord, type LeadStore, type NotifyStatus } from "./types";

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

type Outbox = { dir: string; seen: Map<string, string>; recent: Map<string, number> };
const outboxes = new Map<string, Outbox>();

function outbox(dir: string): Outbox {
  let box = outboxes.get(dir);
  if (!box) {
    mkdirSync(dir, { recursive: true });
    const seen = new Map<string, string>();
    const recent = new Map<string, number>();
    try {
      for (const line of readFileSync(path.join(dir, "rows.jsonl"), "utf8").split("\n")) {
        if (line) {
          const row = JSON.parse(line) as LeadRecord & { created_at: string };
          seen.set(`${row.app}:${row.submission_id}`, row.payload_hash);
          if (row.content_hash) recent.set(`${row.app}:${row.content_hash}`, Date.parse(row.created_at));
        }
      }
    } catch {
      // No rows yet.
    }
    box = { dir, seen, recent };
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

export function fakeStore(dir: string): LeadStore {
  const box = outbox(dir);
  return {
    async insert(record: LeadRecord): Promise<InsertResult> {
      const refusal = jsonbRefusal(record.payload);
      if (refusal) throw new DeliveryError("store_failed", refusal);
      const key = `${record.app}:${record.submission_id}`;
      if (box.seen.has(key)) return { inserted: false, samePayload: box.seen.get(key) === record.payload_hash };
      // Same normalised content within the window under another id: one lead (RTS-3), as postgres.ts.
      const contentKey = `${record.app}:${record.content_hash}`;
      const at = Date.now();
      const previous = box.recent.get(contentKey);
      if (previous !== undefined && at - previous < DEDUPE_WINDOW_HOURS * 3_600_000) return { inserted: false, duplicateOf: "content" };
      box.seen.set(key, record.payload_hash);
      box.recent.set(contentKey, at);
      append(box, "rows.jsonl", { ...record, created_at: new Date(at).toISOString() });
      return { inserted: true };
    },
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus) {
      append(box, "notify.jsonl", { app, submission_id: submissionId, notify_status: status });
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
