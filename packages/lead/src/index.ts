/**
 * @zbest/lead — server-only lead delivery (Brief §6.2). Import from route
 * handlers only; it reads env and talks to Postgres and Resend.
 */
export { handleLead, type ParsedLead, type LeadErrorBody, type HandleLeadOptions } from "./pipeline";
export { resolveTransport, resolveLimiter, type Env, type Transport, type TransportConfig } from "./config";
export { leadEmail } from "./email";
export { consoleLogger, sanitize, type LeadLogger, type LogFields } from "./log";
export { memoryLimiter, restLimiter, parseRateLimit, DEFAULT_RATE_LIMIT } from "./rate-limit";
export { postgresStore } from "./postgres";
export { resendNotifier } from "./resend";
export { fakeStore, fakeNotifier } from "./fake";
export { clientIp } from "./ip";
export * from "./types";
