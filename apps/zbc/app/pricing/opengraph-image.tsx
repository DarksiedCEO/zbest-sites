import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Pricing — Z Best Clips";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("How a campaign is priced.");
}
