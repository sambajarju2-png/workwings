"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, MapPin, Plus, X, Save, Shirt, Car } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", city: "", lat: "", lng: "", parking_info: "", dress_code: "" });

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: m } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!m) { setLoading(false); return; }
      setCompanyId(m.company_id);
      const { data } = await supabase.from("locations").select("*").eq("company_id", m.company_id).order("created_at", { ascending: false });
      setLocations(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAdd() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !companyId) return;
    setSaving(true);
    const { data, error } = await supabase.from("locations").insert({
      company_id: companyId, name: form.name, address: form.address, city: form.city,
      lat: form.lat ? parseFloat(form.lat) : null, lng: form.lng ? parseFloat(form.lng) : null,
      parking_info: form.parking_info || null, dress_code: form.dress_code || null,
    }).select().single();
    if (data) setLocations(prev => [data, ...prev]);
    setSaving(false);
    setShowForm(false);
    setForm({ name: "", address: "", city: "", lat: "", lng: "", parking_info: "", dress_code: "" });
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const input = "w-full px-4 py-3 rounded-xl text-sm outline-none border bg-white";
  const s = { borderColor: "#E8EDF2", color: "#023047" };

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}><ArrowLeft size={16} /> Instellingen</Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#023047" }}>Locaties</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-white font-bold text-sm flex items-center gap-2" style={{ background: "#EF476F" }}>
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Annuleer" : "Nieuwe locatie"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6 space-y-3" style={{ borderColor: "#E8EDF2" }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Locatienaam</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Hoofdkantoor" className={input} style={s} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Stad</label>
              <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Amsterdam" className={input} style={s} /></div>
          </div>
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Adres</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Keizersgracht 100" className={input} style={s} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Dresscode</label>
              <input value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} placeholder="Zwarte kleding" className={input} style={s} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Parkeerinformatie</label>
              <input value={form.parking_info} onChange={e => setForm({ ...form, parking_info: e.target.value })} placeholder="Gratis parkeren achter het pand" className={input} style={s} /></div>
          </div>
          <button onClick={handleAdd} disabled={saving || !form.name || !form.city}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            style={{ background: "#023047" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Toevoegen
          </button>
        </div>
      )}

      {/* Locations list */}
      {locations.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E8EDF2" }}>
          <MapPin size={32} style={{ color: "#E8EDF2" }} className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen locaties toegevoegd</p>
          <p className="text-xs mt-1" style={{ color: "#8BA3B5" }}>Voeg locaties toe zodat freelancers weten waar ze moeten zijn</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((l: any) => (
            <div key={l.id} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E8EDF2" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-sm flex items-center gap-2" style={{ color: "#023047" }}>
                    <MapPin size={14} style={{ color: "#EF476F" }} /> {l.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#8BA3B5" }}>{l.address}{l.address && l.city ? ", " : ""}{l.city}</div>
                </div>
              </div>
              {(l.dress_code || l.parking_info) && (
                <div className="flex gap-4 mt-3">
                  {l.dress_code && <div className="flex items-center gap-1 text-xs" style={{ color: "#4A6B7F" }}><Shirt size={12} /> {l.dress_code}</div>}
                  {l.parking_info && <div className="flex items-center gap-1 text-xs" style={{ color: "#4A6B7F" }}><Car size={12} /> {l.parking_info}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
