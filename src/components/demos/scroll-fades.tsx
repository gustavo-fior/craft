"use client";

import {
  CheckCircleIcon,
  CircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  FlaskIcon,
  type Icon,
  LifebuoyIcon,
  MegaphoneIcon,
  PenNibIcon,
  ScalesIcon,
  SquaresFourIcon,
  TerminalWindowIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import { type CSSProperties, useCallback, useEffect, useState } from "react";

import { CompareLabel } from "@/components/app/compare";
import { GuidesToggle } from "@/components/app/guides-toggle";
import { Demo } from "@/components/app/demo";
import { cn } from "@/lib/utils";

const TASKS = [
  { title: "Review pull request #482", done: true },
  { title: "Update onboarding copy", done: true },
  { title: "Fix focus ring on the date picker", done: false },
  { title: "Write release notes for 2.4", done: false },
  { title: "Reply to the design review thread", done: false },
  { title: "Migrate icons to the new set", done: false },
  { title: "Check contrast on the dark theme", done: false },
  { title: "Prepare the roadmap for Q4", done: false },
  { title: "Book the offsite venue", done: false },
  { title: "Archive the old marketing site", done: false },
] as const;

// Depth of the fade, and how far you scroll before an edge fully appears.
const FADE_REM = 2.5;
const REVEAL_REM = 3;
const FADE = `${FADE_REM}rem`;
const REVEAL = `${REVEAL_REM}rem`;

// A fully opaque mask layer, used for the pane that gets no fade.
const SOLID = "linear-gradient(black, black)";

function fadeGradient(axis: "y" | "x", start: string, end: string) {
  const direction = axis === "y" ? "to bottom" : "to right";
  return `linear-gradient(${direction}, transparent, black ${start}, black calc(100% - ${end}), transparent)`;
}

/*
 * Both panes of a comparison live inside ONE scroll container, laid over two
 * card backgrounds. One scroller means one scroll position, one scrollbar and
 * one rubber-band bounce, so the panes never drift apart. Two mask layers,
 * each sized to a pane, give each side its own edge treatment.
 */
function PairedScroller({
  axis,
  panes,
  scrollRef,
  onScroll,
  style,
  className,
  overlay,
  children,
}: {
  axis: "y" | "x";
  /** Mask layer for each pane, in order. */
  panes: [string, string];
  scrollRef?: (node: HTMLDivElement | null) => void;
  onScroll?: (node: HTMLDivElement) => void;
  style?: CSSProperties;
  className?: string;
  /** Drawn above the scroller, outside the mask. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  const vertical = axis === "y";
  const paneSize = vertical
    ? "calc(50% - var(--pair-gap) / 2) 100%"
    : "100% calc(50% - var(--pair-gap) / 2)";

  return (
    <div
      className={cn(
        "relative w-full [--pair-gap:0.75rem] sm:[--pair-gap:2.5rem]",
        className
      )}
    >
      {/* Card chrome sits behind the scroller so the content can bounce
          past it, exactly as it would inside a single card. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 grid gap-(--pair-gap)",
          vertical ? "grid-cols-2" : "grid-rows-2"
        )}
      >
        {[0, 1].map((pane) => (
          <div
            key={pane}
            className={cn(
              "bg-card shadow-(--custom-shadow)",
              vertical ? "rounded-xl" : "rounded-full"
            )}
          />
        ))}
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-hidden relative grid gap-(--pair-gap) overscroll-contain",
          vertical
            ? "h-44 grid-cols-2 overflow-y-auto"
            : "grid-rows-2 overflow-x-auto"
        )}
        onScroll={
          onScroll ? (event) => onScroll(event.currentTarget) : undefined
        }
        style={{
          maskImage: `${panes[0]}, ${panes[1]}`,
          maskSize: paneSize,
          maskPosition: vertical ? "left, right" : "top, bottom",
          maskRepeat: "no-repeat",
          ...style,
        }}
      >
        {children}
      </div>
      {overlay}
    </div>
  );
}

function TaskList() {
  return (
    <ul className="divide-y divide-[#E7E7E7] dark:divide-[#1E1E1E]">
      {TASKS.map((task) => (
        <li
          key={task.title}
          className="flex items-center gap-2 px-3 py-2 text-xs text-foreground first:pt-2.5 last:pb-2.5"
        >
          {task.done ? (
            <CheckCircleIcon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-emerald-500"
              weight="fill"
            />
          ) : (
            <CircleIcon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-muted-foreground/60"
              weight="regular"
            />
          )}
          <span
            className={cn(
              "truncate",
              task.done && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Labels({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-3 sm:gap-10 *:justify-center",
        className
      )}
    >
      <CompareLabel verdict="wrong" />
      <CompareLabel verdict="right" />
    </div>
  );
}

/* Hard edge versus a fade on each edge that can still scroll. */

export function ScrollFadesDemo() {
  const { measure, style } = useEdgeFade("y");

  return (
    <Demo className="gap-6 px-4 sm:px-8">
      <EdgeFadeKeyframes />
      <div className="flex w-full max-w-lg flex-col gap-6">
        <Labels />
        <PairedScroller
          axis="y"
          panes={[
            SOLID,
            fadeGradient("y", "var(--fade-start)", "var(--fade-end)"),
          ]}
          onScroll={measure}
          scrollRef={measure}
          style={style}
        >
          <TaskList />
          <TaskList />
        </PairedScroller>
      </div>
    </Demo>
  );
}

/*
 * Edge aware: the fade only appears on the side that can still scroll.
 *
 * The two fade depths are registered custom properties. Where the browser
 * supports scroll-driven animations the depths are animated by the scroll
 * position itself, with no listener. Elsewhere a scroll listener sets them
 * and a transition smooths the change.
 */

const FADE_PROPERTIES = ["--fade-start", "--fade-end"] as const;

function useRegisterFadeProperties() {
  useEffect(() => {
    if (typeof CSS === "undefined" || !("registerProperty" in CSS)) return;
    for (const name of FADE_PROPERTIES) {
      try {
        CSS.registerProperty({
          name,
          syntax: "<length>",
          inherits: false,
          initialValue: "0px",
        });
      } catch {
        // Already registered by another instance of this demo.
      }
    }
  }, []);
}

function useScrollTimelineSupport() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")
    );
  }, []);
  return supported;
}

