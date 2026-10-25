import postgres from "postgres";
import { DeliveryError, type LeadApp, type LeadRecord, type LeadStore, type NotifyStatus } from "./types";

/**
 * Brief §6.2 store: one row per lead in the `leads` table
 * (sql/001_leads.sql), upserted on (app, submission_id).
 *
 * Vendor-neutral `postgres` driver against POSTGRES_URL — Neon (the Vercel
 * Marketplace successor to "Vercel Postgres"), Supabase or any Postgres.
 * `prepare: false` keeps it compatible with transaction-mode poolers
 * (pgbouncer, Neon's pooled endpoint). One small client per server instance,
 * reused across requests.
 *
 * Parameters carry explicit casts: with `prepare: false` the server cannot
 * infer types, and the driver's array serialisation is unreliable in that
 * mode (caught by test/postgres.test.ts), so services[] travels as JSON.
 */

const clients = new Map<string, postgres.Sql>();

function client(url: string): postgres.Sql {
  let sql = clients.get(url);
  if (!sql) {
    sql = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 5,
      prepare: false,
      // Never let the driver print notices (they can echo values).
      onnotice: () => {},
    });
    clients.set(url, sql);
  }
  return sql;
}

/** The SQLSTATE only — a Postgres error message can quote row values. */
function storeError(error: unknown): DeliveryError {
  const code = (error as { code?: unknown })?.code;
  return new DeliveryError("store_failed", typeof code === "string" ? code : "unknown");
}

export function postgresStore(url: string): LeadStore {
  const sql = client(url);
  return {
    async insert(record: LeadRecord) {
      try {
        const rows = await sql`
          INSERT INTO leads
            (submission_id, app, form, payload, services, source, ip_hash, user_agent)
          VALUES (
            ${record.submission_id}::uuid, ${record.app}, ${record.form},
            ${sql.json(record.payload as postgres.JSONValue)}::jsonb, ARRAY(SELECT jsonb_array_elements_text(${sql.json(record.services)}::jsonb)),
            ${record.source}, ${record.ip_hash}, ${record.user_agent}
          )
          ON CONFLICT (app, submission_id) DO NOTHING
          RETURNING id`;
        return { inserted: rows.length === 1 };
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
