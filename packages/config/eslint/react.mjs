import { A11Y_FILES, a11yRules, jsxA11y } from "./a11y.mjs";
import base from "./base.mjs";

/**
 * Shared flat config for React packages that are not Next apps
 * (packages/ui): the base config plus jsx-a11y's recommended rules as
 * errors. The shared components — forms, cookie banner, nav — live here, so
 * they get the same accessibility lint as the apps.
 */
export default [
  ...base,
  {
    files: A11Y_FILES,
    plugins: { "jsx-a11y": jsxA11y },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: a11yRules,
  },
];
