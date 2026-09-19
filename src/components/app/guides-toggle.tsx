"use client";

import { CrosshairSimpleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { useDemoText } from "./demo-messages";

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
  const t = useDemoText();
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
        "transition-colors border-dashed border",
        pressed
          ? "bg-sky-500/10 text-sky-600 hover:bg-sky-500/15 hover:text-sky-600 dark:bg-sky-400/10 dark:text-sky-400 dark:border-sky-900 border-sky-300 dark:hover:bg-sky-400/15 dark:hover:text-sky-400"
          : "text-muted-foreground",
        className
      )}
    >
      <CrosshairSimpleIcon
        className={cn(
          "transition-transform duration-300 ease-out motion-reduce:transition-none size-3.25"
          // pressed ? "rotate-0" : "rotate-45"
        )}
        weight="bold"
      />
      {t("Guides")}
    </Button>
  );
}
