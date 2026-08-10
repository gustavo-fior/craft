import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description: "Tools, references, and reading for design engineering.",
};

type Resource = {
  url: string;
  domain: string;
  title: string;
  description: string;
};

type Group = {
  heading: string;
  resources: Resource[];
};

const GROUPS: Group[] = [
  {
    heading: "My Vaults",
    resources: [
      {
        url: "https://vayo.me/bookmarks/019ce8a2-931e-7308-8bc7-a3f10b2bd9ff",
        domain: "vayo.me",
        title: "UI",
        description: "Interface references and patterns collected on Vayo.",
      },
      {
        url: "https://vayo.me/bookmarks/clublk9rh000113g5qf4tj038",
        domain: "vayo.me",
        title: "Cool Stuff",
        description: "Interesting products, ideas, and details collected on Vayo.",
      },
      {
        url: "https://vayo.me/bookmarks/cltpx1nq70001jw1tc90e4ht6",
        domain: "vayo.me",
        title: "Articles",
        description: "Writing worth returning to, collected on Vayo.",
      },
    ],
  },
  {
    heading: "Learning",
    resources: [
      {
        url: "https://devouringdetails.com",
        domain: "devouringdetails.com",
        title: "Devouring Details",
        description: "Rauno Freiberg's interaction design course.",
      },
      {
        url: "https://animations.dev",
        domain: "animations.dev",
        title: "animations.dev",
        description: "Emil Kowalski's course on web animations.",
      },
      {
        url: "https://invisibledetails.com/",
        domain: "invisibledetails.com",
        title: "Invisible Details",
        description: "A course on the small decisions behind great interfaces.",
      },
      {
        url: "https://interfaces.dev/",
        domain: "interfaces.dev",
        title: "Interfaces",
        description: "Jakub Krehel's design engineering magazine.",
      },
      {
        url: "https://www.interfacecraft.dev/",
        domain: "interfacecraft.dev",
        title: "Interface Craft",
        description: "A working library for designing with uncommon care.",
      },
    ],
  },
  {
    heading: "Icons",
    resources: [
      {
        url: "https://lucide.dev/",
        domain: "lucide.dev",
        title: "Lucide",
        description: "Clean, customizable SVG icons made by the community.",
      },
      {
        url: "https://phosphoricons.com/",
        domain: "phosphoricons.com",
        title: "Phosphor Icons",
        description: "The icon family used on this site - six weights.",
      },
      {
        url: "https://tabler.io/icons",
        domain: "tabler.io",
        title: "Tabler Icons",
        description: "6,000+ open-source icons built on a consistent 24px grid.",
      },
      {
        url: "https://nucleoapp.com/",
        domain: "nucleoapp.com",
        title: "Nucleo",
        description: "40,000+ premium SVG icons with an app to manage them.",
      },
      {
        url: "https://www.radix-ui.com/icons",
        domain: "radix-ui.com",
        title: "Radix Icons",
        description: "A crisp set of 15×15 icons available as React components.",
      },
      {
        url: "https://hugeicons.com/",
        domain: "hugeicons.com",
        title: "Hugeicons",
        description: "A large free and premium library across multiple styles.",
      },
      {
        url: "https://svgl.app/",
        domain: "svgl.app",
        title: "SVGL",
        description: "A searchable library of brand and product SVG logos.",
      },
    ],
  },
  {
    heading: "Sound",
    resources: [
      {
        url: "https://audio.raphaelsalaja.com",
        domain: "audio.raphaelsalaja.com",
        title: "@web-kits/audio",
        description: "Synthesized interface sounds; powers this site's SFX.",
      },
      {
        url: "https://cuelume-site.pages.dev/",
        domain: "cuelume-site.pages.dev",
        title: "Cuelume",
        description: "A tiny library of interaction sounds synthesized with Web Audio.",
      },
    ],
  },
  {
    heading: "Inspiration",
    resources: [
      {
        url: "https://www.are.na",
        domain: "are.na",
        title: "Are.na",
        description: "The best place to collect and connect references.",
      },
      {
        url: "https://recent.design/",
        domain: "recent.design",
        title: "Recent",
        description: "A daily curation of exceptional design, websites, and tools.",
      },
      {
        url: "https://www.cosmos.so",
        domain: "cosmos.so",
        title: "Cosmos",
        description: "A calmer, curated alternative to Pinterest.",
      },
      {
        url: "https://mobbin.com/",
        domain: "mobbin.com",
        title: "Mobbin",
        description: "A searchable library of mobile and web app screenshots.",
      },
      {
        url: "https://x.com/",
        domain: "x.com",
        title: "X",
        description: "Design work, ideas, and conversations from people I follow.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <article>
      <h1 className="text-base font-medium">Resources</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        Tools and references I keep coming back to. Each concept page also lists
        the specific posts it draws from.
      </p>
      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((group) => (
          <section key={group.heading}>
            <h2 className="text-sm font-medium">{group.heading}</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {group.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2 hover:bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${resource.domain}&sz=128`}
                      alt=""
                      width={16}
                      height={16}
                      loading="lazy"
                      className="size-4 shrink-0 rounded-[3px]"
                    />
                    <span className="min-w-0 truncate text-sm">
                      <span className="text-foreground">{resource.title}</span>
                      <span className="text-muted-foreground mx-2">{"∙"}</span>
                      <span className="text-muted-foreground">
                        {resource.description}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
