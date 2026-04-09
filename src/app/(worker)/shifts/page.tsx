"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, Heart, SlidersHorizontal, UtensilsCrossed, ShoppingBag, Package, PartyPopper, Sparkles, Truck } from "lucide-react";
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

const mockShifts = [
  { id:"1", title:"Barista", company:"Coffee Company", sector:"horeca", rate:22, date:"2026-04-10", start:"08:00", end:"16:00", city:"Amsterdam", distance:"1.2 km", workers_needed:2, workers_filled:1, img:"/api/placeholder/400/200", tags:["Selected for you"] },
  { id:"2", title:"Orderpicker Avonddienst", company:"DHL Express", sector:"logistics", rate:19, date:"2026-04-11", start:"18:00", end:"02:00", city:"Schiphol", distance:"8.5 km", workers_needed:5, workers_filled:2, img:"/api/placeholder/400/200", tags:[] },
  { id:"3", title:"Eventhost Grand Opening", company:"RAI Amsterdam", sector:"events", rate:24, date:"2026-04-12", start:"14:00", end:"22:00", city:"Amsterdam", distance:"3.1 km", workers_needed:3, workers_filled:0, img:"/api/placeholder/400/200", tags:["Selected for you", "+1 day"] },
  { id:"4", title:"Kassamedewerker", company:"Uniqlo Kalverstraat", sector:"retail", rate:18, date:"2026-04-12", start:"10:00", end:"18:00", city:"Amsterdam", distance:"0.8 km", workers_needed:1, workers_filled:0, img:"/api/placeholder/400/200", tags:["Freelance"] },
  { id:"5", title:"Afwasser Avonddienst", company:"Hotel Okura", sector:"horeca", rate:20, date:"2026-04-13", start:"17:00", end:"01:00", city:"Amsterdam", distance:"2.4 km", workers_needed:2, workers_filled:1, img:"/api/placeholder/400/200", tags:[] },
  { id:"6", title:"Schoonmaker Kantoor", company:"Facilicom Group", sector:"cleaning", rate:17, date:"2026-04-14", start:"06:00", end:"14:00", city:"Utrecht", distance:"35 km", workers_needed:4, workers_filled:1, img:"/api/placeholder/400/200", tags:["Freelance"] },
];

function formatDate(d: string) {
  const date = new Date(d); const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Vandaag";
  if (date.toDateString() === tomorrow.toDateString()) return "Morgen";
  return date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function estimateEarnings(rate: number, start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let hours = (eh + em/60) - (sh + sm/60);
  if (hours < 0) hours += 24;
  return (rate * hours).toFixed(0);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-foreground">Ontdek</h1>
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border">
          <SlidersHorizontal size={18} className="text-foreground-muted" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{background:"#EF476F"}}>3</div>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Zoek op functie, bedrijf of stad..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-foreground text-sm placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
      </div>

      {/* Sector filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {sectorFilters.map(f => (
          <button key={f.value} onClick={() => setSector(f.value)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border"
            style={{
              background: sector === f.value ? "#EF476F" : "var(--color-surface)",
              color: sector === f.value ? "white" : "var(--color-foreground-muted)",
              borderColor: sector === f.value ? "#EF476F" : "var(--color-border)",
            }}>
            {f.icon}{f.label}
          </button>
        ))}
      </div>

      {/* Shift cards — Temper/YoungOnes style with image placeholders */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((shift, i) => (
            <motion.div key={shift.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/shifts/${shift.id}`}>
                <motion.div whileTap={{ scale: 0.98 }} className="rounded-2xl overflow-hidden bg-surface border border-border">
                  {/* Image placeholder */}
                  <div className="relative h-44 bg-background-alt flex items-center justify-center">
                    <div className="text-foreground-subtle text-xs">Bedrijfsfoto</div>
                    {/* Favorite button */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center"
                      onClick={e => e.preventDefault()}>
                      <Heart size={16} className="text-foreground-subtle" />
                    </button>
                    {/* Tags */}
                    {shift.tags.length > 0 && (
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {shift.tags.map((tag, j) => (
                          <span key={j} className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface/80 backdrop-blur text-foreground-muted border border-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    {/* Company + distance */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold" style={{color:"#A7DADC"}}>{shift.company}</span>
                      <span className="text-xs text-foreground-subtle">{shift.distance}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-foreground mb-2">{shift.title}</h3>

                    {/* Date, time, location */}
                    <div className="flex items-center gap-3 text-xs text-foreground-muted mb-3">
                      <span>{formatDate(shift.date)}</span>
                      <span className="w-px h-3 bg-border" />
                      <span>{shift.start} - {shift.end}</span>
                      <span className="w-px h-3 bg-border" />
                      <span className="flex items-center gap-1"><MapPin size={10}/>{shift.city}</span>
                    </div>

                    {/* Rate + estimate */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed} plekken</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-foreground">€ {shift.rate.toFixed(2).replace(".",",")}</span>
                        <span className="text-xs text-foreground-subtle">/uur</span>
                        <div className="text-[10px] text-foreground-subtle">Schatting € {estimateEarnings(shift.rate, shift.start, shift.end)}</div>
                      </div>
                    </div>
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
