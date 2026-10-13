const LAUNCH_CONCEPT_SLUGS = new Set([
  "tabular-numbers",
  "optical-alignment",
  "noise",
  "nested-border-radius",
  "html-background",
  "hover-restraint",
  "image-outlines",
]);

/** True only for concepts that are live in production. */
export function isConceptLaunched(slug: string) {
  return LAUNCH_CONCEPT_SLUGS.has(slug);
}

// Unlaunched concepts are enabled everywhere (sidebar, command menu, pages,
// sitemap, llms.txt, OG images) during local development only.
export function isConceptAvailable(slug: string) {
  if (process.env.NODE_ENV === "development") return true;
  return isConceptLaunched(slug);
}

// Concepts currently being written or revised. Shown with a "work in
// progress" marker in development; everything else unlaunched gets the
// plain "not published" marker.
const WIP_CONCEPT_SLUGS = new Set([
  "button-press",
  "interruptibility",
  "scroll-fades",
  "font-smoothing",
]);

export type LocalStatus = "launched" | "draft" | "wip";

/** Local-only status of a concept; always "launched" outside development. */
export function getConceptLocalStatus(slug: string): LocalStatus {
  if (process.env.NODE_ENV !== "development") return "launched";
  if (isConceptLaunched(slug)) return "launched";
  return WIP_CONCEPT_SLUGS.has(slug) ? "wip" : "draft";
}
