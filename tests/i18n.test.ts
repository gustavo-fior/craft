import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { resolveContent, validateContentInventory, type LocalizedContent } from "../src/i18n/content";
import { locales, localizedPath, splitLocalePath, languageTag } from "../src/i18n/locales";
import { pageMetadata } from "../src/i18n/metadata";
import { sourceRevision } from "../src/i18n/source-revision";
import { conceptMarkdown, mdxToMarkdown } from "../src/lib/markdown";

const original: LocalizedContent = { locale: "en", slug: "example", sourceHash: "source-one" };
const translated: LocalizedContent = { locale: "es", slug: "example", sourceHash: "translation-one", sourceRevision: "source-one" };

test("missing translation keeps interface language and resolves the whole English article", () => {
  const resolved = resolveContent([original], "example", "es");

  assert.equal(resolved?.state, "missing");
  assert.equal(resolved?.interfaceLocale, "es");
  assert.equal(resolved?.contentLocale, "en");
  assert.equal(resolved?.content, original);
  assert.equal(resolved?.canonicalPath, "/example");
  assert.deepEqual(resolved?.translatedLocales, ["en"]);
});

test("publishing a translation changes canonical and reciprocal alternatives", () => {
  const before = resolveContent([original], "example", "es");
  const after = resolveContent([original, translated], "example", "es");

  assert.equal(before?.canonicalPath, "/example");
  assert.equal(after?.state, "current");
  assert.equal(after?.canonicalPath, "/es/example");
  assert.deepEqual(after?.translatedLocales, ["en", "es"]);
});

test("source changes mark translations for review without discarding them", () => {
  const updated = { ...original, sourceHash: "source-two" };
  const resolved = resolveContent([updated, translated], "example", "es");

  assert.equal(resolved?.state, "outdated");
  assert.equal(resolved?.content, translated);
  assert.equal(resolved?.canonicalPath, "/es/example");
  assert.equal(resolveContent([updated, translated], "example", "en")?.state, "current");
});

test("unknown concepts, duplicate identities and orphan translations are rejected", () => {
  assert.equal(resolveContent([original], "missing", "es"), undefined);
  assert.throws(() => validateContentInventory([original, original]), /Duplicate/);
  assert.throws(() => validateContentInventory([translated]), /no English original/);
  assert.doesNotThrow(() => validateContentInventory([original, translated]));
});

test("routing helpers round-trip every registered language and preserve legacy English URLs", () => {
  for (const locale of locales) {
    for (const pathname of ["/", "/example", "/resources"]) {
      assert.deepEqual(splitLocalePath(localizedPath(locale, pathname)), { locale, pathname });
    }
  }
  assert.equal(localizedPath("en", "/example"), "/example");
  assert.equal(languageTag("es"), "es-ES");
});

test("fallback metadata does not advertise a translation or use a translated canonical", () => {
  const metadata = pageMetadata({ locale: "es", contentLocale: "en", pathname: "/example", title: "Example", description: "English article", translatedLocales: ["en"], imageSlug: "example" });

  assert.equal(metadata.alternates?.canonical, "https://craft.gustavofior.com/example");
  assert.equal(metadata.alternates?.languages, undefined);
  assert.equal(metadata.description, "English article");
});

test("real translations are self-canonical and expose only their actual alternatives", () => {
  const metadata = pageMetadata({ locale: "es", pathname: "/example", title: "Ejemplo", description: "Artículo", translatedLocales: ["en", "es"], imageSlug: "example" });

  assert.equal(metadata.alternates?.canonical, "https://craft.gustavofior.com/es/example");
  assert.deepEqual(metadata.alternates?.languages, {
    en: "https://craft.gustavofior.com/example", "es-ES": "https://craft.gustavofior.com/es/example",
  });
});

test("Markdown internal links keep the interface language, including English fallback articles", () => {
  const markdown = mdxToMarkdown("[Motion](/interruptibility?ref=article#demo) [Home](/es/) [External](https://example.com)", "https://craft.gustavofior.com/es/easings");

  assert.equal(markdown, "[Motion](https://craft.gustavofior.com/es/interruptibility?ref=article#demo) [Home](https://craft.gustavofior.com/es) [External](https://example.com)");
});

test("translations preserve provenance and current translations preserve code and resources", async () => {
  const contentDirectories = await readdir("content");
  for (const locale of locales.filter((locale) => locale !== "en" && contentDirectories.includes(locale))) {
  const translationRoot = path.join("content", locale);
  const sections = await readdir(translationRoot);
  for (const section of sections) {
    for (const filename of await readdir(path.join(translationRoot, section))) {
      if (!filename.endsWith(".mdx")) continue;
      const english = await readFile(path.join("content", section, filename), "utf8");
      const translation = await readFile(path.join(translationRoot, section, filename), "utf8");
      const source = matter(english);
      const target = matter(translation);
      const label = `${locale}/${section}/${filename}`;
      assert.match(target.data.sourceRevision, /^[a-f0-9]{64}$/, label);
      assert.equal(target.data.locale, locale, label);
      const catalog = JSON.parse(await readFile(path.join("src/i18n/demos", locale, filename.replace(/\.mdx$/, ".json")), "utf8"));
      for (const [key, value] of Object.entries(catalog)) {
        assert.equal(typeof value, "string", `${label}: ${key}`);
        assert.deepEqual(String(value).match(/\{\w+\}/g)?.sort() ?? [], key.match(/\{\w+\}/g)?.sort() ?? [], `${label}: interpolation ${key}`);
      }
      if (target.data.sourceRevision !== sourceRevision(english)) continue;
      for (const key of ["section", "order", "publishedAt"]) assert.deepEqual(target.data[key], source.data[key], `${label}: ${key}`);
      assert.deepEqual(target.content.match(/^<[A-Z]\w*/gm), source.content.match(/^<[A-Z]\w*/gm), `${label}: demo components`);
      const code = (content: string) => conceptMarkdown({ title: "", description: "", section, slug: "example", publishedAt: "", resources: [], content }).match(/```[\s\S]*?```/g);
      assert.deepEqual(code(target.content), code(source.content), `${label}: executable examples`);
      assert.deepEqual((target.data.resources ?? []).map((item: { url: string }) => item.url), (source.data.resources ?? []).map((item: { url: string }) => item.url), `${label}: resources`);
    }
  }
  }
});
