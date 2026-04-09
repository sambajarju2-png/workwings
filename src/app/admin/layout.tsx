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
      <div className="p-5 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <span className="text-white font-bold text-lg">Work<span style={{color:"#EF476F"}}>Wings</span></span>
          <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded" style={{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.3)"}}>Admin</span>
        </div>
      </div>
      <div className="mx-4 mb-4 p-3 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
        <div className="text-white text-sm font-bold truncate">Coffee Company</div>
        <div className="text-[10px]" style={{color:"rgba(255,255,255,0.3)"}}>Free plan</div>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item=>(
          <Link key={item.href} href={item.href} onClick={()=>setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{background:isActive(item.href)?"rgba(239,71,111,0.1)":"transparent",color:isActive(item.href)?"#EF476F":"rgba(255,255,255,0.4)"}}>
            <item.icon size={18}/>{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t" style={{borderColor:"rgba(255,255,255,0.05)"}}>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full" style={{color:"rgba(255,255,255,0.3)"}}>
          <LogOut size={18}/>Uitloggen
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{background:"#060D14"}}>
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0 border-r" style={{background:"#0A1628",borderColor:"rgba(255,255,255,0.06)"}}>{nav}</aside>
      {open&&<div className="lg:hidden fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/60" onClick={()=>setOpen(false)}/>
        <aside className="relative w-64 flex flex-col" style={{background:"#0A1628"}}>
          <button onClick={()=>setOpen(false)} className="absolute top-4 right-4 text-white/40"><X size={20}/></button>
          {nav}
        </aside>
      </div>}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{background:"rgba(6,13,20,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <button onClick={()=>setOpen(true)} className="text-white/50"><Menu size={22}/></button>
          <span className="text-white font-bold text-sm">Admin</span>
          <div className="w-7 h-7 rounded-full" style={{background:"rgba(255,255,255,0.1)"}}/>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
