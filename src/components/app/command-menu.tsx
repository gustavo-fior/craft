"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SectionIcon } from "@/components/app/section-icon";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { NavSection } from "@/lib/sections";
import { playSound } from "@/lib/sounds";
import { isConceptAvailable } from "@/lib/concepts";
import { localizedPath, languageTag } from "@/i18n/locales";
import { useUiLanguage } from "./ui-language";

export function CommandMenu({ sections }: { sections: NavSection[] }) {
  const router = useRouter();
  const { locale, messages } = useUiLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    playSound("tick");
    router.push(localizedPath(locale, href));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title={messages.searchTitle} description={messages.searchTitle}>
      <CommandInput
        placeholder={messages.search}
        className="border-b pb-3 border-border/50"
      />
      <CommandList>
        <CommandEmpty>{messages.noResults}</CommandEmpty>
        <CommandGroup heading={messages.pages}>
          <CommandItem onSelect={() => go("/")}>{messages.index}</CommandItem>
          <CommandItem onSelect={() => go("/goats")}>{messages.goats}</CommandItem>
          <CommandItem onSelect={() => go("/resources")}>{messages.resources}</CommandItem>
        </CommandGroup>
        {sections.map(({ section, concepts }) => (
          <CommandGroup key={section} heading={messages.sections[section]}>
            {concepts.map((concept) => {
              const available = isConceptAvailable(concept.slug);
              return (
                <CommandItem
                  key={concept.slug}
                  disabled={!available}
                  title={available ? undefined : messages.comingSoon}
                  onSelect={
                    available ? () => go(`/${concept.slug}`) : undefined
                  }
                >
                  <SectionIcon section={section} className="size-3.5" />
                  <span lang={languageTag(concept.contentLocale ?? locale)}>{concept.title}</span>
                  {concept.untranslated && <span className="text-xs text-muted-foreground">({messages.inEnglish})</span>}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
