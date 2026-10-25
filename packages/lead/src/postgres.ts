import postgres from "postgres";
import type { PgOptions } from "./pg-url";
import { DeliveryError, type InsertResult, type LeadApp, type LeadRecord, type LeadStore, type NotifyStatus } from "./types";

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
      connection: { application_name: "zbest-lead" },
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

export function postgresStore(options: PgOptions): LeadStore {
  let sql: postgres.Sql;
  try {
    sql = client(options);
  } catch {
    // Construction should not throw with discrete options; if it does, it must not leak.
    throw new DeliveryError("store_unconfigurable");
  }
  return {
    async insert(record: LeadRecord): Promise<InsertResult> {
      try {
        const rows = await sql`
          INSERT INTO leads
            (submission_id, app, form, payload, payload_hash, services, source, ip_hash, user_agent)
          VALUES (
            ${record.submission_id}::uuid, ${record.app}, ${record.form},
            ${sql.json(record.payload as postgres.JSONValue)}::jsonb, ${record.payload_hash},
            ARRAY(SELECT jsonb_array_elements_text(${sql.json(record.services)}::jsonb)),
            ${record.source}, ${record.ip_hash}, ${record.user_agent}
          )
          ON CONFLICT (app, submission_id) DO NOTHING
          RETURNING id`;
        if (rows.length === 1) return { inserted: true };
        const [existing] = await sql`
          SELECT payload_hash FROM leads
          WHERE app = ${record.app} AND submission_id = ${record.submission_id}::uuid`;
        return { inserted: false, samePayload: existing?.payload_hash === record.payload_hash };
      } catch (error) {
        throw storeError(error);
      }
    },
    async setNotifyStatus(app: LeadApp, submissionId: string, status: NotifyStatus) {
      try {
        await sql`
          UPDATE leads
          SET notify_status = ${status}::text,
              notified_at = CASE WHEN ${status}::text = 'sent' THEN now() ELSE notified_at END
          WHERE app = ${app} AND submission_id = ${submissionId}::uuid`;
      } catch (error) {
        throw storeError(error);
      }
    },
  };
}
