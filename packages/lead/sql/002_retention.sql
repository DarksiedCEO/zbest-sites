-- Retention and data minimisation (security sweep M4, privacy sweep F2/F6,
-- 2026-10-30). Applied by `pnpm --filter @zbest/lead migrate` like 001: one
-- transaction, no CONCURRENTLY, no BEGIN/COMMIT.
--
-- 1. ip_hash: no code ever read it, so the app stopped writing it. Existing
--    values are cleared here. The column stays (nullable) so the Brief §6.2
--    table shape and older deployments keep working; it can be dropped once
--    no deployment older than this change can write to the table.
-- 2. The purge itself runs daily from each app's /api/cron/purge-leads
--    (packages/lead/src/retention.ts), parameterised and scoped by app:
--      DELETE FROM leads WHERE app = $1 AND created_at < $2   -- LEAD_RETENTION_DAYS, default 730
--      UPDATE leads SET user_agent = NULL
--       WHERE app = $1 AND user_agent IS NOT NULL AND created_at < $3  -- LEAD_UA_RETENTION_DAYS, default 90
--    Both are served by leads_app_created_idx (app, created_at DESC) from 001.
--    The clock is created_at (the submission date): there is no
--    "last contact" column.

UPDATE leads SET ip_hash = NULL WHERE ip_hash IS NOT NULL;

COMMENT ON COLUMN leads.ip_hash IS
  'Unused since 2026-10-30 (data minimisation): not written by the app; old values cleared by 002_retention.sql.';
COMMENT ON COLUMN leads.created_at IS
  'Submission time. Retention clock: rows older than LEAD_RETENTION_DAYS (default 730) are deleted daily; user_agent is cleared after LEAD_UA_RETENTION_DAYS (default 90).';
