"use client";

import { definePatch, ensureReady } from "@web-kits/audio";

// A subset of the "Minimal" patch by Raphael Salaja
// (audio.raphaelsalaja.com/library/minimal) - quiet sine-based UI feedback.
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
    // "Success" from the Retro patch (audio.raphaelsalaja.com/library/retro)
    // - a rising 8-bit C–E–G–C arpeggio.
    success: {
      layers: [
        {
          source: { type: "square", frequency: 523 },
          envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 },
          gain: 0.06,
        },
        {
          source: { type: "square", frequency: 659 },
          envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 },
          delay: 0.06,
          gain: 0.05,
        },
        {
          source: { type: "square", frequency: 784 },
          envelope: { attack: 0, decay: 0.06, sustain: 0, release: 0.02 },
          delay: 0.12,
          gain: 0.045,
        },
        {
          source: { type: "square", frequency: 1047 },
          envelope: { attack: 0, decay: 0.08, sustain: 0, release: 0.025 },
          delay: 0.18,
          gain: 0.04,
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

export const SOUND_NAMES = [
  "tick",
  "pop",
  "success",
  "toggle",
  "hover",
] as const;
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
    // Audio not available (e.g. before user gesture) - stay silent.
  }
}

export async function playSound(name: SoundName, opts?: PlayOptions) {
  if (isMuted()) return;
  await playSoundAlways(name, opts);
}

/**
 * Detune (in cents) for the nth nav item - a very gentle rise down the
 * list, about a quarter of a semitone per step.
 */
export function progressionDetune(step: number) {
  return step * 25;
}
