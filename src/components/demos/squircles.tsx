"use client";

import { useEffect, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type CornerMode = "round" | "squircle";

const CORNER_OPTIONS = [
  { value: "round", label: "Round" },
  { value: "squircle", label: "Squircle" },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

// `corner-shape` ignores unsupported values, so the demos quietly fall back to
// round corners. Say so, otherwise the comparison looks like nothing changes.
function useCornerShapeSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(
      typeof CSS !== "undefined" && CSS.supports("corner-shape", "squircle")
    );
  }, []);

  return supported;
}

function UnsupportedNote() {
  const t = useDemoText();
  const supported = useCornerShapeSupport();
  if (supported) return null;

  return (
    <p className="max-w-xs text-center text-xs text-pretty text-muted-foreground/70">
      {t("Your browser does not support")} <code>corner-shape</code> {t("yet, so every corner here renders as round.")}
    </p>
  );
}

const TILE_CLASS =
  "size-24 bg-linear-to-br from-sky-500 to-indigo-600 shadow-(--custom-shadow) sm:size-28 [--edge:0_0_0_/_0.15] dark:[--edge:255_255_255_/_0.1]";

const TILE_STYLE: React.CSSProperties = {
  outline: "1px solid rgb(var(--edge))",
  outlineOffset: -1,
};

export function SquircleCompareDemo() {
  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <Compare>
        <CompareItem caption="corner-shape: round">
          <div
            aria-hidden="true"
            className={cn(TILE_CLASS, "rounded-[28px] corner-round")}
            style={TILE_STYLE}
          />
        </CompareItem>
        <CompareItem caption="corner-shape: squircle">
          <div
            aria-hidden="true"
            className={cn(TILE_CLASS, "rounded-[28px] corner-squircle")}
            style={TILE_STYLE}
          />
        </CompareItem>
      </Compare>
      <UnsupportedNote />
    </Demo>
  );
}

// Named stops on the superellipse scale. The parameter is an exponent of two,
// so 1 is a circle, 2 is the classic squircle and 0 is a straight bevel.
const CURVATURE_NAMES: Record<string, string> = {
  "-1": "scoop",
  "0": "bevel",
  "1": "round",
  "2": "squircle",
};

/** Curvature tile and slider; controlled so the video can drag it per frame. */
export function SquircleCurvatureView({
  curvature,
  onCurvatureChange,
}: {
  curvature: number;
  onCurvatureChange?: (curvature: number) => void;
}) {
  const t = useDemoText();
  const name = CURVATURE_NAMES[String(curvature)];

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-4" aria-hidden="true">
        <div
          className="size-36 rounded-[48px] bg-card shadow-(--custom-shadow) transition-[corner-shape] duration-200 ease-out motion-reduce:transition-none dark:bg-muted"
          style={
            {
              cornerShape: `superellipse(${curvature})`,
            } as React.CSSProperties
          }
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          <span className="text-foreground">
            superellipse({curvature.toFixed(1)})
          </span>
          {name ? <span className="ml-2">{name}</span> : null}
        </span>
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Curvature")}
          <span className="tabular-nums text-foreground">
            {curvature.toFixed(1)}
          </span>
        </span>
        <Slider
          aria-label={t("Curvature")}
          max={4}
          min={-1}
          onValueChange={(value) => onCurvatureChange?.(getSliderValue(value))}
          step={0.1}
          value={[curvature]}
        />
      </label>
      <UnsupportedNote />
    </Demo>
  );
}

export function SquircleCurvatureDemo() {
  const [curvature, setCurvature] = useState(2);
  return (
    <SquircleCurvatureView
      curvature={curvature}
      onCurvatureChange={setCurvature}
    />
  );
}

export function SquircleExamplesDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<CornerMode>("round");
  const corner = mode === "squircle" ? "corner-squircle" : "corner-round";

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div
        aria-hidden="true"
        className="flex w-full max-w-md flex-wrap items-center justify-center gap-6 sm:gap-10"
      >
        {/* Avatar: a big radius on a small box, the squircle is obvious. */}
        <div
          className={cn(
            "size-14 rounded-[22px] bg-linear-to-br from-amber-300 to-orange-500 shadow-(--custom-shadow)",
            corner
          )}
        />

        {/* Button: a small radius on a wide box, the squircle is subtle. */}
        <span
          className={cn(
            "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground shadow-(--custom-shadow)",
            corner
          )}
        >
          {t("Continue")}
        </span>

        {/* Card with a nested surface: both layers need the same shape and
            the outer radius still equals inner radius plus the inset. */}
        <div
          className={cn(
            "w-44 rounded-[24px] bg-muted p-2 shadow-(--custom-shadow) dark:bg-muted/60",
            corner
          )}
        >
          <div
            className={cn(
              "h-20 rounded-[16px] bg-card shadow-(--custom-shadow) dark:bg-muted",
              corner
            )}
          />
        </div>
      </div>

      <SegmentedControl
        ariaLabel={t("Corner shape")}
        onChange={setMode}
        options={CORNER_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
      <UnsupportedNote />
    </Demo>
  );
}
