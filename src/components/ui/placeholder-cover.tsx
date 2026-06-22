import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/site";

const toneClass: Record<Project["cover"]["tone"], string> = {
  cyan: "from-cyan-300/30 via-white/8 to-blue-950/20",
  green: "from-emerald-300/28 via-white/8 to-teal-950/20",
  amber: "from-amber-300/28 via-white/8 to-rose-950/20",
  violet: "from-violet-300/28 via-white/8 to-indigo-950/20"
};

export function PlaceholderCover({
  project,
  className,
  large = false
}: {
  project: Project;
  className?: string;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[8px] border border-white/10 bg-panel",
        large ? "aspect-[16/9]" : "aspect-[2/1]",
        className
      )}
    >
      {project.assets.coverImage ? (
        <Image
          src={project.assets.coverImage}
          alt={`${project.title.en} cover`}
          fill
          sizes={large ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          priority={large}
        />
      ) : (
        <div className={cn("absolute inset-0 bg-gradient-to-br", toneClass[project.cover.tone])} />
      )}
      <div className={cn("absolute inset-0", project.assets.coverImage ? "bg-black/28" : "bg-transparent")} />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/62 to-transparent" />
      <div className="absolute bottom-5 right-5 h-16 w-16 rounded-full border border-white/15 bg-white/[0.05] shadow-glow" />
    </div>
  );
}
