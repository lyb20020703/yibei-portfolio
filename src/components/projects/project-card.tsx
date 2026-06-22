"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { PlaceholderCover } from "@/components/ui/placeholder-cover";
import { projectDateLabel } from "@/lib/date-format";

export function ProjectCard({ project }: { project: Project }) {
  const { t, locale } = useLanguage();

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="focus-ring block rounded-[10px] border border-white/10 bg-white/[0.035] p-2 shadow-card transition-colors duration-300 hover:border-white/24 hover:bg-white/[0.065]"
      >
        <PlaceholderCover project={project} />
        <div className="px-2 pb-3 pt-5">
          <div className="flex flex-wrap gap-2">
            {project.tags[locale].map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/58">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-4 text-xl font-medium text-white">{t(project.title)}</h3>
          <p className="mt-3 min-h-12 text-sm leading-6 text-white/56">{t(project.excerpt)}</p>
          <div className="mt-5 text-xs tracking-[0.16em] text-white/42 transition-colors group-hover:text-white/76">
            {projectDateLabel(project.date, locale)}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
