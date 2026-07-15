"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { playSound } from "@/lib/sounds";

// Redaction's cuts get progressively more degraded (35 → 70 → 100). Every
// ~25s — and on hover — the wordmark glitches through the pixelated cuts
// and settles back.
const GLITCH_FRAMES = [
  "font-redaction-70",
  "font-redaction-100",
  "font-redaction-70",
  "font-redaction-100",
  "font-redaction",
] as const;

const FRAME_MS = 90;

export function Wordmark() {
  const [frame, setFrame] = useState<string>("font-redaction");
  const frameTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const glitching = useRef(false);

  const glitch = () => {
    if (glitching.current) return;
    glitching.current = true;
    frameTimeouts.current = GLITCH_FRAMES.map((className, i) =>
      setTimeout(() => {
        setFrame(className);
        if (i === GLITCH_FRAMES.length - 1) glitching.current = false;
      }, i * FRAME_MS),
    );
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          glitch();
          schedule();
        },
        20_000 + Math.random() * 10_000,
      );
    };
    schedule();
    return () => {
      clearTimeout(timer);
      frameTimeouts.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link
      href="/"
      onClick={() => playSound("tick")}
      onMouseEnter={glitch}
      className={`${frame} text-base text-foreground`}
    >
      Craft
    </Link>
  );
}
