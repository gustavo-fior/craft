"use client";

import { useEffect, useRef, useState } from "react";
import { locales, localeDetails, localizedPath, splitLocalePath, languageTag } from "@/i18n/locales";
import { useUiLanguage } from "./ui-language";

export function LanguageSwitcher({ pathname }: { pathname: string }) {
  const { locale, messages } = useUiLanguage();
  const details = useRef<HTMLDetailsElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
    if (details.current) details.current.open = false;
  }, [pathname]);

  return (
    <details ref={details} className="relative" onKeyDown={(event) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false;
        details.current.querySelector("summary")?.focus();
        event.stopPropagation();
      }
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget) && details.current) details.current.open = false;
    }}>
      <summary aria-label={`${messages.language}: ${localeDetails[locale].name} (${locale.toUpperCase()})`}
        className="flex min-h-8 min-w-8 cursor-pointer list-none items-center justify-center rounded-md px-2 text-xs font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&::-webkit-details-marker]:hidden">
        {locale.toUpperCase()}
      </summary>
      <nav aria-label={messages.language} className="absolute right-0 top-full z-50 mt-2 min-w-36 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
        {locales.map((target) => (
          <a key={target} href={`${localizedPath(target, splitLocalePath(pathname).pathname)}${search}`}
            hrefLang={languageTag(target)} lang={languageTag(target)} aria-current={target === locale ? "true" : undefined}
            className="flex min-h-10 items-center justify-between gap-4 rounded-md px-3 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground">
            {localeDetails[target].name}
            {target === locale && <span aria-hidden="true">✓</span>}
          </a>
        ))}
      </nav>
    </details>
  );
}
