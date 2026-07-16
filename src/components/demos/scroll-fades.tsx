"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

const ITEMS = [
  "Getting started",
  "Installation",
  "Project structure",
  "Routing",
  "Data fetching",
  "Caching",
  "Rendering",
  "Styling",
  "Optimizing",
  "Configuring",
  "Testing",
  "Deploying",
  "Upgrading",
  "Troubleshooting",
];

export function ScrollFadesDemo() {
  const [masked, setMasked] = useState(true);

  return (
    <Demo>
      <div
        className="h-48 w-full max-w-64 overflow-y-auto rounded-xl border bg-card px-4 py-2"
        style={
          masked
            ? {
                maskImage:
                  "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              }
            : undefined
        }
      >
        <ul className="flex flex-col">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="border-b py-2 text-xs text-muted-foreground last:border-b-0"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          mask fade
        </span>
        <Switch checked={masked} onCheckedChange={setMasked} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Without the mask, rows guillotine against the container edge. With
        it, content dissolves - which both looks calmer and quietly says
        &ldquo;there&rsquo;s more below.&rdquo;
      </p>
    </Demo>
  );
}
