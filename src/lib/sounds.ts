"use client";

import { defineSound, ensureReady } from "@web-kits/audio";

const tick = defineSound({
  source: { type: "sine", frequency: { start: 2400, end: 1800 } },
  envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.02 },
  gain: 0.12,
});

const pop = defineSound({
  source: { type: "sine", frequency: { start: 1200, end: 300 } },
  envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.03 },
  gain: 0.2,
});

const confirm = defineSound({
  source: { type: "triangle", frequency: { start: 880, end: 1320 } },
  envelope: { attack: 0.002, decay: 0.09, sustain: 0, release: 0.05 },
  gain: 0.16,
});

const toggle = defineSound({
  source: { type: "noise", color: "white" },
  filter: { type: "bandpass", frequency: 3200 },
  envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 },
  gain: 0.14,
});

export const sounds = { tick, pop, confirm, toggle };
export type SoundName = keyof typeof sounds;

const MUTE_KEY = "craft-muted";

export function isMuted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) === "true";
}

export function setMuted(muted: boolean) {
  window.localStorage.setItem(MUTE_KEY, String(muted));
}

export async function playSound(name: SoundName) {
  if (isMuted()) return;
  try {
    await ensureReady();
    sounds[name]();
  } catch {
    // Audio not available (e.g. before user gesture) — stay silent.
  }
}
