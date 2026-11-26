"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { formatProjectDate } from "@/lib/date-format";

// Earlier work stays accessible without competing with featured projects.
export function ArchiveList({ projects }: { projects: Project[] }) {
  const { t, locale } = useLanguage();

  return (
    <ul className="w-full divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className="focus-ring group grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 rounded-[6px] py-4 transition-colors hover:bg-white/[0.03] sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:px-3"
          >
            <span className="relative row-span-2 aspect-[2/1] w-full overflow-hidden rounded-[4px] border border-white/10 bg-panel sm:row-span-1">
              {project.assets.coverImage && (
                <Image
                  src={project.assets.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 128px, 80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base text-white/88 transition-colors group-hover:text-white">
                {t(project.title)}
              </span>
              <span className="mt-1 block text-xs leading-6 text-white/44">{project.tags[locale].join(" · ")}</span>
            </span>
            <span className="col-start-2 text-xs tabular-nums text-white/36 sm:col-start-auto">
              {formatProjectDate(project.date, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
