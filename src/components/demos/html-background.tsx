"use client";

import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function HtmlBackgroundDemo() {
  const [fixed, setFixed] = useState(false);
  const [banding, setBanding] = useState(false);

  const rubberBand = () => {
    setBanding(true);
    setTimeout(() => setBanding(false), 450);
  };

  return (
    <Demo>
      {/* A fake browser viewport. The area behind the page is what Safari
          paints from the html element during overscroll. */}
      <div
        className="relative h-52 w-full max-w-96 overflow-hidden rounded-2xl border"
        style={{ background: fixed ? "#1c1c1c" : "#ffffff" }}
      >
        <div
          className="absolute inset-0 bg-[#1c1c1c] p-4 transition-transform duration-400 ease-out"
          style={{ transform: banding ? "translateY(56px)" : "translateY(0)" }}
        >
          <div className="h-2 w-24 rounded-full bg-white/30" />
          <div className="mt-3 h-2 w-40 rounded-full bg-white/15" />
          <div className="mt-2 h-2 w-32 rounded-full bg-white/15" />
          <div className="mt-6 h-16 rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={rubberBand}>
          Rubber-band
        </Button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            html background set
          </span>
          <Switch checked={fixed} onCheckedChange={setFixed} />
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        This dark page only styles its content. Overscroll it — without a
        background on <code>html</code>, Safari flashes white behind it.
      </p>
    </Demo>
  );
}
