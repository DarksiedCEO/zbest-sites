import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Media Kit — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Z Best Clips — press kit.");
}
