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
            ← <span className="ml-1">{prev.title}</span>
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link
            href={`/${next.slug}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="mr-1">{next.title}</span> →
          </Link>
        )}
      </span>
    </nav>
  );
}
