"use client";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Zap } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const letter = {
  hidden: { y: 80, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #023047 0%, #012A3E 40%, #0A1628 100%)" }}>
      
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(239,71,111,0.15) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(167,218,220,0.12) 0%, transparent 70%)", animationDelay: "3s" }} />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(239,71,111,0.08) 0%, transparent 70%)", animationDelay: "1.5s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(239,71,111,0.15)", border: "1px solid rgba(239,71,111,0.3)" }}
        >
          <Zap size={14} style={{ color: "#EF476F" }} />
          <span className="text-sm font-semibold" style={{ color: "#EF476F" }}>
            #1 Freelance Shift Platform van Nederland
          </span>
        </motion.div>

        {/* Main headline — animated per word */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] mb-8"
        >
          <div className="overflow-hidden">
            <motion.span variants={letter} className="inline-block">Werk.</motion.span>{" "}
            <motion.span variants={letter} className="inline-block">Verdien.</motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span variants={letter} className="inline-block" style={{ color: "#EF476F" }}>Leef.</motion.span>
          </div>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: "rgba(167,218,220,0.9)" }}
        >
          Vind shifts in horeca, retail, logistiek en events. 
          Gemiddeld <span className="font-bold text-white">€20/uur</span>, 
          betaald <span className="font-bold text-white">binnen minuten</span>.
          Jij bepaalt wanneer en waar je werkt.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="/signup/worker"            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center gap-2 animate-pulse-glow"
            style={{ background: "#EF476F" }}
          >
            Begin Vandaag
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="/zakelijk"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl text-white font-bold text-lg"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Ik zoek personeel
          </motion.a>
        </motion.div>

        {/* Quick stats pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: <Clock size={14} />, text: "Snel uitbetaald" },
            { icon: <MapPin size={14} />, text: "Shifts door heel NL" },
            { icon: <Zap size={14} />, text: "Gratis aanmelden" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
              <span style={{ color: "#A7DADC" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </motion.div>

        {/* Phone mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="relative rounded-[2.5rem] p-3 mx-auto"
            style={{ background: "linear-gradient(135deg, rgba(239,71,111,0.3), rgba(167,218,220,0.3))" }}>
            <div className="rounded-[2rem] overflow-hidden" style={{ background: "#0A1628" }}>
              {/* App mockup content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-bold">Shifts bij jou in de buurt</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(239,71,111,0.2)", color: "#EF476F" }}>12 nieuw</span>
                </div>
                {/* Mock shift cards */}
                {[
                  { role: "Barista", company: "Coffee Company", rate: "€22/uur", time: "08:00 – 16:00", color: "#EF476F" },
                  { role: "Orderpicker", company: "DHL Warehouse", rate: "€19/uur", time: "18:00 – 02:00", color: "#A7DADC" },
                  { role: "Eventhost", company: "RAI Amsterdam", rate: "€24/uur", time: "14:00 – 22:00", color: "#EF476F" },
                ].map((shift, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + i * 0.15 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: shift.color }}>
                      {shift.role[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">{shift.role}</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{shift.company} · {shift.time}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "#A7DADC" }}>{shift.rate}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, var(--color-background), transparent)" }} />
    </section>
  );
}
