"use client";

import { useTranslation } from "react-i18next";
import { LiquidMetal } from "@paper-design/shaders-react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import { keys } from "@/lib/i18n/keys";
import { INTRO, useIntroReady } from "@/lib/intro";

export function HeroSection() {
  const { t } = useTranslation();
  const ready = useIntroReady();
  const { scrollYProgress } = useScroll();
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <section className={cn(sectionClasses, "min-h-screen relative")}>
      {/* LiquidMetal - behind text, scroll-driven rotation; smaller on mobile. Outer box clips to the whole hero so the orb rises from the viewport's bottom edge. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-x-0 top-24 md:top-40 flex items-center justify-center">
          {/* entry: slow rotation + rise; fade is a separate, shorter tween so it dissolves in instead of popping */}
          <motion.div
            initial={{ y: "100vh", rotate: -180 }}
            animate={ready ? { y: 0, rotate: 0 } : undefined}
            transition={{ duration: INTRO.orb, ease: INTRO.ease }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : undefined}
              transition={{ duration: INTRO.orbFade, ease: "easeOut" }}
            >
              <motion.div
                className="origin-center scale-75 md:scale-100"
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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Text content - on top */}
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 min-h-screen items-start! justify-start! gap-8"
        )}
      >
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, delay: INTRO.heading, ease: INTRO.ease }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight font-regular leading-tight text-left">
          {t(keys.hero.heading)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, delay: INTRO.subheading, ease: INTRO.ease }}
          className="self-end text-left max-w-md text-base sm:text-lg tracking-tight leading-tight"
          aria-label={t(keys.hero.subheadingAria)}
        >
          {t(keys.hero.subheading)}
        </motion.p>
      </div>
    </section>
  );
}
