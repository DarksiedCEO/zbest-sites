import Image from "next/image";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { asset, type AssetId } from "./assets";
import { ConceptBadge } from "./concept-badge";

/**
 * Where the work runs (FD-VISUAL-01 §3.3): every asset sits inside a real-world
 * frame, never full-bleed, with a mono ledger caption under a hairline rule.
 *
 * Frames:
 *   billboard — an out-of-home scene, edged with print crop marks
 *   poster    — a print piece on a mat, edged with crop marks
 *   player    — a 16:9 screen with a transport bar and timecode
 *   phone     — a device; `chrome="feed"` adds a native post frame
 *   browser   — browser chrome with an address bar
 *   document  — a process document sheet
 *   plate     — hairline only, for an asset whose real-world frame is already
 *               in the picture (e.g. a site shot already in browser chrome)
 *
 * Concept assets get their ConceptBadge here, by construction: a page cannot
 * render a concept through MediaFrame without it. CI checks the rendered page
 * as well (e2e/tests/fd-visual-01-media.spec.ts).
 *
 * `wrapImage` lets a showpiece put the picture inside its own motion element;
 * it is only usable from a client component.
 */
export type FrameKind = "billboard" | "poster" | "player" | "phone" | "browser" | "document" | "plate";

export type MediaFrameProps = {
  asset: AssetId;
  frame: FrameKind;
  /** next/image `sizes` — required, so every image is requested at its rendered width. */
  sizes: string;
  priority?: boolean;
  /** Aspect of the image window, e.g. "4 / 5". Defaults to the asset's own. */
  aspect?: string;
  /** Crop focus; defaults to the manifest entry's `focus`. */
  objectPosition?: string;
  /** Caption override; `false` hides it (the asset must then be captioned nearby). */
  caption?: ReactNode | false;
  badge?: "full" | "compact";
  /** Phone only. */
  chrome?: "feed" | "clip";
  /** Phone `feed`/`clip` handle; browser address. */
  handle?: string;
  url?: string;
  /** Player only: the timecode shown in the transport bar. */
  timecode?: string;
  className?: string;
  wrapImage?: (image: ReactElement) => ReactNode;
  /** Extra layers drawn over the image, inside the window (masks, playheads). */
  overlay?: ReactNode;
};

const CROP_MARKS = (
  <>
    {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
      (pos) => (
        <span key={pos} aria-hidden="true" className={`absolute size-3 border-text-secondary/70 ${pos}`} />
      ),
    )}
  </>
);

export function MediaFrame({
  asset: id,
  frame,
  sizes,
  priority = false,
  aspect,
  objectPosition,
  caption,
  badge = "full",
  chrome,
  handle,
  url,
  timecode = "00:00:00:00",
  className = "",
  wrapImage,
  overlay,
}: MediaFrameProps) {
  const a = asset(id);
  const isConcept = a.class === "concept";

  const img = (
    <Image
      src={a.image}
      alt={a.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={80}
      className="object-cover"
      style={{ objectPosition: objectPosition ?? a.focus }}
    />
  );

  const windowStyle: CSSProperties = { aspectRatio: aspect ?? `${a.width} / ${a.height}` };
  const badgeEl = isConcept ? (
    <ConceptBadge compact={badge === "compact"} className="absolute left-3 top-3 z-10" />
  ) : null;

  const window = (extra = "") => (
    <div className={`relative overflow-hidden bg-base ${extra}`} style={windowStyle} data-frame-window>
      {wrapImage ? wrapImage(img) : img}
      {overlay}
      {badgeEl}
    </div>
  );

  let body: ReactNode;
  switch (frame) {
    case "billboard":
      body = (
        <div className="relative p-2 lg:p-3">
          {CROP_MARKS}
          {window("border border-text-primary/10")}
        </div>
      );
      break;
    case "poster":
      body = (
        <div className="relative bg-panel p-3 lg:p-4">
          {CROP_MARKS}
          {window()}
        </div>
      );
      break;
    case "player":
      body = (
        <div className="border border-text-primary/12 bg-black">
          {window()}
          <div aria-hidden="true" className="flex items-center gap-3 border-t border-text-primary/12 px-3 py-2">
            <span className="type-mono text-[0.7rem] text-text-primary">▶</span>
            <span className="relative h-px flex-1 bg-text-secondary/40">
              <span className="absolute inset-y-0 left-0 w-1/3 bg-accent" />
            </span>
            <span className="type-mono text-[0.7rem] text-text-secondary">{timecode}</span>
          </div>
        </div>
      );
      break;
    case "phone":
      body = (
        <div className="mx-auto w-full rounded-[2.25rem] border border-text-primary/15 bg-[#050608] p-2.5 shadow-none">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-base">
            <div aria-hidden="true" className="flex items-center justify-between px-5 pb-1 pt-2.5">
              <span className="type-mono text-[0.65rem] text-text-primary">9:41</span>
              <span className="h-4 w-16 rounded-full bg-black" />
              <span className="type-mono text-[0.65rem] text-text-primary">5G</span>
            </div>
            {chrome === "feed" ? (
              <div aria-hidden="true" className="flex items-center gap-2 px-3 py-2">
                <span className="size-6 rounded-full border border-accent/70 bg-panel" />
                <span className="type-small text-[0.75rem] font-medium text-text-primary">{handle}</span>
                <span className="ml-auto type-label text-[0.6rem] text-text-secondary">Sponsored</span>
              </div>
            ) : null}
            {window()}
            {chrome === "feed" ? (
              <div aria-hidden="true" className="flex items-center gap-4 px-3 py-2.5">
                {["M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z", "M4 5h16v11H8l-4 4z", "M4 12l16-8-6 16-2-6z"].map((d) => (
                  <svg key={d} viewBox="0 0 24 24" className="size-4 fill-none stroke-text-primary" strokeWidth="1.5">
                    <path d={d} />
                  </svg>
                ))}
              </div>
            ) : null}
            {chrome === "clip" && handle ? (
              <p aria-hidden="true" className="type-small absolute bottom-4 left-4 z-10 text-[0.75rem] font-medium text-text-primary">
                {handle}
              </p>
            ) : null}
          </div>
        </div>
      );
      break;
    case "browser":
      body = (
        <div className="overflow-hidden rounded-md border border-text-primary/12 bg-panel">
          <div aria-hidden="true" className="flex items-center gap-3 px-3 py-2">
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 rounded-full bg-text-secondary/50" />
              ))}
            </span>
            <span className="type-mono flex-1 truncate rounded-sm bg-base px-3 py-1 text-[0.7rem] text-text-secondary">
              {url ?? "example.com"}
            </span>
          </div>
          {window()}
        </div>
      );
      break;
    case "document":
      body = (
        <div className="border border-text-primary/12 bg-panel p-3">
          <div aria-hidden="true" className="type-label mb-2 flex justify-between text-text-secondary">
            <span>Document</span>
            <span>p. 1</span>
          </div>
          {window()}
        </div>
      );
      break;
    case "plate":
      body = window("border border-text-primary/10");
      break;
  }

  const captionText =
    caption === false ? null : (caption ?? `${a.caption} · ${isConcept ? "Concept" : a.class === "real" ? "Real work" : a.class}`);

  return (
    <figure
      data-media-frame={frame}
      data-asset-id={a.id}
      data-asset-class={a.class}
      className={`relative ${className}`}
    >
      {body}
      {captionText ? (
        <figcaption className="mt-3 border-t border-text-secondary/30 pt-2">
          <span className="type-mono block text-[0.7rem] leading-snug text-text-secondary">{captionText}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
