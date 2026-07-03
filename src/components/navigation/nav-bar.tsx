"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { categories, getProjectsByCategory, siteCopy, type CategoryKey, type Project } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

type NavBarProps = {
  activeCategory?: CategoryKey;
};

const homeSectionKeys: CategoryKey[] = ["games", "uiux", "visual", "ai-films", "about"];

export function NavBar({ activeCategory = "home" }: NavBarProps) {
  const { locale, setLocale, t } = useLanguage();
  const [openCategory, setOpenCategory] = useState<CategoryKey | null>(null);
  const [activeNavCategory, setActiveNavCategory] = useState<CategoryKey>(activeCategory);
  const pendingCategoryRef = useRef<CategoryKey | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 180], [0.48, 0.76]);

  useEffect(() => {
    if (activeCategory !== "home") {
      setActiveNavCategory(activeCategory);
      return;
    }

    const hashCategory = window.location.hash.slice(1) as CategoryKey;
    setActiveNavCategory(homeSectionKeys.includes(hashCategory) ? hashCategory : "home");
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory !== "home") return;

    let animationFrame = 0;

    const updateActiveSection = () => {
      if (pendingCategoryRef.current) return;

      const activationLine = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
      let nextCategory: CategoryKey = "home";

      for (const key of homeSectionKeys) {
        const section = document.getElementById(key);
        if (!section) continue;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= activationLine) nextCategory = key;
      }

      const isAtPageBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (isAtPageBottom) nextCategory = "about";

      setActiveNavCategory((current) => (current === nextCategory ? current : nextCategory));
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeCategory]);

  useEffect(
    () => () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    },
    []
  );

  const handleCategoryClick = (category: CategoryKey) => {
    setActiveNavCategory(category);
    pendingCategoryRef.current = category;

    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = setTimeout(() => {
      pendingCategoryRef.current = null;
      pendingTimerRef.current = null;
    }, 900);
  };

  const categoryProjects = openCategory
    ? getProjectsByCategory(openCategory as Project["category"])
    : [];

  return (
    <motion.header
      style={{ backgroundColor: useTransform(backgroundOpacity, (value) => `rgba(5,5,5,${value})`) }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 shadow-[0_12px_42px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
      onMouseLeave={() => setOpenCategory(null)}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring group flex items-center gap-3 rounded-full" aria-label="Portfolio home">
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/8 shadow-glow">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(130,217,255,0.9),transparent_38%),radial-gradient(circle_at_75%_80%,rgba(255,184,153,0.62),transparent_42%)] opacity-80 transition-transform duration-500 group-hover:scale-125" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="hidden text-xs uppercase tracking-[0.28em] text-white/70 sm:block">Studio</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
          {categories.map((category) => {
            const isActive = activeNavCategory === category.key;
            const hasDropdown = category.key !== "home" && category.key !== "about";

            return (
              <Link
                key={category.key}
                href={category.href}
                onClick={() => handleCategoryClick(category.key)}
                onMouseEnter={() => setOpenCategory(hasDropdown ? category.key : null)}
                onFocus={() => setOpenCategory(hasDropdown ? category.key : null)}
                className={cn(
                  "focus-ring relative rounded-full px-4 py-2 text-sm text-white/62 transition-colors duration-300 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.1] shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{t(category.label)}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1" aria-label={t(siteCopy.nav.language)}>
            {(["zh", "en"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={cn(
                  "focus-ring rounded-full px-3 py-1.5 text-xs uppercase text-white/55 transition-colors",
                  locale === item && "bg-white text-black"
                )}
              >
                {item === "zh" ? "中" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto block max-w-7xl px-4 pb-3 md:hidden sm:px-6">
        <div className="flex snap-x gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              onClick={() => handleCategoryClick(category.key)}
              className={cn(
                "focus-ring shrink-0 rounded-full px-3 py-2 text-sm text-white/62",
                activeNavCategory === category.key && "bg-white text-black"
              )}
            >
              {t(category.label)}
            </Link>
          ))}
        </div>
      </div>

      {categoryProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute left-1/2 top-[4.5rem] hidden w-[min(25rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/78 p-2 shadow-card backdrop-blur-2xl md:block"
        >
          <div className="space-y-1">
            {categoryProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="focus-ring group block rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.08]"
              >
                <span className="block text-sm text-white transition-transform duration-300 group-hover:translate-x-1">
                  {t(project.title)}
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/48">{t(project.excerpt)}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
