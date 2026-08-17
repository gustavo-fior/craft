"use client";

import { useEffect, useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type FigureStyle = "proportional" | "tabular";

const numericStyles: Record<FigureStyle, React.CSSProperties> = {
  proportional: { fontVariantNumeric: "proportional-nums" },
  tabular: { fontVariantNumeric: "tabular-nums" },
};

const FIGURE_STYLES = [
  { value: "proportional", label: "Proportional" },
  { value: "tabular", label: "Tabular" },
] as const;

function FigureStyleControl({
  value,
  onChange,
}: {
  value: FigureStyle;
  onChange: (value: FigureStyle) => void;
}) {
  return (
    <SegmentedControl
      ariaLabel="Figure style"
      onChange={onChange}
      options={FIGURE_STYLES}
      value={value}
    />
  );
}

export function TabularNumsDemo() {
  const [mode, setMode] = useState<FigureStyle>("proportional");
  const digits = "0123456789";

  return (
    <Demo className="gap-8 overflow-hidden">
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex items-end gap-px" style={numericStyles[mode]}>
          {digits.split("").map((digit, index) => (
            <span
              key={digit}
              className={cn(
                "inline-flex h-14 items-center justify-center text-[2.5rem] font-medium leading-none",
                index % 2 === 0 ? "bg-foreground/10" : "bg-foreground/5"
              )}
            >
              {digit}
            </span>
          ))}
        </div>
      </div>
      <FigureStyleControl value={mode} onChange={setMode} />
    </Demo>
  );
}

export function TabularTimerDemo() {
  const [mode, setMode] = useState<FigureStyle>("proportional");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now() - 8_750;
    const id = window.setInterval(() => setElapsed(Date.now() - start), 50);
    return () => window.clearInterval(id);
  }, []);

  const seconds = (elapsed / 1000).toFixed(2).padStart(5, "0");

  return (
    <Demo className="gap-8">
      <div className="relative flex items-center">
        <span
          className="text-5xl font-medium tracking-tight"
          style={numericStyles[mode]}
          aria-label={`${seconds} seconds elapsed`}
        >
          {seconds}
        </span>
        <span className="ml-2 h-11 w-px bg-rose-500/65" aria-hidden="true" />
        <span
          className="absolute -right-2.5 -bottom-5 text-[9px] text-rose-500"
          aria-hidden="true"
        >
          Edge
        </span>
      </div>
      <FigureStyleControl value={mode} onChange={setMode} />
    </Demo>
  );
}

const activity = [
  {
    label: "Vercel",
    domain: "vercel.com",
    sessions: "12,441",
    change: "+8.10%",
  },
  {
    label: "Raycast",
    domain: "raycast.com",
    sessions: "21,118",
    change: "-1.87%",
  },
  {
    label: "Notion",
    domain: "notion.so",
    sessions: "11,874",
    change: "+7.18%",
  },
  {
    label: "Linear",
    domain: "linear.app",
    sessions: "17,481",
    change: "-1.11%",
  },
];

export function TabularTableDemo() {
  const [mode, setMode] = useState<FigureStyle>("proportional");

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="w-full overflow-hidden rounded-md bg-card shadow-(--custom-shadow)">
        <div className="grid grid-cols-[1fr_auto_auto] gap-10 border-b border-[#E7E7E7] dark:border-[#1E1E1E] px-4 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Project</span>
          <span>Sessions</span>
          <span>Change</span>
        </div>
        <div className="divide-y divide-[#E7E7E7] dark:divide-[#1E1E1E]">
          {activity.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-10 px-4 py-3 text-xs"
            >
              <span className="flex min-w-0 items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${row.domain}&sz=64`}
                  alt=""
                  width={16}
                  height={16}
                  loading="lazy"
                  className="size-4 shrink-0 rounded-3xl corner-squircle"
                />
                <span className="truncate text-foreground">{row.label}</span>
              </span>
              <span
                className="min-w-14 text-right text-muted-foreground"
                style={numericStyles[mode]}
              >
                {row.sessions}
              </span>
              <span
                className={cn(
                  "min-w-12 text-right",
                  row.change.startsWith("-")
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
                style={numericStyles[mode]}
              >
                {row.change}
              </span>
            </div>
          ))}
        </div>
      </div>
      <FigureStyleControl value={mode} onChange={setMode} />
    </Demo>
  );
}
