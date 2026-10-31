"use client";

import { MediaFrame, Showpiece, useMediaQuery, useShowpieceLive } from "@zbest/ui";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Out-of-Home showpiece — "Can't scroll past" (FD-VISUAL-01 §5, §10 launch
 * item 2). A concept billboard in a street scene scales toward the viewer as
 * you scroll, literalizing the page's headline.
 *
 * The scene stays inside its frame — never full-bleed — and the zoom happens
 * within the frame's window, toward the board. The board sits at about 37% ×
 * 33% of the source still, so that is the transform origin on desktop. The source is
 * ~1,670px wide, so the zoom is capped where it still holds up.
 *
 * Pinned for under one viewport (≤ 1.5, §4.2). Static frame: the whole
 * scene at rest, no pin.
 */
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
  const scaleDesktop = useTransform(scrollYProgress, (v) => 1 + 0.5 * Math.min(1, v / 0.85));
  const scaleMobile = useTransform(scrollYProgress, (v) => 1 + 0.15 * Math.min(1, v / 0.85));
  const scale = desktop ? scaleDesktop : scaleMobile;

  return (
    <div ref={ref} className="h-full">
      <div className="motion-safe:sticky motion-safe:top-0 motion-safe:flex motion-safe:h-screen motion-safe:items-center">
        <div className="mx-auto w-full max-w-[90rem] px-gutter pt-16 lg:px-gutter-wide">
          <MediaFrame
            asset="ironhold-billboard"
            frame="billboard"
            aspect="16 / 9"
            // At 390 the window is square, aimed at the board (it spans ~9–65% of
            // the still's width); the image then renders ~1.8× the window width.
            className="mx-auto max-w-[72rem] [&_[data-frame-window]]:max-lg:aspect-square!"
            objectPosition={desktop ? undefined : "21% 50%"}
            sizes="(min-width: 1280px) 1152px, (min-width: 1024px) calc(100vw - 8rem), 180vw"
            wrapImage={(img) =>
              live ? (
                <motion.div
                  className="absolute inset-0"
                  style={{ scale, transformOrigin: desktop ? "37% 33%" : "50% 38%" }}
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
