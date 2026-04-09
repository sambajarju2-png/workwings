"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Save, User, MapPin, Phone, Hash, CreditCard, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function EditProfilePage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("workers").select("*").eq("id", user.id).single();
      setWorker(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true); setError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !worker) { setSaving(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error: dbError } = await supabase.from("workers").update({
      first_name: worker.first_name,
      last_name: worker.last_name,
      city: worker.city,
      phone: worker.phone || null,
      iban: worker.iban || null,
      btw_number: worker.btw_number || null,
      kvk_number: worker.kvk_number || null,
      payout_preference: worker.payout_preference,
    }).eq("id", user.id);

    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setSaving(false); setSaved(true);
    setTimeout(() => router.push("/profile"), 1000);
  }

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-foreground-subtle" /></div>;
  if (!worker) return <div className="p-6 text-center text-foreground-subtle">Profiel niet gevonden</div>;

  const input = "w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-foreground bg-surface border border-border outline-none";

  return (
    <div className="p-4 pb-24">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle mb-6">
        <ArrowLeft size={16} /> Terug
      </button>

      <h1 className="text-xl font-black text-foreground mb-6">Profiel bewerken</h1>
      {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.first_name || ""} onChange={e => setWorker({ ...worker, first_name: e.target.value })} placeholder="Voornaam" className={input} /></div>
          <div className="relative"><User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.last_name || ""} onChange={e => setWorker({ ...worker, last_name: e.target.value })} placeholder="Achternaam" className={input} /></div>
        </div>

        <div className="relative"><MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.city || ""} onChange={e => setWorker({ ...worker, city: e.target.value })} placeholder="Stad" className={input} /></div>

        <div className="relative"><Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.phone || ""} onChange={e => setWorker({ ...worker, phone: e.target.value })} placeholder="Telefoonnummer" className={input} /></div>

        <div className="relative"><CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.iban || ""} onChange={e => setWorker({ ...worker, iban: e.target.value })} placeholder="IBAN (bijv. NL91ABNA0417164300)" className={input} /></div>

        <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.btw_number || ""} onChange={e => setWorker({ ...worker, btw_number: e.target.value })} placeholder="BTW-nummer (bijv. NL123456789B01)" className={input} /></div>

        <div className="relative"><Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle" /><input value={worker.kvk_number || ""} onChange={e => setWorker({ ...worker, kvk_number: e.target.value })} placeholder="KVK-nummer (optioneel)" className={input} /></div>

        {/* Payout preference */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Betaalvoorkeur</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setWorker({ ...worker, payout_preference: "fast" })}
              className="p-4 rounded-xl border text-left transition-all"
              style={{ background: worker.payout_preference === "fast" ? "rgba(239,71,111,0.06)" : "var(--color-surface)", borderColor: worker.payout_preference === "fast" ? "#EF476F" : "var(--color-border)" }}>
              <div className="flex items-center gap-2 mb-1"><Zap size={14} style={{ color: "#EF476F" }} /><span className="text-sm font-bold" style={{ color: worker.payout_preference === "fast" ? "#EF476F" : "var(--color-foreground)" }}>Snel</span></div>
              <p className="text-xs text-foreground-subtle">Binnen 5 dagen betaald. €0,75/uur fee.</p>
            </button>
            <button onClick={() => setWorker({ ...worker, payout_preference: "normal" })}
              className="p-4 rounded-xl border text-left transition-all"
              style={{ background: worker.payout_preference === "normal" ? "rgba(167,218,220,0.1)" : "var(--color-surface)", borderColor: worker.payout_preference === "normal" ? "#A7DADC" : "var(--color-border)" }}>
              <div className="flex items-center gap-2 mb-1"><CreditCard size={14} style={{ color: "#0e8a8d" }} /><span className="text-sm font-bold" style={{ color: worker.payout_preference === "normal" ? "#0e8a8d" : "var(--color-foreground)" }}>Normaal</span></div>
              <p className="text-xs text-foreground-subtle">Na betaling opdrachtgever. Geen extra kosten.</p>
            </button>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: saved ? "#0e8a8d" : "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <><Save size={16} /> Opgeslagen</> : <><Save size={16} /> Opslaan</>}
        </button>
      </div>
    </div>
  );
}
