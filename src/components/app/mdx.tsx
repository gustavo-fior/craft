import { MDXContent } from "@content-collections/mdx/react";
import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/app/code-block";
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
import {
  NestedRadiusDemo,
  NestedRadiusExamplesDemo,
  RadiusCalculatorDemo,
} from "@/components/demos/nested-radius";
import { NoiseDemo } from "@/components/demos/noise";
import { OklchDemo } from "@/components/demos/oklch";
import {
  HangingPunctuationDemo,
  OpticalAlignmentDemo,
  OpticalButtonDemo,
  OpticalSizingDemo,
} from "@/components/demos/optical-alignment";
import { PerceivedPerformanceDemo } from "@/components/demos/perceived-performance";
import { ScaleEntrancesDemo } from "@/components/demos/scale-entrances";
import { ScrollFadesDemo } from "@/components/demos/scroll-fades";
import { ShadowsNotBordersDemo } from "@/components/demos/shadows-not-borders";
import { SharedLayoutDemo } from "@/components/demos/shared-layout";
import { StaggerDemo } from "@/components/demos/stagger";
import {
  TabularNumsDemo,
  TabularTableDemo,
  TabularTimerDemo,
} from "@/components/demos/tabular-nums";
import { TextWrappingDemo } from "@/components/demos/text-wrapping";
import { cn } from "@/lib/utils";

function getFaviconUrl(href?: string) {
  if (!href) return;

  try {
    const url = new URL(href);

    if (url.protocol !== "http:" && url.protocol !== "https:") return;

    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=32`;
  } catch {
    return;
  }
}

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-10 mb-4 text-base font-medium", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-8 mb-3 text-sm font-medium", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "my-4 text-sm leading-[1.8] text-pretty text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, children, href, ...props }) => {
    const faviconUrl = getFaviconUrl(href);

    return (
      <a
        className={cn(
          "text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground",
          className,
        )}
        href={href}
        target={faviconUrl ? "_blank" : undefined}
        rel={faviconUrl ? "noreferrer" : undefined}
        {...props}
      >
        {faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            aria-hidden="true"
            alt=""
            className="mr-1 inline-block size-3.5 rounded-[3px] align-[-2px]"
            decoding="async"
            height={14}
            loading="lazy"
            src={faviconUrl}
            width={14}
          />
        ) : null}
        {children}
      </a>
    );
  },
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
        "rounded-[3px] bg-primary/7 shadow-(--custom-shadow) px-1 py-0.5 font-mono text-[0.8em] text-foreground mx-0.75",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl shadow-(--custom-shadow) bg-card p-4 text-xs leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:shadow-none",
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
  NestedRadiusExamplesDemo,
  RadiusCalculatorDemo,
  IconMorphDemo,
  InterfaceSfxDemo,
  TabularNumsDemo,
  TabularTimerDemo,
  TabularTableDemo,
  OpticalAlignmentDemo,
  OpticalButtonDemo,
  OpticalSizingDemo,
  HangingPunctuationDemo,
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
  CodeBlock,
};

export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
