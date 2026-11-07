/**
 * Z Best Clips typefaces (Brief §B1): Bricolage Grotesque headlines — kinetic,
 * distinctive — IBM Plex Sans body, IBM Plex Mono view-counts and stats.
 *
 * Kept in its own module so the ZBC bundle never self-hosts Fraunces, which
 * only Z Best Media uses.
 */
import localFont from "next/font/local";
import { ibmPlexMono, ibmPlexSans } from "./shared";

export { ibmPlexMono, ibmPlexSans };

/**
 * Founder decision at Phase 1 close: wght 700-800, opsz 96, wdth 100.
 *
 * `opsz` at 96 is what gives Bricolage the display-size character §B1 asks
 * for; without it the face has no more personality than system-ui at a
 * headline size. The self-hosted file (./files) carries all three axes —
 * opsz 12–96, wdth 75–100, wght 200–800 — exactly as Google served it with
 * `axes: ["opsz", "wdth"]`. The 700-800 band and opsz 96 are applied by the
 * type scale (packages/ui/src/styles/type.css).
 */
export const bricolageGrotesque = localFont({
  src: [{ path: "./files/bricolage-grotesque-latin-opsz-wdth-wght.woff2", weight: "200 800", style: "normal" }],
  display: "swap",
  variable: "--font-bricolage",
  // Google's own fallback metrics, declared in styles/tokens.css, so the swap
  // from fallback to font moves nothing more than it did before self-hosting.
  adjustFontFallback: false,
  fallback: ["Bricolage Grotesque Fallback"],
});

/** Applied to <html> so every face is available as a CSS variable. */
export const zbcFontVariables = [
  bricolageGrotesque.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
