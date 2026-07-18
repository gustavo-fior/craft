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
        url: "https://www.refactoringui.com",
        domain: "refactoringui.com",
        title: "Refactoring UI",
        description: "Design tactics for developers, by the Tailwind founders.",
      },
      {
        url: "https://lawsofux.com",
        domain: "lawsofux.com",
        title: "Laws of UX",
        description: "The psychology principles behind interface decisions.",
      },
    ],
  },
  {
    heading: "Motion",
    resources: [
      {
        url: "https://easings.net",
        domain: "easings.net",
        title: "easings.net",
        description: "Every easing curve, visualized and copyable.",
      },
      {
        url: "https://motion.dev",
        domain: "motion.dev",
        title: "Motion",
        description: "The animation library used across this site.",
      },
      {
        url: "https://linear.style",
        domain: "linear.style",
        title: "linear.style",
        description: "Generate linear() spring and bounce easings in CSS.",
      },
    ],
  },
  {
    heading: "Color & typography",
    resources: [
      {
        url: "https://oklch.fyi",
        domain: "oklch.fyi",
        title: "oklch.fyi",
        description: "Jakub Krehel's OKLCH color picker and explainer.",
      },
      {
        url: "https://www.fontshare.com",
        domain: "fontshare.com",
        title: "Fontshare",
        description: "Free, quality fonts from the Indian Type Foundry.",
      },
      {
        url: "https://modernfontstacks.com",
        domain: "modernfontstacks.com",
        title: "Modern Font Stacks",
        description: "System font stacks that need no webfont at all.",
      },
    ],
  },
  {
    heading: "Icons & sound",
    resources: [
      {
        url: "https://phosphoricons.com",
        domain: "phosphoricons.com",
        title: "Phosphor Icons",
        description: "The icon family used on this site - six weights.",
      },
      {
        url: "https://lucide.dev",
        domain: "lucide.dev",
        title: "Lucide",
        description: "The community fork of Feather; the safe default.",
      },
      {
        url: "https://audio.raphaelsalaja.com",
        domain: "audio.raphaelsalaja.com",
        title: "@web-kits/audio",
        description: "Synthesized interface sounds; powers this site's SFX.",
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
        url: "https://godly.website",
        domain: "godly.website",
        title: "Godly",
        description: "Astronomically good web design inspiration.",
      },
      {
        url: "https://www.cosmos.so",
        domain: "cosmos.so",
        title: "Cosmos",
        description: "A calmer, curated alternative to Pinterest.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <article>
      <h1 className="text-lg font-medium">Resources</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        Tools and references I keep coming back to. Each concept page also lists
        the specific posts it draws from.
      </p>
      <div className="mt-10 flex flex-col gap-10">
        {GROUPS.map((group) => (
          <section key={group.heading}>
            <h2 className="text-xs text-muted-foreground">{group.heading}</h2>
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
                      src={`https://www.google.com/s2/favicons?domain=${resource.domain}&sz=64`}
                      alt=""
                      width={16}
                      height={16}
                      loading="lazy"
                      className="size-4 shrink-0 rounded-sm"
                    />
                    <span className="min-w-0 truncate text-sm">
                      <span className="text-foreground">{resource.title}</span>
                      <span className="text-muted-foreground">
                        {" - "}
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
