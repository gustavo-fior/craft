"use client";

import { IconArchive, IconCopy, IconFolder } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

import waterLiliesImage from "@/assets/claude-monet-water-lilies.jpg";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

type RadiusMode = "same" | "nested";

const RADIUS_OPTIONS = [
  {
    value: "same",
    label: "Same radius",
    icon: (
      <XCircleIcon
        aria-hidden="true"
        className="size-4 text-destructive"
        weight="fill"
      />
    ),
  },
  {
    value: "nested",
    label: "Nested",
    icon: (
      <CheckCircleIcon
        aria-hidden="true"
        className="size-4 text-emerald-500"
        weight="fill"
      />
    ),
  },
] as const;

const MENU_ITEMS = [
  { label: "Duplicate", icon: IconCopy },
  { label: "Move to folder", icon: IconFolder },
  { label: "Archive", icon: IconArchive },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

// A thin measurement line with end caps, like a dimension guide in a design
// tool. `length` is a CSS length; the line animates with the shape it labels.
function DimensionLine({
  axis,
  length,
  className,
}: {
  axis: "x" | "y";
  length: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bg-sky-400 transition-[width,height] duration-200 ease-out motion-reduce:transition-none dark:bg-sky-500",
        "before:absolute before:bg-sky-400 after:absolute after:bg-sky-400 dark:before:bg-sky-500 dark:after:bg-sky-500",
        axis === "y"
          ? "h-(--len) w-px before:top-0 before:left-1/2 before:h-px before:w-1.5 before:-translate-x-1/2 after:bottom-0 after:left-1/2 after:h-px after:w-1.5 after:-translate-x-1/2"
          : "h-px w-(--len) before:top-1/2 before:left-0 before:h-1.5 before:w-px before:-translate-y-1/2 after:top-1/2 after:right-0 after:h-1.5 after:w-px after:-translate-y-1/2",
        className
      )}
      style={{ "--len": length } as React.CSSProperties}
    />
  );
}

function DimensionLabel({
  name,
  value,
  className,
}: {
  name: string;
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute whitespace-nowrap text-[10px] text-sky-400 dark:text-sky-500",
        className
      )}
    >
      {name} <span className="tabular-nums text-foreground">{value}px</span>
    </span>
  );
}

