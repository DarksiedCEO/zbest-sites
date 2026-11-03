-- Retention purge ledger (AEGIS review of the legal branch, 2026-10-30): the
-- Privacy Policy promises deletion, so a purge that silently stops running
-- must be visible. Each app's daily /api/cron/purge-leads records its last
-- SUCCESSFUL run here, in the same transaction as the purge; /api/health
-- reports "overdue" (503) when it is older than 48 hours, or "never_run".
-- Counts only, no PII. Applied by `pnpm --filter @zbest/lead migrate`.

CREATE TABLE IF NOT EXISTS lead_purge_runs (
  app              text        PRIMARY KEY CHECK (app IN ('zbm', 'zbc')),
  last_success_at  timestamptz NOT NULL,
  deleted          integer     NOT NULL,
  ua_cleared       integer     NOT NULL
);
