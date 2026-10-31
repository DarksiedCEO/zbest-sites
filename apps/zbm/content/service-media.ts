import type { AssetId, MediaFrameProps } from "@zbest/ui";

/**
 * Each service's lead image (FD-VISUAL-01 §3.1 concept work). The placements
 * are the founder-approved ones in the manifest's `plannedPages`
 * (packages/ui/assets/manifest.json). Home's service rows preview them;
 * Revenue Recovery has none (its §10 visual is code-drawn, not an image).
 */
export const SERVICE_IMAGE: Record<string, AssetId> = {
  "digital-advertising": "quellmont-feed-sticker",
  "tv-streaming": "quellmont-tv-keys",
  "radio-audio": "saltgrove-radio",
  "out-of-home": "ironhold-billboard",
  "social-media": "marenvale-social",
  "creative-production": "saltgrove-brand-system",
  "influencer-marketing": "marenvale-influencer",
  "z-best-clips": "zbc-clipper-phone",
  websites: "marenvale-website",
};

/**
 * The hero image on each catalog-rendered service page (FD-VISUAL-01 §10:
 * every page carries real visual material), in the frame where that work runs
 * (§3.3). A slug is listed here once its rollout batch lands; until then its
 * page renders as before.
 */
export type ServiceHero = Pick<MediaFrameProps, "asset" | "frame" | "chrome" | "sponsored" | "handle" | "timecode" | "url"> & {
  /** Narrow frames (phones) are capped so they don't tower over the claim. */
  narrow?: boolean;
};

export const SERVICE_HERO: Partial<Record<string, ServiceHero>> = {
  "tv-streaming": { asset: "quellmont-tv-keys", frame: "player", timecode: "00:00:14:00" },
  "radio-audio": { asset: "saltgrove-radio", frame: "plate" },
  "social-media": { asset: "marenvale-social", frame: "phone", chrome: "feed", sponsored: false, handle: "marenvale.aesthetics", narrow: true },
};
