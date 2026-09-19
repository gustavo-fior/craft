"use client";

import { LightningIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";

import violet from "@/assets/gradient-violet.jpg";
import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type SurfaceMode = "flat" | "grain";

const SURFACE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "grain", label: "Grain" },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

/** The SVG filter that generates the grain. Defined once per demo. */
function GrainFilter({
  id,
  baseFrequency,
}: {
  id: string;
  baseFrequency: number;
}) {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <filter id={id}>
        <feTurbulence
          baseFrequency={baseFrequency}
          numOctaves={3}
          stitchTiles="stitch"
          type="fractalNoise"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
  );
}

/**
 * An empty overlay painted entirely by the filter. Sits on top of whatever
 * surface it covers and blends into it.
 */
function Grain({
  id,
  opacity,
  className,
}: {
  id: string;
  opacity: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200 ease-out motion-reduce:transition-none",
        className
      )}
      style={{ filter: `url(#${id})`, opacity }}
    />
  );
}

export function NoiseDemo() {
  const t = useDemoText();
  const [percent, setPercent] = useState(8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="grain-cover" baseFrequency={1} />

      <div
        className="relative isolate h-44 w-full max-w-sm overflow-hidden rounded-3xl bg-linear-to-br from-sky-600 to-cyan-700 dark:from-olive-600 dark:to-lime-950 [--edge:0_0_0/0.1]"
        // Same inset 1px edge as the image outline article, so the card
        // reads as a surface on both themes rather than a floating gradient.
        style={{
          outline: "1px solid rgb(var(--edge))",
          outlineOffset: -1,
        }}
      >
        <Grain id="grain-cover" opacity={percent / 100} />
        <div className="flex h-full flex-col justify-end p-5">
          <span className="text-sm font-medium text-white">{t("Weekly digest")}</span>
          <span className="mt-0.5 text-xs text-white/60">
            {t("Your projects, summarized every Friday.")}
          </span>
        </div>
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Grain opacity")}
          <span className="tabular-nums text-foreground">{percent}%</span>
        </span>
        <Slider
          aria-label={t("Grain opacity")}
          max={100}
          min={0}
          onValueChange={(value) => setPercent(getSliderValue(value))}
          step={1}
          value={[percent]}
        />
      </label>
    </Demo>
  );
}

// Crosses only ~18 shades across the whole box, so each ring is several
// pixels wide and the steps are plainly visible without grain.
const SPOTLIGHT =
  "radial-gradient(circle at 50% 35%, #1c1c1c 0%, #0a0a0a 80%)";

export function NoiseBandingDemo() {
  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <GrainFilter id="grain-banding" baseFrequency={0.8} />

      <Compare>
        <CompareItem verdict="wrong">
          <div
            aria-hidden="true"
            className="aspect-4/3 w-full overflow-hidden rounded-xl"
            style={{ background: SPOTLIGHT }}
          />
        </CompareItem>
        <CompareItem verdict="right">
          <div
            aria-hidden="true"
            className="relative isolate aspect-4/3 w-full overflow-hidden rounded-xl"
            style={{ background: SPOTLIGHT }}
          >
            {/* Overlay does nothing on near-black, so this one uses
                soft-light. Just enough to dither the ring edges. */}
            <Grain
              id="grain-banding"
              className="mix-blend-soft-light"
              opacity={0.5}
            />
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

export function NoiseFrequencyDemo() {
  const t = useDemoText();
  const [frequency, setFrequency] = useState(0.8);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <GrainFilter id="grain-frequency" baseFrequency={frequency} />

      <div className="relative isolate h-40 w-full max-w-sm overflow-hidden rounded-2xl shadow-(--custom-shadow)">
        {/* A soft photographic gradient instead of a CSS one: its smooth
            ramps make the change in grain size easy to read. */}
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover"
          fill
          placeholder="blur"
          sizes="384px"
          src={violet}
        />
        <Grain id="grain-frequency" opacity={0.6} />
        {/* Same inset 1px edge as the first demo, on its own layer so the
            positioned image cannot paint over it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] outline-1 -outline-offset-1 outline-black/10"
        />
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Base frequency")}
          <span className="tabular-nums text-foreground">
            {frequency.toFixed(2)}
          </span>
        </span>
        <Slider
          aria-label={t("Base frequency")}
          max={1.5}
          min={0.1}
          onValueChange={(value) => setFrequency(getSliderValue(value))}
          step={0.05}
          value={[frequency]}
        />
      </label>
    </Demo>
  );
}

export function NoiseSurfaceDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<SurfaceMode>("flat");
  const grain = mode === "grain";

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <GrainFilter id="grain-surface" baseFrequency={1} />

      <div
        aria-hidden="true"
        className="relative isolate w-full max-w-xs overflow-hidden rounded-2xl bg-[#171717] p-5 text-white shadow-(--custom-shadow)"
      >
        <Grain id="grain-surface" opacity={grain ? 0.9 : 0} />
        {/* The grain is only for the surface; the content sits above it. */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pro</span>
            <span className="flex items-center gap-1 rounded-full px-2 bg-muted-foreground/50 py-1 font-medium text-xs text-white">
              <LightningIcon className="size-2.5" weight="fill" />
              {t("Popular")}
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-medium tracking-tight tabular-nums">
              $20
            </span>
            <span className="text-xs text-muted-foreground">{t("per month")}</span>
          </div>
          <ul className="mt-4 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <li>{t("Unlimited projects")}</li>
            <li>{t("Shared workspaces")}</li>
            <li>{t("Priority support")}</li>
          </ul>
          <span className="mt-8 flex h-8 items-center justify-center rounded-full bg-white text-xs font-medium text-neutral-900">
            {t("Upgrade")}
          </span>
        </div>
      </div>

      <SegmentedControl
        ariaLabel={t("Card surface")}
        onChange={setMode}
        options={SURFACE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}
