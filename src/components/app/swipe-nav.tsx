"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { playSound } from "@/lib/sounds";

// How much horizontal wheel/touch travel commits a navigation.
const THRESHOLD = 260;
// Pause between wheel events that resets the accumulator (a new gesture).
const GESTURE_GAP = 200;
const EXIT_MS = 170;

// A swipe commit swallows the rest of that gesture's momentum, so one
// swipe never skips multiple pages.
let enterFrom: "left" | "right" | null = null;
let swallowMomentum = false;
let lastWheelAt = 0;

type Phase = "idle" | "in-left" | "in-right" | "out-left" | "out-right";

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

/**
 * Swipe horizontally (trackpad or touch) to move through `routes` -
 * the same order as the sidebar nav. Mounted once in the site shell.
 */
export function SwipeNav({
  routes,
  children,
}: {
  routes: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [drag, setDrag] = useState(0); // rubber-band offset in px
  const [phase, setPhase] = useState<Phase>("idle");
  const committed = useRef(false);

  const index = routes.indexOf(pathname);
  const prev = index > 0 ? routes[index - 1] : undefined;
  const next =
    index >= 0 && index < routes.length - 1 ? routes[index + 1] : undefined;
  const prevRef = useRef(prev);
  const nextRef = useRef(next);
  prevRef.current = prev;
  nextRef.current = next;

  // On navigation: reset gesture state and, if a swipe brought us here,
  // enter from the side the gesture came from.
  useLayoutEffect(() => {
    committed.current = false;
    setDrag(0);
    if (!enterFrom) return;
    setPhase(enterFrom === "right" ? "in-right" : "in-left");
    enterFrom = null;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase("idle")),
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (next) router.prefetch(next);
    if (prev) router.prefetch(prev);
  }, [router, next, prev]);

  useEffect(() => {
    let acc = 0;
    let lastEvent = 0;
    let settleTimer: number | undefined;

    const commit = (dir: "next" | "prev") => {
      const href = dir === "next" ? nextRef.current : prevRef.current;
      if (!href || committed.current) return;
      committed.current = true;
      swallowMomentum = true;
      playSound("swipe");
      enterFrom = dir === "next" ? "right" : "left";
      setDrag(0);
      setPhase(dir === "next" ? "out-left" : "out-right");
      // Navigate immediately - the exit animation plays while Next swaps
      // the page, so there's no dead gap between out and in.
      router.push(href);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      if (insideHorizontalScroller(e.target)) return;
      // Keep the browser's history-swipe gesture out of the way.
      e.preventDefault();

      const now = performance.now();
      const gap = now - lastWheelAt;
      lastWheelAt = now;
      if (committed.current) return;
      // After a commit, ignore the rest of that gesture's momentum -
      // a new swipe starts only after a clear pause.
      if (swallowMomentum) {
        if (gap < GESTURE_GAP) return;
        swallowMomentum = false;
      }

      if (now - lastEvent > GESTURE_GAP) acc = 0;
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
      : phase === "in-right" || phase === "in-left"
        ? {
            transform: `translateX(${phase === "in-right" ? 32 : -32}px)`,
            opacity: 0,
            transition: "none",
          }
        : {
            transform: `translateX(${phase === "out-left" ? -32 : 32}px)`,
            opacity: 0,
            transition: `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in`,
          };

  return <div style={style}>{children}</div>;
}
