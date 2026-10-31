"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { MediaFrame, type MediaFrameProps } from "./media-frame";
import { useMotionAllowed } from "./showpiece";

/**
 * A page hero's image, scroll-driven (FD-VISUAL-01 §4.2 "Scroll-driven hero").
 *
 * The frame is in place and fully visible from the first paint; as the hero
 * scrolls away the frame drifts up a little faster than the page, on native
 * scroll (no hijacking, no pin). Transform only (§4.5), and it moves the whole
 * frame, never the picture inside it, so the crop — and with it the rule that
 * no word is ever cut — is the same at every point of the scroll.
 *
 * Reduced motion, server HTML and no-JS: the same frame, still.
 */
const DRIFT_PX = 56;

export function HeroMedia({ className = "", ...frame }: MediaFrameProps) {
  return (
    <ScrollDrift className={className} data-hero-media>
      <MediaFrame priority {...frame} />
    </ScrollDrift>
  );
}

/**
 * The drift itself, for any hero visual — an image (HeroMedia) or a drawing
 * built in code (the Revenue Recovery leak ledger).
 */
export function ScrollDrift({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & Record<`data-${string}`, unknown>) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useMotionAllowed();
  // 0 until the element's top reaches the top of the viewport, so the first
  // paint matches the static frame exactly; then it drifts as it leaves.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, (v) => -DRIFT_PX * v);

  return (
    <div ref={ref} className={className} data-scroll-drift {...rest}>
      <motion.div style={live ? { y } : undefined}>{children}</motion.div>
    </div>
  );
}
