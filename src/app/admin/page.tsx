"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, LayoutDashboard, Upload, X, Save, Image as ImageIcon, LogOut, Settings } from "lucide-react";
import Image from "next/image";

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
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    year: new Date().getFullYear().toString(),
  });
  const [uploadedImages, setUploadedImages] = useState<ProjectImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available project categories
  const categories = [
    { value: "all", label: "All Projects" },
    { value: "Photography", label: "Photography" },
    { value: "Design", label: "Design" },
    { value: "Architecture", label: "Architecture" },
    { value: "Fine Art", label: "Fine Art" },
    { value: "Commercial", label: "Commercial" },
  ];

  // Filter projects based on selected category
  const filteredProjects = filterCategory === "all"
    ? projects
    : projects.filter(project => project.category === filterCategory);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

    if (response.ok) {
      // Clear any local state
      setIsAuthenticated(false);
      setProjects([]);
      setEditingProject(null);
      setIsAdding(false);
      setFilterCategory("all");

        // Redirect to login page
        router.push("/admin/login");
      } else {
        console.error("Logout failed");
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

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

  const handleFileUpload = async (files: FileList): Promise<void> => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formDataUpload = new FormData();
    Array.from(files).forEach(file => {
      formDataUpload.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        const newImages: ProjectImage[] = data.files.map((file: any, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          filename: file.filename,
          originalName: file.originalName,
          url: file.url,
          isPrimary: uploadedImages.length === 0 && index === 0, // First image is primary by default
          order: uploadedImages.length + index,
        }));
        setUploadedImages([...uploadedImages, ...newImages]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (image: ProjectImage): Promise<void> => {
    const confirmed = confirm(`Are you sure you want to remove this image: ${image.originalName}?`);
    if (!confirmed) return;

    setRemovingImageId(image.id);

    try {
      if (image.id.startsWith("temp-")) {
        // Remove from uploaded images array (client-side only)
        setUploadedImages(prevImages => {
          const updatedImages = prevImages.filter(img => img.id !== image.id);
          // If we removed the primary image, set the first remaining image as primary
          if (image.isPrimary && updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
            updatedImages[0].isPrimary = true;
          }
          return updatedImages;
        });
        console.log(`Removed temporary image: ${image.originalName}`);
      } else {
        // Delete from server for existing images
        console.log(`Deleting image from server: ${image.filename}`);
        const response = await fetch("/api/images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: image.filename }),
        });

        if (response.ok) {
          // Remove from uploaded images array
          setUploadedImages(prevImages => {
            const updatedImages = prevImages.filter(img => img.id !== image.id);
            // If we removed the primary image, set the first remaining image as primary
            if (image.isPrimary && updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
              updatedImages[0].isPrimary = true;
            }
            return updatedImages;
          });
          console.log(`Successfully deleted image: ${image.filename}`);
        } else {
          const errorData = await response.json();
          console.error("Failed to delete image:", errorData.error);
          alert(`Failed to delete image: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error("Error removing image:", error);
      alert("An error occurred while removing the image");
    } finally {
      setRemovingImageId(null);
    }
  };

  const setPrimaryImage = (imageId: string): void => {
    setUploadedImages(uploadedImages.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const projectData = {
      ...formData,
      images: uploadedImages.map((img, index) => ({
        filename: img.filename,
        originalName: img.originalName,
        url: img.url,
        isPrimary: img.isPrimary,
        order: index,
      }))
    };

    const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
    const method = editingProject ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      year: new Date().getFullYear().toString(),
    });
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      year: project.year,
    });
    setUploadedImages(project.images || []);
    setIsAdding(true);

    // Scroll to top to show the edit form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
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
            onClick={handleLogout}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2.5 rounded-full font-medium transition-all text-sm sm:text-base"
          >
            <LogOut size={16} /> Logout
          </button>
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              if (!isAdding) {
                setEditingProject(null);
                resetForm();
              }
            }}
            className="flex items-center gap-2 bg-accent text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-yellow-600 transition-all text-sm sm:text-base flex-1 sm:flex-none justify-center"
          >
            <Plus size={16} /> {isAdding ? "Cancel" : "Add New Project"}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">
            {editingProject ? "Edit Project" : "New Project Details"}
          </h2>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label htmlFor="image-upload" className="block text-sm font-medium mb-3">Project Images</label>

            {/* Upload Button */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
              <p className="text-xs text-foreground/50 mt-1">Supported formats: JPG, PNG, GIF. Max 5MB each.</p>
            </div>

            {/* Image Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.originalName}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Primary badge */}
                    {image.isPrimary && (
                      <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}

                    {/* Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 rounded-lg">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(image.id)}
                          className="bg-accent text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                          title="Set as primary image"
                        >
                          <ImageIcon size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        disabled={removingImageId === image.id}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                        title="Remove image"
                      >
                        {removingImageId === image.id ? (
                          <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <X size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="project-title" className="block text-sm font-medium mb-1">Project Title</label>
                <input
                  id="project-title"
                  required
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="project-category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="project-category"
                  required
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option value="Photography">Photography</option>
                  <option value="Design">Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Commercial">Commercial</option>
                  <option value="3D Art">3D Art</option>
                </select>
              </div>
              <div>
                <label htmlFor="project-year" className="block text-sm font-medium mb-1">Year</label>
                <input
                  id="project-year"
                  required
                  type="number"
                  min="2000"
                  max="2030"
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="project-description"
                  required
                  rows={6}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base resize-vertical"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="px-4 sm:px-6 py-2 border rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadedImages.length === 0}
                className="px-6 sm:px-8 py-2 bg-accent text-white rounded-full font-bold hover:bg-yellow-600 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={16} />
                {editingProject ? "Update Project" : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setFilterCategory(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filterCategory === category.value
                ? "bg-accent text-white shadow-md"
                : "bg-white dark:bg-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-600"
            }`}
          >
            {category.label}
            {category.value !== "all" && (
              <span className="ml-2 px-2 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full text-xs">
                {projects.filter(p => p.category === category.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
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
                  onClick={() => startEditing(project)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-accent transition-colors"
                  aria-label={`Edit ${project.title}`}
                  title="Edit project"
                >
                  <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
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
            <p className="text-foreground/50">
              {filterCategory === "all"
                ? "No projects found. Add your first project to get started!"
                : `No projects found in the "${categories.find(c => c.value === filterCategory)?.label}" category.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}