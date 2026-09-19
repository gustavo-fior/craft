import type { Locale } from "./locales";
import { localizedPath } from "./locales";

export type LocalizedContent = {
  slug: string;
  locale: Locale;
  sourceHash: string;
  sourceRevision?: string;
};

export function resolveContent<T extends LocalizedContent>(
  contents: readonly T[],
  slug: string,
  interfaceLocale: Locale,
) {
  const original = contents.find((item) => item.slug === slug && item.locale === "en");
  if (!original) return undefined;
  const translation = contents.find((item) => item.slug === slug && item.locale === interfaceLocale);
  const content = translation ?? original;
  const state = !translation ? "missing" : content.locale !== "en" && content.sourceRevision !== original.sourceHash ? "outdated" : "current";
  const translatedLocales = contents.filter((item) => item.slug === slug).map((item) => item.locale);
  return {
    original,
    content,
    state,
    interfaceLocale,
    contentLocale: content.locale,
    canonicalPath: localizedPath(content.locale, `/${slug}`),
    translatedLocales,
  };
}

export function validateContentInventory(contents: readonly LocalizedContent[]) {
  const identities = new Set<string>();
  for (const content of contents) {
    const identity = `${content.locale}/${content.slug}`;
    if (identities.has(identity)) throw new Error(`Duplicate content: ${identity}`);
    identities.add(identity);
  }
  for (const content of contents) {
    if (content.locale !== "en" && !identities.has(`en/${content.slug}`)) {
      throw new Error(`Translation has no English original: ${content.locale}/${content.slug}`);
    }
  }
}
