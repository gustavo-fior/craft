"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

const SHADOW =
  "0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.04)";

export function ShadowsNotBordersDemo() {
  const [shadows, setShadows] = useState(false);

  return (
    <Demo>
      <div
        className="flex h-32 w-56 items-center justify-center rounded-2xl bg-card transition-shadow duration-300"
        style={
          shadows
            ? { boxShadow: SHADOW }
            : { boxShadow: "0 0 0 1px var(--border)" }
        }
      >
        <span className="font-mono text-xs text-muted-foreground">
          {shadows ? "layered shadows" : "flat 1px border"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          shadows, not borders
        </span>
        <Switch checked={shadows} onCheckedChange={setShadows} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        A hairline ring plus a few soft, widening shadows reads as depth - the
        card floats instead of being outlined.
      </p>
    </Demo>
  );
}
