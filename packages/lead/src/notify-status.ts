/**
 * Every notify_status the app writes (CH-8; AEGIS r2 M2/M3, r3 M3), and every
 * notify_delivery value (AEGIS r4 M2, r5 N2/N4). Plain data with no
 * TypeScript-only syntax, so scripts/migrate.mjs loads it and verifies the
 * database CHECKs allow exactly these (AEGIS r4 L4, r5 N7).
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

export const NOTIFY_DELIVERY_VALUES = ["delivered", "undelivered", "unconfirmed", "abandoned", "unverifiable"] as const;
