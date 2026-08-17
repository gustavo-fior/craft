"use client";

import { useEffect, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowDownIcon } from "@phosphor-icons/react";

type BackgroundTarget = "wrapper" | "root";

const BACKGROUND_OPTIONS: {
  value: BackgroundTarget;
  label: string;
}[] = [
  { value: "wrapper", label: "Wrapper only" },
  { value: "root", label: "HTML root" },
];

export function HtmlBackgroundDemo() {
  const [backgroundTarget, setBackgroundTarget] =
    useState<BackgroundTarget>("wrapper");
  const [banding, setBanding] = useState(false);
  const bandingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      if (bandingTimer.current) clearTimeout(bandingTimer.current);
    },
    []
  );

  function rubberBand() {
    if (bandingTimer.current) clearTimeout(bandingTimer.current);
    setBanding(true);
    bandingTimer.current = setTimeout(() => setBanding(false), 550);
  }

  const rootBackgroundSet = backgroundTarget === "root";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <div className="w-full max-w-96 overflow-hidden rounded-xl bg-card shadow-xs">
        <div
          aria-hidden="true"
          className="grid grid-cols-[1fr_auto_1fr] items-center bg-[#ececec] p-3 py-2 dark:bg-[#292929]"
        >
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)]" />
            <span className="size-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)]" />
            <span className="size-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)]" />
          </div>
          <div className="flex h-6 w-44 items-center justify-center justify-self-center rounded-full bg-black/5 px-3 dark:bg-white/6">
            <span className="truncate text-[10px]">craft.local</span>
          </div>
        </div>

        {/* The area behind the page is what Safari paints from the document
            canvas during overscroll. The browser chrome stays in place. */}
        <div
          className="relative h-44 overflow-hidden transition-colors duration-200"
          style={{ background: rootBackgroundSet ? "#1c1c1c" : "#ffffff" }}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-x-0 top-4 text-center text-[11px] transition-opacity duration-150",
              rootBackgroundSet ? "text-white/45" : "text-black/45",
              banding ? "opacity-100" : "opacity-0"
            )}
          >
            Document canvas
          </span>
          <div
            className="absolute inset-0 bg-[#1c1c1c] p-4 pt-6 transition-transform duration-400 ease-out motion-reduce:transition-none"
            style={{
              transform: banding ? "translateY(56px)" : "translateY(0)",
            }}
          >
            <span className="mb-6 inline-flex rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/55">
              App wrapper
            </span>
            <div className="h-2 w-24 rounded-full bg-white/30" />
            <div className="mt-3 h-2 w-40 rounded-full bg-white/20" />
            <div className="mt-2 h-2 w-32 rounded-full bg-white/15" />
            <div className="mt-5 h-24 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <SegmentedControl
          ariaLabel="Background target"
          onChange={setBackgroundTarget}
          options={BACKGROUND_OPTIONS}
          value={backgroundTarget}
        />
        <div className="relative flex w-fit rounded-full p-0.5">
          <Button variant="outline" onClick={rubberBand}>
            <ArrowDownIcon weight="bold" />
            Scroll
          </Button>
        </div>
      </div>

      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        {rootBackgroundSet
          ? "The root and the app use the same dark background."
          : "The dark wrapper moves, revealing the white canvas behind it."}
      </p>
    </Demo>
  );
}
