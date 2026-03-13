"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Project } from "@/data/projects";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-solynta-slate transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={project.image}
            alt={`${project.systemSize} Solar Installation${project.location ? ` in ${project.location}` : ""}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Info */}
        <div className="p-4 flex items-center gap-3">
          <span className="inline-block bg-solynta-yellow text-solynta-slate text-sm font-bold px-3 py-1 rounded">
            {project.systemSize}
          </span>
          {project.location && (
            <span className="text-solynta-grey text-sm">{project.location}</span>
          )}
        </div>
      </div>
    </div>
  );
}
