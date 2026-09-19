import type { MetadataRoute } from "next";
import { publishedConcepts, getConcept } from "@/i18n/concepts.server";
import { locales, localizedPath } from "@/i18n/locales";

import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    ...["/", "/goats", "/resources"].map((pathname) => ({ url: `${SITE_URL}${localizedPath(locale, pathname)}` })),
    ...publishedConcepts().flatMap(({ slug }) => {
      const resolved = getConcept(slug, locale);
      if (!resolved || resolved.state === "missing") return [];
      return [{ url: `${SITE_URL}${resolved.canonicalPath}`, lastModified: resolved.content.translatedAt ?? resolved.content.publishedAt }];
    }),
  ]);
}
