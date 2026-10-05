import { ServicePage, serviceMetadata } from "@/components/service-page";

/** Catalog-rendered service page (content/services.ts; Brief amendment Oct 4, 2026). */
export const metadata = serviceMetadata("creative-production");

export default function Page() {
  return <ServicePage slug="creative-production" />;
}
