import { allConcepts } from "content-collections";
import Link from "next/link";

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
      <div className="mt-12 flex flex-col gap-10">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="text-xs text-muted-foreground">{section}</h2>
            <ul className="mt-3 flex flex-col">
              {concepts.map((concept) => {
                const full = allConcepts.find((c) => c.slug === concept.slug);
                return (
                  <li key={concept.slug}>
                    <Link
                      href={`/${concept.slug}`}
                      className="group flex items-baseline justify-between gap-4 border-b py-3"
                    >
                      <span className="text-sm text-foreground">
                        {concept.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                        {full?.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
