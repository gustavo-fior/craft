"use client";

import Image from "next/image";
import { useState } from "react";

import monet from "@/assets/claude-monet-water-lilies.jpg";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Mode = "flat" | "depth";

const MODES = [
  { value: "flat", label: "Flat" },
  { value: "depth", label: "Depth" },
] as const;

const ROWS = [
  { title: "Water Lilies", meta: "Claude Monet, 1906" },
  { title: "The Japanese Footbridge", meta: "Claude Monet, 1899" },
  { title: "Haystacks", meta: "Claude Monet, 1890" },
] as const;

export function DepthOfFieldDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<Mode>("flat");
  const [open, setOpen] = useState(true);
  const depth = mode === "depth" && open;

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
        <div
          className={cn(
            "transition-[transform,filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            depth ? "scale-[0.97] blur-[2px]" : "scale-100 blur-0"
          )}
        >
          <div className="relative aspect-[2/1] w-full">
            <Image
              alt={t("Water Lilies by Claude Monet")}
              className="object-cover"
              fill
              placeholder="blur"
              sizes="(min-width: 640px) 384px, 100vw"
              src={monet}
            />
          </div>
          <ul className="divide-y divide-[#E7E7E7] p-1.5 dark:divide-[#1E1E1E]">
            {ROWS.map((row) => (
              <li
                key={row.title}
                className="flex h-10 items-center justify-between gap-3 px-2 text-xs"
              >
                <span className="truncate text-foreground">{t(row.title)}</span>
                <span className="shrink-0 text-muted-foreground">
                  {row.meta}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 top-1/2 mx-auto w-[calc(100%-2.5rem)] max-w-64 -translate-y-1/2 rounded-xl bg-card p-4 shadow-(--custom-shadow) transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            open
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          )}
          aria-label={t("Delete collection")}
          role="dialog"
        >
          <div className="text-sm font-medium text-foreground">
            {t("Delete collection?")}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("The three paintings inside will stay in your library.")}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
              onClick={() => setOpen(false)}
              type="button"
            >
              {t("Cancel")}
            </button>
            <button
              className="h-7 cursor-pointer rounded-md bg-foreground px-2.5 text-xs font-medium text-background"
              onClick={() => setOpen(false)}
              type="button"
            >
              {t("Delete")}
            </button>
          </div>
        </div>

        <button
          className={cn(
            "absolute inset-0 grid cursor-pointer place-items-center text-xs font-medium text-foreground transition-opacity duration-300 motion-reduce:transition-none",
            open ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className="rounded-md bg-card px-2.5 py-1.5 shadow-(--custom-shadow)">
            {t("Open dialog")}
          </span>
        </button>
      </div>

      <SegmentedControl
        ariaLabel={t("Background treatment")}
        onChange={setMode}
        options={MODES.map((option) => ({
          ...option,
          label: t(option.label),
        }))}
        value={mode}
      />
    </Demo>
  );
}
