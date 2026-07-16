type Resource = {
  url: string;
  domain: string;
  title: string;
  description?: string;
};

export function Resources({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-base font-medium">Resources</h2>
      <ul className="mt-3 flex flex-col gap-1">
        {resources.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="-mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${resource.domain}&sz=64`}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="size-4 shrink-0 rounded-sm"
              />
              <span className="min-w-0 truncate text-sm">
                <span className="text-foreground">{resource.title}</span>
                {resource.description && (
                  <span className="text-muted-foreground">
                    {" - "}
                    {resource.description}
                  </span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
