import { allConcepts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConceptPager } from "@/components/app/concept-pager";
import { Mdx } from "@/components/app/mdx";
import { groupBySection } from "@/lib/sections";

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
      <ConceptPager
        prev={index > 0 ? ordered[index - 1] : undefined}
        next={index < ordered.length - 1 ? ordered[index + 1] : undefined}
      />
    </article>
  );
}
