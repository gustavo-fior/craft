"use client";

import { definePatch, ensureReady } from "@web-kits/audio";

// A subset of the "Minimal" patch by Raphael Salaja
// (audio.raphaelsalaja.com/library/minimal) — quiet sine-based UI feedback.
const minimal = definePatch({
  name: "Minimal",
  sounds: {
    hover: {
      source: { type: "sine", frequency: 1300 },
      envelope: { attack: 0, decay: 0.01, sustain: 0, release: 0.004 },
      gain: 0.04,
    },
    tick: {
      source: { type: "sine", frequency: 1200 },
      envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 },
      gain: 0.08,
    },
    pop: {
      source: { type: "sine", frequency: { start: 400, end: 200 } },
      envelope: { attack: 0, decay: 0.04, sustain: 0, release: 0.012 },
      gain: 0.1,
    },
    confirm: {
      layers: [
        {
          source: { type: "sine", frequency: 1000 },
          envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 },
          gain: 0.08,
        },
        {
          source: { type: "sine", frequency: 1200 },
          envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 },
          delay: 0.035,
          gain: 0.07,
        },
      ],
    },
    toggle: {
      layers: [
        {
          source: { type: "sine", frequency: 880 },
          envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 },
          gain: 0.08,
        },
        {
          source: { type: "sine", frequency: 1320 },
          envelope: { attack: 0, decay: 0.02, sustain: 0, release: 0.006 },
          delay: 0.03,
          gain: 0.07,
        },
      ],
    },
  },
});

export const SOUND_NAMES = ["tick", "pop", "confirm", "toggle", "hover"] as const;
export type SoundName = (typeof SOUND_NAMES)[number];

const MUTE_KEY = "craft-muted";

export function isMuted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "true";
}

export function setMuted(muted: boolean) {
  window.localStorage.setItem(MUTE_KEY, String(muted));
}

export type PlayOptions = { detune?: number; volume?: number };

/** Plays a sound regardless of the mute toggle (for explicit demos). */
export async function playSoundAlways(name: SoundName, opts?: PlayOptions) {
  try {
    await ensureReady();
    minimal.play(name, opts);
  } catch {
    // Audio not available (e.g. before user gesture) — stay silent.
  }
}

export async function playSound(name: SoundName, opts?: PlayOptions) {
  if (isMuted()) return;
  await playSoundAlways(name, opts);
}

/**
 * Volume multiplier for the nth nav item — a gentle swell down the list,
 * capped so it never gets loud.
 */
export function progressionVolume(step: number) {
  return Math.min(0.5 + step * 0.06, 1);
}
