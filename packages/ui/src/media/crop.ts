/**
 * Crops that never cut a word (founder ruling, 2026-10-30 rollout brief):
 * wherever a frame crops an image, each block of the creative's own type is
 * either fully inside the frame or fully outside it.
 *
 * Each manifest entry lists its text blocks (`text`), as boxes in 0–1 image
 * coordinates. A frame with `object-fit: cover` crops along one axis only, so
 * the visible band on that axis is [p·(1−f), p·(1−f)+f], where f is the share
 * of the image that fits and p is the object-position on that axis. We try p
 * from 0 to 1 and keep the one closest to the entry's `focus` for which every
 * block is whole or gone, and every `keep` block (e.g. an "#ad" disclosure) is
 * whole. No such p means the frame shape cannot work for this image; MediaFrame
 * then throws, so the build fails instead of shipping a cut word.
 *
 * `zoom` is the largest push-in a showpiece applies about the window's centre;
 * the band then shrinks to the middle 1/zoom of itself, and blocks must be
 * whole or out at both ends of the push.
 *
 * The rendered half of this check is e2e/tests/fd-visual-01-media.spec.ts,
 * which measures every frame on every page as the browser actually drew it.
 */

export type TextBlock = {
  label: string;
  /** [x0, y0, x1, y1], 0–1 of the image's width and height. */
  box: readonly number[];
  /** Must stay whole and visible in every crop (a disclosure tag). */
  keep?: boolean;
};

export type Croppable = {
  id: string;
  width: number;
  height: number;
  focus: string;
  text?: readonly TextBlock[];
};

/** Safety margin around each block, as a share of the image (the boxes are already drawn loose). */
const PAD = 0.005;
const STEPS = 400;

/** "16 / 9" → 1.777…; also accepts "1.5" or "16/9". */
export function parseAspect(aspect: string): number {
  const [w, h] = aspect.split("/").map((s) => Number(s.trim()));
  const ratio = h === undefined ? w : (w ?? NaN) / h;
  if (!ratio || !Number.isFinite(ratio) || ratio <= 0) throw new Error(`Bad aspect "${aspect}"`);
  return ratio;
}

function parseFocus(focus: string): [number, number] {
  const [x, y] = focus.split(/\s+/).map((v) => Number(v.replace("%", "")) / 100);
  return [x ?? 0.5, y ?? 0.5];
}

const pct = (v: number) => `${Math.round(v * 1000) / 10}%`;

/**
 * The object-position for `image` in a window of `aspect`, or null when no
 * position keeps every text block whole or out.
 */
export function cropPosition(image: Croppable, aspect: string, zoom = 1): string | null {
  const imageRatio = image.width / image.height;
  const frameRatio = parseAspect(aspect);
  const [fx, fy] = parseFocus(image.focus);
  // Within 0.2%: the frame is the image's own shape, nothing is cropped.
  const uncropped = Math.abs(imageRatio / frameRatio - 1) < 0.002;
  if (uncropped && zoom === 1) return `${pct(fx)} ${pct(fy)}`;

  const horizontal = uncropped ? true : imageRatio > frameRatio;
  const share = uncropped ? 1 : horizontal ? frameRatio / imageRatio : imageRatio / frameRatio;
  const preferred = horizontal ? fx : fy;
  const along = (t: TextBlock, x: boolean) => ({
    start: (x ? t.box[0]! : t.box[1]!) - PAD,
    end: (x ? t.box[2]! : t.box[3]!) + PAD,
    keep: Boolean(t.keep),
  });
  const text = image.text ?? [];
  const blocks = text.map((t) => along(t, horizontal));
  const fits = (band: { start: number; end: number; keep: boolean }[], from: number, to: number) =>
    band.every(({ start, end, keep }) => {
      const inside = start >= from && end <= to;
      const outside = end <= from || start >= to;
      return keep ? inside : inside || outside;
    });
  // A push-in also shrinks the other axis, about its centre, whatever p is.
  const otherHalf = 0.5 / zoom;
  if (!fits(text.map((t) => along(t, !horizontal)), 0.5 - otherHalf, 0.5 + otherHalf)) return null;

  let best: number | null = null;
  for (let i = 0; i <= STEPS; i++) {
    const p = i / STEPS;
    const lo = p * (1 - share);
    const hi = lo + share;
    const mid = (lo + hi) / 2;
    const half = share / 2 / zoom;
    // At rest and fully pushed in.
    const ok = fits(blocks, lo, hi) && fits(blocks, mid - half, mid + half);
    if (ok && (best === null || Math.abs(p - preferred) < Math.abs(best - preferred))) best = p;
  }
  if (best === null) return null;
  return horizontal ? `${pct(best)} ${pct(fy)}` : `${pct(fx)} ${pct(best)}`;
}

/** True when `image` can be shown at `aspect` without cutting a word. */
export function cropFits(image: Croppable, aspect: string, zoom = 1): boolean {
  return cropPosition(image, aspect, zoom) !== null;
}
