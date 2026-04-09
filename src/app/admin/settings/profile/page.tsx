"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader2, Upload, Camera, Save, Building2, Globe, Phone, Mail, Hash } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: m } = await supabase.from("company_members").select("company_id, companies(*)").eq("user_id", user.id).single();
      if (m?.companies) { setCompany(m.companies); setCompanyId(m.company_id); }
      setLoading(false);
    }
    load();
  }, []);

  async function uploadImage(file: File, type: "logo" | "header") {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !companyId) return;
    setUploading(type);

    const ext = file.name.split(".").pop();
    const path = `${companyId}/${type}.${ext}`;
    const { error } = await supabase.storage.from("company-images").upload(path, file, { upsert: true });

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("company-images").getPublicUrl(path);
      const field = type === "logo" ? "logo_url" : "header_image_url";
      await supabase.from("companies").update({ [field]: publicUrl }).eq("id", companyId);
      setCompany((c: any) => ({ ...c, [field]: publicUrl }));
    }
    setUploading("");
  }

  async function handleSave() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !companyId) return;
    setSaving(true);

    await supabase.from("companies").update({
      name: company.name,
      description: company.description,
      kvk_number: company.kvk_number,
      contact_email: company.contact_email,
      phone: company.phone,
      website: company.website,
      address: company.address,
      city: company.city,
      postal_code: company.postal_code,
    }).eq("id", companyId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;
  if (!company) return <div className="p-10 text-center" style={{ color: "#8BA3B5" }}>Bedrijf niet gevonden</div>;

  const input = "w-full px-4 py-3 rounded-xl text-sm outline-none border bg-white";
  const inputIcon = "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none border bg-white";
  const s = { borderColor: "#E8EDF2", color: "#023047" };

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}><ArrowLeft size={16} /> Instellingen</Link>

      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Bedrijfsprofiel</h1>

      {/* Header Image */}
      <div className="relative mb-8 rounded-xl overflow-hidden border" style={{ borderColor: "#E8EDF2" }}>
        <div className="h-40 flex items-center justify-center" style={{ background: company.header_image_url ? `url(${company.header_image_url}) center/cover` : "linear-gradient(135deg, #023047, #012A3E)" }}>
          {!company.header_image_url && <p className="text-sm text-white/50">Header afbeelding</p>}
        </div>
        <button onClick={() => headerRef.current?.click()} className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 text-white text-xs font-semibold flex items-center gap-1">
          {uploading === "header" ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />} Header
        </button>
        <input ref={headerRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "header"); }} />

        {/* Logo overlay */}
        <div className="absolute -bottom-8 left-6">
          <div className="w-16 h-16 rounded-xl border-4 flex items-center justify-center text-xl font-black text-white cursor-pointer overflow-hidden"
            style={{ background: company.logo_url ? "transparent" : (company.brand_color || "#EF476F"), borderColor: "white" }}
            onClick={() => logoRef.current?.click()}>
            {company.logo_url ? <img src={company.logo_url} className="w-full h-full object-cover" /> :
              uploading === "logo" ? <Loader2 size={18} className="animate-spin" /> : company.name?.[0]}
          </div>
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0], "logo"); }} />
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Bedrijfsnaam</label>
          <div className="relative"><Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8BA3B5" }} />
            <input value={company.name || ""} onChange={e => setCompany({ ...company, name: e.target.value })} className={inputIcon} style={s} /></div>
        </div>

        <div>
          <label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Beschrijving</label>
          <textarea value={company.description || ""} onChange={e => setCompany({ ...company, description: e.target.value })} rows={3}
            placeholder="Vertel over je bedrijf..." className={input} style={s} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>KVK-nummer</label>
            <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8BA3B5" }} />
              <input value={company.kvk_number || ""} onChange={e => setCompany({ ...company, kvk_number: e.target.value })} className={inputIcon} style={s} /></div></div>
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Website</label>
            <div className="relative"><Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8BA3B5" }} />
              <input value={company.website || ""} onChange={e => setCompany({ ...company, website: e.target.value })} placeholder="https://" className={inputIcon} style={s} /></div></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>E-mail</label>
            <div className="relative"><Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8BA3B5" }} />
              <input value={company.contact_email || ""} onChange={e => setCompany({ ...company, contact_email: e.target.value })} className={inputIcon} style={s} /></div></div>
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Telefoon</label>
            <div className="relative"><Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8BA3B5" }} />
              <input value={company.phone || ""} onChange={e => setCompany({ ...company, phone: e.target.value })} className={inputIcon} style={s} /></div></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1"><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Postcode</label>
            <input value={company.postal_code || ""} onChange={e => setCompany({ ...company, postal_code: e.target.value })} className={input} style={s} /></div>
          <div className="col-span-1"><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Stad</label>
            <input value={company.city || ""} onChange={e => setCompany({ ...company, city: e.target.value })} className={input} style={s} /></div>
          <div className="col-span-1"><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Adres</label>
            <input value={company.address || ""} onChange={e => setCompany({ ...company, address: e.target.value })} className={input} style={s} /></div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          style={{ background: saved ? "#0e8a8d" : "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <><Save size={16} /> Opgeslagen</> : <><Save size={16} /> Opslaan</>}
        </button>
      </div>
    </div>
  );
}
