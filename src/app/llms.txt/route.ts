import { allConcepts } from "content-collections";

import { SECTIONS } from "@/lib/sections";
import { isConceptAvailable } from "@/lib/concepts";
import {
  GITHUB_REPO,
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} Each concept is a short explainer with an interactive demo, written by Gustavo Fior.`,
    "",
    `Every concept is available as Markdown by appending \`.md\` to its URL (links below already do). The full text of every concept in one file is at ${SITE_URL}/llms-full.txt.`,
    "",
  ];

  for (const section of SECTIONS) {
    const concepts = allConcepts
      .filter(
        (c) => c.locale === "en" && c.section === section && isConceptAvailable(c.slug),
      )
      .sort((a, b) => a.order - b.order);
    if (concepts.length === 0) continue;
    lines.push(`## ${section}`, "");
    for (const concept of concepts) {
      lines.push(
        `- [${concept.title}](${SITE_URL}/${concept.slug}.md): ${concept.description}`,
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
    "## Agents",
    "",
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): Every concept in full, in one Markdown file.`,
    `- [Craft skill](${GITHUB_URL}/tree/main/skills/craft-design-engineering): Install with \`npx skills add ${GITHUB_REPO}\` to give your coding agent these concepts as a checklist.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
