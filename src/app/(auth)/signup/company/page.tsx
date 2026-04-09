"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, ArrowLeft, ArrowRight, Loader2, Hash, User } from "lucide-react";
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
  const [companyName, setCompanyName] = useState("");
  const [kvk, setKvk] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleSector(s: string) {
    setSelectedSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError("Niet geconfigureerd"); setLoading(false); return; }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { role: "company", company_name: companyName } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (!authData.user) { setError("Account niet aangemaakt"); setLoading(false); return; }

    // 2. Create company record
    const { data: company, error: companyError } = await supabase.from("companies").insert({
      name: companyName,
      kvk_number: kvk || null,
      contact_email: email,
      sectors: selectedSectors,
      status: "active",
    }).select().single();

    if (companyError) { setError(companyError.message); setLoading(false); return; }

    // 3. Link user to company
    if (company) {
      await supabase.from("company_members").insert({
        company_id: company.id,
        user_id: authData.user.id,
        role: "admin",
      });
    }

    setLoading(false);
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-sm mx-auto">
        <Link href="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-8">
          <ArrowLeft size={16} /> Terug
        </Link>

        <h1 className="text-2xl font-black text-foreground mb-2">Bedrijf registreren</h1>
        <p className="text-sm text-foreground-subtle mb-8">Start gratis met het plaatsen van shifts</p>

        {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Bedrijfsnaam" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
          </div>
          <div className="relative">
            <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input value={kvk} onChange={e => setKvk(e.target.value)} placeholder="KVK-nummer (optioneel)"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
          </div>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jouw naam"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
          </div>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Zakelijk e-mailadres" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord (min. 6 tekens)" required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none" />
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground-muted mb-2">Sectoren</p>
            <div className="flex flex-wrap gap-2">
              {sectors.map(s => (
                <button key={s.value} type="button" onClick={() => toggleSector(s.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.06)" : "transparent",
                    borderColor: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-border)",
                    color: selectedSectors.includes(s.value) ? "#EF476F" : "var(--color-foreground-muted)",
                  }}>{s.label}</button>
              ))}
            </div>
          </div>

          <motion.button type="submit" disabled={loading || !companyName || !email || !password} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Gratis starten <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <p className="text-center text-sm text-foreground-subtle mt-8">
          Al een account? <Link href="/login" className="font-bold" style={{ color: "#EF476F" }}>Inloggen</Link>
        </p>
      </div>
    </div>
  );
}
