import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "About — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("A media company built on evidence, not promises.");
}
