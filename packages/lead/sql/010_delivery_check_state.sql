-- AEGIS r5 (N2, N3, N4): bounded re-sends and the delivery check's own state.
-- Applied by `pnpm --filter @zbest/lead migrate` after 009 (one transaction,
-- no CONCURRENTLY, no BEGIN/COMMIT). Run it BEFORE the app version that writes
-- these (/api/health reports schema_outdated until then).
--
-- notify_resends     how many times the lead was re-sent because Resend said
--                    its email was not delivered (or never confirmed it).
--                    The cap and waits live in src/postgres.ts (since AEGIS
--                    r6: 4 re-sends, after 1 h, 6 h, 24 h, 72 h); then it is
--                    'abandoned' (see 011).
-- notify_checked_at  when a lookup last answered for the lead's email with a
--                    non-final event (sent, queued, delivery_delayed …). Only
--                    such an email can become 'unconfirmed' after 48 h, so an
--                    email that was never looked up is never re-sent for that.
-- notify_delivery    adds 'abandoned' (re-send cap reached) and
--                    'unverifiable' (accepted without a usable email id).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_resends int NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_checked_at timestamptz;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_notify_delivery_check;
ALTER TABLE leads ADD CONSTRAINT leads_notify_delivery_check
  CHECK (notify_delivery IS NULL OR notify_delivery IN ('delivered', 'undelivered', 'unconfirmed', 'abandoned', 'unverifiable'));

-- The delivery check's own health, per app: a lookup Resend refused as
-- unauthorized (a sending-only API key: last_error 'unauthorized'), or
-- lookups failing since `failing_since`. Cleared by a successful lookup.
CREATE TABLE IF NOT EXISTS lead_delivery_checks (
  app text PRIMARY KEY CHECK (app IN ('zbm', 'zbc')),
  last_success_at timestamptz,
  failing_since timestamptz,
  last_error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
