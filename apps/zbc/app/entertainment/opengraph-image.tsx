import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Entertainment — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Get discovered by people who’ve never heard of you.", "entertainment");
}
