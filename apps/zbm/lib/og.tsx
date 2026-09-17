import { OG_SIZE, OgCard } from "@zbest/ui/og";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Renders a Z Best Media OG card from a page title on the brand base color
 * (Brief §7). Every route's opengraph-image.tsx is a one-line call to this.
 *
 * Fonts are read from @fontsource packages at build time because next/og
 * accepts only ttf/otf/woff, and next/font ships woff2. Images are generated
 * statically, so nothing is fetched from a font CDN at runtime (§1.1).
 *
 * A page with its own image must also pass `ogImage` to pageMetadata — a
 * page-level openGraph object otherwise replaces it (see packages/ui metadata).
 */
export const ogSize = OG_SIZE;
export const ogContentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", file));

export async function renderOg(title: string) {
  const [display, mono] = await Promise.all([
    font("fraunces/files/fraunces-latin-600-normal.woff"),
    font("ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff"),
  ]);
  return new ImageResponse(<OgCard brand="zbm" title={title} domain="zbestmedia.com" />, {
    ...OG_SIZE,
    fonts: [
      { name: "Fraunces", data: display, weight: 600, style: "normal" },
      { name: "IBM Plex Mono", data: mono, weight: 500, style: "normal" },
    ],
  });
}
