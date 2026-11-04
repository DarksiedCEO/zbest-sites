-- Chaos red team 2026-10-30 CH-8, AEGIS F1 and AEGIS r2 (H1, M1-M3, L2):
-- the leads table is the durable outbox for founder emails. Applied by
-- `pnpm --filter @zbest/lead migrate` like 001-006 (one transaction, no
-- CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE deploying the app version
-- that writes these columns (/api/health reports schema_outdated until then).
--
-- BEFORE migrating production, run (read-only):
--   pnpm --filter @zbest/lead notify-backlog-report
-- It prints how many pending/failed rows exist and how old they are. The
-- migration changes no existing values; the retry cron then expires rows
-- older than LEAD_NOTIFY_RETRY_DAYS (default 3) to 'expired_notify' and
-- reports only their count, so old leads are never emailed one by one.
--
-- notify_status:
--   pending / failed      the email has not gone out (retried with backoff
--                          while the lead is younger than LEAD_NOTIFY_RETRY_DAYS)
--   deferred              past an email cap or quarantined: sent in a digest
--   delivery_unknown      first attempt's outcome unknown and over 23 h old
--                          (Resend keeps idempotency keys 24 h): digest, flagged
--   expired_notify        too old to retry: counted once in a digest line
--   sent / disabled       as before

ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_attempts int NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_next_at timestamptz;
-- When the first email attempt was made, and the SHA-256 of that email's body,
-- so every retry under the same idempotency key sends the identical body and a
-- Resend 409 for a matching body counts as already sent (r2 M2).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_first_attempt_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_body_hash text;
-- The digest batch a lead was put in, and when: a batch that timed out is
-- re-sent under the same key with the same body, never as a new digest (r2 L2).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_batch text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_batch_at timestamptz;
-- Stored past a quarantine threshold: sent in a digest, flagged (r2 H1; since
-- r3 M1 the full text is always kept, see 008 and docs/LEAD-ROUTE-DESIGN.md).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quarantined boolean NOT NULL DEFAULT false;

-- The 001 inline CHECK (auto-named leads_notify_status_check) is replaced.
-- AEGIS r4 L4: the list includes 008's 'expired_reported', so running this
-- file again by hand after 008 cannot narrow the CHECK; migrate also verifies
-- the CHECK against src/notify-status.ts.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_notify_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_notify_status_check
  CHECK (notify_status IN ('pending', 'sent', 'failed', 'disabled', 'deferred', 'delivery_unknown', 'expired_notify', 'expired_reported'));

DROP INDEX IF EXISTS leads_app_unsent_idx;
CREATE INDEX leads_app_unsent_idx ON leads (app, created_at)
  WHERE notify_status IN ('pending', 'failed', 'deferred', 'delivery_unknown');
CREATE INDEX IF NOT EXISTS leads_app_batch_idx ON leads (app, notify_batch) WHERE notify_batch IS NOT NULL;
