"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, CheckCircle, CalendarPlus, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Open Shifts", val: "8", change: "+2 deze week", icon: <Clock size={18}/>, color: "#EF476F", bg: "rgba(239,71,111,0.06)" },
  { label: "Sollicitaties", val: "34", change: "+12 vandaag", icon: <Users size={18}/>, color: "#A7DADC", bg: "rgba(167,218,220,0.1)" },
  { label: "Gevuld %", val: "89%", change: "+5% vs vorige maand", icon: <CheckCircle size={18}/>, color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
  { label: "Uitgegeven", val: "€4.2K", change: "Deze maand", icon: <TrendingUp size={18}/>, color: "#EF476F", bg: "rgba(239,71,111,0.06)" },
];

const recentShifts = [
  { id:"1", title:"Barista ochtend", date:"10 apr", status:"open", apps:5, filled:"1/2" },
  { id:"2", title:"Warehouse avond", date:"11 apr", status:"open", apps:8, filled:"2/5" },
  { id:"3", title:"Event crew", date:"12 apr", status:"filled", apps:12, filled:"3/3" },
  { id:"4", title:"Kassamedewerker", date:"12 apr", status:"open", apps:3, filled:"0/1" },
  { id:"5", title:"Afwasser", date:"13 apr", status:"draft", apps:0, filled:"0/2" },
];

const sc: Record<string,{bg:string;text:string;label:string}> = {
  open:{bg:"rgba(239,71,111,0.08)",text:"#EF476F",label:"Open"},
  filled:{bg:"rgba(167,218,220,0.12)",text:"#0e8a8d",label:"Gevuld"},
  draft:{bg:"#F0F4F8",text:"#8BA3B5",label:"Concept"},
};

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{color:"#023047"}}>Dashboard</h1>
          <p className="text-sm mt-1" style={{color:"#8BA3B5"}}>Welkom terug, Coffee Company</p>
        </div>
        <Link href="/admin/shifts/new">
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md"
            style={{background:"linear-gradient(135deg, #EF476F, #D93A5E)"}}>
            <CalendarPlus size={16}/>Nieuwe Shift
          </motion.button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-white p-5 rounded-2xl border" style={{borderColor:"#E8EDF2"}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{color:"#8BA3B5"}}>{s.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:s.bg,color:s.color}}>{s.icon}</div>
            </div>
            <div className="text-3xl font-black" style={{color:"#023047"}}>{s.val}</div>
            <div className="text-xs mt-1.5" style={{color:"#A7DADC"}}>{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent shifts */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="bg-white rounded-2xl border overflow-hidden" style={{borderColor:"#E8EDF2"}}>
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{borderColor:"#F0F4F8"}}>
          <h2 className="text-sm font-bold" style={{color:"#023047"}}>Recente Shifts</h2>
          <Link href="/admin/shifts" className="text-xs font-semibold" style={{color:"#EF476F"}}>Alle shifts →</Link>
        </div>
        <div>
          {recentShifts.map((s,i)=>(
            <Link key={s.id} href={`/admin/shifts/${s.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors border-b last:border-b-0" style={{borderColor:"#F0F4F8"}}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{color:"#023047"}}>{s.title}</div>
                <div className="text-xs mt-0.5" style={{color:"#8BA3B5"}}>{s.date}</div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{background:sc[s.status].bg,color:sc[s.status].text}}>
                {sc[s.status].label}
              </span>
              <div className="text-xs text-right w-16" style={{color:"#8BA3B5"}}>
                <div>{s.apps} apps</div>
                <div>{s.filled}</div>
              </div>
              <ArrowRight size={14} style={{color:"#D0D8E0"}}/>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/admin/shifts/new">
          <motion.div whileHover={{scale:1.01,y:-2}} className="p-6 rounded-2xl bg-white border cursor-pointer" style={{borderColor:"#E8EDF2"}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(239,71,111,0.08)"}}>
              <CalendarPlus size={20} style={{color:"#EF476F"}}/>
            </div>
            <div className="font-bold text-sm" style={{color:"#023047"}}>Shift aanmaken</div>
            <div className="text-xs mt-1" style={{color:"#8BA3B5"}}>Post een nieuwe shift en ontvang direct sollicitaties</div>
          </motion.div>
        </Link>
        <Link href="/admin/applications">
          <motion.div whileHover={{scale:1.01,y:-2}} className="p-6 rounded-2xl bg-white border cursor-pointer" style={{borderColor:"#E8EDF2"}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:"rgba(167,218,220,0.12)"}}>
              <Users size={20} style={{color:"#0e8a8d"}}/>
            </div>
            <div className="font-bold text-sm" style={{color:"#023047"}}>Sollicitaties bekijken</div>
            <div className="text-xs mt-1" style={{color:"#8BA3B5"}}>34 nieuwe sollicitaties wachten op je</div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
