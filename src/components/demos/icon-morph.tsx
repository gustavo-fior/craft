"use client";

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function IconMorphDemo() {
  const [checked, setChecked] = useState(false);
  const [blur, setBlur] = useState(4);
  const [scale, setScale] = useState(25);
  const [animated, setAnimated] = useState(true);

  const hidden = animated
    ? { opacity: 0, scale: scale / 100, filter: `blur(${blur}px)` }
    : { opacity: 0 };

  return (
    <Demo>
      <Button
        variant="outline"
        onClick={() => setChecked((c) => !c)}
        className="gap-2"
      >
        <span className="relative inline-flex">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={checked ? "check" : "copy"}
              className="inline-flex"
              initial={hidden}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={hidden}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {checked ? (
                <CheckCircleIcon weight="duotone" className="size-4" />
              ) : (
                <CopyIcon weight="duotone" className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        {checked ? "Copied" : "Copy"}
      </Button>
      <div className="grid w-full max-w-80 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
        <span className="font-mono text-xs text-muted-foreground">blur</span>
        <Slider
          value={[blur]}
          onValueChange={(v: number | readonly number[]) =>
            setBlur(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={12}
          step={1}
        />
        <span className="font-mono text-xs text-muted-foreground">scale</span>
        <Slider
          value={[scale]}
          onValueChange={(v: number | readonly number[]) =>
            setScale(Array.isArray(v) ? v[0] : v)
          }
          min={0}
          max={100}
          step={5}
        />
        <span className="font-mono text-xs text-muted-foreground">morph</span>
        <Switch checked={animated} onCheckedChange={setAnimated} />
      </div>
    </Demo>
  );
}
