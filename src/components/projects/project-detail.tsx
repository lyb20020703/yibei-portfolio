"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/data/site";
import { getCategory } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { projectDateLabel } from "@/lib/date-format";

const toneClass: Record<Project["cover"]["tone"], string> = {
  cyan: "from-cyan-300/30 via-white/8 to-blue-950/20",
  green: "from-emerald-300/28 via-white/8 to-teal-950/20",
  amber: "from-amber-300/28 via-white/8 to-rose-950/20",
  violet: "from-violet-300/28 via-white/8 to-indigo-950/20"
};

export function ProjectDetail({ project }: { project: Project }) {
  const { t, locale } = useLanguage();
  const [activeGalleryTab, setActiveGalleryTab] = useState<"showcase" | "research">("showcase");
  const category = getCategory(project.category);
  const isGalleryOnly = project.detailMode === "gallery-only";
  const isLightTheme = project.theme?.text === "#000000";
  const textColor = project.theme?.text ?? "#ffffff";
  const backgroundColor = project.theme?.background;

  return (
    <article className="pb-24" style={{ backgroundColor, color: textColor }}>
      <motion.section
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative left-1/2 min-h-[72vh] w-screen -translate-x-1/2 overflow-hidden bg-panel md:min-h-[82vh]"
      >
        {project.assets.bannerImage ? (
          <Image
            src={project.assets.bannerImage}
            alt={`${project.title.en} banner`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className={cn("absolute inset-0 bg-gradient-to-br", toneClass[project.cover.tone])} />
        )}
        <div className="absolute inset-0 bg-black/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-black/28" />
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-32 w-full sm:h-40"
          style={{ color: backgroundColor ?? "#050505" }}
        >
          <path d="M0 6 C24 16 76 16 100 6 V20 H0 Z" fill="currentColor" />
        </svg>
      </motion.section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="-mt-2 pb-12 pt-10 text-center sm:pt-14"
        >
          <p className={cn("text-xs uppercase tracking-[0.34em]", isLightTheme ? "text-black/44" : "text-white/38")}>
            {category ? t(category.label) : project.category}
          </p>
          <h1 className={cn("mx-auto mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-7xl", isLightTheme ? "text-black" : "text-white")}>
            {t(project.title)}
          </h1>
          <ProjectTagList tags={project.tags[locale]} className="mt-7 justify-center" light={isLightTheme} />
          <p className={cn("mx-auto mt-7 max-w-2xl text-lg leading-8", isLightTheme ? "text-black/70" : "text-white/64")}>{t(project.excerpt)}</p>
          <p className={cn("mx-auto mt-4 text-sm tracking-[0.16em]", isLightTheme ? "text-black/54" : "text-white/44")}>
            {projectDateLabel(project.date, locale)}
          </p>
        </motion.header>

        {project.galleryTabs && (
          <ProjectGalleryTabs
            showcaseLabel={t(project.galleryTabs.showcaseLabel)}
            researchLabel={t(project.galleryTabs.researchLabel)}
            activeTab={activeGalleryTab}
            onChange={setActiveGalleryTab}
            accentColor={project.theme?.underline ?? "#5CF5F8"}
          />
        )}

        {project.playableDemo && (
          <ProjectPlayableDemoSection
            title={t(project.playableDemo.title)}
            subtitle={project.playableDemo.subtitle ? t(project.playableDemo.subtitle) : undefined}
            url={project.playableDemo.url}
            actionLabel={project.playableDemo.actionLabel ? t(project.playableDemo.actionLabel) : undefined}
            note={t(project.playableDemo.note)}
            light={isLightTheme}
            underlineColor={project.theme?.underline}
          />
        )}

        {project.levelFlow && <LevelFlowModule project={project} />}

        {isGalleryOnly && project.gallery && !project.galleryTabs && (
          <section className="relative left-1/2 w-screen -translate-x-1/2 space-y-16 px-4 pt-2 sm:space-y-24 sm:px-6 lg:px-8">
            {project.gallery.map((item) => (
              item.layout === "grid" ? (
                <DetailGridGallerySection
                  key={item.images?.join("-")}
                  title={item.title ? t(item.title) : undefined}
                  images={item.images ?? (item.src ? [item.src] : [])}
                  underlineColor={project.theme?.underline ?? "#561134"}
                  titleColor={project.theme?.text ?? "#000000"}
                />
              ) : (
                <DetailGallerySection
                  key={item.src ?? item.images?.join("-")}
                  title={item.title ? t(item.title) : undefined}
                  images={item.images ?? (item.src ? [item.src] : [])}
                  underlineColor={project.theme?.underline ?? "#561134"}
                  titleColor={project.theme?.text ?? "#000000"}
                />
              )
            ))}
          </section>
        )}

        {isGalleryOnly && project.gallery && project.galleryTabs && (
          <section className="relative left-1/2 w-screen -translate-x-1/2 px-4 pt-2 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait" initial={false}>
              {activeGalleryTab === "showcase" ? (
                <motion.div
                  key="showcase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-16 sm:space-y-24"
                >
                  {project.gallery.map((item) => (
                    item.layout === "grid" ? (
                      <DetailGridGallerySection
                        key={item.images?.join("-")}
                        title={item.title ? t(item.title) : undefined}
                        images={item.images ?? (item.src ? [item.src] : [])}
                        underlineColor={project.theme?.underline ?? "#561134"}
                        titleColor={project.theme?.text ?? "#000000"}
                      />
                    ) : (
                      <DetailGallerySection
                        key={item.src ?? item.images?.join("-")}
                        title={item.title ? t(item.title) : undefined}
                        images={item.images ?? (item.src ? [item.src] : [])}
                        underlineColor={project.theme?.underline ?? "#561134"}
                        titleColor={project.theme?.text ?? "#000000"}
                      />
                    )
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="research"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DetailGallerySection
                    images={project.galleryTabs.researchImages}
                    underlineColor={project.theme?.underline ?? "#5CF5F8"}
                    titleColor={project.theme?.text ?? "#ffffff"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {isGalleryOnly && project.media?.videoEmbed && (!project.galleryTabs || activeGalleryTab === "showcase") && (
          <ProjectVideoSection
            title={t(project.media.videoEmbed.title)}
            url={project.media.videoEmbed.url}
            aspect={project.media.videoEmbed.aspect}
            light={isLightTheme}
            underlineColor={project.theme?.underline}
          />
        )}

        {!isGalleryOnly && project.media?.videoEmbed && (
          <ProjectVideoSection
            title={t(project.media.videoEmbed.title)}
            url={project.media.videoEmbed.url}
            aspect={project.media.videoEmbed.aspect}
            light={isLightTheme}
            underlineColor={project.theme?.underline}
          />
        )}

        {!isGalleryOnly && project.gallery && (
          <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 space-y-16 px-4 sm:space-y-24 sm:px-6 lg:px-8">
            {project.gallery.map((item) => (
              item.layout === "grid" ? (
                <DetailGridGallerySection
                  key={item.images?.join("-")}
                  title={item.title ? t(item.title) : undefined}
                  images={item.images ?? (item.src ? [item.src] : [])}
                  underlineColor={project.theme?.underline ?? "#5CF5F8"}
                  titleColor={project.theme?.text ?? "#ffffff"}
                />
              ) : (
                <DetailGallerySection
                  key={item.src ?? item.images?.join("-")}
                  title={item.title ? t(item.title) : undefined}
                  images={item.images ?? (item.src ? [item.src] : [])}
                  underlineColor={project.theme?.underline ?? "#5CF5F8"}
                  titleColor={project.theme?.text ?? "#ffffff"}
                  contained
                />
              )
            ))}
          </section>
        )}

        {!isGalleryOnly && project.details?.sections && (
          <div className="mx-auto mt-16 max-w-4xl space-y-10">
            {project.details.sections.map((section) => (
              <section
                key={section.title.zh}
                className={cn("border-t pt-8", isLightTheme ? "border-black/10" : "border-white/10")}
              >
                <h2 className={cn("text-2xl font-medium", isLightTheme ? "text-black" : "text-white")}>{t(section.title)}</h2>
                <p className={cn("mt-4 text-base leading-8", isLightTheme ? "text-black/64" : "text-white/56")}>{t(section.body)}</p>
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function ProjectGalleryTabs({
  showcaseLabel,
  researchLabel,
  activeTab,
  onChange,
  accentColor
}: {
  showcaseLabel: string;
  researchLabel: string;
  activeTab: "showcase" | "research";
  onChange: (tab: "showcase" | "research") => void;
  accentColor: string;
}) {
  const tabs = [
    { key: "showcase" as const, label: showcaseLabel },
    { key: "research" as const, label: researchLabel }
  ];

  return (
    <div className="mb-14 flex justify-center sm:mb-16">
      <div
        role="tablist"
        aria-label={`${showcaseLabel} / ${researchLabel}`}
        className="flex w-full max-w-md gap-1 rounded-[8px] border border-white/12 bg-white/[0.04] p-1 backdrop-blur-xl"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={cn(
                "focus-ring relative min-h-11 flex-1 rounded-[6px] px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "text-black" : "text-white/58 hover:bg-white/[0.05] hover:text-white/84"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="project-gallery-active-tab"
                  className="absolute inset-0 rounded-[6px]"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 24px ${accentColor}38`
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailGallerySection({
  title,
  images,
  underlineColor,
  titleColor,
  contained = false
}: {
  title?: string;
  images: string[];
  underlineColor: string;
  titleColor: string;
  contained?: boolean;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto", contained ? "w-[92vw] max-w-[84rem]" : "w-full max-w-[92rem]")}
    >
      {title && <SectionCaption title={title} titleColor={titleColor} underlineColor={underlineColor} />}
      <div className="space-y-8 sm:space-y-10">
        {images.map((src, index) => (
          <div key={src} className="overflow-hidden rounded-[8px] bg-black/5 shadow-[0_28px_100px_rgba(0,0,0,0.18)]">
            <Image
              src={src}
              alt={title ? (images.length > 1 ? `${title} ${index + 1}` : title) : `Gallery image ${index + 1}`}
              width={2200}
              height={1400}
              sizes="(min-width: 1536px) 1472px, calc(100vw - 32px)"
              className="h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </motion.figure>
  );
}

function DetailGridGallerySection({
  title,
  images,
  underlineColor,
  titleColor
}: {
  title?: string;
  images: string[];
  underlineColor: string;
  titleColor: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[92rem]"
    >
      {title && <SectionCaption title={title} titleColor={titleColor} underlineColor={underlineColor} />}
      <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((src, index) => (
          <div key={src} className="overflow-hidden rounded-[8px] bg-black/5 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
            <Image
              src={src}
              alt={title ? `${title} ${index + 1}` : `Campaign page ${index + 1}`}
              width={1200}
              height={1800}
              sizes="(min-width: 1280px) 29vw, (min-width: 640px) 45vw, calc(100vw - 32px)"
              className="h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </motion.figure>
  );
}

function SectionCaption({
  title,
  titleColor,
  underlineColor
}: {
  title: string;
  titleColor: string;
  underlineColor: string;
}) {
  return (
    <figcaption className="mb-8 text-center">
      <span className="inline-flex flex-col items-center text-2xl font-medium sm:text-3xl" style={{ color: titleColor }}>
        {title}
        <motion.span
          className="mt-3 h-[3px] w-full origin-left"
          style={{ backgroundColor: underlineColor }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </span>
    </figcaption>
  );
}

function ProjectVideoSection({
  title,
  url,
  aspect,
  light,
  underlineColor = "#5CF5F8"
}: {
  title: string;
  url: string;
  aspect?: "wide" | "short";
  light: boolean;
  underlineColor?: string;
}) {
  return (
    <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <span
            className={cn("inline-flex flex-col items-center text-2xl font-medium sm:text-3xl", light ? "text-black" : "text-white")}
          >
            {title}
            <motion.span
              className="mt-3 h-[3px] w-full origin-left"
              style={{ backgroundColor: underlineColor }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </span>
        </div>
        <div className={cn("overflow-hidden rounded-[8px] p-2 shadow-card", light ? "bg-black/[0.06]" : "border border-white/10 bg-white/[0.035]")}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[6px] bg-black",
              aspect === "short" ? "mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-[28rem]" : "aspect-video w-full"
            )}
          >
            <iframe
              src={url}
              title={title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPlayableDemoSection({
  title,
  subtitle,
  url,
  actionLabel = "Play Now",
  note,
  light,
  underlineColor = "#5CF5F8"
}: {
  title: string;
  subtitle?: string;
  url: string;
  actionLabel?: string;
  note: string;
  light: boolean;
  underlineColor?: string;
}) {
  const { locale } = useLanguage();

  return (
    <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 px-3 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <span
            className={cn("inline-flex flex-col items-center text-2xl font-medium sm:text-3xl", light ? "text-black" : "text-white")}
          >
            {title}
            <motion.span
              className="mt-3 h-[3px] w-full origin-left"
              style={{ backgroundColor: underlineColor }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </span>
          {subtitle && (
            <p className={cn("mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg", light ? "text-black/68" : "text-white/66")}>
              {subtitle}
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative overflow-hidden rounded-[12px] px-6 py-10 text-center shadow-[0_40px_140px_rgba(0,0,0,0.34)] sm:px-10 sm:py-12",
            light ? "border border-black/10 bg-white/60" : "border border-white/10 bg-white/[0.04]"
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-10 top-0 h-px",
              light ? "bg-gradient-to-r from-transparent via-black/24 to-transparent" : "bg-gradient-to-r from-transparent via-white/24 to-transparent"
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
              light ? "bg-cyan-300/24" : "bg-cyan-300/16"
            )}
          />
          <div className="relative">
            <p className={cn("text-xs uppercase tracking-[0.28em]", light ? "text-black/44" : "text-white/42")}>
              {locale === "zh" ? "跳转 itch.io" : "Open itch.io"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-7 inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium tracking-[0.08em] shadow-[0_18px_60px_rgba(92,245,248,0.2)] transition duration-300 active:scale-[0.98] sm:px-10 sm:text-lg",
                light
                  ? "border border-black/12 bg-black text-white hover:shadow-[0_22px_80px_rgba(0,0,0,0.22)]"
                  : "border border-white/14 bg-white/[0.08] text-white backdrop-blur hover:border-cyan-200/40 hover:bg-white/[0.12] hover:shadow-[0_22px_90px_rgba(92,245,248,0.28)]"
              )}
            >
              {actionLabel}
            </a>
            <p className={cn("mx-auto mt-6 max-w-xl text-sm leading-6", light ? "text-black/54" : "text-white/52")}>{note}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LevelFlowModule({ project }: { project: Project }) {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);
  const flow = project.levelFlow;

  if (!flow) {
    return null;
  }

  return (
    <section className="relative left-1/2 mt-10 w-screen -translate-x-1/2 px-3 pb-6 sm:mt-16 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[96rem] overflow-hidden rounded-[10px] border border-white/10 bg-[#0a0a0a] px-4 py-6 shadow-[0_40px_140px_rgba(0,0,0,0.42)] sm:px-7 sm:py-9 lg:px-10">
        <div className="mb-8 text-center">
          <span className="inline-flex flex-col items-center text-2xl font-medium text-white sm:text-3xl">
            {t(flow.title)}
            <motion.span
              className="mt-3 h-[3px] w-full origin-left bg-white"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-5">
          {flow.chapters.map((chapter) => (
            <motion.article
              key={chapter.title.zh}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group relative min-h-[132px] overflow-hidden rounded-[4px] border border-white/10 bg-white/[0.04] lg:min-h-[150px]"
            >
              <Image
                src={chapter.image}
                alt={t(chapter.title)}
                fill
                sizes="(min-width: 1024px) 20vw, 100vw"
                className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/26 to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-sm font-medium tracking-[0.08em] text-white sm:text-base">
                {t(chapter.title)}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 space-y-20 sm:mt-20 sm:space-y-24">
          {flow.sections.map((section) => (
            <LevelFlowSection
              key={section.title.zh}
              section={section}
              onPreview={(src, alt) => setPreview({ src, alt })}
            />
          ))}
        </div>
      </div>

      {preview && (
        <motion.button
          type="button"
          className="fixed inset-0 z-[80] flex cursor-zoom-out items-center justify-center bg-black/86 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreview(null)}
          aria-label="Close image preview"
        >
          <Image
            src={preview.src}
            alt={preview.alt}
            width={1600}
            height={900}
            sizes="100vw"
            className="max-h-[94vh] w-auto max-w-[96vw] rounded-[8px] object-contain shadow-[0_30px_120px_rgba(0,0,0,0.6)]"
          />
        </motion.button>
      )}
    </section>
  );
}

function LevelFlowSection({
  section,
  onPreview
}: {
  section: NonNullable<Project["levelFlow"]>["sections"][number];
  onPreview: (src: string, alt: string) => void;
}) {
  const { t } = useLanguage();
  const nodeCount = section.nodes.length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl">{t(section.title)}</h3>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-white/24 to-transparent sm:block" />
      </div>

      <div className="overflow-hidden rounded-[3px] border border-white/10 bg-white/[0.03]">
        <Image
          src={section.mapImage}
          alt={`${t(section.title)} map`}
          width={2996}
          height={179}
          sizes="(min-width: 1536px) 1472px, calc(100vw - 40px)"
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="mt-5 hidden md:block">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` }}>
          {section.nodes.map((node) => (
            <div key={node.zh} className="px-2 text-center text-base tracking-[0.08em] text-white/86">
              {t(node)}
            </div>
          ))}
        </div>
        <div className="relative mt-3 h-5">
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#9db5dc]/72" />
          <div className="grid" style={{ gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` }}>
            {section.nodes.map((node) => (
              <div key={node.zh} className="relative flex justify-center">
                <span className="relative z-10 h-3.5 w-3.5 rounded-full border border-[#bfd0ee] bg-[#9db5dc] shadow-[0_0_18px_rgba(157,181,220,0.48)]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-9 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
        {section.cards.map((card) => {
          const title = t(card.title);

          return (
            <motion.article
              key={card.title.zh}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group relative"
            >
              <div className="pointer-events-none absolute -top-9 left-1/2 hidden h-8 w-px bg-white/26 md:block" />
              <button
                type="button"
                className="block w-full overflow-hidden rounded-[4px] border border-white/10 bg-white/[0.04] text-left shadow-[0_26px_70px_rgba(0,0,0,0.35)]"
                onClick={() => onPreview(card.image, title)}
              >
                <Image
                  src={card.image}
                  alt={title}
                  width={900}
                  height={506}
                  sizes="(min-width: 1536px) 344px, (min-width: 768px) 45vw, calc(100vw - 48px)"
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
                />
              </button>
              <div className="pt-4 text-center">
                <p className="text-sm leading-6 text-white/72">{t(card.description)}</p>
                <h4 className="mt-2 text-base font-semibold tracking-[0.04em] text-white">【{title}】</h4>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

function ProjectTagList({ tags, className, light = false }: { tags: string[]; className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs backdrop-blur",
            light ? "border border-black/12 bg-black/[0.04] text-black/70" : "border border-white/10 bg-black/24 text-white/72"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
