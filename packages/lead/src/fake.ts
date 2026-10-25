import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { InsertResult, LeadApp, LeadEmail, LeadNotifier, LeadRecord, LeadStore, NotifyStatus } from "./types";

/**
 * TEST-ONLY transport: the store and the notifier append JSON lines to files
 * in an outbox directory, so the e2e gate can assert exactly what would have
 * been stored and sent. config.ts refuses it whenever VERCEL is set, so it
 * cannot run on a deployment.
 *
 *   <outbox>/rows.jsonl     one line per inserted lead (duplicates are not written)
 *   <outbox>/emails.jsonl   one line per notification
 *   <outbox>/notify.jsonl   one line per notify_status update
 */

type Outbox = { dir: string; seen: Map<string, string> };
const outboxes = new Map<string, Outbox>();

function outbox(dir: string): Outbox {
  let box = outboxes.get(dir);
  if (!box) {
    mkdirSync(dir, { recursive: true });
    const seen = new Map<string, string>();
    try {
      for (const line of readFileSync(path.join(dir, "rows.jsonl"), "utf8").split("\n")) {
        if (line) {
          const row = JSON.parse(line) as LeadRecord;
          seen.set(`${row.app}:${row.submission_id}`, row.payload_hash);
        }
      }
    } catch {
      // No rows yet.
    }
    box = { dir, seen };
    outboxes.set(dir, box);
  }
  return box;
}

const append = (box: Outbox, file: string, value: unknown) =>
  appendFileSync(path.join(box.dir, file), `${JSON.stringify(value)}\n`);

export function fakeStore(dir: string): LeadStore {
  const box = outbox(dir);
  return {
    async insert(record: LeadRecord): Promise<InsertResult> {
      const key = `${record.app}:${record.submission_id}`;
      if (box.seen.has(key)) return { inserted: false, samePayload: box.seen.get(key) === record.payload_hash };
      box.seen.set(key, record.payload_hash);
      append(box, "rows.jsonl", { ...record, created_at: new Date().toISOString() });
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
