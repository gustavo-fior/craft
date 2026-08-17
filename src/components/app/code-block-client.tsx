"use client";

import { CopyIcon as CopyGlyph } from "@phosphor-icons/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { CopyIcon } from "@/components/app/copy-icon";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export type HighlightedCodeTab = {
  label: string;
  code: string;
  html: string;
  icon?: "css" | "tailwind";
};

// Matches FigureStyleControl's `0.25s ease` clip-path transition exactly.
const TAB_MORPH = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
} as const;
const TAB_ICONS = {
  css: { src: "/logos/css.svg", width: 14, height: 14 },
  tailwind: { src: "/logos/tailwindcss.svg", width: 18, height: 11 },
};

export function CodeBlockClient({ tabs }: { tabs: HighlightedCodeTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pillId = useId();
  const tabId = useId();
  const activeTab = tabs[activeIndex] ?? tabs[0];

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    []
  );

  function selectTab(index: number) {
    setActiveIndex(index);
    setCopied(false);
  }

  function handleTabKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectTab(nextIndex);
    document.getElementById(`${tabId}-tab-${nextIndex}`)?.focus();
  }

  async function copyCode() {
    await navigator.clipboard.writeText(activeTab.code);
    playSound("success", { volume: 0.35 });
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative my-6 overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        {tabs.length > 1 && (
          <div
            role="tablist"
            aria-label="Code examples"
            className="inline-flex h-8 items-center rounded-full bg-card p-0.5"
          >
            {tabs.map((tab, index) => {
              const active = index === activeIndex;
              const tabIcon = tab.icon ? TAB_ICONS[tab.icon] : undefined;
              return (
                <button
                  key={tab.label}
                  id={`${tabId}-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${tabId}-panel-${index}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectTab(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    "relative flex h-7 cursor-pointer items-center rounded-full px-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={pillId}
                      transition={TAB_MORPH}
                      className="absolute inset-0 rounded-full bg-background shadow-(--custom-shadow) dark:bg-input/50"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tabIcon && (
                      <Image
                        aria-hidden="true"
                        alt=""
                        src={tabIcon.src}
                        width={tabIcon.width}
                        height={tabIcon.height}
                        className="shrink-0 size-3 mb-px"
                        unoptimized
                      />
                    )}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={copied ? "Code copied" : `Copy ${activeTab.label} code`}
          onClick={() => void copyCode()}
        >
          <CopyIcon copied={copied} icon={<CopyGlyph weight="duotone" />} />
        </Button>
      </div>

      <div className="grid">
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={tab.label}
              id={`${tabId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${tabId}-tab-${index}`}
              inert={!active}
              className={cn(
                "code-block-panel col-start-1 row-start-1 overflow-x-auto transition-opacity duration-200",
                active ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              dangerouslySetInnerHTML={{ __html: tab.html }}
            />
          );
        })}
      </div>
    </div>
  );
}
