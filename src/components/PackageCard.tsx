"use client";

import Link from "next/link";
import { Package, formatNaira } from "@/data/packages";

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const handleGetStarted = () => {
    window.dispatchEvent(
      new CustomEvent("open-chat", {
        detail: { message: `I'm interested in the ${pkg.name} (${pkg.size}) package` },
      })
    );
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Popular badge */}
      {pkg.popular && (
        <span className="absolute top-3 right-3 bg-solynta-yellow text-solynta-slate text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </span>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-xl text-solynta-slate">{pkg.name}</h3>
          <span className="text-sm bg-gray-100 text-solynta-grey px-2 py-1 rounded">
            {pkg.size}
          </span>
        </div>
      </div>

      {/* Connection fee */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-solynta-slate">
          {formatNaira(pkg.connectionFee)}
        </p>
        <p className="text-sm text-solynta-grey mt-0.5">Connection Fee</p>
      </div>

      {/* Subscription rates */}
      <div className="mb-4 space-y-1">
        <p className="text-sm text-solynta-grey">
          <span className="font-medium text-solynta-slate">
            {formatNaira(pkg.subscription7day)}
          </span>{" "}
          / 7 days
        </p>
        <p className="text-sm text-solynta-grey">
          <span className="font-medium text-solynta-slate">
            {formatNaira(pkg.subscription28day)}
          </span>{" "}
          / 28 days
        </p>
      </div>

      {/* Appliances */}
      <div className="mb-6 flex-1">
        <p className="text-xs text-solynta-grey uppercase tracking-wide font-semibold mb-2">
          Supports
        </p>
        <div className="flex flex-wrap gap-1.5">
          {pkg.appliances.map((appliance) => (
            <span
              key={appliance.name}
              className="text-xs bg-gray-100 text-solynta-grey px-2 py-1 rounded"
            >
              {appliance.quantity}x {appliance.name}
            </span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-2">
        <Link
          href={`/products/${pkg.slug}`}
          className="flex-1 bg-solynta-yellow text-solynta-slate text-center font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          View Details
        </Link>
        <button
          onClick={handleGetStarted}
          className="flex-1 border border-solynta-yellow text-solynta-slate text-center font-semibold py-2.5 rounded-lg hover:bg-solynta-yellow/20 transition-colors text-sm"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
