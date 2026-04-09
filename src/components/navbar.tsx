"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Voor Freelancers", href: "/" },
  { label: "Voor Bedrijven", href: "/zakelijk" },
  { label: "Branches", href: "#branches" },
  { label: "Over Ons", href: "#over" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between"
          style={{ background: "rgba(2,48,71,0.85)", backdropFilter: "blur(20px)" }}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#EF476F" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Work<span style={{ color: "#EF476F" }}>Wings</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                className="text-sm text-white/70 hover:text-white transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href="/login" className="text-sm text-white/80 hover:text-white transition-colors font-medium px-4 py-2">
              Inloggen
            </a>
            <motion.a
              href="#aanmelden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-xl flex items-center gap-1"
              style={{ background: "#EF476F" }}
            >
              Start Nu <ChevronRight size={16} />
            </motion.a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 rounded-2xl p-6 space-y-4"
              style={{ background: "rgba(2,48,71,0.95)", backdropFilter: "blur(20px)" }}
            >
              {links.map((l) => (
                <a key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-white/80 hover:text-white text-lg font-medium">
                  {l.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a href="#" className="text-white/70 text-center py-2">Inloggen</a>
                <a href="#aanmelden" className="text-white font-bold text-center py-3 rounded-xl"
                  style={{ background: "#EF476F" }}>
                  Start Nu
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
