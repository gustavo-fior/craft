"use client";

import {
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { label: "Wrong", rootBackgroundSet: false },
  { label: "Right", rootBackgroundSet: true },
] as const;

export function HtmlBackgroundDemo() {
  const t = useDemoText();
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

  return (
    <Demo className="gap-7 px-0 sm:px-0">
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-8">
        {EXAMPLES.map((example) => (
          <div
            key={example.label}
            className="flex min-w-0 flex-col items-center gap-4"
          >
            <div
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                example.rootBackgroundSet
                  ? "text-emerald-500"
                  : "text-destructive"
              )}
            >
              {example.rootBackgroundSet ? (
                <CheckCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              ) : (
                <XCircleIcon
                  aria-hidden="true"
                  className="size-4"
                  weight="fill"
                />
              )}
              {t(example.label)}
            </div>

            <div className="w-full overflow-hidden rounded-xl bg-card ">
              <div
                aria-hidden="true"
                className="grid grid-cols-[1fr_auto_1fr] items-center bg-[#ececec] px-2 py-2 dark:bg-[#292929] sm:px-3"
              >
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="size-2 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)] sm:size-2.5" />
                  <span className="size-2 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)] sm:size-2.5" />
                  <span className="size-2 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.16)] sm:size-2.5" />
                </div>
                <div className="flex h-5 w-16 items-center justify-center justify-self-center rounded-full bg-black/5 px-2 dark:bg-white/6 sm:h-5 sm:w-28">
                  <span className="truncate text-[9px] sm:text-[10px]">
                    craft.local
                  </span>
                </div>
              </div>

              {/* The area behind the page is what Safari paints from the
                  document canvas during overscroll. */}
              <div className="relative h-40 overflow-hidden bg-[#1c1c1c]">
                {/* Only the strip the page reveals is painted; keeping the
                    white off the clipped edges avoids Safari's anti-aliased
                    hairline at the rounded corners. */}
                {!example.rootBackgroundSet && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-16 bg-white"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-3 text-center text-[9px] transition-opacity duration-150 sm:text-[10px]",
                    example.rootBackgroundSet
                      ? "text-white/45"
                      : "text-black/45",
                    banding ? "opacity-100" : "opacity-0"
                  )}
                >
                  {t("Document canvas")}
                </span>
                <div
                  className="absolute inset-0 bg-[#1c1c1c] p-3 pt-5 transition-transform duration-400 ease-out motion-reduce:transition-none sm:p-4 sm:pt-5"
                  style={{
                    transform: banding ? "translateY(48px)" : "translateY(0)",
                  }}
                >
                  <span className="mb-5 inline-flex rounded-full bg-white/10 px-2 py-1 text-[9px] text-white/55 sm:text-[10px]">
                    Acme
                  </span>
                  <div className="h-1.5 w-1/2 rounded-full bg-white/30" />
                  <div className="mt-2.5 h-1.5 w-4/5 rounded-full bg-white/20" />
                  <div className="mt-2 h-1.5 w-2/3 rounded-full bg-white/15" />
                  <div className="mt-4 h-16 rounded-lg bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={rubberBand} variant="secondary">
        <ArrowDownIcon weight="bold" />
        {t("Scroll")}
      </Button>
    </Demo>
  );
}
