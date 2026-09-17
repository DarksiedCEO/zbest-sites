import { OG_SIZE, OgCard } from "@zbest/ui/og";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

/**
 * Site-wide default OG image (Brief §7): the title on the brand base color.
 * Applies to every route without its own opengraph-image; Phase 4 pages add one
 * each with their page title — the Entertainment and Brands pages passing
 * their focus, so the card carries the right accent (§B1).
 *
 * Fonts are read from @fontsource packages at build time because next/og
 * accepts only ttf/otf/woff, and next/font ships woff2. The image is generated
 * statically, so nothing is fetched from a font CDN at runtime (§1.1).
 *
 * Bricolage here is the static 700 cut: Satori does not apply variable-font
 * axes, so the opsz 96 display character of the live headline face (founder
 * decision 4) is approximated, not reproduced.
 */
export const alt = `${SITE.name} — ${SITE.description}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const font = (file: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", file));

export default async function Image() {
  const [display, mono] = await Promise.all([
    font("bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff"),
    font("ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    <OgCard brand="zbc" title={SITE.description} domain="zbestclips.com" />,
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: display, weight: 700, style: "normal" },
        { name: "IBM Plex Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
