import Link from "next/link";
import { Package, formatNaira } from "@/data/packages";

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
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

      {/* CTA */}
      <Link
        href={`/products/${pkg.slug}`}
        className="block w-full bg-solynta-yellow text-solynta-slate text-center font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
      >
        View Details
      </Link>
    </div>
  );
}
