"use client";
import { motion } from "framer-motion";
import { MessageSquare, Star, Brain, MapPin, Shield, TrendingDown } from "lucide-react";

const features = [
  { icon: <MessageSquare size={24} />, title: "In-App Chat", desc: "Praat direct met je opdrachtgever. Per shift, geen gedoe met WhatsApp.", tag: "Uniek" },
  { icon: <Star size={24} />, title: "Bedrijf Reviews", desc: "Beoordeel bedrijven eerlijk. Zie ratings voordat je solliciteert.", tag: "Uniek" },
  { icon: <Brain size={24} />, title: "AI Matching", desc: "Slimme aanbevelingen op basis van je skills, locatie en werkhistorie.", tag: "Slim" },
  { icon: <MapPin size={24} />, title: "GPS Check-in", desc: "Geen gedoe over uren. Check in op locatie, automatische urenregistratie.", tag: "Betrouwbaar" },
  { icon: <Shield size={24} />, title: "Wet DBA Compliant", desc: "Modelovereenkomst per shift. Jij bepaalt je tarief. Geen schijnzelfstandigheid.", tag: "Veilig" },
  { icon: <TrendingDown size={24} />, title: "Lagere Fees", desc: "Wij rekenen minder dan de concurrentie. Meer geld voor jou en het bedrijf.", tag: "Eerlijk" },
];

// Alternate clip-path directions per card
const clipDirections = [
  { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },     // left
  { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },      // top
  { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },      // right
  { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },      // bottom
  { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },      // left
  { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },      // top
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-background-alt">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Waarom WorkWings</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground tracking-tight">
            Gebouwd voor <span style={{ color: "#EF476F" }}>freelancers</span>,<br />
            niet voor uitzendbureau&apos;s
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ clipPath: clipDirections[i].from, opacity: 0 }}
              whileInView={{ clipPath: clipDirections[i].to, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.77, 0, 0.175, 1] }}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              className="p-6 rounded-2xl bg-surface relative overflow-hidden group cursor-default"
              style={{ transformPerspective: 1000, boxShadow: "0 1px 3px rgba(2,48,71,0.06)", border: "1px solid var(--color-border)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, rgba(239,71,111,0.04), rgba(167,218,220,0.06))" }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-foreground"
                    style={{ background: "var(--color-background-alt)" }}>{f.icon}</div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(239,71,111,0.1)", color: "#EF476F" }}>{f.tag}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
