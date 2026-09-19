import { allConcepts } from "content-collections";

import { isConceptAvailable } from "@/lib/concepts";
import { conceptMarkdown } from "@/lib/markdown";
import { SECTIONS } from "@/lib/sections";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const parts: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} Each concept is a short explainer with an interactive demo, written by Gustavo Fior.`,
    "",
    `This file contains every published concept in full. The index is at ${SITE_URL}/llms.txt, and each concept is also available on its own by appending \`.md\` to its URL.`,
    "",
  ];

  for (const section of SECTIONS) {
    const concepts = allConcepts
      .filter((c) => c.locale === "en" && c.section === section && isConceptAvailable(c.slug))
      .sort((a, b) => a.order - b.order);
    for (const concept of concepts) {
      parts.push("---", "", conceptMarkdown(concept));
    }
  }

  return new Response(parts.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
