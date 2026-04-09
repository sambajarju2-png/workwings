"use client";
import { motion } from "framer-motion";
import { User, Building2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#023047" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <a href="/" className="flex items-center gap-2 mb-12 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
        </a>

        <h1 className="text-3xl font-black text-white text-center mb-2">Aanmelden bij WorkWings</h1>
        <p className="text-center mb-10" style={{ color: "rgba(167,218,220,0.6)" }}>Wat beschrijft jou het beste?</p>

        <div className="space-y-4">
          <motion.a href="/signup/worker" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-5 p-6 rounded-2xl group"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,71,111,0.15)" }}>
              <User size={26} style={{ color: "#EF476F" }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Ik wil werken</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Freelancer / ZZP&apos;er — vind shifts en verdien geld</p>
            </div>
            <ArrowRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />
          </motion.a>

          <motion.a href="/signup/company" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-5 p-6 rounded-2xl group"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(167,218,220,0.15)" }}>
              <Building2 size={26} style={{ color: "#A7DADC" }} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Ik zoek personeel</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Bedrijf — post shifts en vind freelancers</p>
            </div>
            <ArrowRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />
          </motion.a>
        </div>

        <div className="mt-8 text-center">
          <a href="/login" className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Al een account? <span className="underline" style={{ color: "#A7DADC" }}>Inloggen</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
