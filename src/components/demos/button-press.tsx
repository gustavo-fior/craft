"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";
import { playSound } from "@/lib/sounds";

export function ButtonPressDemo() {
  const [amount, setAmount] = useState(3);
  const scale = 1 - amount / 100;

  return (
    <Demo>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => playSound("tick")}
          className="rounded-xl border bg-card px-5 py-2.5 text-sm font-medium transition-transform duration-100 ease-out active:scale-(--press)"
          style={{ "--press": String(scale) } as React.CSSProperties}
        >
          Press me
        </button>
        <button
          type="button"
          onClick={() => playSound("tick")}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-100 ease-out active:scale-(--press)"
          style={{ "--press": String(scale) } as React.CSSProperties}
        >
          Me too
        </button>
      </div>
      <div className="grid w-full max-w-80 grid-cols-[auto_1fr_auto] items-center gap-x-4">
        <span className="font-mono text-xs text-muted-foreground">scale</span>
        <Slider
          value={[amount]}
          onValueChange={(v: number | readonly number[]) =>
            setAmount(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={15}
          step={1}
        />
        <span className="font-mono text-xs text-muted-foreground">
          {scale.toFixed(2)}
        </span>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Around 0.97 the button feels tactile without looking springy. Past
        0.9 it starts feeling like a toy.
      </p>
    </Demo>
  );
}
