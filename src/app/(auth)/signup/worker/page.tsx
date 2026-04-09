"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowRight, ArrowLeft, Loader2, CheckCircle, User, MapPin } from "lucide-react";
import Link from "next/link";

const sectors = [
  { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

export default function WorkerSignupPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleSector(s: string) {
    setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleNext() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep(s => s + 1);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-sm mx-auto">
        <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-8">
          <ArrowLeft size={16} /> Terug
        </Link>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full" style={{ background: step >= s ? "#EF476F" : "var(--color-border)" }} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-black text-foreground mb-2">Wat is je telefoonnummer?</h2>
            <p className="text-sm text-foreground-subtle mb-6">We sturen je een verificatiecode per SMS</p>
            <div className="relative mb-4">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+31 6 12345678"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
            </div>
            <motion.button onClick={handleNext} disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Stuur code <ArrowRight size={16} /></>}
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-black text-foreground mb-2">Voer de code in</h2>
            <p className="text-sm text-foreground-subtle mb-6">Code verstuurd naar {phone}</p>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="123456" maxLength={6}
              className="w-full px-4 py-3.5 rounded-xl text-center text-lg font-mono tracking-[0.5em] text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border mb-4" />
            <motion.button onClick={handleNext} disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verifieer <ArrowRight size={16} /></>}
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-black text-foreground mb-2">Vertel ons over jezelf</h2>
            <p className="text-sm text-foreground-subtle mb-6">Laatste stap, bijna klaar</p>
            <div className="space-y-3 mb-6">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Voornaam"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
              </div>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Achternaam"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
              </div>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Stad"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
              </div>
            </div>
            <p className="text-xs font-bold text-foreground-subtle uppercase tracking-wider mb-2">Branches</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {sectors.map(s => (
                <button key={s.value} onClick={() => toggleSector(s.value)}
                  className="px-4 py-2 rounded-full text-xs font-bold border transition-all"
                  style={{
                    background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.08)" : "var(--color-surface)",
                    borderColor: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-border)",
                    color: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-foreground-muted)",
                  }}>{s.label}</button>
              ))}
            </div>
            <motion.button onClick={handleNext} disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Account aanmaken <CheckCircle size={16} /></>}
            </motion.button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(167,218,220,0.12)" }}>
              <CheckCircle size={28} style={{ color: "#0e8a8d" }} />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2">Welkom bij WorkWings!</h2>
            <p className="text-sm text-foreground-subtle mb-6">Je account is aangemaakt. Laten we shifts zoeken.</p>
            <Link href="/shifts">
              <motion.button whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 rounded-xl text-white font-bold" style={{ background: "#EF476F" }}>
                Ontdek shifts
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
