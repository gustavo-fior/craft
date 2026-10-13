import Link from "next/link";

import { LocalOnlyIcon } from "@/components/app/local-only-icon";
import { ConceptThumbnail } from "@/components/thumbnails";
import { isConceptAvailable } from "@/lib/concepts";
import type { Section } from "@/lib/sections";

export const CONCEPT_CARD_CLASS =
  "group block overflow-hidden rounded-2xl bg-card shadow-(--custom-shadow) hover:bg-muted/5 dark:hover:bg-card/80";
const CARD = CONCEPT_CARD_CLASS;

/** Thumbnail + title + description, without the link wrapper. */
export function ConceptCardBody({
  slug,
  title,
  description,
  section,
  available = true,
}: {
  slug: string;
  title: string;
  description?: string;
  section: Section;
  available?: boolean;
}) {
  return (
    <>
      <div className="flex h-36 items-center justify-center">
        <ConceptThumbnail slug={slug} section={section} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-foreground">
            <span className="truncate">{title}</span>
            <LocalOnlyIcon slug={slug} />
          </h3>
          {!available && (
            <span className="shrink-0 rounded-full border border-dashed border-sky-300 bg-sky-500/10 px-1.5 py-px text-[10px] leading-4 font-medium text-sky-600 dark:border-sky-900 dark:bg-sky-400/10 dark:text-sky-400">
              Soon
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </>
  );
}

export function ConceptCard({
  slug,
  title,
  description,
  section,
}: {
  slug: string;
  title: string;
  description?: string;
  section: Section;
}) {
  const available = isConceptAvailable(slug);
  const content = (
    <ConceptCardBody
      slug={slug}
      title={title}
      description={description}
      section={section}
      available={available}
    />
  );

  return available ? (
    <Link href={`/${slug}`} className={CARD}>
      {content}
    </Link>
  ) : (
    <div
      aria-disabled="true"
      title="Coming soon"
      className={`${CARD} opacity-40 cursor-not-allowed select-none`}
    >
      {content}
    </div>
  );
}
