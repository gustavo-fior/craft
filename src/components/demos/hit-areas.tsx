"use client";

import {
  DotsThreeIcon,
  PencilSimpleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { playSound } from "@/lib/sounds";
import { Switch } from "@/components/ui/switch";

const ICONS = [PencilSimpleIcon, DotsThreeIcon, XIcon];

export function HitAreasDemo() {
  const [show, setShow] = useState(false);

  return (
    <Demo>
      <div className="flex items-center gap-6">
        {ICONS.map((Icon, i) => (
          <button
            key={i}
            type="button"
            onClick={() => playSound("tick")}
            className="relative rounded-md text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* The visible glyph is 16px; the real target is 40px. */}
            <span
              className={`absolute -inset-3 rounded-lg ${
                show ? "bg-rose-500/15 outline outline-rose-500/40" : ""
              }`}
            />
            <Icon weight="duotone" className="size-4" />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          show hit areas
        </span>
        <Switch checked={show} onCheckedChange={setShow} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        These 16px icons carry 40px hit areas — click around the glyphs and
        they still respond. Fitts&apos;s Law: bigger targets are faster to hit.
      </p>
    </Demo>
  );
}
