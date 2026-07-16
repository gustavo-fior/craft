"use client";

import type { IconWeight } from "@phosphor-icons/react";
import {
  BellIcon,
  ChatCircleIcon,
  FolderIcon,
  HeartIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  StarIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const WEIGHTS: IconWeight[] = ["thin", "light", "regular", "bold", "fill", "duotone"];
const ICONS = [
  HouseIcon,
  MagnifyingGlassIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
  ChatCircleIcon,
  FolderIcon,
  TrashIcon,
];

export function IconWeightsDemo() {
  const [weight, setWeight] = useState<IconWeight>("duotone");

  return (
    <Demo>
      <div className="grid grid-cols-4 gap-4">
        {ICONS.map((Icon, i) => (
          <div
            key={i}
            className="flex size-12 items-center justify-center rounded-xl border bg-card"
          >
            <Icon weight={weight} className="size-5 text-foreground" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {WEIGHTS.map((w) => (
          <Button
            key={w}
            variant={w === weight ? "secondary" : "ghost"}
            size="sm"
            className="font-mono text-xs"
            onClick={() => setWeight(w)}
          >
            {w}
          </Button>
        ))}
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        One consistent weight across the whole product matters more than which
        weight you pick. This site uses duotone everywhere.
      </p>
    </Demo>
  );
}
