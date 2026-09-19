import type { Locale } from "@/i18n/locales";

export const SECTIONS = [
  "Craft",
  "Typography",
  "Color",
  "Layout",
  "Motion",
  "Sound",
  "Data",
] as const;

export type Section = (typeof SECTIONS)[number];

export type NavConcept = {
  title: string;
  slug: string;
  section: Section;
  order: number;
  contentLocale?: Locale;
  untranslated?: boolean;
};

export type NavSection = {
  section: Section;
  concepts: NavConcept[];
};

export function groupBySection(concepts: NavConcept[]): NavSection[] {
  return SECTIONS.map((section) => ({
    section,
    concepts: concepts
      .filter((c) => c.section === section)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  })).filter((s) => s.concepts.length > 0);
}
