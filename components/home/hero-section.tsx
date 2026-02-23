"use client";

import { useTranslation } from "react-i18next";
import { LiquidMetal } from "@paper-design/shaders-react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";

export function HeroSection() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <section className={cn(sectionClasses, "min-h-screen relative")}>
      {/* LiquidMetal - absolute, behind text, scroll-driven rotation */}
      <div className="absolute left-0 top-40 z-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="origin-center"
          style={{ rotate: scrollRotate }}
        >
          <LiquidMetal
            width={1280}
            height={720}
            image="/svgs/Asterisk.svg"
            colorBack="#000000"
            colorTint="#ffffff"
            shape={undefined}
            repetition={2}
            softness={0.1}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0.07}
            contour={0.4}
            angle={70}
            speed={1}
            scale={0.6}
            fit="contain"
          />
        </motion.div>
      </div>

      {/* Text content - on top */}
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 min-h-screen items-start! justify-start! gap-8"
        )}
      >
        <h1 className="text-8xl tracking-tight font-regular leading-tight text-left">
          {t(keys.hero.heading)}
        </h1>
        <p
          className="self-end text-left max-w-md text-lg tracking-tight leading-tight"
          aria-label={t(keys.hero.subheadingAria)}
        >
          {t(keys.hero.subheading)}
        </p>
      </div>
    </section>
  );
}
