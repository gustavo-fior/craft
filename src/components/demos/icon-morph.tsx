"use client";

import {
  CheckIcon,
  CopyIcon,
  ListIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

function MorphIcon({
  id,
  blur = 4,
  scale = 0.25,
  duration = 0.3,
  bounce = 0,
  children,
}: {
  id: string;
  blur?: number;
  scale?: number;
  /** Spring settle time, in seconds. */
  duration?: number;
  bounce?: number;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative inline-flex size-5 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={id}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          className="inline-flex"
          exit={{ opacity: 0, scale, filter: `blur(${blur}px)` }}
          initial={{ opacity: 0, scale, filter: `blur(${blur}px)` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", duration, bounce }
          }
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CopyCard({
  copied,
  morph,
  onCopy,
}: {
  copied: boolean;
  morph: boolean;
  onCopy: () => void;
}) {
  const icon = copied ? (
    <CheckIcon aria-hidden="true" className="size-5 text-emerald-500" weight="bold" />
  ) : (
    <CopyIcon aria-hidden="true" className="size-5" />
  );

  return (
    <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
      <Button
        aria-label={copied ? "Copied" : "Copy link"}
        onClick={onCopy}
        size="icon-lg"
        variant="outline"
      >
        {morph ? (
          <MorphIcon id={copied ? "check" : "copy"}>{icon}</MorphIcon>
        ) : (
          icon
        )}
      </Button>
    </div>
  );
}

export function IconMorphDemo() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = () => setCopied(true);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" label="Swap">
          <CopyCard copied={copied} morph={false} onCopy={copy} />
        </CompareItem>
        <CompareItem verdict="right" label="Morph">
          <CopyCard copied={copied} morph onCopy={copy} />
        </CompareItem>
      </Compare>
    </Demo>
  );
}

export function IconMorphTuningDemo() {
  const [playing, setPlaying] = useState(false);
  const [blur, setBlur] = useState(4);
  const [scale, setScale] = useState(0.25);
  // Held in ms to match the other duration sliders on the site; Motion's
  // spring `duration` is in seconds.
  const [durationMs, setDurationMs] = useState(300);
  const [bounce, setBounce] = useState(0);

  return (
    <Demo className="gap-10">
      <div className="grid h-28 w-full max-w-xs place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
        <Button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((value) => !value)}
          size="icon-lg"
          variant="outline"
        >
          <MorphIcon
            blur={blur}
            bounce={bounce}
            duration={durationMs / 1000}
            id={playing ? "pause" : "play"}
            scale={scale}
          >
            {playing ? (
              <PauseIcon aria-hidden="true" className="size-5" weight="fill" />
            ) : (
              <PlayIcon aria-hidden="true" className="size-5" weight="fill" />
            )}
          </MorphIcon>
        </Button>
      </div>

      <div className="grid w-full max-w-xs gap-5">
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Blur
            <span className="tabular-nums text-foreground">{blur}px</span>
          </span>
          <Slider
            aria-label="Blur amount"
            max={8}
            min={0}
            onValueChange={(value) => setBlur(getSliderValue(value))}
            step={1}
            value={[blur]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Start scale
            <span className="tabular-nums text-foreground">
              {scale.toFixed(2)}
            </span>
          </span>
          <Slider
            aria-label="Start scale"
            max={1}
            min={0}
            onValueChange={(value) => setScale(getSliderValue(value))}
            step={0.05}
            value={[scale]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Duration
            <span className="tabular-nums text-foreground">{durationMs}ms</span>
          </span>
          <Slider
            aria-label="Spring duration"
            max={800}
            min={100}
            onValueChange={(value) => setDurationMs(getSliderValue(value))}
            step={50}
            value={[durationMs]}
          />
        </label>
        <label className="grid gap-2.5">
          <span className="flex items-center justify-between text-xs text-muted-foreground">
            Bounce
            <span className="tabular-nums text-foreground">
              {bounce.toFixed(2)}
            </span>
          </span>
          <Slider
            aria-label="Spring bounce"
            max={0.6}
            min={0}
            onValueChange={(value) => setBounce(getSliderValue(value))}
            step={0.05}
            value={[bounce]}
          />
        </label>
      </div>
    </Demo>
  );
}

function HeaderBar({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-28 w-full flex-col overflow-hidden rounded-xl bg-card shadow-(--custom-shadow)">
      <div className="flex h-11 items-center justify-between border-b border-[#E7E7E7] px-3 dark:border-[#1E1E1E]">
        <span className="size-4 rounded-full bg-foreground" />
        <Button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={onToggle}
          size="icon-sm"
          variant="ghost"
        >
          {children}
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
        <div className="h-2 w-1/2 rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}

function HamburgerBars({ open }: { open: boolean }) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.4, bounce: 0.15 };
  const bar = "absolute left-0 h-0.5 w-5 rounded-full bg-current";

  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-5 items-center justify-center"
    >
      <motion.span
        animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
        className={cn(bar, "top-1/2 -mt-px")}
        transition={transition}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        className={cn(bar, "top-1/2 -mt-px")}
        transition={transition}
      />
      <motion.span
        animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
        className={cn(bar, "top-1/2 -mt-px")}
        transition={transition}
      />
    </span>
  );
}

export function HamburgerMorphDemo() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((value) => !value);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem label="Swap" verdict="wrong">
          <HeaderBar onToggle={toggle} open={open}>
            {open ? (
              <XIcon aria-hidden="true" className="size-5" weight="bold" />
            ) : (
              <ListIcon aria-hidden="true" className="size-5" weight="bold" />
            )}
          </HeaderBar>
        </CompareItem>
        <CompareItem label="Morph" verdict="right">
          <HeaderBar onToggle={toggle} open={open}>
            <HamburgerBars open={open} />
          </HeaderBar>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

function RotationCard({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-28 w-full place-items-center rounded-xl bg-card shadow-(--custom-shadow)">
      <Button
        aria-label={open ? "Cancel" : "Add item"}
        aria-pressed={open}
        onClick={onToggle}
        size="icon-lg"
        variant="outline"
      >
        {children}
      </Button>
    </div>
  );
}

export function RotationMorphDemo() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const toggle = () => setOpen((value) => !value);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem caption="Crossfade">
          <RotationCard onToggle={toggle} open={open}>
            <MorphIcon id={open ? "close" : "add"}>
              {open ? (
                <XIcon aria-hidden="true" className="size-5" weight="bold" />
              ) : (
                <PlusIcon aria-hidden="true" className="size-5" weight="bold" />
              )}
            </MorphIcon>
          </RotationCard>
        </CompareItem>
        <CompareItem caption="Rotate">
          <RotationCard onToggle={toggle} open={open}>
            <motion.span
              animate={{ rotate: open ? 45 : 0 }}
              className="inline-flex"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.3, bounce: 0 }
              }
            >
              <PlusIcon aria-hidden="true" className="size-5" weight="bold" />
            </motion.span>
          </RotationCard>
        </CompareItem>
      </Compare>
    </Demo>
  );
}
