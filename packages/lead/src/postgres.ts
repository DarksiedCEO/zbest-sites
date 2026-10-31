import postgres from "postgres";
import type { PgOptions } from "./pg-url";
import type { LeadPurger, PurgeLedger, PurgeResult } from "./retention";
import { DEDUPE_WINDOW_HOURS, DeliveryError, type InsertResult, type LeadApp, type LeadRecord, type LeadStore, type NotifyOutbox, type NotifyStatus, type StoredLead } from "./types";

/**
 * Brief §6.2 store: one row per lead in the `leads` table
 * (sql/001_leads.sql), upserted on (app, submission_id).
 *
 * Vendor-neutral `postgres` driver — Neon (the Vercel Marketplace successor
 * to "Vercel Postgres"), Supabase or any Postgres. It is given DISCRETE
 * options parsed by pg-url.ts, never the raw URL: the driver forwards unknown
 * URL parameters to the server (Neon's channel_binding → 42704) and throws
 * errors that embed the URL on a malformed one (AEGIS H1, M1).
 *
 * `prepare: false` keeps it compatible with transaction-mode poolers
 * (pgbouncer, Neon's pooled endpoint). One small client per server instance,
 * reused across requests.
 *
 * Parameters carry explicit casts: with `prepare: false` the server cannot
 * infer types, and the driver's array serialisation is unreliable in that
 * mode (caught by test/postgres.test.ts), so services[] travels as JSON.
 */

const clients = new Map<string, postgres.Sql>();

function client(options: PgOptions): postgres.Sql {
  const key = JSON.stringify(options);
  let sql = clients.get(key);
  if (!sql) {
    sql = postgres({
      host: options.host,
      port: options.port,
      database: options.database,
      username: options.username,
      password: options.password,
      ssl: options.ssl,
      max: 1,
      idle_timeout: 20,
      connect_timeout: options.connect_timeout ?? 5,
      prepare: false,
      // Never let the driver print notices (they can echo values).
      onnotice: () => {},
      // Discrete options only: nothing from the environment's PG* variables.
      connection: {
        application_name: "zbest-lead",
        ...(options.startup_options ? { options: options.startup_options } : {}),
      },
    });
    clients.set(key, sql);
  }
  return sql;
}

/** The SQLSTATE (or a driver error code) only — a message can quote row values or hosts. */
function storeError(error: unknown): DeliveryError {
  const code = (error as { code?: unknown })?.code;
  return new DeliveryError("store_failed", typeof code === "string" && /^[A-Z0-9_]{1,40}$/.test(code) ? code : "unknown");
}

/**
 * Chaos red team CH-9: a lock on the leads table used to hang every lead for
 * as long as the lock was held (39 s seen). Every statement the route runs
 * is in a transaction that first sets statement_timeout and lock_timeout
 * (transaction-scoped, so it also holds through a transaction-mode pooler
 * such as Neon's). A timeout surfaces as SQLSTATE 57014 or 55P03, which the
 * pipeline answers with a fast, honest 503.
 */
export const DEFAULT_STATEMENT_TIMEOUT_MS = 5_000;

type Tx = postgres.TransactionSql;

/** The columns a StoredLead is read from (CH-8 outbox, AEGIS F1/F3, r2). */
const STORED_COLUMNS_SQL =
  "submission_id, app, form, payload, payload_hash, content_hash, services, source, service_area, user_agent, created_at, " +
  "notify_status, notify_attempts, notify_first_attempt_at, notify_body_hash, notify_batch, notify_batch_at, quarantined";

function storedLead(r: Record<string, unknown>): StoredLead {
  return {
    submission_id: String(r.submission_id),
    app: r.app as LeadApp,
    form: String(r.form),
    payload: r.payload as Record<string, unknown>,
    payload_hash: String(r.payload_hash),
    content_hash: (r.content_hash as string | null) ?? "",
    services: (r.services as string[]) ?? [],
    source: (r.source as string | null) ?? null,
    service_area: String(r.service_area),
    user_agent: (r.user_agent as string | null) ?? null,
    created_at: r.created_at as Date,
    notify_status: r.notify_status as NotifyStatus,
    notify_attempts: Number(r.notify_attempts ?? 0),
    notify_first_attempt_at: (r.notify_first_attempt_at as Date | null) ?? null,
    notify_body_hash: (r.notify_body_hash as string | null) ?? null,
    notify_batch: (r.notify_batch as string | null) ?? null,
    notify_batch_at: (r.notify_batch_at as Date | null) ?? null,
    quarantined: r.quarantined === true,
  };
}
const withTimeouts = async (tx: Tx, ms: number) => {
  await tx`SELECT set_config('statement_timeout', ${String(ms)}, true), set_config('lock_timeout', ${String(ms)}, true)`;
};

