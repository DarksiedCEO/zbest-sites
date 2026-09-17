import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

/**
 * Built, indexable routes only (lib/site.ts). /dev/* is not in ROUTES at all,
 * so there is nothing here that could list it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter((r) => r.built && r.indexable).map((r) => ({
    url: `${SITE.origin}${r.path === "/" ? "" : r.path}`,
  }));
}
