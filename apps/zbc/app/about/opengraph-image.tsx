import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "About — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("We come from advertising. Now we’re building the next version of it.");
}
