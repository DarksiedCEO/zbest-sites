-- AEGIS r6 (R6-1, R6-5, R6-7): leads whose email could not be delivered never
-- disappear silently.
-- Applied by `pnpm --filter @zbest/lead migrate` after 010 (one transaction,
-- no CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE the app version that writes
-- these (/api/health reports schema_outdated until then).
--
-- notify_abandoned_at     first time the lead hit the re-send cap. From then
--                         on /api/health answers leads_undelivered (503) until
--                         it is acknowledged; there is no time-based clearing.
--                         An abandoned lead is re-queued (flagged "previously
--                         undeliverable") whenever a later email is confirmed
--                         delivered.
-- notify_unverifiable_at  an email with this lead was accepted without a
--                         usable id, so its delivery cannot be checked: a
--                         health warning until acknowledged; the lead goes in
--                         the next digest, flagged.
-- notify_ack_at / _by     when and by whom the founder acknowledged it
--                         (POST /api/cron/ack-undelivered with CRON_SECRET).
--                         Acknowledging deletes nothing.
-- notify_lookup_failures  delivery lookups for this lead's email that failed
--                         with a server error: it goes to the back of the
--                         queue, and after 5 it is treated as unverifiable.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_abandoned_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_unverifiable_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_ack_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_ack_by text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_lookup_failures int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS leads_app_unacked_idx ON leads (app)
  WHERE notify_ack_at IS NULL AND (notify_abandoned_at IS NOT NULL OR notify_unverifiable_at IS NOT NULL);
