/// <reference types="next/image-types/global" />
import type { StaticImageData } from "next/image";
import manifest from "../../assets/manifest.json";
import ironholdBillboard from "../../assets/concepts/ironhold-billboard.png";
import ivosolaceStage from "../../assets/concepts/ivosolace-stage.png";
import marenvaleInfluencer from "../../assets/concepts/marenvale-influencer.png";
import marenvaleRoom from "../../assets/concepts/marenvale-room.png";
import marenvaleSocial from "../../assets/concepts/marenvale-social.png";
import marenvaleWebsite from "../../assets/concepts/marenvale-website.png";
import quellmontCover from "../../assets/concepts/quellmont-cover.png";
import quellmontFeedSticker from "../../assets/concepts/quellmont-feed-sticker.png";
import quellmontTvKeys from "../../assets/concepts/quellmont-tv-keys.png";
import saltgroveBrandSystem from "../../assets/concepts/saltgrove-brand-system.png";
import saltgroveRadio from "../../assets/concepts/saltgrove-radio.png";
import saltgroveTransit from "../../assets/concepts/saltgrove-transit.png";
import zbcClipperPhone from "../../assets/concepts/zbc-clipper-phone.png";

/**
 * The only door from a page to an image (FD-VISUAL-01 §3.2.4). Each file is a
 * static import, so next/image knows its intrinsic size and serves AVIF/WebP;
 * each entry is joined to its manifest record, so nothing renders without one.
 *
 * Adding an asset: put the file in packages/ui/assets/, add its manifest
 * entry, then add it here. scripts/check-media.mjs fails CI if the three drift.
 */
const FILES = {
  "ironhold-billboard": ironholdBillboard,
  "ivosolace-stage": ivosolaceStage,
  "marenvale-influencer": marenvaleInfluencer,
  "marenvale-room": marenvaleRoom,
  "marenvale-social": marenvaleSocial,
  "marenvale-website": marenvaleWebsite,
  "quellmont-cover": quellmontCover,
  "quellmont-feed-sticker": quellmontFeedSticker,
  "quellmont-tv-keys": quellmontTvKeys,
  "saltgrove-brand-system": saltgroveBrandSystem,
  "saltgrove-radio": saltgroveRadio,
  "saltgrove-transit": saltgroveTransit,
  "zbc-clipper-phone": zbcClipperPhone,
} satisfies Record<string, StaticImageData>;

export type AssetId = keyof typeof FILES;
export type AssetClass = "real" | "concept" | "process" | "portrait";

export type ManifestEntry = (typeof manifest.assets)[number] & { class: AssetClass };

export type Asset = ManifestEntry & { id: AssetId; image: StaticImageData };

const byId = new Map(manifest.assets.map((a) => [a.id, a as ManifestEntry]));

export function asset(id: AssetId): Asset {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Asset "${id}" has no manifest entry (packages/ui/assets/manifest.json)`);
  return { ...entry, id, image: FILES[id] };
}
