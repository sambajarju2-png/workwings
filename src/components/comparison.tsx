"use client";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type CellValue = "yes" | "no" | "partial" | string;

const rows: { feature: string; workwings: CellValue; temper: CellValue; youngones: CellValue }[] = [
  { feature: "Service fee", workwings: "€3,50/uur", temper: "€4,90/uur", youngones: "~€4/uur" },
  { feature: "Direct uitbetaald", workwings: "yes", temper: "partial", youngones: "partial" },
  { feature: "In-app chat", workwings: "yes", temper: "no", youngones: "no" },
  { feature: "Bedrijf reviews door werkers", workwings: "yes", temper: "no", youngones: "no" },
  { feature: "AI shift matching", workwings: "yes", temper: "no", youngones: "partial" },
  { feature: "GPS check-in/out", workwings: "yes", temper: "partial", youngones: "no" },
  { feature: "Wet DBA compliant", workwings: "yes", temper: "yes", youngones: "yes" },
  { feature: "Tarief onderhandelen", workwings: "yes", temper: "yes", youngones: "no" },
  { feature: "PWA (geen app store)", workwings: "yes", temper: "no", youngones: "no" },
  { feature: "Verzekering inbegrepen", workwings: "yes", temper: "yes", youngones: "partial" },
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
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Vergelijk</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground">Waarom <span style={{ color: "#EF476F" }}>wij</span> anders zijn</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden bg-surface" style={{ boxShadow: "0 4px 24px rgba(2,48,71,0.08)", border: "1px solid var(--color-border)" }}>
          <div className="grid grid-cols-4 text-center text-sm font-bold" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <div className="p-4 text-left text-foreground-subtle">Feature</div>
            <div className="p-4 text-white rounded-t-xl" style={{ background: "#023047" }}><span style={{ color: "#EF476F" }}>Work</span>Wings</div>
            <div className="p-4 text-foreground-muted">Temper</div>
            <div className="p-4 text-foreground-muted">YoungOnes</div>
          </div>
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-4 items-center text-center text-sm" style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <div className="p-4 text-left font-medium text-foreground-muted">{row.feature}</div>
              <div className="p-4 flex justify-center" style={{ background: "rgba(2,48,71,0.03)" }}><Cell value={row.workwings} highlight /></div>
              <div className="p-4 flex justify-center"><Cell value={row.temper} /></div>
              <div className="p-4 flex justify-center"><Cell value={row.youngones} /></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
