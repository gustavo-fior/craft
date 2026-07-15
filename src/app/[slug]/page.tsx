import { allConcepts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConceptPager } from "@/components/app/concept-pager";
import { JsonLd } from "@/components/app/json-ld";
import { Resources } from "@/components/app/resources";
import { Mdx } from "@/components/app/mdx";
import { groupBySection } from "@/lib/sections";
import { SITE_NAME, SITE_URL } from "@/lib/site";

function orderedConcepts() {
  return groupBySection(
    allConcepts.map(({ title, slug, section, order }) => ({
      title,
      slug,
      section,
      order,
    })),
  ).flatMap((s) => s.concepts);
}

export function generateStaticParams() {
  return allConcepts.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);
  if (!concept) return {};
  return {
    title: concept.title,
    description: concept.description,
    alternates: { canonical: `/${concept.slug}` },
    openGraph: {
      type: "article",
      title: concept.title,
      description: concept.description,
      url: `/${concept.slug}`,
      publishedTime: concept.publishedAt,
      images: [`/og/${concept.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: concept.title,
      description: concept.description,
      images: [`/og/${concept.slug}`],
    },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);
  if (!concept) notFound();

  const ordered = orderedConcepts();
  const index = ordered.findIndex((c) => c.slug === slug);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: concept.title,
          description: concept.description,
          url: `${SITE_URL}/${concept.slug}`,
          datePublished: concept.publishedAt,
          image: `${SITE_URL}/og/${concept.slug}`,
          author: { "@type": "Person", name: "Gustavo Fior", url: "https://gustavofior.com" },
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <header>
        <h1 className="text-xl font-medium text-balance">
          {concept.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          {concept.description}
        </p>
      </header>
      <div className="mt-10">
        <Mdx code={concept.mdx} />
      </div>
      <Resources resources={concept.resources} />
      <ConceptPager
        prev={index > 0 ? ordered[index - 1] : undefined}
        next={index < ordered.length - 1 ? ordered[index + 1] : undefined}
      />
    </article>
  );
}
