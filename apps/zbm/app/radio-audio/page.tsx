import { ServicePage, serviceMetadata } from "@/components/service-page";

/** Catalog-rendered service page (content/services.ts; Brief amendment Oct 4, 2026). */
export const metadata = serviceMetadata("radio-audio");

export default function Page() {
  return <ServicePage slug="radio-audio" />;
}
