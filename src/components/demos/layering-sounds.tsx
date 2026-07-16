"use client";

import { definePatch, ensureReady } from "@web-kits/audio";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { playSoundAlways } from "@/lib/sounds";

// The success arpeggio, split into its individual layers so each
// note can be heard on its own. C5 → E5 → G5 → C6.
const NOTES = [
  { name: "C5", frequency: 523, gain: 0.06 },
  { name: "E5", frequency: 659, gain: 0.05 },
  { name: "G5", frequency: 784, gain: 0.045 },
  { name: "C6", frequency: 1047, gain: 0.04 },
] as const;

const notes = definePatch({
  name: "Success layers",
  sounds: Object.fromEntries(
    NOTES.map(({ name, frequency, gain }) => [
      name,
      {
        source: { type: "square", frequency },
        envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 },
        gain,
      },
    ]),
  ),
});

async function playNote(name: string) {
  try {
    await ensureReady();
    notes.play(name);
  } catch {
    // Audio unavailable before a user gesture - stay silent.
  }
}

export function LayeringSoundsDemo() {
  return (
    <Demo>
      <div className="flex items-center gap-2">
        {NOTES.map(({ name }) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            className="font-mono text-xs"
            onClick={() => playNote(name)}
          >
            {name}
          </Button>
        ))}
        <span className="px-1 font-mono text-xs text-muted-foreground">=</span>
        <Button
          variant="secondary"
          size="sm"
          className="font-mono text-xs"
          onClick={() => playSoundAlways("success")}
        >
          success
        </Button>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Four square-wave notes, each delayed 60ms after the last and slightly
        quieter - a tiny arpeggio instead of a beep. This is the sound this
        site plays when you copy a link.
      </p>
    </Demo>
  );
}
