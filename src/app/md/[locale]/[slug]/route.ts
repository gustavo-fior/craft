import { getConcept, publishedConcepts } from "@/i18n/concepts.server";
import { isLocale, languageTag, locales, localizedPath } from "@/i18n/locales";
import { isConceptAvailable } from "@/lib/concepts";
import { conceptMarkdown } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import { getUiMessages } from "@/i18n/ui.server";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => publishedConcepts().map(({ slug }) => ({ locale, slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isConceptAvailable(slug)) return new Response("Not found", { status: 404 });
  const resolved = getConcept(slug, locale);
  if (!resolved) return new Response("Not found", { status: 404 });
  const canonical = `${SITE_URL}${resolved.canonicalPath}`;
  const messages = getUiMessages(locale);
  const notice = resolved.state === "missing"
    ? `> ${messages.missing}\n\n`
    : resolved.state === "outdated" ? `> ${messages.outdated}\n\n` : "";
  return new Response(notice + conceptMarkdown(resolved.content, {
    pageUrl: `${SITE_URL}${localizedPath(locale, `/${slug}`)}`,
    canonicalUrl: canonical,
    locale: resolved.contentLocale,
    labels: getUiMessages(resolved.contentLocale).markdown,
  }), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-language": languageTag(resolved.contentLocale),
      link: `<${canonical}>; rel="canonical"`,
      vary: "Accept",
    },
  });
}
