"use client";

import {
  MediaFrame,
  Showpiece,
  useMediaQuery,
  useShowpieceLive,
  type AssetId,
  type FrameKind,
} from "@zbest/ui";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * ZBM Home showpiece — "The reel" (FD-VISUAL-01 §5, §10 launch item 1).
 *
 * The hero headline holds while, on scroll, a strict-grid sequence of concept
 * work across channels plays beside it: billboard, TV, site, digital, social.
 * Every tile shows its image from the first paint (founder pilot review,
 * 2026-10-30: no empty frames); the motion is layered on top — a brass
 * hairline sweeps across each tile in turn as its image pushes in slightly.
 * The page then scrolls on into the service list, which previews each
 * service's image.
 *
 * Desktop: the hero is pinned for 1.3 viewports (≤ 1.5, §4.2) and the whole
 * sequence is driven by that scroll. Mobile: nothing is pinned; each tile
 * unmasks as it scrolls into view.
 *
 * Static frame (reduced motion, no JS, server HTML): the same tiles, no sweep,
 * no pin. The live first frame matches it exactly, so hydration changes nothing.
 *
 * Mobile: tiles in a row share one aspect — 16:9 for TV and site, square for
 * digital and social — cropped so each block of type is whole or out
 * (packages/ui/src/media/crop.ts).
 * Built from stills; the audit-page tile §5 names waits for the Revenue
 * Recovery process visual (post-launch, §10).
 */
type Tile = {
  asset: AssetId;
  frame: FrameKind;
  channel: string;
  brand: string;
  aspect?: string;
  /** Window aspect below 1024px (tiles in one mobile row share an aspect). */
  mobileAspect?: string;
  /** Desktop width in the bottom row, as a share of the reel. */
  lg?: string;
  /** Small channel marker drawn in a corner of the image that carries no type. */
  marker?: string;
  /** Scroll window (desktop section progress) over which the tile unmasks. */
  at: [number, number];
};

const LEAD: Tile = {
  asset: "ironhold-billboard",
  frame: "billboard",
  channel: "Out-of-Home",
  brand: "Ironhold Injury Law",
  at: [0, 0],
};

const ROW: Tile[] = [
  { asset: "quellmont-tv-keys", frame: "plate", channel: "TV & Streaming", brand: "Quellmont Motors", lg: "lg:w-[31.6%]", marker: "▶ TV · 00:14", at: [0.08, 0.3] },
  { asset: "marenvale-website", frame: "plate", channel: "Websites", brand: "Maren Vale Aesthetics", lg: "lg:w-[31.6%]", at: [0.22, 0.44] },
  { asset: "quellmont-feed-sticker", frame: "plate", channel: "Digital", brand: "Quellmont Motors", aspect: "1 / 1", lg: "lg:w-[17.8%]", at: [0.36, 0.58] },
  { asset: "marenvale-social", frame: "plate", channel: "Social", brand: "Maren Vale Aesthetics", aspect: "4 / 5", mobileAspect: "1 / 1", lg: "lg:w-[14.2%]", at: [0.5, 0.72] },
];

export function HomeReel({ hero }: { hero: ReactNode }) {
  return (
    <Showpiece
      name="zbm-home-reel"
      label="The reel: concept work across channels"
      className="relative lg:motion-safe:h-[230vh]"
    >
      <Stage hero={hero} />
    </Showpiece>
  );
}

