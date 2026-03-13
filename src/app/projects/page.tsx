import type { Metadata } from "next";
import ProjectGallery from "@/components/ProjectGallery";

export const metadata: Metadata = {
  title: "Our Projects | Solynta Energy",
  description: "Browse our completed solar installations across Nigeria.",
};

export default function ProjectsPage() {
  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-solynta-slate mb-3">
            Our Projects
          </h1>
          <p className="text-lg text-solynta-grey">
            Browse our completed solar installations across Nigeria
          </p>
        </div>

        {/* Gallery */}
        <ProjectGallery />
      </div>
    </main>
  );
}