export function postgresStore(
  options: PgOptions,
  { statementTimeoutMs = DEFAULT_STATEMENT_TIMEOUT_MS }: { statementTimeoutMs?: number } = {},
): LeadStore & NotifyOutbox {
  let sql: postgres.Sql;
  try {
    sql = client(options);
  } catch {
    // Construction should not throw with discrete options; if it does, it must not leak.
    throw new DeliveryError("store_unconfigurable");
  }
  /** One short transaction with the CH-9 timeouts; errors become a SQLSTATE-only DeliveryError. */
  const run = async <T>(fn: (tx: Tx) => Promise<T>, deadline?: number): Promise<T> => {
    try {
      return (await sql.begin(async (tx) => {
        // A request queued behind others on this instance's connection may
        // start late: it gets only what is left before its deadline, minus a
        // margin, and starts nothing once that is gone.
        const left = deadline === undefined ? statementTimeoutMs : Math.min(statementTimeoutMs, deadline - Date.now() - 500);
        if (left < 50) throw Object.assign(new Error("deadline"), { code: "57014" });
        await withTimeouts(tx, Math.floor(left));
        return fn(tx);
      })) as T;
    } catch (error) {
      throw storeError(error);
    }
  };
  const cols = (tx: Tx) => tx.unsafe(STORED_COLUMNS_SQL);
  const leased = (rows: unknown) => (rows as Record<string, unknown>[]).map(storedLead);
  return {
    async insert(record: LeadRecord, opts?: { deadline?: number }): Promise<InsertResult> {
      return run(async (tx) => {
        // A transaction-scoped advisory lock on (app, content_hash) serialises
        // identical submissions, so two copies racing in parallel make one
        // lead (RTS-3). It lives on the transaction's backend, so it holds
        // through a pooler.
        await tx`SELECT pg_advisory_xact_lock(hashtextextended(${`${record.app}:${record.content_hash}`}::text, 0))`;
        const [recent] = await tx`
          SELECT ${cols(tx)} FROM leads
          WHERE app = ${record.app} AND content_hash = ${record.content_hash}
            AND submission_id <> ${record.submission_id}::uuid
            AND created_at > now() - make_interval(hours => ${DEDUPE_WINDOW_HOURS}::int)
          ORDER BY created_at DESC
          LIMIT 1`;
        // AEGIS F3: the stored copy travels back, so an unsent email can still go out.
        if (recent) return { inserted: false, duplicateOf: "content", original: storedLead(recent) } as const;
        const rows = await tx`
          INSERT INTO leads
            (submission_id, app, form, payload, payload_hash, content_hash, services, source, service_area, user_agent)
          VALUES (
            ${record.submission_id}::uuid, ${record.app}, ${record.form},
            ${tx.json(record.payload as postgres.JSONValue)}::jsonb, ${record.payload_hash}, ${record.content_hash},
            ARRAY(SELECT jsonb_array_elements_text(${tx.json(record.services)}::jsonb)),
            ${record.source}, ${record.service_area}, ${record.user_agent}
          )
          ON CONFLICT (app, submission_id) DO NOTHING
          RETURNING created_at`;
        // AEGIS r2 M2: the stored time, which every email for this lead is built from.
        if (rows.length === 1) return { inserted: true, createdAt: rows[0]!.created_at as Date } as const;
        const [existing] = await tx`
          SELECT ${cols(tx)} FROM leads
          WHERE app = ${record.app} AND submission_id = ${record.submission_id}::uuid`;
        return {
          inserted: false,
          samePayload: existing?.payload_hash === record.payload_hash,
          ...(existing ? { stored: storedLead(existing) } : {}),
        } as const;
      }, opts?.deadline);
    },
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus, retryAt?: Date) {
      await run(async (tx) => {
        await tx`
          UPDATE leads
          SET notify_status = ${status}::text,
              notified_at = CASE WHEN ${status}::text = 'sent' THEN now() ELSE notified_at END,
              notify_attempts = notify_attempts + CASE WHEN ${status}::text = 'failed' THEN 1 ELSE 0 END,
              notify_next_at = ${retryAt ? retryAt.toISOString() : null}::timestamptz
          WHERE app = ${app} AND submission_id = ${submissionId}::uuid`;
      });
    },
    async markAttempt(app: LeadApp, submissionId: string, bodyHash: string) {
      return run(async (tx) => {
        const [row] = await tx`
          UPDATE leads
          SET notify_first_attempt_at = coalesce(notify_first_attempt_at, now()),
              notify_body_hash = coalesce(notify_body_hash, ${bodyHash}::text)
          WHERE app = ${app} AND submission_id = ${submissionId}::uuid
          RETURNING notify_first_attempt_at, notify_body_hash`;
        return { firstAttemptAt: (row?.notify_first_attempt_at as Date) ?? new Date(), bodyHash: (row?.notify_body_hash as string) ?? bodyHash };
      });
    },
    async quarantine(app: LeadApp, submissionId: string, payload: Record<string, unknown>) {
      await run(async (tx) => {
        await tx`
          UPDATE leads SET quarantined = true, payload = ${tx.json(payload as postgres.JSONValue)}::jsonb
          WHERE app = ${app} AND submission_id = ${submissionId}::uuid`;
      });
    },
    async claimUnsent(app: LeadApp, { pendingBefore, createdAfter, maxAttempts, limit }) {
      // The lease (notify_next_at + 10 min) and SKIP LOCKED: two runs at once never send the same row twice.
      return run(async (tx) =>
        leased(
          await tx`
            UPDATE leads SET notify_next_at = now() + interval '10 minutes'
            WHERE id IN (
              SELECT id FROM leads
              WHERE app = ${app}::text
                AND created_at > ${createdAfter.toISOString()}::timestamptz
                AND (notify_status = 'failed' OR (notify_status = 'pending' AND created_at < ${pendingBefore.toISOString()}::timestamptz))
                AND (notify_next_at IS NULL OR notify_next_at <= now())
                AND notify_attempts < ${maxAttempts}::int
              ORDER BY created_at
              LIMIT ${limit}::int
              FOR UPDATE SKIP LOCKED)
            RETURNING ${cols(tx)}`,
        ),
      );
    },
    async expireOld(app: LeadApp, createdBefore: Date) {
      return run(async (tx) => {
        const r = await tx`
          UPDATE leads SET notify_status = 'expired_notify', notify_next_at = NULL
          WHERE app = ${app}::text AND notify_status IN ('pending', 'failed')
            AND created_at <= ${createdBefore.toISOString()}::timestamptz`;
        return r.count;
      });
    },
    async markUnknown(app: LeadApp, firstAttemptBefore: Date) {
      return run(async (tx) => {
        const r = await tx`
          UPDATE leads SET notify_status = 'delivery_unknown', notify_next_at = NULL
          WHERE app = ${app}::text AND notify_status IN ('pending', 'failed')
            AND notify_first_attempt_at < ${firstAttemptBefore.toISOString()}::timestamptz`;
        return r.count;
      });
    },
    async claimDigest(app: LeadApp, limit: number) {
      return run(async (tx) =>
        leased(
          await tx`
            UPDATE leads SET notify_next_at = now() + interval '10 minutes'
            WHERE id IN (
              SELECT id FROM leads
              WHERE app = ${app}::text AND notify_status IN ('deferred', 'delivery_unknown')
                AND (notify_next_at IS NULL OR notify_next_at <= now())
              ORDER BY created_at
              LIMIT ${limit}::int
              FOR UPDATE SKIP LOCKED)
            RETURNING ${cols(tx)}`,
        ),
      );
    },
    async assignBatch(app: LeadApp, submissionIds: string[], key: string) {
      await run(async (tx) => {
        await tx`
          UPDATE leads SET notify_batch = ${key}::text, notify_batch_at = now()
          WHERE app = ${app}::text AND submission_id = ANY(${submissionIds}::uuid[])`;
      });
    },
    async markBatchSent(app: LeadApp, key: string) {
      await run(async (tx) => {
        await tx`
          UPDATE leads SET notify_status = 'sent', notified_at = now(), notify_next_at = NULL
          WHERE app = ${app}::text AND notify_batch = ${key}::text`;
      });
    },
    async clearBatch(app: LeadApp, key: string) {
      await run(async (tx) => {
        await tx`
          UPDATE leads SET notify_batch = NULL, notify_batch_at = NULL, notify_status = 'delivery_unknown', notify_next_at = NULL
          WHERE app = ${app}::text AND notify_batch = ${key}::text AND notify_status <> 'sent'`;
      });
    },
  };
}

