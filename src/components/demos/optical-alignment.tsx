"use client";

import {
  DownloadIcon,
  PlayIcon,
  StarIcon,
  type Icon,
  type IconWeight,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CenterMode = "geometric" | "optical";
type ButtonMode = "shared" | "tuned";
type SizeMode = "same" | "balanced";
type EdgeMode = "box" | "letters";

type IconAlignmentExample = {
  label: string;
  action: string;
  Icon: Icon;
  weight: IconWeight;
  largeTransform: string;
  buttonTransform: string;
  buttonCorrection: string;
  correction: string;
};

const CENTER_OPTIONS = [
  { value: "geometric", label: "Geometric" },
  { value: "optical", label: "Optical" },
] as const;

const BUTTON_OPTIONS = [
  { value: "shared", label: "Shared style" },
  { value: "tuned", label: "Per icon" },
] as const;

const SIZE_OPTIONS = [
  { value: "same", label: "Same size" },
  { value: "balanced", label: "Balanced" },
] as const;

const EDGE_OPTIONS = [
  { value: "box", label: "Box edge" },
  { value: "letters", label: "Letter edge" },
] as const;

const ICON_ALIGNMENT_EXAMPLES: IconAlignmentExample[] = [
  {
    label: "Play",
    action: "Play",
    Icon: PlayIcon,
    weight: "fill",
    largeTransform: "translateX(3px)",
    buttonTransform: "translateX(1px)",
    buttonCorrection: "1px right",
    correction: "3px right",
  },
  {
    label: "Star",
    action: "Favorite",
    Icon: StarIcon,
    weight: "fill",
    largeTransform: "translateY(-2px)",
    buttonTransform: "translateY(-0.5px)",
    buttonCorrection: "0.5px up",
    correction: "2px up",
  },
  {
    label: "Download",
    action: "Save",
    Icon: DownloadIcon,
    weight: "bold",
    largeTransform: "translateY(-1px)",
    buttonTransform: "translateY(-0.5px)",
    buttonCorrection: "0.5px up",
    correction: "1px up",
  },
];

export function OpticalAlignmentDemo() {
  const [mode, setMode] = useState<CenterMode>("geometric");
  const optical = mode === "optical";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="grid grid-cols-3 gap-3" aria-hidden="true">
        {ICON_ALIGNMENT_EXAMPLES.map((example) => {
          const ExampleIcon = example.Icon;

          return (
            <div
              key={example.label}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative grid aspect-square w-full place-items-center rounded-2xl bg-card shadow-(--custom-shadow)">
                <span className="absolute inset-x-4 top-1/2 h-px bg-rose-500/35" />
                <span className="absolute inset-y-4 left-1/2 w-px bg-rose-500/35" />
                <ExampleIcon
                  className="relative size-10 text-foreground transition-transform duration-200 ease-out motion-reduce:transition-none"
                  style={{
                    transform: optical ? example.largeTransform : "none",
                  }}
                  weight={example.weight}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {example.label}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                {optical ? example.correction : "0px"}
              </span>
            </div>
          );
        })}
      </div>

      <SegmentedControl
        ariaLabel="Icon alignment"
        onChange={setMode}
        options={CENTER_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {optical
          ? "Each icon moves in a different direction by a different amount."
          : "Every SVG box is centered at 0px, but the shapes still feel uneven."}
      </p>
    </Demo>
  );
}

export function OpticalButtonDemo() {
  const [mode, setMode] = useState<ButtonMode>("shared");
  const tuned = mode === "tuned";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div
        aria-hidden="true"
        className="grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3"
      >
        {ICON_ALIGNMENT_EXAMPLES.map((example) => {
          const ExampleIcon = example.Icon;

          return (
            <div
              key={example.label}
              className="flex min-w-0 flex-col items-center gap-2"
            >
              <Button
                className="pointer-events-none max-w-full"
                tabIndex={-1}
                variant="outline"
              >
                <ExampleIcon
                  className="transition-transform duration-200 ease-out motion-reduce:transition-none"
                  style={{
                    transform: tuned ? example.buttonTransform : "none",
                  }}
                  weight={example.weight}
                />
                {example.action}
              </Button>
              <span className="font-mono text-[9px] text-muted-foreground">
                {tuned ? example.buttonCorrection : "same CSS"}
              </span>
            </div>
          );
        })}
      </div>

      <SegmentedControl
        ariaLabel="Button icon alignment"
        onChange={setMode}
        options={BUTTON_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {tuned
          ? "The Button stays the same. Only the icon gets the correction it needs at this size."
          : "The Button gives every icon the same size, gap, and padding, but it only centers their SVG boxes."}
      </p>
    </Demo>
  );
}

export function OpticalSizingDemo() {
  const [mode, setMode] = useState<SizeMode>("same");
  const balanced = mode === "balanced";

  const shapes = [
    {
      label: "Square",
      size: balanced ? 24 : 28,
      className: "rounded-[4px]",
    },
    {
      label: "Circle",
      size: balanced ? 27 : 28,
      className: "rounded-full",
    },
    {
      label: "Triangle",
      size: balanced ? 32 : 28,
      className: "[clip-path:polygon(50%_0,100%_100%,0_100%)]",
    },
  ];

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div
        className="grid w-full max-w-sm grid-cols-3 gap-3"
        aria-hidden="true"
      >
        {shapes.map((shape) => (
          <div key={shape.label} className="flex flex-col items-center gap-2">
            <div className="grid h-24 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
              <span
                className={cn(
                  "block bg-foreground transition-[width,height,transform] duration-200 ease-out motion-reduce:transition-none",
                  shape.className
                )}
                style={{
                  width: shape.size,
                  height: shape.size,
                  transform:
                    balanced && shape.label === "Triangle"
                      ? "translateY(-1px)"
                      : "none",
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {shape.label}
            </span>
          </div>
        ))}
      </div>

      <SegmentedControl
        ariaLabel="Shape sizing"
        onChange={setMode}
        options={SIZE_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {balanced
          ? "The square gets smaller and the triangle gets larger, so their weight feels even."
          : "All three boxes are 28px, but the filled shapes do not look equally large."}
      </p>
    </Demo>
  );
}

export function HangingPunctuationDemo() {
  const [mode, setMode] = useState<EdgeMode>("box");
  const alignedToLetters = mode === "letters";

  return (
    <Demo className="gap-7">
      <div
        aria-hidden="true"
        className="relative w-full max-w-xs rounded-xl bg-card px-8 py-9 shadow-(--custom-shadow)"
      >
        <span className="absolute inset-y-6 left-8 w-px bg-rose-500/55" />
        <p
          className="relative text-2xl leading-[1.25] tracking-tight text-foreground transition-[text-indent] duration-200 ease-out motion-reduce:transition-none"
          style={{ textIndent: alignedToLetters ? "-0.42em" : "0" }}
        >
          “Good alignment
          <br />
          should disappear.”
        </p>
        <span className="absolute bottom-2 left-8 font-mono text-[9px] text-rose-500">
          visible edge
        </span>
      </div>

      <SegmentedControl
        ariaLabel="Quote alignment"
        onChange={setMode}
        options={EDGE_OPTIONS}
        value={mode}
      />

      <p className="max-w-sm text-center text-xs text-pretty text-muted-foreground">
        {alignedToLetters
          ? "The quote hangs in the margin, so both lines begin at the same visible edge."
          : "The quote begins on the guide, which pushes the first word inward."}
      </p>
    </Demo>
  );
}
