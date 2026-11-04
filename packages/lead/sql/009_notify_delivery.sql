-- AEGIS r4 (M2, L6): a delivery signal and honest duplicate flags.
-- Applied by `pnpm --filter @zbest/lead migrate` after 008 (one transaction,
-- no CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE the app version that
-- writes these columns (/api/health reports schema_outdated until then).
--
-- notify_email_id         Resend's id for the accepted email the lead was in
--                         (its own email or a digest).
-- notify_delivery         what Resend's GET /emails/{id} last_event said:
--                         NULL not checked yet; 'delivered'; 'undelivered'
--                         (bounced, complained, suppressed, failed, canceled);
--                         'unconfirmed' (no final event within the check
--                         window). Not delivered → back in the digest, flagged.
-- notify_undelivered_at   when a non-delivery was found: /api/health reports
--                         delivery_failed for 24 h after it.
-- notify_outcome_unknown  some attempt ended without a known outcome (timeout,
--                         network error, 409): only these leads are flagged
--                         "may already have been emailed". Sticky.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_email_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_delivery text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_undelivered_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_outcome_unknown boolean NOT NULL DEFAULT false;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_notify_delivery_check;
ALTER TABLE leads ADD CONSTRAINT leads_notify_delivery_check
  CHECK (notify_delivery IS NULL OR notify_delivery IN ('delivered', 'undelivered', 'unconfirmed'));

-- The delivery check reads recently sent, unchecked rows.
CREATE INDEX IF NOT EXISTS leads_app_delivery_check_idx ON leads (app, notified_at)
  WHERE notify_status = 'sent' AND notify_email_id IS NOT NULL AND notify_delivery IS NULL;
