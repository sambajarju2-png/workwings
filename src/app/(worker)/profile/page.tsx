"use client";
import { motion } from "framer-motion";
import { Star, Clock, TrendingUp, MapPin, Award, ChevronRight, LogOut } from "lucide-react";

// Mock data
const worker = {
  firstName: "Samba", lastName: "J.", city: "Amsterdam",
  rating: 4.9, totalShifts: 24, totalHours: 186, earnings: 3720,
  sectors: ["horeca", "events", "logistics"],
  badges: ["⚡ Altijd op tijd", "⭐ Top Worker", "🔥 10+ shifts"],
  reliabilityScore: 9.2,
};

const sectorLabels: Record<string, string> = {
  horeca: "🍽️ Horeca", retail: "🛍️ Retail", logistics: "📦 Logistiek",
  events: "🎉 Events", cleaning: "🧹 Schoonmaak", delivery: "🚚 Bezorging",
};

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-5">
      {/* Avatar + name */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
          style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {worker.firstName[0]}{worker.lastName[0]}
        </div>
        <div>
          <h1 className="text-xl font-black text-white">{worker.firstName} {worker.lastName}</h1>
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <MapPin size={12} /> {worker.city}
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(239,71,111,0.1)", color: "#EF476F" }}>
              <Star size={10} fill="#EF476F" /> {worker.rating}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2">
        {[
          { val: worker.totalShifts.toString(), label: "Shifts", icon: <Clock size={14} /> },
          { val: `${worker.totalHours}u`, label: "Uren", icon: <TrendingUp size={14} /> },
          { val: `€${worker.earnings}`, label: "Verdiend", icon: <TrendingUp size={14} /> },
          { val: worker.reliabilityScore.toString(), label: "Score", icon: <Award size={14} /> },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-lg font-black text-white">{s.val}</div>
            <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Badges</h3>
        <div className="flex gap-2 flex-wrap">
          {worker.badges.map((b, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(239,71,111,0.1)", color: "#EF476F", border: "1px solid rgba(239,71,111,0.2)" }}>
              {b}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Sectors */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Branches</h3>
        <div className="flex gap-2 flex-wrap">
          {worker.sectors.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {sectorLabels[s] || s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Menu items */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="space-y-1">
        {[
          { label: "Profiel bewerken", href: "#" },
          { label: "Shift geschiedenis", href: "#" },
          { label: "Facturen & betalingen", href: "#" },
          { label: "Instellingen", href: "#" },
          { label: "Help & Support", href: "#" },
        ].map((item) => (
          <a key={item.label} href={item.href}
            className="flex items-center justify-between p-3.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-sm text-white/70">{item.label}</span>
            <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
          </a>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-sm font-medium"
        style={{ background: "rgba(239,71,111,0.08)", color: "#EF476F", border: "1px solid rgba(239,71,111,0.15)" }}>
        <LogOut size={16} /> Uitloggen
      </motion.button>
    </div>
  );
}
