import Hero from "@/components/Hero";
import WhySolar from "@/components/WhySolar";
import PopularPackages from "@/components/PopularPackages";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhySolar />
      <PopularPackages />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </main>
  );
}
