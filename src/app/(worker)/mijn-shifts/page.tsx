"use client";
import { useState, useEffect } from "react";
import { Loader2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function MijnShiftsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [tab, setTab] = useState<"upcoming" | "completed" | "pending">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("applications")
        .select("*, shifts(id, title, date, start_time, end_time, rate_per_hour, status, companies(name), locations(city))")
        .eq("worker_id", user.id).order("applied_at", { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const today = new Date().toISOString().split("T")[0];
  const filtered = apps.filter((a: any) => {
    if (tab === "upcoming") return a.status === "accepted" && a.shifts?.date >= today;
    if (tab === "completed") return a.shifts?.status === "completed" || a.shifts?.date < today;
    return a.status === "pending";
  });

  const tabs = [
    { key: "upcoming", label: "Aankomend" },
    { key: "pending", label: "In afwachting" },
    { key: "completed", label: "Afgerond" },
  ] as const;

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-black text-foreground mb-4">Mijn Shifts</h1>

      <div className="flex gap-1 bg-background-alt rounded-xl p-1 mb-6 border border-border">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: tab === t.key ? "var(--color-surface)" : "transparent", color: tab === t.key ? "var(--color-foreground)" : "var(--color-foreground-subtle)" }}>
            {t.label} ({apps.filter((a: any) => { if (t.key === "upcoming") return a.status === "accepted" && a.shifts?.date >= today; if (t.key === "completed") return a.shifts?.date < today; return a.status === "pending"; }).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <CalendarDays size={28} className="mx-auto mb-2 text-foreground-subtle" />
          <p className="text-sm text-foreground-subtle">Geen shifts gevonden</p>
          {tab === "upcoming" && <Link href="/shifts" className="text-xs font-bold mt-2 inline-block" style={{ color: "#EF476F" }}>Bekijk beschikbare shifts</Link>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a: any) => (
            <Link key={a.id} href={`/shifts/${a.shifts?.id || a.shift_id}`} className="block bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-foreground">{a.shifts?.title}</div>
                  <div className="text-xs text-foreground-subtle mt-1">{a.shifts?.companies?.name} · {a.shifts?.locations?.city}</div>
                  <div className="text-xs text-foreground-subtle">{a.shifts?.date} · {a.shifts?.start_time?.slice(0, 5)}-{a.shifts?.end_time?.slice(0, 5)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: "#EF476F" }}>€{Number(a.shifts?.rate_per_hour || 0).toFixed(0)}/u</div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block"
                    style={{ background: a.status === "accepted" ? "rgba(167,218,220,0.12)" : a.status === "pending" ? "rgba(239,71,111,0.08)" : "#F0F4F8", color: a.status === "accepted" ? "#0e8a8d" : a.status === "pending" ? "#EF476F" : "#8BA3B5" }}>
                    {a.status === "accepted" ? "Bevestigd" : a.status === "pending" ? "In afwachting" : a.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
