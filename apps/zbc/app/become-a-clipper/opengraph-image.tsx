import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Become a Clipper — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Turn footage into income.");
}
