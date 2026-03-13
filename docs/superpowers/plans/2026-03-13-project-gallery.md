# Project Gallery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a project gallery showcasing 28 solar installation photos, with a 6-photo homepage preview and a full filterable `/projects` page.

**Architecture:** Static image imports in a data file (`projects.ts`), rendered via reusable `ProjectCard` and `ProjectDetail` components. `GalleryPreview` shows 6 featured photos on the homepage. `ProjectGallery` renders the full filterable grid on `/projects`. All client-side interactivity (filters, modal) uses `"use client"` components.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `next/image`

**Spec:** `docs/superpowers/specs/2026-03-13-project-gallery-design.md`

---

## File Structure

### Files to Create

| File | Responsibility |
|------|---------------|
| `src/data/projects.ts` | Project interface, SystemSize type, static image imports, project metadata array |
| `src/components/ProjectCard.tsx` | Single project thumbnail with hover overlay |
| `src/components/ProjectDetail.tsx` | Modal detail view for a selected project |
| `src/components/ProjectGallery.tsx` | Full gallery with filter tabs, manages modal state |
| `src/components/GalleryPreview.tsx` | Homepage 6-photo preview section with CTA |
| `src/app/projects/page.tsx` | `/projects` route page |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/Navbar.tsx:8-13` | Add "Projects" nav link |
| `src/app/page.tsx:1-19` | Import and render `GalleryPreview` |

---

## Chunk 1: Data Layer + Components

### Task 1: Create project data file

**Files:**
- Create: `src/data/projects.ts`

Image filenames contain spaces and parentheses, so imports must use string aliases. Next.js static imports handle `.jpg` files automatically.

- [ ] **Step 1: Create `src/data/projects.ts` with all 28 image imports and project entries**

```ts
import { StaticImageData } from "next/image";

// Image imports
import img500wLagos from "@/app/images/500w Lagos.jpg";
import img1kwLagos from "@/app/images/1KW Lagos.jpg";
import img1kwLekkiLagos from "@/app/images/1KW Lekki Lagos.jpg";
import img1kwLekki from "@/app/images/1KW Lekki.jpg";
import img2kwImo from "@/app/images/2KW Imo.jpg";
import img4kw from "@/app/images/4KW.jpg";
import imgAbuja10kw from "@/app/images/Abuja 10KW.jpg";
import imgMaiduguri from "@/app/images/Maidugiri job.jpg";
import imgMaiduguri1 from "@/app/images/Maidugiri job (1).jpg";
import imgNugu from "@/app/images/nugu.jpg";
import imgNginrr from "@/app/images/nginrr 4.jpg";
import img40 from "@/app/images/img (40).jpg";
import img0023 from "@/app/images/IMG_0023.jpg";
import img0061 from "@/app/images/IMG_0061.jpg";
import img0088 from "@/app/images/IMG_0088.jpg";
import img0894 from "@/app/images/IMG_0894.jpg";
import img0908 from "@/app/images/IMG_0908.jpg";
import img0923 from "@/app/images/IMG_0923.jpg";
import img0924 from "@/app/images/IMG_0924.jpg";
import img0928 from "@/app/images/IMG_0928.jpg";
import img2630 from "@/app/images/IMG_2630.jpg";
import img20230123a from "@/app/images/IMG_20230123_135713.jpg";
import img20230123b from "@/app/images/IMG_20230123_135754.jpg";
import imgInst8 from "@/app/images/installation (8).jpg";
import imgInst10 from "@/app/images/installation (10).jpg";
import imgInst13 from "@/app/images/installation (13).jpg";
import imgInst15 from "@/app/images/installation (15).jpg";
import imgInst32 from "@/app/images/installation (32).jpg";

export type SystemSize = "500W" | "1KW" | "2KW" | "4KW" | "10KW" | "Other";

export interface Project {
  id: string;
  location: string;
  systemSize: SystemSize;
  image: StaticImageData;
  featured?: boolean;
}

