"use client";

import { useDemoText } from "@/components/app/demo-messages";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import {
  Compare,
  CompareItem,
  RIGHT_ICON,
  WRONG_ICON,
} from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Activity", "Settings"] as const;
type Tab = (typeof TABS)[number];

const SETTLE = { type: "spring", duration: 0.3, bounce: 0 } as const;

function TabRow({
  active,
  onChange,
  shared,
  label,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
  shared: boolean;
  label: string;
}) {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-label={t(label)}
      className="flex w-full max-w-60 rounded-lg bg-muted p-1 shadow-(--custom-shadow) dark:bg-muted/60"
      role="tablist"
    >
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            aria-selected={isActive}
            className={cn(
              "relative min-w-0 flex-1 truncate rounded-md px-1 py-1.5 text-[11px] transition-colors sm:text-xs",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
            onClick={() => onChange(tab)}
            role="tab"
            type="button"
          >
            {isActive &&
              (shared ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-md bg-card shadow-(--custom-shadow)"
                  layoutId={`${label}-indicator`}
                  transition={reduceMotion ? { duration: 0 } : SETTLE}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-md bg-card shadow-(--custom-shadow)"
                />
              ))}
            <span className="relative">{t(tab)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SharedLayoutDemo() {
  const t = useDemoText();
  const [active, setActive] = useState<Tab>("Overview");

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <TabRow
            active={active}
            label={t("Tabs that swap")}
            onChange={setActive}
            shared={false}
          />
        </CompareItem>
        <CompareItem verdict="right">
          <TabRow
            active={active}
            label={t("Tabs that slide")}
            onChange={setActive}
            shared
          />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

const PROJECTS = [
  {
    id: "site",
    title: "Website redesign",
    meta: "12 tasks",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
  {
    id: "app",
    title: "Mobile app",
    meta: "8 tasks",
    gradient: "linear-gradient(135deg, #38bdf8, #6366f1)",
  },
  {
    id: "brand",
    title: "Brand refresh",
    meta: "5 tasks",
    gradient: "linear-gradient(135deg, #34d399, #0ea5e9)",
  },
] as const;

type Project = (typeof PROJECTS)[number];

const MODES = [
  { value: "swap", label: "Swap", icon: WRONG_ICON },
  { value: "shared", label: "Shared", icon: RIGHT_ICON },
] as const;
type Mode = (typeof MODES)[number]["value"];

export function SharedLayoutDetailDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("shared");
  const [selected, setSelected] = useState<Project | null>(null);
  const shared = mode === "shared";
  const settle = reduceMotion ? { duration: 0 } : SETTLE;
  const fade = reduceMotion ? { duration: 0 } : { duration: 0.2 };

  // Only hand out layoutIds in shared mode so the swap mode really swaps.
  const idFor = (kind: string, id: string) =>
    shared ? `project-${kind}-${id}` : undefined;

  return (
    <Demo className="gap-8">
      <div className="relative h-64 w-full max-w-xs overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
        <AnimatePresence initial={false} mode="popLayout">
          {selected ? (
            <motion.div
              key="detail"
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={fade}
            >
              <motion.div
                aria-hidden="true"
                className="h-28 w-full shrink-0"
                layoutId={idFor("thumb", selected.id)}
                style={{ background: selected.gradient, borderRadius: 0 }}
                transition={settle}
              />
              <div className="flex min-w-0 flex-col gap-2 p-4">
                <motion.h3
                  className="truncate text-sm font-medium text-foreground"
                  layout="position"
                  layoutId={idFor("title", selected.id)}
                  transition={settle}
                >
                  {t(selected.title)}
                </motion.h3>
                <motion.div
                  animate={{ opacity: 1 }}
                  aria-hidden="true"
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0 }}
                  transition={{ ...fade, delay: reduceMotion ? 0 : 0.1 }}
                >
                  <div className="h-1.5 w-4/5 rounded-full bg-foreground/10" />
                  <div className="h-1.5 w-3/5 rounded-full bg-foreground/10" />
                  <div className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
                </motion.div>
              </div>
              <button
                aria-label={t("Back to projects")}
                className="absolute top-3 left-3 inline-flex size-7 items-center justify-center rounded-full bg-card/90 text-foreground shadow-(--custom-shadow) backdrop-blur"
                onClick={() => setSelected(null)}
                type="button"
              >
                <ArrowLeftIcon className="size-3.5" weight="bold" />
              </button>
            </motion.div>
          ) : (
            <motion.ul
              key="list"
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col gap-1 p-2"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={fade}
            >
              {PROJECTS.map((project) => (
                <li key={project.id}>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted"
                    onClick={() => setSelected(project)}
                    type="button"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="block size-12 shrink-0"
                      layoutId={idFor("thumb", project.id)}
                      style={{ background: project.gradient, borderRadius: 8 }}
                      transition={settle}
                    />
                    <span className="flex min-w-0 flex-col">
                      <motion.span
                        className="truncate text-sm font-medium text-foreground"
                        layout="position"
                        layoutId={idFor("title", project.id)}
                        transition={settle}
                      >
                        {t(project.title)}
                      </motion.span>
                      <span className="text-xs text-muted-foreground">
                        {t(project.meta)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <SegmentedControl
        ariaLabel={t("Detail transition")}
        onChange={setMode}
        options={MODES.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}
