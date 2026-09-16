/**
 * Z Best Media typefaces (Brief §A1): Fraunces headlines, IBM Plex Sans body,
 * IBM Plex Mono numbers.
 *
 * Kept in its own module so the ZBM bundle never self-hosts Bricolage
 * Grotesque, which only Z Best Clips uses.
 */
import { Fraunces } from "next/font/google";
import { ibmPlexMono, ibmPlexSans } from "./shared";

export { ibmPlexMono, ibmPlexSans };

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

/** Applied to <html> so every face is available as a CSS variable. */
export const zbmFontVariables = [
  fraunces.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
