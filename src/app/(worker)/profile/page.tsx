"use client";
import { motion } from "framer-motion";
import { Star, MapPin, Award, ChevronRight, LogOut, User, Heart, FileText, TrendingUp, Bell, Settings, HelpCircle, Zap, Shield } from "lucide-react";

const worker = {
  firstName: "Samba", lastName: "J.", city: "Amsterdam", rating: 4.9, reviews: 128,
  totalShifts: 24, notCompleted: 0, replacements: 3, reliabilityScore: 9.2,
};

const menuSections = [
  {
    title: "Account & Voorkeuren",
    items: [
      { icon: <User size={18}/>, label: "Mijn profiel", color: "#023047" },
      { icon: <Heart size={18}/>, label: "Favoriete bedrijven", color: "#EF476F" },
      { icon: <Award size={18}/>, label: "Certificaten & Skills", color: "#A7DADC" },
      { icon: <TrendingUp size={18}/>, label: "Financieel overzicht", color: "#023047" },
      { icon: <Shield size={18}/>, label: "Verzekeringen", color: "#A7DADC" },
      { icon: <Bell size={18}/>, label: "Notificatie-instellingen", color: "#EF476F" },
    ]
  },
  {
    title: "Meer van WorkWings",
    items: [
      { icon: <HelpCircle size={18}/>, label: "Ik heb een vraag", color: "#023047" },
      { icon: <FileText size={18}/>, label: "Stuur feedback", color: "#A7DADC" },
      { icon: <Settings size={18}/>, label: "Instellingen", color: "#023047" },
    ]
  }
];

export default function ProfilePage() {
  return (
    <div className="pb-24">
      {/* Gradient header — like Temper/YoungOnes */}
      <div className="relative h-44 overflow-hidden" style={{background:"linear-gradient(135deg, #023047, #01293F, #012133)"}}>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{background:"radial-gradient(circle, rgba(239,71,111,0.2), transparent)"}} />
        <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full" style={{background:"radial-gradient(circle, rgba(167,218,220,0.1), transparent)"}} />
        <div className="relative z-10 flex items-end justify-center h-full pb-2">
          <h2 className="text-white font-black text-lg uppercase tracking-wider">Account</h2>
        </div>
      </div>

      {/* Profile card — overlapping the header */}
      <div className="px-4 -mt-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-2xl border border-border p-6 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full mx-auto -mt-16 mb-3 flex items-center justify-center text-2xl font-black text-white border-4 border-surface"
            style={{background:"linear-gradient(135deg, #EF476F, #D93A5E)"}}>
            {worker.firstName[0]}{worker.lastName[0]}
          </div>

          <h1 className="text-xl font-black text-foreground">{worker.firstName} {worker.lastName}</h1>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#f59e0b" color="#f59e0b" />)}
          </div>
          <button className="text-xs font-semibold underline mt-1 text-foreground-muted">{worker.reviews} reviews</button>

          {/* Stats — like YoungOnes */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-foreground-subtle mb-3">Je shifts over de laatste 6 maanden</p>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center px-2">
                <div className="text-2xl font-black text-foreground">{worker.totalShifts}</div>
                <div className="text-[10px] text-foreground-subtle leading-tight">Gematcht<br/>shifts</div>
              </div>
              <div className="text-center px-2">
                <div className="text-2xl font-black text-foreground">{worker.notCompleted}</div>
                <div className="text-[10px] text-foreground-subtle leading-tight">Niet afgerond<br/>shifts</div>
              </div>
              <div className="text-center px-2">
                <div className="text-2xl font-black text-foreground">{worker.replacements}</div>
                <div className="text-[10px] text-foreground-subtle leading-tight">Vervangingen<br/>geleverd</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Menu sections — like Temper */}
      <div className="px-4 mt-6 space-y-6">
        {menuSections.map((section, si) => (
          <motion.div key={si} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + si * 0.05 }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-subtle mb-2 px-1">{section.title}</h3>
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              {section.items.map((item, i) => (
                <a key={i} href="#"
                  className="flex items-center gap-3.5 px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-background-alt/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`${item.color}10`,color:item.color}}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                  <ChevronRight size={16} className="text-foreground-subtle" />
                </a>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl text-sm font-semibold border"
          style={{ borderColor: "rgba(239,71,111,0.2)", color: "#EF476F", background: "rgba(239,71,111,0.04)" }}>
          <LogOut size={16} /> Uitloggen
        </motion.button>
      </div>
    </div>
  );
}
