import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

type ResourceInput = {
  url: string;
  title: string | null;
  description: string | null;
};

export type Resource = {
  url: string;
  domain: string;
  title: string;
  description?: string;
};

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .trim();
}

function extractMeta(html: string, property: string) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1]);
  }
  return undefined;
}

// Fetches a resource's title/description at build time. Manual frontmatter
// values always win; network failures fall back to the bare domain, so an
// offline build or dead link never breaks anything.
async function resolveResource(input: ResourceInput): Promise<Resource> {
  const domain = new URL(input.url).hostname.replace(/^www\./, "");
  let title = input.title ?? undefined;
  let description = input.description ?? undefined;

  if (!title || !description) {
    try {
      const res = await fetch(input.url, {
        signal: AbortSignal.timeout(8000),
        headers: { "user-agent": "craft.gustavofior.com resource resolver" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = (await res.text()).slice(0, 200_000);
      if (!title) {
        title =
          extractMeta(html, "og:title") ??
          (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]
            ? decodeEntities(html.match(/<title[^>]*>([^<]*)<\/title>/i)![1])
            : undefined);
      }
      if (!description) {
        description =
          extractMeta(html, "og:description") ??
          extractMeta(html, "description");
      }
    } catch {
      // Unreachable at build time — fall through to domain fallback.
    }
  }

  return {
    url: input.url,
    domain,
    title: (title ?? domain).replace(/\s+/g, " ").trim(),
    description: description?.replace(/\s+/g, " ").trim(),
  };
}

const concepts = defineCollection({
  name: "concepts",
  directory: "content",
  include: "**/*.mdx",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string(),
    section: z.enum([
      "Typography",
      "Color",
      "Layout",
      "Motion",
      "Sound",
      "Data",
      "Craft",
    ]),
    order: z.number().default(0),
    publishedAt: z.string(),
    resources: z
      .array(
        z.object({
          url: z.string().url(),
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .default([]),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const slug = document._meta.fileName.replace(/\.mdx$/, "");
    const resources = await Promise.all(
      document.resources.map((resource) =>
        context.cache(
          {
            url: resource.url,
            title: resource.title ?? null,
            description: resource.description ?? null,
          },
          resolveResource,
        ),
      ),
    );
    return {
      ...document,
      slug,
      sourcePath: document._meta.filePath,
      resources,
      mdx,
    };
  },
});

export default defineConfig({
  content: [concepts],
});
