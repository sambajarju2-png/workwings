"use client";
import { useState, useEffect } from "react";
import { Star, Heart, Ban, Loader2, Users } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminFlexpoolPage() {
  const [pool, setPool] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: membership } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!membership) { setLoading(false); return; }

      const { data } = await supabase.from("flexpool")
        .select("*, workers(first_name, last_name, rating_avg, total_shifts, city, sectors)")
        .eq("company_id", membership.company_id).order("added_at", { ascending: false });
      setPool(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleBlock(id: string, blocked: boolean) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.from("flexpool").update({ blocked }).eq("id", id);
    setPool(prev => prev.map(p => p.id === id ? { ...p, blocked } : p));
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Flexpool</h1>
      <p className="text-sm mb-6" style={{ color: "#8BA3B5" }}>Je favoriete freelancers. Stel auto-accept in zodat ze automatisch worden geaccepteerd voor je shifts.</p>

      {pool.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E8EDF2" }}>
          <Users size={32} style={{ color: "#E8EDF2" }} className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8BA3B5" }}>Nog niemand in je flexpool</p>
          <p className="text-xs mt-1" style={{ color: "#8BA3B5" }}>Voeg freelancers toe na een geslaagde shift</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pool.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E8EDF2", opacity: p.blocked ? 0.5 : 1 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#023047" }}>
                  {p.workers?.first_name?.[0]}{p.workers?.last_name?.[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "#023047" }}>{p.workers?.first_name} {p.workers?.last_name}</div>
                  <div className="text-xs" style={{ color: "#8BA3B5" }}>{p.workers?.city} · {p.workers?.total_shifts || 0} shifts</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={12} style={{ color: "#EF476F" }} fill="#EF476F" />
                <span className="text-xs font-semibold" style={{ color: "#023047" }}>{Number(p.workers?.rating_avg || 0).toFixed(1)}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1" style={{ background: "rgba(239,71,111,0.06)", color: "#EF476F" }}>
                  <Heart size={12} /> Favoriet
                </button>
                <button onClick={() => toggleBlock(p.id, !p.blocked)} className="py-2 px-3 rounded-lg text-xs font-semibold border flex items-center gap-1" style={{ borderColor: "#E8EDF2", color: "#8BA3B5" }}>
                  <Ban size={12} /> {p.blocked ? "Deblokkeer" : "Blokkeer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
