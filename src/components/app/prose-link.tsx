import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function getFaviconUrl(href?: string) {
  if (!href) return;

  try {
    const url = new URL(href);

    if (url.protocol !== "http:" && url.protocol !== "https:") return;

    // DuckDuckGo knows subdomains Google's service misses (Sonner, Vaul).
    return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(
      url.hostname
    )}.ico`;
  } catch {
    return;
  }
}

/** Inline text link; external links get the site's favicon and open in a new tab. */
export function ProseLink({
  className,
  children,
  href,
  ...props
}: ComponentProps<"a">) {
  const faviconUrl = getFaviconUrl(href);

  return (
    <a
      className={cn(
        "text-foreground underline  hover:dark:bg-neutral-800 hover:bg-neutral-200 -mx-0.5 px-1.25 py-0.75 rounded-sm hover:decoration-neutral-200 hover:dark:decoration-neutral-800 decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 transition-all [transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,text-decoration-thickness,text-underline-offset,text-decoration-style]",
        className
      )}
      href={href}
      target={faviconUrl ? "_blank" : undefined}
      rel={faviconUrl ? "noreferrer" : undefined}
      {...props}
    >
      {faviconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          aria-hidden="true"
          alt=""
          className="mr-1.25 inline-block size-3 rounded-[3px] align-[-1px]"
          decoding="async"
          height={14}
          loading="lazy"
          src={faviconUrl}
          width={14}
        />
      ) : null}
      {children}
    </a>
  );
}
