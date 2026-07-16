"use client";

import { PlayIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

export function OpticalAlignmentDemo() {
  const [optical, setOptical] = useState(false);
  const [guides, setGuides] = useState(false);

  return (
    <Demo>
      <div className="relative flex size-28 items-center justify-center rounded-full border bg-card">
        {guides && (
          <>
            <div className="absolute inset-x-0 top-1/2 h-px bg-rose-500/40" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-rose-500/40" />
          </>
        )}
        <PlayIcon
          weight="fill"
          className="size-10 text-foreground transition-transform"
          style={{ transform: optical ? "translateX(3px)" : "none" }}
        />
      </div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
        <span className="font-mono text-xs text-muted-foreground">
          optical shift
        </span>
        <Switch checked={optical} onCheckedChange={setOptical} />
        <span className="font-mono text-xs text-muted-foreground">guides</span>
        <Switch checked={guides} onCheckedChange={setGuides} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Geometrically the triangle is centered, but its visual mass sits left
        of its bounding box. Nudging it ~3px right makes it <em>look</em>{" "}
        centered.
      </p>
    </Demo>
  );
}
