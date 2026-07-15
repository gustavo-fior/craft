import { allConcepts } from "content-collections";
import Link from "next/link";

import { ConceptThumbnail } from "@/components/thumbnails";
import { groupBySection } from "@/lib/sections";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function IndexPage() {
  const sections = groupBySection(
    allConcepts.map(({ title, slug, section, order }) => ({
      title,
      slug,
      section,
      order,
    })),
  );

  return (
    <article>
      <h1 className="text-xl font-medium">Index</h1>
      <p className="mt-3 text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
      <div className="mt-12 flex flex-col gap-12">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="text-xs text-muted-foreground">{section}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => {
                const full = allConcepts.find((c) => c.slug === concept.slug);
                return (
                  <Link
                    key={concept.slug}
                    href={`/${concept.slug}`}
                    className="group overflow-hidden rounded-2xl border bg-card transition-colors hover:border-ring/40"
                  >
                    <div className="flex h-36 items-center justify-center border-b">
                      <ConceptThumbnail
                        slug={concept.slug}
                        section={section}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-foreground">
                        {concept.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground text-pretty">
                        {full?.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
