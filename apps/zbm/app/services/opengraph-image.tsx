import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Services — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Everything you need to be seen, remembered, and paid.");
}
