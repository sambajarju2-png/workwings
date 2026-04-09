"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Clock, MapPin, Euro } from "lucide-react";
import Link from "next/link";

export default function AdminShiftDetailPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl space-y-6">
      <Link href="/admin/shifts" className="inline-flex items-center gap-1 text-sm font-medium" style={{color:"#8BA3B5"}}>
        <ArrowLeft size={16}/>Terug naar shifts
      </Link>
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
        <h1 className="text-2xl font-black" style={{color:"#023047"}}>Barista ochtend</h1>
        <div className="flex flex-wrap gap-3 mt-4">
          {[{icon:<Clock size={14}/>,text:"08:00 – 16:00"},{icon:<MapPin size={14}/>,text:"Amsterdam"},{icon:<Euro size={14}/>,text:"€22/uur"},{icon:<Users size={14}/>,text:"1/2 gevuld"}].map((p,i)=>(
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{borderColor:"#E8EDF2",color:"#4A6B7F"}}>
              <span style={{color:"#A7DADC"}}>{p.icon}</span>{p.text}
            </span>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl border overflow-hidden" style={{borderColor:"#E8EDF2"}}>
          <div className="px-6 py-4 border-b" style={{borderColor:"#F0F4F8"}}>
            <h3 className="text-sm font-bold" style={{color:"#023047"}}>Sollicitaties (5)</h3>
          </div>
          {["Lisa V.","Kevin M.","Sanne K.","Tom R.","Emma L."].map((n,i)=>(
            <div key={i} className="flex items-center justify-between px-6 py-3.5 border-b last:border-b-0" style={{borderColor:"#F0F4F8"}}>
              <span className="text-sm font-medium" style={{color:"#023047"}}>{n}</span>
              <div className="flex gap-2">
                <button className="text-xs px-4 py-1.5 rounded-lg font-semibold border" style={{background:"rgba(167,218,220,0.08)",borderColor:"#A7DADC",color:"#0e8a8d"}}>Accept</button>
                <button className="text-xs px-4 py-1.5 rounded-lg border" style={{borderColor:"#E8EDF2",color:"#8BA3B5"}}>Weiger</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
