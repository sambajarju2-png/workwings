"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Clock, MapPin, Euro } from "lucide-react";
import Link from "next/link";

export default function AdminShiftDetailPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/admin/shifts" className="inline-flex items-center gap-1 text-sm mb-6" style={{color:"rgba(255,255,255,0.35)"}}>
        <ArrowLeft size={16}/>Terug naar shifts
      </Link>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h1 className="text-2xl font-black text-white mb-1">Barista ochtend</h1>
        <div className="flex flex-wrap gap-3 mt-3">
          {[{icon:<Clock size={14}/>,text:"08:00 – 16:00"},{icon:<MapPin size={14}/>,text:"Amsterdam"},{icon:<Euro size={14}/>,text:"€22/uur"},{icon:<Users size={14}/>,text:"1/2 gevuld"}].map((p,i)=>(
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.5)"}}>
              <span style={{color:"#A7DADC"}}>{p.icon}</span>{p.text}
            </span>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
          <h3 className="text-sm font-bold text-white/60 mb-2">Sollicitaties (5)</h3>
          {["Lisa V.","Kevin M.","Sanne K.","Tom R.","Emma L."].map((n,i)=>(
            <div key={i} className="flex items-center justify-between py-2.5" style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <span className="text-sm text-white/70">{n}</span>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 rounded-lg font-semibold" style={{background:"rgba(167,218,220,0.15)",color:"#A7DADC"}}>Accept</button>
                <button className="text-xs px-3 py-1 rounded-lg" style={{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.3)"}}>Weiger</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
