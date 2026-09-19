import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { z } from "zod";

import { defaultLocale, isLocale, locales, type Locale } from "../src/i18n/locales";
import { sourceRevision } from "../src/i18n/source-revision";
import { SECTIONS } from "../src/lib/sections";

type TranslationStatus = "missing" | "current" | "outdated";

const revisionSchema = z.object({
  sourceRevision: z.string().regex(/^[a-f0-9]{64}$/).optional(),
});

export function translationStatus(sourceHash: string, translation: string | undefined): TranslationStatus {
  if (translation === undefined) return "missing";
  const { sourceRevision: reviewedRevision } = revisionSchema.parse(matter(translation).data);
  return reviewedRevision === sourceHash ? "current" : "outdated";
}

async function readTranslation(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log(`Usage: bun scripts/translation-status.ts [${locales.join("|")}]`);
    return;
  }
  const requested = args[0];
  if (args.length > 1) {
    throw new Error(`Expected one registered locale (${locales.join(", ")}), or no argument for all locales.`);
  }
  let selectedLocales: readonly Locale[] = locales;
  if (requested !== undefined) {
    if (!isLocale(requested)) throw new Error(`Unknown locale: ${requested}. Registered locales: ${locales.join(", ")}.`);
    selectedLocales = [requested];
  }
  const contentDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content");
  const sources = [];
  for (const section of SECTIONS) {
    const directory = section.toLowerCase();
    for (const file of await readdir(path.join(contentDirectory, directory))) {
      if (file.endsWith(".mdx")) sources.push(`${directory}/${file}`);
    }
  }
  sources.sort();

  const totals = selectedLocales.map((locale) => ({ locale, missing: 0, current: 0, outdated: 0 }));
  const pathWidth = Math.max("Article".length, ...sources.map((source) => source.length));
  console.log(`${"Article".padEnd(pathWidth)}  ${selectedLocales.map((locale) => locale.padEnd(8)).join("  ")}  Source SHA256`);

  for (const source of sources) {
    const original = await readFile(path.join(contentDirectory, source), "utf8");
    const hash = sourceRevision(original);
    const states = await Promise.all(selectedLocales.map(async (locale) => {
      if (locale === defaultLocale) return "current";
      const translation = await readTranslation(path.join(contentDirectory, locale, source));
      try {
        return translationStatus(hash, translation);
      } catch (error) {
        throw new Error(`Invalid translation frontmatter: content/${locale}/${source}`, { cause: error });
      }
    }));
    states.forEach((state, index) => { totals[index][state] += 1; });
    console.log(`${source.padEnd(pathWidth)}  ${states.map((state) => state.padEnd(8)).join("  ")}  ${hash}`);
  }

  console.log("");
  for (const { locale, current, missing, outdated } of totals) {
    console.log(`${locale}: ${current} current, ${missing} missing, ${outdated} outdated (${sources.length} originals)`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
