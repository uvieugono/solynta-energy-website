import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-solynta-yellow py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Headline */}
        <h2 className="text-solynta-slate text-3xl md:text-4xl font-bold mb-4">
          Not Sure Which Package?
        </h2>

        {/* Subtext */}
        <p className="text-solynta-slate/80 text-lg mb-8">
          Our Solar Calculator tells you exactly what you need
        </p>

        {/* Button */}
        <Link
          href="/calculator"
          className="inline-block bg-white text-solynta-slate font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Try the Calculator
        </Link>
      </div>
    </section>
  );
}
