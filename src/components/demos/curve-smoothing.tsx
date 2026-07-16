"use client";

import { useEffect, useRef, useState } from "react";

import { Demo } from "@/components/app/demo";
import { Switch } from "@/components/ui/switch";

// Fixed sample of noisy data so both modes draw the same points.
const DATA = [
  0.42, 0.55, 0.38, 0.62, 0.5, 0.78, 0.6, 0.66, 0.44, 0.58, 0.35, 0.52, 0.7,
  0.48, 0.64,
];

export function CurveSmoothingDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [smooth, setSmooth] = useState(true);

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

    const pad = 10;
    const points = DATA.map((v, i) => ({
      x: pad + (i / (DATA.length - 1)) * (width - pad * 2),
      y: height - pad - v * (height - pad * 2),
    }));

    const color = getComputedStyle(canvas).color;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.moveTo(points[0].x, points[0].y);
    if (smooth) {
      // Catmull-Rom through every point, converted to cubic beziers.
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6,
          p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6,
          p2.y - (p3.y - p1.y) / 6,
          p2.x,
          p2.y,
        );
      }
    } else {
      for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    for (const p of points) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [smooth]);

  return (
    <Demo>
      <canvas
        ref={canvasRef}
        className="h-36 w-full max-w-96 text-foreground"
      />
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-muted-foreground">smooth</span>
        <Switch checked={smooth} onCheckedChange={setSmooth} />
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Same fifteen points. The curve still passes through every one of
        them - smoothing only replaces the straight segments between
        measurements, which were never data to begin with.
      </p>
    </Demo>
  );
}
