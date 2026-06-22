"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import { siteCopy } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { PixelRevealCanvas } from "@/components/motion/pixel-reveal-canvas";

const amaticSc = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/AmaticSC-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../../../public/assets/fonts/AmaticSC-Bold.ttf",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap"
});

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-[calc(100vh-7.25rem)] items-center overflow-hidden px-4 pb-16 pt-12 sm:px-6 md:min-h-[calc(100vh-4.5rem)] lg:px-8">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/home/hero-image.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="scale-105 object-cover opacity-52 blur-[10px] saturate-[0.78]"
        />
        <div className="absolute inset-0 bg-black/58" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_12%_78%,rgba(92,245,248,0.12),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      <PixelRevealCanvas
        src="/assets/home/hero-image.png"
        revealSize={160}
        fadeDuration={800}
        className="absolute inset-0 z-[1] hidden md:block"
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-xs uppercase tracking-[0.34em] text-white/50"
          >
            {t(siteCopy.hero.kicker)}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`${amaticSc.className} mt-8 text-6xl font-bold leading-[0.95] tracking-[0.03em] text-white drop-shadow-[0_24px_80px_rgba(0,0,0,0.75)] sm:text-7xl lg:text-[7.5rem]`}
          >
            {t(siteCopy.hero.title)}
          </motion.h1>
          <div className="mt-10 h-px w-28 bg-gradient-to-r from-white/70 to-transparent" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
