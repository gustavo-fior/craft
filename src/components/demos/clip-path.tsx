"use client";

import {
  ArrowsOutLineHorizontalIcon,
  CheckIcon,
  RocketLaunchIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import waterLiliesImage from "@/assets/claude-monet-water-lilies.jpg";
import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/* Reveal: animating width reflows the content, clipping does not. */

function DeployCard() {
  const t = useDemoText();
  return (
    <div className="flex w-full items-start gap-2.5 rounded-xl bg-card p-3 shadow-(--custom-shadow)">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-foreground">
        <RocketLaunchIcon aria-hidden="true" className="size-3.5" weight="duotone" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{t("Deploy finished")}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {t("Production is live at acme.com")}
        </p>
      </div>
    </div>
  );
}

export function ClipPathRevealDemo() {
  const t = useDemoText();
  const [shown, setShown] = useState(true);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="flex h-20 w-full items-start">
            <div
              className="overflow-hidden motion-reduce:transition-none"
              style={{
                width: shown ? "100%" : "0%",
                transition: `width 600ms ${EASE_OUT}`,
              }}
            >
              <DeployCard />
            </div>
          </div>
        </CompareItem>
        <CompareItem verdict="right">
          <div className="flex h-20 w-full items-start">
            <div
              className="w-full motion-reduce:transition-none"
              style={{
                clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                transition: `clip-path 600ms ${EASE_OUT}`,
              }}
            >
              <DeployCard />
            </div>
          </div>
        </CompareItem>
      </Compare>

      <Button onClick={() => setShown((value) => !value)} variant="secondary">
        {t(shown ? "Hide" : "Reveal")}
      </Button>
    </Demo>
  );
}

/* Tabs: one list colored per label versus a clipped duplicate. */

const TABS = ["Overview", "Activity", "Settings"] as const;

function TabButtons({
  active,
  onChange,
  className,
}: {
  active: number;
  onChange: (index: number) => void;
  className?: string;
}) {
  const t = useDemoText();
  return (
    <div className={cn("grid grid-cols-3", className)}>
      {TABS.map((tab, index) => (
        <button
          key={tab}
          aria-pressed={active === index}
          className="relative z-10 h-8 cursor-pointer truncate rounded-full px-2 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => onChange(index)}
          type="button"
        >
          {t(tab)}
        </button>
      ))}
    </div>
  );
}

export function ClipPathTabsDemo() {
  const t = useDemoText();
  const [active, setActive] = useState(0);

  const pillWidth = "calc((100% - 4px) / 3)";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="relative w-full rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
            <div
              aria-hidden="true"
              className="absolute inset-y-0.5 left-0.5 rounded-full bg-foreground motion-reduce:transition-none"
              style={{
                width: pillWidth,
                transform: `translateX(${active * 100}%)`,
                transition: "transform 250ms ease",
              }}
            />
            <div className="relative grid grid-cols-3">
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  aria-pressed={active === index}
                  className={cn(
                    "h-8 cursor-pointer truncate rounded-full px-2 text-xs font-medium outline-none transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
                    active === index
                      ? "text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActive(index)}
                  type="button"
                >
                  {t(tab)}
                </button>
              ))}
            </div>
          </div>
        </CompareItem>

        <CompareItem verdict="right">
          <div className="relative w-full rounded-full bg-card p-0.5 shadow-(--custom-shadow)">
            <TabButtons active={active} onChange={setActive} />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 motion-reduce:transition-none"
              style={{
                clipPath: `inset(2px calc(2px + ${2 - active} * ${pillWidth}) 2px calc(2px + ${active} * ${pillWidth}) round 9999px)`,
                transition: "clip-path 250ms ease",
              }}
            >
              <div className="grid h-full grid-cols-3 rounded-full bg-foreground p-0.5">
                {TABS.map((tab) => (
                  <span
                    key={tab}
                    className="flex h-8 items-center justify-center truncate px-2 text-xs font-medium text-background"
                  >
                    {t(tab)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/* Hold to delete: the overlay is revealed slowly, and snaps back fast. */

const HOLD_MS = 1500;

export function ClipPathHoldDemo() {
  const t = useDemoText();
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(resetTimer.current);
    },
    []
  );

  const start = useCallback(() => {
    if (done || holdTimer.current) return;
    setHolding(true);
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = undefined;
      setHolding(false);
      setDone(true);
      resetTimer.current = window.setTimeout(() => setDone(false), 1400);
    }, HOLD_MS);
  }, [done]);

  const cancel = useCallback(() => {
    window.clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
    setHolding(false);
  }, []);

  const revealed = holding || done;

  return (
    <Demo className="gap-8">
      <button
        aria-label={t("Hold to delete")}
        className="relative h-9 cursor-pointer touch-none overflow-hidden rounded-full bg-destructive/10 px-4 text-sm font-medium text-destructive shadow-(--custom-shadow-destructive) outline-none transition-transform duration-150 select-none focus-visible:ring-[1.5px] focus-visible:ring-destructive/40 active:scale-[0.97] dark:bg-destructive/20"
        onContextMenu={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            event.preventDefault();
            start();
          }
        }}
        onKeyUp={cancel}
        onPointerCancel={cancel}
        onPointerDown={(event) => {
          if (event.button === 0) start();
        }}
        onPointerLeave={cancel}
        onPointerUp={cancel}
        type="button"
      >
        <span className="flex items-center gap-1.5">
          <TrashIcon aria-hidden="true" className="size-4" weight="duotone" />
          {t("Hold to delete")}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center gap-1.5 bg-destructive text-white"
          style={{
            clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            transition: holding
              ? `clip-path ${HOLD_MS}ms linear`
              : `clip-path 200ms ${EASE_OUT}`,
          }}
        >
          {done ? (
            <>
              <CheckIcon aria-hidden="true" className="size-4" weight="bold" />
              {t("Deleted")}
            </>
          ) : (
            <>
              <TrashIcon aria-hidden="true" className="size-4" weight="duotone" />
              {t("Hold to delete")}
            </>
          )}
        </span>
      </button>
    </Demo>
  );
}

/* Comparison slider: two full-size layers, the top one clipped. */

export function ClipPathCompareDemo() {
  const t = useDemoText();
  const [position, setPosition] = useState(55);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div
        ref={frameRef}
        className="relative aspect-[16/10] w-full max-w-md cursor-ew-resize touch-none overflow-hidden rounded-xl bg-muted shadow-(--custom-shadow) select-none"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging.current) updateFromPointer(event.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
      >
        <Image
          alt={t("Water Lilies by Claude Monet, in grayscale")}
          className="object-cover grayscale"
          draggable={false}
          fill
          placeholder="blur"
          sizes="(max-width: 640px) 100vw, 448px"
          src={waterLiliesImage}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            alt={t("Water Lilies by Claude Monet, in color")}
            className="object-cover"
            draggable={false}
            fill
            placeholder="blur"
            sizes="(max-width: 640px) 100vw, 448px"
            src={waterLiliesImage}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
          style={{ left: `${position}%` }}
        />
        <button
          aria-label={t("Comparison position")}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(position)}
          className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setPosition((value) => Math.max(0, value - 2));
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              setPosition((value) => Math.min(100, value + 2));
            }
          }}
          role="slider"
          style={{ left: `${position}%` }}
          type="button"
        >
          <ArrowsOutLineHorizontalIcon
            aria-hidden="true"
            className="size-4"
            weight="bold"
          />
        </button>
      </div>
    </Demo>
  );
}
