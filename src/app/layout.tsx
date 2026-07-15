import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { allConcepts } from "content-collections";

import { JsonLd } from "@/components/app/json-ld";
import { Providers } from "@/components/app/providers";
import { SiteShell } from "@/components/app/site-shell";
import { groupBySection } from "@/lib/sections";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const redaction = localFont({
  src: [
    { path: "../../public/fonts/Redaction35-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Redaction35-Bold.woff2", weight: "700" },
  ],
  variable: "--font-redaction-35",
  display: "swap",
});

const redaction70 = localFont({
  src: [{ path: "../../public/fonts/Redaction70-Regular.woff2", weight: "400" }],
  variable: "--font-redaction-70",
  display: "swap",
});

const redaction50 = localFont({
  src: [{ path: "../../public/fonts/Redaction50-Regular.woff2", weight: "400" }],
  variable: "--font-redaction-50",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: ["/og/index"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og/index"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sections = groupBySection(
    allConcepts.map(({ title, slug, section, order }) => ({
      title,
      slug,
      section,
      order,
    })),
  );
  const sourcePaths = Object.fromEntries(
    allConcepts.map((c) => [c.slug, c.sourcePath]),
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${redaction.variable} ${redaction70.variable} ${redaction50.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            url: SITE_URL,
            author: { "@type": "Person", name: "Gustavo Fior", url: "https://gustavofior.com" },
          }}
        />
        <Providers>
          <SiteShell sections={sections} sourcePaths={sourcePaths}>
            {children}
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
