"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MODES = ["normal", "balance", "pretty"] as const;
type Mode = (typeof MODES)[number];

export function TextWrappingDemo() {
  const [mode, setMode] = useState<Mode>("balance");
  const [width, setWidth] = useState(75);

  return (
    <Demo>
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList>
          {MODES.map((m) => (
            <TabsTrigger key={m} value={m} className="font-mono text-xs">
              {m}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div
        className="rounded-xl border border-dashed px-5 py-4 transition-[width]"
        style={{ width: `${width}%` }}
      >
        <p
          className="text-lg font-medium"
          style={{ textWrap: mode }}
        >
          Headlines wrap into awkward orphans without a little help
        </p>
        <p className="mt-2 text-xs text-muted-foreground" style={{ textWrap: mode }}>
          Balance equalizes line lengths, which suits headings. Pretty avoids
          a lonely last word, which suits paragraphs of body text like this
          one.
        </p>
      </div>
      <div className="flex w-full max-w-64 flex-col gap-2">
        <Slider
          value={[width]}
          onValueChange={(v: number | readonly number[]) =>
            setWidth(Array.isArray(v) ? v[0] : v)
          }
          min={40}
          max={100}
          step={1}
        />
        <p className="text-center font-mono text-xs text-muted-foreground">
          container width
        </p>
      </div>
    </Demo>
  );
}
