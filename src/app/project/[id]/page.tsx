import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectPageClient from "./ProjectPageClient";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  images: {
    id: string;
    url: string;
    originalName: string;
    filename: string;
    isPrimary: boolean;
    order: number;
  }[];
}

// Server component
export default async function ProjectPage({ params }: { params: { id: string } }) {
  // Fetch data on server
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!project) {
    notFound();
  }

  const allProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    }
  });
  const currentIndex = allProjects.findIndex((p) => p.id === params.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return <ProjectPageClient project={project} nextProject={nextProject} />;
}
