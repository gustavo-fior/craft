"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const ROWS = ["Overview", "Analytics", "Reports", "Members", "Settings"];

export function StaggerDemo() {
  const [step, setStep] = useState(80);
  const [run, setRun] = useState(0);

  return (
    <Demo>
      <div className="flex w-full max-w-72 flex-col gap-1.5" key={run}>
        {ROWS.map((row, i) => (
          <div
            key={row}
            className="animate-in fade-in slide-in-from-bottom-2 rounded-lg border bg-card px-3 py-2 text-sm text-muted-foreground fill-mode-both"
            style={{ animationDelay: `${i * step}ms`, animationDuration: "400ms" }}
          >
            {row}
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-80 items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
          Replay
        </Button>
        <Slider
          value={[step]}
          onValueChange={(v: number | readonly number[]) =>
            setStep(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={300}
          step={10}
        />
        <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
          {step}ms
        </span>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Around 80–100ms the list feels orchestrated. At 0 it&apos;s a
        simultaneous blob; past 200ms it feels like waiting.
      </p>
    </Demo>
  );
}
