# Project Gallery — Design Spec

## Overview

Add a project gallery to the Solynta Energy website showcasing completed solar installations. The gallery appears in two places:

1. **Homepage preview** — 6 featured photos (2 rows x 3 columns) with a "View All Projects" link
2. **Dedicated `/projects` page** — full gallery with filter tabs by system size

## Prerequisites

The 28 image files must exist in `src/app/images/` before implementation begins. These are provided by the user and are already present in the project directory.

## Data Layer

### `src/data/projects.ts`

```ts
import { StaticImageData } from "next/image";

export type SystemSize = "500W" | "1KW" | "2KW" | "4KW" | "10KW" | "Other";

export interface Project {
  id: string;
  location: string;
  systemSize: SystemSize;
  image: StaticImageData;
  featured?: boolean; // true for the 6 homepage preview photos
}
```

The `id` is derived from the image filename, lowercased with spaces replaced by hyphens (e.g., `500w-lagos`).

All 28 images from `src/app/images/` are statically imported and mapped to `Project` entries.

Note: The product catalog includes 1.5KW and 3KW packages, but no current photos represent those sizes. All unidentified photos use `systemSize: "Other"` as the catch-all. If photos for those sizes are added later, the `SystemSize` union and filter tabs should be extended.

### Image-to-metadata mapping

| Image File | systemSize | location |
|---|---|---|
| 500w Lagos.jpg | 500W | Lagos |
| 1KW Lagos.jpg | 1KW | Lagos |
| 1KW Lekki Lagos.jpg | 1KW | Lekki, Lagos |
| 1KW Lekki.jpg | 1KW | Lekki |
| 2KW Imo.jpg | 2KW | Imo |
| 4KW.jpg | 4KW | — |
| Abuja 10KW.jpg | 10KW | Abuja |
| Maidugiri job.jpg | Other | Maiduguri |
| Maidugiri job (1).jpg | Other | Maiduguri |
| nugu.jpg | Other | Enugu |
| nginrr 4.jpg | Other | — |
| img (40).jpg | Other | — |
| IMG_0023.jpg | Other | — |
| IMG_0061.jpg | Other | — |
| IMG_0088.jpg | Other | — |
| IMG_0894.jpg | Other | — |
| IMG_0908.jpg | Other | — |
| IMG_0923.jpg | Other | — |
| IMG_0924.jpg | Other | — |
| IMG_0928.jpg | Other | — |
| IMG_2630.jpg | Other | — |
| IMG_20230123_135713.jpg | Other | — |
| IMG_20230123_135754.jpg | Other | — |
| installation (8).jpg | Other | — |
| installation (10).jpg | Other | — |
| installation (13).jpg | Other | — |
| installation (15).jpg | Other | — |
| installation (32).jpg | Other | — |

Photos without clear metadata get `systemSize: "Other"`. Location `"nugu.jpg"` is assumed to be Enugu (truncated filename).

6 featured photos are selected for homepage variety across sizes/locations:
- 500w Lagos.jpg, 1KW Lekki Lagos.jpg, 2KW Imo.jpg, 4KW.jpg, Abuja 10KW.jpg, installation (8).jpg

## Components

### `src/components/ProjectCard.tsx`

- Displays a single project as a grid thumbnail
- Shows image with `next/image` using `object-cover` and consistent aspect ratio
- On hover: slight scale-up (`scale-105`) with a dark gradient overlay showing system size badge and location text
- `onClick` handler triggers the detail modal
- Props: `project: Project`, `onClick: () => void`

### `src/components/ProjectDetail.tsx`

- Modal overlay that appears when a `ProjectCard` is clicked
- Dark semi-transparent backdrop
- Centered card containing:
  - Larger image view
  - System size badge (styled like existing `solynta-yellow` accents)
  - Location text
  - Close button (X) in top-right corner
- Close on: X button click, backdrop click, Escape key
- Accessibility: `role="dialog"`, `aria-modal="true"`, `aria-label="Close"` on X button, focus moves to modal on open and returns to triggering card on close
- Client component (`"use client"`) for state and event handling
- Props: `project: Project`, `onClose: () => void`

### `src/components/ProjectGallery.tsx`

- Full gallery with filter tabs
- Client component for filter state
- Filter tabs: `All | 500W | 1KW | 2KW | 4KW | 10KW | Other`
  - Horizontal row of pill buttons
  - Active tab: `bg-solynta-yellow text-solynta-slate`
  - Inactive tab: `bg-white text-solynta-grey` with hover effect
- Grid: responsive — 1 col mobile, 2 col tablet, 3 col desktop
- Manages selected project state to show/hide `ProjectDetail` modal
- Imports all projects from `src/data/projects.ts`

### `src/components/GalleryPreview.tsx`

- Homepage section showing 6 featured projects
- Section heading: "Our Projects"
- 2 rows x 3 columns grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each photo rendered as a `ProjectCard`
- Clicking a card opens `ProjectDetail` modal
- `GalleryPreview` is a `"use client"` component (manages modal state), consistent with existing interactive components like `Navbar.tsx` and `PackageCard.tsx`
- "View All Projects" CTA button below the grid, styled consistently with existing buttons:
  - `bg-solynta-yellow text-solynta-slate font-semibold px-8 py-3 rounded-lg hover:opacity-90`
- Links to `/projects`

## Pages

### `/projects` — `src/app/projects/page.tsx`

- Export `metadata: Metadata` with title/description (consistent with `products/page.tsx`)
- Page header with title "Our Projects" and subtitle
- Renders `ProjectGallery` component
- Styling consistent with existing pages (e.g., products page)

### Homepage update — `src/app/page.tsx`

- Add `GalleryPreview` between `Testimonials` and `CTASection`:

```tsx
<Hero />
<WhySolar />
<PopularPackages />
<HowItWorks />
<Testimonials />
<GalleryPreview />  {/* NEW */}
<CTASection />
```

## Navbar Update

Add "Projects" to the nav links in `src/components/Navbar.tsx`:

```ts
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },  // NEW
  { label: "Calculator", href: "/calculator" },
  { label: "Contact", href: "#contact" },
];
```

## Styling Details

All styling uses existing Tailwind classes and brand colors already defined in the project:

- `solynta-yellow`, `solynta-slate`, `solynta-grey`, `solynta-blue` (existing custom colors)
- Gallery section background: `bg-white` (light section, consistent with WhySolar/HowItWorks)
- Card aspect ratio: `aspect-[4/3]` for consistent sizing
- Hover effect: `transition-transform duration-300 hover:scale-105` with overlay `bg-gradient-to-t from-black/60 to-transparent`
- Modal backdrop: `fixed inset-0 bg-black/70 z-50` with flex centering
- Filter tabs: `gap-2 flex-wrap` to handle mobile wrapping
- Section spacing: `py-16 md:py-20` (matches existing sections)

## Files to Create

1. `src/data/projects.ts` — project data with image imports
2. `src/components/ProjectCard.tsx` — thumbnail card component
3. `src/components/ProjectDetail.tsx` — detail modal component
4. `src/components/ProjectGallery.tsx` — full gallery with filters
5. `src/components/GalleryPreview.tsx` — homepage preview section

## Files to Modify

1. `src/app/page.tsx` — add `GalleryPreview` import and render
2. `src/components/Navbar.tsx` — add "Projects" nav link

## Files to Create (Pages)

1. `src/app/projects/page.tsx` — projects page

## Out of Scope

- Image optimization/compression (Next.js handles this automatically)
- CMS integration
- Pagination (28 images don't need it)
- Image upload functionality
