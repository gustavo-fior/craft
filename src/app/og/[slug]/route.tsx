import { renderOgImage } from "@/components/app/og-image";
import { publishedConcepts } from "@/i18n/concepts.server";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ["index", "goats", "resources", ...publishedConcepts().map(({ slug }) => slug)].map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return renderOgImage((await params).slug, "en");
}
