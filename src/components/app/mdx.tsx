import { MDXContent } from "@content-collections/mdx/react";
import type { MDXComponents } from "mdx/types";

import { Demo } from "@/components/app/demo";
import { ButtonPressDemo } from "@/components/demos/button-press";
import { ClipPathDemo } from "@/components/demos/clip-path";
import { CurveSmoothingDemo } from "@/components/demos/curve-smoothing";
import { EasingsDemo } from "@/components/demos/easings";
import { ExitAnimationsDemo } from "@/components/demos/exit-animations";
import { FontSmoothingDemo } from "@/components/demos/font-smoothing";
import { HitAreasDemo } from "@/components/demos/hit-areas";
import { HoverRestraintDemo } from "@/components/demos/hover-restraint";
import { HtmlBackgroundDemo } from "@/components/demos/html-background";
import { IconMorphDemo } from "@/components/demos/icon-morph";
import { IconWeightsDemo } from "@/components/demos/icon-weights";
import { ImageOutlineDemo } from "@/components/demos/image-outline";
import { InterfaceSfxDemo } from "@/components/demos/interface-sfx";
import { InterruptibilityDemo } from "@/components/demos/interruptibility";
import { LayeringSoundsDemo } from "@/components/demos/layering-sounds";
import { LetterSpacingDemo } from "@/components/demos/letter-spacing";
import { LivingChartsDemo } from "@/components/demos/living-charts";
import { NestedRadiusDemo } from "@/components/demos/nested-radius";
import { NoiseDemo } from "@/components/demos/noise";
import { OklchDemo } from "@/components/demos/oklch";
import { OpticalAlignmentDemo } from "@/components/demos/optical-alignment";
import { PerceivedPerformanceDemo } from "@/components/demos/perceived-performance";
import { ScaleEntrancesDemo } from "@/components/demos/scale-entrances";
import { ScrollFadesDemo } from "@/components/demos/scroll-fades";
import { ShadowsNotBordersDemo } from "@/components/demos/shadows-not-borders";
import { SharedLayoutDemo } from "@/components/demos/shared-layout";
import { StaggerDemo } from "@/components/demos/stagger";
import { TabularNumsDemo } from "@/components/demos/tabular-nums";
import { TextWrappingDemo } from "@/components/demos/text-wrapping";
import { cn } from "@/lib/utils";

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-10 mb-4 text-base font-medium", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("mt-8 mb-3 text-sm font-medium", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "my-4 text-sm leading-relaxed text-pretty text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground",
        className,
      )}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl border bg-card p-4 text-xs leading-relaxed [&>code]:bg-transparent [&>code]:p-0",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 pl-4 text-sm text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10", className)} {...props} />
  ),
  Demo,
  LetterSpacingDemo,
  TextWrappingDemo,
  OklchDemo,
  NestedRadiusDemo,
  IconMorphDemo,
  InterfaceSfxDemo,
  TabularNumsDemo,
  OpticalAlignmentDemo,
  IconWeightsDemo,
  NoiseDemo,
  ShadowsNotBordersDemo,
  ImageOutlineDemo,
  HtmlBackgroundDemo,
  HitAreasDemo,
  ButtonPressDemo,
  EasingsDemo,
  StaggerDemo,
  InterruptibilityDemo,
  HoverRestraintDemo,
  LayeringSoundsDemo,
  LivingChartsDemo,
  PerceivedPerformanceDemo,
  SharedLayoutDemo,
  ExitAnimationsDemo,
  ScaleEntrancesDemo,
  ClipPathDemo,
  ScrollFadesDemo,
  FontSmoothingDemo,
  CurveSmoothingDemo,
};

export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
