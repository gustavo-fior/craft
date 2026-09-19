import "server-only";
import { allConcepts } from "content-collections";
import { resolveContent, validateContentInventory } from "./content";
import type { Locale } from "./locales";
import { isConceptAvailable } from "@/lib/concepts";

validateContentInventory(allConcepts);

export const originalConcepts = allConcepts.filter((concept) => concept.locale === "en");

export function getConcept(slug: string, locale: Locale) {
  return resolveContent(allConcepts, slug, locale);
}

export function getConcepts(locale: Locale) {
  return originalConcepts.map((original) => {
    const resolved = getConcept(original.slug, locale);
    const content = resolved?.content ?? original;
    return { ...content, contentLocale: content.locale, untranslated: content.locale !== locale };
  });
}

export function publishedConcepts() {
  return originalConcepts.filter((concept) => isConceptAvailable(concept.slug));
}
