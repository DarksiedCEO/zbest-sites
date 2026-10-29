import { ServicePage, serviceMetadata } from "@/components/service-page";

/** Catalog-rendered service page (content/services.ts; Brief amendment Oct 4, 2026). */
export const metadata = serviceMetadata("websites");

export default function Page() {
  return <ServicePage slug="websites" />;
}
