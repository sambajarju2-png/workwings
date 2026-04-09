"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #023047, #0A1628)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-8xl font-black mb-4"
          style={{ color: "#EF476F" }}
        >
          404
        </motion.div>
        <h1 className="text-2xl font-black text-white mb-3">Pagina niet gevonden</h1>
        <p className="text-sm mb-8" style={{ color: "rgba(167,218,220,0.6)" }}>
          Deze pagina bestaat niet of is verplaatst. Misschien zoek je een shift?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: "#EF476F" }}>
              <ArrowLeft size={16} /> Naar home
            </motion.button>
          </Link>
          <Link href="/shifts">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Zoek shifts
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
