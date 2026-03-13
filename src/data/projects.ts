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
