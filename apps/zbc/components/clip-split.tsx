"use client";

import { ConceptGroup, MediaFrame, Showpiece, useMediaQuery, useShowpieceLive } from "@zbest/ui";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * How It Works showpiece — "One source, dozens of clips" (FD-VISUAL-01 §5,
 * §10 launch item 3).
 *
 * A horizontal source plays in a player; as you scroll, cut lines draw down
 * through it and the vertical clips cut from it play in turn — each clip's
 * playback bar fills as its image pushes in. Every clip shows its image from
 * the first paint; the motion is layered on top (founder pilot review,
 * 2026-10-30: no empty frames).
 *
 * Until the generated source video arrives, the Ivo Solace poster still stands
 * in as the source and every clip is a reframing of it (the founder's Oct 30
 * placement). When the video lands it replaces the still in the same frames.
 *
 * Desktop: pinned for 1.2 viewports. Mobile: unpinned; the clips play as the
 * row scrolls into view. Static frame: source above, all six clips set out.
 *
 * The six clips are crops of one badged source, so they share one label —
 * "Concept — 6 clips cut from one source" — and carry no badge each
 * (amendment §3.2.5 as amended 2026-10-30).
 *
 * Crops: each clip pushes in on the 9:16 still by `scale` about origin (x, y).
 * A point p of the still stays visible while o − o/s ≤ p ≤ o + (1 − o)/s, so
 * the visible band of the still is [y − y/s, y + (1 − y)/s]. The "Ivo Solace"
 * handwriting ends at ~27% of the still's height and "new single" begins at
 * ~92%, so every band must sit inside [0.28, 0.90]: no partial letters. That
 * is checked below, at module load, so a bad crop fails the build.
 */
const SAFE_BAND: [number, number] = [0.28, 0.9];
const CLIPS = [
  { hook: "Chorus first", x: 0.5, y: 0.65, scale: 1.8 },
  { hook: "Crowd POV", x: 0.3, y: 0.75, scale: 2.0 },
  { hook: "Lights cue", x: 0.82, y: 0.66, scale: 1.8 },
  { hook: "Mic close", x: 0.62, y: 0.5, scale: 2.6 },
  { hook: "Stage wide", x: 0.5, y: 0.68, scale: 1.8 },
  { hook: "Hands up", x: 0.85, y: 0.72, scale: 2.0 },
] as const;

for (const c of CLIPS) {
  const top = c.y - c.y / c.scale;
  const bottom = c.y + (1 - c.y) / c.scale;
  if (top < SAFE_BAND[0] || bottom > SAFE_BAND[1]) {
    throw new Error(`Clip "${c.hook}" shows ${top.toFixed(3)}–${bottom.toFixed(3)} of the still; it must stay within ${SAFE_BAND.join("–")} (clear of the handwriting and "new single").`);
  }
}

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
                // The 16:9 window shows ~32% of the still's height; at 45% it
                // spans ~31–63%, clear of the handwriting above.
                objectPosition="50% 45%"
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
              <ConceptGroup source="ivosolace-stage" count={CLIPS.length} className="mt-5">
                <ol ref={rowRef} className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
                  {CLIPS.map((clip, i) => (
                    <Clip key={clip.hook} index={i} clip={clip} drivers={[section, row]} desktop={desktop} live={live} />
                  ))}
                </ol>
              </ConceptGroup>
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
  const tDesktop = useTransform(section, (v) => ramp(v, ...window));
  const tMobile = useTransform(row, (v) => ramp(v, ...window));
  const t = desktop ? tDesktop : tMobile;
  // Playback bar and a slight extra push-in: both start where the static frame
  // is (empty bar, base crop), so the live first frame matches it exactly.
  const bar = useTransform(t, (v) => v);
  const push = useTransform(t, (v) => clip.scale * (1 + 0.05 * v));
  const origin = `${clip.x * 100}% ${clip.y * 100}%`;

  return (
    <li>
      <MediaFrame
        asset="ivosolace-stage"
        frame="plate"
        aspect="9 / 16"
        loading="eager"
        sizes="(min-width: 1024px) 260px, 60vw"
        caption={false}
        badge="group"
        className="[&_[data-frame-window]]:rounded-md"
        // Each clip reframes the source: a push-in toward its own hook.
        wrapImage={(img) =>
          live ? (
            <motion.div className="absolute inset-0" style={{ scale: push, transformOrigin: origin }}>
              {img}
            </motion.div>
          ) : (
            <div className="absolute inset-0" style={{ transform: `scale(${clip.scale})`, transformOrigin: origin }}>
              {img}
            </div>
          )
        }
        overlay={
          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/85 to-transparent px-2 pb-2 pt-6">
            <p className="type-mono text-[0.65rem] leading-tight text-text-primary">
              <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> {clip.hook}
            </p>
            <span aria-hidden="true" className="relative mt-1.5 block h-px bg-text-primary/25">
              {live ? (
                <motion.span data-playbar className="absolute inset-0 origin-left bg-accent" style={{ scaleX: bar }} />
              ) : null}
            </span>
          </div>
        }
      />
    </li>
  );
}
