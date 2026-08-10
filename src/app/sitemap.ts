import { allConcepts } from "content-collections";
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { isConceptAvailable } from "@/lib/concepts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/goats` },
    { url: `${SITE_URL}/resources` },
    ...allConcepts
      .filter((concept) => isConceptAvailable(concept.slug))
      .map((concept) => ({
        url: `${SITE_URL}/${concept.slug}`,
        lastModified: concept.publishedAt,
      })),
  ];
}
