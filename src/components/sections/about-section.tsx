"use client";

import { siteCopy } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { Reveal } from "@/components/motion/reveal";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="scroll-mt-36 px-4 py-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mx-auto max-w-7xl border-t border-white/10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1fr]">
            <h2 className="text-3xl font-medium text-white sm:text-5xl">{t(siteCopy.about.title)}</h2>
            <div>
              <p className="max-w-3xl text-lg leading-9 text-white/58">{t(siteCopy.about.body)}</p>
              <a
                href={`mailto:${siteCopy.about.email}`}
                className="focus-ring mt-8 inline-flex rounded-full border border-white/12 px-5 py-3 text-sm text-white/74 transition-colors hover:border-white/28 hover:bg-white/[0.06] hover:text-white"
              >
                {siteCopy.about.email}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
