"use client";
import { motion } from "framer-motion";
import { Shield, Banknote, Scale } from "lucide-react";

const trustItems = [
  { icon: <Shield size={16} />, text: "Wet DBA compliant" },
  { icon: <Banknote size={16} />, text: "Uitbetaling via Revolut" },
  { icon: <Scale size={16} />, text: "Modelovereenkomst per shift" },
];

export function LogoMarquee() {
  return (
    <section className="py-8 bg-surface border-y" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2 text-sm text-foreground-muted"
            >
              <span style={{ color: "#A7DADC" }}>{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
