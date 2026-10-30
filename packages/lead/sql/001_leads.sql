-- Brief §6.2 leads table, plus the columns FULL-SERVICE-DESIGN §4.1 asks for
-- (services[] and source as columns, so leads count per campaign and service)
-- notify_status, so a lead whose email failed can be found and chased, and
-- payload_hash, so a changed resubmission under the same id is refused (409).
--
-- Applied by `pnpm --filter @zbest/lead migrate`, which reads the DIRECT URL
-- first (POSTGRES_URL_NON_POOLING, then DATABASE_URL_UNPOOLED, then
-- POSTGRES_URL) and, in one transaction under a transaction-scoped advisory
-- lock, records it in schema_migrations, checks the columns and the
-- UNIQUE (app, submission_id) key, and does a rolled-back round-trip insert.
-- The app never runs DDL at request time. Keep this file free of
-- CONCURRENTLY and BEGIN/COMMIT: it must run inside that one transaction.
--
-- PII: payload holds what the visitor typed. ip_hash is an HMAC of the client
-- IP (LEAD_IP_HASH_SECRET); the raw IP is never stored. No retention period is
-- set here: see 002_retention.sql (daily purge, LEAD_RETENTION_DAYS, default 730).
-- (ip_hash is no longer written; 002 clears old values.)

CREATE TABLE IF NOT EXISTS leads (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  uuid        NOT NULL,
  app            text        NOT NULL CHECK (app IN ('zbm', 'zbc')),
  form           text        NOT NULL,
  payload        jsonb       NOT NULL,
  payload_hash   text        NOT NULL,
  services       text[]      NOT NULL DEFAULT '{}',
  source         text,
  ip_hash        text,
  user_agent     text,
  notify_status  text        NOT NULL DEFAULT 'pending'
                             CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled')),
  notified_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  -- Idempotency key, per app: a ZBM and a ZBC lead can never collide.
  UNIQUE (app, submission_id)
);

CREATE INDEX IF NOT EXISTS leads_app_created_idx ON leads (app, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source) WHERE source IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_services_idx ON leads USING gin (services);
CREATE INDEX IF NOT EXISTS leads_unsent_idx ON leads (created_at) WHERE notify_status IN ('pending', 'failed');
