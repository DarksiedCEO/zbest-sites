-- Chaos red team 2026-10-30 CH-8: the founder email is retried. Applied by
-- `pnpm --filter @zbest/lead migrate` like 001-006 (one transaction, no
-- CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE deploying the app version
-- that writes these columns.
--
-- Leads with notify_status 'pending' or 'failed' are the outbox. The retry
-- cron (/api/cron/retry-notify, packages/lead/src/notify-retry.ts) claims due
-- rows with FOR UPDATE SKIP LOCKED and a 10-minute lease (notify_next_at),
-- sends with the same Resend idempotency key, and records the outcome:
-- 'failed' counts an attempt and sets notify_next_at by exponential backoff
-- (15 min doubling, capped at 24 h), up to 10 attempts. /api/health reports
-- unsent leads older than LEAD_NOTIFY_ALERT_MINUTES as degraded.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_attempts int NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_next_at timestamptz;

-- 001's leads_unsent_idx is on created_at only; the outbox is read per app.
CREATE INDEX IF NOT EXISTS leads_app_unsent_idx ON leads (app, created_at)
  WHERE notify_status IN ('pending', 'failed');

-- AEGIS F1 (review of 6c6b720): past the site-wide email cap a lead is
-- stored with notify_status 'deferred' and sent in one digest by the same
-- cron. The 001 inline CHECK (auto-named leads_notify_status_check) is
-- replaced to allow it.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_notify_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check
  CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred'));
DROP INDEX IF EXISTS leads_app_unsent_idx;
CREATE INDEX leads_app_unsent_idx ON leads (app, created_at)
  WHERE notify_status IN ('pending', 'failed', 'deferred');