function Stage({ hero }: { hero: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const desktop = useMediaQuery("(min-width: 1024px)");
  const live = useShowpieceLive();
  // The lead billboard eases in toward the viewer across the first third.
  // Function transforms throughout, so Motion computes them per frame rather
  // than handing them to the browser's scroll timeline (see clip-split.tsx).
  const leadScale = useTransform(scrollYProgress, (v) => 1 + 0.06 * Math.min(1, v / 0.5));

  return (
    <div ref={ref} className="h-full">
      {/* Top-aligned under the nav, so the whole reel and its legend fit a 900px-tall viewport. */}
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-screen">
        <div className="mx-auto w-full max-w-[90rem] px-gutter pt-section lg:px-gutter-wide lg:pb-6 lg:pt-20">
          <div className="grid gap-stack lg:grid-cols-12 lg:items-center lg:gap-x-10">
            <div className="lg:col-span-5">{hero}</div>
            <div className="lg:col-span-7" data-reel>
              <MediaFrame
                asset={LEAD.asset}
                frame={LEAD.frame}
                aspect="16 / 9"
                priority
                sizes="(min-width: 1440px) 760px, (min-width: 1024px) 54vw, calc(100vw - 3rem)"
                caption={false}
                wrapImage={(img) =>
                  live && desktop ? (
                    <motion.div className="absolute inset-0" style={{ scale: leadScale }}>
                      {img}
                    </motion.div>
                  ) : (
                    img
                  )
                }
              />
              <div className="mt-3 grid grid-cols-2 items-start gap-3 lg:mt-[1.6%] lg:flex lg:gap-[1.6%]">
                {ROW.map((tile) => (
                  <ReelTile key={tile.asset} tile={tile} section={scrollYProgress} desktop={desktop} live={live} />
                ))}
              </div>
              <ol className="type-mono mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-text-secondary/30 pt-2 text-[0.7rem] leading-snug text-text-secondary">
                {[LEAD, ...ROW].map((t, i) => (
                  <li key={t.asset}>
                    <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {t.channel} · {t.brand}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReelTile({
  tile,
  section,
  desktop,
  live,
}: {
  tile: Tile;
  section: MotionValue<number>;
  desktop: boolean;
  live: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: own } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const [a, b] = tile.at;
  // 0 → 1 across the tile's scroll window. Function transforms, so Motion
  // computes them per frame rather than handing them to the browser's scroll
  // timeline (see apps/zbc/components/clip-split.tsx).
  const tSection = useTransform(section, (v) => Math.min(1, Math.max(0, (v - a) / (b - a))));
  const tOwn = useTransform(own, (v) => Math.min(1, Math.max(0, v)));
  const t = desktop ? tSection : tOwn;
  // The sweep: a brass hairline crossing the tile, gone at both ends.
  const sweepX = useTransform(t, (v) => `${v * 100}%`);
  const sweepOpacity = useTransform(t, (v) => (v > 0 && v < 1 ? 1 : 0));
  const push = useTransform(t, (v) => 1 + 0.04 * v);

  return (
    <div ref={ref} className={tile.lg}>
      <MediaFrame
        asset={tile.asset}
        frame={tile.frame}
        aspect={tile.aspect ?? "16 / 9"}
        mobileAspect={tile.mobileAspect}
        // The push-in below (1.04 about the centre); crops allow for it.
        zoom={1.04}
        loading="eager"
        sizes="(min-width: 1024px) 240px, 45vw"
        caption={false}
        badge="compact"
        wrapImage={(img) =>
          live ? (
            <motion.div className="absolute inset-0" style={{ scale: push }}>
              {img}
            </motion.div>
          ) : (
            img
          )
        }
        overlay={
          <>
            {tile.marker ? (
              <span
                aria-hidden="true"
                className="type-mono absolute right-1.5 top-1.5 z-10 bg-black/70 px-1.5 py-0.5 text-[0.6rem] text-text-primary"
              >
                {tile.marker}
              </span>
            ) : null}
            {live ? (
              // A full-width layer carries the line, so x is a share of the tile.
              <motion.span
                aria-hidden="true"
                data-sweep
                className="pointer-events-none absolute inset-0 z-10"
                style={{ x: sweepX, opacity: sweepOpacity }}
              >
                <span className="absolute inset-y-0 left-0 w-px bg-accent" />
              </motion.span>
            ) : null}
          </>
        }
      />
    </div>
  );
}
