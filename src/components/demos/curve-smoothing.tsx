"use client";

import { useDemoText } from "@/components/app/demo-messages";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

import { Compare, CompareItem } from "@/components/app/compare";
import { Demo } from "@/components/app/demo";
import { SegmentedControl } from "@/components/app/segmented-control";

type Point = { x: number; y: number };

/* Every curve is emitted as cubic segments so paths can morph into each other. */

function linear(points: Point[]) {
  return points.map((p, i, all) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const a = all[i - 1];
    const c1 = { x: a.x + (p.x - a.x) / 3, y: a.y + (p.y - a.y) / 3 };
    const c2 = { x: a.x + ((p.x - a.x) * 2) / 3, y: a.y + ((p.y - a.y) * 2) / 3 };
    return `C${c1.x},${c1.y} ${c2.x},${c2.y} ${p.x},${p.y}`;
  });
}

function catmullRom(points: Point[]) {
  return points.map((p, i, all) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const p0 = all[Math.max(i - 2, 0)];
    const p1 = all[i - 1];
    const p3 = all[Math.min(i + 1, all.length - 1)];
    const c1 = { x: p1.x + (p.x - p0.x) / 6, y: p1.y + (p.y - p0.y) / 6 };
    const c2 = { x: p.x - (p3.x - p1.x) / 6, y: p.y - (p3.y - p1.y) / 6 };
    return `C${c1.x},${c1.y} ${c2.x},${c2.y} ${p.x},${p.y}`;
  });
}

/* Fritsch and Carlson tangents, the same idea as d3's curveMonotoneX. */
function monotone(points: Point[]) {
  const n = points.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = (points[i + 1].y - points[i].y) / dx[i];
  }

  const tangent: number[] = [];
  tangent[0] = slope[0];
  tangent[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1];
    const b = slope[i];
    if (a * b <= 0) {
      tangent[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangent[i] = (w1 + w2) / (w1 / a + w2 / b);
    }
  }

  return points.map((p, i, all) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const a = all[i - 1];
    const h = (p.x - a.x) / 3;
    const c1 = { x: a.x + h, y: a.y + h * tangent[i - 1] };
    const c2 = { x: p.x - h, y: p.y - h * tangent[i] };
    return `C${c1.x},${c1.y} ${c2.x},${c2.y} ${p.x},${p.y}`;
  });
}

const CURVES = { linear, monotone, catmullRom } as const;
type Curve = keyof typeof CURVES;

function toPath(curve: Curve, points: Point[]) {
  return CURVES[curve](points).join(" ");
}

/* Chart geometry */

const PAD_X = 10;
const PAD_Y = 14;

type Size = { width: number; height: number };
const LARGE: Size = { width: 320, height: 150 };
const SMALL: Size = { width: 200, height: 130 };

function layout(values: number[], { width, height }: Size): Point[] {
  const innerW = width - PAD_X * 2;
  const innerH = height - PAD_Y * 2;
  return values.map((value, i) => ({
    x: PAD_X + (i / (values.length - 1)) * innerW,
    y: PAD_Y + (1 - value) * innerH,
  }));
}

function Chart({
  points,
  curve,
  size,
  className,
  children,
}: {
  points: Point[];
  curve: Curve;
  size: Size;
  className?: string;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  const d = toPath(curve, points);

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox={`0 0 ${size.width} ${size.height}`}
    >
      {children}
      <motion.path
        animate={{ d }}
        className="text-foreground"
        fill="none"
        initial={false}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        transition={
          reduced ? { duration: 0 } : { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
        }
      />
      {points.map((p) => (
        <circle
          key={p.x}
          className="fill-card stroke-foreground"
          cx={p.x}
          cy={p.y}
          r={3}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

/* Same points, three interpolations. */

const SERIES = [0.42, 0.55, 0.38, 0.62, 0.5, 0.78, 0.6, 0.66, 0.44, 0.58, 0.35, 0.52, 0.7, 0.48, 0.64];

const CURVE_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "monotone", label: "Monotone" },
  { value: "catmullRom", label: "Catmull-Rom" },
] as const;

export function CurveSmoothingDemo() {
  const t = useDemoText();
  const [curve, setCurve] = useState<Curve>("linear");
  const points = layout(SERIES, LARGE);

  return (
    <Demo className="gap-8">
      <div className="w-full max-w-md rounded-xl bg-card px-2 pt-2 pb-1 shadow-(--custom-shadow)">
        <Chart className="h-auto w-full" curve={curve} points={points} size={LARGE} />
      </div>
      <SegmentedControl
        ariaLabel={t("Curve type")}
        onChange={setCurve}
        options={CURVE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        value={curve}
      />
    </Demo>
  );
}

/* Bounded data: a smooth curve that swings past the limits is lying. */

const BOUNDED = [0.6, 0.75, 0, 0, 0.35, 0.9, 1, 1, 0.2, 0, 0, 0.45];

function Bounds({ width, height }: Size) {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  return (
    <>
      {[top, bottom].map((y) => (
        <line
          key={y}
          className="stroke-rose-500/70"
          strokeDasharray="3 3"
          strokeWidth={1}
          x1={PAD_X}
          x2={width - PAD_X}
          y1={y}
          y2={y}
        />
      ))}
    </>
  );
}

export function CurveOvershootDemo() {
  const points = layout(BOUNDED, SMALL);

  return (
    <Demo className="gap-7 px-4 sm:px-8">
      <Compare>
        <CompareItem verdict="wrong">
          <div className="w-full rounded-xl bg-card px-1 pt-1 shadow-(--custom-shadow)">
            <Chart className="h-auto w-full" curve="catmullRom" points={points} size={SMALL}>
              <Bounds {...SMALL} />
            </Chart>
          </div>
        </CompareItem>
        <CompareItem verdict="right">
          <div className="w-full rounded-xl bg-card px-1 pt-1 shadow-(--custom-shadow)">
            <Chart className="h-auto w-full" curve="monotone" points={points} size={SMALL}>
              <Bounds {...SMALL} />
            </Chart>
          </div>
        </CompareItem>
      </Compare>
    </Demo>
  );
}
