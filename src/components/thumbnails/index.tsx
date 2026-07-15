import {
  CheckCircleIcon,
  CopyIcon,
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

const thumbnails: Record<string, () => React.ReactNode> = {
  "letter-spacing": LetterSpacingThumbnail,
  "text-wrapping": TextWrappingThumbnail,
  oklch: OklchThumbnail,
  "nested-border-radius": NestedRadiusThumbnail,
  "icon-morph": IconMorphThumbnail,
  "interface-sfx": InterfaceSfxThumbnail,
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
