/**
 * The form token's wire constants (RTS-3), with no Node-only imports, so the
 * browser adapter (packages/ui/src/lead/contract.ts) and the server agree.
 */
export const FORM_TOKEN_HEADER = "x-zbest-form-token";
export const FORM_TOKEN_MIN_AGE_MS = 3_000;
export const FORM_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;
