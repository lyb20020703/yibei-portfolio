"use client";

import Link from "next/link";
import { categories, siteCopy } from "@/data/site";
import { useLanguage } from "@/context/language-context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/[0.08] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/44 sm:flex-row sm:items-center sm:justify-between">
        <a href={`mailto:${siteCopy.about.email}`} className="focus-ring w-fit rounded transition-colors hover:text-white">
          {siteCopy.about.email}
        </a>
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
