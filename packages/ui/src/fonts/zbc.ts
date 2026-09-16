/**
 * Z Best Clips typefaces (Brief §B1): Bricolage Grotesque headlines — kinetic,
 * distinctive — IBM Plex Sans body, IBM Plex Mono view-counts and stats.
 *
 * Kept in its own module so the ZBC bundle never self-hosts Fraunces, which
 * only Z Best Media uses.
 */
import { Bricolage_Grotesque } from "next/font/google";
import { ibmPlexMono, ibmPlexSans } from "./shared";

export { ibmPlexMono, ibmPlexSans };

/**
 * Founder decision at Phase 1 close: wght 700-800, opsz 96, wdth 100.
 *
 * next/font requests only `wght` unless told otherwise, which is why this
 * rendered as a plain grotesque through Phase 1. `opsz` at 96 is what gives
 * Bricolage the display-size character §B1 asks for; without it the face has no
 * more personality than system-ui at a headline size.
 */
export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  // next/font rejects an explicit `weight` alongside `axes` — axes require the
  // wght axis to stay variable. The 700-800 band is applied by the type scale
  // (packages/ui/src/styles/type.css) rather than baked in here.
  axes: ["opsz", "wdth"],
});

/** Applied to <html> so every face is available as a CSS variable. */
export const zbcFontVariables = [
  bricolageGrotesque.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
