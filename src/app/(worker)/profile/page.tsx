"use client";
import { useState, useEffect } from "react";
import { User, MapPin, Star, CalendarDays, Clock, Settings, CreditCard, Bell, LogOut, Loader2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function WorkerProfilePage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("workers").select("*").eq("id", user.id).single();
      setWorker(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  return (
    <div className="pb-24">
      {/* Header banner */}
      <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #023047, #012A3E)" }}>
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-black text-white" style={{ background: "#EF476F", borderColor: "var(--color-background)" }}>
            {worker?.first_name?.[0]}{worker?.last_name?.[0]}
          </div>
        </div>
      </div>

      <div className="px-4 pt-14">
        <h1 className="text-xl font-black text-foreground">{worker?.first_name} {worker?.last_name}</h1>
        <div className="flex items-center gap-2 text-sm text-foreground-subtle mt-1">
          {worker?.city && <><MapPin size={12} /> {worker.city}</>}
          {worker?.rating_avg > 0 && <><Star size={12} fill="#EF476F" style={{ color: "#EF476F" }} /> {Number(worker.rating_avg).toFixed(1)}</>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
          {[
            { val: worker?.total_shifts || 0, label: "Shifts", icon: <CalendarDays size={14} /> },
            { val: `${Number(worker?.total_hours || 0).toFixed(0)}u`, label: "Uren", icon: <Clock size={14} /> },
            { val: Number(worker?.rating_avg || 0).toFixed(1), label: "Rating", icon: <Star size={14} /> },
          ].map((s, i) => (
            <div key={i} className="bg-surface rounded-xl p-3 border border-border text-center">
              <div className="text-lg font-black text-foreground">{s.val}</div>
              <div className="text-xs text-foreground-subtle">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sectors */}
        {worker?.sectors?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-foreground-subtle mb-2">Sectoren</p>
            <div className="flex flex-wrap gap-2">
              {worker.sectors.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold border border-border text-foreground-muted">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-surface rounded-xl border border-border divide-y divide-border mb-6">
          {[
            { label: "E-mail", val: worker?.email },
            { label: "Telefoon", val: worker?.phone || "Niet ingesteld" },
            { label: "BTW-nummer", val: worker?.btw_number || "Niet ingesteld" },
            { label: "IBAN", val: worker?.iban ? `${worker.iban.slice(0, 8)}...` : "Niet ingesteld" },
            { label: "Betaalvoorkeur", val: worker?.payout_preference === "fast" ? "Snel (5 dagen)" : "Normaal" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <span className="text-xs text-foreground-subtle">{r.label}</span>
              <span className="text-sm font-medium text-foreground">{r.val}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="bg-surface rounded-xl border border-border divide-y divide-border mb-6">
          {[
            { icon: <Settings size={16} />, label: "Instellingen" },
            { icon: <CreditCard size={16} />, label: "Betalingen & facturen" },
            { icon: <Bell size={16} />, label: "Meldingen" },
          ].map((m, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 text-sm font-medium text-foreground">
              <div className="flex items-center gap-3"><span className="text-foreground-subtle">{m.icon}</span>{m.label}</div>
              <ChevronRight size={14} className="text-foreground-subtle" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-bold" style={{ color: "#EF476F" }}>
          <LogOut size={16} /> Uitloggen
        </button>
      </div>
    </div>
  );
}
