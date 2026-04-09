import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Sectors } from "@/components/sectors";
import { ForCompanies } from "@/components/for-companies";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Features />
      <Sectors />
      <ForCompanies />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
