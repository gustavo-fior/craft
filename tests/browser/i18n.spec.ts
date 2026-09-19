import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("legacy English pages and agent exports remain available", async ({ request }) => {
  for (const pathname of ["/", "/goats", "/resources", "/llms.txt", "/llms-full.txt", "/robots.txt", "/sitemap.xml", "/icon.png", "/og/index", "/tabular-numbers.md"]) {
    const response = await request.get(pathname);
    expect(response.status(), pathname).toBe(200);
  }
  const fullText = await (await request.get("/llms-full.txt")).text();
  expect(fullText).toContain("Tabular Numbers");
  expect(fullText).not.toContain("cifras tabulares");
});

test("language selection works by keyboard and keeps the article and query", async ({ page }) => {
  await page.goto("/tabular-numbers?ref=language-test");
  const switcher = page.locator("summary");
  await switcher.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Language", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(switcher).toBeFocused();
  await page.keyboard.press("Space");
  const spanish = page.getByRole("link", { name: "Español", exact: true });
  await spanish.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL("/es/tabular-numbers?ref=language-test");
  await expect(page.locator("html")).toHaveAttribute("lang", "es-ES");
  await expect(page.locator("main article")).toHaveAttribute("lang", "es-ES");
  await expect(page.locator("h1")).toContainText("cifras tabulares");
  await expect(page.getByText("12.441", { exact: true })).toBeVisible();
  await expect(page.getByText(/\+8,10\s%/, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Craft", exact: true })).toHaveAttribute("href", "/es");
});

test("initial HTML contains translated text and reciprocal canonical/SEO signals", async ({ request }) => {
  const response = await request.get("/es/tabular-numbers");
  const html = await response.text();

  expect(response.status()).toBe(200);
  expect(response.headers()["x-nextjs-prerender"].split(", ")).toContain("1");
  expect(html).toContain('lang="es-ES"');
  expect(html).toContain('rel="canonical" href="https://craft.gustavofior.com/es/tabular-numbers"');
  expect(html).toContain('hrefLang="en" href="https://craft.gustavofior.com/tabular-numbers"');
  expect(html).toContain('hrefLang="es-ES" href="https://craft.gustavofior.com/es/tabular-numbers"');
  expect(html).toContain('"inLanguage":"es-ES"');
  const english = await request.get("/tabular-numbers", { headers: { "Accept-Language": "es" } });
  expect(english.status()).toBe(200);
  expect(await english.text()).toContain('lang="en"');
});

test("Markdown negotiation, explicit extension, legacy URLs and invalid routes", async ({ request }) => {
  const negotiated = await request.get("/es/tabular-numbers", { headers: { Accept: "text/markdown" } });
  const explicit = await request.get("/es/tabular-numbers.md");

  expect(negotiated.status()).toBe(200);
  expect(negotiated.headers()["content-type"]).toContain("text/markdown");
  expect(negotiated.headers()["content-language"]).toBe("es-ES");
  expect(negotiated.headers().link).toContain("https://craft.gustavofior.com/es/tabular-numbers");
  expect(await negotiated.text()).toBe(await explicit.text());
  expect((await request.get("/tabular-numbers.md")).status()).toBe(200);
  expect((await request.get("/es/not-a-concept")).status()).toBe(404);
  expect((await request.get("/fr/tabular-numbers")).status()).toBe(404);
  expect((await request.get("/og/tabular-numbers")).headers()["content-type"]).toContain("image/png");
});

test("navigation and search stay in the selected language", async ({ page }) => {
  await page.goto("/es");
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByRole("combobox").fill("cifras tabulares");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/es/tabular-numbers");
  await page.locator("main nav").getByRole("link").click();
  await expect(page).toHaveURL("/es/optical-alignment");
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`language control passes axe in ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/es/tabular-numbers");
    await page.locator("summary").click();

    const results = await new AxeBuilder({ page })
      .include("details")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("mobile navigation, language control and narrow-screen reflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/es/tabular-numbers");
  await page.getByRole("button", { name: "Abrir navegación" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar", exact: true }).click();
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir navegación" })).toBeFocused();
  const tableHeading = page.getByText("Proyecto", { exact: true }).locator("..");
  expect(await tableHeading.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.getByRole("button", { name: "Copiar como Markdown", exact: true }).focus();
  await expect(page.locator('[data-slot="tooltip-content"]')).toBeVisible();
  const reflow = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowing: [...document.querySelectorAll("body *")]
      .filter((element) => element.getBoundingClientRect().right > window.innerWidth)
      .map((element) => ({ tag: element.tagName, classes: element.getAttribute("class"), right: element.getBoundingClientRect().right })),
  }));
  expect(reflow.scrollWidth, JSON.stringify(reflow)).toBeLessThanOrEqual(reflow.width);
});

test("article, language links and metadata work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3125/es/tabular-numbers");
  await page.locator("summary").click();
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3125/tabular-numbers");
  await expect(page.locator("h1")).toHaveText("Tabular Numbers");
  await context.close();
});

test("published Spanish articles expose translated content, code language and sitemap entries", async ({ request }) => {
  const slugs = ["tabular-numbers", "optical-alignment", "noise", "nested-border-radius", "html-background", "hover-restraint", "image-outlines"];
  const sitemap = await (await request.get("/sitemap.xml")).text();

  for (const slug of slugs) {
    const response = await request.get(`/es/${slug}`);
    const html = await response.text();

    expect(response.status(), slug).toBe(200);
    expect(html, slug).toContain('<article lang="es-ES"');
    expect(html, slug).toContain('lang="en"');
    expect(html, slug).toContain(`rel="canonical" href="https://craft.gustavofior.com/es/${slug}"`);
    expect(sitemap, slug).toContain(`<loc>https://craft.gustavofior.com/es/${slug}</loc>`);
  }
  expect(sitemap).not.toContain("/es/easings");
  const image = await request.get("/og/tabular-numbers/es");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
});
