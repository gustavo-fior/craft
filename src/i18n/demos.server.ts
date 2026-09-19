import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "./locales";
import { getUiMessages } from "./ui.server";

const messagesSchema = z.record(z.string(), z.string());

export async function getDemoMessages(locale: Locale, slug: string) {
  if (locale === "en") return {};
  const source = await readFile(path.join(process.cwd(), "src/i18n/demos", locale, `${slug}.json`), "utf8");
  const ui = getUiMessages(locale);
  return {
    Wrong: ui.wrong,
    Right: ui.right,
    Guides: ui.guides,
    ...messagesSchema.parse(JSON.parse(source)),
  };
}
