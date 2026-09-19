"use client";

import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useDemoText } from "./demo-messages";

type Verdict = "wrong" | "right";

/** Coloured "Wrong" / "Right" heading used above side-by-side examples. */
export function CompareLabel({
  verdict,
  children,
  className,
}: {
  verdict: Verdict;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = verdict === "wrong" ? XCircleIcon : CheckCircleIcon;
  const t = useDemoText();

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        verdict === "wrong" ? "text-destructive" : "text-emerald-500",
        className
      )}
    >
      <Icon aria-hidden="true" className="size-4" weight="fill" />
      {children ?? t(verdict === "wrong" ? "Wrong" : "Right")}
    </div>
  );
}

/** Two-column grid for side-by-side comparisons inside a Demo. */
export function Compare({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10",
        className
      )}
    >
      {children}
    </div>
  );
}

/** One column of a Compare grid: optional verdict heading, content, optional tiny caption. */
export function CompareItem({
  verdict,
  label,
  caption,
  children,
  className,
}: {
  verdict?: Verdict;
  label?: React.ReactNode;
  caption?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-6", className)}>
      {verdict ? <CompareLabel verdict={verdict}>{label}</CompareLabel> : null}
      {children}
      {caption ? (
        <span className="text-xs text-muted-foreground">{caption}</span>
      ) : null}
    </div>
  );
}

/** Icon options for a SegmentedControl that toggles between a wrong and a right state. */
export const WRONG_ICON = (
  <XCircleIcon
    aria-hidden="true"
    className="size-4 text-destructive"
    weight="fill"
  />
);

export const RIGHT_ICON = (
  <CheckCircleIcon
    aria-hidden="true"
    className="size-4 text-emerald-500"
    weight="fill"
  />
);
