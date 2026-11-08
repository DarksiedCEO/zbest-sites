import "server-only";

/**
 * @zbest/lead — server-only lead delivery (Brief §6.2). Import from route
 * handlers only; it reads env and talks to Postgres and Resend.
 */
export { handleLead, handleFormToken, UNSTORABLE_TEXT_MESSAGE, type ParsedLead, type LeadErrorBody, type HandleLeadOptions } from "./pipeline";
export { FORM_TOKEN_HEADER, FORM_TOKEN_MIN_AGE_MS, FORM_TOKEN_MAX_AGE_MS, formTokens, fakeFormTokenSecret, type FormTokens } from "./form-token";
export { resolveTransport, resolveLimiter, resolvePolicy, type Env, type Transport, type TransportConfig, type RequestPolicy } from "./config";
export { parsePostgresUrl, type PgOptions } from "./pg-url";
export { payloadHash, contentHash } from "./hash";
export { leadEmail } from "./email";
export { consoleLogger, sanitize, type LeadLogger, type LogFields } from "./log";
export { memoryLimiter, restLimiter, parseRateLimit, DEFAULT_RATE_LIMIT } from "./rate-limit";
export { postgresStore, postgresPurger } from "./postgres";
export {
  handlePurge,
  handleHealth,
  resetHealthCache,
  HEALTH_CACHE_MS,
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
export { handleNotifyRetry, notifyBackoffMs, NOTIFY_PENDING_GRACE_MS, NOTIFY_MAX_ATTEMPTS } from "./notify-retry";
export { handleAckUndelivered } from "./ack";
export { fakeStore, fakeNotifier } from "./fake";
export { clientIp } from "./ip";
export * from "./types";
export { REGION, regionServed, SERVICE_AREAS, OUTSIDE, REGION_COPY, type Region } from "./region";
