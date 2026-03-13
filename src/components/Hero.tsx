import Link from "next/link";

const stats = [
  { number: "26", label: "States Served" },
  { number: "2,000+", label: "MW Deployed" },
  { number: "1,000+", label: "Happy Customers" },
];

export default function Hero() {
  return (
    <section className="bg-solynta-slate text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4">
        {/* Headline & CTAs */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Displace Your Generator. Go Solar Today.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Join 1,000+ Nigerian homes powered by clean, affordable solar energy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-solynta-yellow text-solynta-slate font-semibold px-8 py-3 rounded hover:opacity-90 transition-opacity"
            >
              View Packages
            </Link>
            <Link
              href="/calculator"
              className="border-2 border-solynta-blue text-solynta-blue font-semibold px-8 py-3 rounded hover:bg-solynta-blue hover:text-white transition-colors"
            >
              Calculate Savings
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 flex flex-wrap justify-center divide-x divide-gray-600">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-4 text-center">
              <div className="text-solynta-yellow text-3xl font-bold">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