/** The tagged-template shape purgeWith needs; postgres.Sql satisfies it, and so does a recording fake. */
export type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => PromiseLike<{ count: number }>;

/**
 * The retention statements (src/retention.ts), parameterised: the app, the
 * cutoffs and the run time travel as bound values with explicit casts, never
 * as SQL text. Scoped to one app, so each app's cron purges only its own rows
 * even when both share a database. All idempotent. The last statement records
 * this successful run in lead_purge_runs (sql/003_purge_runs.sql); the caller
 * runs all three in one transaction, so the ledger never claims a purge that
 * did not commit.
 */
export async function purgeWith(
  sql: SqlTag,
  app: LeadApp,
  cutoffs: { leads: Date; userAgent: Date },
  ranAt: Date = new Date(),
): Promise<PurgeResult> {
  const deleted = await sql`
    DELETE FROM leads
    WHERE app = ${app}::text AND created_at < ${cutoffs.leads.toISOString()}::timestamptz`;
  const cleared = await sql`
    UPDATE leads SET user_agent = NULL
    WHERE app = ${app}::text AND user_agent IS NOT NULL AND created_at < ${cutoffs.userAgent.toISOString()}::timestamptz`;
  // ip_hash is no longer written (sql/002_retention.sql cleared it once), but
  // a deployment older than this change can still write it until this one is
  // live; clearing it daily means no such value survives (AEGIS H-L1).
  const ipCleared = await sql`
    UPDATE leads SET ip_hash = NULL
    WHERE app = ${app}::text AND ip_hash IS NOT NULL`;
  await sql`
    INSERT INTO lead_purge_runs (app, last_success_at, deleted, ua_cleared)
    VALUES (${app}::text, ${ranAt.toISOString()}::timestamptz, ${deleted.count}::int, ${cleared.count}::int)
    ON CONFLICT (app) DO UPDATE
      SET last_success_at = EXCLUDED.last_success_at, deleted = EXCLUDED.deleted, ua_cleared = EXCLUDED.ua_cleared`;
  return { deleted: deleted.count, uaCleared: cleared.count, ipHashCleared: ipCleared.count };
}

