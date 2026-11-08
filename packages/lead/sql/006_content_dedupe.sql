-- Red team 2026-10-30 RTS-3: identical submissions within 24 hours are one
-- lead. Applied by `pnpm --filter @zbest/lead migrate` like 001-005: one
-- transaction, no CONCURRENTLY, no BEGIN/COMMIT. Run it BEFORE deploying the
-- app version that writes content_hash (that version's inserts name the
-- column).
--
-- content_hash: SHA-256 of the normalised form, region and payload
-- (packages/lead/src/hash.ts contentHash). It is derived from the submission
-- itself, lives in the same row, and is deleted with it by the retention
-- purge; it adds no information the row does not already hold. Older rows
-- keep NULL and simply never match.

ALTER TABLE leads ADD COLUMN IF NOT EXISTS content_hash text;

CREATE INDEX IF NOT EXISTS leads_app_content_idx ON leads (app, content_hash, created_at DESC)
  WHERE content_hash IS NOT NULL;

COMMENT ON COLUMN leads.content_hash IS
  'SHA-256 of the normalised submission (form, region, payload). The same content within 24 h under a new submission_id is not stored again or emailed (packages/lead/src/hash.ts contentHash).';
