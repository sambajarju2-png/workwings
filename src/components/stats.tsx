"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
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

const stats = [
  { value: 1500, suffix: "+", label: "Shifts per week" },
  { value: 20, suffix: "", label: "Gem. uurloon (€)" },
  { value: 2500, suffix: "+", label: "Freelancers" },
  { value: 350, suffix: "+", label: "Bedrijven" },
];

export function Stats() {
  return (
    <section className="py-20 relative bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-surface shadow-sm dark:shadow-none"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="text-4xl md:text-5xl font-black text-foreground">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm mt-2 font-medium text-foreground-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
