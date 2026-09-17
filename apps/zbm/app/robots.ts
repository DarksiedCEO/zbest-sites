import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Allow-all plus the sitemap. Unlisted routes are kept out by noindex, NOT by
 * Disallow: robots.txt is public, so a Disallow for /search-intelligence would
 * announce the page Brief §A4 keeps undiscoverable — and a crawler barred from
 * fetching a page never sees its noindex, so the URL can still be indexed from
 * an external link.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.origin}/sitemap.xml`,
  };
}
