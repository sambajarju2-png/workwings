"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MoreHorizontal, MapPin, Clock, Users, Coffee, Shirt, Star, CheckCircle, AlertCircle, MessageSquare, Navigation } from "lucide-react";
import Link from "next/link";

const shift = {
  id: "1", title: "Barista Ochtend", company: "Coffee Company", companyRating: 4.7, companyReviews: 128,
  companyDescription: "Coffee Company is een van de populairste koffieketens van Amsterdam. We staan bekend om onze specialty coffee en relaxte sfeer.",
  sector: "Horeca", rate: 22, date: "Do, 10 apr", start: "08:00", end: "16:00",
  city: "Amsterdam", address: "Herengracht 182", postcode: "1016 BR Amsterdam",
  distance: "1.2 km", workers_needed: 2, workers_filled: 1,
  description: "We zoeken een enthousiaste barista voor onze vestiging aan de Herengracht. Je maakt specialty koffie, helpt klanten en houdt de zaak netjes. Ervaring met espressomachines is een plus maar niet vereist.",
  requirements: ["Minimaal 18 jaar", "KVK-inschrijving", "Nederlands spreken"],
  skills: [{ name: "Koffie zetten", match: true }, { name: "Klantvriendelijk", match: true }, { name: "Kassawerk", match: false }, { name: "Schoonmaken", match: true }],
  dress_code: "Zwart shirt, eigen schoenen",
  break_info: "30 minuten pauze (onbetaald)",
  cancellation: "Annuleer minimaal 24 uur van tevoren",
  directPay: true,
};

export default function ShiftDetailPage() {
  const [applied, setApplied] = useState(false);
  const [proposedRate, setProposedRate] = useState(shift.rate.toString());
  const [showNegotiate, setShowNegotiate] = useState(false);

  const estimatedEarnings = (shift.rate * 8).toFixed(2).replace(".", ",");

  return (
    <div className="pb-24">
      {/* Header with image placeholder */}
      <div className="relative h-56 bg-background-alt flex items-center justify-center">
        <div className="text-foreground-subtle text-xs">Bedrijfsfoto</div>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link href="/shifts" className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center">
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center">
              <Heart size={18} className="text-foreground-subtle" />
            </button>
            <button className="w-9 h-9 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center">
              <MoreHorizontal size={18} className="text-foreground-subtle" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Main card */}
        <div className="bg-surface rounded-2xl border border-border p-5 space-y-4">
          {/* Company */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{color:"#A7DADC"}}>{shift.sector} · {shift.distance}</span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-black text-foreground">{shift.title}</h1>

          {/* Company info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{shift.company}</span>
            <div className="flex items-center gap-1">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span className="text-xs font-bold text-foreground">{shift.companyRating}</span>
              <span className="text-xs text-foreground-subtle">{shift.companyReviews} ratings</span>
            </div>
          </div>

          {/* Date/time/location */}
          <div className="flex items-center gap-3 text-sm text-foreground-muted">
            <span>{shift.date}</span>
            <span className="w-px h-3 bg-border" />
            <span>{shift.start} - {shift.end}</span>
            <span className="w-px h-3 bg-border" />
            <span>{shift.city}</span>
          </div>

          {/* Rate */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-foreground-subtle">{shift.workers_filled}/{shift.workers_needed} plekken</span>
            <div>
              <span className="text-2xl font-black text-foreground">€ {shift.rate.toFixed(2).replace(".",",")}</span>
              <span className="text-sm text-foreground-subtle">/uur</span>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-border">
          <div className="h-40 bg-background-alt flex items-center justify-center">
            <Navigation size={24} className="text-foreground-subtle" />
          </div>
          <div className="p-4 bg-surface space-y-2">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-foreground-subtle mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">{shift.address}</div>
                <div className="text-xs text-foreground-subtle">{shift.postcode}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Coffee size={16} className="text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground-muted">{shift.break_info}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shirt size={16} className="text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground-muted">{shift.dress_code}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={16} className="text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground-muted">We zoeken {shift.workers_needed} freelancer{shift.workers_needed > 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground-muted">{shift.cancellation}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <p className="text-sm leading-relaxed text-foreground-muted">{shift.description}</p>
          <button className="text-sm font-semibold mt-2" style={{color:"#EF476F"}}>meer</button>
        </div>

        {/* About company */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <h3 className="text-base font-bold text-foreground mb-2">Over {shift.company}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => <Star key={n} size={14} fill={n <= Math.round(shift.companyRating) ? "#f59e0b" : "none"} color="#f59e0b" />)}
            </div>
            <span className="text-sm font-bold text-foreground">{shift.companyRating}</span>
            <span className="text-xs text-foreground-subtle">{shift.companyReviews} reviews</span>
          </div>
          <p className="text-sm text-foreground-muted leading-relaxed">{shift.companyDescription}</p>
        </div>

        {/* Skills match */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{background:"rgba(167,218,220,0.08)"}}>
            <AlertCircle size={16} style={{color:"#0e8a8d"}} />
            <div>
              <span className="text-sm font-semibold text-foreground">{shift.skills.filter(s=>s.match).length} van {shift.skills.length} skills matchen</span>
              <div className="text-xs" style={{color:"#0e8a8d"}}>Je bent een goede match!</div>
            </div>
          </div>
          <h3 className="text-sm font-bold text-foreground mb-3">Vereiste skills</h3>
          <div className="flex flex-wrap gap-2">
            {shift.skills.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  background: s.match ? "rgba(167,218,220,0.06)" : "var(--color-background-alt)",
                  borderColor: s.match ? "#A7DADC" : "var(--color-border)",
                  color: "var(--color-foreground-muted)"
                }}>
                {s.match && <CheckCircle size={12} style={{color:"#0e8a8d"}} />}
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Vereisten</h3>
          <div className="space-y-2">
            {shift.requirements.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-foreground-muted">
                <CheckCircle size={14} style={{color:"#0e8a8d"}} /> {r}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-4 bg-surface rounded-2xl border border-border p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground mb-1">Voordelen</h3>
          {shift.directPay && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold" style={{background:"rgba(239,71,111,0.08)",color:"#EF476F"}}>WW</div>
              <div>
                <div className="text-sm font-semibold text-foreground">DirectPay beschikbaar</div>
                <div className="text-xs text-foreground-subtle">Betaald binnen minuten</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA bar — like Temper */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-4 py-3 flex items-center justify-between">
        {!applied ? (
          <>
            <div>
              <div className="text-lg font-black text-foreground">€ {estimatedEarnings}</div>
              <button onClick={() => setShowNegotiate(!showNegotiate)} className="text-xs font-semibold" style={{color:"#EF476F"}}>
                Onderhandel tarief
              </button>
            </div>
            <motion.button
              onClick={() => setApplied(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-xl text-white font-bold text-sm"
              style={{background:"#EF476F"}}>
              Solliciteren
            </motion.button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} style={{color:"#0e8a8d"}} />
              <div>
                <div className="text-sm font-bold text-foreground">Sollicitatie verstuurd</div>
                <div className="text-xs text-foreground-subtle">Je hoort snel van {shift.company}</div>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground-muted">
              <MessageSquare size={14} /> Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
