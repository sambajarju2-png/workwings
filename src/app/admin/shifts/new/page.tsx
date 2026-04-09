"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const sectorOptions = [
  { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

export default function NewShiftPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("horeca");
  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [rate, setRate] = useState("15");
  const [workersNeeded, setWorkersNeeded] = useState("1");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function init() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (membership) {
        setCompanyId(membership.company_id);
        const { data: locs } = await supabase.from("locations").select("*").eq("company_id", membership.company_id);
        setLocations(locs || []);
        if (locs?.length) setLocationId(locs[0].id);
      }
    }
    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyId) { setError("Geen bedrijf gevonden"); return; }
    setLoading(true); setError("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Niet geconfigureerd"); setLoading(false); return; }

    const { error: insertError } = await supabase.from("shifts").insert({
      company_id: companyId,
      location_id: locationId || null,
      title, sector, date,
      start_time: startTime, end_time: endTime,
      rate_per_hour: parseFloat(rate),
      workers_needed: parseInt(workersNeeded),
      description,
      status: "open",
    });

    if (insertError) { setError(insertError.message); setLoading(false); return; }
    router.push("/admin/shifts");
  }

  const inputStyle = "w-full px-4 py-3 rounded-xl text-sm outline-none border";

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link href="/admin/shifts" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}>
        <ArrowLeft size={16} /> Terug
      </Link>

      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Nieuwe Shift</h1>

      {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Titel</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="bijv. Barista ochtend" required
            className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)}
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }}>
              {sectorOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Locatie</label>
            <select value={locationId} onChange={e => setLocationId(e.target.value)}
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }}>
              <option value="">Geen locatie</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name} - {l.city}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Datum</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Start</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Eind</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Tarief (€/uur)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} min="13" step="0.50" required
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Aantal werknemers</label>
            <input type="number" value={workersNeeded} onChange={e => setWorkersNeeded(e.target.value)} min="1" required
              className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Beschrijving</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Beschrijf de shift, verwachtingen, vereisten..."
            className={inputStyle} style={{ borderColor: "#E8EDF2", color: "#023047", background: "white" }} />
        </div>

        <motion.button type="submit" disabled={loading || !title || !date} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><CalendarPlus size={16} /> Shift plaatsen</>}
        </motion.button>
      </form>
    </div>
  );
}
