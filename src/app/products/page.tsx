import type { Metadata } from "next";
import Link from "next/link";
import { packages } from "@/data/packages";
import PackageCard from "@/components/PackageCard";

export const metadata: Metadata = {
  title: "Solar Packages | Solynta Energy",
};

export default function ProductsPage() {
  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-solynta-slate mb-3">
            Solar Subscription Packages
          </h1>
          <p className="text-lg text-solynta-grey">
            Choose the right system for your home
          </p>
        </div>

        {/* 3x2 package grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href="/calculator"
            className="text-solynta-blue font-medium hover:underline"
          >
            Not sure which package? Try our Solar Calculator &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
