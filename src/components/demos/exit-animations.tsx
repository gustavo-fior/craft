"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Demo } from "@/components/app/demo";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ExitAnimationsDemo() {
  const [open, setOpen] = useState(true);
  const [cheap, setCheap] = useState(true);

  return (
    <Demo>
      <div className="flex h-24 w-full max-w-96 items-center justify-center">
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key={cheap ? "cheap" : "mirror"}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.35, ease: "easeOut" },
              }}
              exit={
                cheap
                  ? {
                      opacity: 0,
                      filter: "blur(4px)",
                      transition: { duration: 0.15, ease: "easeIn" },
                    }
                  : {
                      opacity: 0,
                      y: 16,
                      transition: { duration: 0.35, ease: "easeOut" },
                    }
              }
              className="rounded-xl border bg-card px-5 py-3 text-sm shadow-xs"
            >
              Changes saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Dismiss" : "Show"}
        </Button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            fade + blur exit
          </span>
          <Switch checked={cheap} onCheckedChange={setCheap} />
        </div>
      </div>
      <p className="max-w-sm text-center text-xs text-muted-foreground text-pretty">
        The entrance is identical either way. Off, the exit replays the
        entrance backwards and the toast lingers; on, it dissolves in 150ms
        and the interface gets out of your way.
      </p>
    </Demo>
  );
}
