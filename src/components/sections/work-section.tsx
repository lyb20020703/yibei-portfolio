"use client";

import { getProjectsByCategory, siteCopy, workCategories } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/motion/reveal";

export function WorkSection() {
  const { t } = useLanguage();

  return (
    <section id="works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-14 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.34em] text-white/36">Selected Work</p>
            <h2 className="mt-4 text-3xl font-medium text-white sm:text-5xl">{t(siteCopy.home.worksTitle)}</h2>
            <p className="mt-4 max-w-2xl text-center text-sm font-light leading-6 text-white/64">
              {t(siteCopy.home.worksNote)}
            </p>
          </div>
        </Reveal>

        <div className="space-y-24">
          {workCategories.map((category) => {
            const categoryProjects = getProjectsByCategory(category.key);

            return (
              <Reveal key={category.key}>
                <div id={category.key} className="scroll-mt-36">
                  <div className="mb-8 border-t border-white/10 pt-9">
                    <div className="mx-auto flex max-w-3xl items-center gap-5">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/18" />
                      <h3 className="shrink-0 text-center text-2xl font-medium text-white sm:text-3xl">
                        {t(category.label)}
                      </h3>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/18" />
                    </div>
                    {category.description && (
                      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-white/46">
                        {t(category.description)}
                      </p>
                    )}
                    <span className="mt-4 block text-center text-xs uppercase tracking-[0.24em] text-white/32">
                      {String(categoryProjects.length).padStart(2, "0")} Projects
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProjects.map((project) => (
                      <ProjectCard key={project.slug} project={project} />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
