import { GITHUB_URL, SITE_URL } from "./site";
import { localizedPath, splitLocalePath, type Locale } from "../i18n/locales";
import { englishUi } from "../i18n/ui";
type MarkdownLabels = typeof englishUi.markdown;

// Converts a concept's MDX into plain Markdown for agents: `<CodeBlock>` tabs
// become fenced code blocks, `<LinkList>` becomes a bullet list, and every
// other flow-level component (the interactive demos) becomes a one-line note
// pointing back at the web page. Shared by the `.md` routes, llms-full.txt,
// and the skill builder, so all three stay in sync.

export type MarkdownConcept = {
  title: string;
  description: string;
  section: string;
  slug: string;
  publishedAt: string;
  content: string;
  sourcePath?: string;
  resources: { url: string; title: string; description?: string }[];
};

type CodeTab = { label: string; language: string; code: string };

// Template literal bodies in MDX props: `\`` and `\\` and `\$` are escapes.
const TEMPLATE_BODY = /`((?:\\[\s\S]|[^`\\])*)`/g;

function unescapeTemplate(body: string) {
  return body.replace(/\\([`\\$])/g, "$1");
}

function attr(source: string, name: string) {
  return new RegExp(`\\b${name}:\\s*"([^"]*)"`).exec(source)?.[1];
}

function parseTabs(attrs: string): CodeTab[] {
  const tabs: CodeTab[] = [];
  const codeRe = new RegExp(`code:\\s*${TEMPLATE_BODY.source}`, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = codeRe.exec(attrs))) {
    const head = attrs.slice(last, match.index);
    tabs.push({
      label: attr(head, "label") ?? "",
      language: attr(head, "language") ?? "",
      code: unescapeTemplate(match[1]).trim(),
    });
    last = codeRe.lastIndex;
  }
  return tabs;
}

function fence(code: string, language: string) {
  const longest = Math.max(3, ...[...code.matchAll(/`+/g)].map((m) => m[0].length + 1));
  const ticks = "`".repeat(longest);
  return `${ticks}${language}\n${code}\n${ticks}`;
}

function renderCodeBlock(attrs: string) {
  const tabs = parseTabs(attrs);
  if (tabs.length === 0) return "";
  if (tabs.length === 1) return fence(tabs[0].code, tabs[0].language);
  return tabs
    .map((tab) => `**${tab.label}**\n\n${fence(tab.code, tab.language)}`)
    .join("\n\n");
}

function renderLinkList(attrs: string) {
  const items: string[] = [];
  const objects = attrs.split(/\{/).slice(1);
  for (const object of objects) {
    const url = attr(object, "url");
    if (!url) continue;
    const title = attr(object, "title") ?? new URL(url).hostname;
    const description = attr(object, "description");
    items.push(`- [${title}](${url})${description ? `: ${description}` : ""}`);
  }
  return items.join("\n");
}

function humanize(componentName: string) {
  return componentName
    .replace(/Demo$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}

function renderDemo(name: string, pageUrl: string, labels: MarkdownLabels) {
  return `> **${labels.demo}: ${humanize(name)}.** ${labels.openDemo.replace("{url}", pageUrl)}`;
}

// Finds the end of a flow-level self-closing JSX tag starting at `start`,
// skipping over string and template literals so a `/>` inside a code sample
// does not end the tag early.
function findTagEnd(source: string, start: number) {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === "`" || ch === '"' || ch === "'") {
      i++;
      while (i < source.length && source[i] !== ch) {
        if (source[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === "/" && source[i + 1] === ">" && depth === 0) return i + 2;
  }
  return -1;
}

const FLOW_TAG = /^<([A-Z][A-Za-z0-9]*)\b/gm;

export function mdxToMarkdown(content: string, pageUrl: string, labels: MarkdownLabels = englishUi.markdown) {
  let out = "";
  let cursor = 0;
  let match: RegExpExecArray | null;
  FLOW_TAG.lastIndex = 0;
  while ((match = FLOW_TAG.exec(content))) {
    if (match.index < cursor) continue;
    const end = findTagEnd(content, match.index);
    if (end === -1) break;
    const name = match[1];
    const attrs = content.slice(match.index + match[0].length, end);
    const replacement =
      name === "CodeBlock"
        ? renderCodeBlock(attrs)
        : name === "LinkList"
          ? renderLinkList(attrs)
          : renderDemo(name, pageUrl, labels);
    out += content.slice(cursor, match.index) + replacement;
    cursor = end;
    FLOW_TAG.lastIndex = end;
  }
  out += content.slice(cursor);

  const interfaceLocale = splitLocalePath(new URL(pageUrl).pathname).locale;
  return out
    // Root-relative links become absolute so they resolve outside the site.
    .replace(/\]\((\/(?!\/)[^\s)]+)\)/g, (_match, href: string) => {
      const url = new URL(href, SITE_URL);
      url.pathname = localizedPath(interfaceLocale, splitLocalePath(url.pathname).pathname);
      return `](${url.href})`;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function conceptUrl(slug: string) {
  return `${SITE_URL}/${slug}`;
}

export function conceptMarkdown(concept: MarkdownConcept, options?: { pageUrl: string; canonicalUrl: string; locale: Locale; labels: MarkdownLabels }) {
  const url = options?.pageUrl ?? conceptUrl(concept.slug);
  const labels = options?.labels ?? englishUi.markdown;
  const lines = [
    `# ${concept.title}`,
    "",
    `> ${concept.description}`,
    "",
    `- ${labels.section}: ${concept.section}`,
    `- URL: ${url}`,
    `- ${labels.published}: ${concept.publishedAt}`,
  ];
  if (options) lines.push(`- ${labels.language}: ${options.locale}`, `- Canonical: ${options.canonicalUrl}`);
  if (concept.sourcePath) {
    lines.push(`- ${labels.source}: ${GITHUB_URL}/blob/main/content/${concept.sourcePath}`);
  }
  lines.push("", mdxToMarkdown(concept.content, url, labels));

  if (concept.resources.length > 0) {
    lines.push("", `## ${labels.resources}`, "");
    for (const resource of concept.resources) {
      lines.push(
        `- [${resource.title}](${resource.url})${resource.description ? `: ${resource.description}` : ""}`,
      );
    }
  }

  return lines.join("\n") + "\n";
}
