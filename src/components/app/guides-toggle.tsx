"use client";

import { CrosshairSimpleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

// A designer's tool rather than a settings row: a crosshair pill that takes
// the guides' own sky tint while they're showing.
export function GuidesToggle({
  pressed,
  onPressedChange,
  className,
}: {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={pressed}
      onClick={() => {
        playSound("toggle");
        onPressedChange(!pressed);
      }}
      className={cn(
        "border-dashed border",
        pressed
          ? "bg-sky-500/10 text-sky-600 hover:bg-sky-500/15 hover:text-sky-600 dark:bg-sky-400/10 dark:text-sky-400 dark:border-sky-900 border-sky-300 dark:hover:bg-sky-400/15 dark:hover:text-sky-400"
          : "text-muted-foreground hover:border-foreground/20",
        className
      )}
    >
      <CrosshairSimpleIcon className={cn("size-3.25")} weight="bold" />
      Guides
    </Button>
  );
}
