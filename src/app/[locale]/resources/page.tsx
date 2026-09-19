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
  return pageMetadata({ locale, pathname: "/resources", title: getUiMessages(locale).resources, description: pageCopy(locale, "resources.description"), imageSlug: "resources" });
}

type Resource = {
  url: string;
  domain: string;
  title: PageCopyKey;
  description: PageCopyKey;
};

type Group = {
  heading: PageCopyKey;
  resources: Resource[];
};

const GROUPS: Group[] = [
  {
    heading: "resources.groups.vaults",
    resources: [
      {
        url: "https://vayo.me/bookmarks/019ce8a2-931e-7308-8bc7-a3f10b2bd9ff",
        domain: "vayo.me",
        title: "resources.ui.title",
        description: "resources.ui.description",
      },
      {
        url: "https://vayo.me/bookmarks/clublk9rh000113g5qf4tj038",
        domain: "vayo.me",
        title: "resources.coolStuff.title",
        description: "resources.coolStuff.description",
      },
      {
        url: "https://vayo.me/bookmarks/cltpx1nq70001jw1tc90e4ht6",
        domain: "vayo.me",
        title: "resources.articles.title",
        description: "resources.articles.description",
      },
    ],
  },
  {
    heading: "resources.groups.learning",
    resources: [
      {
        url: "https://devouringdetails.com",
        domain: "devouringdetails.com",
        title: "resources.devouringDetails.title",
        description: "resources.devouringDetails.description",
      },
      {
        url: "https://animations.dev",
        domain: "animations.dev",
        title: "resources.animations.title",
        description: "resources.animations.description",
      },
      {
        url: "https://invisibledetails.com/",
        domain: "invisibledetails.com",
        title: "resources.invisibleDetails.title",
        description: "resources.invisibleDetails.description",
      },
      {
        url: "https://interfaces.dev/",
        domain: "interfaces.dev",
        title: "resources.interfaces.title",
        description: "resources.interfaces.description",
      },
      {
        url: "https://www.interfacecraft.dev/",
        domain: "interfacecraft.dev",
        title: "resources.interfaceCraft.title",
        description: "resources.interfaceCraft.description",
      },
    ],
  },
  {
    heading: "resources.groups.icons",
    resources: [
      {
        url: "https://lucide.dev/",
        domain: "lucide.dev",
        title: "resources.lucide.title",
        description: "resources.lucide.description",
      },
      {
        url: "https://phosphoricons.com/",
        domain: "phosphoricons.com",
        title: "resources.phosphor.title",
        description: "resources.phosphor.description",
      },
      {
        url: "https://tabler.io/icons",
        domain: "tabler.io",
        title: "resources.tabler.title",
        description: "resources.tabler.description",
      },
      {
        url: "https://nucleoapp.com/",
        domain: "nucleoapp.com",
        title: "resources.nucleo.title",
        description: "resources.nucleo.description",
      },
      {
        url: "https://www.radix-ui.com/icons",
        domain: "radix-ui.com",
        title: "resources.radix.title",
        description: "resources.radix.description",
      },
      {
        url: "https://hugeicons.com/",
        domain: "hugeicons.com",
        title: "resources.hugeicons.title",
        description: "resources.hugeicons.description",
      },
      {
        url: "https://centralicons.com/",
        domain: "centralicons.com",
        title: "resources.centralIcons.title",
        description: "resources.centralIcons.description",
      },

      {
        url: "https://svgl.app/",
        domain: "svgl.app",
        title: "resources.svgl.title",
        description: "resources.svgl.description",
      },
    ],
  },
  {
    heading: "resources.groups.sound",
    resources: [
      {
        url: "https://audio.raphaelsalaja.com",
        domain: "audio.raphaelsalaja.com",
        title: "resources.webKitsAudio.title",
        description: "resources.webKitsAudio.description",
      },
      {
        url: "https://cuelume-site.pages.dev/",
        domain: "cuelume-site.pages.dev",
        title: "resources.cuelume.title",
        description: "resources.cuelume.description",
      },
    ],
  },
  {
    heading: "resources.groups.inspiration",
    resources: [
      {
        url: "https://www.are.na",
        domain: "are.na",
        title: "resources.arena.title",
        description: "resources.arena.description",
      },
      {
        url: "https://recent.design/",
        domain: "recent.design",
        title: "resources.recent.title",
        description: "resources.recent.description",
      },
      {
        url: "https://www.cosmos.so",
        domain: "cosmos.so",
        title: "resources.cosmos.title",
        description: "resources.cosmos.description",
      },
      {
        url: "https://mobbin.com/",
        domain: "mobbin.com",
        title: "resources.mobbin.title",
        description: "resources.mobbin.description",
      },
      {
        url: "https://x.com/",
        domain: "x.com",
        title: "resources.x.title",
        description: "resources.x.description",
      },
    ],
  },
];

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return (
    <article>
      <h1 className="text-base font-medium">{getUiMessages(locale).resources}</h1>
      <p className="mt-3 text-sm text-muted-foreground text-pretty">
        {pageCopy(locale, "resources.introduction")}
      </p>
      <div className="mt-8 flex flex-col gap-10">
        {GROUPS.map((group) => (
          <section key={group.heading}>
            <h2 className="text-sm font-medium">{pageCopy(locale, group.heading)}</h2>
            <ul className="mt-2 flex flex-col">
              {group.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-2.5 flex items-center gap-3 rounded-md px-2.5 py-2.5 hover:bg-muted"
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
                      <span className="text-foreground">{pageCopy(locale, resource.title)}</span>
                      <span className="text-muted-foreground mx-2">{"∙"}</span>
                      <span className="text-muted-foreground">
                        {pageCopy(locale, resource.description)}
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
