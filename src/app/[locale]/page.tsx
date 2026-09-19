import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getConcepts } from "@/i18n/concepts.server";
import { getUiMessages, pageCopy } from "@/i18n/ui.server";
import { isLocale } from "@/i18n/locales";
import { pageMetadata } from "@/i18n/metadata";

import { CodeBlock } from "@/components/app/code-block";
import { ConceptCard } from "@/components/app/concept-card";
import { ProseLink } from "@/components/app/prose-link";
import { RepoCard } from "@/components/app/repo-card";
import { SectionIcon } from "@/components/app/section-icon";
import { groupBySection } from "@/lib/sections";
import { GITHUB_REPO, SITE_DESCRIPTION } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getUiMessages(locale);
  return pageMetadata({ locale, pathname: "/", title: "Craft", description: messages.siteDescription, imageSlug: "index" });
}

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = getUiMessages(locale);
  const allConcepts = getConcepts(locale);
  const sections = groupBySection(
    allConcepts.map(({ title, slug, section, order, contentLocale, untranslated }) => ({
      title,
      slug,
      section,
      order,
      contentLocale,
      untranslated,
    }))
  );

  return (
    <article>
      <h1 className="text-base font-medium">{messages.index}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {messages.siteDescription}{" "}{pageCopy(locale, "home.introduction")}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {pageCopy(locale, "home.authorPrefix")}{" "}
        <ProseLink href="https://gustavofior.com">Gustavo</ProseLink>{pageCopy(locale, "home.authorDescription")}
      </p>
      <CodeBlock
        hideHeader
        tabs={[
          {
            label: "Terminal",
            language: "bash",
            code: `npx skills add ${GITHUB_REPO}`,
          },
        ]}
      />
      <p className="mt-3 text-sm text-muted-foreground">
        {pageCopy(locale, "home.contribute")}
      </p>
      <RepoCard />
      <p className="mt-3 text-sm text-muted-foreground">
        {pageCopy(locale, "home.draftNotice")}
      </p>
      <div className="mt-8 flex flex-col gap-12">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="flex items-center gap-1.5 text-sm font-medium">
              <SectionIcon section={section} size={14} className="mb-px" />
              {messages.sections[section]}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => (
                <ConceptCard
                  key={concept.slug}
                  slug={concept.slug}
                  title={concept.title}
                  description={
                    allConcepts.find((c) => c.slug === concept.slug)
                      ?.description
                  }
                  section={section}
                  locale={locale}
                  contentLocale={concept.contentLocale}
                  untranslated={concept.untranslated}
                  soonLabel={messages.soon}
                  fallbackLabel={messages.inEnglish}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
