"use client";

import { DotsThreeIcon, ImageIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type RadiusMode = "same" | "nested";

const RADIUS_OPTIONS = [
  { value: "same", label: "Same radius" },
  { value: "nested", label: "Nested" },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function NestedRadiusDemo() {
  const [mode, setMode] = useState<RadiusMode>("same");
  const nested = mode === "nested";
  const innerRadius = 16;
  const inset = 12;
  const outerRadius = nested ? innerRadius + inset : innerRadius;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <div
          className="bg-primary/8 p-3 shadow-(--custom-shadow) transition-[border-radius] duration-200 ease-out motion-reduce:transition-none dark:bg-muted"
          style={{ borderRadius: outerRadius }}
        >
          <div
            className="grid h-32 w-56 place-items-center bg-card shadow-(--custom-shadow) transition-[border-radius] duration-200 ease-out motion-reduce:transition-none"
            style={{ borderRadius: innerRadius }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-xs text-foreground">
                {outerRadius}px
              </span>
              <span className="text-[10px] text-muted-foreground">
                outer radius
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span>inner 16px</span>
          <span aria-hidden="true">·</span>
          <span>inset 12px</span>
        </div>
      </div>

      <SegmentedControl
        ariaLabel="Nested radius comparison"
        onChange={setMode}
        options={RADIUS_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {nested
          ? "The outer corner adds the 12px inset, so both curves follow each other."
          : "Both corners use 16px, so the gap gets wider around the curve."}
      </p>
    </Demo>
  );
}

export function RadiusCalculatorDemo() {
  const [outerRadius, setOuterRadius] = useState(32);
  const [inset, setInset] = useState(12);
  const innerRadius = Math.max(0, outerRadius - inset);

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <div
          className="bg-primary/8 p-(--demo-inset) shadow-(--custom-shadow) transition-[border-radius,padding] duration-200 ease-out motion-reduce:transition-none dark:bg-muted"
          style={
            {
              "--demo-inset": `${inset}px`,
              borderRadius: outerRadius,
            } as React.CSSProperties
          }
        >
          <div
            className="grid h-28 w-52 place-items-center bg-card shadow-(--custom-shadow) transition-[border-radius] duration-200 ease-out motion-reduce:transition-none"
            style={{ borderRadius: innerRadius }}
          >
            <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
              {outerRadius} − {inset} = {innerRadius}px
            </span>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">inner radius</span>
      </div>

      <div className="grid w-full max-w-xs gap-5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Outer radius
            <span className="font-mono text-[10px] text-foreground">
              {outerRadius}px
            </span>
          </span>
          <Slider
            aria-label="Outer radius"
            max={48}
            min={12}
            onValueChange={(value) => setOuterRadius(getSliderValue(value))}
            step={1}
            value={[outerRadius]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Inset
            <span className="font-mono text-[10px] text-foreground">
              {inset}px
            </span>
          </span>
          <Slider
            aria-label="Inset"
            max={28}
            min={4}
            onValueChange={(value) => setInset(getSliderValue(value))}
            step={1}
            value={[inset]}
          />
        </label>
      </div>
    </Demo>
  );
}

export function NestedRadiusExamplesDemo() {
  const [mode, setMode] = useState<RadiusMode>("same");
  const nested = mode === "nested";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div
        aria-hidden="true"
        className="grid w-full max-w-md gap-4 sm:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="rounded-3xl bg-card p-2 shadow-(--custom-shadow)">
          <div
            className="grid h-24 place-items-center bg-muted transition-[border-radius] duration-200 ease-out motion-reduce:transition-none"
            style={{ borderRadius: nested ? 16 : 24 }}
          >
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between px-2 pb-1 pt-3">
            <div>
              <p className="text-xs font-medium text-foreground">Quiet lake</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Card · 8px inset
              </p>
            </div>
            <DotsThreeIcon
              className="size-4 text-muted-foreground"
              weight="bold"
            />
          </div>
        </div>

        <div className="self-center rounded-2xl bg-card p-1 shadow-(--custom-shadow)">
          {["Duplicate", "Move to folder", "Archive"].map((item, index) => (
            <div
              key={item}
              className={cn(
                "flex h-9 items-center px-3 text-xs transition-[border-radius] duration-200 ease-out motion-reduce:transition-none",
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
              style={{ borderRadius: nested ? 12 : 16 }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <SegmentedControl
        ariaLabel="Component radius comparison"
        onChange={setMode}
        options={RADIUS_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {nested
          ? "The media and menu item subtract their inset from the outer radius."
          : "Reusing the outer radius makes both inner corners look too round."}
      </p>
    </Demo>
  );
}
