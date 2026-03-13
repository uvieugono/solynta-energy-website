const steps = [
  {
    number: 1,
    title: "Contact Us",
    description: "Call or chat with us to discuss your power needs",
  },
  {
    number: 2,
    title: "Assessment",
    description: "Our team evaluates your energy requirements",
  },
  {
    number: 3,
    title: "Installation",
    description: "We install your solar system in as little as 7 days",
  },
  {
    number: 4,
    title: "Power On",
    description: "Start enjoying 24/7 clean solar power",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-solynta-slate text-center mb-12">
          Get Started in 4 Steps
        </h2>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center relative">
              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-gray-200">
                  <svg
                    className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-0 text-gray-300"
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                  >
                    <path
                      d="M1 1l6 5-6 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Number circle */}
              <div className="w-12 h-12 rounded-full bg-solynta-yellow text-solynta-slate font-bold flex items-center justify-center text-lg mb-4 shrink-0 z-10">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-solynta-slate mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-solynta-grey">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
