"use client";

import Image from "next/image";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer w-full"
    >
      <Image
        src={project.image}
        alt={`${project.systemSize} Solar Installation${project.location ? ` in ${project.location}` : ""}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div>
          <span className="inline-block bg-solynta-yellow text-solynta-slate text-xs font-bold px-2 py-1 rounded">
            {project.systemSize}
          </span>
          {project.location && (
            <p className="text-white text-sm mt-1">{project.location}</p>
          )}
        </div>
      </div>
    </button>
  );
}
