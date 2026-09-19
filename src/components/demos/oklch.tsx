"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";

const HUES = Array.from({ length: 12 }, (_, index) => index * 30);

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

function SwatchRow({
  label,
  color,
}: {
  label: string;
  color: (hue: number) => string;
}) {
  return (
    <div className="grid w-full gap-1.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div
        aria-hidden="true"
        className="flex h-10 w-full overflow-hidden rounded-lg"
      >
        {HUES.map((hue) => (
          <span key={hue} className="flex-1" style={{ background: color(hue) }} />
        ))}
      </div>
    </div>
  );
}

export function OklchDemo() {
  const t = useDemoText();
  const [lightness, setLightness] = useState(65);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="grid w-full max-w-sm gap-4">
        <SwatchRow
          label="HSL"
          color={(hue) => `hsl(${hue} 85% ${lightness}%)`}
        />
        <SwatchRow
          label="OKLCH"
          color={(hue) => `oklch(${lightness / 100} 0.13 ${hue})`}
        />
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Lightness")}
          <span className="tabular-nums text-foreground">{lightness}%</span>
        </span>
        <Slider
          aria-label={t("Lightness")}
          max={85}
          min={40}
          onValueChange={(value) => setLightness(getSliderValue(value))}
          step={1}
          value={[lightness]}
        />
      </label>
    </Demo>
  );
}

type PairId = "blue-yellow" | "red-teal" | "purple-green";

const PAIRS = [
  {
    value: "blue-yellow",
    label: "Blue to yellow",
    from: "oklch(0.55 0.22 262)",
    to: "oklch(0.92 0.19 100)",
  },
  {
    value: "red-teal",
    label: "Red to teal",
    from: "oklch(0.62 0.24 25)",
    to: "oklch(0.8 0.14 190)",
  },
  {
    value: "purple-green",
    label: "Purple to green",
    from: "oklch(0.5 0.24 300)",
    to: "oklch(0.85 0.2 145)",
  },
] as const;

function GradientRow({ label, style }: { label: string; style: string }) {
  return (
    <div className="grid w-full gap-1.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div
        aria-hidden="true"
        className="h-10 w-full rounded-lg"
        style={{ background: style }}
      />
    </div>
  );
}

export function OklchGradientDemo() {
  const t = useDemoText();
  const [pair, setPair] = useState<PairId>("blue-yellow");
  const current = PAIRS.find((option) => option.value === pair) ?? PAIRS[0];

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="grid w-full max-w-sm gap-4">
        <GradientRow
          label="sRGB"
          style={`linear-gradient(to right in srgb, ${current.from}, ${current.to})`}
        />
        <GradientRow
          label="OKLCH"
          style={`linear-gradient(to right in oklch, ${current.from}, ${current.to})`}
        />
      </div>

      <SegmentedControl
        ariaLabel={t("Gradient colors")}
        onChange={setPair}
        options={PAIRS.map((option) => ({ ...option, label: t(option.label) }))}
        value={pair}
      />
    </Demo>
  );
}

/** Lightness and chroma per step. Chroma tapers at both ends to stay in gamut. */
const RAMP = [
  { l: 0.97, c: 0.02 },
  { l: 0.93, c: 0.05 },
  { l: 0.87, c: 0.09 },
  { l: 0.78, c: 0.13 },
  { l: 0.68, c: 0.16 },
  { l: 0.58, c: 0.17 },
  { l: 0.48, c: 0.15 },
  { l: 0.38, c: 0.12 },
  { l: 0.28, c: 0.08 },
] as const;

export function OklchPaletteDemo() {
  const t = useDemoText();
  const [hue, setHue] = useState(250);
  const step = (index: number) =>
    `oklch(${RAMP[index].l} ${RAMP[index].c} ${hue})`;

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        <div aria-hidden="true" className="grid w-full grid-cols-9 gap-1">
          {RAMP.map((_, index) => (
            <div key={index} className="grid justify-items-center gap-1.5">
              <span
                className="aspect-square w-full rounded-md"
                style={{ background: step(index) }}
              />
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {(index + 1) * 100}
              </span>
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="flex items-center gap-2.5 rounded-xl bg-card px-4 py-3 shadow-(--custom-shadow)"
        >
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium dark:hidden"
            style={{ background: step(1), color: step(6) }}
          >
            {t("Shipped")}
          </span>
          <span
            className="hidden rounded-full px-2.5 py-1 text-xs font-medium dark:inline"
            style={{ background: step(7), color: step(2) }}
          >
            {t("Shipped")}
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
            style={{ background: step(5) }}
          >
            {t("Continue")}
          </span>
        </div>
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Hue")}
          <span className="tabular-nums text-foreground">{hue}°</span>
        </span>
        <Slider
          aria-label={t("Hue")}
          max={360}
          min={0}
          onValueChange={(value) => setHue(getSliderValue(value))}
          step={1}
          value={[hue]}
        />
      </label>
    </Demo>
  );
}
