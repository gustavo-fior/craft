import type { Metadata } from "next";
import { languageTag, localizedPath, locales, localeDetails, type Locale } from "./locales";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function pageMetadata({ locale, pathname, title, description, translatedLocales = [...locales], contentLocale = locale, imageSlug }: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  translatedLocales?: Locale[];
  contentLocale?: Locale;
  imageSlug: string;
}): Metadata {
  const canonical = `${SITE_URL}${localizedPath(contentLocale, pathname)}`;
  const languages = Object.fromEntries(translatedLocales.map((language) => [
    languageTag(language), `${SITE_URL}${localizedPath(language, pathname)}`,
  ]));
  const image = `/og/${imageSlug}/${contentLocale}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: contentLocale === locale ? languages : undefined,
    },
    openGraph: {
      type: "website", siteName: SITE_NAME, title, description, url: canonical,
      locale: localeDetails[contentLocale].openGraph,
      images: [{ url: image, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image, alt: title }] },
  };
}
