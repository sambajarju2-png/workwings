"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Clock, CheckCircle, CalendarPlus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const sc: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "rgba(239,71,111,0.08)", text: "#EF476F", label: "Open" },
  filled: { bg: "rgba(167,218,220,0.12)", text: "#0e8a8d", label: "Gevuld" },
  completed: { bg: "rgba(34,197,94,0.06)", text: "#22c55e", label: "Afgerond" },
  cancelled: { bg: "#F0F4F8", text: "#8BA3B5", label: "Geannuleerd" },
};

export default function AdminDashboard() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [stats, setStats] = useState({ open: 0, apps: 0, filled: 0, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Jouw bedrijf");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setLoading(false); return; }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get company
      const { data: membership } = await supabase.from("company_members").select("company_id, companies(name)").eq("user_id", user.id).single();
      const companyId = membership?.company_id;
      if (membership?.companies) setCompanyName((membership.companies as any).name);

      if (!companyId) { setLoading(false); return; }

      // Get shifts
      const { data: shiftsData } = await supabase.from("shifts").select("*, locations(city)")
        .eq("company_id", companyId).order("date", { ascending: false }).limit(10);

      // Get applications count
      const { count: appsCount } = await supabase.from("applications")
        .select("*", { count: "exact", head: true })
        .in("shift_id", (shiftsData || []).map((s: any) => s.id));

      // Get invoices total
      const { data: invoices } = await supabase.from("invoices").select("amount").eq("company_id", companyId);
      const totalSpent = (invoices || []).reduce((sum: number, i: any) => sum + Number(i.amount), 0);

      const openShifts = (shiftsData || []).filter((s: any) => s.status === "open").length;
      const filledPct = shiftsData?.length ? Math.round(((shiftsData.filter((s: any) => s.workers_filled >= s.workers_needed).length) / shiftsData.length) * 100) : 0;

      setShifts(shiftsData || []);
      setStats({ open: openShifts, apps: appsCount || 0, filled: filledPct, spent: totalSpent });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><Loader2 size={24} className="animate-spin" style={{ color: "#8BA3B5" }} /></div>;

  const statCards = [
    { label: "Open Shifts", val: String(stats.open), icon: <Clock size={18} />, color: "#EF476F", bg: "rgba(239,71,111,0.06)" },
    { label: "Sollicitaties", val: String(stats.apps), icon: <Users size={18} />, color: "#A7DADC", bg: "rgba(167,218,220,0.1)" },
    { label: "Gevuld %", val: `${stats.filled}%`, icon: <CheckCircle size={18} />, color: "#22c55e", bg: "rgba(34,197,94,0.06)" },
    { label: "Uitgegeven", val: `€${stats.spent.toFixed(0)}`, icon: <TrendingUp size={18} />, color: "#EF476F", bg: "rgba(239,71,111,0.06)" },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#023047" }}>Dashboard</h1>
          <p className="text-sm" style={{ color: "#8BA3B5" }}>{companyName}</p>
        </div>
        <Link href="/admin/shifts/new" className="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #EF476F, #D93A5E)" }}>
          <CalendarPlus size={16} /> Nieuwe Shift
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-xl border" style={{ borderColor: "#E8EDF2" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: "#8BA3B5" }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
            <div className="text-2xl font-black" style={{ color: "#023047" }}>{s.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Shifts table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E8EDF2" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "#F0F4F8" }}>
          <h2 className="font-semibold text-sm" style={{ color: "#023047" }}>Recente Shifts</h2>
          <Link href="/admin/shifts" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#EF476F" }}>
            Alles bekijken <ArrowRight size={12} />
          </Link>
        </div>
        {shifts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm" style={{ color: "#8BA3B5" }}>Nog geen shifts geplaatst</p>
            <Link href="/admin/shifts/new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-white font-bold text-sm"
              style={{ background: "#EF476F" }}>
              <CalendarPlus size={16} /> Eerste shift plaatsen
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#F0F4F8" }}>
                {["Titel", "Datum", "Stad", "Tarief", "Gevuld", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#8BA3B5" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((s, i) => (
                <tr key={i} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: "#F0F4F8" }}
                  onClick={() => window.location.href = `/admin/shifts/${s.id}`}>
                  <td className="px-5 py-3 font-semibold" style={{ color: "#023047" }}>{s.title}</td>
                  <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{new Date(s.date + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}</td>
                  <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{s.locations?.city || "-"}</td>
                  <td className="px-5 py-3 font-semibold" style={{ color: "#023047" }}>€{Number(s.rate_per_hour).toFixed(0)}/uur</td>
                  <td className="px-5 py-3" style={{ color: "#4A6B7F" }}>{s.workers_filled}/{s.workers_needed}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: sc[s.status]?.bg || "#F0F4F8", color: sc[s.status]?.text || "#8BA3B5" }}>
                      {sc[s.status]?.label || s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
