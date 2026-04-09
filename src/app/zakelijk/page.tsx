"use client";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, Users, Clock, TrendingDown, MessageSquare, Star, MapPin, Shield, BarChart3, Zap, CheckCircle, ChevronRight } from "lucide-react";

const benefits = [
  { icon: <Users size={24}/>, title: "Flexibele Pool", desc: "Toegang tot 2.500+ geverifieerde freelancers. Altijd iemand beschikbaar, zelfs last-minute.", color: "#EF476F" },
  { icon: <Clock size={24}/>, title: "Direct Gevuld", desc: "Gemiddeld binnen 4 uur je shift gevuld. AI matcht de beste kandidaten op basis van skills en ervaring.", color: "#A7DADC" },
  { icon: <TrendingDown size={24}/>, title: "Lagere Kosten", desc: "Slechts €3,50/uur servicefee. Temper rekent €4,90. Bespaar tot €1.400/uur per maand.", color: "#EF476F" },
  { icon: <MessageSquare size={24}/>, title: "In-App Chat", desc: "Communiceer direct met je freelancers per shift. Geen WhatsApp-groepen of gemiste berichten.", color: "#A7DADC" },
  { icon: <Star size={24}/>, title: "Beoordeeld door Werkers", desc: "Transparante reviews van freelancers over jouw bedrijf. Bouw een reputatie als goede opdrachtgever.", color: "#EF476F" },
  { icon: <MapPin size={24}/>, title: "GPS Check-in", desc: "Automatische urenregistratie met GPS verificatie. Geen discussies meer over gewerkte uren.", color: "#A7DADC" },
];

const howItWorks = [
  { step: "01", title: "Account aanmaken", desc: "Binnen 5 minuten klaar. Voeg je bedrijfsgegevens, locaties en teamleden toe." },
  { step: "02", title: "Shift plaatsen", desc: "Beschrijf de functie, stel je tarief in en publiceer. Onze AI doet de rest." },
  { step: "03", title: "Selecteer & bevestig", desc: "Bekijk sollicitaties met ratings en werkhistorie. Accepteer de beste kandidaten." },
  { step: "04", title: "Werk & betaal", desc: "Freelancer checkt in via GPS. Uren worden automatisch bijgehouden. Betaling via Stripe." },
];

const comparison = [
  { feature: "Servicefee", ww: "€3,50/uur", temper: "€4,90/uur", youngones: "~€4,00/uur" },
  { feature: "In-app chat met werker", ww: true, temper: false, youngones: false },
  { feature: "Gemiddelde invultijd", ww: "4 uur", temper: "8 uur", youngones: "12 uur" },
  { feature: "GPS check-in/out", ww: true, temper: false, youngones: false },
  { feature: "Bedrijf reviews door werkers", ww: true, temper: false, youngones: false },
  { feature: "Flexpool (favorieten)", ww: true, temper: true, youngones: false },
  { feature: "Wet DBA compliant", ww: true, temper: true, youngones: true },
  { feature: "Tarief onderhandeling", ww: true, temper: true, youngones: false },
];

const testimonials = [
  { name: "Mark de V.", role: "Operations Manager · Restaurant", text: "Sinds we WorkWings gebruiken besparen we €800/maand aan fees en onze shifts worden sneller gevuld. De chat-functie is een game-changer." },
  { name: "Sandra K.", role: "HR Manager · Warehouse", text: "De GPS check-in heeft ons zoveel tijd bespaard. Geen discussies meer over uren. Alles is transparant en automatisch." },
  { name: "Tom B.", role: "Event Coordinator · RAI", text: "We hadden binnen 2 uur 12 eventhosts gevonden voor onze beurs. De kwaliteit van de freelancers is uitstekend." },
];

