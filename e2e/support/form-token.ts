import { FORM_TOKEN_HEADER, fakeFormTokenSecret, formTokens } from "../../packages/lead/src/form-token";
import { GATE_NONCE } from "../playwright.config";

/**
 * Red team RTS-3: every POST to /api/lead needs a server-issued form token.
 * The gate's servers run the fake transport, whose token secret is derived
 * from this run's nonce, so a test that posts to the API directly (not
 * through a page) mints one here, issued 10 s ago (past the 3 s minimum).
 * Browser form flows never use this: they fetch their token from the page.
 */
const tokens = formTokens(fakeFormTokenSecret(GATE_NONCE!));

export const formTokenHeader = (ageMs = 10_000, app: "zbm" | "zbc" = "zbm"): Record<string, string> => ({
  [FORM_TOKEN_HEADER]: tokens.issue(app, Date.now() - ageMs),
});
export { FORM_TOKEN_HEADER };
