"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { intro } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { AgentDemo } from "@/components/home/agent-demo";
import { Reveal } from "@/components/motion/reveal";

const copy = {
  kicker: { zh: "Profile", en: "Profile" },
  title: { zh: "简介", en: "About me" },
  roles: [
    { zh: "AI 产品", en: "AI product" },
    { zh: "交互设计", en: "Interaction design" },
    { zh: "AIGC", en: "AIGC" }
  ]
};

export function ProfileSection() {
  const { t } = useLanguage();
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 80%", "end 55%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.34em] text-white/36">{t(copy.kicker)}</p>
            <h2 className="mt-4 text-3xl font-medium text-white sm:text-5xl">{t(copy.title)}</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {copy.roles.map((role) => (
                <span key={role.en} className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/76">
                  {t(role)}
                </span>
              ))}
            </div>
          </Reveal>

        <div className="mt-12 grid items-start gap-14 lg:grid-cols-[1fr_minmax(0,30rem)] lg:items-stretch lg:gap-20">
          <div ref={lineRef} className="relative min-w-0 pl-8">
            <span className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" aria-hidden="true" />
            <motion.span
              style={{ scaleY: lineScale }}
              className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-gradient-to-b from-glow via-glow/60 to-ember/60"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-8 lg:h-full lg:justify-between lg:gap-6">
              {intro.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <div className="relative">
                    <span
                      className="absolute -left-8 top-[0.55rem] h-[11px] w-[11px] rounded-full border border-glow/60 bg-ink shadow-[0_0_12px_rgba(130,217,255,0.45)]"
                      aria-hidden="true"
                    />
                    <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg sm:leading-9 lg:leading-[1.8]">{t(paragraph)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        <Reveal delay={0.12} className="min-w-0">
          <AgentDemo />
        </Reveal>
        </div>
      </div>
    </section>
  );
}
