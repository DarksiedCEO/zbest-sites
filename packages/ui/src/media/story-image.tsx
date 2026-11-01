import { MediaFrame } from "./media-frame";
import { HeroMedia } from "./hero-media";
import { asset as getAsset, type AssetId } from "./assets";

export type StoryAssetId = Extract<AssetId,
  | `rr-${string}` | `da-${string}` | `tv-${string}` | `radio-${string}`
  | `ooh-${string}` | `social-${string}` | `creative-${string}`
  | `influencer-${string}` | `web-${string}` | `home-${string}` | "about-workspace"
  | `zbc-step${string}` | `zbc-ent-${string}` | "zbc-brands-filming" | "zbc-clipper-paid"
>;

/** Original canvas and per-image badge are mandatory for all story scenes. */
export function StoryImage({ asset, hero = false }: { asset: StoryAssetId; hero?: boolean }) {
  const entry = getAsset(asset);
  if (!entry) return null;
  const timeline = asset.startsWith("zbc-step");
  const portrait = entry.height > entry.width;
  const Frame = hero ? HeroMedia : MediaFrame;
  return (
    <div data-story-image={asset} className={`w-full ${timeline ? "max-w-[416px]" : portrait ? "max-w-[25rem]" : "max-w-[52rem]"}`}>
      <Frame asset={asset} frame="plate" badge="full" priority={hero}
        sizes={timeline ? "(min-width: 1024px) 320px, (min-width: 480px) 416px, calc(100vw - 5rem)" : portrait ? "(min-width: 480px) 400px, calc(100vw - 2.5rem)" : "(min-width: 1440px) 800px, (min-width: 1024px) 58vw, calc(100vw - 2.5rem)"}
      />
    </div>
  );
}
