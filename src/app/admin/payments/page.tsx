"use client";
import { useState, useEffect } from "react";
import { Loader2, FileText, CreditCard, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminPaymentsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: m } = await supabase.from("company_members").select("company_id").eq("user_id", user.id).single();
      if (!m) { setLoading(false); return; }
      setCompanyId(m.company_id);

      const { data } = await supabase.from("invoices")
        .select("*, workers(first_name, last_name), shifts(title, date)")
        .eq("company_id", m.company_id).order("created_at", { ascending: false });
      setInvoices(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const unpaid = invoices.filter(i => i.company_payment_status === "unpaid");
  const paid = invoices.filter(i => i.company_payment_status === "paid");
  const unpaidTotal = unpaid.reduce((sum, i) => sum + Number(i.amount), 0);

  async function handlePay() {
    if (!unpaid.length) return;
    setPaying(true);
    const res = await fetch("/api/merchant/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_id: companyId, invoice_ids: unpaid.map(i => i.id) }),
    });
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
    setPaying(false);
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const fmt = (n: number) => `€${n.toFixed(2).replace(".", ",")}`;

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <h1 className="text-2xl font-black mb-6" style={{ color: "#023047" }}>Betalingen</h1>

      {/* Unpaid banner */}
      {unpaid.length > 0 && (
        <div className="bg-white rounded-xl border p-5 mb-6 flex items-center justify-between" style={{ borderColor: "#E8EDF2" }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: "#023047" }}>{unpaid.length} openstaande facturen</div>
            <div className="text-2xl font-black mt-1" style={{ color: "#EF476F" }}>{fmt(unpaidTotal)}</div>
          </div>
          <button onClick={handlePay} disabled={paying}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
            {paying ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            Nu betalen via iDEAL
          </button>
        </div>
      )}

      {/* Invoices table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
        <div className="px-5 py-3 border-b font-semibold text-sm" style={{ borderColor: "#F0F4F8", color: "#023047" }}>Facturen</div>
        {invoices.length === 0 ? (
          <div className="p-8 text-center"><p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen facturen</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
              {["Factuur", "Werknemer", "Shift", "Bedrag", "Status", "PDF"].map(h =>
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
              )}
            </tr></thead>
            <tbody>{invoices.map((inv: any) => (
              <tr key={inv.id} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "#023047" }}>WW-{inv.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.workers?.first_name} {inv.workers?.last_name}</td>
                <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.shifts?.title} ({inv.shifts?.date})</td>
                <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{fmt(Number(inv.amount))}</td>
                <td className="px-4 py-3">
                  {inv.company_payment_status === "paid" ?
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#0e8a8d" }}><CheckCircle size={12} /> Betaald</span> :
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#EF476F" }}><Clock size={12} /> Open</span>}
                </td>
                <td className="px-4 py-3">
                  <a href={`/api/invoices/${inv.id}/pdf?type=company`} target="_blank" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#EF476F" }}>
                    <FileText size={12} /> PDF
                  </a>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
