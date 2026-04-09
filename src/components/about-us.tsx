"use client";
import { motion } from "framer-motion";
import { Heart, Zap, Shield, Users } from "lucide-react";

const values = [
  { icon: <Heart size={22} />, title: "Worker-First", desc: "Freelancers staan centraal. Niet uitzendbureau's, niet investeerders — jij." },
  { icon: <Zap size={22} />, title: "Snelheid", desc: "Van aanmelden tot eerste shift in minder dan 24 uur. Betaald binnen minuten." },
  { icon: <Shield size={22} />, title: "Transparantie", desc: "Eerlijke reviews, duidelijke fees, geen verborgen kosten. Wat je ziet is wat je krijgt." },
  { icon: <Users size={22} />, title: "Community", desc: "Een netwerk van duizenden freelancers en bedrijven die elkaar versterken." },
];

export function AboutUs() {
  return (
    <section id="over" className="py-24 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #EF476F, transparent)" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Over WorkWings</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 text-foreground">
              Gebouwd door <span style={{ color: "#EF476F" }}>freelancers</span>,<br />voor freelancers
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-foreground-muted">
              <p>WorkWings is ontstaan uit frustratie. Frustratie over platforms die meer geven om hun commissie dan om hun gebruikers. Waar je 14 dagen wacht op je geld. Waar je niet eens kunt chatten met je opdrachtgever.</p>
              <p>Wij geloven dat de toekomst van werk flexibel is — maar dan wel op <strong className="text-foreground">jouw voorwaarden</strong>. Daarom bouwen we WorkWings: een platform waar freelancers hun eigen tarief bepalen, bedrijven eerlijk kunnen reviewen, en binnen minuten betaald worden.</p>
              <p>100% Wet DBA compliant. Gebouwd in Nederland, voor Nederland.</p>
            </div>
            <div className="flex gap-8 mt-8">
              {[{ val: "2026", label: "Opgericht" }, { val: "NL", label: "100% Nederlands" }, { val: "€3,50", label: "Laagste fee" }].map((f, i) => (
                <div key={i}><div className="text-2xl font-black text-foreground">{f.val}</div><div className="text-xs text-foreground-subtle">{f.label}</div></div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-2xl"
                style={{
                  background: i % 2 === 0 ? "#023047" : "var(--color-background-alt)",
                  color: i % 2 === 0 ? "white" : "var(--color-foreground)",
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: i % 2 === 0 ? "rgba(239,71,111,0.2)" : "rgba(2,48,71,0.08)",
                    color: i % 2 === 0 ? "#EF476F" : "var(--color-foreground)",
                  }}>{v.icon}</div>
                <h3 className="font-bold text-sm mb-1">{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ opacity: 0.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
