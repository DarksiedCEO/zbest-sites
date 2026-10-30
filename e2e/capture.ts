import type { Page, TestInfo } from "@playwright/test";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * The one full-page capture every spec uses.
 *
 * Browsers refuse a screenshot larger than 32767 pixels on any dimension.
 * macOS WebKit let /revenue-recovery at mobile-390 through at 1170 × 36813;
 * Linux WebKit in CI refused it. The limit is applied here on every platform,
 * so a capture is taken the same way wherever the gate runs.
 *
 * Strategy, first one that fits:
 *   1. device scale — the page at its device pixel ratio, as before.
 *   2. css scale    — if cssHeight × DPR (or cssWidth × DPR) exceeds the limit.
 *   3. segments     — css scale, cut into ≤32767 px slices, only if cssHeight
 *                     itself exceeds the limit.
 * Nothing fits (e.g. cssWidth over the limit): the test fails. A capture is
 * never skipped.
 *
 * Each capture writes `<name>.capture.json` beside its PNG(s) recording
 * cssWidth, cssHeight, DPR and the scale used, and attaches the same record to
 * the test report.
 */
export const MAX_CAPTURE_PX = 32767;

export type CaptureScale = "device" | "css";

export interface CaptureRecord {
  file: string;
  cssWidth: number;
  cssHeight: number;
  dpr: number;
  scale: CaptureScale;
  segments: string[] | null;
  limit: number;
}

export async function captureFullPage(
  page: Page,
  filePath: string,
  testInfo: TestInfo,
): Promise<CaptureRecord> {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ".png");
  await mkdir(dir, { recursive: true });

  const { cssWidth, cssHeight, dpr } = await page.evaluate(() => {
    const de = document.documentElement;
    const body = document.body;
    return {
      cssWidth: Math.max(de.scrollWidth, body?.scrollWidth ?? 0),
      cssHeight: Math.max(de.scrollHeight, body?.scrollHeight ?? 0),
      dpr: window.devicePixelRatio,
    };
  });

  if (!(cssWidth > 0 && cssHeight > 0 && dpr > 0)) {
    throw new Error(
      `captureFullPage(${base}): cannot measure the page (cssWidth=${cssWidth}, cssHeight=${cssHeight}, dpr=${dpr})`,
    );
  }
  if (cssWidth > MAX_CAPTURE_PX) {
    throw new Error(
      `captureFullPage(${base}): no capture strategy fits — cssWidth ${cssWidth} exceeds ${MAX_CAPTURE_PX} and pages are only segmented vertically`,
    );
  }

  const fitsAtDevice =
    cssWidth * dpr <= MAX_CAPTURE_PX && cssHeight * dpr <= MAX_CAPTURE_PX;
  const scale: CaptureScale = fitsAtDevice ? "device" : "css";

  // Remove outputs a previous run may have left under the other strategy, so
  // the evidence directory never mixes a whole capture with stale segments.
  const stale = (await readdir(dir)).filter(
    (f) => f === `${base}.png` || (f.startsWith(`${base}.part-`) && f.endsWith(".png")),
  );
  await Promise.all(stale.map((f) => rm(path.join(dir, f), { force: true })));

  let segments: string[] | null = null;
  if (cssHeight <= MAX_CAPTURE_PX) {
    await page.screenshot({ path: filePath, fullPage: true, scale });
  } else {
    const count = Math.ceil(cssHeight / MAX_CAPTURE_PX);
    segments = [];
    for (let i = 0; i < count; i++) {
      const y = i * MAX_CAPTURE_PX;
      const name = `${base}.part-${i + 1}-of-${count}.png`;
      await page.screenshot({
        path: path.join(dir, name),
        fullPage: true,
        scale: "css",
        clip: { x: 0, y, width: cssWidth, height: Math.min(MAX_CAPTURE_PX, cssHeight - y) },
      });
      segments.push(name);
    }
  }

  const record: CaptureRecord = {
    file: `${base}.png`,
    cssWidth,
    cssHeight,
    dpr,
    scale,
    segments,
    limit: MAX_CAPTURE_PX,
  };
  const json = `${JSON.stringify(record, null, 2)}\n`;
  await writeFile(path.join(dir, `${base}.capture.json`), json);
  await testInfo.attach(`${base}.capture.json`, { body: json, contentType: "application/json" });
  testInfo.annotations.push({
    type: "capture",
    description: `${base}: cssHeight=${cssHeight} dpr=${dpr} scale=${scale}${segments ? ` segments=${segments.length}` : ""}`,
  });
  return record;
}
