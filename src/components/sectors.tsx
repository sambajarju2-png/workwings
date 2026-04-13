"use client";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingBag, Package, PartyPopper, Building2, Truck } from "lucide-react";

const sectors = [
  { icon: <UtensilsCrossed size={28} />, name: "Horeca", bg: "linear-gradient(135deg, #EF476F, #D93A5E)" },
  { icon: <ShoppingBag size={28} />, name: "Retail", bg: "linear-gradient(135deg, #023047, #034B6F)" },
  { icon: <Package size={28} />, name: "Logistiek", bg: "linear-gradient(135deg, #A7DADC, #7BC0C3)" },
  { icon: <PartyPopper size={28} />, name: "Events", bg: "linear-gradient(135deg, #EF476F, #D93A5E)" },
  { icon: <Building2 size={28} />, name: "Schoonmaak", bg: "linear-gradient(135deg, #023047, #034B6F)" },
  { icon: <Truck size={28} />, name: "Bezorging", bg: "linear-gradient(135deg, #A7DADC, #7BC0C3)" },
];

export function Sectors() {
  return (
    <section id="branches" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#EF476F" }}>Branches</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground tracking-tight">Shifts in <span style={{ color: "#EF476F" }}>elke branche</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sectors.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.04, rotateY: -3, rotateX: 2 }}
              whileTap={{ scale: 0.97 }}
              style={{ transformPerspective: 800 }}
              className="relative p-6 rounded-2xl text-white cursor-pointer overflow-hidden group"
            >
              {/* Background with gradient */}
              <div className="absolute inset-0 rounded-2xl" style={{ background: s.bg }} />
              {/* Subtle shine on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%)" }} />
              <div className="relative z-10">
                <div className="mb-3 opacity-80">{s.icon}</div>
                <h3 className="text-xl font-bold">{s.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
