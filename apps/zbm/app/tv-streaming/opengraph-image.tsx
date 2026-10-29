import { pageService } from "@/content/services";
import { ogContentType, ogSize, renderOg } from "@/lib/og";

const service = pageService("tv-streaming");

export const alt = `${service.name} — Z Best Media`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg(service.page.heroTitle);
}
