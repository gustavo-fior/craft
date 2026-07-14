import Link from "next/link";

export function ConceptPager({
  prev,
  next,
}: {
  prev?: { title: string; slug: string };
  next?: { title: string; slug: string };
}) {
  return (
    <nav className="mt-16 flex items-baseline justify-between border-t pt-6 text-xs">
      <span>
        {prev && (
          <Link
            href={`/${prev.slug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {prev.title}
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link
            href={`/${next.slug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {next.title} →
          </Link>
        )}
      </span>
    </nav>
  );
}
