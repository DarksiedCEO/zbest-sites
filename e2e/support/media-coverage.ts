export type MediaRect = { top: number; bottom: number };

/** Complete aligned viewports plus the actual bottom scroll viewport.
 * A tiny remainder is not a viewport. Keep every complete aligned window,
 * then overlap the final one so the footer remains covered by the check.
 */
export function coverageBands(height: number, band: number, media: MediaRect[]) {
  const starts = [0];
  for (let top = band; top + band <= height; top += band) starts.push(top);
  starts.push(Math.max(0, height - band));
  return [...new Set(starts)].sort((a, b) => a - b).map((top) => {
    const bottom = Math.min(height, top + band);
    return { top, bottom, media: media.some((r) => Math.min(r.bottom, bottom) - Math.max(r.top, top) >= 24) };
  });
}

/** The overlapping tail adds a run only when text continues past the last
 * complete band. It cannot manufacture a third empty band without an actual
 * text stretch beyond two complete bands; a media-bearing tail resets it.
 */
export function uncoveredBands(bands: ReturnType<typeof coverageBands>, allowance: number) {
  let run = 0;
  return bands.filter((b) => {
    run = b.media ? 0 : run + 1;
    return run > allowance;
  });
}
