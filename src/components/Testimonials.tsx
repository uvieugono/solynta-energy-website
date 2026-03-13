const testimonials = [
  {
    quote:
      "Since installing Solynta, we haven't used our generator once. The savings on fuel alone have been incredible.",
    name: "Mrs. Adeyemi",
    location: "Lagos",
    system: "2KW System",
  },
  {
    quote:
      "No more fuel runs, no more generator noise. Just clean, quiet power every day.",
    name: "Mr. Okafor",
    location: "Abuja",
    system: "2KW System",
  },
  {
    quote:
      "The installation was quick and professional. We've had 24-hour power for 6 months now.",
    name: "Mrs. Ibrahim",
    location: "Kano",
    system: "1.5KW System",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-solynta-slate py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          What Our Customers Say
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border-l-4 border-solynta-yellow"
            >
              {/* Quote */}
              <p className="italic text-white mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">
                  {testimonial.location} &middot; {testimonial.system}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
