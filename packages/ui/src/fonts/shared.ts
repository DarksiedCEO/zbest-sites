/**
 * Faces used by both brands (Brief §A1, §B1).
 *
 * Self-hosted via next/font — the loader downloads and serves the files from
 * our own origin at build time, so there are no third-party font CDN calls at
 * runtime (Brief §1.1). next/font requires literal arguments at module scope,
 * so these cannot be generated from a config object.
 */
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/** Body copy on both sites. */
export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-sans",
});

/**
 * All numbers and stats on both sites — the deliberate sibling link between the
 * two brands. Ledger alignment needs font-variant-numeric: tabular-nums, which
 * tokens.css applies to the face rather than leaving it to call sites.
 */
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-mono",
});
