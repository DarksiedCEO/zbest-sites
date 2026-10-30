-- Service area (founder decision, 2026-10-30 11:50): the 50 US states, the
-- District of Columbia, Puerto Rico and Guam. Every lead form asks for the
-- business's state or territory; only a served one is ever stored (the
-- pipeline declines "Outside these areas" before the insert, storing
-- nothing). Nullable: rows from before this change have none.
-- Applied by `pnpm --filter @zbest/lead migrate` (one transaction).

ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_area text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'leads_service_area_check' AND conrelid = 'leads'::regclass) THEN
    -- Defence in depth for the app's rule: exactly the served set, or NULL for old rows.
    ALTER TABLE leads ADD CONSTRAINT leads_service_area_check CHECK (
      service_area IS NULL OR service_area IN (
        'US-AL','US-AK','US-AZ','US-AR','US-CA','US-CO','US-CT','US-DE','US-FL','US-GA',
        'US-HI','US-ID','US-IL','US-IN','US-IA','US-KS','US-KY','US-LA','US-ME','US-MD',
        'US-MA','US-MI','US-MN','US-MS','US-MO','US-MT','US-NE','US-NV','US-NH','US-NJ',
        'US-NM','US-NY','US-NC','US-ND','US-OH','US-OK','US-OR','US-PA','US-RI','US-SC',
        'US-SD','US-TN','US-TX','US-UT','US-VT','US-VA','US-WA','US-WV','US-WI','US-WY',
        'US-DC','PR','GU'
      )
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS leads_service_area_idx ON leads (service_area) WHERE service_area IS NOT NULL;
