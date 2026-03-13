import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { packages, getPackageBySlug, formatNaira } from "@/data/packages";
import PackageCard from "@/components/PackageCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return { title: "Package Not Found | Solynta Energy" };
  return {
    title: `${pkg.name} (${pkg.size}) | Solynta Energy`,
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  // Find related packages (previous and next by index)
  const currentIndex = packages.findIndex((p) => p.slug === slug);
  const prevPkg = currentIndex > 0 ? packages[currentIndex - 1] : packages[packages.length - 1];
  const nextPkg = currentIndex < packages.length - 1 ? packages[currentIndex + 1] : packages[0];
  const relatedPackages = [prevPkg, nextPkg].filter((p) => p.slug !== pkg.slug);

  return (
    <main className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="text-solynta-blue hover:underline font-medium"
          >
            &larr; Back to Packages
          </Link>
        </div>

        {/* Page heading */}
        <h1 className="text-4xl font-bold text-solynta-slate mb-8">
          {pkg.name}{" "}
          <span className="text-solynta-grey font-normal text-2xl">
            ({pkg.size})
          </span>
        </h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Connection fee */}
            <section>
              <p className="text-5xl font-bold text-solynta-yellow">
                {formatNaira(pkg.connectionFee)}
              </p>
              <p className="text-solynta-grey mt-1 text-sm uppercase tracking-wide font-semibold">
                Connection Fee
              </p>
            </section>

            {/* Subscription pricing table */}
            <section>
              <h2 className="text-xl font-bold text-solynta-slate mb-4">
                Subscription Plans
              </h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-sm font-semibold text-solynta-grey uppercase tracking-wide">
                      Plan
                    </th>
                    <th className="pb-2 text-sm font-semibold text-solynta-grey uppercase tracking-wide text-right">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-solynta-slate">7-day plan</td>
                    <td className="py-3 text-solynta-slate font-semibold text-right">
                      {formatNaira(pkg.subscription7day)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-solynta-slate">28-day plan</td>
                    <td className="py-3 text-solynta-slate font-semibold text-right">
                      {formatNaira(pkg.subscription28day)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* System specs — 3-column stat grid */}
            <section>
              <h2 className="text-xl font-bold text-solynta-slate mb-4">
                System Specifications
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-solynta-slate">
                    {pkg.pvOutputKwh}
                  </p>
                  <p className="text-xs text-solynta-grey mt-1 uppercase tracking-wide font-semibold">
                    kWh/day
                  </p>
                  <p className="text-sm text-solynta-grey mt-0.5">PV Output</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-solynta-slate">
                    {pkg.batteryCapacityKwh}
                  </p>
                  <p className="text-xs text-solynta-grey mt-1 uppercase tracking-wide font-semibold">
                    kWh
                  </p>
                  <p className="text-sm text-solynta-grey mt-0.5">Battery</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-solynta-slate">
                    {pkg.storageKwh}
                  </p>
                  <p className="text-xs text-solynta-grey mt-1 uppercase tracking-wide font-semibold">
                    kWh
                  </p>
                  <p className="text-sm text-solynta-grey mt-0.5">
                    Usable Storage
                  </p>
                </div>
              </div>
            </section>

            {/* Appliance list */}
            <section>
              <h2 className="text-xl font-bold text-solynta-slate mb-4">
                What you can power
              </h2>
              <ul className="space-y-2">
                {pkg.appliances.map((appliance) => (
                  <li
                    key={appliance.name}
                    className="flex items-center gap-3 text-solynta-slate"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-solynta-yellow text-solynta-slate font-bold rounded-full text-sm flex-shrink-0">
                      {appliance.quantity}
                    </span>
                    <span>{appliance.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right column — sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
              <h2 className="text-xl font-bold text-solynta-slate">
                Get Started
              </h2>
              <p className="text-sm text-solynta-grey">
                Ready to switch to solar? Connect with our team today.
              </p>
              <a
                href="#"
                className="block w-full bg-solynta-yellow text-solynta-slate text-center font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </a>
              <Link
                href="/calculator"
                className="block w-full text-center text-solynta-blue font-medium py-2 rounded-lg border border-solynta-yellow hover:bg-yellow-50 transition-colors"
              >
                Try our Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        {pkg.faq.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-solynta-slate mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-0">
              {pkg.faq.map((item, index) => (
                <details
                  key={index}
                  className="group border-b border-gray-200 py-4"
                >
                  <summary className="flex justify-between items-center cursor-pointer list-none text-solynta-slate font-medium hover:text-solynta-blue transition-colors">
                    {item.question}
                    <span className="ml-4 flex-shrink-0 text-solynta-grey group-open:rotate-180 transition-transform duration-200">
                      &#9660;
                    </span>
                  </summary>
                  <p className="mt-3 text-solynta-grey text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related packages */}
        {relatedPackages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-solynta-slate mb-6">
              Other Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPackages.map((relPkg) => (
                <PackageCard key={relPkg.slug} pkg={relPkg} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
