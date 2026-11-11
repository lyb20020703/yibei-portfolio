import { Hero } from "@/components/sections/hero";
import { ProfileSection } from "@/components/home/profile-section";
import { StatsSection } from "@/components/home/stats-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { SkillsSection } from "@/components/home/skills-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProfileSection />
      <StatsSection />
      <ExperienceSection />
      <SkillsSection />
    </>
  );
}
