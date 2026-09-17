/**
 * Z Best Clips focus areas (Brief §B1, §B2).
 *
 * Entertainment and Brands are structurally different services — rented versus
 * owned distribution — so the color-coding is functional, not decorative. The
 * accent is bound in CSS (styles/tokens.css), never picked per component:
 *
 * - `data-focus="…"` recolors one subtree (a card, a dropdown entry) — for
 *   pages that show both, like How It Works.
 * - `data-page-focus="…"` on a page's <main> recolors the WHOLE document,
 *   including the nav CTA, the dropdown's page context, the consent banner and
 *   the footer, which live in the root layout outside <main>. It is resolved
 *   with `:has()`, so it is correct in the server-rendered HTML with no script.
 */
export const FOCUS_AREAS = ["entertainment", "brands"] as const;

export type Focus = (typeof FOCUS_AREAS)[number];
