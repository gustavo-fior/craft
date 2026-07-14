import type { IconProps } from "@phosphor-icons/react";
import {
  BezierCurveIcon,
  LayoutIcon,
  SpeakerHighIcon,
  SwatchesIcon,
  TextAUnderlineIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: TextAUnderlineIcon,
  Color: SwatchesIcon,
  Layout: LayoutIcon,
  Motion: BezierCurveIcon,
  Sound: SpeakerHighIcon,
} as const;

export function SectionIcon({
  section,
  ...props
}: { section: Section } & IconProps) {
  const Icon = icons[section];
  return <Icon weight="duotone" {...props} />;
}
