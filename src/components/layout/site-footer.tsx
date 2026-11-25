"use client";

import Link from "next/link";
import { categories, siteCopy } from "@/data/site";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { t } = useLanguage();
  const socialLinks = [
    { icon: "mail", href: `mailto:${siteCopy.about.email}`, label: t({ zh: "发送邮件", en: "Email" }), external: false },
    { icon: "github", href: "https://github.com/lyb20020703?tab=repositories", label: "GitHub", external: true },
    { icon: "youtube", href: "https://www.youtube.com/@YibeiLou", label: "YouTube", external: true }
  ];

  return (
    <footer className="relative z-10 border-t border-white/[0.08] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/44 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a key={link.icon} href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="focus-ring group relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.05] hover:text-white">
              <span aria-hidden="true" className="h-5 w-5 bg-current"
                style={{
                  maskImage: `url(/assets/icons/social/${link.icon}.svg)`,
                  WebkitMaskImage: `url(/assets/icons/social/${link.icon}.svg)`,
                  maskSize: "contain", WebkitMaskSize: "contain",
                  maskPosition: "center", WebkitMaskPosition: "center",
                  maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat"
                }} />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-panel px-2 py-1 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {link.label}
              </span>
            </a>
          ))}
        </div>
        <div className="flex gap-6">
          {categories.map((category) => (
            <Link key={category.key} href={category.href} className="focus-ring rounded transition-colors hover:text-white">
              {t(category.label)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
