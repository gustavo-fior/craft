"use client";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { playSoundAlways, SOUND_NAMES, type SoundName } from "@/lib/sounds";

const LABELS: Record<SoundName, string> = {
  tick: "Tick - navigation",
  pop: "Pop - open / dismiss",
  success: "Success - link copied",
  toggle: "Toggle - switches",
  hover: "Hover - nav links",
};

export function InterfaceSfxDemo() {
  return (
    <Demo>
      <div className="grid w-full max-w-96 grid-cols-2 gap-2">
        {SOUND_NAMES.map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="justify-start font-mono text-xs"
            onClick={() => playSoundAlways(name)}
          >
            {LABELS[name]}
          </Button>
        ))}
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        These are the sounds this site uses - from the Minimal and Retro
        patches, synthesized on the fly. No audio files.
      </p>
    </Demo>
  );
}
