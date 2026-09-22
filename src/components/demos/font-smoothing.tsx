"use client";

import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Smoothing = "auto" | "antialiased" | "subpixel-antialiased" | "none";

const SMOOTHING_OPTIONS = [
  { value: "auto", label: "Default" },
  { value: "antialiased", label: "Antialiased" },
] as const;

/** Every legal value of the property, for the reference demo. */
const ALL_SMOOTHING_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "antialiased", label: "Antialiased" },
  { value: "subpixel-antialiased", label: "Subpixel" },
  { value: "none", label: "None" },
] as const;

const smoothingStyles: Record<Smoothing, React.CSSProperties> = {
  auto: { WebkitFontSmoothing: "auto", MozOsxFontSmoothing: "auto" },
  antialiased: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  // No `-moz-` equivalent exists for either of these, so Firefox falls back to
  // its own default. Both are macOS-only in any case.
  "subpixel-antialiased": { WebkitFontSmoothing: "subpixel-antialiased" },
  none: { WebkitFontSmoothing: "none" },
};

function SmoothingControl({
  value,
  onChange,
  options = SMOOTHING_OPTIONS,
}: {
  value: Smoothing;
  onChange: (value: Smoothing) => void;
  options?: readonly { value: Smoothing; label: string }[];
}) {
  return (
    <SegmentedControl
      ariaLabel="Font smoothing"
      onChange={onChange}
      options={options}
      value={value}
    />
  );
}

function ReleaseNote({ tone }: { tone: "dark" | "light" }) {
  const dark = tone === "dark";

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={cn(
          "text-[10px] font-medium uppercase tracking-wider",
          dark ? "text-white/45" : "text-black/40"
        )}
      >
        Changelog
      </span>
      <span
        className={cn(
          "text-lg font-semibold leading-tight tracking-tight",
          dark ? "text-white" : "text-neutral-900"
        )}
      >
        Faster cold starts
      </span>
      <span
        className={cn(
          "text-sm leading-relaxed",
          dark ? "text-white/70" : "text-neutral-600"
        )}
      >
        Functions now boot in under 100ms. No changes are needed on your side.
      </span>
    </div>
  );
}

export function FontSmoothingDemo() {
  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <Compare className="grid-cols-1 sm:grid-cols-2">
        <CompareItem caption="Default">
          <div
            className="w-full rounded-xl bg-neutral-900 px-5 py-5 shadow-(--custom-shadow) dark:bg-neutral-950"
            style={smoothingStyles.auto}
          >
            <ReleaseNote tone="dark" />
          </div>
        </CompareItem>
        <CompareItem caption="Antialiased">
          <div
            className="w-full rounded-xl bg-neutral-900 px-5 py-5 shadow-(--custom-shadow) dark:bg-neutral-950"
            style={smoothingStyles.antialiased}
          >
            <ReleaseNote tone="dark" />
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

export function FontSmoothingContrastDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div
        className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
        style={smoothingStyles[mode]}
      >
        <div className="rounded-xl bg-white px-5 py-5 shadow-(--custom-shadow)">
          <ReleaseNote tone="light" />
        </div>
        <div className="rounded-xl bg-neutral-900 px-5 py-5 shadow-(--custom-shadow) dark:bg-neutral-950">
          <ReleaseNote tone="dark" />
        </div>
      </div>
      <SmoothingControl value={mode} onChange={setMode} />
    </Demo>
  );
}

const WEIGHTS = [300, 400, 500, 600, 700] as const;

export function FontSmoothingWeightsDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8">
      <div
        className="flex w-full max-w-sm flex-col rounded-xl bg-neutral-900 px-6 py-3 shadow-(--custom-shadow) dark:bg-neutral-950"
        style={smoothingStyles[mode]}
      >
        {WEIGHTS.map((weight) => (
          <div
            key={weight}
            className="flex items-baseline justify-between gap-6 border-b border-white/8 py-2.5 last:border-b-0"
          >
            <span
              className="text-base text-white"
              style={{ fontWeight: weight }}
            >
              The quick brown fox
            </span>
            <span className="text-[10px] tabular-nums text-white/40">
              {weight}
            </span>
          </div>
        ))}
      </div>
      <SmoothingControl value={mode} onChange={setMode} />
    </Demo>
  );
}

export function FontSmoothingValuesDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8">
      <div
        className="w-full max-w-sm rounded-xl bg-neutral-900 px-6 py-6 shadow-(--custom-shadow) dark:bg-neutral-950"
        style={smoothingStyles[mode]}
      >
        <ReleaseNote tone="dark" />
      </div>
      <SmoothingControl
        onChange={setMode}
        options={ALL_SMOOTHING_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
