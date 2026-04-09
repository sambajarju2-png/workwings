"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, MapPin, Plus, X, Save, Shirt, Car } from "lucide-react";
import Link from "next/link";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", address: "", city: "", parking_info: "", dress_code: "" });

  useEffect(() => {
    fetch("/api/locations").then(r => r.json()).then(d => { setLocations(d.locations || []); setLoading(false); });
  }, []);

  async function handleAdd() {
    if (!form.name || !form.city) return;
    setSaving(true); setError("");
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Fout bij opslaan"); setSaving(false); return; }
    setLocations(prev => [data.location, ...prev]);
    setSaving(false); setShowForm(false);
    setForm({ name: "", address: "", city: "", parking_info: "", dress_code: "" });
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const input = "w-full px-4 py-3 rounded-xl text-sm outline-none border bg-white";
  const st = { borderColor: "#E8EDF2", color: "#023047" };

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link href="/admin/settings" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "#8BA3B5" }}><ArrowLeft size={16} /> Instellingen</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#023047" }}>Locaties</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-white font-bold text-sm flex items-center gap-2" style={{ background: "#EF476F" }}>
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Annuleer" : "Nieuwe locatie"}
        </button>
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6 space-y-3" style={{ borderColor: "#E8EDF2" }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Locatienaam</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Hoofdkantoor" className={input} style={st} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Stad</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Amsterdam" className={input} style={st} /></div>
          </div>
          <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Adres</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Keizersgracht 100" className={input} style={st} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Dresscode</label><input value={form.dress_code} onChange={e => setForm({ ...form, dress_code: e.target.value })} placeholder="Zwarte kleding" className={input} style={st} /></div>
            <div><label className="text-xs font-semibold mb-1 block" style={{ color: "#4A6B7F" }}>Parkeren</label><input value={form.parking_info} onChange={e => setForm({ ...form, parking_info: e.target.value })} placeholder="Gratis achter het pand" className={input} style={st} /></div>
          </div>
          <button onClick={handleAdd} disabled={saving || !form.name || !form.city} className="px-6 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50" style={{ background: "#023047" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Toevoegen
          </button>
        </div>
      )}

      {locations.length === 0 ? (
        <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: "#E8EDF2" }}>
          <MapPin size={32} style={{ color: "#E8EDF2" }} className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen locaties</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((l: any) => (
            <div key={l.id} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E8EDF2" }}>
              <div className="font-bold text-sm flex items-center gap-2" style={{ color: "#023047" }}><MapPin size={14} style={{ color: "#EF476F" }} /> {l.name}</div>
              <div className="text-xs mt-1" style={{ color: "#8BA3B5" }}>{l.address}{l.address && l.city ? ", " : ""}{l.city}</div>
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
