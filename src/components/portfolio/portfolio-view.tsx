"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { getProjectsBySection, portfolioSections } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { ProjectCard } from "@/components/projects/project-card";
import { ArchiveList } from "@/components/projects/archive-list";
import { Reveal } from "@/components/motion/reveal";
import { Typewriter } from "@/components/motion/typewriter";
import { cn } from "@/lib/utils";

const copy = {
  kicker: { zh: "Portfolio", en: "Portfolio" },
  title: { zh: "作品集", en: "Portfolio" },
  lead: { zh: "我在做", en: "I work on" }
};
const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const cardItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export function PortfolioView() {
  const { t, locale } = useLanguage();
  const roleWords = useMemo(() => portfolioSections.map((section) => t(section.label)), [t]);

  return (
    <div className="px-4 pb-16 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl pb-16 pt-20 sm:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.34em] text-white/36"
        >
          {t(copy.kicker)}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-7xl"
        >
          {t(copy.title)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-xl text-white/56 sm:text-2xl"
        >
          {t(copy.lead)} <Typewriter key={locale} words={roleWords} className="text-white" />
        </motion.p>

      </header>

      <div className="mx-auto max-w-7xl space-y-28">
        {portfolioSections.map((section, index) => {
          const sectionProjects = getProjectsBySection(section.key);
          const twoUp = sectionProjects.length === 2;

          return (
            <section key={section.key} id={section.key} className="scroll-mt-32">
              <Reveal>
                <div className="flex items-end gap-5 border-b border-white/10 pb-6">
                  <span className="text-6xl font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)] sm:text-8xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 pb-1">
                    <h2 className="text-2xl font-medium text-white sm:text-4xl">{t(section.label)}</h2>
                    <p className="mt-2 text-sm text-white/44">{t(section.scope)}</p>
                  </div>
                  <span className="hidden pb-2 text-xs uppercase tabular-nums tracking-[0.24em] text-white/32 sm:block">
                    {String(sectionProjects.length).padStart(2, "0")} Projects
                  </span>
                </div>
              </Reveal>

              <div className="mt-10">
                {section.compact ? (
                  <Reveal>
                    <ArchiveList projects={sectionProjects} />
                  </Reveal>
                ) : (
                  <motion.div
                    variants={cardContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-10% 0px" }}
                    className={cn("grid gap-5 sm:grid-cols-2", !twoUp && "lg:grid-cols-3")}
                  >
                    {sectionProjects.map((project) => (
                      <motion.div key={project.slug} variants={cardItem}>
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
