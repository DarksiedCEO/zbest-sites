/**
 * Z Best Media typefaces (Brief §A1): Fraunces headlines, IBM Plex Sans body,
 * IBM Plex Mono numbers.
 *
 * Kept in its own module so the ZBM bundle never self-hosts Bricolage
 * Grotesque, which only Z Best Clips uses.
 */
import localFont from "next/font/local";
import { ibmPlexMono, ibmPlexSans } from "./shared";

export { ibmPlexMono, ibmPlexSans };

/** Self-hosted (./files): one variable file, wght 100–900, as Google served it. */
export const fraunces = localFont({
  src: [{ path: "./files/fraunces-latin-wght.woff2", weight: "100 900", style: "normal" }],
  display: "swap",
  variable: "--font-fraunces",
  // Google's own fallback metrics, declared in styles/tokens.css, so the swap
  // from fallback to font moves nothing more than it did before self-hosting.
  adjustFontFallback: false,
  fallback: ["Fraunces Fallback"],
});

/** Applied to <html> so every face is available as a CSS variable. */
export const zbmFontVariables = [
  fraunces.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
