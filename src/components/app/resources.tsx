type Resource = {
  url: string;
  domain: string;
  title: string;
  description?: string;
};

// The row list used on the Resources page, at the bottom of each concept
// page, and inline in content via the `LinkList` MDX component.
export function ResourceList({
  resources,
  className,
}: {
  resources: Resource[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {resources.map((resource) => (
        <li key={resource.url}>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="-mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2.5 hover:bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${resource.domain}&sz=64`}
              alt=""
              width={16}
              height={16}
              loading="lazy"
              className="size-4 shrink-0 rounded-[3px]"
            />
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              <span className="text-foreground">{resource.title}</span>
              {resource.description && (
                <span>
                  {" - "}
                  {resource.description}
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Resources({ resources, title = "Resources" }: { resources: Resource[]; title?: string }) {
  if (resources.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-base font-medium">{title}</h2>
      <ResourceList className="mt-3 flex flex-col" resources={resources} />
    </section>
  );
}

// Inline list of links in prose, styled like the Resources rows. Lives here so
// the two stay in sync. `domain` is derived from the URL when omitted.
export function LinkList({
  links,
}: {
  links: { url: string; title: string; description?: string; domain?: string }[];
}) {
  return (
    <ResourceList
      className="my-4 flex flex-col"
      resources={links.map((link) => ({
        ...link,
        domain: link.domain ?? new URL(link.url).hostname,
      }))}
    />
  );
}
