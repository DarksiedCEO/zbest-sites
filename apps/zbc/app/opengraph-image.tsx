import { SITE } from "@/lib/site";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

/** Site-wide default OG image, also How It Works' (it serves "/"). Brief §7. */
export const alt = `${SITE.name} — ${SITE.description}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg(SITE.description);
}
