"use client";
import { useState, useEffect } from "react";
import { Check, X, Star, Loader2, Clock, User } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership) { setLoading(false); return; }

      const { data: shifts } = await supabase.from("shifts").select("id").eq("company_id", membership.company_id);
      const shiftIds = (shifts || []).map((s: any) => s.id);
      if (!shiftIds.length) { setApps([]); setLoading(false); return; }

      const { data } = await supabase.from("applications")
        .select("*, workers(first_name, last_name, rating_avg, total_shifts, city, sectors), shifts(title, date, rate_per_hour)")
        .in("shift_id", shiftIds).order("applied_at", { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAction(id: string, status: "accepted" | "rejected") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const update: any = { status };
    if (status === "accepted") update.accepted_at = new Date().toISOString();
    if (status === "rejected") update.rejected_at = new Date().toISOString();
    await supabase.from("applications").update(update).eq("id", id);
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...update } : a));
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Sollicitaties</h1>

      {apps.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E8EDF2" }}>
          <User size={32} style={{ color: "#E8EDF2" }} className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen sollicitaties</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((a: any) => (
            <div key={a.id} className="bg-white rounded-xl border p-5 flex items-center justify-between" style={{ borderColor: "#E8EDF2" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#023047" }}>
                  {a.workers?.first_name?.[0]}{a.workers?.last_name?.[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#023047" }}>{a.workers?.first_name} {a.workers?.last_name}</div>
                  <div className="text-xs" style={{ color: "#8BA3B5" }}>
                    {a.shifts?.title} · {a.shifts?.date} · {a.workers?.city || ""} · {a.workers?.total_shifts || 0} shifts
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Star size={12} style={{ color: "#EF476F" }} fill="#EF476F" />
                  <span className="text-xs font-semibold" style={{ color: "#023047" }}>{Number(a.workers?.rating_avg || 0).toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "pending" ? (
                  <>
                    <button onClick={() => handleAction(a.id, "accepted")} className="p-2 rounded-lg text-white" style={{ background: "#0e8a8d" }}><Check size={16} /></button>
                    <button onClick={() => handleAction(a.id, "rejected")} className="p-2 rounded-lg border" style={{ borderColor: "#E8EDF2", color: "#8BA3B5" }}><X size={16} /></button>
                  </>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background: a.status === "accepted" ? "rgba(167,218,220,0.12)" : "rgba(239,71,111,0.08)", color: a.status === "accepted" ? "#0e8a8d" : "#EF476F" }}>
                    {a.status === "accepted" ? "Geaccepteerd" : "Afgewezen"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
