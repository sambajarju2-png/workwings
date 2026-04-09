"use client";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingBag, Package, PartyPopper, Building2, Truck } from "lucide-react";

const sectors = [
  { icon: <UtensilsCrossed size={28} />, name: "Horeca", count: "450+", bg: "linear-gradient(135deg, #EF476F, #D93A5E)" },
  { icon: <ShoppingBag size={28} />, name: "Retail", count: "280+", bg: "linear-gradient(135deg, #023047, #034B6F)" },
  { icon: <Package size={28} />, name: "Logistiek", count: "320+", bg: "linear-gradient(135deg, #A7DADC, #7BC0C3)" },
  { icon: <PartyPopper size={28} />, name: "Events", count: "190+", bg: "linear-gradient(135deg, #EF476F, #D93A5E)" },
  { icon: <Building2 size={28} />, name: "Schoonmaak", count: "150+", bg: "linear-gradient(135deg, #023047, #034B6F)" },
  { icon: <Truck size={28} />, name: "Bezorging", count: "210+", bg: "linear-gradient(135deg, #A7DADC, #7BC0C3)" },
];

export function Sectors() {
  return (
    <section id="branches" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Branches</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4" style={{ color: "#023047" }}>
            Shifts in <span style={{ color: "#EF476F" }}>elke branche</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sectors.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative p-6 rounded-2xl text-white cursor-pointer overflow-hidden group"
              style={{ background: s.bg }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10"
                style={{ background: "radial-gradient(circle, white, transparent)" }} />
              <div className="relative z-10">
                <div className="mb-3 opacity-80">{s.icon}</div>
                <h3 className="text-xl font-bold">{s.name}</h3>
                <p className="text-sm opacity-70 mt-1">{s.count} shifts</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
