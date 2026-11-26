"use client";

import Link from "next/link";
import type { Project } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { formatProjectDate } from "@/lib/date-format";

// Earlier work stays accessible without competing with featured projects.
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
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base text-white/88 transition-colors group-hover:text-white">
                {t(project.title)}
              </span>
              <span className="mt-1 block text-xs leading-6 text-white/44">{project.tags[locale].join(" · ")}</span>
            </span>
            <span className="shrink-0 text-xs tabular-nums text-white/36">
              {formatProjectDate(project.date, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
