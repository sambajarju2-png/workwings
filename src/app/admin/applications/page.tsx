"use client";
import { motion } from "framer-motion";
import { Check, X, Star, Clock } from "lucide-react";

const applications = [
  { id:"1", worker:"Lisa V.", rating:4.9, shifts:24, shift:"Barista ochtend", rate:"€22/uur", proposed:"€22/uur", time:"Vandaag, 08:00", status:"pending" },
  { id:"2", worker:"Kevin M.", rating:4.7, shifts:12, shift:"Warehouse avond", rate:"€19/uur", proposed:"€21/uur", time:"Vandaag, 18:00", status:"pending" },
  { id:"3", worker:"Priya D.", rating:4.8, shifts:36, shift:"Event crew", rate:"€24/uur", proposed:"€24/uur", time:"Morgen, 14:00", status:"pending" },
  { id:"4", worker:"Jan B.", rating:4.2, shifts:5, shift:"Kassamedewerker", rate:"€18/uur", proposed:"€20/uur", time:"Za, 10:00", status:"pending" },
  { id:"5", worker:"Sanne K.", rating:4.6, shifts:18, shift:"Barista ochtend", rate:"€22/uur", proposed:"€22/uur", time:"Vandaag, 08:00", status:"pending" },
];

export default function ApplicationsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-black text-white mb-1">Sollicitaties</h1>
      <p className="text-sm mb-6" style={{color:"rgba(255,255,255,0.3)"}}>{applications.length} openstaande sollicitaties</p>

      <div className="space-y-3">
        {applications.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="p-4 rounded-xl flex items-center gap-4" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{background:"linear-gradient(135deg, #EF476F, #D93A5E)"}}>
              {a.worker.split(" ").map(w=>w[0]).join("")}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">{a.worker}</span>
                <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                  style={{background:"rgba(239,71,111,0.1)",color:"#EF476F"}}>
                  <Star size={8} fill="#EF476F"/>{a.rating}
                </span>
                <span className="text-[10px]" style={{color:"rgba(255,255,255,0.2)"}}>{a.shifts} shifts</span>
              </div>
              <div className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.3)"}}>
                {a.shift} · <Clock size={10} className="inline"/> {a.time}
              </div>
              {a.proposed !== a.rate && (
                <div className="text-[10px] mt-1 px-2 py-0.5 rounded inline-block"
                  style={{background:"rgba(239,71,111,0.08)",color:"#EF476F"}}>
                  Biedt {a.proposed} (shift: {a.rate})
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{background:"rgba(167,218,220,0.15)",color:"#A7DADC"}}>
                <Check size={18}/>
              </motion.button>
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.25)"}}>
                <X size={18}/>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
