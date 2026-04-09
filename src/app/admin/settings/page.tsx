"use client";
import { motion } from "framer-motion";
import { Building2, CreditCard, Bell, Shield, ChevronRight } from "lucide-react";

const sections = [
  { icon:<Building2 size={20}/>, title:"Bedrijfsprofiel", desc:"Naam, logo, beschrijving, KVK", color:"#023047" },
  { icon:<CreditCard size={20}/>, title:"Betalingen", desc:"Stripe Connect, facturen, betaalhistorie", color:"#EF476F" },
  { icon:<Bell size={20}/>, title:"Notificaties", desc:"E-mail alerts, push notifications", color:"#A7DADC" },
  { icon:<Shield size={20}/>, title:"Team & Rollen", desc:"Teamleden beheren, rollen toewijzen", color:"#023047" },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl space-y-6">
      <h1 className="text-2xl font-black" style={{color:"#023047"}}>Instellingen</h1>
      <div className="space-y-3">
        {sections.map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-white p-5 rounded-2xl border flex items-center gap-4 cursor-pointer hover:shadow-sm transition-shadow"
            style={{borderColor:"#E8EDF2"}}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:`${s.color}10`,color:s.color}}>{s.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{color:"#023047"}}>{s.title}</div>
              <div className="text-xs mt-0.5" style={{color:"#8BA3B5"}}>{s.desc}</div>
            </div>
            <ChevronRight size={16} style={{color:"#D0D8E0"}}/>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
