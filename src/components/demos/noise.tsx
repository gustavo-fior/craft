"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";

export function NoiseDemo() {
  const [opacity, setOpacity] = useState(8);

  return (
    <Demo>
      <div className="relative h-44 w-full max-w-96 overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-500/80 to-sky-500/80">
        <svg className="absolute size-0">
          <filter id="craft-noise">
            <feTurbulence baseFrequency="0.8" />
          </filter>
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            filter: "url(#craft-noise) grayscale(100%)",
            opacity: opacity / 100,
          }}
        />
        <div className="relative flex h-full items-end p-4">
          <span className="font-mono text-xs text-white/90">
            feTurbulence · opacity {opacity}%
          </span>
        </div>
      </div>
      <div className="grid w-full max-w-80 grid-cols-[auto_1fr] items-center gap-x-4">
        <span className="font-mono text-xs text-muted-foreground">grain</span>
        <Slider
          value={[opacity]}
          onValueChange={(v: number | readonly number[]) =>
            setOpacity(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={40}
          step={1}
        />
      </div>
    </Demo>
  );
}
