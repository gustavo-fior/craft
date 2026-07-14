"use client";

// TEMPORARY: noise on/off toggle for testing the grain overlay.
// Remove together with the font toggle once decided.

import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { playSound } from "@/lib/sounds";

export function NoiseToggle() {
  const [on, setOn] = useState(true);

  const change = (checked: boolean) => {
    setOn(checked);
    document.documentElement.dataset.noise = checked ? "on" : "off";
    playSound("toggle");
  };

  return (
    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      Noise
      <Switch checked={on} onCheckedChange={change} />
    </label>
  );
}
