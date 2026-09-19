"use client";

import { useDemoText } from "@/components/app/demo-messages";
import {
  ArrowsClockwiseIcon,
  CopyIcon,
  DotsThreeIcon,
  ExportIcon,
  FolderSimpleIcon,
  LinkSimpleIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : (value as number);
}
const ENTER_MS = 320;

const SHARE_ITEMS = [
  { label: "Copy link", Icon: LinkSimpleIcon },
  { label: "Invite people", Icon: UsersIcon },
  { label: "Export as PDF", Icon: ExportIcon },
] as const;

const MORE_ITEMS = [
  { label: "Rename", Icon: PencilSimpleIcon },
  { label: "Duplicate", Icon: CopyIcon },
  { label: "Move to", Icon: FolderSimpleIcon },
  { label: "Delete", Icon: TrashIcon },
] as const;

function Menu({
  items,
  className,
  style,
}: {
  items: readonly { label: string; Icon: React.ElementType }[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const t = useDemoText();
  return (
    <ul
      aria-hidden="true"
      className={cn(
        "flex w-36 flex-col rounded-lg bg-card p-1 shadow-(--custom-shadow)",
        className
      )}
      style={style}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-foreground"
        >
          <item.Icon
            aria-hidden="true"
            className="size-3.5 shrink-0 text-muted-foreground"
            weight="duotone"
          />
          {t(item.label)}
        </li>
      ))}
    </ul>
  );
}

function FakeTrigger({ open }: { open: boolean }) {
  const t = useDemoText();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1.5 text-xs font-medium text-foreground shadow-(--custom-shadow) transition-colors",
        open && "bg-muted"
      )}
    >
      <ShareNetworkIcon className="size-3.5" weight="duotone" />
      {t("Share")}
    </span>
  );
}

export function ScaleEntrancesDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ms = reduceMotion ? 0 : ENTER_MS;

  const popover = (from: number) =>
    ({
      opacity: open ? 1 : 0,
      transform: open ? "scale(1)" : `scale(${from})`,
      transformOrigin: "top center",
      transition: `opacity ${ms}ms ${EASE_OUT}, transform ${ms}ms ${EASE_OUT}`,
    }) satisfies React.CSSProperties;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" caption={t("From scale(0)")}>
          <div className="flex h-44 w-full flex-col items-center gap-2 rounded-xl bg-muted pt-4 dark:bg-muted/40">
            <FakeTrigger open={open} />
            <Menu items={SHARE_ITEMS} style={popover(0)} />
          </div>
        </CompareItem>
        <CompareItem verdict="right" caption={t("From scale(0.95)")}>
          <div className="flex h-44 w-full flex-col items-center gap-2 rounded-xl bg-muted pt-4 dark:bg-muted/40">
            <FakeTrigger open={open} />
            <Menu items={SHARE_ITEMS} style={popover(0.95)} />
          </div>
        </CompareItem>
      </Compare>

      <Button onClick={() => setOpen((value) => !value)} variant="secondary">
        {open ? t("Close") : t("Open")}
      </Button>
    </Demo>
  );
}

function CornerCard({
  open,
  origin,
  ms,
}: {
  open: boolean;
  origin: string;
  ms: number;
}) {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted p-3 dark:bg-muted/40">
      <div aria-hidden="true" className="flex items-start justify-between">
        <div className="pt-1">
          <div className="h-1.5 w-16 rounded-full bg-foreground/20" />
          <div className="mt-2 h-1.5 w-10 rounded-full bg-foreground/10" />
        </div>
        <span
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-md bg-card text-foreground shadow-(--custom-shadow) transition-colors",
            open && "bg-card/60"
          )}
        >
          <DotsThreeIcon className="size-4" weight="bold" />
        </span>
      </div>
      <Menu
        items={MORE_ITEMS}
        className="absolute top-10 right-3"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scale(1)" : "scale(0.85)",
          transformOrigin: origin,
          transition: `opacity ${ms}ms ${EASE_OUT}, transform ${ms}ms ${EASE_OUT}`,
        }}
      />
    </div>
  );
}

export function TransformOriginDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ms = reduceMotion ? 0 : ENTER_MS;

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong" caption={t("Origin: center")}>
          <CornerCard ms={ms} open={open} origin="center" />
        </CompareItem>
        <CompareItem verdict="right" caption={t("Origin: top right")}>
          <CornerCard ms={ms} open={open} origin="top right" />
        </CompareItem>
      </Compare>

      <Button onClick={() => setOpen((value) => !value)} variant="secondary">
        {open ? t("Close") : t("Open")}
      </Button>
    </Demo>
  );
}

export function StartingScaleDemo() {
  const t = useDemoText();
  const reduceMotion = useReducedMotion();
  const [from, setFrom] = useState(0.95);
  const [run, setRun] = useState(0);
  const ms = reduceMotion ? 0 : 480;

  return (
    <Demo className="gap-8">
      <style>{`
        @keyframes craft-scale-enter {
          from { opacity: 0; transform: scale(var(--from)); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="flex h-44 w-full max-w-xs flex-col items-center gap-2 rounded-xl bg-muted pt-4 dark:bg-muted/40">
        <FakeTrigger open />
        <Menu
          key={run}
          items={SHARE_ITEMS}
          style={
            {
              "--from": from,
              transformOrigin: "top center",
              animation: `craft-scale-enter ${ms}ms ${EASE_OUT} both`,
            } as React.CSSProperties
          }
        />
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <label className="grid w-full gap-2.5">
          <span className="flex justify-between text-xs text-muted-foreground">
            {t("Start scale")}
            <span className="tabular-nums text-foreground">
              {from.toFixed(2)}
            </span>
          </span>
          <Slider
            aria-label={t("Starting scale")}
            max={1}
            min={0}
            onValueChange={(value) => {
              setFrom(getSliderValue(value));
              setRun((n) => n + 1);
            }}
            step={0.05}
            value={[from]}
          />
        </label>
        <Button onClick={() => setRun((n) => n + 1)} variant="secondary">
          <ArrowsClockwiseIcon weight="bold" />
          {t("Replay")}
        </Button>
      </div>
    </Demo>
  );
}
