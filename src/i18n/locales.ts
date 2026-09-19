export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeDetails: Record<Locale, { name: string; languageTag: string; openGraph: string; direction: "ltr" | "rtl" }> = {
  en: { name: "English", languageTag: "en", openGraph: "en_US", direction: "ltr" },
  es: { name: "Español", languageTag: "es-ES", openGraph: "es_ES", direction: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function languageTag(locale: Locale) {
  return localeDetails[locale].languageTag;
}

export function localizedPath(locale: Locale, pathname: string) {
  return locale === defaultLocale ? pathname : `/${locale}${pathname === "/" ? "" : pathname}`;
}

export function splitLocalePath(pathname: string): { locale: Locale; pathname: string } {
  const [, first, ...rest] = pathname.split("/");
  return isLocale(first)
    ? { locale: first, pathname: `/${rest.join("/")}` }
    : { locale: "en", pathname };
}
