"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { categories, siteCopy, type CategoryKey } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

function pageFromPath(pathname: string): CategoryKey {
  if (pathname.startsWith("/portfolio") || pathname.startsWith("/projects")) return "portfolio";
  if (pathname.startsWith("/about")) return "about";
  return "home";
}

export function NavBar() {
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const activePage = pageFromPath(pathname);
  const { scrollY, scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 180], [0.48, 0.76]);
  const background = useTransform(backgroundOpacity, (value) => `rgba(5,5,5,${value})`);
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <motion.header
      style={{ backgroundColor: background }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 shadow-[0_12px_42px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
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
            const isActive = activePage === category.key;

            return (
              <Link
                key={category.key}
                href={category.href}
                className={cn(
                  "focus-ring relative rounded-full px-5 py-2 text-sm text-white/62 transition-colors duration-300 hover:text-white",
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
      </nav>

      <div className="mx-auto block max-w-7xl px-4 pb-3 sm:px-6 md:hidden">
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className={cn(
                "focus-ring flex-1 rounded-full px-3 py-2 text-center text-sm text-white/62 transition-colors",
                activePage === category.key && "bg-white text-black"
              )}
            >
              {t(category.label)}
            </Link>
          ))}
        </div>
      </div>

      <motion.span
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-gradient-to-r from-glow/0 via-glow/80 to-ember/70"
      />
    </motion.header>
  );
}
