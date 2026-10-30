import "server-only";

/**
 * @zbest/lead — server-only lead delivery (Brief §6.2). Import from route
 * handlers only; it reads env and talks to Postgres and Resend.
 */
export { handleLead, type ParsedLead, type LeadErrorBody, type HandleLeadOptions } from "./pipeline";
export { resolveTransport, resolveLimiter, resolvePolicy, type Env, type Transport, type TransportConfig, type RequestPolicy } from "./config";
export { parsePostgresUrl, type PgOptions } from "./pg-url";
export { payloadHash } from "./hash";
export { leadEmail } from "./email";
export { consoleLogger, sanitize, type LeadLogger, type LogFields } from "./log";
export { memoryLimiter, restLimiter, parseRateLimit, DEFAULT_RATE_LIMIT } from "./rate-limit";
export { postgresStore, postgresPurger } from "./postgres";
export {
  handlePurge,
  handleHealth,
  purgeHealth,
  PURGE_OVERDUE_HOURS,
  type PurgeLedger,
  type PurgeHealth,
  resolveRetention,
  retentionCutoffs,
  DEFAULT_LEAD_RETENTION_DAYS,
  DEFAULT_UA_RETENTION_DAYS,
  type HandlePurgeOptions,
  type LeadPurger,
  type RetentionPolicy,
} from "./retention";
export { resendNotifier } from "./resend";
export { fakeStore, fakeNotifier } from "./fake";
export { clientIp } from "./ip";
export * from "./types";
