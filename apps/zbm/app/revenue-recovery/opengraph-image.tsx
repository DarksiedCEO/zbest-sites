import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Revenue Recovery — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Find out where your revenue is going.");
}
