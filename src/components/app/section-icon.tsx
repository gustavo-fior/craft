import {
  IconLayout,
  IconPalette,
  IconSparkles,
  IconTypography,
  IconVolume,
  type IconProps,
} from "@tabler/icons-react";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: IconTypography,
  Color: IconPalette,
  Layout: IconLayout,
  Motion: IconSparkles,
  Sound: IconVolume,
} as const;

export function SectionIcon({
  section,
  ...props
}: { section: Section } & IconProps) {
  const Icon = icons[section];
  return <Icon {...props} />;
}
