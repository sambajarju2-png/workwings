"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Loader2, MapPin, Clock, Users, Check, X, Star, DollarSign } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [shift, setShift] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: s } = await supabase.from("shifts").select("*, locations(name, city, address, dress_code, parking_info), companies(name)").eq("id", id).single();
      setShift(s);
      const { data: a } = await supabase.from("applications").select("*, workers(first_name, last_name, rating_avg, total_shifts, city)").eq("shift_id", id).order("applied_at", { ascending: false });
      setApps(a || []);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleAction(appId: string, status: "accepted" | "rejected") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const update: any = { status };
    if (status === "accepted") update.accepted_at = new Date().toISOString();
    if (status === "rejected") update.rejected_at = new Date().toISOString();
    await supabase.from("applications").update(update).eq("id", appId);
    setApps(prev => prev.map(a => a.id === appId ? { ...a, ...update } : a));
    if (status === "accepted" && shift) {
      await supabase.from("shifts").update({ workers_filled: shift.workers_filled + 1 }).eq("id", id);
      setShift((s: any) => ({ ...s, workers_filled: s.workers_filled + 1 }));
    }
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;
  if (!shift) return <div className="p-10 text-center" style={{ color: "#8BA3B5" }}>Shift niet gevonden</div>;

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link href="/admin/shifts" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}><ArrowLeft size={16} /> Terug</Link>

      <h1 className="text-2xl font-black mb-1" style={{ color: "#023047" }}>{shift.title}</h1>
      <p className="text-sm mb-6" style={{ color: "#8BA3B5" }}>{shift.companies?.name}</p>

      <div className="grid md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: <Clock size={16} />, label: "Datum", val: `${new Date(shift.date + "T00:00:00").toLocaleDateString("nl-NL")} · ${shift.start_time?.slice(0, 5)}-${shift.end_time?.slice(0, 5)}` },
          { icon: <MapPin size={16} />, label: "Locatie", val: shift.locations?.city || "-" },
          { icon: <DollarSign size={16} />, label: "Tarief", val: `€${Number(shift.rate_per_hour).toFixed(0)}/uur` },
          { icon: <Users size={16} />, label: "Gevuld", val: `${shift.workers_filled}/${shift.workers_needed}` },
        ].map((p, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border" style={{ borderColor: "#E8EDF2" }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: "#8BA3B5" }}>{p.icon}<span className="text-xs font-semibold">{p.label}</span></div>
            <div className="text-sm font-bold" style={{ color: "#023047" }}>{p.val}</div>
          </div>
        ))}
      </div>

      {shift.description && <div className="bg-white p-5 rounded-xl border mb-8" style={{ borderColor: "#E8EDF2" }}><p className="text-xs font-semibold mb-1" style={{ color: "#8BA3B5" }}>Beschrijving</p><p className="text-sm" style={{ color: "#4A6B7F" }}>{shift.description}</p></div>}

      <h2 className="text-lg font-bold mb-4" style={{ color: "#023047" }}>Sollicitaties ({apps.length})</h2>
      {apps.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: "#E8EDF2" }}><p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen sollicitaties</p></div>
      ) : (
        <div className="space-y-3">
          {apps.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: "#E8EDF2" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#023047" }}>{a.workers?.first_name?.[0]}{a.workers?.last_name?.[0]}</div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#023047" }}>{a.workers?.first_name} {a.workers?.last_name}</div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#8BA3B5" }}>
                    <span>{a.workers?.city}</span><span>·</span><span>{a.workers?.total_shifts || 0} shifts</span><span>·</span>
                    <span className="flex items-center gap-0.5"><Star size={10} fill="#EF476F" style={{ color: "#EF476F" }} />{Number(a.workers?.rating_avg || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              {a.status === "pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => handleAction(a.id, "accepted")} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ background: "#0e8a8d" }}><Check size={12} /> Accept</button>
                  <button onClick={() => handleAction(a.id, "rejected")} className="px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1" style={{ borderColor: "#E8EDF2", color: "#8BA3B5" }}><X size={12} /> Weiger</button>
                </div>
              ) : (
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: a.status === "accepted" ? "rgba(167,218,220,0.12)" : "rgba(239,71,111,0.08)", color: a.status === "accepted" ? "#0e8a8d" : "#EF476F" }}>
                  {a.status === "accepted" ? "Geaccepteerd" : "Afgewezen"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
