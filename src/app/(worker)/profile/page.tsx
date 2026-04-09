"use client";
import { motion } from "framer-motion";
import { Star, Clock, TrendingUp, MapPin, Award, ChevronRight, LogOut } from "lucide-react";

const worker = {
  firstName: "Samba", lastName: "J.", city: "Amsterdam", rating: 4.9,
  totalShifts: 24, totalHours: 186, earnings: 3720, reliabilityScore: 9.2,
  sectors: ["horeca", "events", "logistics"],
  badges: ["⚡ Altijd op tijd", "⭐ Top Worker", "🔥 10+ shifts"],
};

const sectorLabels: Record<string, string> = {
  horeca: "🍽️ Horeca", retail: "🛍️ Retail", logistics: "📦 Logistiek",
  events: "🎉 Events", cleaning: "🧹 Schoonmaak", delivery: "🚚 Bezorging",
};

export default function ProfilePage() {
  return (
    <div className="px-4 py-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
          style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {worker.firstName[0]}{worker.lastName[0]}
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground">{worker.firstName} {worker.lastName}</h1>
          <div className="flex items-center gap-2 text-xs text-foreground-subtle">
            <MapPin size={12} /> {worker.city}
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(239,71,111,0.1)", color: "#EF476F" }}>
              <Star size={10} fill="#EF476F" /> {worker.rating}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-2">
        {[
          { val: worker.totalShifts.toString(), label: "Shifts" },
          { val: `${worker.totalHours}u`, label: "Uren" },
          { val: `€${worker.earnings}`, label: "Verdiend" },
          { val: worker.reliabilityScore.toString(), label: "Score" },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl text-center bg-surface border border-border">
            <div className="text-lg font-black text-foreground">{s.val}</div>
            <div className="text-[10px] text-foreground-subtle">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-foreground-subtle">Badges</h3>
        <div className="flex gap-2 flex-wrap">
          {worker.badges.map((b, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(239,71,111,0.08)", color: "#EF476F" }}>{b}</span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-foreground-subtle">Branches</h3>
        <div className="flex gap-2 flex-wrap">
          {worker.sectors.map(s => (
            <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border text-foreground-muted">
              {sectorLabels[s] || s}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-1">
        {["Profiel bewerken", "Shift geschiedenis", "Facturen & betalingen", "Instellingen", "Help & Support"].map(label => (
          <a key={label} href="#"
            className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border">
            <span className="text-sm text-foreground-muted">{label}</span>
            <ChevronRight size={16} className="text-foreground-subtle" />
          </a>
        ))}
      </motion.div>

      <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-sm font-medium"
        style={{ background: "rgba(239,71,111,0.06)", color: "#EF476F", border: "1px solid rgba(239,71,111,0.15)" }}>
        <LogOut size={16} /> Uitloggen
      </motion.button>
    </div>
  );
}
