import { codeToHtml, type BundledLanguage } from "shiki";

import { CodeBlockClient } from "@/components/app/code-block-client";

export type CodeTab = {
  label: string;
  language: BundledLanguage;
  code: string;
  icon?: "css" | "tailwind";
};

export async function CodeBlock({ tabs }: { tabs: CodeTab[] }) {
  if (tabs.length === 0) return null;

  const highlightedTabs = await Promise.all(
    tabs.map(async (tab) => ({
      label: tab.label,
      code: tab.code.trim(),
      icon: tab.icon,
      html: await codeToHtml(tab.code.trim(), {
        lang: tab.language,
        themes: { light: "github-light", dark: "vesper" },
        defaultColor: false,
      }),
    })),
  );

  return <CodeBlockClient tabs={highlightedTabs} />;
}
