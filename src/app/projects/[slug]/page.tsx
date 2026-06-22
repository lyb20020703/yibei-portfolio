import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getProject, projects } from "@/data/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
