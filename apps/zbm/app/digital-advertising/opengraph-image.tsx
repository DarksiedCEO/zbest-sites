import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Digital Advertising — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("The traffic engine, built to feed a funnel that actually converts.");
}
