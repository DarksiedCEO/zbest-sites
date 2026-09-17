import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Contact — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Tell us what’s actually going on.");
}
