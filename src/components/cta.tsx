"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section id="aanmelden" className="py-24 px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #023047 0%, #012A3E 50%, #0A1628 100%)" }}>
      {/* Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full animate-float"
        style={{ background: "radial-gradient(circle, rgba(239,71,111,0.12), transparent)" }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full animate-float"
        style={{ background: "radial-gradient(circle, rgba(167,218,220,0.1), transparent)", animationDelay: "2s" }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(239,71,111,0.15)", border: "1px solid rgba(239,71,111,0.3)" }}>
            <Sparkles size={14} style={{ color: "#EF476F" }} />
            <span className="text-sm font-semibold" style={{ color: "#EF476F" }}>Gratis aanmelden</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Klaar om te<br />
            <span style={{ color: "#EF476F" }}>beginnen?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "rgba(167,218,220,0.8)" }}>
            Meld je vandaag aan. Morgen al je eerste shift werken.
            Geen verplichtingen, geen contracten, geen gedoe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/signup/worker"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center gap-2 animate-pulse-glow"
              style={{ background: "#EF476F" }}
            >
              Ik wil werken <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="/signup/company"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Ik zoek personeel
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
