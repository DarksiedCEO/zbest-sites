import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Search Intelligence — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Ranked isn’t the same as cited.");
}
