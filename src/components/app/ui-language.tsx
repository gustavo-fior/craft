"use client";

import { createContext, useContext, type ReactNode } from "react";
import { englishUi, type UiMessages } from "@/i18n/ui";
import type { Locale } from "@/i18n/locales";

const UiLanguage = createContext<{ locale: Locale; messages: UiMessages }>({
  locale: "en", messages: englishUi,
});

export function UiLanguageProvider({ locale, messages, children }: {
  locale: Locale; messages: UiMessages; children: ReactNode;
}) {
  return <UiLanguage value={{ locale, messages }}>{children}</UiLanguage>;
}

export function useUiLanguage() {
  return useContext(UiLanguage);
}
