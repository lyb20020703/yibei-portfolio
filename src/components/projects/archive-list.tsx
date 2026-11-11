"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { formatProjectDate } from "@/lib/date-format";

// Compact rows for secondary work: small thumbnail, title, type, date.
export function ArchiveList({ projects }: { projects: Project[] }) {
  const { t, locale } = useLanguage();

  return (
    <ul className="max-w-4xl divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring group flex items-center gap-4 rounded-[6px] py-4 transition-colors hover:bg-white/[0.03] sm:gap-6 sm:px-3"
          >
            <span className="relative aspect-[2/1] w-24 shrink-0 overflow-hidden rounded-[4px] border border-white/10 bg-panel sm:w-32">
              {project.assets.coverImage && (
                <Image
                  src={project.assets.coverImage}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base text-white/88 transition-colors group-hover:text-white">
                {t(project.title)}
              </span>
              {project.meta?.format && (
                <span className="mt-1 block truncate text-xs text-white/44">{t(project.meta.format)}</span>
              )}
            </span>
            <span className="hidden shrink-0 text-xs tabular-nums tracking-[0.12em] text-white/36 sm:block">
              {formatProjectDate(project.date, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
