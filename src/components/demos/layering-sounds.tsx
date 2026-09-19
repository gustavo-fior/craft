"use client";

import { useDemoText } from "@/components/app/demo-messages";
import { useState } from "react";
import { MoonIcon, PlayIcon } from "@phosphor-icons/react";
import {
  definePatch,
  defineSound,
  ensureReady,
  type Layer,
} from "@web-kits/audio";
import { motion, useReducedMotion } from "motion/react";

import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const EASE = [0.23, 1, 0.32, 1] as const;

async function trigger(layers: Layer[]) {
  try {
    await ensureReady();
    defineSound({ layers })();
  } catch {
    // Audio unavailable before a user gesture. Stay silent.
  }
}

function unwrap(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : (value as number);
}

/* One note, then the same note with layers stacked behind it */

// Every layer is the same C5 in a different shape, a few cents off,
// and quieter than the one before it.
const NOTE_LAYERS = [
  { source: { type: "sine", frequency: 523 }, decay: 0.09, gain: 0.08 },
  {
    source: { type: "triangle", frequency: 523, detune: 8 },
    decay: 0.09,
    gain: 0.05,
  },
  {
    source: { type: "sine", frequency: 1046, detune: -6 },
    decay: 0.07,
    gain: 0.03,
  },
  {
    source: { type: "square", frequency: 261, detune: 5 },
    decay: 0.08,
    gain: 0.02,
  },
] as const;

const LAYER_TINT = [
  "bg-emerald-500",
  "bg-emerald-500/80",
  "bg-emerald-500/60",
  "bg-emerald-500/45",
];

const RELEASE = 0.03;
const TIMELINE_MS = 400;

