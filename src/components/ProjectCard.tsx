"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ProjectImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  year: string;
  images?: ProjectImage[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  // Get the primary image or the first image
  const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0];

  if (!primaryImage) {
    return null; // Don't render if no images
  }

  return (
    <Link href={`/project/${project.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden aspect-[4/5] bg-gray-100 dark:bg-zinc-900 cursor-pointer rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <Image
          src={primaryImage.url}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <span className="text-white/80 text-xs uppercase tracking-widest mb-2 font-medium">
            {project.category}
          </span>
          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Static Info for Mobile */}
        <div className="sm:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
          <h3 className="text-sm font-bold line-clamp-1">{project.title}</h3>
          <p className="text-xs text-white/80 uppercase tracking-wider">{project.category} • {project.year}</p>
        </div>

        {/* Desktop hover indicator */}
        <div className="hidden sm:block absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg transition-colors duration-300 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
