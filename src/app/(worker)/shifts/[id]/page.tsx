"use client";
import { useState, useEffect, use } from "react";
import { ArrowLeft, Heart, MoreHorizontal, MapPin, Clock, Shirt, Car, Users, Star, CheckCircle, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [proposedRate, setProposedRate] = useState("");
  const [applied, setApplied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/shifts/${id}`);
      if (res.ok) { const data = await res.json(); setShift(data.shift || data); }

      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data: existing } = await supabase.from("applications").select("id").eq("shift_id", id).eq("worker_id", user.id).single();
          if (existing) setApplied(true);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleApply() {
    if (!userId) { router.push("/login"); return; }
    setApplying(true);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.from("applications").insert({
      shift_id: id, worker_id: userId, status: "pending",
      proposed_rate: Number(shift?.rate_per_hour) || 0,
    });

    if (!error) setApplied(true);
    setApplying(false);
  }

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-foreground-subtle" /></div>;
  if (!shift) return <div className="p-6 text-center text-foreground-subtle">Shift niet gevonden</div>;

  const startH = shift.start_time ? parseInt(shift.start_time.split(":")[0]) : 9;
  const endH = shift.end_time ? parseInt(shift.end_time.split(":")[0]) : 17;
  const hours = endH > startH ? endH - startH : (24 - startH + endH);
  const rate = Number(shift.rate_per_hour) || 0;
  const estimated = (rate * hours).toFixed(0);

  return (
    <div className="pb-24 bg-background min-h-screen">
      {/* Header */}
      <div className="h-48 relative flex items-center justify-center" style={{ background: shift.companies?.header_image_url ? `url(${shift.companies.header_image_url}) center/cover` : "#F0F4F8" }}>
        {!shift.companies?.header_image_url && <span className="text-sm text-foreground-subtle">Bedrijfsfoto</span>}
        <button onClick={() => router.back()} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><ArrowLeft size={18} /></button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><Heart size={18} /></button>
          <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* Shift info card */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
          <div className="text-xs font-semibold mb-1" style={{ color: "#A7DADC" }}>{shift.sector} · {shift.locations?.city}</div>
          <h1 className="text-xl font-black text-foreground mb-2">{shift.title}</h1>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-foreground">{shift.companies?.name}</span>
            {shift.companies?.rating_avg && <><Star size={12} fill="#EF476F" style={{ color: "#EF476F" }} /><span className="text-xs font-semibold text-foreground">{Number(shift.companies.rating_avg).toFixed(1)}</span></>}
          </div>
          <div className="flex items-center gap-3 text-xs text-foreground-muted mb-3">
            <span>{new Date(shift.date + "T00:00:00").toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" })}</span>
            <span>|</span>
            <span>{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</span>
            <span>|</span>
            <span>{shift.locations?.city}</span>
          </div>
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <span className="text-xs text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed} plekken</span>
            <div><span className="text-2xl font-black" style={{ color: "#EF476F" }}>€ {rate.toFixed(2).replace(".", ",")}</span><span className="text-sm text-foreground-muted">/uur</span></div>
          </div>
        </div>
      </div>

      {/* Location & details */}
      <div className="px-4 mt-4">
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {/* Map placeholder */}
          <div className="h-32 flex items-center justify-center" style={{ background: "#F0F4F8" }}>
            <Send size={20} style={{ color: "#8BA3B5" }} />
          </div>
          <div className="p-4 space-y-3">
            {shift.locations?.address && (
              <div className="flex items-start gap-3"><MapPin size={16} className="flex-shrink-0 mt-0.5 text-foreground-subtle" /><div><div className="text-sm font-medium text-foreground">{shift.locations.address}</div><div className="text-xs text-foreground-subtle">{shift.locations.city}</div></div></div>
            )}
            {shift.locations?.dress_code && (
              <div className="flex items-start gap-3"><Shirt size={16} className="flex-shrink-0 mt-0.5 text-foreground-subtle" /><div className="text-sm text-foreground">{shift.locations.dress_code}</div></div>
            )}
            {shift.locations?.parking_info && (
              <div className="flex items-start gap-3"><Car size={16} className="flex-shrink-0 mt-0.5 text-foreground-subtle" /><div className="text-sm text-foreground">{shift.locations.parking_info}</div></div>
            )}
            <div className="flex items-start gap-3"><Users size={16} className="flex-shrink-0 mt-0.5 text-foreground-subtle" /><div className="text-sm text-foreground">We zoeken {shift.workers_needed} freelancers</div></div>
          </div>
        </div>
      </div>

      {/* Description */}
      {shift.description && (
        <div className="px-4 mt-4">
          <div className="bg-surface rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Beschrijving</h3>
            <p className="text-sm text-foreground-muted leading-relaxed">{shift.description}</p>
          </div>
        </div>
      )}

      {/* Requirements */}
      {shift.requirements?.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-surface rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">Vereisten</h3>
            {shift.requirements.map((r: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-foreground-muted py-1"><CheckCircle size={14} style={{ color: "#A7DADC" }} /> {r}</div>
            ))}
          </div>
        </div>
      )}

      {/* Estimated earnings */}
      <div className="px-4 mt-4">
        <div className="bg-surface rounded-2xl border border-border p-4 flex items-center justify-between">
          <span className="text-sm text-foreground-muted">Geschatte verdienste</span>
          <span className="text-lg font-black text-foreground">€{estimated}</span>
        </div>
      </div>

      {/* Sticky apply bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 flex items-center justify-between z-50 safe-area-bottom">
        <div>
          <span className="text-lg font-black" style={{ color: "#EF476F" }}>€{rate.toFixed(2).replace(".", ",")}</span>
          <span className="text-xs text-foreground-muted">/uur</span>
        </div>
        <button onClick={handleApply} disabled={applying || applied}
          className="px-8 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-60"
          style={{ background: applied ? "#0e8a8d" : "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {applying ? <Loader2 size={16} className="animate-spin" /> : applied ? <><CheckCircle size={16} /> Gesolliciteerd</> : "Solliciteren"}
        </button>
      </div>
    </div>
  );
}
