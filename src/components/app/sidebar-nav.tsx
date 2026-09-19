"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { playSound, progressionDetune } from "@/lib/sounds";
import type { NavSection } from "@/lib/sections";
import { isConceptAvailable, isConceptLaunched } from "@/lib/concepts";
import { localizedPath, splitLocalePath, languageTag } from "@/i18n/locales";
import { useUiLanguage } from "./ui-language";
import {
  SectionIcon,
  dotColorFrom,
  dotColorTo,
  type DotColor,
} from "@/components/app/section-icon";

// Flip back on to restore the "New" badge next to launched concepts.
const SHOW_NEW_BADGE = false;

// Flight time (ms) of the dot's arc and colour crossfade. The layout spring
// below settles in roughly the same window, so the three stay in step.
const DOT_FLIGHT_MS = 350;
// Moment in the flight (0-1) when the dot's arc closes on the row and "hits"
// the name. Drives the name's recoil and the colour sweep.
const DOT_IMPACT = 0.8;
const DOT_IMPACT_MS = DOT_FLIGHT_MS * DOT_IMPACT;
// Near-critically damped: spring overshoot scales with distance, so anything
// bouncier visibly sails past the target on long jumps down the list.
const DOT_SPRING = { type: "spring", stiffness: 800, damping: 52 } as const;

// How far (px) the dot bows out to the left while travelling between rows.
// Scales with distance so adjacent hops barely bend and long jumps swing wide.
const DOT_ARC_MIN = 10;
const DOT_ARC_MAX = 36;
const DOT_ARC_PER_ROW = 3;

// Where the dot sits (px) at the moment of impact: just left of the name's
// edge, which is still at x=0 until the hit shoves it right. The dot then
// follows the name in to its resting spot, so it never draws over the text.
const DOT_TOUCH_OFFSET = -5;

function arcOffset(rows: number) {
  if (rows === 0) return 0;
  return -Math.min(DOT_ARC_MAX, DOT_ARC_MIN + (rows - 1) * DOT_ARC_PER_ROW);
}

// The active name sits shoved to the right of the dot. On a hit it snaps
// out quickly and settles without bouncing; on leaving it slides back.
const NAME_RECOIL = { type: "spring", stiffness: 1000, damping: 60 } as const;
const NAME_RETURN = { type: "spring", stiffness: 900, damping: 45 } as const;

function nameTransition(active: boolean, travelling: boolean) {
  if (!active) return NAME_RETURN;
  // Wait for the dot to arrive so the name reads as pushed, not self-moving.
  return { ...NAME_RECOIL, delay: travelling ? DOT_IMPACT_MS / 1000 : 0 };
}

type Travel = { from: number; to: number };

function ActiveDot({
  layoutId,
  from,
  to,
  offset,
}: {
  layoutId: string;
  /** Colour of the row the dot is leaving (crossfaded from mid-flight). */
  from: DotColor;
  /** Colour of the row the dot lands on. */
  to: DotColor;
  /** Arc bow in px; 0 means no travel (initial mount), so no arc/crossfade. */
  offset: number;
}) {
  const travelling = offset !== 0;
  return (
    <motion.span
      layoutId={layoutId}
      // The shared-layout projection moves the dot in a straight line between
      // rows; a synced x keyframe on top of it bends that path into an arc.
      animate={{ x: travelling ? [0, offset, DOT_TOUCH_OFFSET, 0] : 0 }}
      transition={{
        layout: DOT_SPRING,
        // Peak early, close in on the name's edge by impact, then ride the
        // last few px alongside the name as it gets pushed.
        x: {
          duration: DOT_FLIGHT_MS / 1000,
          times: [0, 0.3, DOT_IMPACT, 1],
          ease: ["easeOut", "easeInOut", "easeOut"],
        },
      }}
      className="absolute left-0 top-[calc(50%-2px)] size-1"
    >
      {/* Colour lives on an inner span, kept separate from the element that
          owns the layout projection. */}
      <span
        className={cn(
          "block size-full rounded-full bg-(--dot-to)",
          dotColorFrom[from],
          dotColorTo[to],
          // The dot mounts fresh on each row, so the CSS keyframe plays once
          // per landing and crossfades the previous section colour into the new.
          travelling && "dot-crossfade"
        )}
      />
    </motion.span>
  );
}