function EdgeFadeKeyframes() {
  return (
    <style>{`
      @keyframes craft-fade-start {
        from { --fade-start: 0px; }
        to { --fade-start: ${FADE}; }
      }
      @keyframes craft-fade-end {
        from { --fade-end: ${FADE}; }
        to { --fade-end: 0px; }
      }
    `}</style>
  );
}

function remToPx(rem: number) {
  const root = Number.parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );
  return rem * (root || 16);
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/*
 * With `trackDepth`, also mirrors the fade depths in JS so the guides can
 * draw them. Where the timeline drives the mask this repeats its math: each
 * depth grows linearly over the REVEAL distance from its edge.
 */
function useEdgeFade(axis: "y" | "x", { trackDepth = false } = {}) {
  useRegisterFadeProperties();
  const timeline = useScrollTimelineSupport();
  const [edges, setEdges] = useState({ start: false, end: true });
  const [depth, setDepth] = useState({ start: 0, end: 0 });

  const measure = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      const position = axis === "y" ? node.scrollTop : node.scrollLeft;
      const size = axis === "y" ? node.clientHeight : node.clientWidth;
      const total = axis === "y" ? node.scrollHeight : node.scrollWidth;

      if (timeline) {
        if (!trackDepth) return;
        const max = total - size;
        const reveal = remToPx(REVEAL_REM);
        const fade = remToPx(FADE_REM);
        const next =
          max > 0
            ? {
                start: clamp01(position / reveal) * fade,
                end: clamp01((max - position) / reveal) * fade,
              }
            : { start: 0, end: 0 };
        setDepth((current) =>
          current.start === next.start && current.end === next.end
            ? current
            : next
        );
        return;
      }

      // A pixel of tolerance: these values round differently on zoomed pages.
      const next = {
        start: position > 1,
        end: position + size < total - 1,
      };
      setEdges((current) =>
        current.start === next.start && current.end === next.end
          ? current
          : next
      );
    },
    [axis, timeline, trackDepth]
  );

  const style: CSSProperties = timeline
    ? {
        animation:
          "craft-fade-start 1ms linear both, craft-fade-end 1ms linear both",
        animationTimeline: `scroll(self ${axis}), scroll(self ${axis})`,
        animationRange: `0 ${REVEAL}, calc(100% - ${REVEAL}) 100%`,
      }
    : ({
        "--fade-start": edges.start ? FADE : "0px",
        "--fade-end": edges.end ? FADE : "0px",
        transition: "--fade-start 200ms ease-out, --fade-end 200ms ease-out",
      } as CSSProperties);

  // The same depths as lengths, plus the transition the mask uses.
  const guide = timeline
    ? {
        start: `${depth.start}px`,
        end: `${depth.end}px`,
        // Already follows the scroll frame by frame.
        animated: false,
      }
    : {
        start: edges.start ? FADE : "0px",
        end: edges.end ? FADE : "0px",
        animated: true,
      };

  return { measure, style, guide };
}

/*
 * Paints each pane's fade zones in the guides' sky tint: strongest at the
 * edge, where the mask hides the most, and clear where the content is fully
 * visible. A dashed line marks where the fade ends.
 */
