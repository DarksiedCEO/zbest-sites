import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Brands — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Build an audience that keeps showing up.", "brands");
}
