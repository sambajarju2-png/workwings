"use client";
import { motion } from "framer-motion";
import { Clock, MapPin, TrendingUp, Star, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const upcomingShifts = [
  { id: "1", title: "Barista", company: "Coffee Company", time: "08:00 – 16:00", date: "Morgen", rate: "€22/uur", location: "Amsterdam", color: "#EF476F" },
  { id: "2", title: "Orderpicker", company: "DHL Warehouse", time: "18:00 – 02:00", date: "Vrijdag", rate: "€19/uur", location: "Schiphol", color: "#A7DADC" },
];

const recommended = [
  { id: "3", title: "Eventhost", company: "RAI Amsterdam", rate: "€24/uur", time: "14:00 – 22:00", date: "Zaterdag", match: 95 },
  { id: "4", title: "Retail medewerker", company: "Uniqlo", rate: "€18/uur", time: "10:00 – 18:00", date: "Zondag", match: 88 },
  { id: "5", title: "Afwasser", company: "Hotel Okura", rate: "€20/uur", time: "17:00 – 01:00", date: "Maandag", match: 82 },
];

export default function WorkerDashboard() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-foreground">Hey daar!</h1>
        <p className="text-sm mt-1 text-foreground-subtle">Klaar voor je volgende shift?</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3">
        {[
          { icon: <Clock size={16} />, val: "24", label: "Shifts", color: "#EF476F" },
          { icon: <TrendingUp size={16} />, val: "€480", label: "Deze maand", color: "#A7DADC" },
          { icon: <Star size={16} />, val: "4.9", label: "Rating", color: "#EF476F" },
        ].map((s, i) => (
          <div key={i} className="p-3 rounded-xl text-center bg-surface border border-border">
            <div className="flex items-center justify-center mb-1" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-lg font-black text-foreground">{s.val}</div>
            <div className="text-[10px] text-foreground-subtle">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Upcoming shifts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Aankomende Shifts</h2>
          <Link href="/shifts" className="text-xs font-semibold" style={{ color: "#EF476F" }}>Alle shifts →</Link>
        </div>
        <div className="space-y-3">
          {upcomingShifts.map((shift) => (
            <Link key={shift.id} href={`/shifts/${shift.id}`}>
              <motion.div whileTap={{ scale: 0.99 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: shift.color }}>{shift.title[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-semibold text-sm">{shift.title}</div>
                  <div className="text-xs text-foreground-subtle">{shift.company} · {shift.date}, {shift.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: "#A7DADC" }}>{shift.rate}</div>
                  <div className="text-[10px] flex items-center gap-1 justify-end text-foreground-subtle">
                    <MapPin size={10} />{shift.location}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* AI Recommended */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} style={{ color: "#EF476F" }} />
          <h2 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Aanbevolen voor jou</h2>
        </div>
        <div className="space-y-2">
          {recommended.map((shift) => (
            <Link key={shift.id} href={`/shifts/${shift.id}`}>
              <motion.div whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-border">
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-medium text-sm">{shift.title}</div>
                  <div className="text-xs text-foreground-subtle">{shift.company} · {shift.date}, {shift.time}</div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(167,218,220,0.12)", color: "#0e8a8d" }}>
                    {shift.match}% match
                  </span>
                  <span className="text-sm font-bold text-foreground-muted">{shift.rate}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick action */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Link href="/shifts">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between p-5 rounded-2xl text-white"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            <div>
              <div className="font-bold">Zoek nieuwe shifts</div>
              <div className="text-xs text-white/70">1.500+ shifts beschikbaar</div>
            </div>
            <ArrowRight size={20} />
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
