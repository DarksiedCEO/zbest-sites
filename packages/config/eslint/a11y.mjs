import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * eslint-plugin-jsx-a11y's recommended rules, every one at "error" (the
 * preset's three "off" rules stay off).
 *
 * eslint-config-next registers this plugin with only six of its rules, at
 * "warn", and `eslint .` exits 0 on warnings, so before this the required
 * `lint` check could never fail on an accessibility rule. Errors fail it.
 * See docs/accessibility.md.
 */
export const a11yRules = Object.fromEntries(
  Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([rule, setting]) => {
    const [level, ...options] = Array.isArray(setting) ? setting : [setting];
    return [rule, level === "off" || level === 0 ? "off" : ["error", ...options]];
  }),
);

export const A11Y_FILES = ["**/*.{jsx,tsx}"];

export { jsxA11y };
