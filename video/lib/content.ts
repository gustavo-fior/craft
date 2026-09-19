import { allConcepts } from "content-collections";

import { groupBySection, type Section } from "@/lib/sections";

export type Concept = {
  title: string;
  slug: string;
  section: Section;
  description: string;
};

export const CONCEPTS: Concept[] = allConcepts.filter((concept) => concept.locale === "en").map(
  ({ title, slug, section, description }) => ({
    title,
    slug,
    section,
    description,
  })
);

// Everything is shown as launched: this is the launch.
export const NAV = groupBySection(
  allConcepts.filter((concept) => concept.locale === "en").map(({ title, slug, section, order }) => ({
    title,
    slug,
    section,
    order,
  }))
);

export const ORDERED = NAV.flatMap((s) => s.concepts);
export const LAST_CONCEPT = ORDERED[ORDERED.length - 1];

export function concept(slug: string): Concept {
  const found = CONCEPTS.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown concept: ${slug}`);
  return found;
}

export const navId = {
  page: (page: string) => `nav:page:${page}`,
  section: (section: Section) => `nav:section:${section}`,
  concept: (slug: string) => `nav:concept:${slug}`,
};
