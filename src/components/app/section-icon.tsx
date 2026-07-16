import type { IconProps } from "@phosphor-icons/react";
import {
  BezierCurveIcon,
  ChartBarHorizontalIcon,
  CirclesThreeIcon,
  LayoutIcon,
  PenNibIcon,
  SpeakerHighIcon,
  TextAaIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Section } from "@/lib/sections";
import { cn } from "@/lib/utils";

const icons = {
  Typography: TextAaIcon,
  Color: CirclesThreeIcon,
  Layout: LayoutIcon,
  Motion: BezierCurveIcon,
  Sound: SpeakerHighIcon,
  Data: ChartBarHorizontalIcon,
  Craft: PenNibIcon,
} as const;

// Muted enough to sit in a grayscale UI; the duotone fill layer
// (currentColor at reduced opacity) softens them further.
const colors: Record<Section, string> = {
  Typography: "text-blue-600 dark:text-blue-400",
  Color: "text-rose-600 dark:text-rose-400",
  Layout: "text-amber-600 dark:text-amber-400",
  Motion: "text-violet-600 dark:text-violet-400",
  Sound: "text-emerald-600 dark:text-emerald-400",
  Data: "text-cyan-600 dark:text-cyan-400",
  Craft: "text-orange-600 dark:text-orange-400",
};

// Background equivalents of the icon colors, for the nav's active dot.
export const sectionDotColors: Record<Section, string> = {
  Typography: "bg-blue-600 dark:bg-blue-400",
  Color: "bg-rose-600 dark:bg-rose-400",
  Layout: "bg-amber-600 dark:bg-amber-400",
  Motion: "bg-violet-600 dark:bg-violet-400",
  Sound: "bg-emerald-600 dark:bg-emerald-400",
  Data: "bg-cyan-600 dark:bg-cyan-400",
  Craft: "bg-orange-600 dark:bg-orange-400",
};

export function SectionIcon({
  section,
  className,
  ...props
}: { section: Section; className?: string } & IconProps) {
  const Icon = icons[section];
  return (
    <Icon
      weight="duotone"
      className={cn(colors[section], className)}
      {...props}
    />
  );
}
