"use client";

import { CopyIcon as CopyGlyph } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { CopyIcon } from "@/components/app/copy-icon";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { useUiLanguage } from "./ui-language";
import { languageTag } from "@/i18n/locales";

export type HighlightedCodeTab = {
  label: string;
  language: string;
  code: string;
  html: string;
  icon?: "css" | "tailwind";
  filename?: string;
};

// The header shows a made-up filename for the active tab, so the snippet
// reads as "where this goes" rather than a bare code dump.
const FILE_BY_LANGUAGE: Record<
  string,
  { name: string; kind: "css" | "react" }
> = {
  css: { name: "styles.css", kind: "css" },
  html: { name: "app.tsx", kind: "react" },
  tsx: { name: "app.tsx", kind: "react" },
  jsx: { name: "app.jsx", kind: "react" },
  ts: { name: "app.ts", kind: "react" },
  js: { name: "app.js", kind: "react" },
};

function getFile(tab: HighlightedCodeTab) {
  const fallback = FILE_BY_LANGUAGE[tab.language] ?? FILE_BY_LANGUAGE.tsx;
  const name = tab.filename ?? fallback.name;
  const kind = name.endsWith(".css") ? "css" : fallback.kind;
  return { name, kind };
}

function FileIcon({ kind }: { kind: "css" | "react" }) {
  if (kind === "css") {
    return (
      <Image
        aria-hidden="true"
        alt=""
        src="/logos/css.svg"
        width={14}
        height={14}
        className="size-3 shrink-0 rounded-[3px] mb-px"
        unoptimized
      />
    );
  }
  return (
    <>
      <Image
        aria-hidden="true"
        alt=""
        src="/logos/react-light.svg"
        width={16}
        height={14}
        className="size-3 shrink-0 dark:hidden"
        unoptimized
      />
      <Image
        aria-hidden="true"
        alt=""
        src="/logos/react-dark.svg"
        width={16}
        height={14}
        className="hidden size-3 shrink-0 dark:block"
        unoptimized
      />
    </>
  );
}

// Matches FigureStyleControl's `0.25s ease` clip-path transition exactly.
const TAB_MORPH = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
} as const;
const TAB_ICONS = {
  css: { src: "/logos/css.svg", width: 14, height: 14 },
  tailwind: { src: "/logos/tailwindcss.svg", width: 18, height: 11 },
};

export function CodeBlockClient({
  tabs,
  hideHeader = false,
}: {
  tabs: HighlightedCodeTab[];
  /** Drops the filename/tab bar; for one-liners like a terminal command. */
  hideHeader?: boolean;
}) {
  const { locale, messages } = useUiLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pillId = useId();
  const tabId = useId();
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const reduceMotion = useReducedMotion();

  // Inactive panels sit out of flow, so the wrapper only ever knows the
  // active panel's height. Measure it and let motion tween between tabs;
  // the observer keeps it honest when wrapped lines reflow on resize.
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [panelHeight, setPanelHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    const measure = () => setPanelHeight(panel.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

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
    <div lang={languageTag(locale)} className="my-6 overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-[#E7E7E7] dark:border-[#1E1E1E] py-2 pr-2 pl-4">
          {/* One label per tab, stacked and crossfaded on the same 200ms
            curve as the code panels below. */}
          <div className="grid min-w-0 font-mono text-[11px] text-muted-foreground">
            {tabs.map((tab, index) => {
              const active = index === activeIndex;
              const file = getFile(tab);
              return (
                <span
                  key={tab.label}
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 flex min-w-0 items-center gap-2 transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0"
                  )}
                >
                  <FileIcon kind={file.kind} />
                  <span className="truncate">{file.name}</span>
                </span>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {tabs.length > 1 && (
              <div
                role="tablist"
                aria-label={messages.codeExamples}
                className="inline-flex h-8 items-center rounded-full bg-card p-0.5"
              >
                {tabs.map((tab, index) => {
                  const active = index === activeIndex;
                  const tabIcon = tab.icon ? TAB_ICONS[tab.icon] : undefined;
                  const isCssIcon = tabIcon?.src === "/logos/css.svg";
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
                          : "text-muted-foreground hover:text-foreground",
                        tabIcon && isCssIcon ? "pl-2.75" : "pl-2.25"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={pillId}
                          transition={TAB_MORPH}
                          className="absolute inset-0 rounded-full bg-muted dark:bg-input/50"
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
          </div>
        </div>
      )}

      <motion.div
        className="relative overflow-hidden"
        initial={false}
        animate={{ height: panelHeight }}
        transition={reduceMotion ? { duration: 0 } : TAB_MORPH}
      >
        {/* Floats over the code's top-right corner, centered on the first
            line (1rem padding + half a 19.5px line, minus half the 32px
            button). The backdrop keeps it readable when a long line scrolls
            underneath. */}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="absolute top-2.5 right-2.5 z-10 backdrop-blur-sm hover:bg-muted dark:hover:bg-input/50"
          aria-label={copied ? messages.codeCopied : `${messages.copyCode}: ${activeTab.label}`}
          onClick={() => void copyCode()}
        >
          <CopyIcon copied={copied} icon={<CopyGlyph weight="duotone" />} />
        </Button>
        {tabs.map((tab, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={tab.label}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              id={`${tabId}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${tabId}-tab-${index}`}
              lang="en"
              inert={!active}
              className={cn(
                "code-block-panel min-w-0 transition-opacity duration-200",
                active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
              )}
              dangerouslySetInnerHTML={{ __html: tab.html }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
