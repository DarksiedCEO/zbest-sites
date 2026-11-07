/**
 * Faces used by both brands (Brief §A1, §B1).
 *
 * Self-hosted from files in this repo (./files, see its README) through
 * next/font/local: nothing is fetched from a font CDN at build time or at
 * runtime (Brief §1.1; founder decision Oct 31, 2026, after a CI build failed
 * on a Google Fonts fetch). next/font requires literal arguments at module
 * scope, so these cannot be generated from a config object.
 */
import localFont from "next/font/local";

/** Body copy on both sites. */
export const ibmPlexSans = localFont({
  // One variable file (wght 100–700); the sites use 400–700.
  src: [{ path: "./files/ibm-plex-sans-latin-wght.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-plex-sans",
  // Google's own fallback metrics, declared in styles/tokens.css, so the swap
  // from fallback to font moves nothing more than it did before self-hosting.
  adjustFontFallback: false,
  fallback: ["IBM Plex Sans Fallback"],
});

/**
 * All numbers and stats on both sites — the deliberate sibling link between the
 * two brands. Ledger alignment needs font-variant-numeric: tabular-nums, which
 * tokens.css applies to the face rather than leaving it to call sites.
 */
export const ibmPlexMono = localFont({
  src: [
    { path: "./files/ibm-plex-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./files/ibm-plex-mono-latin-500.woff2", weight: "500", style: "normal" },
    { path: "./files/ibm-plex-mono-latin-600.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--font-plex-mono",
  // Google's own fallback metrics, declared in styles/tokens.css, so the swap
  // from fallback to font moves nothing more than it did before self-hosting.
  adjustFontFallback: false,
  fallback: ["IBM Plex Mono Fallback"],
});
