-- Brief §6.2 leads table, plus the columns FULL-SERVICE-DESIGN §4.1 asks for
-- (services[] and source as columns, so leads count per campaign and service)
-- and notify_status, so a lead whose email failed can be found and chased.
--
-- Applied by `pnpm --filter @zbest/lead migrate` (reads POSTGRES_URL). The app
-- never runs DDL at request time. Idempotent: safe to run twice.
--
-- PII: payload holds what the visitor typed. ip_hash is an HMAC of the client
-- IP (LEAD_IP_HASH_SECRET); the raw IP is never stored. No retention period is
-- set — that is a founder/counsel decision (docs/LEAD-ROUTE-DESIGN.md §5.4).
-- Once chosen, a purge is:  DELETE FROM leads WHERE created_at < now() - interval '<period>';

CREATE TABLE IF NOT EXISTS leads (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id  uuid        NOT NULL,
  app            text        NOT NULL CHECK (app IN ('zbm', 'zbc')),
  form           text        NOT NULL,
  payload        jsonb       NOT NULL,
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
