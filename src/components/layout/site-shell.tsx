"use client";

import { NavBar } from "@/components/navigation/nav-bar";
import { SiteFooter } from "@/components/layout/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <div className="noise-layer fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[38rem] bg-radial-noise opacity-80" />
      <NavBar />
      <main className="relative z-10 pt-[7.25rem] md:pt-[4.5rem]">{children}</main>
      <SiteFooter />
    </div>
  );
}
