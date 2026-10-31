/**
 * Every notify_status the app writes (CH-8; AEGIS r2 M2/M3, r3 M3). Plain
 * data with no TypeScript-only syntax, so scripts/migrate.mjs loads it and
 * verifies the database CHECK accepts exactly these (AEGIS r4 L4).
 */
export const NOTIFY_STATUSES = [
  "pending",
  "sent",
  "failed",
  "disabled",
  "deferred",
  "delivery_unknown",
  "expired_notify",
  "expired_reported",
] as const;
