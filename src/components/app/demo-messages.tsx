"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/i18n/locales";

const DemoMessages = createContext<Readonly<Record<string, string>>>({});
const DemoLocale = createContext<Locale>(defaultLocale);

export function DemoMessagesProvider({ locale, messages, children }: {
  locale: Locale;
  messages: Readonly<Record<string, string>>;
  children: ReactNode;
}) {
  return <DemoLocale value={locale}><DemoMessages value={messages}>{children}</DemoMessages></DemoLocale>;
}

export function useDemoLocale() {
  return useContext(DemoLocale);
}

// Only the active article's labels cross the server boundary; Remotion uses English defaults.
export function useDemoText() {
  const messages = useContext(DemoMessages);
  return (source: string, values: Record<string, string | number> = {}) =>
    (messages[source] ?? source).replace(/\{(\w+)\}/g, (token, key: string) =>
      key in values ? String(values[key]) : token,
    );
}
