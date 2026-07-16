"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const ITEMS = ["Rename", "Duplicate", "Move to...", "Delete"];

export function ScaleEntrancesDemo() {
  const [run, setRun] = useState(0);
  const [fromZero, setFromZero] = useState(false);

  return (
    <Demo>
      <div className="flex h-44 w-full max-w-96 flex-col items-center pt-2">
        <span className="rounded-lg border bg-card px-4 py-1.5 text-xs font-medium shadow-xs">
          Actions
        </span>
        <div
          key={run}
          className={`animate-in fade-in mt-2 w-36 rounded-xl border bg-card p-1 shadow-md duration-200 ease-out fill-mode-both ${
            fromZero ? "zoom-in-0" : "zoom-in-95"
          }`}
          style={{ transformOrigin: "top center" }}
        >
          {ITEMS.map((item) => (
            <div
              key={item}
              className={`rounded-lg px-2.5 py-1.5 text-xs ${
                item === "Delete" ? "text-red-600 dark:text-red-400" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRun((r) => r + 1)}
        >
          Replay
        </Button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            from scale(0)
          </span>
          <Switch checked={fromZero} onCheckedChange={setFromZero} />
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        From 0 the menu balloons out of nothing, cartoon-like. From 0.95,
        anchored to its trigger with `transform-origin`, it simply arrives -
        the same 200ms reads twice as refined.
      </p>
    </Demo>
  );
}
