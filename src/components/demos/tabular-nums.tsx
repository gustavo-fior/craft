"use client";

import { useEffect, useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

export function TabularNumsDemo() {
  const [tabular, setTabular] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 50);
    return () => clearInterval(id);
  }, []);

  const seconds = (elapsed / 1000).toFixed(2);

  return (
    <Demo>
      <div
        className="text-4xl font-medium"
        style={{ fontVariantNumeric: tabular ? "tabular-nums" : "normal" }}
      >
        {seconds}s
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          tabular-nums
        </span>
        <Switch checked={tabular} onCheckedChange={setTabular} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Without it, every digit has its own width and the timer jitters as it
        counts. With it, digits share one width and the layout holds still.
      </p>
    </Demo>
  );
}