export function NestedRadiusDemo() {
  const t = useDemoText();
  const innerRadius = 16;
  const inset = 12;
  const examples = [
    {
      label: "Wrong",
      outerRadius: innerRadius,
      description: "Same radius",
    },
    {
      label: "Right",
      outerRadius: innerRadius + inset,
      description: "Radius + inset",
    },
  ] as const;

  return (
    <Demo className="gap-12 px-4">
      <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-10">
        {examples.map((example) => (
          <div
            className="flex min-w-0 flex-col items-center gap-5"
            key={example.label}
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium text-foreground",
                example.label === "Wrong"
                  ? "text-destructive"
                  : "text-emerald-500"
              )}
            >
              {example.label === "Wrong" ? (
                <XCircleIcon
                  className="h-4 w-4"
                  aria-label={t("Wrong")}
                  weight="fill"
                />
              ) : (
                <CheckCircleIcon
                  className="h-4 w-4"
                  aria-label={t("Correct")}
                  weight="fill"
                />
              )}
              {t(example.label)}
            </div>

            <div
              className="w-full bg-muted p-3 shadow-(--custom-shadow) dark:bg-muted/60"
              style={{ borderRadius: example.outerRadius }}
            >
              <div
                className="grid h-28 place-items-center bg-card dark:bg-muted shadow-(--custom-shadow) sm:h-32"
                style={{ borderRadius: innerRadius }}
              >
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="tabular-nums text-xs text-foreground">
                    {example.outerRadius}px{" "}
                    <span className="mx-2 text-muted-foreground">/</span>{" "}
                    {innerRadius}px
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {t("outer")} <span className="mx-3.5"></span> {t("inner")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground/70">
        {t("With a 12px inset, the outer radius should be 28px so both curves follow each other.")}
      </p>
    </Demo>
  );
}

export function RadiusCalculatorDemo() {
  const t = useDemoText();
  const [outerRadius, setOuterRadius] = useState(32);
  const [inset, setInset] = useState(12);
  const innerRadius = Math.max(0, outerRadius - inset);

  function updateInnerRadius(value: number) {
    setOuterRadius(value + inset);
  }

  return (
    <Demo className="gap-12 px-4 sm:px-8">
      <div className="flex flex-col items-center gap-3" aria-hidden="true">
        <div
          className="relative bg-muted p-(--demo-inset) shadow-(--custom-shadow) transition-[border-radius,padding] duration-200 ease-out motion-reduce:transition-none dark:bg-muted/60"
          style={
            {
              "--demo-inset": `${inset}px`,
              borderRadius: outerRadius,
            } as React.CSSProperties
          }
        >
          {/* Inset: spans the padding gap at the top, label above the box. */}
          <DimensionLine
            axis="y"
            length="var(--demo-inset)"
            className="top-0 left-1/2 -translate-x-1/2"
          />
          <DimensionLabel
            name="inset"
            value={inset}
            className="bottom-full left-1/2 mb-1.5 -translate-x-1/2"
          />

          {/* Outer radius: the straight run the corner replaces, drawn on the
              bottom-right edge, label below the box. */}
          <DimensionLine
            axis="x"
            length={`${outerRadius}px`}
            className="right-0 bottom-0 translate-y-1/2"
          />
          <DimensionLabel
            name={t("outer")}
            value={outerRadius}
            className="top-full right-0 mt-1.5"
          />

          <div
            className="relative h-36 w-72 bg-card shadow-(--custom-shadow) transition-[border-radius] duration-200 ease-out motion-reduce:transition-none dark:bg-muted"
            style={{ borderRadius: innerRadius }}
          >
            {/* Inner radius: same idea on the card's bottom-left edge, label
                tucked inside the card above it. */}
            <DimensionLine
              axis="x"
              length={`${innerRadius}px`}
              className="bottom-0 left-0 translate-y-1/2"
            />
            <DimensionLabel
              name={t("inner")}
              value={innerRadius}
              className="bottom-2.5 left-3"
            />
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-xs gap-5 mb-4">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {t("Outer radius")}
            <span className="font-mono text-[10px] text-foreground">
              {outerRadius}px
            </span>
          </span>
          <Slider
            aria-label={t("Outer radius")}
            max={48}
            min={0}
            onValueChange={(value) => setOuterRadius(getSliderValue(value))}
            step={1}
            value={[outerRadius]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {t("Inset")}
            <span className="font-mono text-[10px] text-foreground">
              {inset}px
            </span>
          </span>
          <Slider
            aria-label={t("Inset")}
            max={28}
            min={4}
            onValueChange={(value) => setInset(getSliderValue(value))}
            step={1}
            value={[inset]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            {t("Inner radius")}
            <span className="font-mono text-[10px] text-foreground">
              {innerRadius}px
            </span>
          </span>
          <Slider
            aria-label={t("Inner radius")}
            max={Math.max(0, 48 - inset)}
            min={0}
            onValueChange={(value) => updateInnerRadius(getSliderValue(value))}
            step={1}
            value={[innerRadius]}
          />
        </label>
      </div>
    </Demo>
  );
}

export function NestedRadiusExamplesDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<RadiusMode>("same");
  const nested = mode === "nested";

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div
        aria-hidden="true"
        className="grid w-full max-w-lg gap-8 sm:grid-cols-[1.1fr_0.9fr]"
      >
        <div
          className="bg-card p-2 shadow-(--custom-shadow)"
          style={{ borderRadius: 16 }}
        >
          <div
            className="relative h-32 overflow-hidden bg-muted transition-[border-radius] duration-200 ease-out motion-reduce:transition-none [--edge:0_0_0/0.1] dark:[--edge:255_255_255/0.1]"
            style={{ borderRadius: nested ? 8 : 16 }}
          >
            <Image
              alt=""
              className="object-cover"
              fill
              placeholder="blur"
              src={waterLiliesImage}
            />
            {/* Same inset 1px edge as the image outline article. Drawn on a
                sibling so it follows the container's radius, not the image. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-[border-radius] duration-200 ease-out motion-reduce:transition-none"
              style={{
                borderRadius: "inherit",
                outline: "1px solid rgb(var(--edge))",
                outlineOffset: -1,
              }}
            />
          </div>
          <div className="flex items-center justify-between px-2 pb-1 pt-3">
            <div>
              <p className="text-xs text-foreground">{t("Water Lilies")}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Claude Monet
              </p>
            </div>
          </div>
        </div>

        <div
          className="self-center bg-card p-1 shadow-(--custom-shadow)"
          style={{ borderRadius: 12 }}
        >
          {MENU_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex h-8 items-center gap-2.5 px-2.5 text-xs transition-[border-radius] duration-200 ease-out motion-reduce:transition-none",
                index === 0 ? "bg-muted text-primary" : "text-muted-foreground"
              )}
              style={{ borderRadius: nested ? 8 : 12 }}
            >
              <item.icon aria-hidden="true" className="size-3.5 shrink-0" />
              {t(item.label)}
            </div>
          ))}
        </div>
      </div>

      <SegmentedControl
        ariaLabel={t("Component radius comparison")}
        onChange={setMode}
        options={RADIUS_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}
