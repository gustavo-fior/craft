"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { playSound, progressionDetune } from "@/lib/sounds";
import type { NavSection } from "@/lib/sections";
import { SectionIcon, sectionDotColors } from "@/components/app/section-icon";

function ActiveDot({ layoutId, color }: { layoutId: string; color: string }) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={cn(
        "absolute left-0 top-[calc(50%-2px)] size-1 rounded-full",
        color
      )}
    />
  );
}

export function SidebarNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();
  // The nav renders twice (sidebar + mobile sheet) - keep the dot's
  // shared-layout animation scoped to each instance.
  const dotId = useId();

  // Flat position of each concept in the nav, so hover pitch rises gently
  // as you move down the list ("Index" is step 0).
  let step = 0;

  return (
    <nav
      aria-label="Concepts"
      className="fade-mask-y scrollbar-hidden h-full md:h-[80vh] overflow-y-auto md:py-[5vh] py-[2.8vh]"
    >
      <ul className="flex flex-col gap-1 text-xs">
        {[
          { href: "/", label: "Index" },
          { href: "/goats", label: "GOATs" },
          { href: "/resources", label: "Resources" },
        ].map((page) => {
          const active = pathname === page.href;
          return (
            <li key={page.href} className="relative">
              {active && <ActiveDot layoutId={dotId} color="bg-foreground" />}
              <Link
                href={page.href}
                onClick={() => playSound("tick")}
                onMouseEnter={() => playSound("hover", { detune: 0 })}
                className={cn(
                  "inline-block py-1 transition-[color,translate] duration-200",
                  active
                    ? "translate-x-2.5 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
        {sections.map(({ section, concepts }) => (
          <li key={section} className="mt-5">
            <div className="flex items-center gap-1.5 py-1 text-foreground">
              <SectionIcon section={section} size={13} className="mb-px" />
              <span>{section}</span>
            </div>
            <ul className="flex flex-col mt-1">
              {concepts.map((concept) => {
                const active = pathname === `/${concept.slug}`;
                step += 1;
                const detune = progressionDetune(step);
                return (
                  <li key={concept.slug} className="relative">
                    {active && (
                      <ActiveDot
                        layoutId={dotId}
                        color={sectionDotColors[section]}
                      />
                    )}
                    <Link
                      href={`/${concept.slug}`}
                      onClick={() => playSound("tick")}
                      onMouseEnter={() => playSound("hover", { detune })}
                      className={cn(
                        "inline-block py-1 transition-[color,translate] duration-200",
                        active
                          ? "translate-x-2.5 text-foreground"
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
