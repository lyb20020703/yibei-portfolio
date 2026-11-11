"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { experiences } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const copy = {
  kicker: { zh: "Experience", en: "Experience" },
  title: { zh: "实习与项目经历", en: "Internships and projects" }
};

export function ExperienceSection() {
  const { t, locale } = useLanguage();
  const [activeKey, setActiveKey] = useState(experiences[0].key);
  const active = experiences.find((item) => item.key === activeKey) ?? experiences[0];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-white/36">{t(copy.kicker)}</p>
          <h2 className="mt-4 text-3xl font-medium text-white sm:text-5xl">{t(copy.title)}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-14">
            <div role="tablist" aria-label={t(copy.title)} className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {experiences.map((item) => {
                const isActive = item.key === active.key;

                return (
                  <button
                    key={item.key}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setActiveKey(item.key)}
                    className={cn(
                      "focus-ring relative shrink-0 rounded-[12px] px-4 py-3.5 text-left transition-colors lg:w-full",
                      isActive ? "text-white" : "text-white/48 hover:text-white/80"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="experience-active"
                        className="absolute inset-0 rounded-[12px] border border-white/12 bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative block text-sm font-medium">{t(item.role)}</span>
                    <span className="relative mt-1 block max-w-[14rem] truncate text-xs text-current opacity-70 lg:max-w-none">
                      {t(item.org)}
                    </span>
                    <span className="relative mt-1 block text-xs tabular-nums opacity-50">{item.period}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[26rem] rounded-[18px] border border-white/10 bg-white/[0.03] p-6 shadow-card sm:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.key}-${locale}`}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="text-2xl font-medium text-white sm:text-3xl">{t(active.org)}</h3>
                    <span className="text-sm tabular-nums text-white/44">{active.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/56">
                    {t(active.team)} <span className="mx-2 text-white/24">/</span> {t(active.role)}
                  </p>
                  <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">{t(active.summary)}</p>
                  <ul className="mt-6 space-y-4">
                    {active.points.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.12 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 text-sm leading-7 text-white/62 sm:text-[15px]"
                      >
                        <span className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-glow" aria-hidden="true" />
                        <span>{t(point)}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {active.tags[locale].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/56">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
