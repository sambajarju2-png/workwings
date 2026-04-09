"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, ArrowLeft, ArrowRight, Loader2, Hash, User, MapPin, Search, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const sectors = [
  { value: "horeca", label: "Horeca" }, { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" }, { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" }, { value: "delivery", label: "Bezorging" },
];

export default function CompanySignupPage() {
  const router = useRouter();
  const [kvk, setKvk] = useState("");
  const [kvkLoading, setKvkLoading] = useState(false);
  const [kvkFound, setKvkFound] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookupKvk() {
    if (kvk.length < 8) return;
    setKvkLoading(true);
    try {
      const res = await fetch(`/api/kvk?kvk=${kvk}`);
      const data = await res.json();
      if (data.found) {
        setKvkFound(true);
        if (data.name) setCompanyName(data.name);
        if (data.address) setAddress(data.address);
        if (data.city) setCity(data.city);
        if (data.postalCode) setPostalCode(data.postalCode);
      }
    } catch {}
    setKvkLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Niet geconfigureerd"); setLoading(false); return; }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password, options: { data: { role: "company", company_name: companyName } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (!authData.user) { setError("Account niet aangemaakt"); setLoading(false); return; }

    const { data: company, error: companyError } = await supabase.from("companies").insert({
      name: companyName, kvk_number: kvk || null, contact_email: email,
      address, city, postal_code: postalCode,
      sectors: selectedSectors, status: "active",
    }).select().single();

    if (companyError) { setError(companyError.message); setLoading(false); return; }
    if (company) {
      await supabase.from("company_members").insert({ company_id: company.id, user_id: authData.user.id, role: "admin" });
    }
    setLoading(false); router.push("/admin");
  }

  const input = "w-full px-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none";
  const inputIcon = "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none";

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-sm mx-auto">
        <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-6">
          <ArrowLeft size={16} /> Terug
        </Link>

        <h1 className="text-2xl font-black text-foreground mb-1">Bedrijf registreren</h1>
        <p className="text-sm text-foreground-subtle mb-6">Vul je KVK-nummer in en we vullen je gegevens automatisch aan</p>

        {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* KVK auto-fill */}
          <div>
            <label className="text-xs font-semibold mb-1 block text-foreground-muted">KVK-nummer</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input value={kvk} onChange={e => { setKvk(e.target.value); setKvkFound(false); }} placeholder="12345678" className={inputIcon} />
              </div>
              <motion.button type="button" onClick={lookupKvk} disabled={kvk.length < 8 || kvkLoading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-4 rounded-xl font-semibold text-sm text-white disabled:opacity-50 flex items-center gap-2"
                style={{ background: "#023047" }}>
                {kvkLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Zoek
              </motion.button>
            </div>
            {kvkFound && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#0e8a8d" }}><CheckCircle size={12} /> Gevonden — gegevens ingevuld</p>}
          </div>

          <div className="relative"><Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Bedrijfsnaam" required className={inputIcon} /></div>
          <div className="relative"><MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={address} onChange={e => setAddress(e.target.value)} placeholder="Adres" className={inputIcon} /></div>
          <div className="grid grid-cols-2 gap-3">
            <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Postcode" className={input} />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Stad" className={input} />
          </div>

          <hr className="border-border" />

          <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jouw naam" className={inputIcon} /></div>
          <div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Zakelijk e-mailadres" required className={inputIcon} /></div>
          <div className="relative"><Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" required className={inputIcon} /></div>

          <div>
            <p className="text-xs font-semibold text-foreground-muted mb-2">Sectoren</p>
            <div className="flex flex-wrap gap-2">
              {sectors.map(s => (
                <button key={s.value} type="button" onClick={() => setSelectedSectors(prev => prev.includes(s.value) ? prev.filter(x => x !== s.value) : [...prev, s.value])}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{ background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.06)" : "transparent", borderColor: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-border)", color: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-foreground-muted)" }}>{s.label}</button>
              ))}
            </div>
          </div>

          <motion.button type="submit" disabled={loading || !companyName || !email || !password} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Gratis starten <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <p className="text-center text-sm text-foreground-subtle mt-6">
          Al een account? <Link href="/login" className="font-bold" style={{ color: "#EF476F" }}>Inloggen</Link>
        </p>
      </div>
    </div>
  );
}
