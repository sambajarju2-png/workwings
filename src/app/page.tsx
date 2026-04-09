import { Hero } from "@/components/hero";
import { LogoMarquee } from "@/components/logo-marquee";
import { Stats } from "@/components/stats";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Comparison } from "@/components/comparison";
import { Sectors } from "@/components/sectors";
import { ForCompanies } from "@/components/for-companies";
import { AboutUs } from "@/components/about-us";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { JsonLd } from "@/components/json-ld";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <JsonLd />
      <Navbar />
      <Hero />
      <LogoMarquee />
      <Stats />
      <HowItWorks />
      <Features />
      <Comparison />
      <Sectors />
      <ForCompanies />
      <AboutUs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
