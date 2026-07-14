import { allConcepts } from "content-collections";
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...allConcepts.map((concept) => ({
      url: `${SITE_URL}/${concept.slug}`,
      lastModified: concept.publishedAt,
    })),
  ];
}
