-- Service area, revised (founder update, 2026-10-30 12:51): all inhabited US
-- territories, so the US Virgin Islands (VI), American Samoa (AS) and the
-- Northern Mariana Islands (MP) join the 50 states, DC, PR and GU: 56 codes.
--
-- 004 created leads_service_area_check with the original 53 codes and is
-- kept exactly as first committed, because a database may already have run
-- it (AEGIS R-M1). This file replaces that constraint unconditionally, so it
-- is correct whether 004 ran with 53 codes or not, and is safe to re-run.
-- migrate.mjs then proves the live constraint accepts exactly the app's
-- SERVICE_AREAS (src/region.ts) and rejects anything else.
--
-- Takes a brief ACCESS EXCLUSIVE lock to validate existing rows; at today's
-- row counts that is milliseconds (AEGIS R-L1). Applied by
-- `pnpm --filter @zbest/lead migrate` (one transaction).

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_service_area_check;

ALTER TABLE leads ADD CONSTRAINT leads_service_area_check CHECK (
  service_area IS NULL OR service_area IN (
    'US-AL','US-AK','US-AZ','US-AR','US-CA','US-CO','US-CT','US-DE','US-FL','US-GA',
    'US-HI','US-ID','US-IL','US-IN','US-IA','US-KS','US-KY','US-LA','US-ME','US-MD',
    'US-MA','US-MI','US-MN','US-MS','US-MO','US-MT','US-NE','US-NV','US-NH','US-NJ',
    'US-NM','US-NY','US-NC','US-ND','US-OH','US-OK','US-OR','US-PA','US-RI','US-SC',
    'US-SD','US-TN','US-TX','US-UT','US-VT','US-VA','US-WA','US-WV','US-WI','US-WY',
    'US-DC','PR','GU','VI','AS','MP'
  )
);
