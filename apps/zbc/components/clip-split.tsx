"use client";

import { MediaFrame, Showpiece, useMediaQuery, useShowpieceLive } from "@zbest/ui";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * How It Works showpiece — "One source, dozens of clips" (FD-VISUAL-01 §5,
 * §10 launch item 3).
 *
 * A horizontal source plays in a player; as you scroll, cut lines draw down
 * through it and vertical clips drop out of it into a row, each reframed with
 * its own hook.
 *
 * Until the generated source video arrives, the Ivo Solace poster still stands
 * in as the source and every clip is a reframing of it (the founder's Oct 30
 * placement). When the video lands it replaces the still in the same frames.
 *
 * Desktop: pinned for 1.2 viewports. Mobile: unpinned; the clips drop in as
 * the row scrolls into view. Static frame: source above, all six clips set out.
 */
const CLIPS = [
  { hook: "Chorus first", focus: "50% 32%" },
  { hook: "Crowd POV", focus: "30% 80%" },
  { hook: "Lights cue", focus: "75% 30%" },
  { hook: "Mic close", focus: "62% 48%" },
  { hook: "Title card", focus: "50% 14%" },
  { hook: "Hands up", focus: "85% 68%" },
] as const;

/** 0 before `from`, 1 after `to`, linear between. */
function ramp(v: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (v - from) / (to - from)));
}

export function ClipSplit() {
  return (
    <Showpiece
      name="zbc-clip-split"
      label="One source, dozens of clips"
      className="relative mt-section lg:motion-safe:h-[220vh]"
    >
      <Stage />
    </Showpiece>
  );
}

function Stage() {
  const ref = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLOListElement>(null);
  const live = useShowpieceLive();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress: section } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: row } = useScroll({ target: rowRef, offset: ["start 0.95", "start 0.45"] });
  // Two drivers, chosen per render: a transform stays bound to the motion
  // value it was created with, so the choice is made after both exist.
  // Function transforms on purpose: Motion can hand a range-mapped opacity or
  // scale to the browser's native scroll timeline, and that mapping went wrong
  // here (clips faded back out at the end of the scroll). A function cannot be
  // handed off, so the value is computed from the scroll position every frame.
  const cutsDesktop = useTransform(section, (v) => ramp(v, 0, 0.3));
  const cutsMobile = useTransform(row, (v) => ramp(v, 0, 0.3));
  const cuts = desktop ? cutsDesktop : cutsMobile;

  return (
    <div ref={ref} className="h-full">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center">
        <div className="mx-auto w-full max-w-[90rem] px-gutter lg:px-gutter-wide lg:pt-20">
          <div className="grid gap-stack lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4 lg:self-center">
              <p className="type-label text-accent">One source → dozens of clips</p>
              <p className="type-body-lead mt-3 text-text-secondary">
                One long-form piece goes in. Our clippers cut it into distinct vertical clips — each
                with its own hook, pace and caption.
              </p>
            </div>
            <div className="lg:col-span-8">
              <MediaFrame
                asset="ivosolace-stage"
                frame="player"
                aspect="16 / 9"
                priority
                timecode="00:03:41:08"
                className="lg:max-w-[36rem]"
                sizes="(min-width: 1024px) 576px, calc(100vw - 3rem)"
                caption="Entertainment · source performance · long-form · Concept (poster still; source video in production)"
                overlay={
                  <div aria-hidden="true" className="absolute inset-0 z-[5] grid grid-cols-6">
                    {CLIPS.slice(1).map((c, i) => (
                      <motion.span
                        key={c.hook}
                        className="col-start-[var(--c)] h-full w-px origin-top bg-text-primary/70"
                        style={{ ["--c" as string]: i + 2, scaleY: live ? cuts : 1 }}
                      />
                    ))}
                  </div>
                }
              />
              <ol ref={rowRef} className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
                {CLIPS.map((clip, i) => (
                  <Clip key={clip.hook} index={i} clip={clip} drivers={[section, row]} desktop={desktop} live={live} />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clip({
  index,
  clip,
  drivers: [section, row],
  desktop,
  live,
}: {
  index: number;
  clip: (typeof CLIPS)[number];
  drivers: [MotionValue<number>, MotionValue<number>];
  desktop: boolean;
  live: boolean;
}) {
  const start = 0.25 + index * 0.08;
  const window: [number, number] = [start, start + 0.18];
  const opacityDesktop = useTransform(section, (v) => ramp(v, ...window));
  const yDesktop = useTransform(section, (v) => `${-24 * (1 - ramp(v, ...window))}%`);
  const opacityMobile = useTransform(row, (v) => ramp(v, ...window));
  const yMobile = useTransform(row, (v) => `${-24 * (1 - ramp(v, ...window))}%`);
  const opacity = desktop ? opacityDesktop : opacityMobile;
  const y = desktop ? yDesktop : yMobile;

  return (
    <motion.li data-enter style={live ? { opacity, y } : undefined}>
      <MediaFrame
        asset="ivosolace-stage"
        frame="plate"
        aspect="9 / 16"
        sizes="(min-width: 1024px) 260px, 60vw"
        // Each clip reframes the source: a fixed push-in toward its own hook.
        wrapImage={(img) => (
          <div className="absolute inset-0" style={{ transform: "scale(1.8)", transformOrigin: clip.focus }}>
            {img}
          </div>
        )}
        caption={false}
        badge="compact"
        className="[&_[data-concept-badge]]:left-1.5 [&_[data-concept-badge]]:top-1.5 [&_[data-frame-window]]:rounded-md"
        overlay={
          <p className="type-mono absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/85 to-transparent px-2 pb-2 pt-6 text-[0.65rem] leading-tight text-text-primary">
            <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> {clip.hook}
          </p>
        }
      />
    </motion.li>
  );
}
