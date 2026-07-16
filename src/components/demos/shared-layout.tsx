"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";
import { playSound } from "@/lib/sounds";

const TABS = ["Overview", "Activity", "Settings"];

export function SharedLayoutDemo() {
  const [active, setActive] = useState(0);
  const [shared, setShared] = useState(true);

  return (
    <Demo>
      <div className="flex rounded-lg border bg-muted p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActive(i);
              playSound("tick");
            }}
            className="relative px-4 py-1.5 text-xs font-medium"
          >
            {active === i &&
              (shared ? (
                <motion.span
                  layoutId="tab-indicator"
                  transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                  className="absolute inset-0 rounded-md bg-card shadow-xs"
                />
              ) : (
                <span className="absolute inset-0 rounded-md bg-card shadow-xs" />
              ))}
            <span
              className={`relative transition-colors ${
                active === i ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          shared layout
        </span>
        <Switch checked={shared} onCheckedChange={setShared} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        One element, one `layoutId`. With it, the indicator travels between
        tabs and the switch reads as movement; without it, the highlight
        teleports and the tabs feel unrelated.
      </p>
    </Demo>
  );
}
