import type { IconProps } from "@phosphor-icons/react";
import {
  BezierCurveIcon,
  CirclesThreeIcon,
  LayoutIcon,
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
} as const;

// Muted enough to sit in a grayscale UI; the duotone fill layer
// (currentColor at reduced opacity) softens them further.
const colors: Record<Section, string> = {
  Typography: "text-blue-600 dark:text-blue-400",
  Color: "text-rose-600 dark:text-rose-400",
  Layout: "text-amber-600 dark:text-amber-400",
  Motion: "text-violet-600 dark:text-violet-400",
  Sound: "text-emerald-600 dark:text-emerald-400",
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
