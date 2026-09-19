"use client";

import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type Mode = "everywhere" | "once";

const MODES = [
  { value: "everywhere", label: "Animate everything" },
  { value: "once", label: "Animate one moment" },
] as const;

const LISTS = {
  Today: ["Reply to Jakub", "Review pull request", "Book the dentist"],
  Upcoming: ["Write the changelog", "Plan the offsite", "Renew the domain"],
  Someday: ["Learn Blender", "Read the Rams book", "Fix the bike"],
} as const;

type ListName = keyof typeof LISTS;
const LIST_NAMES = Object.keys(LISTS) as ListName[];

const ROW_HEIGHT = 40;

export function NoveltyBudgetDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Mode>("everywhere");
  const [list, setList] = useState<ListName>("Today");
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const current = timers.current;
    return () => current.forEach((timer) => clearTimeout(timer));
  }, []);

  const everywhere = mode === "everywhere";
  const speed = reduceMotion ? 0 : 1;

  function complete(task: string) {
    if (done.has(task)) return;
    setDone((prev) => new Set(prev).add(task));
    const timer = setTimeout(
      () => {
        setRemoved((prev) => new Set(prev).add(task));
        timers.current.delete(timer);
      },
      everywhere ? 650 : 220
    );
    timers.current.add(timer);
  }

  function reset() {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current.clear();
    setDone(new Set());
    setRemoved(new Set());
  }

  const tasks = LISTS[list].filter((task) => !removed.has(task));
  const cleared = tasks.length === 0;

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="w-full max-w-sm rounded-xl bg-card shadow-(--custom-shadow)">
        <div className="flex items-center justify-between gap-2 border-b border-[#E7E7E7] p-1.5 dark:border-[#1E1E1E]">
          <div className="relative flex gap-0.5">
            {LIST_NAMES.map((name) => {
              const active = name === list;
              return (
                <button
                  key={name}
                  aria-pressed={active}
                  className={cn(
                    "relative h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    everywhere && "transition-colors duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setList(name)}
                  type="button"
                >
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-md bg-muted"
                      layoutId="novelty-budget-tab"
                      transition={{
                        duration: everywhere ? 0.4 * speed : 0,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    />
                  ) : null}
                  <span className="relative">{t(name)}</span>
                </button>
              );
            })}
          </div>
          <Button
            aria-label={t("Reset tasks")}
            className={cn(!everywhere && "transition-none")}
            onClick={reset}
            size="icon-xs"
            variant="ghost"
          >
            <ArrowCounterClockwiseIcon weight="bold" />
          </Button>
        </div>

        <div
          className="relative p-1.5"
          style={{ minHeight: ROW_HEIGHT * 3 + 12 }}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.ul
              key={list}
              className="flex flex-col"
              initial={everywhere ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={everywhere ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: everywhere ? 0.15 * speed : 0 }}
            >
              <AnimatePresence initial={false}>
                {tasks.map((task, index) => (
                  <motion.li
                    key={task}
                    className="overflow-hidden"
                    initial={everywhere ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0, height: ROW_HEIGHT }}
                    exit={
                      everywhere
                        ? { opacity: 0, x: 32, height: 0 }
                        : { opacity: 0, height: 0 }
                    }
                    transition={
                      everywhere
                        ? {
                            duration: 0.45 * speed,
                            delay: 0.07 * index * speed,
                            ease: [0.23, 1, 0.32, 1],
                          }
                        : { duration: 0.16 * speed, ease: "easeOut" }
                    }
                  >
                    <button
                      aria-pressed={done.has(task)}
                      className={cn(
                        "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        everywhere && "transition-colors duration-300"
                      )}
                      onClick={() => complete(task)}
                      type="button"
                    >
                      <motion.span
                        aria-hidden="true"
                        className="grid size-4 shrink-0 place-items-center"
                        animate={{
                          scale:
                            done.has(task) && everywhere ? [1, 1.45, 1] : 1,
                        }}
                        transition={{ duration: 0.5 * speed }}
                      >
                        {done.has(task) ? (
                          <CheckCircleIcon
                            className="size-4 text-emerald-500"
                            weight="fill"
                          />
                        ) : (
                          <CircleIcon className="size-4 text-muted-foreground/60" />
                        )}
                      </motion.span>
                      <span
                        className={cn(
                          "truncate",
                          everywhere && "transition-colors duration-300",
                          done.has(task)
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        )}
                      >
                        {t(task)}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </AnimatePresence>

          <AnimatePresence>
            {cleared ? (
              <motion.div
                key={`${list}-clear`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                initial={
                  everywhere
                    ? { opacity: 0, y: 10 }
                    : { opacity: 0, scale: 0.6 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={
                  everywhere
                    ? { duration: 0.45 * speed, ease: [0.23, 1, 0.32, 1] }
                    : {
                        type: "spring",
                        duration: 0.6 * speed,
                        bounce: 0.4,
                      }
                }
              >
                <span className="relative grid size-8 place-items-center">
                  {!everywhere ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-emerald-500/25"
                      initial={{ scale: 0.6, opacity: 0.8 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{
                        duration: 0.7 * speed,
                        ease: "easeOut",
                        delay: 0.1 * speed,
                      }}
                    />
                  ) : null}
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="relative size-8 text-emerald-500"
                    weight="fill"
                  />
                </span>
                <span className="text-xs font-medium text-foreground">
                  {t("All clear")}
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <SegmentedControl
        ariaLabel={t("Where the animation budget goes")}
        onChange={setMode}
        options={MODES.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function AnimationCostDemo() {
  const t = useDemoText();
  const [duration, setDuration] = useState(300);
  const [usesPerDay, setUsesPerDay] = useState(200);

  const hoursPerYear = (duration / 1000) * usesPerDay * 365 / 3600;

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl font-medium tracking-tight tabular-nums text-foreground">
          {hoursPerYear.toFixed(1)}
          <span className="ml-1.5 text-2xl text-muted-foreground">{t("hours")}</span>
        </span>
        <span className="text-[10px] text-muted-foreground">
          {t("a year, per person")}
        </span>
      </div>

      <div className="mb-2 grid w-full max-w-xs gap-5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {t("Animation")}
            <span className="tabular-nums text-foreground">{duration}ms</span>
          </span>
          <Slider
            aria-label={t("Animation duration")}
            max={600}
            min={50}
            onValueChange={(value) => setDuration(getSliderValue(value))}
            step={10}
            value={[duration]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {t("Times a day")}
            <span className="tabular-nums text-foreground">{usesPerDay}</span>
          </span>
          <Slider
            aria-label={t("Uses per day")}
            max={500}
            min={10}
            onValueChange={(value) => setUsesPerDay(getSliderValue(value))}
            step={10}
            value={[usesPerDay]}
          />
        </label>
      </div>
    </Demo>
  );
}
