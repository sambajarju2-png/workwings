"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, CalendarPlus, List, Users, Heart, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/shifts", icon: List, label: "Shifts" },
  { href: "/admin/shifts/new", icon: CalendarPlus, label: "Nieuwe Shift" },
  { href: "/admin/applications", icon: Users, label: "Sollicitaties" },
  { href: "/admin/flexpool", icon: Heart, label: "Flexpool" },
  { href: "/admin/settings", icon: Settings, label: "Instellingen" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (h: string) => h === "/admin" ? pathname === "/admin" : pathname.startsWith(h);

  const nav = (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg" style={{ color: "#023047" }}>Work<span style={{ color: "#EF476F" }}>Wings</span></span>
          </div>
        </Link>
      </div>

      {/* Company badge */}
      <div className="mx-5 mb-5 p-3.5 rounded-xl" style={{ background: "#F0F4F8", border: "1px solid #E2E8F0" }}>
        <div className="text-sm font-bold" style={{ color: "#023047" }}>Coffee Company</div>
        <div className="text-xs mt-0.5" style={{ color: "#8BA3B5" }}>Free plan · KVK 12345678</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: isActive(item.href) ? "rgba(239,71,111,0.08)" : "transparent",
              color: isActive(item.href) ? "#EF476F" : "#4A6B7F",
            }}>
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t" style={{ borderColor: "#E2E8F0" }}>
        <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm w-full" style={{ color: "#8BA3B5" }}>
          <LogOut size={18} /> Uitloggen
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F9FC" }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 bg-white border-r" style={{ borderColor: "#E8EDF2" }}>
        {nav}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
          <aside className="relative w-72 flex flex-col bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-5" style={{ color: "#8BA3B5" }}><X size={20} /></button>
            {nav}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: "#E8EDF2" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden" style={{ color: "#4A6B7F" }}><Menu size={22} /></button>
            <h2 className="text-sm font-semibold hidden lg:block" style={{ color: "#8BA3B5" }}>Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#023047" }}>CC</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
