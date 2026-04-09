"use client";
import { useState, useEffect } from "react";
import { TrendingUp, CalendarDays, Clock, Star, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function WorkerDashboard() {
  const [worker, setWorker] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: w } = await supabase.from("workers").select("*").eq("id", user.id).single();
      setWorker(w);

      // Get accepted applications with shift details
      const { data: apps } = await supabase.from("applications")
        .select("*, shifts(title, date, start_time, end_time, rate_per_hour, companies(name), locations(city))")
        .eq("worker_id", user.id).eq("status", "accepted").order("applied_at", { ascending: false }).limit(5);
      setUpcoming(apps || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const name = worker ? worker.first_name : "daar";

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-black text-foreground mb-1">Hey {name}</h1>
      <p className="text-sm text-foreground-subtle mb-6">Welkom bij WorkWings</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { val: worker?.total_shifts || 0, label: "Shifts", icon: <CalendarDays size={14} /> },
          { val: `${Number(worker?.total_hours || 0).toFixed(0)}u`, label: "Uren", icon: <Clock size={14} /> },
          { val: Number(worker?.rating_avg || 0).toFixed(1), label: "Rating", icon: <Star size={14} /> },
        ].map((s, i) => (
          <div key={i} className="bg-surface rounded-xl p-3 border border-border text-center">
            <div className="flex justify-center mb-1 text-foreground-subtle">{s.icon}</div>
            <div className="text-lg font-black text-foreground">{s.val}</div>
            <div className="text-xs text-foreground-subtle">{s.label}</div>
          </div>
        ))}
      </div>

      {/* BTW warning */}
      {worker && !worker.btw_number && (worker.shifts_without_btw || 0) > 0 && (
        <div className="p-3 rounded-xl mb-4 text-xs" style={{ background: "rgba(239,71,111,0.06)", color: "#EF476F" }}>
          Je hebt nog <strong>{3 - (worker.shifts_without_btw || 0)} shifts</strong> zonder BTW-nummer. Voeg je BTW-nummer toe in je profiel.
        </div>
      )}

      {/* Quick action */}
      <Link href="/shifts" className="block w-full p-4 rounded-xl text-white font-bold text-center mb-6" style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
        Shifts bekijken <ArrowRight size={16} className="inline ml-1" />
      </Link>

      {/* Upcoming shifts */}
      <h2 className="text-sm font-bold text-foreground mb-3">Aankomende shifts</h2>
      {upcoming.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-6 text-center">
          <p className="text-sm text-foreground-subtle">Nog geen shifts gepland</p>
          <Link href="/shifts" className="text-xs font-bold mt-2 inline-block" style={{ color: "#EF476F" }}>Bekijk beschikbare shifts</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((a: any) => (
            <Link key={a.id} href={`/shifts/${a.shifts?.id || a.shift_id}`} className="block bg-surface rounded-xl border border-border p-4">
              <div className="font-semibold text-sm text-foreground">{a.shifts?.title}</div>
              <div className="text-xs text-foreground-subtle mt-1">
                {a.shifts?.companies?.name} · {a.shifts?.locations?.city} · {a.shifts?.date} · {a.shifts?.start_time?.slice(0, 5)}-{a.shifts?.end_time?.slice(0, 5)}
              </div>
              <div className="text-xs font-bold mt-1" style={{ color: "#EF476F" }}>€{Number(a.shifts?.rate_per_hour || 0).toFixed(0)}/uur</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
