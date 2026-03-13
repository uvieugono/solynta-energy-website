const benefits = [
  {
    title: "Save Money",
    description: "Eliminate fuel costs and slash your monthly power bills",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          stroke="none"
          fill="currentColor"
        >
          ₦
        </text>
      </svg>
    ),
  },
  {
    title: "Zero Noise",
    description: "Silent power 24/7. No more generator noise pollution",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    ),
  },
  {
    title: "Clean Energy",
    description: "No toxic fumes. Protect your family and the environment",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 22" />
        <path d="M9.5 4.5C9.5 4.5 9 8 13 10C17 12 21 10 21 10C21 10 21 4 15 2C11.5 0.5 9.5 4.5 9.5 4.5Z" />
      </svg>
    ),
  },
  {
    title: "24hr Power",
    description: "Reliable electricity day and night, rain or shine",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

export default function WhySolar() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-solynta-slate text-center mb-10">
          Why Go Solar?
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-solynta-yellow/5 rounded-xl p-6"
            >
              <div className="text-solynta-yellow w-10 h-10 mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-lg text-solynta-slate mb-2">
                {benefit.title}
              </h3>
              <p className="text-solynta-grey text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
