import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getConcepts } from "@/i18n/concepts.server";
import { getUiMessages } from "@/i18n/ui.server";
import { isLocale, languageTag, locales, localeDetails } from "@/i18n/locales";
import { UiLanguageProvider } from "@/components/app/ui-language";
import { Analytics } from "@vercel/analytics/next";

import { JsonLd } from "@/components/app/json-ld";
import { Providers } from "@/components/app/providers";
import { SiteShell } from "@/components/app/site-shell";
import { groupBySection } from "@/lib/sections";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "../globals.css";

const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const redaction = localFont({
  src: [
    { path: "../../../public/fonts/Redaction35-Regular.woff2", weight: "400" },
    { path: "../../../public/fonts/Redaction35-Bold.woff2", weight: "700" },
  ],
  variable: "--font-redaction-35",
  display: "swap",
});

const redaction70 = localFont({
  src: [
    { path: "../../../public/fonts/Redaction70-Regular.woff2", weight: "400" },
  ],
  variable: "--font-redaction-70",
  display: "swap",
});

const redaction50 = localFont({
  src: [
    { path: "../../../public/fonts/Redaction50-Regular.woff2", weight: "400" },
  ],
  variable: "--font-redaction-50",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s • ${SITE_NAME}` },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = getUiMessages(locale);
  const concepts = getConcepts(locale);
  const sections = groupBySection(
    concepts.map(({ title, slug, section, order, contentLocale, untranslated }) => ({
      title,
      slug,
      section,
      order,
      contentLocale,
      untranslated,
    }))
  );
  const sourcePaths = Object.fromEntries(
    concepts.map((c) => [c.slug, c.sourcePath])
  );

  return (
    <html lang={languageTag(locale)} dir={localeDetails[locale].direction} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${redaction.variable} ${redaction70.variable} ${redaction50.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            description: messages.siteDescription,
            url: SITE_URL,
            author: {
              "@type": "Person",
              name: "Gustavo Fior",
              url: "https://gustavofior.com",
            },
          }}
        />
        <Providers>
          <UiLanguageProvider locale={locale} messages={messages}>
            <SiteShell sections={sections} sourcePaths={sourcePaths}>
              {children}
            </SiteShell>
          </UiLanguageProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
