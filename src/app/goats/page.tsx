import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GOATs",
  description: "The design engineers whose writing and work shaped this site.",
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
    description: "Design engineer at Vercel",
  },
  {
    name: "Emil Kowalski",
    url: "https://emilkowal.ski",
    domain: "emilkowal.ski",
    description: "Design engineer at Linear",
  },
  {
    name: "Jakub Krehel",
    url: "https://jakub.kr",
    domain: "jakub.kr",
    description: "Founding Design Engineer at Interfere",
  },
  {
    name: "Paco Coursey",
    url: "https://paco.me",
    domain: "paco.me",
    description: "Design engineer at Linear",
  },
  {
    name: "Shu Ding",
    url: "https://shud.in",
    domain: "shud.in",
    description: "Engineer at Vercel",
  },
  {
    name: "Benji Taylor",
    url: "https://benji.org",
    domain: "benji.org",
    description: "Design at X",
  },
  {
    name: "Raphael Salaja",
    url: "https://www.raphaelsalaja.com",
    domain: "raphaelsalaja.com",
    description: "Design engineer at Warp",
  },
];

export default function GoatsPage() {
  return (
    <article>
      <h1 className="text-base font-medium">GOATs</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        Nothing here is original. These are the people whose writing, demos, and
        open-source work taught me most of what this site tries to pass on.
      </p>
      <ul className="mt-8 flex flex-col gap-1">
        {GOATS.map((goat) => (
          <li key={goat.url}>
            <a
              href={goat.url}
              target="_blank"
              rel="noreferrer"
              className="-mx-3 flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted text-pretty pr-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${goat.domain}&sz=64`}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="size-4 shrink-0 rounded-[3px]"
              />
              <span className="min-w-0 text-sm">
                <span className="text-foreground">{goat.name}</span>
                <span className="text-muted-foreground mx-2">{"∙"}</span>
                <span className="text-muted-foreground">
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
