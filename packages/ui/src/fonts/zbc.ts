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

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

/** Applied to <html> so every face is available as a CSS variable. */
export const zbcFontVariables = [
  bricolageGrotesque.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
