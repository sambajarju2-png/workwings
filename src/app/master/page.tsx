"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, DollarSign, Users, Building2, CalendarDays, FileText, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle, Loader2, Download, RefreshCw } from "lucide-react";
import Link from "next/link";

interface MasterData {
  stats: {
    total_invoices: number; total_workers: number; total_companies: number;
    total_shifts: number; total_applications: number;
    total_revenue: number; total_paid_out: number; total_company_payments: number;
  };
  invoices: any[]; payouts: any[]; company_payments: any[];
  shifts: any[]; workers: any[]; companies: any[]; applications: any[];
}

const fmt = (n: number) => `€${n.toFixed(2).replace(".", ",")}`;

export default function MasterAdminPage() {
  const [data, setData] = useState<MasterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "invoices" | "payouts" | "shifts" | "workers" | "companies">("overview");

  function load() {
    setLoading(true);
    fetch("/api/master").then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F9FC" }}>
      <Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} />
    </div>
  );

  if (!data) return <div className="p-10 text-center" style={{ color: "#8BA3B5" }}>Failed to load data</div>;

  const { stats } = data;

  const tabs = [
    { key: "overview", label: "Overzicht" },
    { key: "invoices", label: `Facturen (${stats.total_invoices})` },
    { key: "payouts", label: `Uitbetalingen` },
    { key: "shifts", label: `Shifts (${stats.total_shifts})` },
    { key: "workers", label: `Werkers (${stats.total_workers})` },
    { key: "companies", label: `Bedrijven (${stats.total_companies})` },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: "#F7F9FC" }}>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "#E8EDF2" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#023047" }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-black" style={{ color: "#023047" }}>WorkWings Master Admin</h1>
            <p className="text-xs" style={{ color: "#8BA3B5" }}>sambajarju2@gmail.com · Superadmin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-2 rounded-lg border" style={{ borderColor: "#E8EDF2" }}><RefreshCw size={16} style={{ color: "#8BA3B5" }} /></button>
          <Link href="/admin" className="text-xs font-semibold px-4 py-2 rounded-lg border" style={{ borderColor: "#E8EDF2", color: "#4A6B7F" }}>Company Admin</Link>
          <Link href="/" className="text-xs font-semibold px-4 py-2 rounded-lg text-white" style={{ background: "#EF476F" }}>Website</Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 bg-white border-b flex gap-1 overflow-x-auto" style={{ borderColor: "#E8EDF2" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-3 text-sm font-semibold whitespace-nowrap relative"
            style={{ color: tab === t.key ? "#EF476F" : "#8BA3B5" }}>
            {t.label}
            {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#EF476F" }} />}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Omzet (fees)", val: fmt(stats.total_revenue), icon: <DollarSign size={18} />, color: "#EF476F" },
                { label: "Uitbetaald", val: fmt(stats.total_paid_out), icon: <ArrowUpRight size={18} />, color: "#A7DADC" },
                { label: "Ontvangen", val: fmt(stats.total_company_payments), icon: <ArrowDownRight size={18} />, color: "#0e8a8d" },
                { label: "Facturen", val: stats.total_invoices.toString(), icon: <FileText size={18} />, color: "#023047" },
                { label: "Shifts", val: stats.total_shifts.toString(), icon: <CalendarDays size={18} />, color: "#EF476F" },
                { label: "Werkers", val: stats.total_workers.toString(), icon: <Users size={18} />, color: "#A7DADC" },
                { label: "Bedrijven", val: stats.total_companies.toString(), icon: <Building2 size={18} />, color: "#023047" },
                { label: "Sollicitaties", val: stats.total_applications.toString(), icon: <Clock size={18} />, color: "#EF476F" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white p-5 rounded-xl border" style={{ borderColor: "#E8EDF2" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{s.label}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}10`, color: s.color }}>{s.icon}</div>
                  </div>
                  <div className="text-2xl font-black" style={{ color: "#023047" }}>{s.val}</div>
                </motion.div>
              ))}
            </div>

            {/* Recent payouts */}
            <div className="bg-white rounded-xl border" style={{ borderColor: "#E8EDF2" }}>
              <div className="px-5 py-3 border-b font-semibold text-sm" style={{ borderColor: "#F0F4F8", color: "#023047" }}>Recente Uitbetalingen</div>
              {data.payouts.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: "#8BA3B5" }}>Nog geen uitbetalingen</div>
              ) : data.payouts.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#023047" }}>{p.workers?.first_name} {p.workers?.last_name}</div>
                    <div className="text-xs" style={{ color: "#8BA3B5" }}>{p.method} · {p.revolut_payment_id?.slice(0, 8) || "sim"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: p.status === "completed" || p.status === "processing" ? "#0e8a8d" : "#EF476F" }}>
                      {fmt(Number(p.amount))}
                    </div>
                    <div className="text-xs" style={{ color: "#8BA3B5" }}>{p.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoices */}
        {tab === "invoices" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                    {["Factuur", "Werker", "Bedrijf", "Shift", "Uren", "Bedrag", "Fee", "Netto", "Type", "Bedrijf betaald", "Werker betaald", "PDF"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv, i) => (
                    <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#023047" }}>WW-{inv.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.workers?.first_name} {inv.workers?.last_name}</td>
                      <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.companies?.name}</td>
                      <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.shifts?.title}</td>
                      <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{inv.hours_worked || "-"}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{fmt(Number(inv.amount))}</td>
                      <td className="px-4 py-3" style={{ color: "#8BA3B5" }}>{fmt(Number(inv.fee))}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#0e8a8d" }}>{fmt(Number(inv.net_amount))}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: inv.payout_type === "fast" ? "rgba(239,71,111,0.08)" : "rgba(167,218,220,0.1)", color: inv.payout_type === "fast" ? "#EF476F" : "#0e8a8d" }}>
                          {inv.payout_type === "fast" ? "Fast" : "Normaal"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {inv.company_payment_status === "paid" ? <CheckCircle size={14} style={{ color: "#0e8a8d" }} /> : <AlertCircle size={14} style={{ color: "#EF476F" }} />}
                      </td>
                      <td className="px-4 py-3">
                        {inv.worker_payout_status === "paid" ? <CheckCircle size={14} style={{ color: "#0e8a8d" }} /> : <Clock size={14} style={{ color: "#8BA3B5" }} />}
                      </td>
                      <td className="px-4 py-3">
                        <a href={`/api/invoices/${inv.id}/pdf?type=freelancer`} target="_blank" className="text-xs font-semibold" style={{ color: "#EF476F" }}>
                          <Download size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shifts */}
        {tab === "shifts" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                  {["Titel", "Bedrijf", "Stad", "Datum", "Tarief", "Nodig", "Gevuld", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.shifts.map((s, i) => (
                  <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{s.title}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{s.companies?.name}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{s.locations?.city}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{s.date}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{fmt(Number(s.rate_per_hour))}/uur</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{s.workers_needed}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{s.workers_filled}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: s.status === "open" ? "rgba(239,71,111,0.08)" : "rgba(167,218,220,0.1)", color: s.status === "open" ? "#EF476F" : "#0e8a8d" }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Workers */}
        {tab === "workers" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                  {["Naam", "Email", "Telefoon", "Stad", "IBAN", "Status", "Betaalvoorkeur", "Shifts", "Rating"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.workers.map((w, i) => (
                  <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{w.first_name} {w.last_name}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{w.email || "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4A6B7F" }}>{w.phone}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{w.city || "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4A6B7F" }}>{w.iban ? `${w.iban.slice(0, 8)}...` : "-"}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: w.status === "active" ? "rgba(167,218,220,0.1)" : "#F0F4F8", color: w.status === "active" ? "#0e8a8d" : "#8BA3B5" }}>{w.status}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold" style={{ color: w.payout_preference === "fast" ? "#EF476F" : "#4A6B7F" }}>{w.payout_preference}</span></td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{w.total_shifts}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{Number(w.rating_avg).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Companies */}
        {tab === "companies" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                  {["Bedrijf", "KVK", "Email", "Plan", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.companies.map((c, i) => (
                  <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{c.name}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4A6B7F" }}>{c.kvk_number}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{c.contact_email}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#F0F4F8", color: "#4A6B7F" }}>{c.plan}</span></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(167,218,220,0.1)", color: "#0e8a8d" }}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payouts */}
        {tab === "payouts" && (
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                  {["Werker", "Bedrag", "Methode", "Type", "IBAN", "Revolut ID", "Status", "Datum"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.payouts.map((p, i) => (
                  <tr key={i} className="border-b last:border-b-0" style={{ borderColor: "#F0F4F8" }}>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#023047" }}>{p.workers?.first_name} {p.workers?.last_name}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: "#0e8a8d" }}>{fmt(Number(p.amount))}</td>
                    <td className="px-4 py-3" style={{ color: "#4A6B7F" }}>{p.method}</td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold" style={{ color: p.payout_type === "fast" ? "#EF476F" : "#4A6B7F" }}>{p.payout_type}</span></td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4A6B7F" }}>{p.worker_iban ? `${p.worker_iban.slice(0, 12)}...` : "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "#4A6B7F" }}>{p.revolut_payment_id?.slice(0, 12) || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: p.status === "completed" || p.status === "processing" ? "rgba(167,218,220,0.1)" : "rgba(239,71,111,0.08)", color: p.status === "completed" || p.status === "processing" ? "#0e8a8d" : "#EF476F" }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#8BA3B5" }}>{p.executed_at ? new Date(p.executed_at).toLocaleDateString("nl-NL") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
