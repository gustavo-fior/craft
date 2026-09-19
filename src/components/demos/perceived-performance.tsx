"use client";

import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROWS = [
  { title: "Design review", meta: "Today" },
  { title: "Ship OG images", meta: "Yesterday" },
  { title: "Fix Safari overscroll", meta: "Monday" },
] as const;

type LoadState = "loading" | "done";

function useLoad(duration: number) {
  const [state, setState] = useState<LoadState>("done");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function load() {
    clearTimeout(timer.current);
    setState("loading");
    timer.current = setTimeout(() => setState("done"), duration);
  }

  return { state, load };
}

function Spinner({
  className,
  duration = 0.8,
}: {
  className?: string;
  duration?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-4 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground motion-reduce:animate-none",
        className
      )}
      style={{ animationDuration: `${duration}s` }}
    />
  );
}

function Rows({ visible }: { visible: boolean }) {
  const t = useDemoText();
  return (
    <ul
      className={cn(
        "flex flex-col divide-y divide-[#E7E7E7] transition-opacity duration-300 ease-out motion-reduce:transition-none dark:divide-[#1E1E1E]",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {ROWS.map((row) => (
        <li
          key={row.title}
          className="flex h-10 items-center justify-between gap-3 px-3"
        >
          <span className="truncate text-xs text-foreground">{t(row.title)}</span>
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {t(row.meta)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Skeleton({ visible }: { visible: boolean }) {
  const t = useDemoText();
  return (
    <ul
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex flex-col divide-y divide-[#E7E7E7] transition-opacity duration-200 ease-out motion-reduce:transition-none dark:divide-[#1E1E1E]",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {ROWS.map((row, index) => (
        <li
          key={row.title}
          className="flex h-10 items-center justify-between gap-3 px-3"
        >
          <span
            className="h-2.5 animate-pulse rounded-full bg-foreground/10"
            style={{ width: `${52 + index * 14}%` }}
          />
          <span className="h-2 w-8 animate-pulse rounded-full bg-foreground/10" />
        </li>
      ))}
    </ul>
  );
}

function CenteredSpinner({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 grid place-items-center transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <Spinner />
    </div>
  );
}

function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
      {children}
    </div>
  );
}

function LoadButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  const t = useDemoText();
  return (
    <Button disabled={disabled} onClick={onClick} variant="secondary">
      <ArrowsClockwiseIcon weight="bold" />
      {t("Load")}
    </Button>
  );
}

export function PerceivedPerformanceDemo() {
  const t = useDemoText();
  const { state, load } = useLoad(1_200);
  const loading = state === "loading";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem caption={t("Spinner")}>
          <ListCard>
            <Rows visible={!loading} />
            <CenteredSpinner visible={loading} />
          </ListCard>
        </CompareItem>
        <CompareItem caption={t("Skeleton")}>
          <ListCard>
            <Rows visible={!loading} />
            <Skeleton visible={loading} />
          </ListCard>
        </CompareItem>
      </Compare>
      <LoadButton disabled={loading} onClick={load} />
    </Demo>
  );
}

export function LoadingFlashDemo() {
  const t = useDemoText();
  const { state, load } = useLoad(300);
  const loading = state === "loading";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" caption={t("Skeleton for 300ms")}>
          <ListCard>
            <Rows visible={!loading} />
            <Skeleton visible={loading} />
          </ListCard>
        </CompareItem>
        <CompareItem verdict="right" caption={t("Nothing, then fade in")}>
          <ListCard>
            <Rows visible={!loading} />
          </ListCard>
        </CompareItem>
      </Compare>
      <LoadButton disabled={loading} onClick={load} />
    </Demo>
  );
}

const TASKS = [
  "Reply to Jakub",
  "Book the flight",
  "Review pull request",
] as const;

const REQUEST_TIME = 700;

function TaskList({ optimistic }: { optimistic: boolean }) {
  const t = useDemoText();
  const [done, setDone] = useState<boolean[]>(() => TASKS.map(() => false));
  const [pending, setPending] = useState<boolean[]>(() =>
    TASKS.map(() => false)
  );
  const timers = useRef<(ReturnType<typeof setTimeout> | undefined)[]>([]);

  useEffect(() => {
    const current = timers.current;
    return () => current.forEach((timer) => clearTimeout(timer));
  }, []);

  function toggle(index: number) {
    if (pending[index]) return;

    if (optimistic) {
      setDone((prev) => prev.map((value, i) => (i === index ? !value : value)));
      return;
    }

    setPending((prev) => prev.map((value, i) => (i === index ? true : value)));
    clearTimeout(timers.current[index]);
    timers.current[index] = setTimeout(() => {
      setDone((prev) => prev.map((value, i) => (i === index ? !value : value)));
      setPending((prev) =>
        prev.map((value, i) => (i === index ? false : value))
      );
    }, REQUEST_TIME);
  }

  return (
    <div className="w-full rounded-xl bg-card p-1 shadow-(--custom-shadow)">
      <ul className="flex flex-col">
        {TASKS.map((task, index) => (
          <li key={task}>
            <button
              aria-pressed={done[index]}
              className="flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-left text-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => toggle(index)}
              type="button"
            >
              <span className="grid size-4 shrink-0 place-items-center">
                {pending[index] ? (
                  <Spinner className="size-3.5 border-[1.5px]" />
                ) : done[index] ? (
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="size-4 text-emerald-500"
                    weight="fill"
                  />
                ) : (
                  <CircleIcon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground/60"
                  />
                )}
              </span>
              <span
                className={cn(
                  "truncate transition-colors duration-150",
                  done[index]
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {t(task)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OptimisticDemo() {
  const t = useDemoText();
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" caption={t("Waits for the server")}>
          <TaskList optimistic={false} />
        </CompareItem>
        <CompareItem verdict="right" caption={t("Updates right away")}>
          <TaskList optimistic />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

function SpinnerCard({
  loading,
  duration,
}: {
  loading: boolean;
  duration: number;
}) {
  return (
    <div className="grid h-24 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
      <div className="relative grid size-6 place-items-center">
        <div
          className={cn(
            "absolute inset-0 grid place-items-center transition-opacity duration-200 ease-out motion-reduce:transition-none",
            loading ? "opacity-100" : "opacity-0"
          )}
        >
          <Spinner className="size-5" duration={duration} />
        </div>
        <CheckCircleIcon
          aria-hidden="true"
          className={cn(
            "size-6 text-emerald-500 transition-opacity duration-200 ease-out motion-reduce:transition-none",
            loading ? "opacity-0" : "opacity-100"
          )}
          weight="fill"
        />
      </div>
    </div>
  );
}

export function SpinnerSpeedDemo() {
  const t = useDemoText();
  const { state, load } = useLoad(1_500);
  const loading = state === "loading";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem caption={t("1.6s per turn")}>
          <SpinnerCard duration={1.6} loading={loading} />
        </CompareItem>
        <CompareItem caption={t("0.5s per turn")}>
          <SpinnerCard duration={0.5} loading={loading} />
        </CompareItem>
      </Compare>
      <LoadButton disabled={loading} onClick={load} />
    </Demo>
  );
}
