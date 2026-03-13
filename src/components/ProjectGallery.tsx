"use client";

import { useState } from "react";
import { projects, SYSTEM_SIZE_FILTERS, type SystemSize, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";

export default function ProjectGallery() {
  const [activeFilter, setActiveFilter] = useState<"All" | SystemSize>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.systemSize === activeFilter);

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveFilter("All")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === "All"
              ? "bg-solynta-yellow text-solynta-slate"
              : "bg-white text-solynta-grey hover:bg-gray-100 border border-border"
          }`}
        >
          All
        </button>
        {SYSTEM_SIZE_FILTERS.map((size) => (
          <button
            key={size}
            onClick={() => setActiveFilter(size)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === size
                ? "bg-solynta-yellow text-solynta-slate"
                : "bg-white text-solynta-grey hover:bg-gray-100 border border-border"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Detail modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
