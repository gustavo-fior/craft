"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sounds";
import type { NavSection } from "@/lib/sections";
import { SectionIcon } from "@/components/app/section-icon";

export function SidebarNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Concepts"
      className="fade-mask-y scrollbar-hidden h-[80vh] overflow-y-auto md:py-[5vh] py-[2.8vh]"
    >
      <ul className="flex flex-col gap-1 text-xs">
        <li>
          <Link
            href="/"
            onClick={() => playSound("tick")}
            className={cn(
              "inline-block py-1 transition-colors",
              pathname === "/"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Index
          </Link>
        </li>
        {sections.map(({ section, concepts }) => (
          <li key={section} className="mt-5">
            <div className="flex items-center gap-1.5 py-1 text-foreground">
              <SectionIcon
                section={section}
                size={13}
                className="mb-px"
              />
              <span>{section}</span>
            </div>
            <ul className="flex flex-col">
              {concepts.map((concept) => {
                const active = pathname === `/${concept.slug}`;
                return (
                  <li key={concept.slug}>
                    <Link
                      href={`/${concept.slug}`}
                      onClick={() => playSound("tick")}
                      className={cn(
                        "inline-block py-1 transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {concept.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
