"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

export function CopyIcon({
  copied,
  icon,
  className,
}: {
  copied: boolean;
  /** The idle icon shown before copying. */
  icon: ReactNode;
  className?: string;
}) {
  // `relative` so the exiting (position: absolute, via popLayout) icon is pinned
  // directly over the entering one instead of momentarily stacking below it.
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          className="inline-flex"
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        >
          {copied ? (
            <CheckCircleIcon weight="duotone" className={className} />
          ) : (
            icon
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
