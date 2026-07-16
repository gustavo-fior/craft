"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

export function FontSmoothingDemo() {
  const [antialiased, setAntialiased] = useState(true);

  return (
    <Demo>
      <div
        className="flex w-full max-w-96 flex-col items-center gap-1 rounded-xl bg-neutral-900 px-6 py-8 dark:border dark:bg-neutral-950"
        style={{
          WebkitFontSmoothing: antialiased ? "antialiased" : "auto",
          MozOsxFontSmoothing: antialiased ? "grayscale" : "auto",
        }}
      >
        <span className="text-xl font-semibold text-white">
          Light text on dark
        </span>
        <span className="text-sm text-neutral-400">
          Subpixel rendering makes this look artificially bold.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          antialiased
        </span>
        <Switch checked={antialiased} onCheckedChange={setAntialiased} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Most visible on macOS: with default subpixel smoothing, light-on-dark
        type blooms a half-weight heavier than the designer chose.
        `antialiased` renders it at its true weight.
      </p>
    </Demo>
  );
}
