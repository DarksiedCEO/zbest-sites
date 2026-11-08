-- AEGIS r3 (H1, M3): immutable digest batches and reported expiries.
-- Applied by `pnpm --filter @zbest/lead migrate` after 007, in the same
-- transaction rules (no CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE the app
-- version that writes notify_batch_hash (/api/health reports schema_outdated
-- until then).
--
-- A digest batch is fixed when it is formed: its leads (notify_batch), its key
-- and the SHA-256 of its email body (notify_batch_hash) are written in the
-- same transaction, before the first send. Every retry sends the same leads
-- with the same body under the same key; a batch is never re-sliced, and a
-- lead is marked sent only together with the rest of the batch Resend
-- accepted.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_batch_hash text;

-- 'expired_reported': an expired lead whose count email Resend accepted.
-- Until then it stays 'expired_notify' and /api/health is degraded.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_notify_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check
  CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify', 'expired_reported'));

DROP INDEX IF EXISTS leads_app_unsent_idx;
CREATE INDEX leads_app_unsent_idx ON leads (app, created_at)
  WHERE notify_status IN ('pending', 'failed', 'deferred', 'delivery_unknown', 'expired_notify');
