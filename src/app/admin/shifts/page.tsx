"use client";
import { useState, useEffect } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const sc: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "rgba(239,71,111,0.08)", text: "#EF476F", label: "Open" },
  filled: { bg: "rgba(167,218,220,0.12)", text: "#0e8a8d", label: "Gevuld" },
  completed: { bg: "rgba(34,197,94,0.06)", text: "#22c55e", label: "Afgerond" },
  cancelled: { bg: "#F0F4F8", text: "#8BA3B5", label: "Geannuleerd" },
};

export default function AdminShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership) { setLoading(false); return; }
      const { data } = await supabase.from("shifts").select("*, locations(city, name)").eq("company_id", membership.company_id).order("date", { ascending: false });
      setShifts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#023047" }}>Shifts</h1>
        <Link href="/admin/shifts/new" className="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2" style={{ background: "#EF476F" }}>
          <CalendarPlus size={16} /> Nieuwe Shift
        </Link>
      </div>

      {shifts.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E8EDF2" }}>
          <p className="text-sm mb-4" style={{ color: "#8BA3B5" }}>Nog geen shifts geplaatst</p>
          <Link href="/admin/shifts/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: "#EF476F" }}>
            <CalendarPlus size={16} /> Eerste shift plaatsen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
              {["Titel", "Locatie", "Datum", "Tijd", "Tarief", "Gevuld", "Status"].map(h =>
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
              )}
            </tr></thead>
            <tbody>{shifts.map((s: any) => (
              <tr key={s.id} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" style={{ borderColor: "#F0F4F8" }}
                onClick={() => window.location.href = `/admin/shifts/${s.id}`}>
                <td className="px-5 py-3 font-semibold" style={{ color: "#023047" }}>{s.title}</td>
                <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{s.locations?.city || "-"}</td>
                <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{new Date(s.date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</td>
                <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}</td>
                <td className="px-5 py-3 font-semibold" style={{ color: "#023047" }}>€{Number(s.rate_per_hour).toFixed(0)}/uur</td>
                <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{s.workers_filled}/{s.workers_needed}</td>
                <td className="px-5 py-3"><span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sc[s.status]?.bg || "#F0F4F8", color: sc[s.status]?.text || "#8BA3B5" }}>{sc[s.status]?.label || s.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
