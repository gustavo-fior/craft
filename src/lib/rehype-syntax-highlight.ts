import { codeToHast, type BundledLanguage } from "shiki";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textContent(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return node.children?.map(textContent).join("") ?? "";
}

function languageFrom(node: HastNode): BundledLanguage | undefined {
  const className = node.properties?.className;
  const classes = Array.isArray(className)
    ? className.map(String)
    : typeof className === "string"
      ? className.split(" ")
      : [];
  const languageClass = classes.find((name) => name.startsWith("language-"));
  return languageClass?.slice("language-".length) as
    | BundledLanguage
    | undefined;
}

function inlineLanguageFrom(code: string): BundledLanguage {
  if (/^<[^>]+>/.test(code)) return "html";

  if (
    /^:/.test(code) ||
    /(^|[;{]\s*)--?[a-z-]+\s*:/.test(code) ||
    /^[a-z-]+\s*:/.test(code) ||
    /\b(?:circle|env|grayscale|inset|oklch|rgba|scale)\(/.test(code) ||
    /^[+-]?(?:\d*\.)?\d+(?:em|px|rem|%)/.test(code) ||
    /^[a-z]+(?:-[a-z]+)+$/.test(code)
  ) {
    return "css";
  }

  return "tsx";
}

/** Highlight fenced and inline MDX code during content compilation. */
export function rehypeSyntaxHighlight() {
  return async (tree: HastNode) => {
    async function visit(node: HastNode): Promise<void> {
      const code = node.children?.[0];

      if (node.tagName === "pre" && code?.tagName === "code") {
        const language = languageFrom(code);
        if (!language) return;

        const highlighted = await codeToHast(textContent(code).replace(/\n$/, ""), {
          lang: language,
          themes: { light: "github-light", dark: "vesper" },
          defaultColor: false,
        });
        const pre = highlighted.children[0] as HastNode;
        node.properties = pre.properties;
        node.children = pre.children;
        return;
      }

      if (node.tagName === "code") {
        const source = textContent(node);
        const highlighted = await codeToHast(source, {
          lang: languageFrom(node) ?? inlineLanguageFrom(source),
          themes: { light: "github-light", dark: "vesper" },
          defaultColor: false,
        });
        const pre = highlighted.children[0] as HastNode;
        const highlightedCode = pre.children?.[0];
        const line = highlightedCode?.children?.[0];
        const className = node.properties?.className;
        const classes = Array.isArray(className)
          ? className.map(String)
          : typeof className === "string"
            ? className.split(" ")
            : [];

        node.properties = {
          ...node.properties,
          className: [...classes, "shiki-inline"],
          style: pre.properties?.style,
        };
        node.children = line?.children ?? highlightedCode?.children ?? [];
        return;
      }

      await Promise.all(node.children?.map(visit) ?? []);
    }

    await visit(tree);
  };
}
