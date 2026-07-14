import type { IconProps } from "@phosphor-icons/react";
import {
  LayoutIcon,
  PaletteIcon,
  SpeakerHighIcon,
  TextTIcon,
  WindIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: TextTIcon,
  Color: PaletteIcon,
  Layout: LayoutIcon,
  Motion: WindIcon,
  Sound: SpeakerHighIcon,
} as const;

export function SectionIcon({
  section,
  ...props
}: { section: Section } & IconProps) {
  const Icon = icons[section];
  return <Icon weight="duotone" {...props} />;
}
