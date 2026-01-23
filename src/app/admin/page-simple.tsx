"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, LayoutDashboard, Upload, X, Save, Image as ImageIcon, LogOut, Settings } from "lucide-react";

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

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check");
        if (response.ok) {
          setIsAuthenticated(true);
          fetchProjects();
        } else {
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (Array.isArray(data)) {
      setProjects(data);
    }
  };

  return (
    <div className="pb-12 md:pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2 md:gap-3">
            <LayoutDashboard className="text-accent" /> CMS Dashboard
          </h1>
          <p className="text-foreground/60 mt-1 md:mt-2 text-sm sm:text-base">Manage your portfolio projects</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-full font-medium transition-all text-sm sm:text-base"
          >
            <Settings size={16} /> Profile
          </button>
          <button
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-full font-medium transition-all text-sm sm:text-base"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-zinc-200 dark:border-zinc-800 gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex gap-1 flex-shrink-0">
                  {project.images?.slice(0, 3).map((image, index) => (
                    <div
                      key={image.id}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-200 rounded overflow-hidden relative border-2 border-white dark:border-zinc-900 -ml-1 first:ml-0"
                      style={{ zIndex: 3 - index }}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {project.images && project.images.length > 3 && (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-300 dark:bg-zinc-700 rounded flex items-center justify-center text-xs font-medium -ml-1">
                      +{project.images.length - 3}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold truncate">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-foreground/50">{project.category} • {project.year}</p>
                  <p className="text-xs sm:text-sm text-foreground/60 mt-1 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {project.images?.length || 0} image{(project.images?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                <button
                  onClick={() => {/* TODO: Implement edit */}}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-accent"
                  aria-label={`Edit ${project.title}`}
                  title="Edit project"
                >
                  <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement delete */}}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-500"
                  aria-label={`Delete ${project.title}`}
                  title="Delete project"
                >
                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed">
            <p className="text-foreground/50">No projects found. Add your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}