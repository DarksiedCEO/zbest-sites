import next from "eslint-config-next/core-web-vitals";
import base from "./base.mjs";

/**
 * Shared flat config for the two Next.js apps.
 *
 * eslint-config-next 16 exports a native flat config array, and its
 * core-web-vitals entry already bundles next/typescript — no FlatCompat shim.
 */
export default [...base, ...next];
