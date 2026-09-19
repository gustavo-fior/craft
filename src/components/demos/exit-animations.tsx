"use client";

import { useDemoText } from "@/components/app/demo-messages";
import { CheckCircleIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN = [0.42, 0, 1, 1] as const;

function Toast() {
  const t = useDemoText();
  return (
    <div className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-md">
      <CheckCircleIcon
        aria-hidden="true"
        className="size-4 text-emerald-500"
        weight="fill"
      />
      <span className="font-medium">{t("Changes saved")}</span>
      <span className="ml-1 text-background/60">{t("Undo")}</span>
    </div>
  );
}

function ToastWindow({
  open,
  reversed,
  reduceMotion,
}: {
  open: boolean;
  reversed: boolean;
  reduceMotion: boolean;
}) {
  const enter = reduceMotion ? 0 : 0.24;
  const exit = reduceMotion ? 0 : reversed ? 0.24 : 0.12;

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
      <div className="flex h-7 items-center gap-1.5 px-3">
        <span className="size-2 rounded-full bg-foreground/10" />
        <span className="size-2 rounded-full bg-foreground/10" />
        <span className="size-2 rounded-full bg-foreground/10" />
      </div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center px-3">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="toast"
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reversed
                  ? {
                      opacity: 0,
                      y: 12,
                      transition: { duration: exit, ease: EASE_OUT },
                    }
                  : {
                      opacity: 0,
                      scale: 0.98,
                      filter: "blur(2px)",
                      transition: { duration: exit, ease: EASE_IN },
                    }
              }
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: enter, ease: EASE_OUT }}
            >
              <Toast />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ExitAnimationsDemo() {
  const t = useDemoText();
  const [open, setOpen] = useState(true);
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" label={t("Enter, reversed")}>
          <ToastWindow open={open} reduceMotion={reduceMotion} reversed />
        </CompareItem>
        <CompareItem verdict="right" label={t("Quick fade")}>
          <ToastWindow
            open={open}
            reduceMotion={reduceMotion}
            reversed={false}
          />
        </CompareItem>
      </Compare>

      <Button onClick={() => setOpen((value) => !value)} variant="secondary">
        {open ? t("Dismiss") : t("Show")}
      </Button>
    </Demo>
  );
}

const TASKS = [
  "Reply to Sarah",
  "Book flights to Lisbon",
  "Review pull request",
  "Send the invoice",
] as const;

function DeleteButton({ onClick }: { onClick: () => void }) {
  const t = useDemoText();
  return (
    <Button
      aria-label={t("Remove")}
      className="shrink-0 text-muted-foreground"
      onClick={onClick}
      size="icon-xs"
      variant="ghost"
    >
      <XIcon aria-hidden="true" className="size-3.5" weight="bold" />
    </Button>
  );
}

function TaskList({
  tasks,
  onRemove,
  animated,
  reduceMotion,
}: {
  tasks: readonly string[];
  onRemove: (task: string) => void;
  animated: boolean;
  reduceMotion: boolean;
}) {
  const duration = reduceMotion ? 0 : 0.16;

  return (
    <ul className="h-44 w-full overflow-hidden rounded-xl bg-card p-1.5 shadow-(--custom-shadow)">
      {animated ? (
        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              layout
              transition={{ duration, ease: EASE_OUT }}
            >
              <TaskRow onRemove={() => onRemove(task)} task={task} />
            </motion.li>
          ))}
        </AnimatePresence>
      ) : (
        tasks.map((task) => (
          <li key={task}>
            <TaskRow onRemove={() => onRemove(task)} task={task} />
          </li>
        ))
      )}
    </ul>
  );
}

function TaskRow({ task, onRemove }: { task: string; onRemove: () => void }) {
  const t = useDemoText();
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg px-2 text-xs text-foreground">
      <span className="size-3.5 shrink-0 rounded-full border border-foreground/25" />
      <span className="min-w-0 flex-1 truncate">{t(task)}</span>
      <DeleteButton onClick={onRemove} />
    </div>
  );
}

export function ExitListDemo() {
  const t = useDemoText();
  const [left, setLeft] = useState<readonly string[]>(TASKS);
  const [right, setRight] = useState<readonly string[]>(TASKS);
  const reduceMotion = useReducedMotion() ?? false;
  const canReset = left.length < TASKS.length || right.length < TASKS.length;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" label={t("No exit")}>
          <TaskList
            animated={false}
            onRemove={(task) => setLeft((list) => list.filter((t) => t !== task))}
            reduceMotion={reduceMotion}
            tasks={left}
          />
        </CompareItem>
        <CompareItem verdict="right" label={t("Collapse")}>
          <TaskList
            animated
            onRemove={(task) => setRight((list) => list.filter((t) => t !== task))}
            reduceMotion={reduceMotion}
            tasks={right}
          />
        </CompareItem>
      </Compare>

      <Button
        disabled={!canReset}
        onClick={() => {
          setLeft(TASKS);
          setRight(TASKS);
        }}
        variant="secondary"
      >
        {t("Reset")}
      </Button>
    </Demo>
  );
}
