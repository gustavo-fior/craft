"use client";

import {
  CalendarBlankIcon,
  CaretRightIcon,
  ImageIcon,
  NotePencilIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem, WRONG_ICON } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function ButtonPressDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
            <Button className="transition-none active:scale-100">
              Save changes
            </Button>
          </div>
        </CompareItem>
        <CompareItem verdict="right">
          <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
            <Button className="transition-transform duration-100 ease-out hover:duration-100 active:scale-[0.97] motion-reduce:transition-none">
              Save changes
            </Button>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/**
 * Press-scale playground. `pressScale` forces the button's transform (the
 * video has no real pointer), otherwise the CSS `active:` state handles it.
 */
export function PressAmountView({
  amount,
  duration,
  pressScale,
  onAmountChange,
  onDurationChange,
}: {
  amount: number;
  duration: number;
  pressScale?: number;
  onAmountChange?: (amount: number) => void;
  onDurationChange?: (duration: number) => void;
}) {
  const scale = 1 - amount / 100;

  return (
    <Demo className="gap-10">
      <div className="grid h-28 w-full max-w-xs place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
        <Button
          className="transition-transform ease-out duration-(--press-ms) hover:duration-(--press-ms) active:scale-(--press) motion-reduce:transition-none"
          style={
            {
              "--press": String(scale),
              "--press-ms": `${duration}ms`,
              ...(pressScale !== undefined && {
                transform: `scale(${pressScale})`,
              }),
            } as React.CSSProperties
          }
        >
          Save changes
        </Button>
      </div>

      <div className="grid w-full max-w-xs gap-5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Scale
            <span className="tabular-nums text-foreground">
              {scale.toFixed(2)}
            </span>
          </span>
          <Slider
            aria-label="Press scale"
            max={12}
            min={0}
            onValueChange={(value) => onAmountChange?.(getSliderValue(value))}
            step={1}
            value={[amount]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Duration
            <span className="tabular-nums text-foreground">{duration}ms</span>
          </span>
          <Slider
            aria-label="Press duration"
            max={400}
            min={0}
            onValueChange={(value) =>
              onDurationChange?.(getSliderValue(value))
            }
            step={20}
            value={[duration]}
          />
        </label>
      </div>
    </Demo>
  );
}

export function PressAmountDemo() {
  const [amount, setAmount] = useState(3);
  const [duration, setDuration] = useState(100);

  return (
    <PressAmountView
      amount={amount}
      duration={duration}
      onAmountChange={setAmount}
      onDurationChange={setDuration}
    />
  );
}

type PressScale = "none" | "0.97" | "0.98";

const PRESS_OPTIONS = [
  { value: "none", label: "No feedback", icon: WRONG_ICON },
  { value: "0.97", label: "0.97" },
  { value: "0.98", label: "0.98" },
] as const;

const ROWS = [
  { label: "Notes", detail: "12 items", Icon: NotePencilIcon },
  { label: "Calendar", detail: "3 today", Icon: CalendarBlankIcon },
  { label: "Photos", detail: "148 items", Icon: ImageIcon },
] as const;

export function PressEverywhereDemo() {
  const [mode, setMode] = useState<PressScale>("none");

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
        {ROWS.map((row) => (
          <button
            key={row.label}
            type="button"
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 border-b border-[#E7E7E7] px-4 py-3 text-left outline-none select-none last:border-b-0 hover:bg-muted/60 focus-visible:ring-[1.5px] focus-visible:ring-ring/50 dark:border-[#1E1E1E]",
              mode !== "none" &&
                "transition-transform duration-100 ease-out motion-reduce:transition-none",
              mode === "0.97" && "active:scale-[0.97]",
              mode === "0.98" && "active:scale-[0.98]"
            )}
          >
            <row.Icon
              aria-hidden="true"
              className="size-5 shrink-0 text-foreground"
              weight="duotone"
            />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-foreground">
                {row.label}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {row.detail}
              </span>
            </span>
            <CaretRightIcon
              aria-hidden="true"
              className="ml-auto size-3.5 shrink-0 text-muted-foreground"
            />
          </button>
        ))}
      </div>

      <SegmentedControl
        ariaLabel="Press feedback"
        onChange={setMode}
        options={PRESS_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}

/**
 * Press down instantly, release on the eased curve. `active:duration-0` has to
 * beat the base button's `hover:duration-150`, which it does because Tailwind
 * emits the active variant after the hover one.
 */
export function PressReleaseDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem caption="Same both ways">
          <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
            <Button className="transition-transform duration-150 ease-out hover:duration-150 active:scale-[0.97] motion-reduce:transition-none">
              Save changes
            </Button>
          </div>
        </CompareItem>
        <CompareItem caption="Instant down, eased up">
          <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
            <Button className="transition-transform duration-150 ease-out hover:duration-150 active:scale-[0.97] active:duration-0 motion-reduce:transition-none">
              Save changes
            </Button>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}
