"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Briefcase, Building2, Users, Euro } from "lucide-react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString("nl-NL")}{suffix}</span>;
}

interface LiveStats {
  openShifts: number;
  companies: number;
  avgRate: number;
  workers: number;
}

export function Stats() {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fail silently
      }
    }
    fetchStats();
  }, []);

  if (!stats) return null;

  const items = [
    { value: stats.openShifts, suffix: "", label: "Open shifts nu", icon: <Briefcase size={18} />, color: "#EF476F" },
    { value: stats.companies, suffix: "", label: "Actieve bedrijven", icon: <Building2 size={18} />, color: "#A7DADC" },
    { value: stats.avgRate, suffix: "", label: "Gem. uurloon (\u20AC)", icon: <Euro size={18} />, color: "#EF476F" },
    { value: stats.workers, suffix: "", label: "Freelancers", icon: <Users size={18} />, color: "#A7DADC" },
  ];

  return (
    <section className="py-16 relative bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-bold uppercase tracking-widest mb-8 text-foreground-subtle"
        >
          Live platformdata
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
              className="text-center p-5 rounded-2xl bg-surface"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="flex justify-center mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-foreground">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs mt-1 font-medium text-foreground-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
