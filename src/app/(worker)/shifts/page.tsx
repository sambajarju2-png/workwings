"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, SlidersHorizontal, X, Clock } from "lucide-react";
import Link from "next/link";

const sectorFilters = [
  { value: "all", label: "Alles" }, { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

const mockShifts = [
  { id:"1", title:"Barista", company:"Coffee Company", sector:"horeca", rate:22, date:"2026-04-10", start:"08:00", end:"16:00", city:"Amsterdam", workers_needed:2, workers_filled:1 },
  { id:"2", title:"Orderpicker", company:"DHL", sector:"logistics", rate:19, date:"2026-04-11", start:"18:00", end:"02:00", city:"Schiphol", workers_needed:5, workers_filled:2 },
  { id:"3", title:"Eventhost", company:"RAI Amsterdam", sector:"events", rate:24, date:"2026-04-12", start:"14:00", end:"22:00", city:"Amsterdam", workers_needed:3, workers_filled:0 },
  { id:"4", title:"Kassamedewerker", company:"Uniqlo", sector:"retail", rate:18, date:"2026-04-12", start:"10:00", end:"18:00", city:"Amsterdam", workers_needed:1, workers_filled:0 },
  { id:"5", title:"Afwasser", company:"Hotel Okura", sector:"horeca", rate:20, date:"2026-04-13", start:"17:00", end:"01:00", city:"Amsterdam", workers_needed:2, workers_filled:1 },
  { id:"6", title:"Schoonmaker", company:"Facilicom", sector:"cleaning", rate:17, date:"2026-04-14", start:"06:00", end:"14:00", city:"Utrecht", workers_needed:4, workers_filled:1 },
  { id:"7", title:"Bezorger", company:"Flink", sector:"delivery", rate:16, date:"2026-04-10", start:"11:00", end:"15:00", city:"Rotterdam", workers_needed:6, workers_filled:3 },
  { id:"8", title:"Kok", company:"Vermaat", sector:"horeca", rate:26, date:"2026-04-11", start:"15:00", end:"23:00", city:"Den Haag", workers_needed:1, workers_filled:0 },
];

function formatDate(d: string) {
  const date = new Date(d); const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Vandaag";
  if (date.toDateString() === tomorrow.toDateString()) return "Morgen";
  return date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

export default function ShiftsPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");

  const filtered = mockShifts.filter(s => {
    if (sector !== "all" && s.sector !== sector) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.company.toLowerCase().includes(search.toLowerCase()) && !s.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Zoek op functie, bedrijf of stad..."
            className="w-full pl-10 pr-3 py-3 rounded-xl text-foreground text-sm placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {sectorFilters.map(f => (
          <button key={f.value} onClick={() => setSector(f.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border"
            style={{
              background: sector === f.value ? "#EF476F" : "var(--color-surface)",
              color: sector === f.value ? "white" : "var(--color-foreground-muted)",
              borderColor: sector === f.value ? "#EF476F" : "var(--color-border)",
            }}>{f.label}</button>
        ))}
      </div>

      <div className="text-xs font-medium text-foreground-subtle">{filtered.length} shifts gevonden</div>

      {/* Shift list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((shift, i) => (
            <motion.div key={shift.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/shifts/${shift.id}`}>
                <motion.div whileTap={{ scale: 0.98 }} className="p-4 rounded-xl bg-surface border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-foreground font-bold">{shift.title}</h3>
                      <p className="text-xs text-foreground-subtle">{shift.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black" style={{ color: "#A7DADC" }}>€{shift.rate}</div>
                      <div className="text-[10px] text-foreground-subtle">per uur</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                    <span className="flex items-center gap-1"><Clock size={12} />{formatDate(shift.date)}, {shift.start} – {shift.end}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{shift.city}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-border">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(shift.workers_filled / shift.workers_needed) * 100}%`,
                          background: shift.workers_filled >= shift.workers_needed ? "#A7DADC" : "#EF476F" }} />
                    </div>
                    <span className="text-[10px] font-medium text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed}</span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
