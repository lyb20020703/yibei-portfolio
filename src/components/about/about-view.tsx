"use client";

import { motion } from "framer-motion";
import { courses, education, honors, languages, traits } from "@/data/profile";
import { siteCopy } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { AboutProfileCard } from "@/components/about/about-profile-card";
import { Reveal } from "@/components/motion/reveal";

const copy = {
  kicker: { zh: "About", en: "About" },
  title: { zh: "你好，我是 Yibei", en: "Hello, I'm Yibei" },
  lead: {
    zh: "设计出身，在做 AI 产品。喜欢游戏、互联网和一切新东西，也习惯自己动手把想法做出来。",
    en: "Trained in design, now working on AI products. I love games, the internet, and anything new, and I like building ideas myself."
  },
  education: { zh: "教育背景", en: "Education" },
  courses: { zh: "主修课程", en: "Courses" },
  languages: { zh: "语言", en: "Languages" },
  honors: { zh: "荣誉", en: "Honors" },
  profile: { zh: "个人简介", en: "Profile sheet" },
  contact: { zh: "联系我", en: "Get in touch" }
};

const grid = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export function AboutView() {
  const { t } = useLanguage();

  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="pb-16 pt-20 sm:pt-28">
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-2xl text-lg leading-9 text-white/62"
          >
            {t(copy.lead)}
          </motion.p>
        </header>

        <motion.div variants={grid} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {traits.map((trait) => (
            <motion.div
              key={trait.title.en}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group relative overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-glow/0 blur-2xl transition-colors duration-500 group-hover:bg-glow/12" />
              <p className="relative text-lg font-medium text-white">{t(trait.title)}</p>
              <p className="relative mt-2 text-sm text-white/50">{t(trait.detail)}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-28 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-2xl font-medium text-white sm:text-3xl">{t(copy.education)}</h2>
            <ol className="mt-8 space-y-7 border-l border-white/10 pl-7">
              {education.map((entry) => (
                <li key={entry.period} className="relative">
                  <span className="absolute -left-[calc(1.75rem+5px)] top-2 h-[9px] w-[9px] rounded-full border border-glow/60 bg-ink" aria-hidden="true" />
                  <p className="text-xs tabular-nums text-white/40">{entry.period}</p>
                  <p className="mt-1.5 text-base text-white">{t(entry.school)}</p>
                  <p className="mt-1 text-sm text-white/56">{t(entry.degree)}</p>
                  {entry.note && <p className="mt-1 text-sm text-white/44">{t(entry.note)}</p>}
                </li>
              ))}
            </ol>
            <dl className="mt-10 space-y-4 text-sm leading-7">
              <div>
                <dt className="text-white/40">{t(copy.courses)}</dt>
                <dd className="mt-1 text-white/66">{t(courses)}</dd>
              </div>
              <div>
                <dt className="text-white/40">{t(copy.languages)}</dt>
                <dd className="mt-1 text-white/66">{t(languages)}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-2xl font-medium text-white sm:text-3xl">{t(copy.honors)}</h2>
            <ul className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {honors.map((honor) => (
                <li key={honor.en} className="py-4 text-sm leading-6 text-white/72 sm:text-[15px]">
                  {t(honor)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-28">
          <h2 className="text-2xl font-medium text-white sm:text-3xl">{t(copy.profile)}</h2>
          <AboutProfileCard
            src="/assets/profile/aboutme.png"
            alt={t(siteCopy.about.profileImageAlt)}
            viewLabel={t(siteCopy.about.viewProfile)}
          />
          <p className="mt-12 text-sm text-white/44">{t(copy.contact)}</p>
          <a
            href={`mailto:${siteCopy.about.email}`}
            className="focus-ring mt-3 inline-flex rounded-full border border-white/12 px-5 py-3 text-sm text-white/80 transition-colors hover:border-white/28 hover:bg-white/[0.06] hover:text-white"
          >
            {siteCopy.about.email}
          </a>
        </Reveal>
      </div>
    </div>
  );
}
