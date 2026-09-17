import type { MetadataRoute } from "next";
import { ROUTES, SITE } from "@/lib/site";

/**
 * Built, indexable routes only (lib/site.ts). Search Intelligence and /dev/*
 * are not in ROUTES at all, so there is nothing here that could list them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.filter((r) => r.built && r.indexable).map((r) => ({
    url: `${SITE.origin}${r.path === "/" ? "" : r.path}`,
  }));
}
