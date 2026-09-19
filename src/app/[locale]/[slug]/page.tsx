import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ConceptPager } from "@/components/app/concept-pager";
import { JsonLd } from "@/components/app/json-ld";
import { Resources } from "@/components/app/resources";
import { Mdx } from "@/components/app/mdx";
import { DemoMessagesProvider } from "@/components/app/demo-messages";
import { getConcept, getConcepts, publishedConcepts } from "@/i18n/concepts.server";
import { getDemoMessages } from "@/i18n/demos.server";
import { getUiMessages } from "@/i18n/ui.server";
import { isLocale, languageTag, localizedPath, localeDetails } from "@/i18n/locales";
import { pageMetadata } from "@/i18n/metadata";
import { isConceptAvailable } from "@/lib/concepts";
import { groupBySection } from "@/lib/sections";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedConcepts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const resolved = getConcept(slug, locale);
  if (!resolved || !isConceptAvailable(slug)) notFound();
  const { content, contentLocale, translatedLocales } = resolved;
  const metadata = pageMetadata({
    locale, pathname: `/${slug}`, title: content.title, description: content.description,
    contentLocale, translatedLocales, imageSlug: slug,
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: { "text/markdown": `${SITE_URL}${localizedPath(locale, `/${slug}.md`)}` },
    },
    openGraph: {
      ...metadata.openGraph,
      type: "article" as const,
      publishedTime: content.translatedAt ?? content.publishedAt,
    },
  };
}

export default async function ConceptPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const resolved = getConcept(slug, locale);
  if (!resolved || !isConceptAvailable(slug)) notFound();
  const { content, contentLocale, state, canonicalPath } = resolved;
  const messages = getUiMessages(locale);
  const contentMessages = getUiMessages(contentLocale);
  const demoMessages = await getDemoMessages(contentLocale, slug);
  const ordered = groupBySection(getConcepts(locale)).flatMap(({ concepts }) => concepts)
    .filter((concept) => isConceptAvailable(concept.slug));
  const index = ordered.findIndex((concept) => concept.slug === slug);

  return (
    <>
      {state !== "current" && (
        <aside aria-label={messages.translationStatus}
          className="mb-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm leading-relaxed">
          <p>{state === "missing" ? messages.missing : messages.outdated}</p>
          <a href={`/${slug}`} hrefLang="en" className="mt-2 inline-block underline underline-offset-4">
            {messages.readOriginal}
          </a>
        </aside>
      )}
      <article lang={languageTag(contentLocale)} dir={localeDetails[contentLocale].direction}>
        <JsonLd data={{
          "@context": "https://schema.org", "@type": "TechArticle",
          headline: content.title, description: content.description,
          inLanguage: languageTag(contentLocale), url: `${SITE_URL}${canonicalPath}`,
          datePublished: content.translatedAt ?? content.publishedAt,
          image: `${SITE_URL}/og/${slug}/${contentLocale}`,
          author: { "@type": "Person", name: "Gustavo Fior", url: "https://gustavofior.com" },
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        }} />
        <header><h1 className="text-lg font-medium text-balance">{content.title}</h1></header>
        <DemoMessagesProvider locale={contentLocale} messages={demoMessages}>
          <div className="mt-4"><Mdx code={content.mdx} locale={locale} /></div>
        </DemoMessagesProvider>
        <Resources resources={content.resources} title={contentMessages.resources} />
      </article>
      <ConceptPager prev={ordered[index - 1]} next={ordered[index + 1]} locale={locale}
        fallbackLabel={messages.inEnglish} />
    </>
  );
}
