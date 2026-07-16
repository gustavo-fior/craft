"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";

function Panel({ muted }: { muted?: boolean }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${
        muted
          ? "bg-muted"
          : "bg-gradient-to-br from-sky-400 via-violet-400 to-rose-400"
      }`}
    >
      <span
        className={`text-2xl font-medium ${
          muted ? "text-muted-foreground" : "text-white"
        }`}
      >
        Aa
      </span>
    </div>
  );
}

export function ClipPathDemo() {
  const [reveal, setReveal] = useState(50);

  return (
    <Demo>
      <div className="relative h-40 w-full max-w-96 overflow-hidden rounded-xl border">
        <Panel muted />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Panel />
        </div>
        <div
          className="absolute inset-y-0 w-px bg-foreground/40"
          style={{ left: `${reveal}%` }}
        />
      </div>
      <div className="flex w-full max-w-80 items-center gap-4">
        <span className="font-mono text-xs text-muted-foreground">reveal</span>
        <Slider
          value={[reveal]}
          onValueChange={(v: number | readonly number[]) =>
            setReveal(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={100}
          step={1}
        />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Two identical layers, the top one clipped with `inset()`. Nothing
        moves or resizes - the browser just draws less of it, which is why
        clip-path reveals stay pixel-perfect and cheap.
      </p>
    </Demo>
  );
}
