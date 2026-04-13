"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Clock, ArrowRight, Loader2 } from "lucide-react";

interface Shift {
  id: string;
  title: string;
  sector: string;
  date: string;
  start_time: string;
  end_time: string;
  rate_per_hour: number;
  workers_needed: number;
  workers_filled: number;
  companies: { name: string } | null;
  locations: { city: string } | null;
}

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.getTime() === today.getTime()) return "Vandaag";
  if (date.getTime() === tomorrow.getTime()) return "Morgen";
  return date.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

const sectorColors: Record<string, string> = {
  horeca: "#EF476F",
  retail: "#023047",
  logistics: "#A7DADC",
  events: "#EF476F",
  cleaning: "#023047",
  delivery: "#A7DADC",
};

export function LiveShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shifts")
      .then((r) => r.json())
      .then((data) => {
        setShifts((data.shifts || []).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto text-center">
          <Loader2 size={24} className="animate-spin mx-auto text-foreground-subtle" />
        </div>
      </section>
    );
  }

  if (shifts.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#EF476F" }}
            >
              Nu beschikbaar
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 text-foreground">
              Live <span style={{ color: "#EF476F" }}>shifts</span>
            </h2>
          </div>
          <motion.a
            href="/signup/worker"
            whileHover={{ x: 4 }}
            className="hidden md:flex items-center gap-1 text-sm font-bold"
            style={{ color: "#EF476F" }}
          >
            Bekijk alles <ArrowRight size={16} />
          </motion.a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {shifts.map((shift, i) => {
              const spotsLeft = shift.workers_needed - shift.workers_filled;
              const color = sectorColors[shift.sector] || "#023047";

              return (
                <motion.a
                  key={shift.id}
                  href="/signup/worker"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="block rounded-2xl p-5 bg-surface group cursor-pointer"
                  style={{
                    border: "1px solid var(--color-border)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black"
                      style={{ background: color }}
                    >
                      {shift.title?.[0] || "S"}
                    </div>
                    {spotsLeft <= 2 && spotsLeft > 0 && (
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(239,71,111,0.1)",
                          color: "#EF476F",
                        }}
                      >
                        Nog {spotsLeft} {spotsLeft === 1 ? "plek" : "plekken"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-[#EF476F] transition-colors">
                    {shift.title}
                  </h3>
                  <p className="text-xs text-foreground-muted mb-3">
                    {shift.companies?.name || "Bedrijf"}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-foreground-subtle mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(shift.date)} · {shift.start_time?.slice(0, 5)}-
                      {shift.end_time?.slice(0, 5)}
                    </span>
                    {shift.locations?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {shift.locations.city}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                    <span className="text-xs text-foreground-subtle">
                      {shift.workers_filled}/{shift.workers_needed} ingevuld
                    </span>
                    <span className="text-lg font-black text-foreground">
                      &euro;{shift.rate_per_hour?.toFixed(2).replace(".", ",")}
                      <span className="text-xs font-medium text-foreground-subtle">/uur</span>
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Mobile "view all" link */}
        <div className="mt-6 text-center md:hidden">
          <a
            href="/signup/worker"
            className="inline-flex items-center gap-1 text-sm font-bold"
            style={{ color: "#EF476F" }}
          >
            Bekijk alle shifts <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
