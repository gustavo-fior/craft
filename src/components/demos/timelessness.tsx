"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Era = "2011" | "2014" | "2021" | "now";

const ERAS = [
  { value: "2011", label: "2011" },
  { value: "2014", label: "2014" },
  { value: "2021", label: "2021" },
  { value: "now", label: "Now" },
] as const;

const BACKDROP: Record<Era, string> = {
  "2011": "bg-[linear-gradient(#d9d9d9,#bfbfbf)] dark:bg-[linear-gradient(#3a3a3a,#262626)]",
  "2014": "bg-[#1abc9c]",
  "2021": "bg-[linear-gradient(135deg,#f472b6,#a78bfa_50%,#38bdf8)]",
  now: "bg-muted",
};

const BUTTON: Record<Era, string> = {
  "2011":
    "rounded-[7px] border border-[#2a5fb6] bg-[linear-gradient(#7fb0f2,#3d7fe0_50%,#2568d6_50%,#4a8ef2)] text-white [text-shadow:0_-1px_0_rgba(0,0,0,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.35)]",
  "2014":
    "rounded-[3px] bg-[#e74c3c] text-white shadow-[6px_6px_0_rgba(0,0,0,0.18)] uppercase tracking-[0.08em] text-[13px]",
  "2021":
    "rounded-2xl border border-white/40 bg-white/20 text-white backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.25)]",
  now: "rounded-lg bg-foreground text-background shadow-(--custom-shadow)",
};

export function SurfaceErasDemo() {
  const t = useDemoText();
  const [era, setEra] = useState<Era>("now");

  return (
    <Demo className="gap-8">
      <div
        className={cn(
          "grid h-44 w-full max-w-sm place-items-center rounded-xl transition-colors duration-300 motion-reduce:transition-none",
          BACKDROP[era]
        )}
      >
        <button
          className={cn(
            "inline-flex h-10 cursor-pointer items-center px-5 text-sm font-medium transition-[transform,box-shadow] duration-150 active:scale-[0.97] motion-reduce:transition-none",
            BUTTON[era]
          )}
          type="button"
        >
          {t("Continue")}
        </button>
      </div>
      <SegmentedControl
        ariaLabel={t("Era")}
        onChange={setEra}
        options={ERAS.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={era}
      />
    </Demo>
  );
}
