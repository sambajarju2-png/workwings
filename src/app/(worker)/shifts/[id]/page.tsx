"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Euro, Users, Star, CheckCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

// Mock — will be Supabase fetch
const shift = {
  id: "1", title: "Barista", company: "Coffee Company", companyRating: 4.7,
  sector: "horeca", rate: 22, date: "2026-04-10", start: "08:00", end: "16:00",
  city: "Amsterdam", address: "Herengracht 182, Amsterdam",
  workers_needed: 2, workers_filled: 1,
  description: "We zoeken een enthousiaste barista voor onze vestiging aan de Herengracht. Je maakt koffie, helpt klanten en houdt de zaak netjes. Ervaring met espressomachines is een plus maar niet vereist.",
  requirements: ["Minimaal 18 jaar", "KVK-inschrijving", "Nette uitstraling"],
  dress_code: "Zwart shirt, eigen schoenen",
  parking: "Betaald parkeren in de buurt, OV aanbevolen",
};

export default function ShiftDetailPage() {
  const [applied, setApplied] = useState(false);
  const [proposedRate, setProposedRate] = useState(shift.rate.toString());

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Back button */}
      <Link href="/shifts" className="inline-flex items-center gap-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
        <ArrowLeft size={16} /> Terug
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">{shift.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{shift.company}</span>
              <span className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(239,71,111,0.1)", color: "#EF476F" }}>
                <Star size={10} fill="#EF476F" /> {shift.companyRating}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: "#A7DADC" }}>€{shift.rate}</div>
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>per uur</div>
          </div>
        </div>
      </motion.div>

      {/* Info pills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2">
        {[
          { icon: <Clock size={14} />, text: `${shift.start} – ${shift.end}` },
          { icon: <MapPin size={14} />, text: shift.city },
          { icon: <Users size={14} />, text: `${shift.workers_filled}/${shift.workers_needed} plekken` },
          { icon: <Euro size={14} />, text: `€${shift.rate}/uur` },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "#A7DADC" }}>{p.icon}</span>
            {p.text}
          </div>
        ))}
      </motion.div>

      {/* Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 className="text-sm font-bold text-white/70 mb-2">Beschrijving</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{shift.description}</p>
      </motion.div>

      {/* Requirements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 className="text-sm font-bold text-white/70 mb-2">Vereisten</h3>
        <div className="space-y-1.5">
          {shift.requirements.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <CheckCircle size={14} style={{ color: "#A7DADC" }} /> {r}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Details */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Kledingvoorschrift</div>
          <div className="text-xs text-white/60">{shift.dress_code}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Parkeren</div>
          <div className="text-xs text-white/60">{shift.parking}</div>
        </div>
      </motion.div>

      {/* Apply section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {!applied ? (
          <>
            <h3 className="text-sm font-bold text-white mb-3">Solliciteren</h3>
            <div className="mb-4">
              <label className="text-xs mb-1.5 block" style={{ color: "rgba(255,255,255,0.35)" }}>
                Jouw tarief (onderhandelbaar)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">€</span>
                <input type="number" value={proposedRate} onChange={(e) => setProposedRate(e.target.value)}
                  className="w-full pl-8 pr-16 py-3 rounded-xl text-white font-bold outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">per uur</span>
              </div>
            </div>
            <motion.button
              onClick={() => setApplied(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold text-sm"
              style={{ background: "#EF476F" }}>
              Solliciteren voor €{proposedRate}/uur
            </motion.button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(167,218,220,0.15)" }}>
              <CheckCircle size={24} style={{ color: "#A7DADC" }} />
            </div>
            <h3 className="text-white font-bold">Sollicitatie verstuurd!</h3>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              Je hoort snel van {shift.company}
            </p>
            <button className="mt-4 flex items-center gap-1.5 mx-auto text-xs font-semibold px-4 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)", color: "#A7DADC" }}>
              <MessageSquare size={14} /> Chat met {shift.company}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
