import { expect, test } from "@playwright/test";
import { coverageBands, uncoveredBands } from "../support/media-coverage";

test("coverage uses complete viewports, including the final scroll position", () => {
  for (const [height, starts] of [[900, [0]], [901, [0, 1]], [1800, [0, 900]], [2711, [0, 900, 1800, 1811]]] as const) {
    const bands = coverageBands(height, 900, []);
    expect(bands.map((b) => b.top)).toEqual(starts);
    expect(bands.every((b) => b.bottom - b.top === 900)).toBe(true);
    expect(bands.at(-1)!.bottom).toBe(height);
  }
  expect(coverageBands(600, 900, []).map(({ top, bottom }) => [top, bottom])).toEqual([[0, 600]]);
});

test("a genuinely empty final viewport still blocks", () => {
  expect(coverageBands(2711, 900, [{ top: 1700, bottom: 1800 }]).at(-1)!.media).toBe(false);
  expect(coverageBands(2711, 900, [{ top: 2200, bottom: 2300 }]).at(-1)!.media).toBe(true);
  expect(coverageBands(2711, 900, [{ top: 2200, bottom: 2223 }]).at(-1)!.media).toBe(false);
});

test("mobile tail preserves the two-band allowance without exempting continued text", () => {
  const media = [{ top: 0, bottom: 844 }];
  expect(uncoveredBands(coverageBands(844 * 3, 844, media), 2)).toEqual([]);
  expect(uncoveredBands(coverageBands(844 * 3 + 1, 844, media), 2)).toHaveLength(1);
  expect(uncoveredBands(coverageBands(844 * 2 + 1, 844, media), 2)).toEqual([]);
  expect(uncoveredBands(coverageBands(844 * 3 + 1, 844, [...media, { top: 2400, bottom: 2500 }]), 2)).toEqual([]);
});
