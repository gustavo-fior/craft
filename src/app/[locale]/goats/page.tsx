import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/locales";
import { getUiMessages, pageCopy } from "@/i18n/ui.server";
import { pageMetadata } from "@/i18n/metadata";
import type { PageCopyKey } from "@/i18n/messages/en-pages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return pageMetadata({ locale, pathname: "/goats", title: getUiMessages(locale).goats, description: pageCopy(locale, "goats.description"), imageSlug: "goats" });
}

type Goat = {
  name: string;
  url: string;
  domain: string;
  description: PageCopyKey;
};

const GOATS: Goat[] = [
  {
    name: "Rauno Freiberg",
    url: "https://rauno.me",
    domain: "rauno.me",
    description: "goats.rauno.role",
  },
  {
    name: "Emil Kowalski",
    url: "https://emilkowal.ski",
    domain: "emilkowal.ski",
    description: "goats.emil.role",
  },
  {
    name: "Jakub Krehel",
    url: "https://jakub.kr",
    domain: "jakub.kr",
    description: "goats.jakub.role",
  },
  {
    name: "Paco Coursey",
    url: "https://paco.me",
    domain: "paco.me",
    description: "goats.paco.role",
  },
  {
    name: "Shu Ding",
    url: "https://shud.in",
    domain: "shud.in",
    description: "goats.shu.role",
  },
  {
    name: "Benji Taylor",
    url: "https://benji.org",
    domain: "benji.org",
    description: "goats.benji.role",
  },
  {
    name: "Raphael Salaja",
    url: "https://www.raphaelsalaja.com",
    domain: "raphaelsalaja.com",
    description: "goats.raphael.role",
  },
];

export default async function GoatsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return (
    <article>
      <h1 className="text-base font-medium">{getUiMessages(locale).goats}</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        {pageCopy(locale, "goats.introduction")}
      </p>
      <ul className="mt-8 flex flex-col">
        {GOATS.map((goat) => (
          <li key={goat.url}>
            <a
              href={goat.url}
              target="_blank"
              rel="noreferrer"
              className="-mx-3 flex items-center gap-3 rounded-md px-3 py-3 hover:bg-muted text-pretty pr-4"
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
                  {pageCopy(locale, goat.description)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
