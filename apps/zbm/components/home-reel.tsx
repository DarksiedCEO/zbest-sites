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
 * work across channels assembles beside it: billboard, TV, digital, site,
 * social. Each tile after the first unmasks along a brass hairline. The page
 * then scrolls on into the service list, which previews each service's image.
 *
 * Desktop: the hero is pinned for 1.3 viewports (≤ 1.5, §4.2) and the whole
 * sequence is driven by that scroll. Mobile: nothing is pinned; each tile
 * unmasks as it scrolls into view.
 *
 * Static frame (reduced motion, no JS, server HTML): every tile shown, no pin.
 * Built from stills; the audit-page tile §5 names waits for the Revenue
 * Recovery process visual (post-launch, §10).
 */
type Tile = {
  asset: AssetId;
  frame: FrameKind;
  channel: string;
  brand: string;
  aspect?: string;
  /** Desktop width in the bottom row, as a share of the reel. */
  lg?: string;
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
  { asset: "quellmont-tv-keys", frame: "player", channel: "TV & Streaming", brand: "Quellmont Motors", lg: "lg:w-[31.6%]", at: [0.08, 0.3] },
  { asset: "marenvale-website", frame: "plate", channel: "Websites", brand: "Maren Vale Aesthetics", lg: "lg:w-[31.6%]", at: [0.22, 0.44] },
  { asset: "quellmont-feed-sticker", frame: "plate", channel: "Digital", brand: "Quellmont Motors", lg: "lg:w-[17.8%]", at: [0.36, 0.58] },
  { asset: "marenvale-social", frame: "plate", channel: "Social", brand: "Maren Vale Aesthetics", aspect: "4 / 5", lg: "lg:w-[14.2%]", at: [0.5, 0.72] },
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
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center">
        <div className="mx-auto w-full max-w-[90rem] px-gutter pt-section lg:px-gutter-wide lg:pb-8 lg:pt-24">
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
                <li>· Concept work for invented sample brands — not client campaigns</li>
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
  const { scrollYProgress: own } = useScroll({ target: ref, offset: ["start 0.95", "start 0.55"] });
  const [a, b] = tile.at;
  const fromSection = useTransform(section, (v) => `${101 * Math.min(1, Math.max(0, (v - a) / (b - a)))}%`);
  const fromOwn = useTransform(own, (v) => `${101 * Math.min(1, Math.max(0, v))}%`);
  const x = desktop ? fromSection : fromOwn;

  return (
    <div ref={ref} className={tile.lg}>
      <MediaFrame
        asset={tile.asset}
        frame={tile.frame}
        aspect={tile.aspect ?? "16 / 9"}
        sizes="(min-width: 1024px) 240px, 45vw"
        caption={false}
        badge="compact"
        timecode="00:00:14:22"
        className="[&_[data-concept-badge]]:left-1.5 [&_[data-concept-badge]]:top-1.5"
        overlay={
          // The cover slides off to the right, its leading edge a brass rule.
          <motion.div
            aria-hidden="true"
            data-unmask
            className="absolute inset-0 z-20 border-l border-accent bg-panel"
            style={live ? { x } : undefined}
          />
        }
      />
    </div>
  );
}
