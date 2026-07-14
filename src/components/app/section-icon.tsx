import type { IconProps } from "@phosphor-icons/react";
import {
  BezierCurveIcon,
  CirclesThreeIcon,
  LayoutIcon,
  SpeakerHighIcon,
  TextAaIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Section } from "@/lib/sections";

const icons = {
  Typography: TextAaIcon,
  Color: CirclesThreeIcon,
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
