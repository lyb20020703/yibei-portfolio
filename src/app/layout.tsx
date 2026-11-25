import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: {
    default: "Yibei · 作品集",
    template: "%s · Yibei"
  },
  description: "Yibei 的个人作品集，记录 AI 产品、交互设计、AIGC 与游戏创作。",
  applicationName: "Yibei Portfolio",
  icons: {
    icon: { url: "/icon.svg", type: "image/svg+xml" }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
