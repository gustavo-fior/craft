"use client";

import { useEffect, useMemo, useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoLocale, useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { languageTag } from "@/i18n/locales";
import { cn } from "@/lib/utils";

export type FigureStyle = "proportional" | "tabular";

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
  const t = useDemoText();
  return (
    <SegmentedControl
      ariaLabel={t("Figure style")}
      onChange={onChange}
      options={FIGURE_STYLES.map((option) => ({
        ...option,
        label: t(option.label),
      }))}
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

/** Timer readout; `elapsed` is in ms so the video can drive it per frame. */
export function TabularTimerView({
  mode,
  elapsed,
  onModeChange,
}: {
  mode: FigureStyle;
  elapsed: number;
  onModeChange?: (mode: FigureStyle) => void;
}) {
  const t = useDemoText();
  const locale = languageTag(useDemoLocale());
  const numberFormat = useMemo(() => new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  }), [locale]);
  const seconds = numberFormat.format(elapsed / 1000);

  return (
    <Demo className="gap-8">
      <div className="relative flex items-center">
        <span
          className="text-5xl font-medium tracking-tight"
          style={numericStyles[mode]}
          aria-label={t("{seconds} seconds elapsed", { seconds })}
        >
          {seconds}
        </span>
        <span
          className="ml-2 h-11 border-l border-dashed border-sky-300 dark:border-sky-900"
          aria-hidden="true"
        />
        <span
          className="absolute -right-2.5 -bottom-5 text-[9px] text-sky-400 dark:text-sky-500"
          aria-hidden="true"
        >
          {t("Edge")}
        </span>
      </div>
      <FigureStyleControl value={mode} onChange={onModeChange ?? (() => {})} />
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

  return <TabularTimerView mode={mode} elapsed={elapsed} onModeChange={setMode} />;
}

const activity = [
  {
    label: "Vercel",
    domain: "vercel.com",
    sessions: 12_441,
    change: 0.081,
  },
  {
    label: "Raycast",
    domain: "raycast.com",
    sessions: 21_118,
    change: -0.0187,
  },
  {
    label: "Notion",
    domain: "notion.so",
    sessions: 11_874,
    change: 0.0718,
  },
  {
    label: "Linear",
    domain: "linear.app",
    sessions: 17_481,
    change: -0.0111,
  },
];

export function TabularTableDemo() {
  const t = useDemoText();
  const locale = languageTag(useDemoLocale());
  const [mode, setMode] = useState<FigureStyle>("proportional");
  const formatters = useMemo(() => ({
    sessions: new Intl.NumberFormat(locale),
    change: new Intl.NumberFormat(locale, {
      style: "percent",
      signDisplay: "always",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }), [locale]);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="w-full overflow-hidden rounded-md bg-card shadow-(--custom-shadow)">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-10 border-b border-[#E7E7E7] dark:border-[#1E1E1E] px-4 py-2.5 text-xs font-medium text-muted-foreground">
          <span>{t("Project")}</span>
          <span>{t("Sessions")}</span>
          <span>{t("Change")}</span>
        </div>
        <div className="divide-y divide-[#E7E7E7] dark:divide-[#1E1E1E]">
          {activity.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-10 px-4 py-3 text-xs"
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
                {formatters.sessions.format(row.sessions)}
              </span>
              <span
                className={cn(
                  "min-w-12 text-right",
                  row.change < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
                style={numericStyles[mode]}
              >
                {formatters.change.format(row.change)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <FigureStyleControl value={mode} onChange={setMode} />
    </Demo>
  );
}
