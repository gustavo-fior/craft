"use client";

import { useEffect, useState } from "react";

import { Demo } from "@/components/app/demo";
import { cn } from "@/lib/utils";

type FigureStyle = "proportional" | "tabular";

const numericStyles: Record<FigureStyle, React.CSSProperties> = {
  proportional: { fontVariantNumeric: "proportional-nums" },
  tabular: { fontVariantNumeric: "tabular-nums" },
};

function FigureStyleControl({
  value,
  onChange,
}: {
  value: FigureStyle;
  onChange: (value: FigureStyle) => void;
}) {
  return (
    <div
      className="flex rounded-full border bg-background p-0.5 shadow-xs"
      role="group"
      aria-label="Figure style"
    >
      {(["proportional", "tabular"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "h-7 cursor-pointer rounded-full px-3 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            value === option
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ModeLabel({ mode }: { mode: FigureStyle }) {
  return (
    <code className="font-mono text-[10px] text-muted-foreground">
      {mode === "tabular" ? "tnum" : "pnum"}
    </code>
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
          className="absolute -right-1.5 -bottom-5 font-mono text-[9px] text-rose-500"
          aria-hidden="true"
        >
          edge
        </span>
      </div>
      <FigureStyleControl value={mode} onChange={setMode} />
    </Demo>
  );
}

const activity = [
  { label: "Northstar", sessions: "12,441", change: "+8.10%" },
  { label: "Raycast", sessions: "18,118", change: "+1.87%" },
  { label: "Superhuman", sessions: "11,874", change: "+7.18%" },
  { label: "Linear", sessions: "17,481", change: "+1.11%" },
];

export function TabularTableDemo() {
  const [mode, setMode] = useState<FigureStyle>("proportional");

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="w-full overflow-hidden rounded-xl border bg-background shadow-xs">
        <div className="grid grid-cols-[1fr_auto_auto] gap-5 border-b bg-muted/45 px-4 py-2.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          <span>Project</span>
          <span>Sessions</span>
          <span>Change</span>
        </div>
        <div className="divide-y">
          {activity.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-5 px-4 py-3 text-xs"
            >
              <span className="truncate text-foreground">{row.label}</span>
              <span
                className="min-w-14 text-right text-muted-foreground"
                style={numericStyles[mode]}
              >
                {row.sessions}
              </span>
              <span
                className="min-w-12 text-right text-emerald-600 dark:text-emerald-400"
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
