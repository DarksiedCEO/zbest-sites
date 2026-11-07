/**
 * The ZBM homepage's display face (founder direction 2026-11-07: the homepage
 * takes the "Audit + Line" concept; other pages keep Fraunces until the founder
 * has seen it live). Its own module so no other route self-hosts or preloads it.
 */
import { Big_Shoulders } from "next/font/google";

export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-big-shoulders",
});
