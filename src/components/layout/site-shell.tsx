"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/navigation/nav-bar";
import { getProject } from "@/data/site";

function activeCategoryFromPath(pathname: string) {
  const match = pathname.match(/^\/projects\/([^/]+)/);
  if (!match) {
    return pathname === "/" ? "home" : undefined;
  }

  return getProject(match[1])?.category;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeCategory = activeCategoryFromPath(pathname);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <div className="noise-layer fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[38rem] bg-radial-noise opacity-80" />
      <NavBar activeCategory={activeCategory} />
      <main className="relative z-10 pt-[7.25rem] md:pt-[4.5rem]">{children}</main>
    </div>
  );
}
