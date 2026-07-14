"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";

export function LetterSpacingDemo() {
  const [tracking, setTracking] = useState(0);

  return (
    <Demo>
      <div className="flex w-full flex-col items-center gap-2 overflow-hidden">
        <p
          className="text-4xl font-semibold whitespace-nowrap"
          style={{ letterSpacing: `${tracking / 100}em` }}
        >
          Headline
        </p>
        <p
          className="text-sm text-muted-foreground whitespace-nowrap"
          style={{ letterSpacing: `${tracking / 100}em` }}
        >
          Body text stays readable at small sizes.
        </p>
      </div>
      <div className="flex w-full max-w-64 flex-col gap-2">
        <Slider
          value={[tracking]}
          onValueChange={(v: number | readonly number[]) =>
            setTracking(Array.isArray(v) ? v[0] : v)
          }
          min={-8}
          max={16}
          step={0.5}
        />
        <p className="text-center font-mono text-xs text-muted-foreground">
          letter-spacing: {(tracking / 100).toFixed(3)}em
        </p>
      </div>
    </Demo>
  );
}
