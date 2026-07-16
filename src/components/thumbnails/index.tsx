import {
  CheckCircleIcon,
  CopyIcon,
  HeartIcon,
  PlayIcon,
} from "@phosphor-icons/react/dist/ssr";

import { SectionIcon } from "@/components/app/section-icon";
import type { Section } from "@/lib/sections";

// Static-by-default thumbnails; each animates subtly on card hover (the
// index card is a `group`).

function LetterSpacingThumbnail() {
  return (
    <span className="text-3xl font-medium tracking-[0.12em] transition-[letter-spacing] duration-500 group-hover:tracking-[-0.03em]">
      Aa
    </span>
  );
}

function TextWrappingThumbnail() {
  return (
    <div className="flex w-28 flex-col items-start gap-1.5">
      <div className="h-1.5 w-full rounded-full bg-muted-foreground/25" />
      <div className="h-1.5 w-full rounded-full bg-muted-foreground/25 transition-all duration-500 group-hover:w-2/3" />
      <div className="h-1.5 w-1/5 rounded-full bg-muted-foreground/25 transition-all duration-500 group-hover:w-2/3" />
    </div>
  );
}

function OklchThumbnail() {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="size-5 rounded-md transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `oklch(0.72 0.14 ${20 + i * 70})`,
            transitionDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}

function NestedRadiusThumbnail() {
  return (
    <div className="rounded-[18px] border bg-muted p-2 transition-all duration-300 group-hover:rounded-[24px] group-hover:p-3.5">
      <div className="size-14 rounded-[10px] border bg-card" />
    </div>
  );
}

function IconMorphThumbnail() {
  return (
    <span className="relative inline-flex">
      <CopyIcon
        weight="duotone"
        className="size-8 text-foreground transition-all duration-300 group-hover:scale-50 group-hover:opacity-0 group-hover:blur-[4px]"
      />
      <CheckCircleIcon
        weight="duotone"
        className="absolute inset-0 size-8 scale-50 text-emerald-600 opacity-0 blur-[4px] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none dark:text-emerald-400"
      />
    </span>
  );
}

const BAR_HEIGHTS = [10, 22, 14, 30, 18, 26, 12];

