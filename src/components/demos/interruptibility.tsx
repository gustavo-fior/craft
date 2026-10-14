"use client";

import {
  ArrowsLeftRightIcon,
  CaretDownIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  LinkSimpleIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Shared bits                                                              */
/* ------------------------------------------------------------------------ */

// Slowed down on purpose so there is time to change your mind mid-flight.
const SHEET_DURATION = 600;
const SHEET_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const SHEET_HIDDEN = "translateY(calc(100% + 8px))";

const SHEET_ACTIONS = [
  { label: "Copy link", Icon: LinkSimpleIcon },
  { label: "Send by email", Icon: EnvelopeSimpleIcon },
  { label: "Invite people", Icon: UsersIcon },
] as const;

function Screen({
  backdrop,
  children,
  className,
}: {
  backdrop: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-44 w-full overflow-hidden rounded-xl bg-muted shadow-(--custom-shadow) dark:bg-muted/40",
        className
      )}
    >
      <div aria-hidden="true">{backdrop}</div>
      {children}
    </div>
  );
}

// Each demo gets its own placeholder screen so they don't read as the same
// mock three times: a photo being shared, a list being sorted, a grid of files.

function PhotoBackdrop() {
  return (
    <div className="p-3">
      <div className="h-20 rounded-lg bg-linear-to-br from-foreground/15 to-foreground/5" />
      <div className="mt-2.5 h-1.5 w-2/5 rounded-full bg-foreground/15" />
      <div className="mt-2 h-1.5 w-3/5 rounded-full bg-foreground/10" />
    </div>
  );
}

function ListBackdrop() {
  return (
    <div className="p-3">
      <div className="flex h-7 items-center">
        <div className="h-1.5 w-12 rounded-full bg-foreground/15" />
      </div>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {["w-3/5", "w-2/5", "w-1/2"].map((width) => (
          <div key={width} className="flex items-center gap-2">
            <div className="size-5 shrink-0 rounded-full bg-foreground/10" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className={cn("h-1.5 rounded-full bg-foreground/15", width)} />
              <div className="h-1 w-4/5 rounded-full bg-foreground/[0.07]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridBackdrop() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-foreground/15" />
        <div className="h-1.5 w-16 rounded-full bg-foreground/15" />
        <div className="ml-auto h-4 w-10 rounded-full bg-foreground/10" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-12 rounded-md bg-foreground/[0.07]"
          />
        ))}
      </div>
    </div>
  );
}

