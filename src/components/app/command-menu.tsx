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
      <CommandInput
        placeholder="Search..."
        className="border-b pb-3 border-border/50"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => go("/")}>Index</CommandItem>
          <CommandItem onSelect={() => go("/goats")}>GOATs</CommandItem>
          <CommandItem onSelect={() => go("/resources")}>Resources</CommandItem>
        </CommandGroup>
        {sections.map(({ section, concepts }) => (
          <CommandGroup key={section} heading={section}>
            {concepts.map((concept) => {
              const available = isConceptAvailable(concept.slug);
              return (
                <CommandItem
                  key={concept.slug}
                  disabled={!available}
                  title={available ? undefined : "Coming soon"}
                  onSelect={
                    available ? () => go(`/${concept.slug}`) : undefined
                  }
                >
                  <SectionIcon section={section} className="size-3.5" />
                  {concept.title}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
