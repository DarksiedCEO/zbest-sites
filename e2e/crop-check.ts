import type { Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * No partial words (rollout brief, 2026-10-30): in every frame, each block of
 * the creative's own type is either fully visible or fully cropped out, and a
 * `keep` block (a disclosure) is fully visible.
 *
 * Measured as drawn: for each image in a frame window, the image's box (with
 * any showpiece transform applied), its object-fit: cover scale and its
 * computed object-position give where the whole still sits on screen; the
 * window clips it. That visible part, mapped back to 0–1 image coordinates, is
 * checked against the manifest's `text` boxes. Read from disk, not from the
 * app, so the check cannot agree with an app that drifted.
 *
 * The build-time half is packages/ui/src/media/crop.ts.
 */

type Block = { label: string; box: [number, number, number, number]; keep?: boolean };
type Entry = { id: string; width: number; height: number; text: Block[] };

const ENTRIES: Entry[] = JSON.parse(
  readFileSync(path.join(import.meta.dirname, "..", "packages", "ui", "assets", "manifest.json"), "utf8"),
).assets;
const BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));

/** Rounding allowance, as a share of the image. */
const TOLERANCE = 0.003;

/** One line per cut block on the page as it is drawn right now; empty = clean. */
export async function cutWords(page: Page, where: string): Promise<string[]> {
  const dims = Object.fromEntries(ENTRIES.map((e) => [e.id, [e.width, e.height]]));
  const seen = await page.evaluate((dims) => {
    return [...document.querySelectorAll<HTMLImageElement>("[data-frame-window] img")].flatMap((img) => {
      const id = img.closest("[data-asset-id]")?.getAttribute("data-asset-id") ?? "";
      const size = (dims as Record<string, [number, number]>)[id];
      const win = img.closest("[data-frame-window]")!.getBoundingClientRect();
      const box = img.getBoundingClientRect();
      if (!size || box.width === 0 || box.height === 0 || win.width === 0) return [];
      const [w, h] = size;
      const k = Math.max(box.width / w, box.height / h);
      const cw = w * k;
      const ch = h * k;
      const [px, py] = getComputedStyle(img)
        .objectPosition.split(" ")
        .map((v) => (v.endsWith("%") ? Number.parseFloat(v) / 100 : NaN));
      const left = box.left + (box.width - cw) * (px ?? 0.5);
      const top = box.top + (box.height - ch) * (py ?? 0.5);
      const vl = Math.max(win.left, box.left);
      const vr = Math.min(win.right, box.right);
      const vt = Math.max(win.top, box.top);
      const vb = Math.min(win.bottom, box.bottom);
      return [
        {
          id,
          position: getComputedStyle(img).objectPosition,
          u0: (vl - left) / cw,
          u1: (vr - left) / cw,
          v0: (vt - top) / ch,
          v1: (vb - top) / ch,
        },
      ];
    });
  }, dims);

  const problems: string[] = [];
  for (const s of seen) {
    const entry = BY_ID.get(s.id);
    if (!entry) continue; // the media spec reports unknown assets
    if (![s.u0, s.u1, s.v0, s.v1].every(Number.isFinite)) {
      problems.push(`${where}: "${s.id}" has an object-position the check cannot read (${s.position})`);
      continue;
    }
    for (const t of entry.text) {
      const [x0, y0, x1, y1] = t.box;
      const inside = x0 >= s.u0 - TOLERANCE && x1 <= s.u1 + TOLERANCE && y0 >= s.v0 - TOLERANCE && y1 <= s.v1 + TOLERANCE;
      const outside = x1 <= s.u0 + TOLERANCE || x0 >= s.u1 - TOLERANCE || y1 <= s.v0 + TOLERANCE || y0 >= s.v1 - TOLERANCE;
      const shown = `shows ${s.u0.toFixed(3)}–${s.u1.toFixed(3)} × ${s.v0.toFixed(3)}–${s.v1.toFixed(3)}`;
      if (t.keep && !inside) problems.push(`${where}: "${s.id}" hides or cuts its "${t.label}" block, which must stay whole (${shown})`);
      else if (!inside && !outside) problems.push(`${where}: "${s.id}" cuts its "${t.label}" text (${shown})`);
    }
  }
  return problems;
}
