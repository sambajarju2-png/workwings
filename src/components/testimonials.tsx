"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Lisa V.", role: "Barista · Amsterdam", text: "Eindelijk een platform waar ik zelf mijn tarief bepaal. De in-app chat is super handig — geen WhatsApp-groepen meer.", rating: 5 },
  { name: "Kevin M.", role: "Orderpicker · Rotterdam", text: "Betaald binnen minuten na mijn shift. Bij de concurrent moest ik soms 2 weken wachten. Never going back.", rating: 5 },
  { name: "Priya D.", role: "Eventhost · Utrecht", text: "De bedrijf-reviews zijn goud waard. Je weet precies wat je kunt verwachten voordat je ergens begint.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-background-alt">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Reviews</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground">Wat freelancers <span style={{ color: "#EF476F" }}>zeggen</span></h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}
              className="bg-surface p-6 rounded-2xl relative" style={{ boxShadow: "0 1px 3px rgba(2,48,71,0.06)", border: "1px solid var(--color-border)" }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (<Star key={j} size={16} fill="#EF476F" color="#EF476F" />))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-foreground-muted">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "#023047" }}>
                  {t.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-foreground-subtle">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
