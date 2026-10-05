import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Start a Project — Z Best Media";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg("Tell us what you need. One form reaches every team.");
}
