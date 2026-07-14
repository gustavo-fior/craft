import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const concepts = defineCollection({
  name: "concepts",
  directory: "content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(["Typography", "Color", "Layout", "Motion", "Sound"]),
    order: z.number().default(0),
    publishedAt: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const slug = document._meta.fileName.replace(/\.mdx$/, "");
    return {
      ...document,
      slug,
      sourcePath: document._meta.filePath,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [concepts],
});
