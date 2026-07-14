import {
  IconDeviceSpeakerFilled,
  IconLayoutSidebarFilled,
  IconPaletteFilled,
  IconQuoteFilled,
  IconSparklesFilled,
  type IconProps,
} from "@tabler/icons-react";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: IconQuoteFilled,
  Color: IconPaletteFilled,
  Layout: IconLayoutSidebarFilled,
  Motion: IconSparklesFilled,
  Sound: IconDeviceSpeakerFilled,
} as const;

export function SectionIcon({
  section,
  ...props
}: { section: Section } & IconProps) {
  const Icon = icons[section];
  return <Icon {...props} />;
}
