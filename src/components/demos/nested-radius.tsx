"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function NestedRadiusDemo() {
  const [padding, setPadding] = useState(16);
  const [innerRadius, setInnerRadius] = useState(12);
  const [naive, setNaive] = useState(false);

  const outerRadius = naive ? innerRadius : innerRadius + padding;

  return (
    <Demo>
      <div
        className="border bg-muted transition-all"
        style={{ padding, borderRadius: outerRadius }}
      >
        <div
          className="flex h-28 w-52 items-center justify-center border bg-card transition-all"
          style={{ borderRadius: innerRadius }}
        >
          <span className="font-mono text-xs text-muted-foreground">
            {naive
              ? `outer = inner (${outerRadius}px)`
              : `outer = ${innerRadius} + ${padding} = ${outerRadius}px`}
          </span>
        </div>
      </div>
      <div className="grid w-full max-w-80 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
        <span className="font-mono text-xs text-muted-foreground">padding</span>
        <Slider
          value={[padding]}
          onValueChange={(v: number | readonly number[]) =>
            setPadding(Array.isArray(v) ? v[0] : v)
          }
          min={4}
          max={40}
          step={1}
        />
        <span className="font-mono text-xs text-muted-foreground">radius</span>
        <Slider
          value={[innerRadius]}
          onValueChange={(v: number | readonly number[]) =>
            setInnerRadius(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={28}
          step={1}
        />
        <span className="font-mono text-xs text-muted-foreground">
          naive mode
        </span>
        <Switch checked={naive} onCheckedChange={setNaive} />
      </div>
    </Demo>
  );
}
