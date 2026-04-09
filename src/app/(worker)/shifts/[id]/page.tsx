"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MoreHorizontal, MapPin, Clock, Users, Coffee, Shirt, Star, CheckCircle, MessageSquare, Navigation, Loader2 } from "lucide-react";
import Link from "next/link";

interface ShiftData {
  id: string; title: string; description: string; sector: string;
  date: string; start_time: string; end_time: string; rate_per_hour: number;
  workers_needed: number; workers_filled: number; requirements: string[];
  companies: { name: string; description: string; brand_color: string; contact_email: string; contact_phone: string };
  locations: { name: string; address: string; city: string; lat: number; lng: number; dress_code: string; parking_info: string };
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}
function formatTime(t: string) { return t.slice(0, 5); }

export default function ShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [shift, setShift] = useState<ShiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetch(`/api/shifts/${id}`)
      .then(r => r.json())
      .then(data => { setShift(data.shift); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 size={24} className="animate-spin text-foreground-subtle" />
    </div>
  );

  if (!shift) return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
      <p className="text-foreground-subtle mb-4">Shift niet gevonden</p>
      <Link href="/shifts" className="text-sm font-bold" style={{ color: "#EF476F" }}>Terug naar shifts</Link>
    </div>
  );

  const hours = (() => {
    const [sh] = shift.start_time.split(":").map(Number);
    const [eh] = shift.end_time.split(":").map(Number);
    let h = eh - sh; if (h < 0) h += 24; return h;
  })();
  const estimatedEarnings = (shift.rate_per_hour * hours).toFixed(2).replace(".", ",");

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative h-56 bg-background-alt flex items-center justify-center">
        <div className="text-foreground-subtle text-xs">Bedrijfsfoto</div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link href="/shifts" className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center"><Heart size={18} className="text-foreground-subtle" /></button>
            <button className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center"><MoreHorizontal size={18} className="text-foreground-subtle" /></button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Main card */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
          <span className="text-sm font-bold" style={{ color: "#A7DADC" }}>{shift.sector} · {shift.locations?.city}</span>
          <h1 className="text-xl font-black text-foreground">{shift.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{shift.companies?.name}</span>
            <div className="flex items-center gap-1"><Star size={12} fill="#f59e0b" color="#f59e0b" /><span className="text-xs font-bold text-foreground">4.7</span></div>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <span>{formatDate(shift.date)}</span><span className="w-px h-3 bg-border" />
            <span>{formatTime(shift.start_time)} - {formatTime(shift.end_time)}</span><span className="w-px h-3 bg-border" />
            <span>{shift.locations?.city}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed} plekken</span>
            <div><span className="text-2xl font-black text-foreground">€ {shift.rate_per_hour.toFixed(2).replace(".",",")}</span><span className="text-sm text-foreground-subtle">/uur</span></div>
          </div>
        </div>

        {/* Map + details */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-border">
          <div className="h-40 bg-background-alt flex items-center justify-center"><Navigation size={24} className="text-foreground-subtle" /></div>
          <div className="p-4 bg-surface space-y-2.5">
            <div className="flex items-start gap-3"><MapPin size={16} className="text-foreground-subtle mt-0.5 flex-shrink-0" /><div><div className="text-sm font-medium text-foreground">{shift.locations?.address}</div><div className="text-xs text-foreground-subtle">{shift.locations?.city}</div></div></div>
            {shift.locations?.dress_code && <div className="flex items-center gap-3"><Shirt size={16} className="text-foreground-subtle flex-shrink-0" /><span className="text-sm text-foreground-muted">{shift.locations.dress_code}</span></div>}
            {shift.locations?.parking_info && <div className="flex items-center gap-3"><Coffee size={16} className="text-foreground-subtle flex-shrink-0" /><span className="text-sm text-foreground-muted">{shift.locations.parking_info}</span></div>}
            <div className="flex items-center gap-3"><Users size={16} className="text-foreground-subtle flex-shrink-0" /><span className="text-sm text-foreground-muted">We zoeken {shift.workers_needed} freelancer{shift.workers_needed > 1 ? "s" : ""}</span></div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <p className="text-sm leading-relaxed text-foreground-muted">{shift.description}</p>
        </div>

        {/* About company */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <h3 className="text-base font-bold text-foreground mb-2">Over {shift.companies?.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
            <span className="text-sm font-bold text-foreground">4.7</span>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">{shift.companies?.description}</p>
        </div>

        {/* Requirements */}
        {shift.requirements?.length > 0 && (
          <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Vereisten</h3>
            <div className="space-y-2">
              {shift.requirements.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-foreground-muted">
                  <CheckCircle size={14} style={{ color: "#0e8a8d" }} /> {r}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-4 py-3 flex items-center justify-between">
        {!applied ? (
          <>
            <div>
              <div className="text-lg font-black text-foreground">€ {estimatedEarnings}</div>
              <button className="text-xs font-semibold" style={{ color: "#EF476F" }}>Onderhandel tarief</button>
            </div>
            <motion.button onClick={() => setApplied(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm" style={{ background: "#EF476F" }}>Solliciteren</motion.button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} style={{ color: "#0e8a8d" }} />
              <div><div className="text-sm font-bold text-foreground">Sollicitatie verstuurd</div><div className="text-xs text-foreground-subtle">Je hoort snel van {shift.companies?.name}</div></div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground-muted"><MessageSquare size={14} /> Chat</button>
          </div>
        )}
      </div>
    </div>
  );
}
