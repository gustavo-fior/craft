"use client";

import {
  ArrowRightIcon,
  DownloadSimpleIcon,
  PlayIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { GuidesToggle } from "@/components/app/guides-toggle";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Alignment = "geometric" | "optical";

const ALIGNMENT_OPTIONS = [
  { value: "geometric", label: "Centered" },
  { value: "optical", label: "Optically centered" },
] as const;

// Nudges are a fraction of the icon's own size so they hold up at any
// scale: 2px right and 1px up on a 24px icon, 4px and 2px on a 48px one.
const ICONS = [
  {
    label: "Play",
    Icon: PlayIcon,
    weight: "fill",
    color: "dark:text-green-500 text-green-400",
    shift: "translateX(-6%)",
  },
  {
    label: "Favorite",
    Icon: StarIcon,
    weight: "fill",
    color: "dark:text-yellow-500 text-amber-400",
    shift: "translateY(-2.2%)",
  },
  {
    label: "Download",
    Icon: DownloadSimpleIcon,
    weight: "bold",
    color: "dark:text-sky-500 text-sky-400",
    shift: "translateY(-2%)",
  },
] as const;

// Shared timing for every guide reveal in this file. Clip-path rather than
// scale so dashed lines keep their dash spacing while they draw.
const GUIDE_DRAW =
  "transition-[clip-path,opacity] duration-500 ease-out motion-reduce:transition-none";

// Dashed crosshair through the geometric center. Each line is clipped down
// to nothing at the middle and the clip opens outward, so the crosshair
// draws itself from the center when the guides come on.
function CenterGuides({ visible }: { visible: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span
        className={cn(
          "absolute inset-x-0 top-1/2 border-t border-dashed border-sky-300 dark:border-sky-900",
          GUIDE_DRAW
        )}
        style={{ clipPath: visible ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)" }}
      />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 border-l border-dashed border-sky-300 dark:border-sky-900",
          GUIDE_DRAW
        )}
        style={{ clipPath: visible ? "inset(0 0 0 0)" : "inset(50% 0 50% 0)" }}
      />
    </span>
  );
}

export function OpticalAlignmentDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Alignment>("geometric");
  const [guides, setGuides] = useState(true);

  return (
    <Demo className="gap-8">
      <GuidesToggle pressed={guides} onPressedChange={setGuides} />
      <div className="flex items-center gap-5 sm:gap-8">
        {ICONS.map(({ label, Icon, weight, shift, color }) => (
          <span
            key={label}
            aria-label={t(label)}
            className="flex relative justify-center items-center size-20 rounded-3xl bg-card text-foreground shadow-(--custom-shadow)"
            role="img"
          >
            <CenterGuides visible={guides} />
            <Icon
              aria-hidden="true"
              className={cn(
                "relative size-12 transition-transform duration-200 ease-out motion-reduce:transition-none",
                color
              )}
              style={{ transform: mode === "optical" ? shift : "none" }}
              weight={weight}
            />
          </span>
        ))}
      </div>
      <SegmentedControl
        ariaLabel={t("Icon alignment")}
        onChange={setMode}
        options={ALIGNMENT_OPTIONS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}

// The site's real Button, with the padding forced so the two sides can be
// compared. The guides are clipped by the button's own shape, so they always
// follow its radius and sit exactly over the padding they measure.
function PaddedButton({
  paddingLeft,
  paddingRight,
  guides,
}: {
  paddingLeft: number;
  paddingRight: number;
  guides: boolean;
}) {
  const t = useDemoText();
  const guide = cn(
    "pointer-events-none absolute inset-y-0 -z-10 bg-sky-900 dark:bg-sky-300",
    GUIDE_DRAW
  );

  return (
    <Button
      className="relative isolate overflow-hidden"
      style={{ paddingLeft, paddingRight }}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(guide, "left-0")}
        style={{
          width: paddingLeft,
          clipPath: guides ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        }}
      />
      <span
        aria-hidden="true"
        className={cn(guide, "right-0")}
        style={{
          width: paddingRight,
          clipPath: guides ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
        }}
      />
      {t("Next")}
      <ArrowRightIcon aria-hidden="true" weight="bold" />
    </Button>
  );
}

