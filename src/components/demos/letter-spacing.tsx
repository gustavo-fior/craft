"use client";

import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/**
 * Inter's dynamic metrics: the letter spacing (in em) that keeps the
 * typeface looking even at a given pixel size. From rsms.me/inter/dynmetrics.
 */
function interTracking(fontSizePx: number) {
  const a = -0.0223;
  const b = 0.185;
  const c = -0.1745;
  return a + b * Math.exp(c * fontSizePx);
}

function formatEm(value: number) {
  const rounded = Math.round(value * 1000) / 1000;
  if (rounded === 0) return "0";
  return `${rounded > 0 ? "+" : ""}${rounded}em`;
}

function unwrap(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : (value as number);
}

export function LetterSpacingDemo() {
  const t = useDemoText();
  const [size, setSize] = useState(48);
  const tracking = interTracking(size);

  return (
    <Demo className="gap-8">
      <div className="grid w-full max-w-sm gap-1 rounded-xl bg-card px-6 py-5 shadow-(--custom-shadow)">
        {[0, tracking].map((value, index) => (
          <div
            key={index}
            className="flex min-w-0 items-baseline justify-between gap-4"
          >
            <span
              className="truncate font-semibold leading-none text-foreground"
              style={{
                fontSize: size,
                letterSpacing: `${value}em`,
              }}
            >
              {t("Headline")}
            </span>
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
              {formatEm(value)}
            </span>
          </div>
        ))}
      </div>
      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex justify-between text-xs text-muted-foreground">
          {t("Size")}
          <span className="tabular-nums text-foreground">{size}px</span>
        </span>
        <Slider
          aria-label={t("Font size")}
          max={72}
          min={16}
          onValueChange={(value) => setSize(unwrap(value))}
          step={1}
          value={[size]}
        />
      </label>
    </Demo>
  );
}

type Tracking = "flat" | "scaled";

const TRACKING_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "scaled", label: "Scaled" },
] as const;

const SCALE = [
  { size: 34, weight: 600, text: "Launch week", lineHeight: 1.05 },
  { size: 20, weight: 500, text: "Five days of shipping", lineHeight: 1.2 },
  {
    size: 14,
    weight: 400,
    text: "Every day this week we release one thing we have been working on for months. Some are big, most are small.",
    lineHeight: 1.55,
  },
  { size: 11, weight: 500, text: "Posted Monday, 9:00", lineHeight: 1.4 },
] as const;

export function TrackingScaleDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Tracking>("flat");

  return (
    <Demo className="gap-8">
      <div className="grid w-full max-w-sm gap-2.5 rounded-xl bg-card px-6 py-6 shadow-(--custom-shadow)">
        {SCALE.map((step, index) => (
          <span
            key={step.size}
            className={cn(
              "transition-[letter-spacing] duration-200 ease-out motion-reduce:transition-none",
              index >= 2 ? "text-muted-foreground" : "text-foreground"
            )}
            style={{
              fontSize: step.size,
              fontWeight: step.weight,
              lineHeight: step.lineHeight,
              letterSpacing:
                mode === "scaled" ? `${interTracking(step.size)}em` : "0",
            }}
          >
            {t(step.text)}
          </span>
        ))}
      </div>
      <SegmentedControl
        ariaLabel={t("Letter spacing across the scale")}
        onChange={setMode}
        options={TRACKING_OPTIONS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}

const PINNED = [
  { name: "Roadmap", status: "Draft" },
  { name: "Pricing", status: "Live" },
  { name: "Changelog", status: "Live" },
] as const;

function PinnedList({ tracking }: { tracking: string }) {
  const t = useDemoText();
  return (
    <div className="w-full rounded-xl bg-card p-2 shadow-(--custom-shadow)">
      <span
        className="block px-2 pt-1 pb-2 text-[10px] font-semibold uppercase text-muted-foreground"
        style={{ letterSpacing: tracking }}
      >
        {t("Pinned")}
      </span>
      <ul className="flex flex-col">
        {PINNED.map((page) => (
          <li
            key={page.name}
            className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-foreground"
          >
            <span className="truncate">{t(page.name)}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                page.status === "Live"
                  ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
              style={{ letterSpacing: tracking }}
            >
              {t(page.status)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UppercaseTrackingDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <PinnedList tracking="0" />
        </CompareItem>
        <CompareItem verdict="right">
          <PinnedList tracking="0.06em" />
        </CompareItem>
      </Compare>
    </Demo>
  );
}
