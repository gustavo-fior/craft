"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

export function ImageOutlineDemo() {
  const [outline, setOutline] = useState(true);

  return (
    <Demo>
      <div className="flex items-center gap-6">
        {/* Stand-in for a photo: bright sky against a light page background. */}
        <div
          className="size-36 rounded-2xl bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 dark:from-slate-800 dark:via-slate-900 dark:to-black"
          style={
            outline
              ? {
                  outline: "1px solid rgba(0,0,0,0.1)",
                  outlineOffset: "-1px",
                }
              : undefined
          }
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          1px outline at 10%
        </span>
        <Switch checked={outline} onCheckedChange={setOutline} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Light image edges melt into light backgrounds. An inset 1px outline at
        10% opacity gives every image a consistent, crisp edge - barely
        visible, always working.
      </p>
    </Demo>
  );
}
