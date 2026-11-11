"use client";

import { stats } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";

export function StatsSection() {
  const { t, locale } = useLanguage();

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 border-y border-white/10 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const value = stat.value[locale];

          return (
            <Reveal
              key={stat.label.en}
              delay={index * 0.08}
              className={[
                "px-2 py-10 sm:px-6",
                index % 2 === 1 ? "border-l border-white/10" : "",
                index >= 2 ? "border-t border-white/10 lg:border-t-0" : "",
                index === 2 ? "lg:border-l" : ""
              ].join(" ")}
            >
              <p className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
                {/* Remount on language change so the count restarts with the right unit. */}
                <CountUp key={locale} value={value.n} />
                <span className="ml-1 text-xl text-white/56 sm:text-2xl">{value.suffix}</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-white/48">{t(stat.label)}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
