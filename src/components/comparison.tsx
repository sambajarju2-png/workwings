"use client";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type CellValue = "yes" | "no" | "partial" | string;

const rows: { feature: string; workwings: CellValue; temper: CellValue; youngones: CellValue }[] = [
  { feature: "Service fee", workwings: "\u20AC3,50/uur", temper: "\u20AC4,90/uur", youngones: "~\u20AC4/uur" },
  { feature: "Direct uitbetaald", workwings: "yes", temper: "partial", youngones: "partial" },
  { feature: "In-app chat", workwings: "yes", temper: "no", youngones: "no" },
  { feature: "Bedrijf reviews door werkers", workwings: "yes", temper: "no", youngones: "no" },
  { feature: "AI shift matching", workwings: "yes", temper: "no", youngones: "partial" },
  { feature: "GPS check-in/out", workwings: "yes", temper: "partial", youngones: "no" },
  { feature: "Wet DBA compliant", workwings: "yes", temper: "yes", youngones: "yes" },
  { feature: "Tarief onderhandelen", workwings: "yes", temper: "yes", youngones: "no" },
  { feature: "PWA (geen app store)", workwings: "yes", temper: "no", youngones: "no" },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === "yes") return <Check size={18} style={{ color: highlight ? "#EF476F" : "#22c55e" }} strokeWidth={3} />;
  if (value === "no") return <X size={18} style={{ color: "var(--color-foreground-subtle)" }} strokeWidth={2} />;
  if (value === "partial") return <Minus size={18} style={{ color: "#f59e0b" }} strokeWidth={2} />;
  return <span className={`text-sm font-semibold ${highlight ? "" : "text-foreground-muted"}`} style={highlight ? { color: "#EF476F" } : {}}>{value}</span>;
}

export function Comparison() {
  return (
    <section className="py-24 px-4 bg-background-alt">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Vergelijk</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground tracking-tight">Waarom <span style={{ color: "#EF476F" }}>wij</span> anders zijn</h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-2xl overflow-hidden bg-surface"
          style={{ boxShadow: "0 4px 24px rgba(2,48,71,0.08)", border: "1px solid var(--color-border)" }}
        >
          <div className="grid grid-cols-4 text-center text-sm font-bold" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="p-4 text-left text-foreground-subtle">Feature</div>
            <div className="p-4 text-white rounded-t-xl" style={{ background: "#023047" }}><span style={{ color: "#EF476F" }}>Work</span>Wings</div>
            <div className="p-4 text-foreground-muted">Temper</div>
            <div className="p-4 text-foreground-muted">YoungOnes</div>
          </div>
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.3 }}
              className="grid grid-cols-4 items-center text-center text-sm"
              style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}
            >
              <div className="p-4 text-left font-medium text-foreground-muted">{row.feature}</div>
              <div className="p-4 flex justify-center" style={{ background: "rgba(2,48,71,0.03)" }}><Cell value={row.workwings} highlight /></div>
              <div className="p-4 flex justify-center"><Cell value={row.temper} /></div>
              <div className="p-4 flex justify-center"><Cell value={row.youngones} /></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
