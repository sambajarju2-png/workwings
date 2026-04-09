"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"worker" | "company">("worker");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    if (tab === "worker") setOtpSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
        </Link>
        <h1 className="text-2xl font-black text-foreground">Inloggen</h1>
        <p className="text-sm text-foreground-subtle mt-1">Welkom terug bij WorkWings</p>
      </div>

      <div className="flex-1 px-4 pb-8">
        {/* Tabs */}
        <div className="flex rounded-xl p-1 mb-8 bg-background-alt border border-border">
          {(["worker", "company"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setOtpSent(false); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{
                background: tab === t ? "var(--color-surface)" : "transparent",
                color: tab === t ? "var(--color-foreground)" : "var(--color-foreground-subtle)",
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}>
              {t === "worker" ? "Freelancer" : "Bedrijf"}
            </button>
          ))}
        </div>

        <motion.form key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} className="space-y-4">

          {tab === "worker" && !otpSent && (
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+31 6 12345678" required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border focus:border-pink" />
            </div>
          )}

          {tab === "worker" && otpSent && (
            <div>
              <p className="text-sm text-foreground-muted mb-3">Code verstuurd naar {phone}</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="123456" maxLength={6} required
                className="w-full px-4 py-3.5 rounded-xl text-sm text-center text-foreground font-mono text-lg tracking-[0.5em] placeholder:text-foreground-subtle outline-none bg-surface border border-border focus:border-pink" />
            </div>
          )}

          {tab === "company" && (
            <>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="bedrijf@email.nl" required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border focus:border-pink" />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Wachtwoord" required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-foreground-subtle outline-none bg-surface border border-border focus:border-pink" />
              </div>
            </>
          )}

          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : (
              <>{otpSent ? "Verifieer" : tab === "worker" ? "Stuur code" : "Inloggen"} <ArrowRight size={16} /></>
            )}
          </motion.button>
        </motion.form>

        <div className="text-center mt-6">
          <p className="text-sm text-foreground-subtle">
            Nog geen account?{" "}
            <Link href="/signup" className="font-bold" style={{ color: "#EF476F" }}>Aanmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
