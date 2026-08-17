"use client";

import { useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

export function SegmentedControl<T extends string>({
  ariaLabel,
  className,
  onChange,
  options,
  value,
}: {
  ariaLabel: string;
  className?: string;
  onChange: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];
  value: T;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const positionedRef = useRef(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const active = activeRef.current;
    if (!overlay || !active) return;

    if (!positionedRef.current) overlay.style.transition = "none";

    const right =
      overlay.offsetWidth - (active.offsetLeft + active.offsetWidth);
    overlay.style.clipPath = `inset(2px ${right}px 2px ${active.offsetLeft}px round 9999px)`;

    if (!positionedRef.current) {
      void overlay.offsetWidth;
      overlay.style.transition = "";
      positionedRef.current = true;
    }
  }, [value]);

  return (
    <div
      aria-label={ariaLabel}
      className={cn("relative flex w-fit rounded-full p-0.5", className)}
      role="group"
    >
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden [clip-path:inset(2px_100%_2px_0_round_9999px)] [transition:clip-path_0.25s_ease]"
      >
        <div className="flex h-full items-center bg-primary/5 p-0.5 dark:bg-muted">
          {options.map((option) => (
            <span
              key={option.value}
              className="flex h-8 items-center px-3 text-xs font-medium text-foreground"
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>

      {options.map((option) => (
        <button
          key={option.value}
          ref={value === option.value ? activeRef : null}
          aria-pressed={value === option.value}
          className={cn(
            "h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            value === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
