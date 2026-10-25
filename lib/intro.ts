"use client";

import { useEffect, useState } from "react";

// Hero intro timeline (seconds from the moment the shader image is ready):
// black → orb rises from below the viewport, rotating slowly → heading → subheading → navbar.
export const INTRO = {
  orb: 3.6,
  orbFade: 1.8,
  heading: 2.3,
  subheading: 2.7,
  nav: 3.1,
  ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
};

export const GITHUB_URL = "https://github.com/Vaibhav91one/mapInly-2.0";

// The intro plays once per browser session: reloads and revisits skip the preloader and hero animation.
// The same key is read by the inline <head> script in app/layout.tsx (it adds html.intro-seen before first paint).
const KEY = "mapinly-intro";
export function introSeen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
// Snapshot at page load, before this load can mark the flag: true = this is a reload/revisit, skip the intro.
export const seenAtLoad = typeof window !== "undefined" && introSeen();
function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
}

// Settled = every intro animation has finished (nav fade ends at INTRO.nav + 1.2s) plus a short pause.
export const INTRO_SETTLED = INTRO.nav + 1.2 + 0.8;

// The preloader opens this gate when it has finished loading; the hero / navbar / language dialog all key off it.
let open: () => void = () => {};
export const introGate = new Promise<void>((resolve) => {
  open = resolve;
  if (typeof window !== "undefined") setTimeout(resolve, 7000); // ponytail: never hang the intro if the preloader fails
});
export const finishIntroGate = () => {
  markIntroSeen();
  open();
};

export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (seenAtLoad) {
      setReady(true);
      return;
    }
    let on = true;
    introGate.then(() => setTimeout(() => on && setReady(true), 200)); // orb starts as the overlay begins to fade
    return () => {
      on = false;
    };
  }, []);
  return ready;
}
