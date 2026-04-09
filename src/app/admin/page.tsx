"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, CheckCircle, CalendarPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Open Shifts", val: "8", change: "+2 deze week", icon: <Clock size={18}/>, color: "#EF476F" },
  { label: "Sollicitaties", val: "34", change: "+12 vandaag", icon: <Users size={18}/>, color: "#A7DADC" },
  { label: "Gevuld %", val: "89%", change: "+5% vs vorige maand", icon: <CheckCircle size={18}/>, color: "#22c55e" },
  { label: "Uitgegeven", val: "€4.2K", change: "Deze maand", icon: <TrendingUp size={18}/>, color: "#EF476F" },
];

const recentShifts = [
  { id:"1", title:"Barista ochtend", date:"10 apr", status:"open", apps:5, filled:"1/2" },
  { id:"2", title:"Warehouse avond", date:"11 apr", status:"open", apps:8, filled:"2/5" },
  { id:"3", title:"Event crew", date:"12 apr", status:"filled", apps:12, filled:"3/3" },
  { id:"4", title:"Kassamedewerker", date:"12 apr", status:"open", apps:3, filled:"0/1" },
  { id:"5", title:"Afwasser", date:"13 apr", status:"draft", apps:0, filled:"0/2" },
];

const statusColors: Record<string,{bg:string;text:string}> = {
  open: { bg:"rgba(239,71,111,0.1)", text:"#EF476F" },
  filled: { bg:"rgba(167,218,220,0.1)", text:"#A7DADC" },
  draft: { bg:"rgba(255,255,255,0.05)", text:"rgba(255,255,255,0.3)" },
};

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm" style={{color:"rgba(255,255,255,0.3)"}}>Welkom terug, Coffee Company</p>
        </div>
        <Link href="/admin/shifts/new">
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{background:"#EF476F"}}>
            <CalendarPlus size={16}/>Nieuwe Shift
          </motion.button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="p-4 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{color:"rgba(255,255,255,0.35)"}}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`${s.color}15`,color:s.color}}>{s.icon}</div>
            </div>
            <div className="text-2xl font-black text-white">{s.val}</div>
            <div className="text-[10px] mt-1" style={{color:"rgba(255,255,255,0.25)"}}>{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent shifts table */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="rounded-xl overflow-hidden" style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="px-4 py-3 flex items-center justify-between" style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
          <h2 className="text-sm font-bold text-white/60">Recente Shifts</h2>
          <Link href="/admin/shifts" className="text-xs font-semibold" style={{color:"#EF476F"}}>Alle shifts →</Link>
        </div>
        <div className="divide-y" style={{borderColor:"rgba(255,255,255,0.04)"}}>
          {recentShifts.map(s=>(
            <Link key={s.id} href={`/admin/shifts/${s.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{s.title}</div>
                <div className="text-xs" style={{color:"rgba(255,255,255,0.25)"}}>{s.date}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{background:statusColors[s.status].bg,color:statusColors[s.status].text}}>
                {s.status}
              </span>
              <div className="text-xs text-right w-16" style={{color:"rgba(255,255,255,0.35)"}}>
                <div>{s.apps} apps</div>
                <div>{s.filled}</div>
              </div>
              <ArrowRight size={14} style={{color:"rgba(255,255,255,0.15)"}}/>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/shifts/new">
          <motion.div whileHover={{scale:1.01}} className="p-5 rounded-xl cursor-pointer"
            style={{background:"linear-gradient(135deg, rgba(239,71,111,0.1), rgba(239,71,111,0.05))",border:"1px solid rgba(239,71,111,0.15)"}}>
            <CalendarPlus size={20} style={{color:"#EF476F"}} className="mb-2"/>
            <div className="text-white font-bold text-sm">Shift aanmaken</div>
            <div className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>Post een nieuwe shift en ontvang direct sollicitaties</div>
          </motion.div>
        </Link>
        <Link href="/admin/applications">
          <motion.div whileHover={{scale:1.01}} className="p-5 rounded-xl cursor-pointer"
            style={{background:"linear-gradient(135deg, rgba(167,218,220,0.1), rgba(167,218,220,0.05))",border:"1px solid rgba(167,218,220,0.15)"}}>
            <Users size={20} style={{color:"#A7DADC"}} className="mb-2"/>
            <div className="text-white font-bold text-sm">Sollicitaties bekijken</div>
            <div className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>34 nieuwe sollicitaties wachten op je</div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
