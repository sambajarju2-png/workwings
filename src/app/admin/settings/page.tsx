"use client";
import { useState, useEffect } from "react";
import { Building2, MapPin, CreditCard, Bell, Users, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SettingsPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: m } = await supabase.from("company_members").select("company_id, companies(*)").eq("user_id", user.id).single();
      if (m?.companies) setCompany(m.companies);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const sections = [
    { icon: <Building2 size={20} />, title: "Bedrijfsprofiel", desc: "Naam, logo, header image, beschrijving", href: "/admin/settings/profile", color: "#023047" },
    { icon: <MapPin size={20} />, title: "Locaties", desc: "Vestigingen toevoegen en beheren", href: "/admin/settings/locations", color: "#EF476F" },
    { icon: <CreditCard size={20} />, title: "Betalingen", desc: "Facturatie en betaalinstellingen", href: "/admin/payments", color: "#A7DADC" },
    { icon: <Bell size={20} />, title: "Notificaties", desc: "E-mail en push meldingen", href: "/admin/settings", color: "#023047" },
    { icon: <Users size={20} />, title: "Team", desc: "Teamleden en rollen beheren", href: "/admin/settings", color: "#EF476F" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Instellingen</h1>

      {company && (
        <div className="bg-white rounded-xl border p-5 mb-6 flex items-center gap-4" style={{ borderColor: "#E8EDF2" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: company.brand_color || "#023047" }}>
            {company.name?.[0]}
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: "#023047" }}>{company.name}</div>
            <div className="text-xs" style={{ color: "#8BA3B5" }}>KVK: {company.kvk_number || "Niet ingesteld"} · {company.city || ""}</div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((s, i) => (
          <Link key={i} href={s.href} className="bg-white p-5 rounded-xl border flex items-center gap-4 hover:shadow-sm transition-shadow block" style={{ borderColor: "#E8EDF2" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}10`, color: s.color }}>{s.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: "#023047" }}>{s.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "#8BA3B5" }}>{s.desc}</div>
            </div>
            <ChevronRight size={16} style={{ color: "#D0D8E0" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