export default function ZakelijkPage() {
  return (
    <main>
      <Navbar />

      {/* Hero — Company focused */}
      <section className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #023047 0%, #012A3E 40%, #011825 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float"
            style={{ background: "radial-gradient(circle, rgba(167,218,220,0.15) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full animate-float"
            style={{ background: "radial-gradient(circle, rgba(239,71,111,0.1) 0%, transparent 70%)", animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(167,218,220,0.15)", border: "1px solid rgba(167,218,220,0.3)" }}>
              <BarChart3 size={14} style={{ color: "#A7DADC" }} />
              <span className="text-sm font-semibold" style={{ color: "#A7DADC" }}>Voor Bedrijven</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Vind de beste<br />
              freelancers.<br />
              <span style={{ color: "#EF476F" }}>Binnen uren.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl mb-10 leading-relaxed max-w-xl" style={{ color: "rgba(167,218,220,0.9)" }}>
              Vul je shifts met geverifieerde freelancers uit horeca, retail, logistiek en events.
              Lagere fees dan Temper, snellere invulling, en tools die je tijd besparen.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4">
              <motion.a href="/signup/company" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
                Gratis starten <ArrowRight size={20} />
              </motion.a>
              <a href="#hoe-werkt-het" className="px-8 py-4 rounded-xl font-bold text-lg text-center"
                style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.12)" }}>
                Hoe werkt het?
              </a>
            </motion.div>

            {/* Quick stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex gap-8 mt-14">
              {[{ val: "2.500+", label: "Freelancers" }, { val: "€3,50", label: "Servicefee/uur" }, { val: "4 uur", label: "Gem. invultijd" }].map((s, i) => (
                <div key={i}><div className="text-2xl font-black text-white">{s.val}</div><div className="text-xs" style={{ color: "rgba(167,218,220,0.6)" }}>{s.label}</div></div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-24 px-4 bg-background-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Voordelen</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-foreground">Waarom bedrijven kiezen<br />voor <span style={{ color: "#EF476F" }}>WorkWings</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-surface border border-border">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}12`, color: b.color }}>{b.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hoe-werkt-het" className="py-24 px-4" style={{ background: "#023047" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#A7DADC" }}>Hoe het werkt</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-white">In 4 stappen aan de slag</h2>
          </div>
          <div className="space-y-6">
            {howItWorks.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-3xl font-black flex-shrink-0" style={{ color: "#EF476F" }}>{s.step}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Vergelijk</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-foreground">Bespaar met <span style={{ color: "#EF476F" }}>WorkWings</span></h2>
          </div>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-4 text-center text-sm font-bold border-b border-border">
              <div className="p-4 text-left text-foreground-subtle">Feature</div>
              <div className="p-4 text-white rounded-t-xl" style={{ background: "#023047" }}><span style={{ color: "#EF476F" }}>Work</span>Wings</div>
              <div className="p-4 text-foreground-muted">Temper</div>
              <div className="p-4 text-foreground-muted">YoungOnes</div>
            </div>
            {comparison.map((r, i) => (
              <div key={i} className="grid grid-cols-4 items-center text-center text-sm border-b last:border-b-0 border-border">
                <div className="p-4 text-left text-foreground-muted">{r.feature}</div>
                <div className="p-4" style={{ background: "rgba(2,48,71,0.03)" }}>
                  {typeof r.ww === "boolean" ? (r.ww ? <CheckCircle size={16} style={{ color: "#EF476F" }} className="mx-auto" /> : <span className="text-foreground-subtle">-</span>) :
                    <span className="font-semibold" style={{ color: "#EF476F" }}>{r.ww}</span>}
                </div>
                <div className="p-4">
                  {typeof r.temper === "boolean" ? (r.temper ? <CheckCircle size={16} className="mx-auto text-foreground-subtle" /> : <span className="text-foreground-subtle">-</span>) :
                    <span className="text-foreground-muted">{r.temper}</span>}
                </div>
                <div className="p-4">
                  {typeof r.youngones === "boolean" ? (r.youngones ? <CheckCircle size={16} className="mx-auto text-foreground-subtle" /> : <span className="text-foreground-subtle">-</span>) :
                    <span className="text-foreground-muted">{r.youngones}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-background-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Klanten</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-foreground">Wat bedrijven <span style={{ color: "#EF476F" }}>zeggen</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface p-6 rounded-2xl border border-border">
                <p className="text-sm leading-relaxed mb-4 text-foreground-muted">&ldquo;{t.text}&rdquo;</p>
                <div><div className="font-bold text-sm text-foreground">{t.name}</div><div className="text-xs text-foreground-subtle">{t.role}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4" style={{ background: "linear-gradient(135deg, #023047, #011825)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Klaar om te starten?</h2>
          <p className="text-lg mb-10" style={{ color: "rgba(167,218,220,0.8)" }}>
            Maak gratis een account aan en plaats je eerste shift. Geen verplichtingen, geen opstartkosten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a href="/signup/company" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2"
              style={{ background: "#EF476F" }}>
              Gratis account aanmaken <ArrowRight size={20} />
            </motion.a>
            <a href="mailto:zakelijk@workwings.nl" className="px-8 py-4 rounded-xl font-semibold text-lg text-center"
              style={{ color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              Neem contact op
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
