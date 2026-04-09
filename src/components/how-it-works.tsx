"use client";
import { motion } from "framer-motion";
import { UserPlus, Search, CheckCircle, Banknote } from "lucide-react";

const steps = [
  { icon: <UserPlus size={28} />, title: "Maak je profiel", desc: "In 2 minuten klaar. Voeg je KVK-nummer, skills en beschikbaarheid toe.", color: "#EF476F" },
  { icon: <Search size={28} />, title: "Vind shifts", desc: "AI matcht je met shifts op basis van locatie, ervaring en voorkeuren.", color: "#A7DADC" },
  { icon: <CheckCircle size={28} />, title: "Check in & werk", desc: "GPS check-in op locatie. Chat direct met je opdrachtgever.", color: "#EF476F" },
  { icon: <Banknote size={28} />, title: "Krijg betaald", desc: "Uren goedgekeurd? Direct op je rekening. Geen 14 dagen wachten.", color: "#A7DADC" },
];

export function HowItWorks() {
  return (
    <section id="hoe-werkt-het" className="py-24 relative" style={{ background: "#023047" }}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(239,71,111,0.3), transparent)" }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>
            Hoe het werkt
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4">
            Van aanmelden tot betalen<br />
            in <span style={{ color: "#A7DADC" }}>4 stappen</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="relative p-6 rounded-2xl text-center group"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: step.color }}>
                {i + 1}
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${step.color}20`, color: step.color }}>
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