export function SidebarNav({
  sections,
  className,
}: {
  sections: NavSection[];
  className?: string;
}) {
  const pathname = splitLocalePath(usePathname()).pathname;
  const { locale, messages } = useUiLanguage();
  const pages = [
    { href: "/", label: messages.index },
    { href: "/goats", label: messages.goats },
    { href: "/resources", label: messages.resources },
  ];
  // The nav renders twice (sidebar + mobile sheet) - keep the dot's
  // shared-layout animation scoped to each instance.
  const dotId = useId();

  // Every row in nav order, so we can measure how far the dot travels and
  // which colour it is leaving behind. Unavailable concepts still count as
  // rows since they take up space in the list.
  const rows: { href: string; color: DotColor }[] = [
    ...pages.map((page) => ({ href: page.href, color: "foreground" as const })),
    ...sections.flatMap(({ section, concepts }) =>
      concepts.map((concept) => ({ href: `/${concept.slug}`, color: section }))
    ),
  ];
  const activeIndex = rows.findIndex((row) => row.href === pathname);

  // Remember where the dot came from. Updated during render (the React
  // "derived state" pattern) so the dot mounts already knowing its journey.
  // On first paint from === to, which reads as "no travel".
  const [travel, setTravel] = useState<Travel>({
    from: activeIndex,
    to: activeIndex,
  });
  if (travel.to !== activeIndex) {
    setTravel({ from: travel.to, to: activeIndex });
  }

  // A previous index of -1 means the dot wasn't on screen (e.g. a 404 page);
  // it then appears in place rather than flying in.
  const travelled =
    travel.from >= 0 && activeIndex >= 0
      ? Math.abs(activeIndex - travel.from)
      : 0;
  const offset = arcOffset(travelled);
  const travelling = offset !== 0;
  const fromColor =
    travel.from >= 0 ? rows[travel.from].color : rows[activeIndex]?.color;

  const renderDot = (to: DotColor) => (
    <ActiveDot
      layoutId={dotId}
      from={fromColor ?? to}
      to={to}
      offset={offset}
    />
  );

  // Flat position of each concept in the nav, so hover pitch rises gently
  // as you move down the list ("Index" is step 0).
  let step = 0;

  const linkClass =
    "inline-block rounded-[3px] py-1 outline-none transition-colors duration-200 focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-ring/60";

  return (
    <nav
      aria-label={messages.concepts}
      // py-12 matches the 3rem fade-mask-y stops, so at rest the list sits
      // fully inside the opaque zone and only overflow fades at the edges.
      // overflow-y also clips horizontally, so pl-10/-ml-10 give the active dot
      // room for its widest arc without shifting anything visually.
      className={cn(
        "fade-mask-y scrollbar-hidden -ml-10 overflow-y-auto py-12 pl-10",
        className
      )}
      // Shared with the CSS keyframes (dot-crossfade, name-hit) so every part
      // of the landing is timed from the same two numbers.
      style={
        {
          "--dot-flight": `${DOT_FLIGHT_MS}ms`,
          "--dot-impact": `${DOT_IMPACT_MS}ms`,
        } as React.CSSProperties
      }
    >
      <ul className="flex flex-col gap-1 text-xs">
        {pages.map((page) => {
          const active = pathname === page.href;
          return (
            <li key={page.href} className="relative">
              {active && renderDot("foreground")}
              <Link
                href={localizedPath(locale, page.href)}
                onClick={() => playSound("tick")}
                onMouseEnter={() => playSound("hover", { detune: 0 })}
                className={cn(
                  linkClass,
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <motion.span
                  className="inline-block"
                  initial={false}
                  animate={{ x: active ? 10 : 0 }}
                  transition={nameTransition(active, travelling)}
                >
                  {page.label}
                </motion.span>
              </Link>
            </li>
          );
        })}
        {sections.map(({ section, concepts }) => (
          <li key={section} className="mt-5">
            <div className="flex items-center gap-1.5 py-1 text-foreground">
              <SectionIcon section={section} size={13} className="mb-px" />
              <span>{messages.sections[section]}</span>
            </div>
            <ul className="flex flex-col mt-1">
              {concepts.map((concept) => {
                const available = isConceptAvailable(concept.slug);
                const active = available && pathname === `/${concept.slug}`;
                step += 1;
                const detune = progressionDetune(step);
                return (
                  <li key={concept.slug} className="relative">
                    {active && renderDot(section)}
                    {available ? (
                      <Link
                        href={localizedPath(locale, `/${concept.slug}`)}
                        onClick={() => playSound("tick")}
                        onMouseEnter={() => playSound("hover", { detune })}
                        className={cn(
                          linkClass,
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <motion.span
                          className="inline-flex items-center gap-1.5"
                          initial={false}
                          animate={{ x: active ? 12 : 0 }}
                          transition={nameTransition(active, travelling)}
                        >
                          <span
                            lang={languageTag(concept.contentLocale ?? locale)}
                            className={cn(
                              dotColorTo[section],
                              // Class is added when the row becomes active,
                              // which is what starts the CSS sweep.
                              active && travelling && "name-hit"
                            )}
                          >
                            {concept.title}
                          </span>
                          {concept.untranslated && <span className="text-[10px] text-muted-foreground">({messages.inEnglish})</span>}
                          {/* "New" badge hidden; flip SHOW_NEW_BADGE to
                              restore it next to launched concepts. */}
                          {SHOW_NEW_BADGE &&
                            isConceptLaunched(concept.slug) && (
                              <span className="new-badge inline-flex items-center rounded-full ml-0.5 bg-green-100 px-1.5 py-px text-[8px] text-green-600 dark:bg-green-950 dark:text-green-400 shadow-(--custom-shadow-green)">
                                {messages.new}
                              </span>
                            )}
                        </motion.span>
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        title={messages.comingSoon}
                        lang={languageTag(concept.contentLocale ?? locale)}
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
