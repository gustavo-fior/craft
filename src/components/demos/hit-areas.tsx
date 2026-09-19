"use client";

import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  CopyIcon,
  LinkIcon,
  PencilSimpleIcon,
  TextBIcon,
  TextItalicIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Overlay = "hidden" | "shown";

const OVERLAY_OPTIONS = [
  { value: "hidden", label: "Normal" },
  { value: "shown", label: "Show hit areas" },
] as const;

/* Painted onto the real clickable box so the reader can see it. */
const PAINT =
  "bg-rose-500/10 outline-1 outline-dashed outline-rose-500/60 -outline-offset-1";

/* Toolbar: same 16px icons, two different buttons. */

const TOOLS = [
  { label: "Bold", Icon: TextBIcon },
  { label: "Italic", Icon: TextItalicIcon },
  { label: "Link", Icon: LinkIcon },
  { label: "Undo", Icon: ArrowUUpLeftIcon },
  { label: "Redo", Icon: ArrowUUpRightIcon },
] as const;

function Toolbar({ padded, paint }: { padded: boolean; paint: boolean }) {
  const t = useDemoText();
  return (
    <div
      className={cn(
        "flex items-center rounded-xl bg-card shadow-(--custom-shadow)",
        padded ? "gap-1 p-1" : "gap-4 px-4 py-3"
      )}
      role="toolbar"
      aria-label={t(padded ? "Padded toolbar" : "Unpadded toolbar")}
    >
      {TOOLS.map(({ label, Icon }) => (
        <button
          key={label}
          aria-label={t(label)}
          className={cn(
            "grid shrink-0 cursor-pointer place-items-center rounded-md text-foreground outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 active:bg-muted motion-reduce:transition-none",
            padded ? "size-8" : "size-4 rounded-sm",
            paint && PAINT
          )}
          type="button"
        >
          <Icon aria-hidden="true" className="size-4" weight="bold" />
        </button>
      ))}
    </div>
  );
}

export function HitAreasToolbarDemo() {
  const t = useDemoText();
  const [overlay, setOverlay] = useState<Overlay>("hidden");
  const paint = overlay === "shown";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <Toolbar padded={false} paint={paint} />
        </CompareItem>
        <CompareItem verdict="right">
          <Toolbar padded paint={paint} />
        </CompareItem>
      </Compare>
      <SegmentedControl
        ariaLabel={t("Hit area overlay")}
        onChange={setOverlay}
        options={OVERLAY_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={overlay}
      />
    </Demo>
  );
}

/* Chips: a tiny close button, with and without an invisible extension. */

const FILTERS = ["Design", "Engineering", "Product"] as const;

function FilterChips({ expanded, paint }: { expanded: boolean; paint: boolean }) {
  const t = useDemoText();
  const [removed, setRemoved] = useState<string[]>([]);
  const visible = FILTERS.filter((filter) => !removed.includes(filter));

  return (
    <div className="flex min-h-9 w-full flex-wrap items-center gap-1.5">
      {visible.map((filter) => (
        <span
          key={filter}
          className="flex h-7 items-center gap-1 rounded-full bg-card pr-1.5 pl-2.5 text-xs font-medium text-foreground shadow-(--custom-shadow)"
        >
          {t(filter)}
          <button
            aria-label={t("Remove {filter}", { filter: t(filter) })}
            className={cn(
              "relative grid size-3.5 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
              expanded && "after:absolute after:-inset-2 after:rounded-full after:content-['']",
              paint && !expanded && PAINT,
              paint &&
                expanded &&
                "after:bg-rose-500/10 after:outline-1 after:outline-dashed after:outline-rose-500/60 after:-outline-offset-1"
            )}
            onClick={() => setRemoved((list) => [...list, filter])}
            type="button"
          >
            <XIcon aria-hidden="true" className="size-2.5" weight="bold" />
          </button>
        </span>
      ))}
      {visible.length === 0 && (
        <button
          className="h-7 cursor-pointer rounded-full px-2.5 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => setRemoved([])}
          type="button"
        >
          {t("Reset filters")}
        </button>
      )}
    </div>
  );
}

export function HitAreasExpandDemo() {
  const t = useDemoText();
  const [overlay, setOverlay] = useState<Overlay>("hidden");
  const paint = overlay === "shown";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <FilterChips expanded={false} paint={paint} />
        </CompareItem>
        <CompareItem verdict="right">
          <FilterChips expanded paint={paint} />
        </CompareItem>
      </Compare>
      <SegmentedControl
        ariaLabel={t("Hit area overlay")}
        onChange={setOverlay}
        options={OVERLAY_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={overlay}
      />
    </Demo>
  );
}

/* Menu: gaps between items are dead zones, padding is not. */

const MENU = [
  { label: "Rename", Icon: PencilSimpleIcon },
  { label: "Duplicate", Icon: CopyIcon },
  { label: "Copy link", Icon: LinkIcon },
  { label: "Delete", Icon: TrashIcon },
] as const;

function Menu({ gapped, paint }: { gapped: boolean; paint: boolean }) {
  const t = useDemoText();
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-xl bg-card p-1 shadow-(--custom-shadow)",
        gapped && "gap-2"
      )}
      role="menu"
      aria-label={t(gapped ? "Menu with gaps" : "Menu without gaps")}
    >
      {MENU.map(({ label, Icon }) => (
        <button
          key={label}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-xs font-medium text-foreground outline-none transition-colors duration-100 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
            gapped ? "h-7" : "h-9",
            label === "Delete" && "text-destructive hover:bg-destructive/10",
            paint && PAINT
          )}
          role="menuitem"
          type="button"
        >
          <Icon aria-hidden="true" className="size-3.5 shrink-0" weight="duotone" />
          <span className="truncate">{t(label)}</span>
        </button>
      ))}
    </div>
  );
}

export function HitAreasGapDemo() {
  const t = useDemoText();
  const [overlay, setOverlay] = useState<Overlay>("hidden");
  const paint = overlay === "shown";

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <Menu gapped paint={paint} />
        </CompareItem>
        <CompareItem verdict="right">
          <Menu gapped={false} paint={paint} />
        </CompareItem>
      </Compare>
      <SegmentedControl
        ariaLabel={t("Hit area overlay")}
        onChange={setOverlay}
        options={OVERLAY_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={overlay}
      />
    </Demo>
  );
}
