"use client";

import { ArrowsOutLineHorizontalIcon } from "@phosphor-icons/react";
import { useCallback, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { cn } from "@/lib/utils";

type Smoothing = "auto" | "antialiased" | "subpixel-antialiased" | "none";

const SMOOTHING_OPTIONS = [
  { value: "auto", label: "Default" },
  { value: "antialiased", label: "Antialiased" },
] as const;

/** Every legal value of the property, for the reference demo. */
const ALL_SMOOTHING_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "antialiased", label: "Antialiased" },
  { value: "subpixel-antialiased", label: "Subpixel" },
  { value: "none", label: "None" },
] as const;

const smoothingStyles: Record<Smoothing, React.CSSProperties> = {
  auto: { WebkitFontSmoothing: "auto", MozOsxFontSmoothing: "auto" },
  antialiased: {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  // No `-moz-` equivalent exists for either of these, so Firefox falls back to
  // its own default. Both are macOS-only in any case.
  "subpixel-antialiased": { WebkitFontSmoothing: "subpixel-antialiased" },
  none: { WebkitFontSmoothing: "none" },
};

function SmoothingControl({
  value,
  onChange,
  options = SMOOTHING_OPTIONS,
}: {
  value: Smoothing;
  onChange: (value: Smoothing) => void;
  options?: readonly { value: Smoothing; label: string }[];
}) {
  return (
    <SegmentedControl
      ariaLabel="Font smoothing"
      onChange={onChange}
      options={options}
      value={value}
    />
  );
}

type Note = { eyebrow?: string; title: string; body: string };

const RELEASE_NOTE: Note = {
  eyebrow: "Changelog",
  title: "Faster cold starts",
  body: "Functions now boot in under 100ms. No changes are needed on your side.",
};

const APPEARANCE_NOTE: Note = {
  title: "Appearance",
  body: "Pick a theme, or follow your system and switch to dark at sunset.",
};

function ReleaseNote({
  tone,
  note = RELEASE_NOTE,
}: {
  tone: "dark" | "light";
  note?: Note;
}) {
  const dark = tone === "dark";

  return (
    <div className="flex flex-col gap-1.5">
      {note.eyebrow && (
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-wide",
            dark ? "text-white/45" : "text-black/40"
          )}
        >
          {note.eyebrow}
        </span>
      )}
      <span
        className={cn(
          "text-lg font-semibold leading-tight tracking-tight",
          dark ? "text-white" : "text-neutral-900"
        )}
      >
        {note.title}
      </span>
      <span
        className={cn(
          "text-sm leading-relaxed",
          dark ? "text-white/70" : "text-neutral-600"
        )}
      >
        {note.body}
      </span>
    </div>
  );
}

/*
 * Comparison slider. The same content is rendered twice, default smoothing
 * underneath and antialiased on top, with the top layer clipped to the
 * handle. Dragging through the glyphs shows both renderings side by side.
 */
function CompareSlider({
  children,
  className,
  handleClassName = "bottom-3",
}: {
  children: React.ReactNode;
  className?: string;
  handleClassName?: string;
}) {
  const [position, setPosition] = useState(50);
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
    <div className="flex w-full flex-col gap-3">
      <div className="flex justify-between px-4 text-xs text-muted-foreground">
        <span>Default</span>
        <span>Antialiased</span>
      </div>
      <div
        ref={frameRef}
        className={cn(
          "relative w-full cursor-ew-resize touch-none rounded-xl select-none",
          className
        )}
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
        {/* Each layer carries its own opaque background. A clip-path makes
            the top layer composited, and the browser only uses subpixel
            rendering (the thick kind) for text over an opaque surface, so
            without this both halves would render the same. */}
        <div
          className="h-full rounded-xl bg-neutral-800 dark:bg-neutral-900"
          style={smoothingStyles.auto}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-xl bg-neutral-800 dark:bg-neutral-900"
          style={{
            ...smoothingStyles.antialiased,
            clipPath: `inset(0 0 0 ${position}%)`,
          }}
        >
          {children}
        </div>
        {/* The shadow sits on its own layer above the opaque halves; on the
            frame itself they would paint over its inset highlights. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl shadow-(--custom-shadow)"
        />

        <div
          className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-muted-foreground"
          style={{ left: `${position}%` }}
        />
        <button
          aria-label="Comparison position"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(position)}
          className={cn(
            "absolute grid size-7 -translate-x-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-white/70",
            handleClassName
          )}
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
            className="size-3.5"
            weight="bold"
          />
        </button>
      </div>
    </div>
  );
}

export function FontSmoothingCompareDemo() {
  return (
    <Demo className="gap-4 px-4 sm:px-8">
      <div className="w-full max-w-sm">
        <CompareSlider className="h-28">
          <div className="grid h-full place-items-center px-6 pb-6">
            <span className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">
              The quick brown fox
            </span>
          </div>
        </CompareSlider>
      </div>
    </Demo>
  );
}

export function FontSmoothingDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div
          className="w-full rounded-xl bg-neutral-800 p-6 shadow-(--custom-shadow) dark:bg-neutral-900"
          style={smoothingStyles[mode]}
        >
          <ReleaseNote tone="dark" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          -webkit-font-smoothing: {mode}
        </span>
      </div>
      <SmoothingControl value={mode} onChange={setMode} />
    </Demo>
  );
}

export function FontSmoothingContrastDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div
        className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
        style={smoothingStyles[mode]}
      >
        <div className="rounded-xl bg-neutral-100 p-5 shadow-(--custom-shadow) dark:bg-neutral-200">
          <ReleaseNote tone="light" note={APPEARANCE_NOTE} />
        </div>
        <div className="rounded-xl bg-neutral-800 p-5 shadow-(--custom-shadow) dark:bg-neutral-900">
          <ReleaseNote tone="dark" note={APPEARANCE_NOTE} />
        </div>
      </div>
      <SmoothingControl value={mode} onChange={setMode} />
    </Demo>
  );
}

const WEIGHTS = [200, 300, 400, 500, 600, 700] as const;

export function FontSmoothingWeightsDemo() {
  return (
    <Demo className="px-4 sm:px-8">
      <div className="w-full max-w-md">
        <CompareSlider handleClassName="top-1/2 -translate-y-1/2">
          <div className="flex flex-col px-5 py-1.5">
            {WEIGHTS.map((weight) => (
              <div
                key={weight}
                className="flex items-center justify-between gap-3 border-b border-white/8 py-2.5 last:border-b-0"
              >
                <span
                  className="truncate text-base text-white"
                  style={{ fontWeight: weight }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {weight}
                </span>
              </div>
            ))}
          </div>
        </CompareSlider>
      </div>
    </Demo>
  );
}

export function FontSmoothingValuesDemo() {
  const [mode, setMode] = useState<Smoothing>("auto");

  return (
    <Demo className="gap-8">
      <div
        className="w-full max-w-sm rounded-xl bg-neutral-800 p-6 shadow-(--custom-shadow) dark:bg-neutral-900"
        style={smoothingStyles[mode]}
      >
        <ReleaseNote tone="dark" />
      </div>
      <SmoothingControl
        onChange={setMode}
        options={ALL_SMOOTHING_OPTIONS}
        value={mode}
      />
    </Demo>
  );
}
