"use client";
import { motion } from "framer-motion";
import { CalendarPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

const shifts = [
  { id:"1", title:"Barista ochtend", date:"10 apr 2026", time:"08:00-16:00", rate:22, status:"open", apps:5, filled:"1/2" },
  { id:"2", title:"Warehouse avond", date:"11 apr 2026", time:"18:00-02:00", rate:19, status:"open", apps:8, filled:"2/5" },
  { id:"3", title:"Event crew zaterdag", date:"12 apr 2026", time:"14:00-22:00", rate:24, status:"filled", apps:12, filled:"3/3" },
  { id:"4", title:"Kassamedewerker", date:"12 apr 2026", time:"10:00-18:00", rate:18, status:"open", apps:3, filled:"0/1" },
  { id:"5", title:"Afwasser avond", date:"13 apr 2026", time:"17:00-01:00", rate:20, status:"draft", apps:0, filled:"0/2" },
  { id:"6", title:"Kok weekend", date:"19 apr 2026", time:"15:00-23:00", rate:26, status:"open", apps:2, filled:"0/1" },
];

const sc: Record<string,{bg:string;text:string;label:string}> = {
  open:{bg:"rgba(239,71,111,0.1)",text:"#EF476F",label:"Open"},
  filled:{bg:"rgba(167,218,220,0.1)",text:"#A7DADC",label:"Gevuld"},
  draft:{bg:"rgba(255,255,255,0.05)",text:"rgba(255,255,255,0.3)",label:"Concept"},
};

export default function ShiftsListPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Shifts</h1>
        <Link href="/admin/shifts/new">
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold" style={{background:"#EF476F"}}>
            <CalendarPlus size={16}/>Nieuwe Shift
          </motion.button>
        </Link>
      </div>
      <div className="rounded-xl overflow-hidden" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 text-xs font-semibold" style={{color:"rgba(255,255,255,0.25)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <div className="col-span-4">Shift</div><div className="col-span-2">Datum</div><div className="col-span-1">Tarief</div><div className="col-span-2">Status</div><div className="col-span-1">Apps</div><div className="col-span-1">Bezet</div><div className="col-span-1"></div>
        </div>
        {shifts.map(s=>(
          <Link key={s.id} href={`/admin/shifts/${s.id}`}
            className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors" style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
            <div className="col-span-12 md:col-span-4"><div className="text-sm text-white font-medium">{s.title}</div><div className="text-xs md:hidden" style={{color:"rgba(255,255,255,0.25)"}}>{s.date} · {s.time}</div></div>
            <div className="hidden md:block col-span-2 text-xs" style={{color:"rgba(255,255,255,0.4)"}}>{s.date}<br/><span style={{color:"rgba(255,255,255,0.2)"}}>{s.time}</span></div>
            <div className="hidden md:block col-span-1 text-sm font-bold" style={{color:"#A7DADC"}}>€{s.rate}</div>
            <div className="hidden md:block col-span-2"><span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{background:sc[s.status].bg,color:sc[s.status].text}}>{sc[s.status].label}</span></div>
            <div className="hidden md:block col-span-1 text-xs" style={{color:"rgba(255,255,255,0.35)"}}>{s.apps}</div>
            <div className="hidden md:block col-span-1 text-xs" style={{color:"rgba(255,255,255,0.35)"}}>{s.filled}</div>
            <div className="hidden md:flex col-span-1 justify-end"><ArrowRight size={14} style={{color:"rgba(255,255,255,0.15)"}}/></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
