import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { LogoMarquee } from "@/components/logo-marquee";
import { Stats } from "@/components/stats";
import { LiveShifts } from "@/components/live-shifts";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Comparison } from "@/components/comparison";
import { Sectors } from "@/components/sectors";
import { AboutUs } from "@/components/about-us";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

export default function HomePage() {
  return (
    <main>
      <JsonLd />
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Stats />
      <LiveShifts />
      <HowItWorks />
      <Features />
      <Comparison />
      <Sectors />
      <AboutUs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
