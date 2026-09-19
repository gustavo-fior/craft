"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import beach from "@/assets/claude-monet-beach-sainte-adresse.jpg";
import cliffWalk from "@/assets/claude-monet-cliff-walk-pourville.jpg";
import regatta from "@/assets/claude-monet-regatta-sainte-adresse.jpg";
import clouds from "@/assets/cumulus-clouds.jpg";
import lime from "@/assets/gradient-lime.jpg";
import mint from "@/assets/gradient-mint.jpg";
import peach from "@/assets/gradient-peach.jpg";
import reeded from "@/assets/gradient-reeded.jpg";
import gustavo from "@/assets/gustavo.jpg";
import { RIGHT_ICON, WRONG_ICON } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { useDemoText } from "@/components/app/demo-messages";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type EdgeMode = "none" | "outline";

const EDGE_OPTIONS = [
  { value: "none", label: "No outline", icon: WRONG_ICON },
  { value: "outline", label: "Outline", icon: RIGHT_ICON },
] as const;

function getSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * An image with a 1px line painted over its outermost pixels. Black in light
 * mode, white in dark mode; `--edge` carries the RGB triplet per theme.
 *
 * The line lives on its own overlay rather than on the wrapper: Chrome
 * paints positioned children (next/image with `fill`) over the parent's
 * outline, so an outline on the wrapper would vanish under the photo. A
 * plain <img> has no such children, which is why the article's CSS works
 * as written.
 */
function Picture({
  src,
  opacity,
  sizes,
  quality,
  className,
}: {
  src: StaticImageData;
  opacity: number;
  sizes: string;
  quality?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative block overflow-hidden", className)}
    >
      <Image
        alt=""
        className="object-cover object-top"
        fill
        placeholder="blur"
        quality={quality}
        sizes={sizes}
        src={src}
      />
      <Edge opacity={opacity} />
    </span>
  );
}

function Edge({ opacity }: { opacity: number }) {
  return (
    <span
      className="pointer-events-none absolute inset-0 rounded-[inherit] [--edge:0_0_0] dark:[--edge:255_255_255] transition-[outline-color] duration-200 ease-out motion-reduce:transition-none"
      style={{
        outline: `1px solid rgb(var(--edge) / ${opacity})`,
        outlineOffset: -1,
      }}
    />
  );
}

// The classic fallback avatar: a letter on a pale fill that is almost the
// same color as the card, so without the edge the circle has no boundary.
function Initials({ label, opacity }: { label: string; opacity: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative grid size-10 place-items-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
    >
      {label}
      <Edge opacity={opacity} />
    </span>
  );
}

// Paintings with pale skies along the top edge, so the bleed into a light
// card is obvious before the outline goes on.
const TILES = [beach, cliffWalk, clouds];

export function ImageOutlineDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<EdgeMode>("none");
  const opacity = mode === "outline" ? 0.1 : 0;

  return (
    <Demo className="gap-8 sm:px-0">
      <div className="grid w-full max-w-lg grid-cols-3 gap-6 rounded-[24px] bg-muted p-4 shadow-(--custom-shadow)">
        {TILES.map((src) => (
          <Picture
            key={src.src}
            className="aspect-square rounded-lg"
            opacity={opacity}
            sizes="120px"
            src={src}
          />
        ))}
      </div>

      <SegmentedControl
        ariaLabel={t("Image edge")}
        onChange={setMode}
        options={EDGE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}

export function ImageOutlineStrengthDemo() {
  const t = useDemoText();
  const [percent, setPercent] = useState(10);

  return (
    <Demo className="gap-10 px-4 sm:px-8">
      <div className="w-full max-w-sm rounded-[20px] bg-card p-3 shadow-(--custom-shadow)">
        <Picture
          className="aspect-[3/2] rounded-lg"
          opacity={percent / 100}
          sizes="360px"
          src={regatta}
        />
      </div>

      <label className="grid w-full max-w-xs gap-2.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          {t("Opacity")}
          <span className="tabular-nums text-foreground">{percent}%</span>
        </span>
        <Slider
          aria-label={t("Outline opacity")}
          max={40}
          min={0}
          onValueChange={(value) => setPercent(getSliderValue(value))}
          step={1}
          value={[percent]}
        />
      </label>
    </Demo>
  );
}

// Soft gradients read as the generated placeholder avatars most apps ship.
// The pale ones (mint, lime, peach) are where the edge goes missing.
type Avatar =
  | { kind: "image"; src: StaticImageData }
  | { kind: "initials"; label: string };

const AVATARS: Avatar[] = [
  { kind: "image", src: mint },
  { kind: "image", src: gustavo },
  { kind: "image", src: peach },
  { kind: "initials", label: "G" },
  { kind: "image", src: reeded },
  { kind: "image", src: lime },
];

export function ImageOutlineAvatarDemo() {
  const t = useDemoText();
  const [mode, setMode] = useState<EdgeMode>("none");
  const opacity = mode === "outline" ? 0.1 : 0;

  return (
    <Demo className="gap-8 px-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl bg-card px-5 py-4 shadow-(--custom-shadow)">
        {AVATARS.map((avatar) =>
          avatar.kind === "initials" ? (
            <Initials
              key={avatar.label}
              label={avatar.label}
              opacity={opacity}
            />
          ) : (
            <Picture
              key={avatar.src.src}
              className="size-10 rounded-full"
              opacity={opacity}
              quality={90}
              sizes="80px"
              src={avatar.src}
            />
          )
        )}
      </div>

      <SegmentedControl
        ariaLabel={t("Avatar edge")}
        onChange={setMode}
        options={EDGE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={mode}
      />
    </Demo>
  );
}
