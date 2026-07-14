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

export function CommandMenu({ sections }: { sections: NavSection[] }) {
  const router = useRouter();
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
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search concepts">
      <CommandInput placeholder="Search concepts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/")}>Index</CommandItem>
        </CommandGroup>
        {sections.map(({ section, concepts }) => (
          <CommandGroup key={section} heading={section}>
            {concepts.map((concept) => (
              <CommandItem
                key={concept.slug}
                onSelect={() => go(`/${concept.slug}`)}
              >
                <SectionIcon section={section} className="size-4" />
                {concept.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
