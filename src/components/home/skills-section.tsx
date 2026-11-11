"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { skillGroups } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { Reveal } from "@/components/motion/reveal";

const copy = {
  kicker: { zh: "Toolkit", en: "Toolkit" },
  title: { zh: "常用工具", en: "Tools I use" },
  next: [
    {
      href: "/portfolio",
      label: { zh: "作品集", en: "Portfolio" },
      hint: { zh: "AI 产品、AIGC 视频、产品设计、游戏与视觉", en: "AI products, AIGC video, product design, games, visuals" }
    },
    {
      href: "/about",
      label: { zh: "关于我", en: "About" },
      hint: { zh: "教育背景、荣誉与个人兴趣", en: "Education, honors, and interests" }
    }
  ]
};

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <section className="px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.34em] text-white/36">{t(copy.kicker)}</p>
          <h2 className="mt-4 text-3xl font-medium text-white sm:text-5xl">{t(copy.title)}</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {skillGroups.map((group, groupIndex) => (
            <Reveal key={group.label.en} delay={groupIndex * 0.08}>
              <p className="text-sm text-white/44">{t(group.label)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={{ y: -2 }}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid gap-4 sm:grid-cols-2">
          {copy.next.map((item, index) => (
            <Reveal key={item.href} delay={index * 0.08}>
              <Link
                href={item.href}
                className="focus-ring group relative flex items-end justify-between overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/24 hover:bg-white/[0.06] sm:p-9"
              >
                <span className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-glow/0 blur-3xl transition-colors duration-500 group-hover:bg-glow/15" />
                <span className="relative">
                  <span className="block text-2xl font-medium text-white sm:text-3xl">{t(item.label)}</span>
                  <span className="mt-2 block text-sm text-white/48">{t(item.hint)}</span>
                </span>
                <span className="relative text-2xl text-white/50 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-white">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
