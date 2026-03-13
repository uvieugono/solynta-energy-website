"use client";

import { useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";

const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);

export default function GalleryPreview() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-solynta-slate text-center mb-12">
          Our Projects
        </h2>

        {/* 2x3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-block bg-solynta-yellow text-solynta-slate font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            View All Projects
          </Link>
        </div>
      </div>

      {/* Detail modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