function FadeGuides({
  axis,
  visible,
  panes,
  animated,
}: {
  axis: "y" | "x";
  visible: boolean;
  panes: [{ start: string; end: string }, { start: string; end: string }];
  animated: boolean;
}) {
  const vertical = axis === "y";
  const size = vertical ? "height" : "width";
  const transition = animated
    ? `${size} 200ms ease-out, opacity 200ms ease-out`
    : "opacity 200ms ease-out";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 grid gap-(--pair-gap) transition-opacity duration-300 ease-out motion-reduce:transition-none",
        vertical ? "grid-cols-2" : "grid-rows-2",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {panes.map((pane, index) => (
        <div
          key={index}
          className={cn(
            "relative overflow-hidden",
            vertical ? "rounded-xl" : "rounded-full"
          )}
        >
          {(["start", "end"] as const).map((edge) => (
            <div
              key={edge}
              className={cn(
                "absolute border-dashed border-sky-300 from-sky-500/25 to-sky-500/0 dark:border-sky-900 dark:from-sky-400/20 dark:to-sky-400/0 motion-reduce:transition-none",
                vertical
                  ? edge === "start"
                    ? "inset-x-0 top-0 border-b bg-linear-to-b"
                    : "inset-x-0 bottom-0 border-t bg-linear-to-t"
                  : edge === "start"
                    ? "inset-y-0 left-0 border-r bg-linear-to-r"
                    : "inset-y-0 right-0 border-l bg-linear-to-l"
              )}
              style={{
                [size]: pane[edge],
                opacity: Number.parseFloat(pane[edge]) > 0 ? 1 : 0,
                transition,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ScrollFadesEdgeDemo() {
  const [guides, setGuides] = useState(false);
  const { measure, style, guide } = useEdgeFade("y", { trackDepth: true });

  return (
    <Demo className="gap-6 px-4 sm:px-8">
      <EdgeFadeKeyframes />
      <GuidesToggle pressed={guides} onPressedChange={setGuides} />
      <div className="flex w-full max-w-lg flex-col gap-6">
        <Labels />
        <PairedScroller
          axis="y"
          panes={[
            fadeGradient("y", FADE, FADE),
            fadeGradient("y", "var(--fade-start)", "var(--fade-end)"),
          ]}
          overlay={
            <FadeGuides
              axis="y"
              animated={guide.animated}
              panes={[{ start: FADE, end: FADE }, guide]}
              visible={guides}
            />
          }
          onScroll={measure}
          scrollRef={measure}
          style={style}
        >
          <TaskList />
          <TaskList />
        </PairedScroller>
      </div>
    </Demo>
  );
}

/* Horizontal: a row of filter chips. */

const TOPICS: { label: string; icon: Icon }[] = [
  { label: "All", icon: SquaresFourIcon },
  { label: "Design", icon: PenNibIcon },
  { label: "Engineering", icon: TerminalWindowIcon },
  { label: "Product", icon: CubeIcon },
  { label: "Marketing", icon: MegaphoneIcon },
  { label: "Research", icon: FlaskIcon },
  { label: "Support", icon: LifebuoyIcon },
  { label: "Finance", icon: CurrencyDollarIcon },
  { label: "Legal", icon: ScalesIcon },
  { label: "People", icon: UsersIcon },
];

function ChipRow({
  active,
  onChange,
}: {
  active: string;
  onChange: (topic: string) => void;
}) {
  return (
    <div className="flex w-max gap-1.5 p-2 px-2.5">
      {TOPICS.map(({ label, icon: TopicIcon }) => (
        <button
          key={label}
          aria-pressed={active === label}
          className={cn(
            "flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full pr-3 pl-2.5 text-xs font-medium whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
            active === label
              ? "bg-primary/90 text-primary-foreground"
              : "bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
          )}
          onClick={() => onChange(label)}
          type="button"
        >
          <TopicIcon
            aria-hidden="true"
            className="size-3.5 shrink-0"
            weight="duotone"
          />
          {label}
        </button>
      ))}
    </div>
  );
}

export function ScrollFadesHorizontalDemo() {
  const [guides, setGuides] = useState(false);
  const { measure, style, guide } = useEdgeFade("x", { trackDepth: true });
  const [active, setActive] = useState<string>("All");

  return (
    <Demo className="gap-6 px-4 sm:px-8">
      <EdgeFadeKeyframes />
      <GuidesToggle pressed={guides} onPressedChange={setGuides} />
      <div className="flex w-full max-w-md gap-3">
        <div className="grid shrink-0 grid-rows-2 gap-(--pair-gap) [--pair-gap:0.75rem] sm:[--pair-gap:2.5rem] *:self-center">
          <CompareLabel verdict="wrong" />
          <CompareLabel verdict="right" />
        </div>
        <PairedScroller
          axis="x"
          className="min-w-0 flex-1"
          panes={[
            SOLID,
            fadeGradient("x", "var(--fade-start)", "var(--fade-end)"),
          ]}
          overlay={
            <FadeGuides
              axis="x"
              animated={guide.animated}
              panes={[{ start: "0px", end: "0px" }, guide]}
              visible={guides}
            />
          }
          onScroll={measure}
          scrollRef={measure}
          style={style}
        >
          <ChipRow active={active} onChange={setActive} />
          <ChipRow active={active} onChange={setActive} />
        </PairedScroller>
      </div>
    </Demo>
  );
}
