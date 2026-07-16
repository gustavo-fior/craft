"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { playSound } from "@/lib/sounds";

// How much horizontal wheel/touch travel commits a navigation.
const THRESHOLD = 260;
// Pause between wheel events that resets the accumulator (a new gesture).
const GESTURE_GAP = 200;
// Minimum time between two commits, so a strong flick pages through
// several articles at a readable rhythm instead of skipping instantly.
const COMMIT_COOLDOWN = 320;
const EXIT_MS = 170;

// Module state survives client-side navigations, which is what lets a
// single large gesture keep its momentum across page boundaries.
let enterFrom: "left" | "right" | null = null;
let lastCommitAt = 0;
let chain = 0; // how many articles this gesture has already passed

function insideHorizontalScroller(target: EventTarget | null) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body) {
    if (el.scrollWidth > el.clientWidth + 1) {
      const { overflowX } = getComputedStyle(el);
      if (overflowX === "auto" || overflowX === "scroll") return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function SwipeNav({
  prevSlug,
  nextSlug,
  children,
}: {
  prevSlug?: string;
  nextSlug?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(0); // rubber-band offset in px
  const [phase, setPhase] = useState<"in" | "idle" | "out-left" | "out-right">(
    enterFrom ? "in" : "idle",
  );
  const committed = useRef(false);

  const prevRef = useRef(prevSlug);
  const nextRef = useRef(nextSlug);
  prevRef.current = prevSlug;
  nextRef.current = nextSlug;

  // Entrance: start shifted toward the side the gesture came from,
  // then settle. Runs only after a swipe, not on normal navigation.
  const from = useRef(enterFrom);
  useEffect(() => {
    if (!from.current) return;
    enterFrom = null;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("idle")),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (nextSlug) router.prefetch(`/${nextSlug}`);
    if (prevSlug) router.prefetch(`/${prevSlug}`);
  }, [router, nextSlug, prevSlug]);

  useEffect(() => {
    let acc = 0;
    let lastEvent = 0;
    let settleTimer: number | undefined;

    const commit = (dir: "next" | "prev") => {
      const slug = dir === "next" ? nextRef.current : prevRef.current;
      if (!slug || committed.current) return;
      const now = performance.now();
      if (now - lastCommitAt < COMMIT_COOLDOWN) return;
      lastCommitAt = now;
      committed.current = true;
      // Chained commits in one gesture rise in pitch.
      chain = now - lastEvent < 1000 ? chain : 0;
      playSound("swipe", { detune: (dir === "prev" ? -200 : 0) + chain * 150 });
      chain += 1;
      enterFrom = dir === "next" ? "right" : "left";
      setDrag(0);
      setPhase(dir === "next" ? "out-left" : "out-right");
      window.setTimeout(() => router.push(`/${slug}`), EXIT_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      if (insideHorizontalScroller(e.target)) return;
      // Keep the browser's history-swipe gesture out of the way.
      e.preventDefault();
      if (committed.current) return;

      const now = performance.now();
      if (now - lastEvent > GESTURE_GAP) {
        acc = 0;
        chain = 0;
      }
      lastEvent = now;
      acc += e.deltaX;

      const dir = acc > 0 ? "next" : "prev";
      const available = dir === "next" ? nextRef.current : prevRef.current;
      // Rubber-band: follow the gesture with resistance, harder when
      // there's nothing on that side.
      setDrag(-acc * (available ? 0.12 : 0.04));
      // Spring back once the gesture ends without committing.
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        acc = 0;
        setDrag(0);
      }, GESTURE_GAP);
      if (Math.abs(acc) > THRESHOLD) {
        acc = 0;
        commit(dir);
      }
    };

    let touchX = 0;
    let touchY = 0;
    let touchDx = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      touchDx = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchX;
      const dy = e.touches[0].clientY - touchY;
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
      touchDx = dx;
      if (!committed.current) {
        const available = dx < 0 ? nextRef.current : prevRef.current;
        setDrag(dx * (available ? 0.35 : 0.1));
      }
    };
    const onTouchEnd = () => {
      if (Math.abs(touchDx) > 70) commit(touchDx < 0 ? "next" : "prev");
      else setDrag(0);
      touchDx = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [router]);

  const style: React.CSSProperties =
    phase === "idle"
      ? {
          transform: drag
            ? `translateX(${Math.max(-64, Math.min(64, drag))}px)`
            : undefined,
          opacity: drag ? Math.max(0.4, 1 - Math.abs(drag) / 200) : undefined,
          transition: drag
            ? "none"
            : "transform 250ms ease-out, opacity 250ms ease-out",
        }
      : phase === "in"
        ? {
            transform: `translateX(${from.current === "right" ? 32 : -32}px)`,
            opacity: 0,
          }
        : {
            transform: `translateX(${phase === "out-left" ? -32 : 32}px)`,
            opacity: 0,
            transition: `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in`,
          };

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transition:
          phase === "idle" && !drag
            ? "transform 250ms ease-out, opacity 250ms ease-out"
            : style.transition,
      }}
    >
      {children}
    </div>
  );
}
