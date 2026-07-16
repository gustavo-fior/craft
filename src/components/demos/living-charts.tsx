"use client";

import { useEffect, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

const POINTS = 48;

export function LivingChartsDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lerp, setLerp] = useState(true);
  const lerpRef = useRef(lerp);
  lerpRef.current = lerp;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // targets: where the data actually is; values: what we draw,
    // eased toward the targets a fraction per frame.
    let value = 0.5;
    const targets = Array.from({ length: POINTS }, () => {
      value = Math.min(0.9, Math.max(0.1, value + (Math.random() - 0.5) * 0.3));
      return value;
    });
    const values = [...targets];

    const color = getComputedStyle(canvas).color;
    let frame: number;
    let tick = 0;

    const draw = () => {
      tick += 1;
      // New data point roughly every 500ms.
      if (tick % 30 === 0) {
        targets.shift();
        const last = targets[targets.length - 1];
        targets.push(
          Math.min(0.9, Math.max(0.1, last + (Math.random() - 0.5) * 0.35)),
        );
        if (!lerpRef.current) {
          values.length = 0;
          values.push(...targets);
        }
      }
      if (lerpRef.current) {
        for (let i = 0; i < POINTS; i++) {
          values[i] += (targets[i] - values[i]) * 0.08;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      for (let i = 0; i < POINTS; i++) {
        const x = (i / (POINTS - 1)) * width;
        const y = height - values[i] * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Demo>
      <canvas
        ref={canvasRef}
        className="h-36 w-full max-w-96 text-foreground"
      />
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          interpolate
        </span>
        <Switch checked={lerp} onCheckedChange={setLerp} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Same data either way. Easing each point ~8% per frame toward its
        target makes the chart feel alive instead of twitching between
        snapshots.
      </p>
    </Demo>
  );
}
