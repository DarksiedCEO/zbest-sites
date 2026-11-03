"use client";

import { asset, cropPosition, MediaFrame, Showpiece, useMediaQuery, useShowpieceLive } from "@zbest/ui";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Out-of-Home showpiece — "Can't scroll past" (FD-VISUAL-01 §5, §10 launch
 * item 2). A concept billboard in a street scene scales toward the viewer as
 * you scroll, literalizing the page's headline.
 *
 * The scene stays inside its frame — never full-bleed — and the zoom happens
 * within the frame's window, toward the board. The board sits at about 34% ×
 * 33% of the source still, so that is the transform origin on desktop. The source is
 * ~1,670px wide, so the zoom is capped where it still holds up.
 *
 * Pinned for under one viewport (≤ 1.5, §4.2). Static frame: the whole
 * scene at rest, no pin.
 */
/**
 * The push-in, and the point it heads for (as a share of the window). At full
 * push the window shows [o − o/s, o + (1 − o)/s] of itself on each axis; the
 * check below maps that back onto the still and fails the build if any block
 * of the board's type would be cut at either end of the push (rollout brief,
 * 2026-10-30: no partial words).
 */
const SCALE_DESKTOP = 1.5;
const SCALE_MOBILE = 1.15;
const ORIGIN_DESKTOP = "34% 33%";
const ORIGIN_MOBILE = "30% 38%";

function checkPush(aspect: string, scale: number, origin: string) {
  const a = asset("ironhold-billboard");
  const position = cropPosition(a, aspect);
  if (!position) throw new Error(`Billboard: no crop at ${aspect} keeps its type whole`);
  const [px, py] = position.split(" ").map((v) => Number.parseFloat(v) / 100) as [number, number];
  const [ox, oy] = origin.split(" ").map((v) => Number.parseFloat(v) / 100) as [number, number];
  const imageRatio = a.width / a.height;
  const [w, h] = aspect.split("/").map(Number) as [number, number];
  const frameRatio = w / h;
  // Share of the still the window shows on each axis, and where it starts.
  const sx = Math.min(1, frameRatio / imageRatio);
  const sy = Math.min(1, imageRatio / frameRatio);
  const x0 = px * (1 - sx);
  const y0 = py * (1 - sy);
  const band = (o: number, start: number, share: number) =>
    [start + share * (o - o / scale), start + share * (o + (1 - o) / scale)] as const;
  const [vx0, vx1] = band(ox, x0, sx);
  const [vy0, vy1] = band(oy, y0, sy);
  for (const t of a.text) {
    const [bx0, by0, bx1, by1] = t.box as [number, number, number, number];
    const inside = bx0 >= vx0 && bx1 <= vx1 && by0 >= vy0 && by1 <= vy1;
    const outside = bx1 <= vx0 || bx0 >= vx1 || by1 <= vy0 || by0 >= vy1;
    if (!inside && !outside) {
      throw new Error(`Billboard at ${aspect}, pushed to ${scale}× toward ${origin}, cuts "${t.label}"`);
    }
  }
}
checkPush("16 / 9", SCALE_DESKTOP, ORIGIN_DESKTOP);
checkPush("4 / 3", SCALE_MOBILE, ORIGIN_MOBILE);

export function BillboardShowpiece() {
  return (
    <Showpiece
      name="zbm-ooh-billboard"
      label="Can’t scroll past: a concept billboard that scales toward you"
      className="relative mt-stack motion-safe:h-[170vh] lg:motion-safe:h-[190vh]"
    >
      <Stage />
    </Showpiece>
  );
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const live = useShowpieceLive();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const desktop = useMediaQuery("(min-width: 1024px)");
  // Both built, one chosen: a transform keeps what it was created with. Function
  // transforms, so Motion computes them per frame rather than handing them to
  // the browser's scroll timeline (see apps/zbc/components/clip-split.tsx).
  const scaleDesktop = useTransform(scrollYProgress, (v) => 1 + (SCALE_DESKTOP - 1) * Math.min(1, v / 0.85));
  const scaleMobile = useTransform(scrollYProgress, (v) => 1 + (SCALE_MOBILE - 1) * Math.min(1, v / 0.85));
  const scale = desktop ? scaleDesktop : scaleMobile;

  return (
    <div ref={ref} className="h-full">
      <div className="motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-screen motion-safe:items-center">
        <div className="mx-auto w-full max-w-[90rem] px-gutter pt-16 lg:px-gutter-wide">
          <MediaFrame
            asset="ironhold-billboard"
            frame="billboard"
            aspect="16 / 9"
            // Below 1024px the window is 4:3, aimed at the board by the crop
            // solver. Square was too narrow: once pushed in, it cut the
            // headline (rollout brief: no partial words).
            mobileAspect="4 / 3"
            className="mx-auto max-w-[72rem]"
            sizes="(min-width: 1280px) 1152px, (min-width: 1024px) calc(100vw - 8rem), 180vw"
            wrapImage={(img) =>
              live ? (
                <motion.div
                  className="absolute inset-0"
                  style={{ scale, transformOrigin: desktop ? ORIGIN_DESKTOP : ORIGIN_MOBILE }}
                >
                  {img}
                </motion.div>
              ) : (
                img
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
