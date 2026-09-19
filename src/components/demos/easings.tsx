"use client";

import { useDemoText } from "@/components/app/demo-messages";
import {
  ArrowCounterClockwiseIcon,
  CopyIcon,
  DotsThreeIcon,
  FolderIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE_IN = "cubic-bezier(0.42, 0, 1, 1)";
const EASE_OUT = "cubic-bezier(0, 0, 0.58, 1)";
const STRONG_EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

const MENU_ITEMS = [
  { label: "Rename", Icon: PencilSimpleIcon },
  { label: "Duplicate", Icon: CopyIcon },
  { label: "Move to", Icon: FolderIcon },
  { label: "Delete", Icon: TrashIcon },
] as const;

function MenuCard({
  open,
  easing,
  duration,
  onToggle,
}: {
  open: boolean;
  easing: string;
  duration: number;
  onToggle: () => void;
}) {
  const t = useDemoText();
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted p-2 dark:bg-muted/40">
      <Button
        aria-expanded={open}
        aria-label={t("Open menu")}
        onClick={onToggle}
        size="icon-sm"
        variant="ghost"
      >
        <DotsThreeIcon aria-hidden="true" className="size-4" weight="bold" />
      </Button>

      <div
        aria-hidden={!open}
        className={cn(
          "absolute top-11 left-2 w-32 origin-top-left rounded-lg bg-card p-1 shadow-(--custom-shadow) motion-reduce:transition-none",
          !open && "pointer-events-none"
        )}
        style={{
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1)"
            : "translateY(-6px) scale(0.94)",
          transitionProperty: "opacity, transform",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: easing,
        }}
      >
        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex h-7 items-center gap-2 rounded-md px-2 text-xs",
              item.label === "Delete"
                ? "text-destructive"
                : "text-foreground"
            )}
          >
            <item.Icon aria-hidden="true" className="size-3.5" />
            {t(item.label)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EasingsDemo() {
  const t = useDemoText();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((value) => !value);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" label={t("Ease in")}>
          <MenuCard
            duration={250}
            easing={EASE_IN}
            onToggle={toggle}
            open={open}
          />
        </CompareItem>
        <CompareItem verdict="right" label={t("Ease out")}>
          <MenuCard
            duration={250}
            easing={EASE_OUT}
            onToggle={toggle}
            open={open}
          />
        </CompareItem>
      </Compare>

      <Button onClick={toggle} variant="secondary">
        {open ? t("Close") : t("Open")}
      </Button>
    </Demo>
  );
}

type CurveName = "linear" | "ease-in" | "ease-out" | "in-out";

const CURVES: Record<
  CurveName,
  { label: string; css: string; points: [number, number, number, number] }
> = {
  linear: { label: "Linear", css: "linear", points: [0, 0, 1, 1] },
  "ease-in": {
    label: "Ease in",
    css: EASE_IN,
    points: [0.42, 0, 1, 1],
  },
  "ease-out": {
    label: "Ease out",
    css: EASE_OUT,
    points: [0, 0, 0.58, 1],
  },
  "in-out": {
    label: "In-out",
    css: "cubic-bezier(0.77, 0, 0.175, 1)",
    points: [0.77, 0, 0.175, 1],
  },
};

const CURVE_OPTIONS = (
  Object.keys(CURVES) as CurveName[]
).map((value) => ({ value, label: CURVES[value].label }));

const CHART = 160;
const RUN_MS = 1000;

export function EasingCurveDemo() {
  const t = useDemoText();
  const [curve, setCurve] = useState<CurveName>("ease-out");
  const reduceMotion = useReducedMotion();
  const xRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const run = useCallback(() => {
    const x = xRef.current;
    const y = yRef.current;
    const track = trackRef.current;
    const ball = ballRef.current;
    if (!x || !y || !track || !ball) return;

    const easing = CURVES[curve].css;
    const duration = reduceMotion ? 0 : RUN_MS;
    const distance = track.clientWidth - ball.offsetWidth;

    x.animate(
      [{ transform: "translateX(0px)" }, { transform: `translateX(${CHART}px)` }],
      { duration, easing: "linear", fill: "forwards" }
    );
    y.animate(
      [{ transform: "translateY(0px)" }, { transform: `translateY(-${CHART}px)` }],
      { duration, easing, fill: "forwards" }
    );
    ball.animate(
      [{ transform: "translateX(0px)" }, { transform: `translateX(${distance}px)` }],
      { duration, easing, fill: "forwards" }
    );
  }, [curve, reduceMotion]);

  useEffect(() => {
    const id = window.setTimeout(run, 150);
    return () => window.clearTimeout(id);
  }, [run]);

  const [x1, y1, x2, y2] = CURVES[curve].points;
  const path = `M 0 ${CHART} C ${x1 * CHART} ${(1 - y1) * CHART}, ${
    x2 * CHART
  } ${(1 - y2) * CHART}, ${CHART} 0`;

  return (
    <Demo className="gap-8">
      <div className="flex w-full max-w-xs flex-col items-center gap-6">
        <div
          aria-hidden="true"
          className="relative shrink-0"
          style={{ width: CHART, height: CHART }}
        >
          <svg
            className="absolute inset-0 overflow-visible"
            height={CHART}
            viewBox={`0 0 ${CHART} ${CHART}`}
            width={CHART}
          >
            <line
              className="stroke-foreground/10"
              strokeDasharray="3 3"
              x1={0}
              x2={CHART}
              y1={CHART}
              y2={0}
            />
            <rect
              className="fill-none stroke-foreground/10"
              height={CHART}
              width={CHART}
              x={0}
              y={0}
            />
            <path
              className="fill-none stroke-foreground transition-[d] duration-300 ease-out motion-reduce:transition-none"
              d={path}
              strokeLinecap="round"
              strokeWidth={2}
            />
          </svg>
          <div ref={xRef} className="absolute bottom-0 left-0">
            <div ref={yRef}>
              <div className="size-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-rose-500 shadow-[0_0_0_2px_var(--card)]" />
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          aria-hidden="true"
          className="relative h-8 w-full rounded-full bg-muted"
        >
          <div
            ref={ballRef}
            className="absolute top-1 left-1 size-6 rounded-full bg-foreground"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <SegmentedControl
          ariaLabel={t("Easing curve")}
          onChange={setCurve}
          options={CURVE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
          value={curve}
        />
        <Button aria-label={t("Replay")} onClick={run} size="icon-sm" variant="secondary">
          <ArrowCounterClockwiseIcon aria-hidden="true" className="size-4" weight="bold" />
        </Button>
      </div>
    </Demo>
  );
}

export function StrongEasingDemo() {
  const t = useDemoText();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((value) => !value);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem caption="ease-out">
          <MenuCard
            duration={250}
            easing={EASE_OUT}
            onToggle={toggle}
            open={open}
          />
        </CompareItem>
        <CompareItem caption="cubic-bezier(0.23, 1, 0.32, 1)">
          <MenuCard
            duration={250}
            easing={STRONG_EASE_OUT}
            onToggle={toggle}
            open={open}
          />
        </CompareItem>
      </Compare>

      <Button onClick={toggle} variant="secondary">
        {open ? t("Close") : t("Open")}
      </Button>
    </Demo>
  );
}
