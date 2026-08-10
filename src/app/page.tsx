import { allConcepts } from "content-collections";
import Link from "next/link";

import { ConceptThumbnail } from "@/components/thumbnails";
import { isConceptAvailable } from "@/lib/concepts";
import { groupBySection } from "@/lib/sections";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function IndexPage() {
  const sections = groupBySection(
    allConcepts.map(({ title, slug, section, order }) => ({
      title,
      slug,
      section,
      order,
    }))
  );

  return (
    <article>
      <h1 className="text-base font-medium">Index</h1>
      <p className="mt-3 text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
      <div className="mt-8 flex flex-col gap-12">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="text-sm font-medium">{section}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => {
                const full = allConcepts.find((c) => c.slug === concept.slug);
                const available = isConceptAvailable(concept.slug);
                const content = (
                  <>
                    <div className="flex h-36 items-center justify-center">
                      <ConceptThumbnail slug={concept.slug} section={section} />
                    </div>
                    <div className="p-4">
                      <h3 className="text-[13px] font-medium text-foreground">
                        {concept.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground text-pretty">
                        {full?.description}
                      </p>
                    </div>
                  </>
                );

                return available ? (
                  <Link
                    key={concept.slug}
                    href={`/${concept.slug}`}
                    className="group overflow-hidden rounded-2xl bg-card shadow-(--custom-shadow) hover:bg-muted/5 dark:hover:bg-card/80"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={concept.slug}
                    aria-disabled="true"
                    title="Coming soon"
                    className="cursor-not-allowed overflow-hidden rounded-2xl bg-card opacity-40 grayscale shadow-(--custom-shadow) select-none"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