function InterfaceSfxThumbnail() {
  return (
    <div className="flex items-center gap-1.5">
      {BAR_HEIGHTS.map((height, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full bg-muted-foreground/40 transition-transform duration-300 ${
            i % 2 === 0 ? "group-hover:scale-y-150" : "group-hover:scale-y-50"
          }`}
          style={{ height, transitionDelay: `${i * 30}ms` }}
        />
      ))}
    </div>
  );
}

function TabularNumsThumbnail() {
  return (
    <span className="font-mono text-2xl font-medium tabular-nums">
      <span className="text-muted-foreground/50">0</span>1:24
    </span>
  );
}

function OpticalAlignmentThumbnail() {
  return (
    <span className="flex size-14 items-center justify-center rounded-full border bg-muted">
      <PlayIcon
        weight="fill"
        className="size-5 transition-transform duration-300 group-hover:translate-x-[3px]"
      />
    </span>
  );
}

function IconsThumbnail() {
  return (
    <div className="flex items-center gap-3">
      <HeartIcon weight="thin" className="size-7" />
      <HeartIcon weight="regular" className="size-7" />
      <HeartIcon
        weight="duotone"
        className="size-7 transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
}

function NoiseThumbnail() {
  return (
    <div className="relative size-16 overflow-hidden rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500">
      <div
        className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function ShadowsNotBordersThumbnail() {
  return (
    <div className="size-14 rounded-xl bg-card shadow-[0_0_0_1px_var(--border)] transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.06),0_6px_12px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4),0_6px_12px_rgba(0,0,0,0.5)]" />
  );
}

function ImageOutlinesThumbnail() {
  return (
    <div className="size-14 rounded-xl bg-gradient-to-br from-amber-200 to-rose-300 outline-1 -outline-offset-1 outline-transparent transition-[outline-color] duration-300 group-hover:outline-black/10 dark:from-amber-300/70 dark:to-rose-400/70 dark:group-hover:outline-white/15" />
  );
}

function HitAreasThumbnail() {
  return (
    <span className="relative inline-flex items-center justify-center">
      <span className="absolute -inset-4 rounded-lg border border-dashed border-muted-foreground/0 transition-colors duration-300 group-hover:border-muted-foreground/40" />
      <HeartIcon weight="duotone" className="size-6" />
    </span>
  );
}

function HtmlBackgroundThumbnail() {
  return (
    <div className="flex h-20 w-24 flex-col overflow-hidden rounded-lg border bg-muted">
      <div className="h-4 shrink-0 border-b bg-card" />
      <div className="flex-1 bg-card transition-transform duration-300 group-hover:translate-y-3" />
    </div>
  );
}

function ButtonPressThumbnail() {
  return (
    <span className="rounded-lg border bg-card px-4 py-2 text-xs font-medium shadow-xs transition-transform duration-150 group-hover:scale-[0.94]">
      Press
    </span>
  );
}

function EasingsThumbnail() {
  return (
    <div className="flex w-24 flex-col gap-2.5">
      {["ease-out", "ease-in-out", "linear"].map((easing, i) => (
        <div key={i} className="flex w-full">
          <div
            className="size-3 rounded-full bg-muted-foreground/50 transition-transform duration-500 group-hover:translate-x-[84px]"
            style={{ transitionTimingFunction: easing }}
          />
        </div>
      ))}
    </div>
  );
}

function StaggerThumbnail() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {[16, 24, 20].map((width, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full bg-muted-foreground/25 transition-all duration-300 group-hover:translate-x-1.5 group-hover:bg-muted-foreground/50"
          style={{ width: width * 4, transitionDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

function InterruptibilityThumbnail() {
  return (
    <div className="flex w-24">
      <div className="size-6 rounded-lg bg-muted-foreground/40 transition-transform duration-500 ease-out group-hover:translate-x-[72px]" />
    </div>
  );
}

function HoverRestraintThumbnail() {
  return (
    <div className="flex flex-col items-start gap-1">
      {["Home", "About", "Contact"].map((label, i) => (
        <span
          key={label}
          className={`text-xs transition-colors duration-300 ${
            i === 1
              ? "text-muted-foreground group-hover:text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function LayeringSoundsThumbnail() {
  return (
    <div className="flex items-end gap-1.5">
      {[12, 18, 24, 32].map((height, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-muted-foreground/40 transition-all duration-300 group-hover:bg-muted-foreground/70"
          style={{
            height,
            transitionDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

function LivingChartsThumbnail() {
  return (
    <svg viewBox="0 0 96 40" className="h-10 w-24 overflow-visible">
      <path
        d="M0 30 C 12 30, 12 12, 24 12 S 36 26, 48 26 S 60 8, 72 8 S 84 22, 96 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-muted-foreground/60 transition-transform duration-500 group-hover:-translate-y-1"
      />
      <circle
        cx="96"
        cy="22"
        r="3"
        className="fill-current text-foreground transition-transform duration-500 group-hover:-translate-y-1"
      />
    </svg>
  );
}

function PerceivedPerformanceThumbnail() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="h-1.5 w-24 rounded-full bg-muted-foreground/25 opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
      <div className="h-1.5 w-16 rounded-full bg-muted-foreground/25 opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
      <div className="h-1.5 w-20 rounded-full bg-muted-foreground/25 opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
    </div>
  );
}

function ReferencesThumbnail() {
  return (
    <div className="flex items-center">
      <div className="size-10 -rotate-6 rounded-lg border bg-card shadow-xs transition-transform duration-300 group-hover:-rotate-12 group-hover:-translate-x-1" />
      <div className="z-10 size-10 rounded-lg border bg-muted shadow-xs" />
      <div className="size-10 rotate-6 rounded-lg border bg-card shadow-xs transition-transform duration-300 group-hover:rotate-12 group-hover:translate-x-1" />
    </div>
  );
}

function SharedLayoutThumbnail() {
  return (
    <div className="relative flex gap-1 rounded-lg border bg-muted p-1">
      <span className="absolute inset-y-1 left-1 w-9 rounded-md bg-card shadow-xs transition-transform duration-300 group-hover:translate-x-[80px]" />
      {[0, 1, 2].map((i) => (
        <span key={i} className="relative h-5 w-9 rounded-md" />
      ))}
    </div>
  );
}

function ExitAnimationsThumbnail() {
  return (
    <div className="rounded-lg border bg-card px-4 py-2 text-xs shadow-xs transition-all duration-300 group-hover:opacity-0 group-hover:blur-[3px]">
      Saved
    </div>
  );
}

function ScaleEntrancesThumbnail() {
  return (
    <div
      className="w-20 origin-top scale-95 rounded-lg border bg-card p-1.5 opacity-80 shadow-xs transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
    >
      {[12, 16, 10].map((w, i) => (
        <div
          key={i}
          className="my-1.5 h-1 rounded-full bg-muted-foreground/25"
          style={{ width: w * 4 }}
        />
      ))}
    </div>
  );
}

function ClipPathThumbnail() {
  return (
    <div className="relative h-14 w-20 overflow-hidden rounded-lg border bg-muted">
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-400 via-violet-400 to-rose-400 transition-[clip-path] duration-500"
        style={{ clipPath: "inset(0 55% 0 0)" }}
      />
      <div className="absolute inset-y-0 left-[45%] w-px bg-foreground/40 transition-transform duration-500 group-hover:translate-x-4" />
    </div>
  );
}

function ScrollFadesThumbnail() {
  return (
    <div
      className="flex flex-col gap-1.5"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
      }}
    >
      {[20, 24, 18, 22, 16].map((w, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full bg-muted-foreground/40 transition-transform duration-500 group-hover:-translate-y-1"
          style={{ width: w * 4 }}
        />
      ))}
    </div>
  );
}

function FontSmoothingThumbnail() {
  return (
    <span className="rounded-xl bg-neutral-900 px-5 py-3 text-2xl font-semibold text-white dark:border dark:bg-neutral-950 [-webkit-font-smoothing:auto] transition-all group-hover:[-webkit-font-smoothing:antialiased]">
      Aa
    </span>
  );
}

function CurveSmoothingThumbnail() {
  return (
    <svg viewBox="0 0 96 40" className="h-10 w-24 overflow-visible">
      <path
        d="M0 28 L 16 14 L 32 24 L 48 8 L 64 20 L 80 12 L 96 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/60 transition-opacity duration-300 group-hover:opacity-0"
      />
      <path
        d="M0 28 C 8 21, 10 14, 16 14 S 26 24, 32 24 S 42 8, 48 8 S 58 20, 64 20 S 74 12, 80 12 S 90 24, 96 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </svg>
  );
}

function TasteThumbnail() {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-lg border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-40">
        A
      </span>
      <span className="rounded-lg border bg-card px-3 py-1.5 text-xs shadow-xs transition-transform duration-300 group-hover:scale-110">
        B
      </span>
    </div>
  );
}

function TimelessnessThumbnail() {
  return (
    <span className="font-mono text-xl text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
      1957
    </span>
  );
}

function NoveltyBudgetThumbnail() {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={`size-2.5 rounded-full transition-transform duration-300 ${
            i === 8
              ? "bg-amber-500 group-hover:scale-125 dark:bg-amber-400"
              : "bg-muted-foreground/25"
          }`}
        />
      ))}
    </div>
  );
}

const thumbnails: Record<string, () => React.ReactNode> = {
  "letter-spacing": LetterSpacingThumbnail,
  "text-wrapping": TextWrappingThumbnail,
  oklch: OklchThumbnail,
  "nested-border-radius": NestedRadiusThumbnail,
  "icon-morph": IconMorphThumbnail,
  "interface-sfx": InterfaceSfxThumbnail,
  "tabular-numbers": TabularNumsThumbnail,
  "optical-alignment": OpticalAlignmentThumbnail,
  icons: IconsThumbnail,
  noise: NoiseThumbnail,
  "shadows-not-borders": ShadowsNotBordersThumbnail,
  "image-outlines": ImageOutlinesThumbnail,
  "hit-areas": HitAreasThumbnail,
  "html-background": HtmlBackgroundThumbnail,
  "button-press": ButtonPressThumbnail,
  easings: EasingsThumbnail,
  stagger: StaggerThumbnail,
  interruptibility: InterruptibilityThumbnail,
  "hover-restraint": HoverRestraintThumbnail,
  "layering-sounds": LayeringSoundsThumbnail,
  "living-charts": LivingChartsThumbnail,
  "performance-is-design": PerceivedPerformanceThumbnail,
  "how-to-get-references": ReferencesThumbnail,
  "novelty-budget": NoveltyBudgetThumbnail,
  "shared-layout": SharedLayoutThumbnail,
  "exit-animations": ExitAnimationsThumbnail,
  "scale-entrances": ScaleEntrancesThumbnail,
  "clip-path": ClipPathThumbnail,
  "scroll-fades": ScrollFadesThumbnail,
  "font-smoothing": FontSmoothingThumbnail,
  "curve-smoothing": CurveSmoothingThumbnail,
  "taste-is-trained": TasteThumbnail,
  timelessness: TimelessnessThumbnail,
};

export function ConceptThumbnail({
  slug,
  section,
}: {
  slug: string;
  section: Section;
}) {
  const Thumbnail = thumbnails[slug];
  if (Thumbnail) return <Thumbnail />;
  // Fallback for concepts without a bespoke thumbnail yet.
  return <SectionIcon section={section} className="size-8 opacity-60" />;
}
