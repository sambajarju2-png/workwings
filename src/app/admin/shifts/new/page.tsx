"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, UtensilsCrossed, ShoppingBag, Package, PartyPopper, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const sectors: { value: string; label: string; icon: ReactNode }[] = [
  { value: "horeca", label: "Horeca", icon: <UtensilsCrossed size={16}/> },
  { value: "retail", label: "Retail", icon: <ShoppingBag size={16}/> },
  { value: "logistics", label: "Logistiek", icon: <Package size={16}/> },
  { value: "events", label: "Events", icon: <PartyPopper size={16}/> },
  { value: "cleaning", label: "Schoonmaak", icon: <Sparkles size={16}/> },
  { value: "delivery", label: "Bezorging", icon: <Truck size={16}/> },
];

export default function NewShiftPage() {
  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rate, setRate] = useState("");
  const [workersNeeded, setWorkersNeeded] = useState("1");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(167,218,220,0.12)" }}>
            <CheckCircle size={28} style={{ color: "#0e8a8d" }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: "#023047" }}>Shift aangemaakt</h2>
          <p className="text-sm mb-6" style={{ color: "#8BA3B5" }}>Je shift is live. Sollicitaties komen binnen.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin" className="px-5 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: "#E8EDF2", color: "#4A6B7F" }}>Dashboard</Link>
            <button onClick={() => { setSuccess(false); setTitle(""); setDescription(""); }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "#EF476F" }}>Nog een shift</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}>
        <ArrowLeft size={16} /> Terug
      </Link>

      <h1 className="text-2xl font-black mb-1" style={{ color: "#023047" }}>Nieuwe Shift</h1>
      <p className="text-sm mb-8" style={{ color: "#8BA3B5" }}>Vul de details in en je shift gaat direct live.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Functietitel</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Bijv. Barista, Orderpicker, Eventhost" required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
        </div>

        {/* Sector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Branche</label>
          <div className="grid grid-cols-3 gap-2">
            {sectors.map(s => (
              <button key={s.value} type="button" onClick={() => setSector(s.value)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all border"
                style={{
                  background: sector === s.value ? "rgba(239,71,111,0.06)" : "white",
                  borderColor: sector === s.value ? "#EF476F" : "#E8EDF2",
                  color: sector === s.value ? "#EF476F" : "#4A6B7F",
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & time */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Datum</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required
              className="w-full px-3 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Start</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required
              className="w-full px-3 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Eind</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required
              className="w-full px-3 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
        </div>

        {/* Rate & workers */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Tarief (per uur)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="20" min="13" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Aantal werknemers</label>
            <input type="number" value={workersNeeded} onChange={e => setWorkersNeeded(e.target.value)} min="1" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Beschrijving</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
            placeholder="Wat houdt de shift in? Wat kan de freelancer verwachten?"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#8BA3B5" }}>Vereisten (een per regel)</label>
          <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={3}
            placeholder={"Minimaal 18 jaar\nKVK-inschrijving\nNette uitstraling"}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none border" style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
        </div>

        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
          style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {loading ? <Loader2 size={20} className="animate-spin" /> : "Shift Publiceren"}
        </motion.button>
      </form>
    </div>
  );
}
