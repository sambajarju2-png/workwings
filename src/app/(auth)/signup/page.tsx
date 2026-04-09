"use client";
import { motion } from "framer-motion";
import { Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

export default function SignupChoicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="inline-flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-xl font-bold text-foreground">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
      </Link>

      <h1 className="text-2xl font-black text-foreground mb-2">Ik ben een...</h1>
      <p className="text-sm text-foreground-subtle mb-8">Kies hoe je WorkWings wilt gebruiken</p>

      <div className="w-full max-w-sm space-y-4">
        <Link href="/signup/worker">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,71,111,0.08)" }}>
              <Briefcase size={22} style={{ color: "#EF476F" }} />
            </div>
            <div>
              <div className="font-bold text-foreground">Freelancer</div>
              <div className="text-xs text-foreground-subtle">Ik zoek shifts en wil geld verdienen</div>
            </div>
          </motion.div>
        </Link>

        <Link href="/signup/company">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="p-5 rounded-2xl bg-surface border border-border flex items-center gap-4 cursor-pointer mt-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,218,220,0.1)" }}>
              <Building2 size={22} style={{ color: "#0e8a8d" }} />
            </div>
            <div>
              <div className="font-bold text-foreground">Bedrijf</div>
              <div className="text-xs text-foreground-subtle">Ik wil freelancers inhuren voor shifts</div>
            </div>
          </motion.div>
        </Link>
      </div>

      <p className="text-sm text-foreground-subtle mt-8">
        Al een account? <Link href="/login" className="font-bold" style={{ color: "#EF476F" }}>Inloggen</Link>
      </p>
    </div>
  );
}
