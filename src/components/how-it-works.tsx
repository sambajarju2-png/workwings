"use client";
import { motion } from "framer-motion";
import { UserPlus, Search, CheckCircle, Banknote } from "lucide-react";

const steps = [
  { icon: <UserPlus size={28} />, title: "Maak je profiel", desc: "In 2 minuten klaar. Voeg je KVK-nummer, skills en beschikbaarheid toe.", color: "#EF476F" },
  { icon: <Search size={28} />, title: "Vind shifts", desc: "AI matcht je met shifts op basis van locatie, ervaring en voorkeuren.", color: "#A7DADC" },
  { icon: <CheckCircle size={28} />, title: "Check in & werk", desc: "GPS check-in op locatie. Chat direct met je opdrachtgever.", color: "#EF476F" },
  { icon: <Banknote size={28} />, title: "Krijg betaald", desc: "Uren goedgekeurd? Snel op je rekening. Geen 14 dagen wachten.", color: "#A7DADC" },
];

export function HowItWorks() {
  return (
    <section id="hoe-werkt-het" className="py-24 relative overflow-hidden" style={{ background: "#023047" }}>
      {/* Subtle noise texture instead of gradient orbs */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>
            Hoe het werkt
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-tight">
            Van aanmelden tot betalen<br />
            in <span style={{ color: "#A7DADC" }}>4 stappen</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative p-6 rounded-2xl text-center group"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: step.color }}>
                {i + 1}
              </div>

              {/* Connecting line (desktop) */}
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px"
                  style={{ background: "rgba(255,255,255,0.15)" }} />
              )}

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
