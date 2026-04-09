"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Heart, SlidersHorizontal, UtensilsCrossed, ShoppingBag, Package, PartyPopper, Sparkles, Truck, Loader2 } from "lucide-react";
import Link from "next/link";

const sectorFilters = [
  { value: "all", label: "Alles", icon: null },
  { value: "horeca", label: "Horeca", icon: <UtensilsCrossed size={14}/> },
  { value: "retail", label: "Retail", icon: <ShoppingBag size={14}/> },
  { value: "logistics", label: "Logistiek", icon: <Package size={14}/> },
  { value: "events", label: "Events", icon: <PartyPopper size={14}/> },
  { value: "cleaning", label: "Schoonmaak", icon: <Sparkles size={14}/> },
  { value: "delivery", label: "Bezorging", icon: <Truck size={14}/> },
];

interface Shift {
  id: string; title: string; description: string; sector: string;
  date: string; start_time: string; end_time: string; rate_per_hour: number;
  workers_needed: number; workers_filled: number; status: string;
  requirements: string[];
  companies: { id: string; name: string; brand_color: string; description: string };
  locations: { id: string; name: string; address: string; city: string; lat: number; lng: number; dress_code: string; parking_info: string };
}

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (date.getTime() === today.getTime()) return "Vandaag";
  if (date.getTime() === tomorrow.getTime()) return "Morgen";
  return date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(t: string) { return t.slice(0, 5); }

function estimateEarnings(rate: number, start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let hours = (eh + em / 60) - (sh + sm / 60);
  if (hours < 0) hours += 24;
  return (rate * hours).toFixed(0);
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");

  useEffect(() => {
    fetch("/api/shifts")
      .then(r => r.json())
      .then(data => { setShifts(data.shifts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = shifts.filter(s => {
    if (sector !== "all" && s.sector !== sector) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.companies?.name?.toLowerCase().includes(q) && !s.locations?.city?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-foreground">Ontdek</h1>
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border">
          <SlidersHorizontal size={18} className="text-foreground-muted" />
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Zoek op functie, bedrijf of stad..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-foreground text-sm placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {sectorFilters.map(f => (
          <button key={f.value} onClick={() => setSector(f.value)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border"
            style={{
              background: sector === f.value ? "#EF476F" : "var(--color-surface)",
              color: sector === f.value ? "white" : "var(--color-foreground-muted)",
              borderColor: sector === f.value ? "#EF476F" : "var(--color-border)",
            }}>{f.icon}{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-foreground-subtle" />
        </div>
      ) : (
        <>
          <div className="text-xs font-medium text-foreground-subtle">{filtered.length} shifts gevonden</div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((shift, i) => (
                <motion.div key={shift.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/shifts/${shift.id}`}>
                    <motion.div whileTap={{ scale: 0.98 }} className="rounded-2xl overflow-hidden bg-surface border border-border">
                      <div className="relative h-44 bg-background-alt flex items-center justify-center">
                        <div className="text-foreground-subtle text-xs">Bedrijfsfoto</div>
                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center"
                          onClick={e => e.preventDefault()}><Heart size={16} className="text-foreground-subtle" /></button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold" style={{ color: "#A7DADC" }}>{shift.companies?.name}</span>
                          <span className="text-xs text-foreground-subtle">{shift.locations?.city}</span>
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-2">{shift.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-foreground-muted mb-3">
                          <span>{formatDate(shift.date)}</span>
                          <span className="w-px h-3 bg-border" />
                          <span>{formatTime(shift.start_time)} - {formatTime(shift.end_time)}</span>
                          <span className="w-px h-3 bg-border" />
                          <span className="flex items-center gap-1"><MapPin size={10} />{shift.locations?.city}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed} plekken</span>
                          <div className="text-right">
                            <span className="text-lg font-black text-foreground">€ {shift.rate_per_hour.toFixed(2).replace(".", ",")}</span>
                            <span className="text-xs text-foreground-subtle">/uur</span>
                            <div className="text-[10px] text-foreground-subtle">
                              Schatting € {estimateEarnings(shift.rate_per_hour, shift.start_time, shift.end_time)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
