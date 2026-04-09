"use client";
import { motion } from "framer-motion";
import { Star, Heart, Ban } from "lucide-react";

const workers = [
  { name:"Lisa V.", rating:4.9, shifts:24, sectors:["horeca"] },
  { name:"Kevin M.", rating:4.7, shifts:12, sectors:["logistics"] },
  { name:"Priya D.", rating:4.8, shifts:36, sectors:["events","horeca"] },
  { name:"Sanne K.", rating:4.6, shifts:18, sectors:["horeca","retail"] },
];

export default function FlexpoolPage() {
  return (
    <div className="p-6 lg:p-10 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{color:"#023047"}}>Flexpool</h1>
        <p className="text-sm mt-1" style={{color:"#8BA3B5"}}>Je favoriete freelancers. Auto-accept voor toekomstige shifts.</p>
      </div>
      <div className="space-y-3">
        {workers.map((w,i)=>(
          <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-white p-5 rounded-2xl border flex items-center gap-4" style={{borderColor:"#E8EDF2"}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{background:"#023047"}}>{w.name.split(" ").map(n=>n[0]).join("")}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{color:"#023047"}}>{w.name}</span>
                <span className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{background:"rgba(239,71,111,0.08)",color:"#EF476F"}}>
                  <Star size={8} fill="#EF476F"/>{w.rating}
                </span>
              </div>
              <div className="text-xs mt-0.5" style={{color:"#8BA3B5"}}>{w.shifts} shifts · {w.sectors.join(", ")}</div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"rgba(239,71,111,0.06)"}}><Heart size={14} fill="#EF476F" color="#EF476F"/></button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{borderColor:"#E8EDF2",color:"#8BA3B5"}}><Ban size={14}/></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
