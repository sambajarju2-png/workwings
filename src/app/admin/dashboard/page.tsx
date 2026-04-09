"use client";
import { motion } from "framer-motion";
import { CalendarPlus, TrendingUp, Users, Clock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Open Shifts", value: "8", icon: Clock, change: "+3 deze week", color: "#EF476F" },
  { label: "Gevuld %", value: "87%", icon: TrendingUp, change: "+5% vs vorige week", color: "#A7DADC" },
  { label: "Actieve Freelancers", value: "34", icon: Users, change: "12 in flexpool", color: "#EF476F" },
  { label: "Gem. Rating", value: "4.6", icon: CheckCircle, change: "op basis van 128 reviews", color: "#A7DADC" },
];

const recentShifts = [
  { title: "Barista ochtend", date: "Ma 14 apr", time: "08:00-16:00", status: "filled", applicants: 6, needed: 2 },
  { title: "Orderpicker avond", date: "Di 15 apr", time: "18:00-02:00", status: "open", applicants: 3, needed: 4 },
  { title: "Event crew weekend", date: "Za 19 apr", time: "10:00-22:00", status: "open", applicants: 8, needed: 6 },
  { title: "Schoonmaak kantoor", date: "Ma 21 apr", time: "06:00-10:00", status: "draft", applicants: 0, needed: 1 },
];

export default function CompanyDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-black text-white">Goedemorgen 👋</h1>
        <p className="mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Hier is een overzicht van je shifts deze week.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Link href="/admin/shifts/create">
          <div className="p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)", boxShadow: "0 4px 20px rgba(239,71,111,0.3)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                <CalendarPlus size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold">Nieuwe Shift Aanmaken</div>
                <div className="text-white/60 text-sm">Post een shift en ontvang direct sollicitaties</div>
              </div>
            </div>
            <ArrowRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="p-4 rounded-2xl" style={{ background: "#0F1F2E", border: "1px solid #1A2F40" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}><s.icon size={18} /></div>
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
            <div className="text-xs mt-2" style={{ color: s.color }}>{s.change}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recente Shifts</h2>
          <Link href="/admin/shifts" className="text-sm font-medium flex items-center gap-1" style={{ color: "#EF476F" }}>Alles bekijken <ArrowRight size={14} /></Link>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0F1F2E", border: "1px solid #1A2F40" }}>
          <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)", borderBottom: "1px solid #1A2F40" }}>
            <span>Shift</span><span>Datum & Tijd</span><span>Sollicitaties</span><span>Status</span><span></span>
          </div>
          {recentShifts.map((shift, i) => (
            <div key={i} className="grid md:grid-cols-5 gap-2 md:gap-4 items-center px-4 py-3" style={{ borderBottom: i < recentShifts.length - 1 ? "1px solid rgba(26,47,64,0.5)" : "none" }}>
              <div className="text-white font-semibold text-sm">{shift.title}</div>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{shift.date} · {shift.time}</div>
              <div className="text-sm text-white/60">{shift.applicants}/{shift.needed} nodig</div>
              <div><span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{
                background: shift.status === "filled" ? "rgba(167,218,220,0.12)" : shift.status === "open" ? "rgba(239,71,111,0.12)" : "rgba(255,255,255,0.05)",
                color: shift.status === "filled" ? "#A7DADC" : shift.status === "open" ? "#EF476F" : "rgba(255,255,255,0.3)",
              }}>{shift.status === "filled" ? "Gevuld" : shift.status === "open" ? "Open" : "Concept"}</span></div>
              <div className="flex justify-end"><Link href={`/admin/shifts/${i}`} className="text-xs font-medium" style={{ color: "#A7DADC" }}>Bekijken →</Link></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-bold text-white mb-4">Acties nodig</h2>
        <div className="space-y-3">
          {[
            { icon: AlertCircle, text: "3 sollicitaties wachten op beoordeling", action: "Bekijken", color: "#EF476F" },
            { icon: Clock, text: "2 uren wachten op goedkeuring", action: "Goedkeuren", color: "#A7DADC" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1A2F40" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15`, color: item.color }}><item.icon size={16} /></div>
              <span className="flex-1 text-sm text-white/60">{item.text}</span>
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: `${item.color}15`, color: item.color }}>{item.action}</button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
