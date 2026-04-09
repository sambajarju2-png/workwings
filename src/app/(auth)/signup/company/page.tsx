"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, Hash, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

const sectors = [
  { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

export default function CompanySignupPage() {
  const [name, setName] = useState("");
  const [kvk, setKvk] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function toggleSector(s: string) {
    setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(167,218,220,0.12)" }}>
            <CheckCircle size={28} style={{ color: "#0e8a8d" }} />
          </div>
          <h2 className="text-xl font-black text-foreground mb-2">Bedrijf aangemeld</h2>
          <p className="text-sm text-foreground-subtle mb-6">Welkom bij WorkWings. Laten we je eerste shift maken.</p>
          <Link href="/admin">
            <motion.button whileTap={{ scale: 0.98 }} className="px-8 py-3.5 rounded-xl text-white font-bold" style={{ background: "#EF476F" }}>
              Naar dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-sm mx-auto">
        <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-8">
          <ArrowLeft size={16} /> Terug
        </Link>

        <h2 className="text-xl font-black text-foreground mb-2">Bedrijf aanmelden</h2>
        <p className="text-sm text-foreground-subtle mb-6">Vul je bedrijfsgegevens in om te starten</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Bedrijfsnaam" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
          </div>
          <div className="relative">
            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="text" value={kvk} onChange={e => setKvk(e.target.value)} placeholder="KVK-nummer" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border" />
          </div>

          <div className="pt-2">
            <p className="text-xs font-bold text-foreground-subtle uppercase tracking-wider mb-2">Branches</p>
            <div className="flex flex-wrap gap-2">
              {sectors.map(s => (
                <button key={s.value} type="button" onClick={() => toggleSector(s.value)}
                  className="px-4 py-2 rounded-full text-xs font-bold border transition-all"
                  style={{
                    background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.08)" : "var(--color-surface)",
                    borderColor: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-border)",
                    color: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-foreground-muted)",
                  }}>{s.label}</button>
              ))}
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            style={{ background: "#EF476F" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Bedrijf aanmelden"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
