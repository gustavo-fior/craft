"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { playSound } from "@/lib/sounds";

// Redaction's cuts get progressively more degraded (35 → 70 → 100). Every
// ~25s the wordmark glitches through the pixelated cuts and settles back.
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

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const glitch = () => {
      timeouts = GLITCH_FRAMES.map((className, i) =>
        setTimeout(() => setFrame(className), i * FRAME_MS),
      );
    };

    const schedule = () => {
      const delay = 20_000 + Math.random() * 10_000;
      return setTimeout(() => {
        glitch();
        interval = schedule();
      }, delay);
    };

    let interval = schedule();
    return () => {
      clearTimeout(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <Link
      href="/"
      onClick={() => playSound("tick")}
      className={`${frame} text-base text-foreground`}
    >
      Craft
    </Link>
  );
}
