"use client";

// TEMPORARY: font A/B toggle for comparing Open Runde and Inter.
// Remove this component (and the Inter font in layout.tsx) once decided.

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playSound } from "@/lib/sounds";

export function FontToggle() {
  const [font, setFont] = useState<"open-runde" | "inter">("open-runde");

  const change = (value: string) => {
    const next = value as "open-runde" | "inter";
    setFont(next);
    document.documentElement.dataset.font = next;
    playSound("toggle");
  };

  return (
    <Tabs value={font} onValueChange={(v) => change(v as string)}>
      <TabsList className="h-7">
        <TabsTrigger value="open-runde" className="px-2 text-[11px]">
          Open Runde
        </TabsTrigger>
        <TabsTrigger value="inter" className="px-2 text-[11px]">
          Inter
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
