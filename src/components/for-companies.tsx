"use client";
import { motion } from "framer-motion";
import { BarChart3, Users, Clock, Zap, ArrowRight } from "lucide-react";

const benefits = [
  { icon: <Clock size={20} />, text: "Shift binnen uren gevuld" },
  { icon: <Users size={20} />, text: "AI matcht de beste freelancer" },
  { icon: <BarChart3 size={20} />, text: "Analytics dashboard" },
  { icon: <Zap size={20} />, text: "Lagere kosten dan de concurrentie" },
];

export function ForCompanies() {
  return (
    <section id="bedrijven" className="py-24 px-4 relative overflow-hidden" style={{ background: "#023047" }}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - text */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>
              Voor Bedrijven
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6">
              Vul shifts <span style={{ color: "#A7DADC" }}>sneller</span>,<br />
              betaal <span style={{ color: "#A7DADC" }}>minder</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
              Geen uitzendbureau nodig. Post een shift, ontvang sollicitaties, 
              en laat AI de beste match vinden. Alles in één dashboard.
            </p>
            <div className="space-y-4 mb-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(167,218,220,0.15)", color: "#A7DADC" }}>
                    {b.icon}
                  </div>
                  <span className="text-white/80 font-medium">{b.text}</span>
                </motion.div>
              ))}
            </div>
            <motion.a
              href="#aanmelden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{ background: "#EF476F" }}
            >
              Gratis Aanmelden <ArrowRight size={20} />
            </motion.a>
          </motion.div>

          {/* Right - dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: "#EF476F" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#A7DADC" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="ml-4 text-xs text-white/30 font-mono">admin.workwings.nl</span>
              </div>
              {/* Mock dashboard */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Open Shifts", val: "12", color: "#EF476F" },
                  { label: "Gevuld", val: "89%", color: "#A7DADC" },
                  { label: "Gem. Rating", val: "4.8", color: "#EF476F" },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.label}</div>
                    <div className="text-2xl font-black text-white">{m.val}</div>
                    <div className="h-1 rounded-full mt-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-full rounded-full" style={{ width: "75%", background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Mock table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="p-3 text-xs text-white/30 flex gap-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span className="flex-1">Shift</span><span className="w-20">Status</span><span className="w-20">Sollicitaties</span>
                </div>
                {["Barista ochtend", "Warehouse avond", "Event crew zaterdag"].map((s, i) => (
                  <div key={i} className="p-3 text-sm text-white/60 flex gap-4 border-b" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                    <span className="flex-1 text-white/80">{s}</span>
                    <span className="w-20 text-xs px-2 py-0.5 rounded-full text-center"
                      style={{ background: i === 0 ? "rgba(167,218,220,0.15)" : "rgba(239,71,111,0.15)", color: i === 0 ? "#A7DADC" : "#EF476F" }}>
                      {i === 0 ? "Gevuld" : "Open"}
                    </span>
                    <span className="w-20 text-center">{[8, 3, 5][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