export function SoundLayersDemo() {
  const t = useDemoText();
  const [count, setCount] = useState(1);
  const [spacing, setSpacing] = useState(40);
  const [playId, setPlayId] = useState(0);
  const reduced = useReducedMotion();

  const play = () => {
    void trigger(
      NOTE_LAYERS.slice(0, count).map((layer, i) => ({
        source: layer.source,
        envelope: {
          attack: 0.002,
          decay: layer.decay,
          sustain: 0,
          release: RELEASE,
        },
        gain: layer.gain,
        delay: (i * spacing) / 1000,
      }))
    );
    setPlayId((n) => n + 1);
  };

  return (
    <Demo className="gap-8">
      <div className="w-full max-w-sm">
        <div className="relative grid gap-2 py-1">
          {NOTE_LAYERS.map((layer, i) => {
            const left = ((i * spacing) / TIMELINE_MS) * 100;
            const width =
              (((layer.decay + RELEASE) * 1000) / TIMELINE_MS) * 100;
            const geometry = { left: `${left}%`, width: `${width}%` };
            const shared =
              "absolute inset-y-0 rounded-full transition-[left,width] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none";

            return (
              <div key={layer.source.type + i} className="relative h-3">
                {i < count ? (
                  <motion.div
                    key={playId}
                    initial={
                      playId > 0 && !reduced
                        ? { opacity: 0.35, scaleY: 0.5 }
                        : false
                    }
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{
                      delay: (i * spacing) / 1000,
                      duration: 0.14,
                      ease: EASE,
                    }}
                    style={geometry}
                    className={cn(shared, LAYER_TINT[i])}
                  />
                ) : (
                  <div
                    style={geometry}
                    className={cn(
                      shared,
                      "border border-dashed border-[#E7E7E7] dark:border-[#1E1E1E]"
                    )}
                  />
                )}
              </div>
            );
          })}
          {playId > 0 && !reduced && (
            <motion.div
              key={`head-${playId}`}
              initial={{ left: "0%", opacity: 1 }}
              animate={{ left: "100%", opacity: [1, 1, 0] }}
              transition={{ duration: TIMELINE_MS / 1000, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-px bg-foreground/40"
            />
          )}
        </div>
        <div className="mt-2 flex justify-between border-t border-[#E7E7E7] pt-1.5 text-[10px] text-muted-foreground tabular-nums dark:border-[#1E1E1E]">
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
          <span>400 ms</span>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <Button variant="secondary" size="sm" onClick={play}>
          <PlayIcon weight="fill" aria-hidden="true" />
          {t("Play")}
        </Button>
        <label className="grid w-full gap-2.5">
          <span className="flex justify-between text-xs text-muted-foreground">
            {t("Layers")}
            <span className="tabular-nums text-foreground">{count}</span>
          </span>
          <Slider
            aria-label={t("Layers")}
            min={1}
            max={4}
            step={1}
            value={[count]}
            onValueChange={(v) => setCount(unwrap(v))}
          />
        </label>
        <label className="grid w-full gap-2.5">
          <span className="flex justify-between text-xs text-muted-foreground">
            {t("Spacing")}
            <span className="tabular-nums text-foreground">{spacing} ms</span>
          </span>
          <Slider
            aria-label={t("Spacing between layers")}
            min={0}
            max={80}
            step={10}
            value={[spacing]}
            onValueChange={(v) => setSpacing(unwrap(v))}
          />
        </label>
      </div>
    </Demo>
  );
}

/* From chord to arpeggio */

const NOTES = [
  { name: "C", frequency: 523, gain: 0.06, height: "44%" },
  { name: "E", frequency: 659, gain: 0.05, height: "58%" },
  { name: "G", frequency: 784, gain: 0.045, height: "74%" },
  { name: "C", frequency: 1047, gain: 0.04, height: "100%" },
] as const;

export function ArpeggioSpacingDemo() {
  const t = useDemoText();
  const [spacing, setSpacing] = useState(60);
  const [playId, setPlayId] = useState(0);
  const reduced = useReducedMotion();

  const play = () => {
    void trigger(
      NOTES.map((note, i) => ({
        source: { type: "square", frequency: note.frequency },
        envelope: {
          attack: 0,
          decay: 0.06,
          sustain: 0,
          release: i === NOTES.length - 1 ? 0.08 : 0.02,
        },
        gain: note.gain,
        delay: (i * spacing) / 1000,
      }))
    );
    setPlayId((n) => n + 1);
  };

  return (
    <Demo className="gap-8">
      <div className="grid w-full max-w-[15rem] grid-cols-4 gap-3">
        {NOTES.map((note, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                style={{ height: note.height }}
                className="relative w-full overflow-hidden rounded-md bg-muted"
              >
                {playId > 0 && (
                  <motion.div
                    key={playId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: reduced ? [0, 1, 1, 0] : [0, 1, 0] }}
                    transition={{
                      delay: (i * spacing) / 1000,
                      duration: 0.55,
                      times: reduced ? [0, 0.01, 0.6, 1] : [0, 0.12, 1],
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 bg-emerald-500"
                  />
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{note.name}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-5">
        <Button variant="secondary" size="sm" onClick={play}>
          <PlayIcon weight="fill" aria-hidden="true" />
          {t("Play")}
        </Button>
        <label className="grid w-full gap-2.5">
          <span className="flex justify-between text-xs text-muted-foreground">
            {t("Spacing")}
            <span className="tabular-nums text-foreground">{spacing} ms</span>
          </span>
          <Slider
            aria-label={t("Spacing between notes")}
            min={0}
            max={150}
            step={10}
            value={[spacing]}
            onValueChange={(v) => setSpacing(unwrap(v))}
          />
        </label>
      </div>
    </Demo>
  );
}

/* Tone gives pitch, noise gives the click */

const TONE = {
  source: { type: "sine", frequency: 880 },
  envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
  gain: 0.08,
} satisfies Layer;

const NOISE = {
  source: { type: "noise", color: "white" },
  filter: { type: "bandpass", frequency: 2600, resonance: 1.5 },
  envelope: { attack: 0, decay: 0.018, sustain: 0, release: 0.01 },
  gain: 0.06,
} satisfies Layer;

const textures = definePatch({
  name: "Textures",
  sounds: {
    tone: TONE,
    noise: NOISE,
    both: { layers: [TONE, NOISE] },
  },
});

type Texture = "tone" | "noise" | "both";

const TEXTURE_OPTIONS = [
  { value: "tone", label: "Tone" },
  { value: "noise", label: "Noise" },
  { value: "both", label: "Both" },
] as const satisfies readonly { value: Texture; label: string }[];

export function TextureLayersDemo() {
  const t = useDemoText();
  const [texture, setTexture] = useState<Texture>("both");
  const [on, setOn] = useState(false);

  const flip = async (next: boolean) => {
    setOn(next);
    try {
      await ensureReady();
      textures.play(texture);
    } catch {
      // Audio unavailable before a user gesture. Stay silent.
    }
  };

  return (
    <Demo className="gap-8">
      <div className="flex w-full max-w-sm items-center justify-between gap-4 rounded-xl bg-card px-4 py-3 text-sm text-foreground shadow-(--custom-shadow)">
        <span className="flex items-center gap-2.5">
          <MoonIcon aria-hidden="true" className="size-4 text-muted-foreground" />
          {t("Do not disturb")}
        </span>
        <Switch
          aria-label={t("Do not disturb")}
          checked={on}
          onCheckedChange={(next) => void flip(next)}
        />
      </div>
      <SegmentedControl
        ariaLabel={t("Sound texture")}
        options={TEXTURE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={texture}
        onChange={setTexture}
      />
    </Demo>
  );
}
