import "server-only";
import { englishUi, type UiMessages } from "./ui";
import type { Locale } from "./locales";
import { spanishPageCopy } from "./messages/es-pages";
import { englishPageCopy, type PageCopyKey, type PageMessages } from "./messages/en-pages";

const spanishUi: UiMessages = {
  index: "Índice",
  resources: "Recursos",
  goats: "Referentes",
  navigation: "Navegación",
  openNavigation: "Abrir navegación",
  close: "Cerrar",
  concepts: "Conceptos",
  searchTitle: "Buscar conceptos",
  search: "Buscar…",
  noResults: "No se han encontrado resultados.",
  pages: "Páginas",
  comingSoon: "Próximamente",
  soon: "Pronto",
  new: "Nuevo",
  inEnglish: "En inglés",
  copyLink: "Copiar enlace",
  copyMarkdown: "Copiar como Markdown",
  viewRepo: "Ver en el repositorio",
  theme: "Tema",
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
  mute: "Silenciar sonidos",
  unmute: "Activar sonidos",
  language: "Idioma",
  missing: "Este artículo todavía no está traducido al español. Te mostramos el original en inglés.",
  outdated: "El original en inglés se ha actualizado desde la última revisión de esta traducción.",
  readOriginal: "Leer el original actualizado en inglés",
  codeExamples: "Ejemplos de código",
  copyCode: "Copiar código",
  codeCopied: "Código copiado",
  wrong: "Incorrecto",
  right: "Correcto",
  guides: "Guías",
  translationStatus: "Estado de la traducción",
  markdown: {
    section: "Sección", published: "Publicado", source: "Fuente", resources: "Recursos", language: "Idioma",
    demo: "Demo interactiva", openDemo: "Abre {url} para probarla.",
  },
  siteDescription: "Una colección de conceptos de design engineering.",
  sections: {
    Craft: "Craft",
    Typography: "Tipografía",
    Color: "Color",
    Layout: "Layout",
    Motion: "Animación",
    Sound: "Sonido",
    Data: "Datos",
  },
};

const catalogs: Record<Locale, { ui: UiMessages; pages: PageMessages }> = {
  en: { ui: englishUi, pages: englishPageCopy },
  es: { ui: spanishUi, pages: spanishPageCopy },
};

export function getUiMessages(locale: Locale): UiMessages {
  return catalogs[locale].ui;
}

export function pageCopy(locale: Locale, key: PageCopyKey) {
  return catalogs[locale].pages[key];
}
