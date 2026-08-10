const LAUNCH_CONCEPT_SLUGS = new Set([
  "tabular-numbers",
  "optical-alignment",
  "noise",
  "nested-border-radius",
  "html-background",
  "hover-restraint",
]);

export function isConceptAvailable(slug: string) {
  return LAUNCH_CONCEPT_SLUGS.has(slug);
}
