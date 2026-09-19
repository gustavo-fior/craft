"use client";

import { useDemoText } from "@/components/app/demo-messages";
import {
  ArrowsLeftRightIcon,
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

// Slowed down on purpose so there is time to change your mind mid-flight.
const SHEET_DURATION = 600;
const SHEET_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const SHEET_HIDDEN = "translateY(calc(100% + 8px))";

const SHEET_ACTIONS = [
  { label: "Copy link", Icon: LinkSimpleIcon },
  { label: "Send by email", Icon: EnvelopeSimpleIcon },
  { label: "Invite people", Icon: UsersIcon },
] as const;

function Sheet({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const t = useDemoText();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-x-1.5 bottom-1.5 rounded-lg bg-card p-2.5 shadow-(--custom-shadow)",
        className
      )}
      style={style}
    >
      <div className="mx-auto mb-2.5 h-1 w-8 rounded-full bg-foreground/15" />
      <p className="mb-1.5 px-1 text-xs font-medium text-foreground">{t("Share")}</p>
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
            {t(action.label)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted shadow-(--custom-shadow) dark:bg-muted/40">
      <div aria-hidden="true" className="p-3">
        <div className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
        <div className="mt-2 h-1.5 w-4/5 rounded-full bg-foreground/10" />
        <div className="mt-2 h-1.5 w-2/3 rounded-full bg-foreground/10" />
      </div>
      {children}
    </div>
  );
}

export function InterruptibilityDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [runs, setRuns] = useState(0);
  const duration = reduceMotion ? 0 : SHEET_DURATION;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <style>{`
        @keyframes craft-sheet-in {
          from { transform: ${SHEET_HIDDEN}; }
          to { transform: translateY(0); }
        }
        @keyframes craft-sheet-out {
          from { transform: translateY(0); }
          to { transform: ${SHEET_HIDDEN}; }
        }
      `}</style>

      <Compare>
        <CompareItem verdict="wrong" caption={t("Keyframes")}>
          <Screen>
            <Sheet
              style={{
                transform: SHEET_HIDDEN,
                animation:
                  runs === 0
                    ? "none"
                    : `${open ? "craft-sheet-in" : "craft-sheet-out"} ${duration}ms ${SHEET_EASE} both`,
              }}
            />
          </Screen>
        </CompareItem>

        <CompareItem verdict="right" caption={t("Transition")}>
          <Screen>
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
        {open ? t("Close") : t("Open")}
      </Button>
    </Demo>
  );
}

const TRAVEL = 180;

const TRACKS = [
  {
    label: "Tween",
    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const },
  },
  {
    label: "Spring",
    transition: { type: "spring" as const, stiffness: 120, damping: 16 },
  },
];

export function SpringVelocityDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [on, setOn] = useState(false);

  return (
    <Demo className="gap-8">
      <div className="flex flex-col gap-4">
        {TRACKS.map((track) => (
          <div key={track.label} className="flex items-center gap-3">
            <span className="w-11 text-right text-[10px] text-muted-foreground">
              {t(track.label)}
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
        {t("Toggle")}
      </Button>
    </Demo>
  );
}

const TOAST_MESSAGES = [
  "Changes saved",
  "Link copied",
  "Invite sent",
  "File uploaded",
  "Comment posted",
] as const;

type Toast = { id: number; message: string };

export function ToastStackDemo() {
  const t = useDemoText();
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
        <div aria-hidden="true" className="p-4">
          <div className="h-1.5 w-1/3 rounded-full bg-foreground/15" />
          <div className="mt-2.5 h-1.5 w-3/5 rounded-full bg-foreground/10" />
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
                {t(toast.message)}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <Button onClick={addToast} variant="secondary">
        <PlusIcon weight="bold" />
        {t("Add toast")}
      </Button>
    </Demo>
  );
}
