"use client";

import { ensureReady } from "@web-kits/audio";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { sounds, type SoundName } from "@/lib/sounds";

const LABELS: Record<SoundName, string> = {
  tick: "Tick — navigation",
  pop: "Pop — open / dismiss",
  confirm: "Confirm — success",
  toggle: "Toggle — switches",
};

export function InterfaceSfxDemo() {
  const play = async (name: SoundName) => {
    // Intentionally ignores the site mute toggle: pressing a "play sound"
    // button is explicit consent to hear it.
    await ensureReady();
    sounds[name]();
  };

  return (
    <Demo>
      <div className="grid w-full max-w-96 grid-cols-2 gap-2">
        {(Object.keys(sounds) as SoundName[]).map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="justify-start font-mono text-xs"
            onClick={() => play(name)}
          >
            {LABELS[name]}
          </Button>
        ))}
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        These are the sounds this site uses, synthesized on the fly — no audio
        files.
      </p>
    </Demo>
  );
}
