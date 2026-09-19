"use client";

import { useDemoLocale, useDemoText } from "@/components/app/demo-messages";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Compare, CompareItem, RIGHT_ICON, WRONG_ICON } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { languageTag } from "@/i18n/locales";
import { cn } from "@/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* Tweens an array of numbers towards its latest target with requestAnimationFrame. */
function useTweened(target: readonly number[], duration: number) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<readonly number[]>(target);
  const current = useRef<readonly number[]>(target);

  useEffect(() => {
    if (reduced || duration === 0) {
      current.current = target;
      setDisplay(target);
      return;
    }

    const from = current.current;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = target.map((value, i) => {
        const origin = from[i] ?? value;
        return origin + (value - origin) * eased;
      });
      current.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduced]);

  return display;
}

function walk(previous: number, step: number, min: number, max: number) {
  const next = previous + (Math.random() - 0.5) * step;
  return Math.min(max, Math.max(min, next));
}

/* Sparkline and counter: new value every 1.5s. */

const POINTS = 24;
const TICK_MS = 1500;
const RANGE = { min: 150, max: 1000 };

const INITIAL_SERIES = [
  520, 548, 505, 590, 612, 570, 640, 655, 610, 690, 720, 700, 665, 710, 760, 740,
  705, 680, 720, 770, 810, 790, 760, 800,
] as const;

const SPARK = { width: 160, height: 44, pad: 3 };

function sparkPath(values: readonly number[]) {
  const innerH = SPARK.height - SPARK.pad * 2;
  return values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * SPARK.width;
      const y = SPARK.pad + (1 - (value - RANGE.min) / (RANGE.max - RANGE.min)) * innerH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function LiveCard({ values }: { values: readonly number[] }) {
  const t = useDemoText();
  const locale = useDemoLocale();
  const numberFormat = useMemo(() => new Intl.NumberFormat(languageTag(locale)), [locale]);
  const latest = values[values.length - 1];
  const d = sparkPath(values);
  const lastY =
    SPARK.pad +
    (1 - (latest - RANGE.min) / (RANGE.max - RANGE.min)) * (SPARK.height - SPARK.pad * 2);

  return (
    <div className="w-full rounded-xl bg-card p-3 shadow-(--custom-shadow)">
      <p className="text-[11px] text-muted-foreground">{t("Requests per second")}</p>
      <p className="mt-0.5 text-xl font-semibold text-foreground tabular-nums">
        {numberFormat.format(Math.round(latest))}
      </p>
      <svg
        aria-hidden="true"
        className="mt-2 h-auto w-full overflow-visible"
        viewBox={`0 0 ${SPARK.width} ${SPARK.height}`}
      >
        <path
          className="text-foreground"
          d={d}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        />
        <circle className="fill-foreground" cx={SPARK.width} cy={lastY} r={2.5} />
      </svg>
    </div>
  );
}

export function LivingChartsDemo() {
  const [series, setSeries] = useState<readonly number[]>(INITIAL_SERIES);
  const smooth = useTweened(series, 900);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeries((values) => [
        ...values.slice(1),
        walk(values[values.length - 1], 260, RANGE.min, RANGE.max),
      ]);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <LiveCard values={series} />
        </CompareItem>
        <CompareItem verdict="right">
          <LiveCard values={smooth} />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/* Ranked bars: values change and rows swap places. */

const SOURCES = [
  { name: "Google", domain: "google.com", value: 4210 },
  { name: "GitHub", domain: "github.com", value: 2860 },
  { name: "X", domain: "x.com", value: 1940 },
  { name: "YouTube", domain: "youtube.com", value: 1720 },
  { name: "Reddit", domain: "reddit.com", value: 1180 },
] as const;

const MODE_OPTIONS = [
  { value: "snap", label: "Snap", icon: WRONG_ICON },
  { value: "animate", label: "Animate", icon: RIGHT_ICON },
] as const;

type Mode = (typeof MODE_OPTIONS)[number]["value"];

export function LivingBarsDemo() {
  const t = useDemoText();
  const locale = useDemoLocale();
  const numberFormat = useMemo(() => new Intl.NumberFormat(languageTag(locale)), [locale]);
  const [mode, setMode] = useState<Mode>("animate");
  const reduced = useReducedMotion();
  const [values, setValues] = useState<readonly number[]>(SOURCES.map((s) => s.value));
  const animated = mode === "animate" && !reduced;
  const shown = useTweened(values, animated ? 700 : 0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setValues((current) => current.map((value) => walk(value, 1400, 600, 5200)));
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  const max = Math.max(...values);
  const order = SOURCES.map((_, i) => i).sort((a, b) => values[b] - values[a]);
  const transition = animated ? { duration: 0.6, ease: EASE_OUT } : { duration: 0 };

  return (
    <Demo className="gap-8">
      <div className="w-full max-w-sm rounded-xl bg-card p-3 shadow-(--custom-shadow)">
        <p className="mb-3 text-[11px] text-muted-foreground">{t("Visits by source")}</p>
        <div className="flex flex-col gap-2">
          {order.map((i) => {
            const source = SOURCES[i];
            return (
              <motion.div
                key={source.domain}
                className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-2 text-xs"
                layout
                transition={transition}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-foreground">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="size-3.5 shrink-0 rounded-sm"
                    src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=64`}
                  />
                  <span className="truncate">{source.name}</span>
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.span
                    animate={{ width: `${(values[i] / max) * 100}%` }}
                    className={cn("block h-full rounded-full bg-foreground")}
                    initial={false}
                    transition={transition}
                  />
                </span>
                <span className="text-right text-muted-foreground tabular-nums">
                  {numberFormat.format(Math.round(shown[i]))}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <SegmentedControl
        ariaLabel={t("Update style")}
        onChange={setMode}
        options={MODE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}
