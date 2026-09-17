import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Launch a Campaign — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Tell us what you have. We’ll tell you what it can become.");
}
