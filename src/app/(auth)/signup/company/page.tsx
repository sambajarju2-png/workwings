"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Building2, Loader2, Lock } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const sectors = [
  { value: "horeca", label: "🍽️ Horeca" },
  { value: "retail", label: "🛍️ Retail" },
  { value: "logistics", label: "📦 Logistiek" },
  { value: "events", label: "🎉 Events" },
  { value: "cleaning", label: "🧹 Schoonmaak" },
  { value: "delivery", label: "🚚 Bezorging" },
];

export default function CompanySignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [kvk, setKvk] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = getSupabaseBrowser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_type: "company", company_name: companyName } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (!authData.user) { setError("Account aanmaken mislukt"); setLoading(false); return; }

    // 2. Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        kvk_number: kvk,
        contact_email: email,
        sectors: selectedSectors,
      } as never)
      .select()
      .single();

    if (companyError) { setError(companyError.message); setLoading(false); return; }

    // 3. Add as company member (owner)
    await supabase.from("company_members").insert({
      company_id: (company as { id: string }).id,
      user_id: authData.user.id,
      role: "owner",
    } as never);

    setSuccess(true);
    setLoading(false);
  }

  function toggleSector(val: string) {
    setSelectedSectors((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#023047" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(167,218,220,0.2)" }}>
            <Mail size={28} style={{ color: "#A7DADC" }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Check je e-mail!</h2>
          <p style={{ color: "rgba(167,218,220,0.7)" }}>
            We hebben een bevestigingslink gestuurd naar <strong className="text-white">{email}</strong>.
            Klik op de link om je account te activeren.
          </p>
          <a href="/login" className="inline-block mt-6 text-sm font-bold underline" style={{ color: "#EF476F" }}>Naar inloggen →</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#023047" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <a href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
        </a>

        <h2 className="text-2xl font-black text-white text-center mb-2">Bedrijf Aanmelden</h2>
        <p className="text-sm text-center mb-8" style={{ color: "rgba(167,218,220,0.6)" }}>
          Post shifts en vind direct de beste freelancers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Bedrijfsnaam" required
              className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <input type="text" value={kvk} onChange={(e) => setKvk(e.target.value)}
            placeholder="KVK-nummer" required
            className="w-full px-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mailadres" required
              className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Wachtwoord (min. 8 tekens)" minLength={8} required
              className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">In welke branches zoek je personeel?</label>
            <div className="grid grid-cols-2 gap-2">
              {sectors.map((s) => (
                <button key={s.value} type="button" onClick={() => toggleSector(s.value)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedSectors.includes(s.value) ? "rgba(239,71,111,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${selectedSectors.includes(s.value) ? "#EF476F" : "rgba(255,255,255,0.08)"}`,
                    color: selectedSectors.includes(s.value) ? "#EF476F" : "rgba(255,255,255,0.5)",
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm" style={{ color: "#EF476F" }}>{error}</p>}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#EF476F" }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Account Aanmaken <ArrowRight size={18} /></>}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Al een account? <span className="underline" style={{ color: "#A7DADC" }}>Inloggen</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
