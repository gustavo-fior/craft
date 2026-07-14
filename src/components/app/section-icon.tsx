import type { IconProps } from "@phosphor-icons/react";
import {
  LayoutIcon,
  LightningIcon,
  PaletteIcon,
  QuotesIcon,
  SpeakerHighIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: QuotesIcon,
  Color: PaletteIcon,
  Layout: LayoutIcon,
  Motion: LightningIcon,
  Sound: SpeakerHighIcon,
} as const;

export function SectionIcon({
  section,
  ...props
}: { section: Section } & IconProps) {
  const Icon = icons[section];
  return <Icon weight="duotone" {...props} />;
}
