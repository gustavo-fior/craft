"use client";

import {
  CheckCircleIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import {
  type CSSProperties,
  type UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Compare, CompareItem, CompareLabel } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
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

const FADE = "2.5rem";

/* Keeps two scrollers at the same position so both edges can be compared. */
function useSyncedScroll() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const lock = useRef(false);

  const register = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      refs.current[index] = node;
    },
    []
  );

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (lock.current) return;
    lock.current = true;
    const source = event.currentTarget;
    for (const node of refs.current) {
      if (node && node !== source) {
        node.scrollTop = source.scrollTop;
        node.scrollLeft = source.scrollLeft;
      }
    }
    requestAnimationFrame(() => {
      lock.current = false;
    });
  }, []);

  return { register, onScroll };
}

function TaskList() {
  const t = useDemoText();
  return (
    <ul className="divide-y divide-[#E7E7E7] dark:divide-[#1E1E1E]">
      {TASKS.map((task) => (
        <li
          key={task.title}
          className="flex items-center gap-2 px-3 py-2 text-xs text-foreground"
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
          <span className={cn("truncate", task.done && "text-muted-foreground line-through")}>
            {t(task.title)}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Hard edge versus a static mask. */

export function ScrollFadesDemo() {
  const { register, onScroll } = useSyncedScroll();

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
            <div
              ref={register(0)}
              className="h-44 overflow-y-auto overscroll-contain"
              onScroll={onScroll}
            >
              <TaskList />
            </div>
          </div>
        </CompareItem>
        <CompareItem verdict="right">
          <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
            <div
              ref={register(1)}
              className="h-44 overflow-y-auto overscroll-contain"
              onScroll={onScroll}
              style={{
                maskImage: `linear-gradient(to bottom, transparent, black ${FADE}, black calc(100% - ${FADE}), transparent)`,
              }}
            >
              <TaskList />
            </div>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/* Edge aware: the fade only appears on the side that can still scroll. */

function useRegisterFadeProperties() {
  useEffect(() => {
    if (typeof CSS === "undefined" || !("registerProperty" in CSS)) return;
    for (const name of ["--fade-start", "--fade-end"]) {
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

function useEdgeState(axis: "y" | "x") {
  const [edges, setEdges] = useState({ start: false, end: true });

  const measure = useCallback(
    (node: HTMLElement) => {
      const position = axis === "y" ? node.scrollTop : node.scrollLeft;
      const size = axis === "y" ? node.clientHeight : node.clientWidth;
      const total = axis === "y" ? node.scrollHeight : node.scrollWidth;
      const next = {
        start: position > 1,
        end: position + size < total - 1,
      };
      setEdges((current) =>
        current.start === next.start && current.end === next.end ? current : next
      );
    },
    [axis]
  );

  const style = {
    "--fade-start": edges.start ? FADE : "0px",
    "--fade-end": edges.end ? FADE : "0px",
    maskImage:
      axis === "y"
        ? "linear-gradient(to bottom, transparent, black var(--fade-start), black calc(100% - var(--fade-end)), transparent)"
        : "linear-gradient(to right, transparent, black var(--fade-start), black calc(100% - var(--fade-end)), transparent)",
    transition: "--fade-start 200ms ease-out, --fade-end 200ms ease-out",
  } as CSSProperties;

  return { measure, style };
}

export function ScrollFadesEdgeDemo() {
  useRegisterFadeProperties();
  const { register, onScroll } = useSyncedScroll();
  const { measure, style } = useEdgeState("y");

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
            <div
              ref={register(0)}
              className="h-44 overflow-y-auto overscroll-contain"
              onScroll={onScroll}
              style={{
                maskImage: `linear-gradient(to bottom, transparent, black ${FADE}, black calc(100% - ${FADE}), transparent)`,
              }}
            >
              <TaskList />
            </div>
          </div>
        </CompareItem>
        <CompareItem verdict="right">
          <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
            <div
              ref={register(1)}
              className="h-44 overflow-y-auto overscroll-contain motion-reduce:transition-none"
              onScroll={(event) => {
                onScroll(event);
                measure(event.currentTarget);
              }}
              style={style}
            >
              <TaskList />
            </div>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}

/* Horizontal: a row of filter chips. */

const TOPICS = [
  "All",
  "Design",
  "Engineering",
  "Product",
  "Marketing",
  "Research",
  "Support",
  "Finance",
  "Legal",
  "People",
] as const;

function ChipRow({
  scrollRef,
  onScroll,
  style,
  className,
}: {
  scrollRef: (node: HTMLDivElement | null) => void;
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
  className?: string;
}) {
  const t = useDemoText();
  const [active, setActive] = useState<string>("All");

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex w-full gap-1.5 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      onScroll={onScroll}
      style={style}
    >
      {TOPICS.map((topic) => (
        <button
          key={topic}
          aria-pressed={active === topic}
          className={cn(
            "h-7 shrink-0 cursor-pointer rounded-full px-3 text-xs font-medium whitespace-nowrap outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
            active === topic
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActive(topic)}
          type="button"
        >
          {t(topic)}
        </button>
      ))}
    </div>
  );
}

export function ScrollFadesHorizontalDemo() {
  useRegisterFadeProperties();
  const { register, onScroll } = useSyncedScroll();
  const { measure, style } = useEdgeState("x");

  return (
    <Demo className="gap-6 px-4 sm:px-8">
      <div className="flex w-full max-w-md flex-col gap-2">
        <CompareLabel verdict="wrong" />
        <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
          <ChipRow onScroll={onScroll} scrollRef={register(0)} />
        </div>
      </div>
      <div className="flex w-full max-w-md flex-col gap-2">
        <CompareLabel verdict="right" />
        <div className="w-full rounded-xl bg-card shadow-(--custom-shadow)">
          <ChipRow
            className="motion-reduce:transition-none"
            onScroll={(event) => {
              onScroll(event);
              measure(event.currentTarget);
            }}
            scrollRef={register(1)}
            style={style}
          />
        </div>
      </div>
    </Demo>
  );
}
