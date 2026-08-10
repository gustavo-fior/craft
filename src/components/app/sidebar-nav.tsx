"use client";

import { SparkleIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { playSound, progressionDetune } from "@/lib/sounds";
import type { NavSection } from "@/lib/sections";
import { isConceptAvailable } from "@/lib/concepts";
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

export function SidebarNav({
  sections,
  className,
}: {
  sections: NavSection[];
  className?: string;
}) {
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
      // py-12 matches the 3rem fade-mask-y stops, so at rest the list sits
      // fully inside the opaque zone and only overflow fades at the edges.
      className={cn(
        "fade-mask-y scrollbar-hidden overflow-y-auto py-12",
        className
      )}
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
                  "inline-block rounded-[3px] py-1 outline-none transition-[color,translate] duration-200 focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-ring/60",
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
                const available = isConceptAvailable(concept.slug);
                const active = available && pathname === `/${concept.slug}`;
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
                    {available ? (
                      <Link
                        href={`/${concept.slug}`}
                        onClick={() => playSound("tick")}
                        onMouseEnter={() => playSound("hover", { detune })}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-[3px] py-1 outline-none transition-[color,translate] duration-200 focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-ring/60",
                          active
                            ? "translate-x-3 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{concept.title}</span>
                        <span className="new-badge inline-flex items-center rounded-full ml-0.5 bg-green-100 px-1.5 py-px text-[8px] text-green-600 dark:bg-green-950 dark:text-green-400 shadow-(--custom-shadow-green)">
                          New
                        </span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        title="Coming soon"
                        className="inline-block cursor-not-allowed py-1 text-muted-foreground/40 select-none"
                      >
                        {concept.title}
                      </span>
                    )}
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
