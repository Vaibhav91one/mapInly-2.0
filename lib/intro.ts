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

// Load the shader image once so the orb never starts rising before it can be drawn.
let assets: Promise<void> | undefined;
function introAssets() {
  assets ??= new Promise<void>((resolve) => {
    const img = new Image();
    const done = () => setTimeout(resolve, 400); // brief black beat before anything moves
    img.onload = img.onerror = done;
    img.src = "/svgs/Asterisk.svg";
    setTimeout(resolve, 3000); // ponytail: don't hang the intro on a slow image
  });
  return assets;
}

export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let on = true;
    introAssets().then(() => on && setReady(true));
    return () => {
      on = false;
    };
  }, []);
  return ready;
}
