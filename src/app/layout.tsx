import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/language-context";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Portfolio System",
  description: "AIGC product, user experience, and AI video portfolio."
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
