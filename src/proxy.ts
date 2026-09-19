import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { splitLocalePath } from "@/i18n/locales";

// Serves the Markdown version of a concept at `/<slug>.md`, and to any client
// that asks for `text/markdown` via the Accept header. Both rewrite to the
// prerendered route handler at `/md/<locale>/<slug>`.

const NON_CONCEPT_PAGES = new Set(["goats", "resources"]);

export function prefersMarkdown(accept: string | null) {
  if (!accept) return false;
  let markdown = -1;
  let html = -1;
  accept.split(",").forEach((entry, index) => {
    const [type, ...params] = entry.trim().split(";");
    const q = Number(
      params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1,
    );
    if (q <= 0) return;
    // Earlier entries win ties, so fold position into the score.
    const score = q * 1000 - index;
    if (type.trim() === "text/markdown") markdown = score;
    if (type.trim() === "text/html") html = score;
  });
  return markdown > html;
}

const handleLocale = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { locale, pathname } = splitLocalePath(request.nextUrl.pathname);

  const explicit = pathname.match(/^\/([\w-]+)\.md$/);
  if (explicit) {
    const url = request.nextUrl.clone();
    if (request.nextUrl.pathname.startsWith("/en/")) {
      url.pathname = pathname;
      return NextResponse.redirect(url, 308);
    }
    url.pathname = `/md/${locale}/${explicit[1]}`;
    return NextResponse.rewrite(url);
  }

  const page = pathname.match(/^\/([\w-]+)$/);
  if (
    page &&
    !NON_CONCEPT_PAGES.has(page[1]) &&
    prefersMarkdown(request.headers.get("accept"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/md/${locale}/${page[1]}`;
    return NextResponse.rewrite(url);
  }

  return handleLocale(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|md(?:/|$)|og(?:/|$)|.*\\..*).*)",
    "/:slug.md",
    "/:locale/:slug.md",
  ],
};
