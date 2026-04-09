"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Loader2, User, Briefcase } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

const sectors = [
  { value: "horeca", label: "Horeca" },
  { value: "retail", label: "Retail" },
  { value: "logistics", label: "Logistiek" },
  { value: "events", label: "Events" },
  { value: "cleaning", label: "Schoonmaak" },
  { value: "delivery", label: "Bezorging" },
];

type Step = "phone" | "otp" | "profile";

export default function WorkerSignupPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabaseBrowser();
  const formattedPhone = phone.startsWith("+") ? phone : `+31${phone.replace(/^0/, "")}`;

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) { setError(error.message); setLoading(false); return; }
    setStep("otp");
    setLoading(false);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: "sms" });
    if (error) { setError(error.message); setLoading(false); return; }
    setStep("profile");
    setLoading(false);
  }

  async function completeProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Niet ingelogd"); setLoading(false); return; }

    const { error } = await supabase.from("workers").insert({
      id: user.id,
      phone: formattedPhone,
      first_name: firstName,
      last_name: lastName,
      city,
      sectors: selectedSectors,
    } as never);

    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = "/dashboard";
  }

  function toggleSector(val: string) {
    setSelectedSectors((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#023047" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
        </a>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {["phone", "otp", "profile"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: step === s ? "#EF476F" : (["phone", "otp", "profile"].indexOf(step) > i ? "rgba(167,218,220,0.3)" : "rgba(255,255,255,0.06)"),
                  color: step === s ? "white" : "rgba(255,255,255,0.3)",
                }}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-8 h-0.5" style={{ background: "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        {/* Step: Phone */}
        {step === "phone" && (
          <form onSubmit={sendOtp} className="space-y-4">
            <h2 className="text-2xl font-black text-white text-center mb-2">Aanmelden als Freelancer</h2>
            <p className="text-sm text-center mb-6" style={{ color: "rgba(167,218,220,0.6)" }}>
              Vul je telefoonnummer in. We sturen een verificatiecode via SMS.
            </p>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12345678" required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            {error && <p className="text-sm" style={{ color: "#EF476F" }}>{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Stuur Code <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <h2 className="text-2xl font-black text-white text-center mb-2">Verificatiecode</h2>
            <p className="text-sm text-center mb-6" style={{ color: "rgba(167,218,220,0.6)" }}>
              Voer de 6-cijferige code in die we naar {phone} hebben gestuurd.
            </p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
              placeholder="123456" maxLength={6} required
              className="w-full px-4 py-3.5 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-white/20 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            {error && <p className="text-sm" style={{ color: "#EF476F" }}>{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Verifiëren <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        )}

        {/* Step: Profile */}
        {step === "profile" && (
          <form onSubmit={completeProfile} className="space-y-4">
            <h2 className="text-2xl font-black text-white text-center mb-2">Jouw Profiel</h2>
            <p className="text-sm text-center mb-6" style={{ color: "rgba(167,218,220,0.6)" }}>
              Nog even je gegevens invullen en je kunt direct shifts vinden.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Voornaam" required
                  className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                placeholder="Achternaam" required
                className="w-full px-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Stad (bijv. Amsterdam)" required
                className="w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm placeholder-white/20 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">In welke branches wil je werken?</label>
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
            <motion.button type="submit" disabled={loading || selectedSectors.length === 0}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#EF476F" }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Profiel Aanmaken <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            Al een account? <span className="underline" style={{ color: "#A7DADC" }}>Inloggen</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
