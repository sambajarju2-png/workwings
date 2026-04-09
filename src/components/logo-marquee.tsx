"use client";
import { motion } from "framer-motion";

const companies = [
  "Starbucks", "DHL", "Albert Heijn", "Efteling", "HEMA", "Booking.com",
  "Van der Valk", "Center Parcs", "Flink", "Uniqlo", "Zara", "Gamma",
];

export function LogoMarquee() {
  return (
    <section className="py-12 overflow-hidden bg-surface">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-center text-xs font-bold uppercase tracking-widest mb-6 text-foreground-subtle">
        Vertrouwd door 350+ bedrijven in Nederland
      </motion.p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, var(--color-surface), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, var(--color-surface), transparent)" }} />
        <div className="flex animate-marquee">
          {[...companies, ...companies].map((name, i) => (
            <div key={i} className="flex-shrink-0 mx-8 flex items-center justify-center h-10">
              <span className="text-lg font-bold whitespace-nowrap text-foreground-subtle opacity-50">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
