import Link from "next/link";
import { packages } from "@/data/packages";
import PackageCard from "@/components/PackageCard";

const FEATURED_SLUGS = ["padi-pack", "oga-boss-pack", "4kw-pack"];

export default function PopularPackages() {
  const featured = FEATURED_SLUGS.map(
    (slug) => packages.find((p) => p.slug === slug)!
  ).filter(Boolean);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-solynta-slate text-center mb-12">
          Popular Packages
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="text-solynta-blue hover:underline font-medium"
          >
            View All Packages &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