export function OpticalButtonDemo() {
  const [guides, setGuides] = useState(true);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <GuidesToggle pressed={guides} onPressedChange={setGuides} />
      <Compare className="sm:gap-0">
        <CompareItem verdict="wrong">
          <PaddedButton guides={guides} paddingLeft={12} paddingRight={12} />
        </CompareItem>
        <CompareItem verdict="right">
          <PaddedButton guides={guides} paddingLeft={12} paddingRight={10} />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

type Sizing = "equal" | "balanced";

const SIZING_OPTIONS = [
  { value: "equal", label: "Same box" },
  { value: "balanced", label: "Balanced" },
] as const;

const SHAPES = [
  { name: "square", equal: 26, balanced: 24 },
  { name: "circle", equal: 26, balanced: 27 },
  { name: "triangle", equal: 26, balanced: 25 },
] as const;

export function OpticalWeightDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Sizing>("equal");

  return (
    <Demo className="gap-8">
      <div className="flex items-center gap-5 sm:gap-8">
        {SHAPES.map((shape) => {
          const size = shape[mode];

          return (
            <span
              key={shape.name}
              className="grid size-14 place-items-center rounded-xl bg-card shadow-(--custom-shadow)"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block bg-foreground transition-[width,height] duration-200 ease-out motion-reduce:transition-none",
                  shape.name === "square" && "rounded-[3px]",
                  shape.name === "circle" && "rounded-full"
                )}
                style={{
                  width: size,
                  height: size,
                  clipPath:
                    shape.name === "triangle"
                      ? "polygon(50% 0, 100% 100%, 0 100%)"
                      : undefined,
                }}
              />
            </span>
          );
        })}
      </div>
      <SegmentedControl
        ariaLabel={t("Shape sizing")}
        onChange={setMode}
        options={SIZING_OPTIONS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}

type OpticalSize = "text" | "display";

const OPSZ_OPTIONS = [
  { value: "text", label: "Text design" },
  { value: "display", label: "Display design" },
] as const;

export function OpticalSizingDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<OpticalSize>("text");

  return (
    <Demo className="gap-8">
      <div className="grid w-full max-w-sm gap-3 rounded-xl bg-card px-6 py-6 shadow-(--custom-shadow)">
        <span
          className="text-[40px] leading-none font-medium tracking-tight text-foreground"
          style={{
            fontOpticalSizing: "none",
            fontVariationSettings: mode === "text" ? '"opsz" 14' : '"opsz" 32',
          }}
        >
          {t("Quarterly")}
        </span>
        <span
          className="text-[40px] leading-none font-medium tracking-tight text-foreground"
          style={{
            fontOpticalSizing: "none",
            fontVariationSettings: mode === "text" ? '"opsz" 14' : '"opsz" 32',
          }}
        >
          {t("revenue")}
        </span>
      </div>
      <SegmentedControl
        ariaLabel={t("Optical size")}
        onChange={setMode}
        options={OPSZ_OPTIONS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}

type Hanging = "box" | "glyph";

const HANGING_OPTIONS = [
  { value: "box", label: "Box edge" },
  { value: "glyph", label: "Letter edge" },
] as const;

export function HangingPunctuationDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Hanging>("box");
  const [guides, setGuides] = useState(true);

  return (
    <Demo className="gap-8">
      <GuidesToggle pressed={guides} onPressedChange={setGuides} />
      <div className="relative w-full max-w-sm rounded-xl bg-card px-8 py-6 shadow-(--custom-shadow)">
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-5 left-8 border-l border-dashed border-sky-300 dark:border-sky-900",
            GUIDE_DRAW
          )}
          style={{ clipPath: guides ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        />
        <p
          className="text-lg leading-snug font-medium text-foreground transition-[text-indent] duration-200 ease-out motion-reduce:transition-none"
          style={{ textIndent: mode === "glyph" ? "-0.42em" : "0" }}
        >
          {t("“Good design is as little design as possible.”")}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Dieter Rams</p>
      </div>
      <SegmentedControl
        ariaLabel={t("Quote alignment")}
        onChange={setMode}
        options={HANGING_OPTIONS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}