function Sheet({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-1.5 bottom-1.5 rounded-md bg-card p-2.5 shadow-(--custom-shadow) dark:bg-muted"
      style={style}
    >
      <div className="mx-auto mb-2.5 h-1 w-8 rounded-full bg-foreground/15" />
      <p className="mb-1.5 px-1 text-xs font-medium text-foreground">Share</p>
      <ul className="flex flex-col">
        {SHEET_ACTIONS.map((action) => (
          <li
            key={action.label}
            className="flex items-center gap-2 rounded-md px-1 py-1 text-[11px] text-muted-foreground"
          >
            <action.Icon
              aria-hidden="true"
              className="size-3.5 shrink-0"
              weight="duotone"
            />
            {action.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Keyframes restart, transitions retarget                               */
/* ------------------------------------------------------------------------ */

export function InterruptSheetDemo() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [runs, setRuns] = useState(0);
  const duration = reduceMotion ? 0 : SHEET_DURATION;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <style>{`
        @keyframes craft-v2-sheet-in {
          from { transform: ${SHEET_HIDDEN}; }
          to { transform: translateY(0); }
        }
        @keyframes craft-v2-sheet-out {
          from { transform: translateY(0); }
          to { transform: ${SHEET_HIDDEN}; }
        }
      `}</style>

      <Compare>
        <CompareItem verdict="wrong" caption="Keyframes">
          <Screen backdrop={<PhotoBackdrop />}>
            <Sheet
              style={{
                transform: SHEET_HIDDEN,
                animation:
                  runs === 0
                    ? "none"
                    : `${open ? "craft-v2-sheet-in" : "craft-v2-sheet-out"} ${duration}ms ${SHEET_EASE} both`,
              }}
            />
          </Screen>
        </CompareItem>

        <CompareItem verdict="right" caption="Transition">
          <Screen backdrop={<PhotoBackdrop />}>
            <Sheet
              style={{
                transform: open ? "translateY(0)" : SHEET_HIDDEN,
                transition: `transform ${duration}ms ${SHEET_EASE}`,
              }}
            />
          </Screen>
        </CompareItem>
      </Compare>

      <Button
        onClick={() => {
          setOpen((value) => !value);
          setRuns((value) => value + 1);
        }}
        variant="secondary"
      >
        {open ? "Close" : "Open"}
      </Button>
    </Demo>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. Locking input while the animation runs                                */
/* ------------------------------------------------------------------------ */

const MENU_DURATION = 350;
const MENU_ITEMS = ["Newest first", "Oldest first", "Most viewed"] as const;

function Menu({ locked }: { locked: boolean }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [ignored, setIgnored] = useState(0);
  const timer = useRef<number | null>(null);
  const duration = reduceMotion ? 0 : MENU_DURATION;

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    []
  );

  function toggle() {
    // The common mistake: an `isAnimating` guard that drops input until the
    // current animation is done.
    if (locked && animating) {
      setIgnored((count) => count + 1);
      return;
    }
    setOpen((value) => !value);
    setAnimating(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnimating(false), duration);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Screen backdrop={<ListBackdrop />} className="h-40">
        <div className="absolute top-3 right-3">
          <button
            type="button"
            aria-expanded={open}
            onClick={toggle}
            className="flex h-7 cursor-pointer items-center gap-1 rounded-md bg-card px-2 text-[11px] font-medium text-foreground shadow-(--custom-shadow) outline-none select-none focus-visible:ring-[1.5px] focus-visible:ring-ring/50 dark:bg-muted"
          >
            Sort
            <CaretDownIcon
              aria-hidden="true"
              className="size-3 text-muted-foreground transition-transform motion-reduce:transition-none"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transitionDuration: `${duration}ms`,
              }}
              weight="bold"
            />
          </button>
          <ul
            aria-hidden="true"
            className="absolute top-9 right-0 w-32 origin-top-right rounded-md bg-card p-1 shadow-(--custom-shadow) dark:bg-muted"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "scale(1) translateY(0)" : "scale(0.9) translateY(-4px)",
              transition: `opacity ${duration}ms ${SHEET_EASE}, transform ${duration}ms ${SHEET_EASE}`,
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "rounded-sm px-2 py-1 text-[11px]",
                  index === 0
                    ? "bg-muted text-foreground dark:bg-input/50"
                    : "text-muted-foreground"
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Screen>
      <span className="text-xs tabular-nums text-muted-foreground">
        {locked
          ? `${ignored} ${ignored === 1 ? "tap" : "taps"} ignored`
          : "Every tap goes through"}
      </span>
    </div>
  );
}

export function InterruptLockDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" label="Locked">
          <Menu locked />
        </CompareItem>
        <CompareItem verdict="right" label="Listening">
          <Menu locked={false} />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/* ------------------------------------------------------------------------ */
/* 3. Momentum                                                              */
/* ------------------------------------------------------------------------ */

const TRAVEL = 180;

const TRACKS = [
  {
    label: "Transition",
    transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  },
  {
    label: "Spring",
    transition: { type: "spring" as const, stiffness: 120, damping: 16 },
  },
];

export function InterruptMomentumDemo() {
  const reduceMotion = useReducedMotion();
  const [on, setOn] = useState(false);

  return (
    <Demo className="gap-8">
      <div className="flex flex-col gap-4">
        {TRACKS.map((track) => (
          <div key={track.label} className="flex items-center gap-3">
            <span className="w-16 text-right text-[10px] text-muted-foreground">
              {track.label}
            </span>
            <div className="h-11 w-56 rounded-full bg-muted p-1 shadow-(--custom-shadow) dark:bg-muted/60">
              <motion.div
                aria-hidden="true"
                animate={{ x: on ? TRAVEL : 0 }}
                className="size-9 rounded-full bg-foreground"
                transition={reduceMotion ? { duration: 0 } : track.transition}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={() => setOn((value) => !value)} variant="secondary">
        <ArrowsLeftRightIcon weight="bold" />
        Toggle
      </Button>
    </Demo>
  );
}

/* ------------------------------------------------------------------------ */
/* 4. New elements arriving mid-animation                                   */
/* ------------------------------------------------------------------------ */

const TOAST_MESSAGES = [
  "Changes saved",
  "Link copied",
  "Invite sent",
  "File uploaded",
  "Comment posted",
] as const;

type Toast = { id: number; message: string };

export function InterruptStackDemo() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  function addToast() {
    const id = nextId.current++;
    const message = TOAST_MESSAGES[id % TOAST_MESSAGES.length];
    setToasts((current) => [...current, { id, message }].slice(-3));
    timers.current.push(
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2600)
    );
  }

  return (
    <Demo className="gap-8">
      <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-xl bg-muted shadow-(--custom-shadow) dark:bg-muted/40">
        <div aria-hidden="true">
          <GridBackdrop />
        </div>
        <ul className="absolute inset-x-3 bottom-3 flex flex-col items-end gap-2">
          <AnimatePresence initial={false} mode="popLayout">
            {toasts.map((toast) => (
              <motion.li
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="flex w-44 items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs text-foreground shadow-(--custom-shadow)"
              >
                <CheckCircleIcon
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-emerald-500"
                  weight="fill"
                />
                {toast.message}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Button onClick={addToast} variant="secondary">
        <PlusIcon weight="bold" />
        Add toast
      </Button>
    </Demo>
  );
}
