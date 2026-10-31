-- AEGIS r7 (R7-1, R7-2, R7-3). Applied by `pnpm --filter @zbest/lead migrate`
-- after 011 (one transaction, no CONCURRENTLY, no BEGIN/COMMIT). Run it
-- BEFORE the app version that writes these (/api/health reports
-- schema_outdated until then).

-- R7-1: automatic recovery of an abandoned lead is bounded: at most 5 times,
-- at least 24 h apart (src/postgres.ts recoverAbandoned).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_recoveries int NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notify_recovered_at timestamptz;

-- R7-2: an append-only history of acknowledgements. A later re-abandonment
-- clears the lead's own notify_ack_at, never these rows. The actor is the
-- holder of the secret that authorised the request (LEAD_ACK_SECRET, else
-- CRON_SECRET); ip_hash is a keyed hash of the request's address.
CREATE TABLE IF NOT EXISTS lead_acks (
  id bigserial PRIMARY KEY,
  app text NOT NULL CHECK (app IN ('zbm', 'zbc')),
  acked_at timestamptz NOT NULL DEFAULT now(),
  actor text NOT NULL,
  ip_hash text,
  through timestamptz,
  submission_ids uuid[] NOT NULL DEFAULT '{}',
  acknowledged int NOT NULL
);

-- R7-3: rows abandoned or found unverifiable before 011 existed get a date,
-- so /api/health and the backlog report count them.
UPDATE leads SET notify_abandoned_at = coalesce(notify_undelivered_at, notified_at, now())
WHERE notify_delivery = 'abandoned' AND notify_abandoned_at IS NULL;
UPDATE leads SET notify_unverifiable_at = coalesce(notified_at, now())
WHERE notify_delivery = 'unverifiable' AND notify_unverifiable_at IS NULL;
