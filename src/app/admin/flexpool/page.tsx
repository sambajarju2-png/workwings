"use client";
import { motion } from "framer-motion";
import { Star, Heart, Ban } from "lucide-react";

const workers = [
  { name:"Lisa V.", rating:4.9, shifts:24, sectors:["horeca"], status:"active" },
  { name:"Kevin M.", rating:4.7, shifts:12, sectors:["logistics"], status:"active" },
  { name:"Priya D.", rating:4.8, shifts:36, sectors:["events","horeca"], status:"active" },
  { name:"Sanne K.", rating:4.6, shifts:18, sectors:["horeca","retail"], status:"active" },
];

export default function FlexpoolPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-black text-white mb-1">Flexpool</h1>
      <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.3)"}}>Je favoriete freelancers. Auto-accept voor toekomstige shifts.</p>
      <div className="space-y-3">
        {workers.map((w,i)=>(
          <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="p-4 rounded-xl flex items-center gap-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{background:"#023047"}}>{w.name.split(" ").map(n=>n[0]).join("")}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{w.name}</span>
                <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded" style={{background:"rgba(239,71,111,0.1)",color:"#EF476F"}}>
                  <Star size={8} fill="#EF476F"/>{w.rating}
                </span>
              </div>
              <div className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>{w.shifts} shifts · {w.sectors.join(", ")}</div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(239,71,111,0.1)",color:"#EF476F"}}><Heart size={14} fill="#EF476F"/></button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.2)"}}><Ban size={14}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
