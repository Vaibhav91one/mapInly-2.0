"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { finishIntroGate } from "@/lib/intro";

const MIN_MS = 1200; // keep the counter on screen long enough to read as intentional

/** Black overlay with a 0 → 100 counter driven by real loading (shader image, fonts, min time), then it fades away. */
export function Preloader() {
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"count" | "fade" | "done">("count");
  const target = useRef(0);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo(0, 0);
    if (reduce) {
      finishIntroGate();
      setPhase("done");
      return;
    }
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden"; // no scrolling while the intro plays

    // three load steps → 33 / 66 / 100
    let doneSteps = 0;
    const step = () => {
      doneSteps += 1;
      target.current = Math.round((doneSteps / 3) * 100);
    };
    const img = new Image();
    img.onload = img.onerror = step;
    img.src = "/svgs/Asterisk.svg";
    (document.fonts?.ready ?? Promise.resolve()).then(step);
    const t0 = performance.now();
    const minTimer = setTimeout(step, MIN_MS);

    let value = 0;
    let raf = 0;
    let finished = false;
    const tick = () => {
      // ease toward the target, but never outrun the min-time ramp so the count always looks continuous
      const ramp = Math.min(((performance.now() - t0) / MIN_MS) * 100, 100);
      value += (Math.min(target.current, ramp) - value) * 0.12;
      setShown(Math.round(value));
      if (target.current >= 100 && value > 99.4 && !finished) {
        finished = true;
        setShown(100);
        setTimeout(() => {
          html.style.overflow = prevOverflow;
          window.scrollTo(0, 0);
          finishIntroGate();
          setPhase("fade");
        }, 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(minTimer);
      html.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "done") return null;
  return (
    <motion.div
      aria-hidden
      className="preloader pointer-events-none fixed inset-0 z-[100] flex items-end bg-black p-6 md:p-10"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fade" ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      onAnimationComplete={() => phase === "fade" && setPhase("done")}
    >
      <span className="font-light leading-none tracking-tight text-white tabular-nums text-[clamp(4rem,12vw,10rem)]">
        {shown}
      </span>
      <noscript>
        <style>{".preloader{display:none}"}</style>
      </noscript>
    </motion.div>
  );
}
