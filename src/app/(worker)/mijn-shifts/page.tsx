"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, CheckCircle, AlertCircle, MapPin, Heart } from "lucide-react";
import Link from "next/link";

type Tab = "pending" | "matched" | "completed";

const tabs: { value: Tab; label: string }[] = [
  { value: "pending", label: "In afwachting" },
  { value: "matched", label: "Geaccepteerd" },
  { value: "completed", label: "Voltooid" },
];

const shifts = {
  pending: [
    { id: "10", title: "Kok Avondshift", company: "Restaurant De Kas", date: "Za, 12 apr", time: "17:00 - 23:00", city: "Amsterdam", rate: 24, status: "In afwachting" },
    { id: "11", title: "Retail Medewerker", company: "Zara Kalverstraat", date: "Zo, 13 apr", time: "10:00 - 18:00", city: "Amsterdam", rate: 18, status: "In afwachting" },
  ],
  matched: [
    { id: "1", title: "Barista Ochtend", company: "Coffee Company", date: "Do, 10 apr", time: "08:00 - 16:00", city: "Amsterdam", rate: 22, status: "Geaccepteerd" },
    { id: "2", title: "Orderpicker Avond", company: "DHL Express", date: "Vr, 11 apr", time: "18:00 - 02:00", city: "Schiphol", rate: 19, status: "Geaccepteerd" },
  ],
  completed: [
    { id: "20", title: "Eventhost RAI", company: "RAI Amsterdam", date: "Ma, 7 apr", time: "14:00 - 22:00", city: "Amsterdam", rate: 24, status: "Voltooid", paid: true, amount: "192,00" },
    { id: "21", title: "Afwasser", company: "Hotel Okura", date: "Zo, 6 apr", time: "17:00 - 01:00", city: "Amsterdam", rate: 20, status: "Betaald", paid: true, amount: "160,00" },
    { id: "22", title: "Bezorger", company: "Flink Amsterdam", date: "Za, 5 apr", time: "11:00 - 15:00", city: "Amsterdam", rate: 16, status: "Betaald", paid: true, amount: "64,00" },
  ],
};

const statusColors: Record<string, { bg: string; text: string }> = {
  "In afwachting": { bg: "rgba(239,71,111,0.08)", text: "#EF476F" },
  "Geaccepteerd": { bg: "rgba(167,218,220,0.1)", text: "#0e8a8d" },
  "Voltooid": { bg: "rgba(167,218,220,0.1)", text: "#0e8a8d" },
  "Betaald": { bg: "rgba(34,197,94,0.08)", text: "#16a34a" },
};

export default function MijnShiftsPage() {
  const [tab, setTab] = useState<Tab>("matched");

  const currentShifts = shifts[tab] as typeof shifts.completed;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-foreground">Mijn Shifts</h1>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-border">
          <Search size={18} className="text-foreground-muted" />
        </button>
      </div>

      {/* Tabs — like YoungOnes */}
      <div className="flex border-b border-border">
        {tabs.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            className="flex-1 py-3 text-sm font-semibold text-center transition-colors relative"
            style={{ color: tab === t.value ? "#EF476F" : "var(--color-foreground-subtle)" }}>
            {t.label}
            {tab === t.value && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5" style={{background:"#EF476F"}} />
            )}
          </button>
        ))}
      </div>

      {/* Shift list */}
      <div className="space-y-3">
        {currentShifts.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={32} className="mx-auto mb-3 text-foreground-subtle" />
            <p className="text-sm text-foreground-subtle">Geen shifts in deze categorie</p>
          </div>
        ) : (
          currentShifts.map((shift, i) => (
            <motion.div key={shift.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/shifts/${shift.id}`}>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  {/* Image placeholder */}
                  <div className="h-36 bg-background-alt flex items-center justify-center relative">
                    <div className="text-foreground-subtle text-xs">Bedrijfsfoto</div>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center"
                      onClick={e => e.preventDefault()}>
                      <Heart size={14} className="text-foreground-subtle" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-bold" style={{color:"#A7DADC"}}>{shift.company}</span>
                    <h3 className="text-base font-bold text-foreground mt-0.5">{shift.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-foreground-muted mt-2">
                      <span>{shift.date}</span>
                      <span className="w-px h-3 bg-border" />
                      <span>{shift.time}</span>
                      <span className="w-px h-3 bg-border" />
                      <span>{shift.city}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: (statusColors[shift.status] || statusColors["Voltooid"]).bg,
                          color: (statusColors[shift.status] || statusColors["Voltooid"]).text,
                        }}>
                        {shift.status}
                      </span>
                      <div className="text-right">
                        {"amount" in shift && shift.amount ? (
                          <span className="text-sm font-bold" style={{color:"#16a34a"}}>€ {shift.amount} betaald</span>
                        ) : (
                          <span className="text-sm font-bold text-foreground">€ {shift.rate.toFixed(2).replace(".",",")}/uur</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
