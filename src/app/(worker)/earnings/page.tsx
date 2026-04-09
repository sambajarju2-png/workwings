"use client";
import { useState, useEffect } from "react";
import { Loader2, TrendingUp, FileText, Download, Clock, CheckCircle, Zap } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function EarningsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("invoices").select("*, shifts(title, date, companies(name))")
        .eq("worker_id", user.id).order("created_at", { ascending: false });
      setInvoices(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 flex justify-center pt-20"><Loader2 size={24} className="animate-spin text-foreground-subtle" /></div>;

  const totalEarned = invoices.filter(i => i.worker_payout_status === "paid").reduce((s, i) => s + Number(i.net_amount), 0);
  const totalPending = invoices.filter(i => i.worker_payout_status !== "paid").reduce((s, i) => s + Number(i.net_amount), 0);
  const fmt = (n: number) => `€${n.toFixed(2).replace(".", ",")}`;

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-black text-foreground mb-4">Verdiensten</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-foreground-subtle mb-1"><TrendingUp size={14} /><span className="text-xs">Ontvangen</span></div>
          <div className="text-xl font-black" style={{ color: "#0e8a8d" }}>{fmt(totalEarned)}</div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-foreground-subtle mb-1"><Clock size={14} /><span className="text-xs">In afwachting</span></div>
          <div className="text-xl font-black" style={{ color: "#EF476F" }}>{fmt(totalPending)}</div>
        </div>
      </div>

      <h2 className="text-sm font-bold text-foreground mb-3">Facturen</h2>
      {invoices.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center"><p className="text-sm text-foreground-subtle">Nog geen facturen</p></div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv: any) => (
            <div key={inv.id} className="bg-surface rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-foreground">{inv.shifts?.companies?.name}</div>
                  <div className="text-xs text-foreground-subtle">{inv.shifts?.title} — {inv.shifts?.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: inv.worker_payout_status === "paid" ? "#0e8a8d" : "#EF476F" }}>{fmt(Number(inv.net_amount))}</div>
                  <div className="flex items-center gap-1 text-xs text-foreground-subtle">
                    {inv.payout_type === "fast" && <Zap size={10} style={{ color: "#EF476F" }} />}
                    {inv.worker_payout_status === "paid" ? <><CheckCircle size={10} style={{ color: "#0e8a8d" }} /> Betaald</> : <><Clock size={10} /> {inv.worker_payout_status}</>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground-subtle">
                <span>{inv.hours_worked}u × {fmt(Number(inv.rate_per_hour))}/u{inv.fast_payout_fee > 0 ? ` — ${fmt(Number(inv.fast_payout_fee))} snelle betaling fee` : ""}</span>
                <a href={`/api/invoices/${inv.id}/pdf?type=freelancer`} target="_blank" className="flex items-center gap-1 font-semibold" style={{ color: "#EF476F" }}>
                  <Download size={12} /> PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
