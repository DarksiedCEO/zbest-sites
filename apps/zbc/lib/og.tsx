import type { Focus } from "@zbest/ui";
import { OG_SIZE, OgCard } from "@zbest/ui/og";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Renders a Z Best Clips OG card from a page title (Brief §7). Focus-area pages
 * pass their focus so the card carries the right accent (§B1). Fonts come from
 * @fontsource at build time (next/og cannot read woff2); Satori does not apply
 * variable axes, so the static Bricolage 700 cut approximates the headline face.
 *
 * A page with its own image must also pass `ogImage` to pageMetadata.
 */
export const ogSize = OG_SIZE;
export const ogContentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", file));

export async function renderOg(title: string, focus?: Focus) {
  const [display, mono] = await Promise.all([
    font("bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff"),
    font("ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    <OgCard brand="zbc" focus={focus} title={title} domain="zbestclips.com" />,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage Grotesque", data: display, weight: 700, style: "normal" },
        { name: "IBM Plex Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
