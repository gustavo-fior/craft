"use client";

import {
  BellIcon,
  PlayIcon,
  PlusIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * Two cards that look the same at a glance. One has three small flaws:
 * an icon sitting a pixel low, a corner radius that does not match the
 * rest of the card, and a primary button whose label is not centered.
 */

function Flaw({
  active,
  children,
  className,
  label,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-md border border-rose-500 transition-opacity duration-300 motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-rose-500 px-1 py-px text-[10px] leading-tight text-white transition-opacity duration-300 motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0"
        )}
      >
        {label}
      </span>
    </span>
  );
}

function ProjectCard({ flawed, revealed }: { flawed: boolean; revealed: boolean }) {
  const t = useDemoText();
  const show = flawed && revealed;
  return (
    <div className="w-full max-w-60 rounded-2xl bg-card p-4 shadow-(--custom-shadow)">
      <div className="flex items-center gap-2.5">
        <Flaw active={show} label={t("Radius")}>
          <div
            className={cn(
              "grid size-8 shrink-0 place-items-center bg-foreground text-background",
              flawed ? "rounded-[5px]" : "rounded-lg"
            )}
          >
            <RocketLaunchIcon
              aria-hidden="true"
              className="size-4"
              weight="fill"
            />
          </div>
        </Flaw>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {t("Launch week")}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {t("12 tasks, 3 open")}
          </div>
        </div>
        <Flaw active={show} label={t("1px low")}>
          <BellIcon
            aria-hidden="true"
            className={cn(
              "size-4 text-muted-foreground",
              flawed && "translate-y-px"
            )}
          />
        </Flaw>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-3/4 rounded-full bg-foreground" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Flaw active={show} label={t("Off center")}>
          <button
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-foreground text-xs font-medium text-background",
              flawed ? "pr-2.5 pl-3.5" : "px-3"
            )}
            tabIndex={-1}
            type="button"
          >
            <PlusIcon aria-hidden="true" className="size-3.5" weight="bold" />
            {t("Add task")}
          </button>
        </Flaw>
        <button
          className="inline-flex h-8 cursor-pointer items-center rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
          tabIndex={-1}
          type="button"
        >
          {t("Share")}
        </button>
      </div>
    </div>
  );
}

export function SpotTheDifferenceDemo() {
  const t = useDemoText();
  const [revealed, setRevealed] = useState(false);
  const [flawedSide, setFlawedSide] = useState<"left" | "right">("right");

  useEffect(() => {
    setFlawedSide(Math.random() < 0.5 ? "left" : "right");
  }, []);

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 pt-3 sm:gap-8">
        <div className="flex min-w-0 justify-center">
          <ProjectCard flawed={flawedSide === "left"} revealed={revealed} />
        </div>
        <div className="flex min-w-0 justify-center">
          <ProjectCard flawed={flawedSide === "right"} revealed={revealed} />
        </div>
      </div>
      <Button
        onClick={() => setRevealed((value) => !value)}
        size="sm"
        variant="secondary"
      >
        {t(revealed ? "Hide" : "Reveal")}
      </Button>
    </Demo>
  );
}

/*
 * Two menus open side by side. Only one variable differs between them.
 */

type Variable = "duration" | "easing" | "origin";

const VARIABLES = [
  { value: "duration", label: "Duration" },
  { value: "easing", label: "Easing" },
  { value: "origin", label: "Origin" },
] as const;

const PAIRS: Record<
  Variable,
  readonly [
    { label: string; style: React.CSSProperties },
    { label: string; style: React.CSSProperties },
  ]
> = {
  duration: [
    {
      label: "400ms",
      style: {
        transitionDuration: "400ms",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        transformOrigin: "top left",
      },
    },
    {
      label: "150ms",
      style: {
        transitionDuration: "150ms",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        transformOrigin: "top left",
      },
    },
  ],
  easing: [
    {
      label: "Ease in",
      style: {
        transitionDuration: "220ms",
        transitionTimingFunction: "cubic-bezier(0.55, 0, 1, 0.45)",
        transformOrigin: "top left",
      },
    },
    {
      label: "Ease out",
      style: {
        transitionDuration: "220ms",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        transformOrigin: "top left",
      },
    },
  ],
  origin: [
    {
      label: "From center",
      style: {
        transitionDuration: "220ms",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        transformOrigin: "center",
      },
    },
    {
      label: "From trigger",
      style: {
        transitionDuration: "220ms",
        transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        transformOrigin: "top left",
      },
    },
  ],
};

const MENU_ITEMS = ["Rename", "Duplicate", "Move to", "Archive"] as const;

function MenuStage({
  open,
  style,
}: {
  open: boolean;
  style: React.CSSProperties;
}) {
  const t = useDemoText();
  return (
    <div className="relative h-44 w-full max-w-44">
      <div
        aria-hidden="true"
        className="inline-flex h-7 items-center rounded-md bg-muted px-2.5 text-xs font-medium text-foreground"
      >
        {t("Options")}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-8 left-0 w-36 rounded-lg bg-card p-1 shadow-(--custom-shadow) transition-[transform,opacity] motion-reduce:transition-none",
          open ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
        style={style}
      >
        {MENU_ITEMS.map((item) => (
          <div
            key={item}
            className="flex h-7 items-center rounded-md px-2 text-xs text-foreground first:bg-muted"
          >
            {t(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PairJudgementDemo() {
  const t = useDemoText();
  const [variable, setVariable] = useState<Variable>("duration");
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setBusy(false);
    }, 260);
    return () => clearTimeout(timer);
  }, [busy]);

  function play() {
    setOpen(false);
    setBusy(true);
  }

  const [left, right] = PAIRS[variable];

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {[left, right].map((side) => (
          <div
            key={side.label}
            className="flex min-w-0 flex-col items-center gap-2"
          >
            <MenuStage open={open} style={side.style} />
            <span className="text-[10px] text-muted-foreground">
              {t(side.label)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={play} size="sm" variant="secondary">
          <PlayIcon weight="fill" />
          {t("Play")}
        </Button>
        <SegmentedControl
          ariaLabel={t("Variable to compare")}
          onChange={(value) => {
            setVariable(value);
            setOpen(false);
            setBusy(true);
          }}
          options={VARIABLES.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
          value={variable}
        />
      </div>
    </Demo>
  );
}
