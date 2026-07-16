import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GOATs",
  description:
    "The design engineers whose writing and work shaped this site.",
};

type Goat = {
  name: string;
  url: string;
  domain: string;
  description: string;
};

const GOATS: Goat[] = [
  {
    name: "Rauno Freiberg",
    url: "https://rauno.me",
    domain: "rauno.me",
    description:
      "Design engineer at Vercel. His craft essays and Devouring Details are the closest thing this discipline has to a textbook.",
  },
  {
    name: "Emil Kowalski",
    url: "https://emilkowal.ski",
    domain: "emilkowal.ski",
    description:
      "Design engineer at Linear. Built Sonner and Vaul, and teaches motion at animations.dev.",
  },
  {
    name: "Jakub Krehel",
    url: "https://jakub.kr",
    domain: "jakub.kr",
    description:
      "Founder of Interfere. Writes obsessively about the smallest details - outlines, optics, and the cost of animation.",
  },
  {
    name: "Paco Coursey",
    url: "https://paco.me",
    domain: "paco.me",
    description:
      "Design engineer at Linear. Built cmdk and next-themes; writes about creative output and remixing.",
  },
  {
    name: "Shu Ding",
    url: "https://shud.in",
    domain: "shud.in",
    description:
      "Engineer at Vercel. Built SWR, Satori, and COBE; writes about performance, typography, and quality.",
  },
  {
    name: "Benji Taylor",
    url: "https://benji.org",
    domain: "benji.org",
    description:
      "Founder of Family. His Liveline and Family Values posts set the bar for delightful, living interfaces.",
  },
  {
    name: "Raphael Salaja",
    url: "https://www.raphaelsalaja.com",
    domain: "raphaelsalaja.com",
    description:
      "Design engineer. Built @web-kits/audio - the library behind every sound on this site - and Toldo.",
  },
];

export default function GoatsPage() {
  return (
    <article>
      <h1 className="text-xl font-medium">GOATs</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        Nothing here is original. These are the people whose writing, demos,
        and open-source work taught me most of what this site tries to pass
        on.
      </p>
      <ul className="mt-10 flex flex-col gap-1">
        {GOATS.map((goat) => (
          <li key={goat.url}>
            <a
              href={goat.url}
              target="_blank"
              rel="noreferrer"
              className="-mx-2.5 flex items-start gap-3 rounded-md px-2.5 py-2.5 hover:bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${goat.domain}&sz=64`}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="mt-0.5 size-4 shrink-0 rounded-sm"
              />
              <span className="min-w-0 text-sm">
                <span className="text-foreground">{goat.name}</span>
                <span className="text-muted-foreground">
                  {" - "}
                  {goat.description}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