/** Columns migrations 004, 006 and 007 add, which this code writes (AEGIS F4). */
export const REQUIRED_LEAD_COLUMNS = [
  "service_area",
  "content_hash",
  "notify_attempts",
  "notify_next_at",
  "notify_first_attempt_at",
  "notify_body_hash",
  "notify_batch",
  "notify_batch_at",
  "quarantined",
] as const;

export function postgresPurger(options: PgOptions): LeadPurger & PurgeLedger & Required<Pick<PurgeLedger, "leadState" | "missingColumns">> {
  const sql = client(options);
  return {
    async purge(app, cutoffs, ranAt) {
      try {
        return (await sql.begin((tx) => purgeWith(tx as unknown as SqlTag, app, cutoffs, ranAt))) as PurgeResult;
      } catch (error) {
        throw storeError(error);
      }
    },
    async missingColumns() {
      try {
        const rows = await sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = current_schema() AND table_name = 'leads'`;
        const have = new Set(rows.map((r) => String(r.column_name)));
        return REQUIRED_LEAD_COLUMNS.filter((c) => !have.has(c));
      } catch (error) {
        throw storeError(error);
      }
    },
    async leadState(app, { unsentBefore, retryAfter }) {
      try {
        const [row] = await sql`
          SELECT
            count(*) FILTER (WHERE notify_status IN ('pending', 'failed')
                             AND created_at < ${unsentBefore.toISOString()}::timestamptz
                             AND created_at > ${retryAfter.toISOString()}::timestamptz)::int AS unsent,
            count(*) FILTER (WHERE notify_status IN ('deferred', 'delivery_unknown'))::int AS digest_pending,
            count(*) FILTER (WHERE quarantined AND created_at > now() - interval '24 hours')::int AS quarantined_24h,
            count(*) FILTER (WHERE created_at > now() - interval '24 hours')::int AS stored_24h
          FROM leads WHERE app = ${app}::text`;
        return {
          unsent: Number(row?.unsent ?? 0),
          digestPending: Number(row?.digest_pending ?? 0),
          quarantined24h: Number(row?.quarantined_24h ?? 0),
          stored24h: Number(row?.stored_24h ?? 0),
        };
      } catch (error) {
        throw storeError(error);
      }
    },
    async lastSuccess(app) {
      try {
        const [row] = await sql`SELECT last_success_at FROM lead_purge_runs WHERE app = ${app}::text`;
        return row ? (row.last_success_at as Date) : null;
      } catch (error) {
        throw storeError(error);
      }
    },
  };
}
