"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle, User, MapPin, Mail, Lock, Hash, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const sectors = [
  { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

export default function WorkerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [btwNumber, setBtwNumber] = useState("");
  const [kvkNumber, setKvkNumber] = useState("");
  const [hasBtw, setHasBtw] = useState<boolean | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignup() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/callback?type=worker` } });
  }

  async function handleComplete() {
    setLoading(true); setError("");

    const res = await fetch("/api/auth/register-worker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName, city, phone, btwNumber, kvkNumber, sectors: selectedSectors }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Registratie mislukt"); setLoading(false); return; }

    // Sign in
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    router.push("/shifts");
  }

  const input = "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none";

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-sm mx-auto">
        <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-6"><ArrowLeft size={16} /> Terug</Link>
        <div className="flex gap-2 mb-8">{[1, 2, 3].map(s => <div key={s} className="flex-1 h-1.5 rounded-full" style={{ background: step >= s ? "#EF476F" : "var(--color-border)" }} />)}</div>
        <h1 className="text-2xl font-black text-foreground mb-1">{step === 1 ? "Account aanmaken" : step === 2 ? "Over jou" : "Bijna klaar"}</h1>
        <p className="text-sm text-foreground-subtle mb-6">{step === 1 ? "Registreer met Google of e-mail" : step === 2 ? "Vul je gegevens aan" : "Kies je sectoren en start"}</p>
        {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <button onClick={handleGoogleSignup} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 bg-surface border border-border text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Doorgaan met Google
            </button>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-border" /><span className="text-xs text-foreground-subtle">of met e-mail</span><div className="flex-1 h-px bg-border" /></div>
            <div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres" className={input} /></div>
            <div className="relative"><Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord (min. 6 tekens)" className={input} /></div>
            <motion.button onClick={() => { if (email && password.length >= 6) setStep(2); else setError("Vul een geldig e-mailadres en wachtwoord in (min. 6 tekens)"); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
              Doorgaan <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Voornaam" className={input} /></div>
              <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Achternaam" className={input} /></div>
            </div>
            <div className="relative"><MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={city} onChange={e => setCity(e.target.value)} placeholder="Stad" className={input} /></div>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefoonnummer (optioneel)" className="w-full px-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
            <div className="pt-2">
              <p className="text-sm font-semibold text-foreground mb-2">Heb je al een BTW-nummer?</p>
              <div className="flex gap-3">
                {([true, false] as const).map(v => (
                  <button key={String(v)} type="button" onClick={() => setHasBtw(v)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                    style={{ background: hasBtw === v ? (v ? "rgba(239,71,111,0.06)" : "rgba(167,218,220,0.1)") : "var(--color-surface)", borderColor: hasBtw === v ? (v ? "#EF476F" : "#A7DADC") : "var(--color-border)", color: hasBtw === v ? (v ? "#EF476F" : "#0e8a8d") : "var(--color-foreground-muted)" }}>
                    {v ? "Ja" : "Nog niet"}
                  </button>
                ))}
              </div>
            </div>
            {hasBtw === true && <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={btwNumber} onChange={e => setBtwNumber(e.target.value)} placeholder="NL123456789B01" className={input} /></div>}
            {hasBtw === false && <div className="p-3 rounded-xl text-xs leading-relaxed flex gap-2" style={{ background: "rgba(167,218,220,0.08)", color: "#0e8a8d" }}><AlertTriangle size={14} className="flex-shrink-0 mt-0.5" /><span>Geen probleem! Je kunt <strong>3 shifts</strong> werken zonder BTW-nummer.</span></div>}
            <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={kvkNumber} onChange={e => setKvkNumber(e.target.value)} placeholder="KVK-nummer (optioneel)" className={input} /></div>
            <motion.button onClick={() => { if (firstName && lastName && city && hasBtw !== null) setStep(3); else setError("Vul alle verplichte velden in"); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
              Doorgaan <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {sectors.map(s => (
                <button key={s.value} onClick={() => setSelectedSectors(prev => prev.includes(s.value) ? prev.filter(x => x !== s.value) : [...prev, s.value])}
                  className="p-4 rounded-xl text-sm font-semibold text-left border transition-all"
                  style={{ background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.06)" : "var(--color-surface)", borderColor: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-border)", color: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-foreground-muted)" }}>
                  {selectedSectors.includes(s.value) && <CheckCircle size={14} style={{ color: "#EF476F" }} className="mb-1" />}{s.label}
                </button>
              ))}
            </div>
            <motion.button onClick={handleComplete} disabled={loading || selectedSectors.length === 0} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Account aanmaken <CheckCircle size={16} /></>}
            </motion.button>
          </motion.div>
        )}

        <p className="text-center text-sm text-foreground-subtle mt-6">Al een account? <Link href="/login" className="font-bold" style={{ color: "#EF476F" }}>Inloggen</Link></p>
      </div>
    </div>
  );
}
