"use client";

import { useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const ROWS = [
  ["Design review", "Today"],
  ["Ship OG images", "Yesterday"],
  ["Fix Safari overscroll", "Monday"],
] as const;

export function PerceivedPerformanceDemo() {
  const [skeleton, setSkeleton] = useState(true);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = () => {
    if (timer.current) clearTimeout(timer.current);
    setState("loading");
    timer.current = setTimeout(() => setState("done"), 350);
  };

  return (
    <Demo>
      <div className="flex h-40 w-full max-w-80 flex-col gap-2">
        {state === "loading" && skeleton
          ? ROWS.map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-xl border bg-muted"
              />
            ))
          : state === "done"
            ? ROWS.map(([title, when], i) => (
                <div
                  key={title}
                  className="animate-in fade-in flex h-11 items-center justify-between rounded-xl border bg-card px-3 fill-mode-both"
                  style={{ animationDuration: "300ms", animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-sm">{title}</span>
                  <span className="text-xs text-muted-foreground">{when}</span>
                </div>
              ))
            : null}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={load}>
          Load (350ms)
        </Button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            skeleton
          </span>
          <Switch checked={skeleton} onCheckedChange={setSkeleton} />
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        For a 350ms load, the skeleton flashes for one blink and makes the
        wait <em>feel</em> longer. Showing nothing, then easing the real rows
        in, feels calmer and faster.
      </p>
    </Demo>
  );
}
