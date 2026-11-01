import next from "eslint-config-next/core-web-vitals";
import { A11Y_FILES, a11yRules } from "./a11y.mjs";
import base from "./base.mjs";

/**
 * Shared flat config for the two Next.js apps.
 *
 * eslint-config-next 16 exports a native flat config array, and its
 * core-web-vitals entry already bundles next/typescript — no FlatCompat shim.
 * It registers the jsx-a11y plugin; the last block raises that plugin's
 * recommended rules to errors (see ./a11y.mjs).
 */
export default [...base, ...next, { files: A11Y_FILES, rules: a11yRules }];
