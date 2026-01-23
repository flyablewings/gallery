"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ImageViewer from "@/components/ImageViewer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

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

interface ProjectPageClientProps {
  project: Project;
  nextProject: Project;
}

export default function ProjectPageClient({ project, nextProject }: ProjectPageClientProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImageIndex, setViewerImageIndex] = useState(0);

  const openViewer = (imageIndex: number) => {
    setViewerImageIndex(imageIndex);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold mb-12 hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} /> Back to Gallery
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-sm uppercase tracking-widest text-foreground/50">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-accent" />
                    {project.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-accent" />
                    {project.year}
                  </div>
                </div>
              </div>

              <div className="text-xl text-foreground/70 leading-relaxed">
                <p>{project.description}</p>
              </div>

              <div className="pt-8 border-t">
                <h4 className="font-bold mb-4">Project Overview</h4>
                <p className="text-foreground/60 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Primary Image */}
              {project.images && project.images.length > 0 && (
                <div
                  className="relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow duration-300"
                  onClick={() => openViewer(0)}
                >
                  <Image
                    src={project.images.find(img => img.isPrimary)?.url || project.images[0].url}
                    alt={project.title}
                    fill
                    className="object-cover hover:scale-[1.02] transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {/* Click to view overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                      Click to view
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Images Grid */}
              {project.images && project.images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.images.slice(1).map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => openViewer(index + 1)}
                    >
                      <Image
                        src={image.url}
                        alt={`${project.title} - ${image.originalName}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      {/* Click to view overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                          View
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={project.images}
        initialIndex={viewerImageIndex}
        projectTitle={project.title}
        isOpen={viewerOpen}
        onClose={closeViewer}
      />

      {/* More Projects Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950 border-t">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-12">Next Project</h2>
          <div className="inline-block group">
             <Link href={`/project/${nextProject.id}`} className="text-5xl md:text-8xl font-bold tracking-tighter hover:text-accent transition-all duration-300">
                {nextProject.title}
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}