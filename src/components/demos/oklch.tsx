"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";

const STEPS = 10;

export function OklchDemo() {
  const [lightness, setLightness] = useState(70);

  return (
    <Demo>
      <div className="flex w-full flex-col gap-4">
        <Row
          label="hsl"
          swatch={(i) =>
            `hsl(${(i / STEPS) * 360} 100% ${lightness}%)`
          }
        />
        <Row
          label="oklch"
          swatch={(i) =>
            `oklch(${lightness}% 0.17 ${(i / STEPS) * 360})`
          }
        />
      </div>
      <div className="flex w-full max-w-64 flex-col gap-2">
        <Slider
          value={[lightness]}
          onValueChange={(v: number | readonly number[]) =>
            setLightness(Array.isArray(v) ? v[0] : v)
          }
          min={30}
          max={95}
          step={1}
        />
        <p className="text-center font-mono text-xs text-muted-foreground">
          lightness: {lightness}%
        </p>
      </div>
    </Demo>
  );
}

function Row({
  label,
  swatch,
}: {
  label: string;
  swatch: (i: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-right font-mono text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 overflow-hidden rounded-lg">
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className="h-10 flex-1"
            style={{ background: swatch(i) }}
          />
        ))}
      </div>
    </div>
  );
}
