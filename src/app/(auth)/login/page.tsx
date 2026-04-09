"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Loader2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

type Tab = "worker" | "company";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("worker");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = getSupabaseBrowser();

  async function handleWorkerLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!otpSent) {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith("+") ? phone : `+31${phone.replace(/^0/, "")}`,
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setOtpSent(true);
      setLoading(false);
    } else {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith("+") ? phone : `+31${phone.replace(/^0/, "")}`,
        token: otp,
        type: "sms",
      });
      if (error) { setError(error.message); setLoading(false); return; }
      window.location.href = "/dashboard";
    }
  }

  async function handleCompanyLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#023047" }}>
      {/* Left - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(rgba(239,71,111,0.4) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EF476F" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white font-bold text-2xl">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
          </a>
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Welkom<br />terug<span style={{ color: "#EF476F" }}>.</span>
          </h1>
          <p style={{ color: "rgba(167,218,220,0.7)" }} className="text-lg max-w-md">
            Log in om shifts te vinden, te chatten met opdrachtgevers en direct betaald te worden.
          </p>
        </div>
        {/* Decorative orb */}
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,71,111,0.15), transparent)" }} />
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
            {(["worker", "company"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setOtpSent(false); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                  tab === t ? "text-white" : "text-white/40"
                }`}
                style={tab === t ? { background: "rgba(255,255,255,0.1)" } : {}}
              >
                {t === "worker" ? "🧑‍💼 Freelancer" : "🏢 Bedrijf"}
              </button>
            ))}
          </div>

          {/* Worker login - phone OTP */}
          {tab === "worker" && (
            <form onSubmit={handleWorkerLogin} className="space-y-4">
              {!otpSent ? (
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Telefoonnummer</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12345678"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 outline-none focus:ring-2"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", focusRingColor: "#EF476F" } as React.CSSProperties}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Verificatiecode (SMS)</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3.5 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    required
                  />
                  <p className="text-xs mt-2" style={{ color: "rgba(167,218,220,0.5)" }}>
                    Code verstuurd naar {phone}
                  </p>
                </div>
              )}

              {error && <p className="text-sm font-medium" style={{ color: "#EF476F" }}>{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "#EF476F" }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>{otpSent ? "Verifiëren" : "Stuur Code"} <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* Company login - email/password */}
          {tab === "company" && (
            <form onSubmit={handleCompanyLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">E-mailadres</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@bedrijf.nl"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-white/20 outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  required
                />
              </div>

              {error && <p className="text-sm font-medium" style={{ color: "#EF476F" }}>{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "#EF476F" }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>Inloggen <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <a href="/signup/worker" className="block text-sm font-medium" style={{ color: "#A7DADC" }}>
              Nog geen account? <span className="underline">Aanmelden als freelancer</span>
            </a>
            <a href="/signup/company" className="block text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Bedrijf aanmelden →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
