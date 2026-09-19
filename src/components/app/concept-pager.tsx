import Link from "next/link";
import { localizedPath, languageTag, type Locale } from "@/i18n/locales";
import type { NavConcept } from "@/lib/sections";

export function ConceptPager({
  prev,
  next,
  locale = "en", fallbackLabel = "In English",
}: {
  prev?: NavConcept;
  next?: NavConcept;
  locale?: Locale; fallbackLabel?: string;
}) {
  return (
    <nav className="mt-16 flex items-baseline justify-between border-t pt-6 text-xs">
      <span>
        {prev && (
          <Link
            href={localizedPath(locale, `/${prev.slug}`)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            ← <span lang={languageTag(prev.contentLocale ?? locale)} className="ml-1">{prev.title}</span>{prev.untranslated && <span> ({fallbackLabel})</span>}
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link
            href={localizedPath(locale, `/${next.slug}`)}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <span lang={languageTag(next.contentLocale ?? locale)} className="mr-1">{next.title}</span>{next.untranslated && <span> ({fallbackLabel})</span>} →
          </Link>
        )}
      </span>
    </nav>
  );
}
