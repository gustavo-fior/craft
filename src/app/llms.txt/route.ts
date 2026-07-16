import { allConcepts } from "content-collections";

import { SECTIONS } from "@/lib/sections";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} Each concept is a short explainer with an interactive demo, written by Gustavo Fior.`,
    "",
  ];

  for (const section of SECTIONS) {
    const concepts = allConcepts
      .filter((c) => c.section === section)
      .sort((a, b) => a.order - b.order);
    if (concepts.length === 0) continue;
    lines.push(`## ${section}`, "");
    for (const concept of concepts) {
      lines.push(
        `- [${concept.title}](${SITE_URL}/${concept.slug}): ${concept.description}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Pages",
    "",
    `- [GOATs](${SITE_URL}/goats): The design engineers whose writing and work shaped this site.`,
    `- [Resources](${SITE_URL}/resources): Tools, references, and reading for design engineering.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
