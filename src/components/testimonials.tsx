"use client";
import { motion } from "framer-motion";
import { Rocket, ArrowRight } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-background-alt">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(167,218,220,0.1)", border: "1px solid rgba(167,218,220,0.2)" }}>
            <Rocket size={14} style={{ color: "#A7DADC" }} />
            <span className="text-sm font-semibold" style={{ color: "#A7DADC" }}>Early Access</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            We zijn net <span style={{ color: "#EF476F" }}>gelanceerd</span>
          </h2>
          <p className="text-base md:text-lg text-foreground-muted leading-relaxed mb-8 max-w-xl mx-auto">
            WorkWings is nieuw en groeit snel. Sluit je nu aan als early adopter
            en profiteer van persoonlijke onboarding, directe support, en de laagste fees in de markt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/signup/worker"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-6 py-3.5 rounded-xl text-white font-bold text-sm flex items-center gap-2"
              style={{ background: "#EF476F" }}
            >
              Meld je aan als freelancer
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="/signup/company"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-foreground"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              Meld je aan als bedrijf
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
