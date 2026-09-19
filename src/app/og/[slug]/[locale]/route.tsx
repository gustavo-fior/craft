import { renderOgImage } from "@/components/app/og-image";
import { publishedConcepts } from "@/i18n/concepts.server";
import { isLocale, locales } from "@/i18n/locales";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => ["index", "goats", "resources", ...publishedConcepts().map(({ slug }) => slug)]
    .map((slug) => ({ locale, slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  return renderOgImage(slug, locale);
}
