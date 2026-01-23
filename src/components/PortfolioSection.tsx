"use client";

import { useState, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";

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
  images: ProjectImage[];
}

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Photography", "Design", "Commercial", "Architecture", "Fine Art"];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") {
      return projects;
    }
    return projects.filter(project => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  const getCategoryCount = (category: string) => {
    if (category === "All") return projects.length;
    return projects.filter(project => project.category === category).length;
  };

  return (
    <section id="portfolio" className="py-16 md:py-24 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-16 gap-8">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Works</h2>
            <p className="text-foreground/60 max-w-md text-sm sm:text-base">
              A curated collection of projects that define our commitment to visual excellence
              and innovative storytelling.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-accent text-white shadow-md"
                    : "text-foreground/60 hover:text-accent hover:bg-accent/10"
                }`}
              >
                {cat}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === cat
                    ? "bg-white/20"
                    : "bg-accent/20"
                }`}>
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <p className="text-foreground/50 text-lg">
              {selectedCategory === "All"
                ? "No projects available yet. Add your first project through the admin panel."
                : `No projects found in the "${selectedCategory}" category.`
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}