export const projects: Project[] = [
  // --- Known system sizes ---
  { id: "500w-lagos", location: "Lagos", systemSize: "500W", image: img500wLagos, featured: true },
  { id: "1kw-lagos", location: "Lagos", systemSize: "1KW", image: img1kwLagos },
  { id: "1kw-lekki-lagos", location: "Lekki, Lagos", systemSize: "1KW", image: img1kwLekkiLagos, featured: true },
  { id: "1kw-lekki", location: "Lekki", systemSize: "1KW", image: img1kwLekki },
  { id: "2kw-imo", location: "Imo", systemSize: "2KW", image: img2kwImo, featured: true },
  { id: "4kw", location: "", systemSize: "4KW", image: img4kw, featured: true },
  { id: "abuja-10kw", location: "Abuja", systemSize: "10KW", image: imgAbuja10kw, featured: true },

  // --- Known locations, unknown size ---
  { id: "maiduguri-job", location: "Maiduguri", systemSize: "Other", image: imgMaiduguri },
  { id: "maiduguri-job-1", location: "Maiduguri", systemSize: "Other", image: imgMaiduguri1 },
  { id: "nugu", location: "Enugu", systemSize: "Other", image: imgNugu },

  // --- Generic installations ---
  { id: "nginrr-4", location: "", systemSize: "Other", image: imgNginrr },
  { id: "img-40", location: "", systemSize: "Other", image: img40 },
  { id: "img-0023", location: "", systemSize: "Other", image: img0023 },
  { id: "img-0061", location: "", systemSize: "Other", image: img0061 },
  { id: "img-0088", location: "", systemSize: "Other", image: img0088 },
  { id: "img-0894", location: "", systemSize: "Other", image: img0894 },
  { id: "img-0908", location: "", systemSize: "Other", image: img0908 },
  { id: "img-0923", location: "", systemSize: "Other", image: img0923 },
  { id: "img-0924", location: "", systemSize: "Other", image: img0924 },
  { id: "img-0928", location: "", systemSize: "Other", image: img0928 },
  { id: "img-2630", location: "", systemSize: "Other", image: img2630 },
  { id: "img-20230123a", location: "", systemSize: "Other", image: img20230123a },
  { id: "img-20230123b", location: "", systemSize: "Other", image: img20230123b },
  { id: "installation-8", location: "", systemSize: "Other", image: imgInst8, featured: true },
  { id: "installation-10", location: "", systemSize: "Other", image: imgInst10 },
  { id: "installation-13", location: "", systemSize: "Other", image: imgInst13 },
  { id: "installation-15", location: "", systemSize: "Other", image: imgInst15 },
  { id: "installation-32", location: "", systemSize: "Other", image: imgInst32 },
];

export const SYSTEM_SIZE_FILTERS: SystemSize[] = ["500W", "1KW", "2KW", "4KW", "10KW", "Other"];
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd c:/Users/pc/OneDrive/Desktop/Desktop/solynta-energy-website && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/projects.ts
git commit -m "feat: add project gallery data with 28 image imports"
```

---

### Task 2: Create ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.tsx`

Reference patterns: `PackageCard.tsx` uses `"use client"`, interface props, Tailwind classes.

- [ ] **Step 1: Create `src/components/ProjectCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat: add ProjectCard component with hover overlay"
```

---

### Task 3: Create ProjectDetail modal component

**Files:**
- Create: `src/components/ProjectDetail.tsx`

- [ ] **Step 1: Create `src/components/ProjectDetail.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectDetail.tsx
git commit -m "feat: add ProjectDetail modal with accessibility"
```

---

### Task 4: Create ProjectGallery component (full page gallery with filters)

**Files:**
- Create: `src/components/ProjectGallery.tsx`

- [ ] **Step 1: Create `src/components/ProjectGallery.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectGallery.tsx
git commit -m "feat: add ProjectGallery with filter tabs and modal"
```

---

### Task 5: Create GalleryPreview component (homepage section)

**Files:**
- Create: `src/components/GalleryPreview.tsx`

- [ ] **Step 1: Create `src/components/GalleryPreview.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GalleryPreview.tsx
git commit -m "feat: add GalleryPreview homepage section"
```

---

## Chunk 2: Pages + Integration

### Task 6: Create `/projects` page

**Files:**
- Create: `src/app/projects/page.tsx`

Reference: `src/app/products/page.tsx` for metadata pattern and page structure.

- [ ] **Step 1: Create `src/app/projects/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/projects/page.tsx
git commit -m "feat: add /projects page"
```

---

### Task 7: Add GalleryPreview to homepage

**Files:**
- Modify: `src/app/page.tsx:1-19`

- [ ] **Step 1: Add import and render GalleryPreview between Testimonials and CTASection**

In `src/app/page.tsx`, add the import after the existing imports (after line 6):
```tsx
import GalleryPreview from "@/components/GalleryPreview";
```

Then add `<GalleryPreview />` between `<Testimonials />` and `<CTASection />`:
```tsx
      <Testimonials />
      <GalleryPreview />
      <CTASection />
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add gallery preview to homepage"
```

---

### Task 8: Add "Projects" link to navbar

**Files:**
- Modify: `src/components/Navbar.tsx:8-13`

- [ ] **Step 1: Add Projects to navLinks array**

In `src/components/Navbar.tsx`, update the `navLinks` array (line 8-13) to include Projects:
```ts
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Calculator", href: "/calculator" },
  { label: "Contact", href: "#contact" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Projects link to navbar"
```

---

### Task 9: Build verification

- [ ] **Step 1: Run the build**

Run: `cd c:/Users/pc/OneDrive/Desktop/Desktop/solynta-energy-website && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run dev server and manually verify**

Run: `cd c:/Users/pc/OneDrive/Desktop/Desktop/solynta-energy-website && npm run dev`

Verify:
- Homepage shows "Our Projects" section with 6 photos
- Clicking a photo opens the detail modal
- "View All Projects" button links to `/projects`
- `/projects` page shows all 28 photos with working filter tabs
- "Projects" link appears in navbar and highlights when active
- Modal closes on X click, backdrop click, and Escape key

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build issues from gallery integration"
```
