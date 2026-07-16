"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";

const EASINGS = [
  { name: "linear", value: "linear" },
  { name: "ease-in", value: "cubic-bezier(0.4, 0, 1, 1)" },
  { name: "ease-out", value: "cubic-bezier(0, 0, 0.2, 1)" },
  { name: "ease-in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
];

export function EasingsDemo() {
  const [moved, setMoved] = useState(false);

  return (
    <Demo>
      <div className="flex w-full max-w-96 flex-col gap-3">
        {EASINGS.map(({ name, value }) => (
          <div key={name} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
              {name}
            </span>
            <div className="relative h-6 flex-1 rounded-full border bg-card [container-type:inline-size]">
              <div
                className="absolute top-1/2 left-1 size-4 rounded-full bg-foreground transition-transform duration-700"
                style={{
                  transitionTimingFunction: value,
                  transform: `translateY(-50%) translateX(${
                    moved ? "calc(100cqw - 100% - 8px)" : "0px"
                  })`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => setMoved((m) => !m)}>
        Run
      </Button>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Ease-out starts fast and settles — that&apos;s why it feels responsive
        for things entering the screen. Linear feels robotic everywhere.
      </p>
    </Demo>
  );
}
