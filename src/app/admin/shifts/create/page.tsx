"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarPlus, Loader2, MapPin, Clock, Euro, Users, CheckCircle } from "lucide-react";
import Link from "next/link";

const sectorOptions = [
  { value: "horeca", label: "🍽️ Horeca" },{ value: "retail", label: "🛍️ Retail" },
  { value: "logistics", label: "📦 Logistiek" },{ value: "events", label: "🎉 Events" },
  { value: "cleaning", label: "🧹 Schoonmaak" },{ value: "delivery", label: "🚚 Bezorging" },
];

export default function CreateShiftPage() {
  const [title, setTitle] = useState(""); const [sector, setSector] = useState("");
  const [date, setDate] = useState(""); const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState(""); const [rate, setRate] = useState("");
  const [workersNeeded, setWorkersNeeded] = useState("1"); const [description, setDescription] = useState("");
  const [address, setAddress] = useState(""); const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true); setLoading(false);
  }

  const inputStyle: React.CSSProperties = { background: "rgba(255,255,255,0.04)", border: "1px solid #1A2F40" };

  if (success) {
    return (
      <div className="max-w-lg mx-auto pt-12 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(167,218,220,0.15)" }}><CheckCircle size={32} style={{ color: "#A7DADC" }} /></div>
          <h2 className="text-2xl font-black text-white mb-3">Shift Aangemaakt! 🎉</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>Je shift &quot;{title}&quot; staat nu online.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/shifts" className="px-6 py-3 rounded-xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>Naar Shifts</Link>
            <button onClick={() => { setSuccess(false); setTitle(""); }} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#EF476F" }}>Nog een shift</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin/shifts" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}><ArrowLeft size={16} /> Terug naar shifts</Link>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,71,111,0.15)" }}><CalendarPlus size={20} style={{ color: "#EF476F" }} /></div>
          <div><h1 className="text-xl font-black text-white">Nieuwe Shift</h1><p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Vul de details in en publiceer direct</p></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Titel *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="bijv. Barista ochtend" required className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none" style={inputStyle} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Branche *</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none" style={inputStyle}>
                <option value="" className="bg-[#0F1F2E]">Kies een branche</option>
                {sectorOptions.map((s) => (<option key={s.value} value={s.value} className="bg-[#0F1F2E]">{s.label}</option>))}
              </select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}><Clock size={12} className="inline mr-1" />Datum *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Start *</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Eind *</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}><Euro size={12} className="inline mr-1" />Tarief/uur *</label>
              <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">€</span>
              <input type="number" step="0.50" min="13" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="20.00" required className="w-full pl-8 pr-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none" style={inputStyle} /></div></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}><Users size={12} className="inline mr-1" />Aantal *</label>
              <input type="number" min="1" max="50" value={workersNeeded} onChange={(e) => setWorkersNeeded(e.target.value)} required className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none" style={inputStyle} /></div>
          </div>
          <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}><MapPin size={12} className="inline mr-1" />Locatie *</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Straat 123, Amsterdam" required className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none" style={inputStyle} /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Beschrijving</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Wat houdt de shift in?" rows={3} className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none resize-none" style={inputStyle} /></div>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "#EF476F" }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Publiceer Shift <CalendarPlus size={18} /></>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
