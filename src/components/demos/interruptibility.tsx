"use client";

import { Demo } from "@/components/app/demo";

export function InterruptibilityDemo() {
  return (
    <Demo>
      <style>{`
        @keyframes craft-slide {
          from { transform: translateX(0); }
          to { transform: translateX(96px); }
        }
      `}</style>
      <div className="flex w-full max-w-96 flex-col gap-6">
        <div>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">
            transition - interruptible, hover and leave mid-way
          </p>
          <div className="group/t relative h-10 rounded-xl border bg-card px-2">
            <div className="absolute top-1/2 size-6 -translate-y-1/2 rounded-lg bg-foreground transition-transform duration-500 ease-out group-hover/t:translate-x-24" />
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] text-muted-foreground">
            keyframes - locked in, must finish
          </p>
          <div className="group/k relative h-10 rounded-xl border bg-card px-2">
            <div className="absolute top-1/2 size-6 -translate-y-1/2 rounded-lg bg-foreground group-hover/k:animate-[craft-slide_500ms_ease-out_forwards]" />
          </div>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        Hover each track, then leave halfway through. The transition reverses
        from wherever it is; the keyframe animation snaps and replays - it
        can&apos;t change its mind.
      </p>
    </Demo>
  );
}
