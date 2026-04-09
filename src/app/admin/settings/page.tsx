"use client";
import { motion } from "framer-motion";
import { Building2, CreditCard, Bell, Shield } from "lucide-react";

const sections = [
  { icon:<Building2 size={20}/>, title:"Bedrijfsprofiel", desc:"Naam, logo, beschrijving, KVK" },
  { icon:<CreditCard size={20}/>, title:"Betalingen", desc:"Stripe Connect, facturen, betaalhistorie" },
  { icon:<Bell size={20}/>, title:"Notificaties", desc:"E-mail alerts, push notifications" },
  { icon:<Shield size={20}/>, title:"Team & Rollen", desc:"Teamleden beheren, rollen toewijzen" },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-white mb-6">Instellingen</h1>
      <div className="space-y-3">
        {sections.map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.4)"}}>{s.icon}</div>
            <div>
              <div className="text-white font-semibold text-sm">{s.title}</div>
              <div className="text-xs" style={{color:"rgba(255,255,255,0.3)"}}>{s.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
