"use client";
import { useState, useEffect } from "react";
import { User, MapPin, Star, CalendarDays, Clock, LogOut, Loader2, ChevronRight, Save, Phone, CreditCard, Hash, Zap, Edit2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function WorkerProfilePage() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("workers").select("*").eq("id", user.id).single();
      setWorker(data);
      setDraft(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !draft) { setSaving(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from("workers").update({
      first_name: draft.first_name,
      last_name: draft.last_name,
      city: draft.city,
      phone: draft.phone || null,
      iban: draft.iban || null,
      btw_number: draft.btw_number || null,
      kvk_number: draft.kvk_number || null,
      payout_preference: draft.payout_preference,
    }).eq("id", user.id);

    if (!error) {
      setWorker(draft);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-foreground-subtle" /></div>;

  const d = editing ? draft : worker;
  const input = "w-full px-3 py-2 rounded-lg text-sm text-foreground bg-background border border-border outline-none text-right";

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="h-28 relative" style={{ background: "linear-gradient(135deg, #023047, #012A3E)" }}>
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-black text-white" style={{ background: "#EF476F", borderColor: "var(--color-background)" }}>
            {d?.first_name?.[0]}{d?.last_name?.[0]}
          </div>
        </div>
        <button onClick={() => { if (editing) { setDraft(worker); setEditing(false); } else { setDraft({ ...worker }); setEditing(true); } }}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
          {editing ? "Annuleer" : <><Edit2 size={12} /> Bewerken</>}
        </button>
      </div>

      <div className="px-4 pt-14">
        {editing ? (
          <div className="flex gap-2 mb-1">
            <input value={draft?.first_name || ""} onChange={e => setDraft({ ...draft, first_name: e.target.value })}
              className="text-xl font-black text-foreground bg-transparent border-b border-border outline-none flex-1" placeholder="Voornaam" />
            <input value={draft?.last_name || ""} onChange={e => setDraft({ ...draft, last_name: e.target.value })}
              className="text-xl font-black text-foreground bg-transparent border-b border-border outline-none flex-1" placeholder="Achternaam" />
          </div>
        ) : (
          <h1 className="text-xl font-black text-foreground">{d?.first_name} {d?.last_name}</h1>
        )}

        <div className="flex items-center gap-2 text-sm text-foreground-subtle mt-1">
          {d?.city && <><MapPin size={12} /> {d.city}</>}
          {d?.rating_avg > 0 && <><Star size={12} fill="#EF476F" style={{ color: "#EF476F" }} /> {Number(d.rating_avg).toFixed(1)}</>}
        </div>

        {saved && <div className="mt-3 p-2 rounded-lg text-xs font-semibold text-center" style={{ background: "rgba(167,218,220,0.12)", color: "#0e8a8d" }}><Check size={12} className="inline mr-1" />Opgeslagen</div>}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
          {[
            { val: d?.total_shifts || 0, label: "Shifts", icon: <CalendarDays size={14} /> },
            { val: `${Number(d?.total_hours || 0).toFixed(0)}u`, label: "Uren", icon: <Clock size={14} /> },
            { val: Number(d?.rating_avg || 0).toFixed(1), label: "Rating", icon: <Star size={14} /> },
          ].map((s, i) => (
            <div key={i} className="bg-surface rounded-xl p-3 border border-border text-center">
              <div className="text-lg font-black text-foreground">{s.val}</div>
              <div className="text-xs text-foreground-subtle">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Editable fields */}
        <div className="bg-surface rounded-xl border border-border divide-y divide-border mb-6">
          {[
            { label: "Stad", key: "city", icon: <MapPin size={14} />, placeholder: "Rotterdam" },
            { label: "Telefoon", key: "phone", icon: <Phone size={14} />, placeholder: "+31 6 12345678" },
            { label: "E-mail", key: "email", icon: <User size={14} />, placeholder: "", readonly: true },
            { label: "IBAN", key: "iban", icon: <CreditCard size={14} />, placeholder: "NL91ABNA0417164300" },
            { label: "BTW-nummer", key: "btw_number", icon: <Hash size={14} />, placeholder: "NL123456789B01" },
            { label: "KVK-nummer", key: "kvk_number", icon: <Hash size={14} />, placeholder: "12345678" },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <span className="text-foreground-subtle">{f.icon}</span>
                <span className="text-xs text-foreground-subtle">{f.label}</span>
              </div>
              {editing && !f.readonly ? (
                <input value={d?.[f.key] || ""} onChange={e => setDraft({ ...draft, [f.key]: e.target.value })}
                  placeholder={f.placeholder} className={input} style={{ maxWidth: 200 }} />
              ) : (
                <span className="text-sm font-medium text-foreground">{d?.[f.key] || "Niet ingesteld"}</span>
              )}
            </div>
          ))}

          {/* Payout preference */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-foreground-subtle" />
              <span className="text-xs text-foreground-subtle">Betaalvoorkeur</span>
            </div>
            {editing ? (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setDraft({ ...draft, payout_preference: "fast" })}
                  className="p-3 rounded-xl border text-left transition-all"
                  style={{ background: draft?.payout_preference === "fast" ? "rgba(239,71,111,0.06)" : "transparent", borderColor: draft?.payout_preference === "fast" ? "#EF476F" : "var(--color-border)" }}>
                  <div className="text-xs font-bold" style={{ color: draft?.payout_preference === "fast" ? "#EF476F" : "var(--color-foreground)" }}>Snel (5 dagen)</div>
                  <div className="text-xs text-foreground-subtle mt-0.5">€0,75/uur fee</div>
                </button>
                <button onClick={() => setDraft({ ...draft, payout_preference: "normal" })}
                  className="p-3 rounded-xl border text-left transition-all"
                  style={{ background: draft?.payout_preference === "normal" ? "rgba(167,218,220,0.1)" : "transparent", borderColor: draft?.payout_preference === "normal" ? "#A7DADC" : "var(--color-border)" }}>
                  <div className="text-xs font-bold" style={{ color: draft?.payout_preference === "normal" ? "#0e8a8d" : "var(--color-foreground)" }}>Normaal</div>
                  <div className="text-xs text-foreground-subtle mt-0.5">Geen extra kosten</div>
                </button>
              </div>
            ) : (
              <span className="text-sm font-medium text-foreground">{d?.payout_preference === "fast" ? "Snel (5 dagen) — €0,75/uur" : "Normaal — gratis"}</span>
            )}
          </div>
        </div>

        {/* Sectors */}
        {d?.sectors?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-foreground-subtle mb-2">Sectoren</p>
            <div className="flex flex-wrap gap-2">
              {d.sectors.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold border border-border text-foreground-muted capitalize">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        {editing && (
          <button onClick={handleSave} disabled={saving}
            className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 mb-6"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Opslaan</>}
          </button>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-sm font-bold" style={{ color: "#EF476F" }}>
          <LogOut size={16} /> Uitloggen
        </button>
      </div>
    </div>
  );
}
